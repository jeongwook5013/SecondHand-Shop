package com.example.market.secondhandshop.dto;


import lombok.Data;

@Data
public class ProductRequestDto {
    private String title;
    private String description;
    private int price;
    private String location;
    private String imageUrl;
    private Long categoryId;
    private Long sellerId;
    //현재는 임시로 sellerId를 받고 나중에는
    //로그인된 사용자의 세션 정보에서 가져오는 방식으로 변경할것임



}
