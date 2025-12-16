package com.stocktracker.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;
import java.util.List;

@Document(collection = "orders")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Order {
    
    @Id
    private String orderId;
    
    private String status; // PENDING, COMPLETED, CANCELLED
    
    private LocalDateTime createdAt;
    
    private LocalDateTime updatedAt;
    
    private List<OrderItem> items;
    
    private Double totalAmount;
    
    private String userId;
    
    private String userEmail;
}
