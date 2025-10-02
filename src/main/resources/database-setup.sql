-- MariaDB 데이터베이스 설정 스크립트
-- 이 스크립트를 MariaDB에서 실행하세요

-- 1. 데이터베이스 생성
CREATE DATABASE IF NOT EXISTS secondhand_shop
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

-- 2. 데이터베이스 사용
USE secondhand_shop;

-- 3. 사용자 생성 (선택사항 - 보안을 위해 root 대신 사용)
-- CREATE USER IF NOT EXISTS 'secondhand_user'@'localhost' IDENTIFIED BY 'your_secure_password';
-- GRANT ALL PRIVILEGES ON secondhand_shop.* TO 'secondhand_user'@'localhost';
-- FLUSH PRIVILEGES;

-- 참고: Spring Boot의 JPA가 테이블을 자동으로 생성합니다 (spring.jpa.hibernate.ddl-auto=update)
