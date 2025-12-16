package com.stocktracker.controller;

import com.stocktracker.model.Product;
import com.stocktracker.model.StockHistory;
import com.stocktracker.service.ProductService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class ProductController {
    
    private final ProductService productService;
    
    @GetMapping
    public ResponseEntity<List<Product>> getAllProducts() {
        return ResponseEntity.ok(productService.getAllProducts());
    }
    
    @GetMapping("/{productId}")
    public ResponseEntity<Product> getProductById(@PathVariable String productId) {
        return productService.getProductById(productId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @PostMapping
    public ResponseEntity<Product> createProduct(@Valid @RequestBody Product product) {
        Product createdProduct = productService.createProduct(product);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdProduct);
    }
    
    @PutMapping("/{productId}")
    public ResponseEntity<Product> updateProduct(
            @PathVariable String productId,
            @RequestBody Product productDetails) {
        try {
            Product updatedProduct = productService.updateProduct(productId, productDetails);
            return ResponseEntity.ok(updatedProduct);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @DeleteMapping("/{productId}")
    public ResponseEntity<Void> deleteProduct(@PathVariable String productId) {
        productService.deleteProduct(productId);
        return ResponseEntity.noContent().build();
    }
    
    @GetMapping("/{productId}/stock-history")
    public ResponseEntity<List<StockHistory>> getStockHistory(@PathVariable String productId) {
        List<StockHistory> history = productService.getStockHistory(productId);
        return ResponseEntity.ok(history);
    }
    
    @PostMapping("/{productId}/restock")
    public ResponseEntity<?> restockProduct(
            @PathVariable String productId,
            @RequestBody Map<String, Object> request) {
        try {
            Integer quantity = (Integer) request.get("quantity");
            String description = (String) request.getOrDefault("description", "Manual restock");
            
            if (quantity == null || quantity <= 0) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "Quantity must be a positive number"));
            }
            
            Product updatedProduct = productService.updateStock(
                    productId,
                    quantity,
                    "RESTOCK",
                    null,
                    description
            );
            return ResponseEntity.ok(updatedProduct);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage()));
        }
    }
    
    @GetMapping("/search")
    public ResponseEntity<List<Product>> searchProducts(@RequestParam String name) {
        return ResponseEntity.ok(productService.searchProducts(name));
    }
    
    @GetMapping("/low-stock")
    public ResponseEntity<List<Product>> getLowStockProducts(
            @RequestParam(defaultValue = "10") Integer threshold) {
        return ResponseEntity.ok(productService.getLowStockProducts(threshold));
    }
}
