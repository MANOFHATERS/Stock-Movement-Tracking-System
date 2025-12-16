package com.stocktracker.config;

import com.stocktracker.model.*;
import com.stocktracker.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataSeeder implements CommandLineRunner {

    private final ProductRepository productRepository;
    private final OrderRepository orderRepository;
    private final StockHistoryRepository stockHistoryRepository;

    @Override
    public void run(String... args) {
        // Only seed if database is empty
        if (productRepository.count() > 0) {
            log.info("Database already has data, skipping seed...");
            return;
        }

        log.info("Seeding database with sample data...");
        seedProducts();
        log.info("Database seeding completed!");
    }

    private void seedProducts() {
        List<Product> products = Arrays.asList(
            createProduct("iPhone 15 Pro", "Latest Apple flagship smartphone", "Electronics", 50, 999.99),
            createProduct("MacBook Air M3", "Ultra-thin laptop with M3 chip", "Electronics", 30, 1299.99),
            createProduct("Samsung Galaxy S24", "Premium Android smartphone", "Electronics", 75, 849.99),
            createProduct("Sony WH-1000XM5", "Noise-cancelling headphones", "Electronics", 100, 349.99),
            createProduct("iPad Pro 12.9", "Professional tablet", "Electronics", 40, 1099.99),
            createProduct("Nike Air Max 270", "Running shoes", "Footwear", 200, 149.99),
            createProduct("Adidas Ultraboost", "Premium running shoes", "Footwear", 150, 179.99),
            createProduct("Levi's 501 Jeans", "Classic denim", "Clothing", 300, 89.99),
            createProduct("North Face Jacket", "Winter jacket", "Clothing", 80, 249.99),
            createProduct("Canon EOS R6", "Mirrorless camera", "Photography", 25, 2499.99),
            createProduct("GoPro Hero 12", "Action camera", "Photography", 60, 399.99),
            createProduct("Dyson V15", "Cordless vacuum", "Home", 45, 749.99),
            createProduct("Instant Pot Pro", "Pressure cooker", "Kitchen", 120, 149.99),
            createProduct("KitchenAid Mixer", "Stand mixer", "Kitchen", 35, 449.99),
            createProduct("Herman Miller Chair", "Ergonomic chair", "Furniture", 20, 1395.00)
        );

        productRepository.saveAll(products);
        
        // Create stock history for initial stock
        for (Product product : products) {
            StockHistory history = new StockHistory();
            history.setProductId(product.getProductId());
            history.setProductName(product.getName());
            history.setChangeType("INITIAL_STOCK");
            history.setQuantityChanged(product.getAvailableQuantity());
            history.setPreviousQuantity(0);
            history.setNewQuantity(product.getAvailableQuantity());
            history.setDescription("Initial stock added to inventory");
            history.setCreatedAt(LocalDateTime.now().minusDays(30));
            stockHistoryRepository.save(history);
        }
        
        log.info("Created {} sample products with stock history", products.size());
        
        // Simulate some stock movements
        simulateStockMovements(products);
    }
    
    private void simulateStockMovements(List<Product> products) {
        // Simulate restocks for some products
        restockProduct(products.get(0), 25, "Bulk order from Apple supplier", 20);
        restockProduct(products.get(1), 15, "New shipment arrived", 18);
        restockProduct(products.get(3), 50, "Holiday season stock up", 15);
        restockProduct(products.get(5), 100, "Summer collection restock", 10);
        
        // Simulate some orders reducing stock
        simulateOrder(products.get(0), 10, 5);
        simulateOrder(products.get(2), 20, 8);
        simulateOrder(products.get(4), 5, 12);
        simulateOrder(products.get(6), 30, 3);
        simulateOrder(products.get(8), 15, 7);
        
        // Simulate a cancelled order
        simulateCancelledOrder(products.get(1), 5, 2);
    }
    
    private void restockProduct(Product product, int quantity, String description, int daysAgo) {
        int previousQty = product.getAvailableQuantity();
        product.setAvailableQuantity(previousQty + quantity);
        productRepository.save(product);
        
        StockHistory history = new StockHistory();
        history.setProductId(product.getProductId());
        history.setProductName(product.getName());
        history.setChangeType("RESTOCK");
        history.setQuantityChanged(quantity);
        history.setPreviousQuantity(previousQty);
        history.setNewQuantity(product.getAvailableQuantity());
        history.setDescription(description);
        history.setCreatedAt(LocalDateTime.now().minusDays(daysAgo));
        stockHistoryRepository.save(history);
    }
    
    private void simulateOrder(Product product, int quantity, int daysAgo) {
        int previousQty = product.getAvailableQuantity();
        product.setAvailableQuantity(previousQty - quantity);
        productRepository.save(product);
        
        // Create order
        Order order = new Order();
        order.setStatus("COMPLETED");
        order.setCreatedAt(LocalDateTime.now().minusDays(daysAgo));
        order.setUpdatedAt(LocalDateTime.now().minusDays(daysAgo));
        order.setTotalAmount(product.getPrice() * quantity);
        order.setUserId("seed-user");
        order.setUserEmail("demo@stocktracker.com");
        
        OrderItem item = new OrderItem();
        item.setProductId(product.getProductId());
        item.setProductName(product.getName());
        item.setQuantity(quantity);
        item.setPrice(product.getPrice());
        order.setItems(Arrays.asList(item));
        
        Order savedOrder = orderRepository.save(order);
        
        // Stock history
        StockHistory history = new StockHistory();
        history.setProductId(product.getProductId());
        history.setProductName(product.getName());
        history.setChangeType("ORDER");
        history.setQuantityChanged(-quantity);
        history.setPreviousQuantity(previousQty);
        history.setNewQuantity(product.getAvailableQuantity());
        history.setReferenceId(savedOrder.getOrderId());
        history.setDescription("Order placed for " + quantity + " units");
        history.setCreatedAt(LocalDateTime.now().minusDays(daysAgo));
        stockHistoryRepository.save(history);
    }
    
    private void simulateCancelledOrder(Product product, int quantity, int daysAgo) {
        int previousQty = product.getAvailableQuantity();
        
        // Create cancelled order
        Order order = new Order();
        order.setStatus("CANCELLED");
        order.setCreatedAt(LocalDateTime.now().minusDays(daysAgo + 1));
        order.setUpdatedAt(LocalDateTime.now().minusDays(daysAgo));
        order.setTotalAmount(product.getPrice() * quantity);
        order.setUserId("seed-user");
        order.setUserEmail("demo@stocktracker.com");
        
        OrderItem item = new OrderItem();
        item.setProductId(product.getProductId());
        item.setProductName(product.getName());
        item.setQuantity(quantity);
        item.setPrice(product.getPrice());
        order.setItems(Arrays.asList(item));
        
        Order savedOrder = orderRepository.save(order);
        
        // Order history (reduction)
        StockHistory orderHistory = new StockHistory();
        orderHistory.setProductId(product.getProductId());
        orderHistory.setProductName(product.getName());
        orderHistory.setChangeType("ORDER");
        orderHistory.setQuantityChanged(-quantity);
        orderHistory.setPreviousQuantity(previousQty);
        orderHistory.setNewQuantity(previousQty - quantity);
        orderHistory.setReferenceId(savedOrder.getOrderId());
        orderHistory.setDescription("Order placed for " + quantity + " units");
        orderHistory.setCreatedAt(LocalDateTime.now().minusDays(daysAgo + 1));
        stockHistoryRepository.save(orderHistory);
        
        // Cancel history (restoration)
        StockHistory cancelHistory = new StockHistory();
        cancelHistory.setProductId(product.getProductId());
        cancelHistory.setProductName(product.getName());
        cancelHistory.setChangeType("CANCEL");
        cancelHistory.setQuantityChanged(quantity);
        cancelHistory.setPreviousQuantity(previousQty - quantity);
        cancelHistory.setNewQuantity(previousQty);
        cancelHistory.setReferenceId(savedOrder.getOrderId());
        cancelHistory.setDescription("Order cancelled - stock restored");
        cancelHistory.setCreatedAt(LocalDateTime.now().minusDays(daysAgo));
        stockHistoryRepository.save(cancelHistory);
    }

    private Product createProduct(String name, String description, String category, int quantity, double price) {
        Product product = new Product();
        product.setName(name);
        product.setDescription(description);
        product.setCategory(category);
        product.setAvailableQuantity(quantity);
        product.setPrice(price);
        return product;
    }
}
