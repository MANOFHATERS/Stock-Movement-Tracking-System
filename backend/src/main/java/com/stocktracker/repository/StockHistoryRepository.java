package com.stocktracker.repository;

import com.stocktracker.model.StockHistory;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface StockHistoryRepository extends MongoRepository<StockHistory, String> {
    List<StockHistory> findByProductIdOrderByCreatedAtAsc(String productId);
    List<StockHistory> findByProductIdOrderByCreatedAtDesc(String productId);
    List<StockHistory> findByReferenceId(String referenceId);
    List<StockHistory> findByChangeType(String changeType);
}
