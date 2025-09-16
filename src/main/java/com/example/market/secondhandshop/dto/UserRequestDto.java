package com.example.market.secondhandshop.dto;

import lombok.Data;

/**
 * 회원가입 요청 데이터를 담는 DTO
 */
@Data  // Lombok이 자동으로 getter, setter, toString, equals, hashCode 생성
public class UserRequestDto {
    private String username;
    private String password;
    private String email;
}
