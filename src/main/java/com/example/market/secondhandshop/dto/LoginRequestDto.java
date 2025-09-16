package com.example.market.secondhandshop.dto;

import lombok.Data;

/**
 * 로그인 요청 데이터를 담는 DTO
 */
@Data
public class LoginRequestDto {
    private String username;
    private String password;
}
