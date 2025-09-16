package com.example.market.secondhandshop.repository;

import com.example.market.secondhandshop.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

/**
 * 사용자 데이터 접근을 위한 Repository 인터페이스
 * 
 * Spring Data JPA의 쿼리 메서드 기능을 활용:
 * - findByUsername: username 필드로 사용자 조회
 * - findByEmail: email 필드로 사용자 조회
 */
public interface UserRepository extends JpaRepository<User, Long> {

    // 사용자명으로 사용자 조회 (로그인 시 사용)
    Optional<User> findByUsername(String username);
    
    // 이메일로 사용자 조회 (중복 가입 방지)
    Optional<User> findByEmail(String email);
}