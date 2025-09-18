package com.example.market.secondhandshop.controller;

import com.example.market.secondhandshop.dto.ProductRequestDto;
import com.example.market.secondhandshop.dto.ProductResponseDto;
import com.example.market.secondhandshop.dto.ProductUpdateDto;
import com.example.market.secondhandshop.service.ProductService;
import com.example.market.secondhandshop.service.JwtService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 상품 관련 API 컨트롤러 (JWT 보안 적용)
 * 
 * 보안 정책:
 * - GET 요청: 누구나 접근 가능
 * - POST/PUT/DELETE: JWT 토큰 필요
 */
@RestController
@RequestMapping("/api/products")
public class ProductController {

    private final ProductService productService;
    private final JwtService jwtService;

    public ProductController(ProductService productService, JwtService jwtService) {
        this.productService = productService;
        this.jwtService = jwtService;
    }

    /**
     * 상품 등록 - JWT 토큰 필요
     */
    @PostMapping
    public ResponseEntity<?> registerProduct(
            @RequestHeader(value = "Authorization", required = false) String authHeader,
            @RequestBody ProductRequestDto requestDto) {
        
        // JWT 토큰 검증
        String username = validateJwtToken(authHeader);
        if (username == null) {
            return createUnauthorizedResponse();
        }

        try {
            // 파일 업로드 없이 일단 상품 등록
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
        List<ProductResponseDto> products = productService.getProductrs();
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
     * 상품 수정 - JWT 토큰 필요
     */
    @PutMapping("/{id}")
    public ResponseEntity<?> updateProduct(
            @PathVariable Long id,
            @RequestHeader(value = "Authorization", required = false) String authHeader,
            @RequestBody ProductUpdateDto updateDto) {
        
        // JWT 토큰 검증
        String username = validateJwtToken(authHeader);
        if (username == null) {
            return createUnauthorizedResponse();
        }

        try {
            String result = productService.updateProduct(id, updateDto, username);
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", result);
            response.put("updatedBy", username);
            response.put("status", "success");
            
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            // 권한 없음 또는 상품 없음 등의 경우
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
     * 상품 삭제 - JWT 토큰 필요
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteProduct(
            @PathVariable Long id,
            @RequestHeader(value = "Authorization", required = false) String authHeader) {
        
        // JWT 토큰 검증
        String username = validateJwtToken(authHeader);
        if (username == null) {
            return createUnauthorizedResponse();
        }

        try {
            String result = productService.deleteProduct(id, username);
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", result);
            response.put("deletedBy", username);
            response.put("status", "success");
            
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            // 권한 없음 또는 상품 없음 등의 경우
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
     * JWT 토큰 검증 헬퍼 메서드
     */
    private String validateJwtToken(String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return null;
        }

        String token = authHeader.substring(7);
        try {
            String username = jwtService.getUsernameFromToken(token);
            if (jwtService.validateToken(token, username)) {
                return username;
            }
        } catch (Exception e) {
            // 토큰 파싱 실패
        }
        return null;
    }

    /**
     * 인증 실패 응답 생성
     */
    private ResponseEntity<?> createUnauthorizedResponse() {
        Map<String, String> response = new HashMap<>();
        response.put("error", "인증이 필요합니다. Authorization 헤더에 유효한 JWT 토큰을 포함해주세요.");
        response.put("status", "unauthorized");
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
    }
}
