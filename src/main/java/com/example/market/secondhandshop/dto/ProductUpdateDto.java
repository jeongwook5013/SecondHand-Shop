package com.example.market.secondhandshop.dto;

import lombok.Data;

/**
 * 상품 수정 요청 데이터를 담는 DTO
 */
@Data
public class ProductUpdateDto {
    private String title;
    private String description;
    private int price;
}
