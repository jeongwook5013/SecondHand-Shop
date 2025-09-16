package com.example.market.secondhandshop.dto;

import com.example.market.secondhandshop.entity.Product;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * 상품 응답 데이터를 담는 DTO
 */
@Data
@NoArgsConstructor
public class ProductResponseDto {
    private Long id;
    private String title;
    private int price;
    private String location;
    private String imageUrl;
    private String sellerUsername;
    private String categoryName;
    private LocalDateTime createdAt;

    // 엔티티를 DTO로 변환하는 생성자
    public ProductResponseDto(Product product) {
        this.id = product.getId();
        this.title = product.getTitle();
        this.price = product.getPrice();
        this.location = product.getLocation();
        this.imageUrl = product.getImageUrl();
        this.sellerUsername = product.getSeller().getUsername();
        this.categoryName = product.getCategory().getName();
        this.createdAt = product.getCreatedAt();
    }
}
