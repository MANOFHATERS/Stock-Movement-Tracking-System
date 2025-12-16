package com.stocktracker.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;
import java.time.LocalDateTime;

@Document(collection = "stock_history")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StockHistory {
    
    @Id
    private String id;
    
    @Indexed
    private String productId;
    
    private String productName;
    
    private String changeType; // ORDER, CANCEL, MANUAL_ADJUSTMENT, RESTOCK
    
    private Integer quantityChanged;
    
    private Integer previousQuantity;
    
    private Integer newQuantity;
    
    private String referenceId; // orderId or other reference
    
    private String description;
    
    private String userId;
    
    @Indexed
    private LocalDateTime createdAt;
}
