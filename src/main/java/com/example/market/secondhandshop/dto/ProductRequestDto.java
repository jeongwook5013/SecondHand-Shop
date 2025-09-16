package com.example.market.secondhandshop.dto;

import lombok.Data;

/**
 * 상품 등록 요청 데이터를 담는 DTO
 */
@Data
public class ProductRequestDto {
    private String title;
    private String description;
    private int price;
    private String location;
    private Long categoryId;
    private Long sellerId; // 현재는 임시로 받고, 나중에는 JWT에서 추출할 예정
}
