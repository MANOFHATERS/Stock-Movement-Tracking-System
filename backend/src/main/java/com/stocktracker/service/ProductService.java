package com.stocktracker.service;

import com.stocktracker.model.Product;
import com.stocktracker.model.StockHistory;
import com.stocktracker.repository.ProductRepository;
import com.stocktracker.repository.StockHistoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ProductService {
    
    private final ProductRepository productRepository;
    private final StockHistoryRepository stockHistoryRepository;
    
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }
    
    public Optional<Product> getProductById(String productId) {
        return productRepository.findById(productId);
    }
    
    public Product createProduct(Product product) {
        if (product.getAvailableQuantity() == null) {
            product.setAvailableQuantity(0);
        }
        Product savedProduct = productRepository.save(product);
        
        // Record initial stock entry
        if (savedProduct.getAvailableQuantity() > 0) {
            StockHistory history = StockHistory.builder()
                    .productId(savedProduct.getProductId())
                    .productName(savedProduct.getName())
                    .changeType("INITIAL_STOCK")
                    .quantityChanged(savedProduct.getAvailableQuantity())
                    .previousQuantity(0)
                    .newQuantity(savedProduct.getAvailableQuantity())
                    .description("Initial stock entry")
                    .createdAt(LocalDateTime.now())
                    .build();
            stockHistoryRepository.save(history);
        }
        
        return savedProduct;
    }
    
    public Product updateProduct(String productId, Product productDetails) {
        return productRepository.findById(productId)
                .map(product -> {
                    if (productDetails.getName() != null) {
                        product.setName(productDetails.getName());
                    }
                    if (productDetails.getDescription() != null) {
                        product.setDescription(productDetails.getDescription());
                    }
                    if (productDetails.getCategory() != null) {
                        product.setCategory(productDetails.getCategory());
                    }
                    if (productDetails.getPrice() != null) {
                        product.setPrice(productDetails.getPrice());
                    }
                    if (productDetails.getImageUrl() != null) {
                        product.setImageUrl(productDetails.getImageUrl());
                    }
                    return productRepository.save(product);
                })
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + productId));
    }
    
    public Product updateStock(String productId, Integer quantity, String changeType, String referenceId, String description) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + productId));
        
        int previousQuantity = product.getAvailableQuantity();
        int newQuantity = previousQuantity + quantity;
        
        if (newQuantity < 0) {
            throw new RuntimeException("Insufficient stock. Available: " + previousQuantity + ", Requested: " + Math.abs(quantity));
        }
        
        product.setAvailableQuantity(newQuantity);
        Product savedProduct = productRepository.save(product);
        
        // Record stock history
        StockHistory history = StockHistory.builder()
                .productId(productId)
                .productName(product.getName())
                .changeType(changeType)
                .quantityChanged(quantity)
                .previousQuantity(previousQuantity)
                .newQuantity(newQuantity)
                .referenceId(referenceId)
                .description(description)
                .createdAt(LocalDateTime.now())
                .build();
        stockHistoryRepository.save(history);
        
        return savedProduct;
    }
    
    public List<StockHistory> getStockHistory(String productId) {
        return stockHistoryRepository.findByProductIdOrderByCreatedAtAsc(productId);
    }
    
    public void deleteProduct(String productId) {
        productRepository.deleteById(productId);
    }
    
    public List<Product> searchProducts(String name) {
        return productRepository.findByNameContainingIgnoreCase(name);
    }
    
    public List<Product> getLowStockProducts(Integer threshold) {
        return productRepository.findByAvailableQuantityLessThan(threshold);
    }
}
