package com.stocktracker.service;

import com.stocktracker.model.Order;
import com.stocktracker.model.OrderItem;
import com.stocktracker.model.Product;
import com.stocktracker.repository.OrderRepository;
import com.stocktracker.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class OrderService {
    
    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final ProductService productService;
    
    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }
    
    public Optional<Order> getOrderById(String orderId) {
        return orderRepository.findById(orderId);
    }
    
    public List<Order> getOrdersByStatus(String status) {
        return orderRepository.findByStatusOrderByCreatedAtDesc(status);
    }
    
    public List<Order> getOrdersByUser(String userId) {
        return orderRepository.findByUserId(userId);
    }
    
    @Transactional
    public Order createOrder(Order order) {
        // Validate and process each item
        double totalAmount = 0.0;
        
        for (OrderItem item : order.getItems()) {
            Product product = productRepository.findById(item.getProductId())
                    .orElseThrow(() -> new RuntimeException("Product not found: " + item.getProductId()));
            
            if (product.getAvailableQuantity() < item.getQuantity()) {
                throw new RuntimeException("Insufficient stock for product: " + product.getName() + 
                        ". Available: " + product.getAvailableQuantity() + ", Requested: " + item.getQuantity());
            }
            
            // Set product details on order item
            item.setProductName(product.getName());
            item.setPrice(product.getPrice());
            
            if (product.getPrice() != null) {
                totalAmount += product.getPrice() * item.getQuantity();
            }
            
            // Reduce stock
            productService.updateStock(
                    item.getProductId(),
                    -item.getQuantity(),
                    "ORDER",
                    null, // Will be set after order is saved
                    "Stock reduced for order"
            );
        }
        
        order.setStatus("COMPLETED");
        order.setTotalAmount(totalAmount);
        order.setCreatedAt(LocalDateTime.now());
        order.setUpdatedAt(LocalDateTime.now());
        
        Order savedOrder = orderRepository.save(order);
        
        // Update stock history with order reference
        for (OrderItem item : order.getItems()) {
            productService.updateStock(
                    item.getProductId(),
                    0, // No additional change, just updating reference
                    "ORDER_REFERENCE",
                    savedOrder.getOrderId(),
                    "Order reference: " + savedOrder.getOrderId()
            );
        }
        
        return savedOrder;
    }
    
    @Transactional
    public Order cancelOrder(String orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found: " + orderId));
        
        if ("CANCELLED".equals(order.getStatus())) {
            throw new RuntimeException("Order is already cancelled");
        }
        
        // Restore stock for each item
        for (OrderItem item : order.getItems()) {
            productService.updateStock(
                    item.getProductId(),
                    item.getQuantity(), // Positive to restore
                    "CANCEL",
                    orderId,
                    "Stock restored due to order cancellation"
            );
        }
        
        order.setStatus("CANCELLED");
        order.setUpdatedAt(LocalDateTime.now());
        
        return orderRepository.save(order);
    }
    
    public void deleteOrder(String orderId) {
        orderRepository.deleteById(orderId);
    }
}
