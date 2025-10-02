package com.example.market.secondhandshop.controller;

import com.example.market.secondhandshop.dto.ProductRequestDto;
import com.example.market.secondhandshop.dto.ProductResponseDto;
import com.example.market.secondhandshop.dto.ProductUpdateDto;
import com.example.market.secondhandshop.service.ProductService;
import com.example.market.secondhandshop.service.FileUploadService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 상품 관련 API 컨트롤러 (JWT 필터 + 파일 업로드)
 * 
 * 기능:
 * 1. JWT 필터가 자동으로 인증 처리
 * 2. Authentication 객체에서 username 추출
 * 3. 파일 업로드 기능 추가
 */
@RestController
@RequestMapping("/api/products")
public class ProductController {

    private final ProductService productService;
    private final FileUploadService fileUploadService;

    public ProductController(ProductService productService, FileUploadService fileUploadService) {
        this.productService = productService;
        this.fileUploadService = fileUploadService;
    }

    /**
     * 상품 등록 (이미지 포함) - JWT 인증 필요
     */
    @PostMapping
    public ResponseEntity<?> registerProduct(
            Authentication authentication, // JWT 필터가 자동 주입
            @RequestParam("title") String title,
            @RequestParam("description") String description,
            @RequestParam("price") int price,
            @RequestParam("location") String location,
            @RequestParam("categoryId") Long categoryId,
            @RequestParam(value = "image", required = false) MultipartFile image) {
        
        try {
            // 1. 인증된 사용자명 추출
            String username = authentication.getName();
            System.out.println("🔐 상품 등록 요청 - 사용자: " + username);
            
            // 2. 이미지 업로드 처리
            String imageUrl = null;
            if (image != null && !image.isEmpty()) {
                imageUrl = fileUploadService.uploadImage(image);
                System.out.println("📸 이미지 업로드 완료: " + imageUrl);
            }
            
            // 3. 상품 등록 DTO 생성
            ProductRequestDto requestDto = new ProductRequestDto();
            requestDto.setTitle(title);
            requestDto.setDescription(description);
            requestDto.setPrice(price);
            requestDto.setLocation(location);
            requestDto.setCategoryId(categoryId);
            requestDto.setImageUrl(imageUrl);
            
            // 4. 상품 등록
            String message = productService.registerProductWithoutFile(requestDto, username);
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", message);
            response.put("registeredBy", username);
            response.put("imageUrl", imageUrl);
            response.put("status", "success");
            
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
            
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", e.getMessage(), "status", "fail"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "상품 등록 중 오류가 발생했습니다: " + e.getMessage(), "status", "error"));
        }
    }

    /**
     * JSON 형태의 상품 등록 (이미지 없이) - 기존 호환성
     */
    @PostMapping("/json")
    public ResponseEntity<?> registerProductJson(
            Authentication authentication,
            @RequestBody ProductRequestDto requestDto) {
        
        try {
            String username = authentication.getName();
            String message = productService.registerProductWithoutFile(requestDto, username);
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", message);
            response.put("registeredBy", username);
            response.put("status", "success");
            
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", e.getMessage(), "status", "fail"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "상품 등록 중 오류가 발생했습니다: " + e.getMessage(), "status", "error"));
        }
    }

    /**
     * 상품 목록 조회 - 공개 API
     */
    @GetMapping
    public ResponseEntity<List<ProductResponseDto>> getProducts() {
        List<ProductResponseDto> products = productService.getProducts();
        return ResponseEntity.ok(products);
    }

    /**
     * 개별 상품 조회 - 공개 API
     */
    @GetMapping("/{id}")
    public ResponseEntity<ProductResponseDto> getProductById(@PathVariable Long id) {
        ProductResponseDto product = productService.getProductById(id);
        return ResponseEntity.ok(product);
    }

    /**
     * 상품 수정 - JWT 인증 필요 (Spring Security가 자동 처리)
     */
    @PutMapping("/{id}")
    public ResponseEntity<?> updateProduct(
            @PathVariable Long id,
            Authentication authentication, // JWT 필터가 자동 주입
            @RequestBody ProductUpdateDto updateDto) {
        
        try {
            String username = authentication.getName();
            System.out.println("🔐 상품 수정 요청 - 사용자: " + username + ", 상품 ID: " + id);
            
            String result = productService.updateProduct(id, updateDto, username);
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", result);
            response.put("updatedBy", username);
            response.put("status", "success");
            
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            HttpStatus status = e.getMessage().contains("권한이 없습니다") ? 
                HttpStatus.FORBIDDEN : HttpStatus.BAD_REQUEST;
            
            return ResponseEntity.status(status)
                    .body(Map.of("error", e.getMessage(), "status", "fail"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "상품 수정 중 오류가 발생했습니다: " + e.getMessage(), "status", "error"));
        }
    }

    /**
     * 상품 삭제 - JWT 인증 필요 (Spring Security가 자동 처리)
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteProduct(
            @PathVariable Long id,
            Authentication authentication) { // JWT 필터가 자동 주입
        
        try {
            String username = authentication.getName();
            System.out.println("🔐 상품 삭제 요청 - 사용자: " + username + ", 상품 ID: " + id);
            
            String result = productService.deleteProduct(id, username);
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", result);
            response.put("deletedBy", username);
            response.put("status", "success");
            
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            HttpStatus status = e.getMessage().contains("권한이 없습니다") ? 
                HttpStatus.FORBIDDEN : HttpStatus.BAD_REQUEST;
                
            return ResponseEntity.status(status)
                    .body(Map.of("error", e.getMessage(), "status", "fail"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "상품 삭제 중 오류가 발생했습니다: " + e.getMessage(), "status", "error"));
        }
    }

    /**
     * 단일 이미지 업로드 API (테스트용)
     */
    @PostMapping("/upload-image")
    public ResponseEntity<?> uploadImage(
            Authentication authentication,
            @RequestParam("image") MultipartFile image) {
        
        try {
            String imageUrl = fileUploadService.uploadImage(image);
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "이미지 업로드 성공");
            response.put("imageUrl", imageUrl);
            response.put("uploadedBy", authentication.getName());
            response.put("status", "success");
            
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", e.getMessage(), "status", "fail"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "이미지 업로드 중 오류가 발생했습니다: " + e.getMessage(), "status", "error"));
        }
    }
}