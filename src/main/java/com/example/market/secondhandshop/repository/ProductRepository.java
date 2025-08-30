package com.example.market.secondhandshop.repository;

import com.example.market.secondhandshop.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductRepository extends JpaRepository<Product, Long> {
}
