package com.example.market.secondhandshop.repository;

import com.example.market.secondhandshop.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    // Spring Data JPA의 쿼리 메서드 기능
    // 메서드 이름 규칙에 따라 쿼리를 자동으로 생성합니다.
    Optional<User> findByUsername(String username);
}