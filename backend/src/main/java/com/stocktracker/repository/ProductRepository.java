package com.stocktracker.repository;

import com.stocktracker.model.Product;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ProductRepository extends MongoRepository<Product, String> {
    List<Product> findByNameContainingIgnoreCase(String name);
    List<Product> findByCategory(String category);
    List<Product> findByAvailableQuantityGreaterThan(Integer quantity);
    List<Product> findByAvailableQuantityLessThan(Integer quantity);
}
