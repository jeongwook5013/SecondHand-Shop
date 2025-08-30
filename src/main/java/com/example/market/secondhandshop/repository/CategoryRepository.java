package com.example.market.secondhandshop.repository;

import com.example.market.secondhandshop.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoryRepository extends JpaRepository<Category,Long> {
}
