package com.stocktracker.repository;

import com.stocktracker.model.Order;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface OrderRepository extends MongoRepository<Order, String> {
    List<Order> findByStatus(String status);
    List<Order> findByUserId(String userId);
    List<Order> findByUserEmail(String userEmail);
    List<Order> findByStatusOrderByCreatedAtDesc(String status);
}
