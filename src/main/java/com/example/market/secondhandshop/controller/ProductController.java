package com.example.market.secondhandshop.controller;

import com.example.market.secondhandshop.dto.ProductRequestDto;
import com.example.market.secondhandshop.dto.ProductResponseDto;
import com.example.market.secondhandshop.dto.ProductUpdateDto;
import com.example.market.secondhandshop.service.ProductService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    private final ProductService productService;
    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @PostMapping
    public ResponseEntity<String> registerProduct(
            @RequestPart("data") ProductRequestDto requestDto,
            @RequestPart("image") MultipartFile image) {
        try {
            String message = productService.registerProduct(requestDto, image);
            return ResponseEntity.status(HttpStatus.CREATED).body(message);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("파일 업로드 중 오류가 발생했습니다: " + e.getMessage());
        }
    }


    @GetMapping
    public ResponseEntity<List<ProductResponseDto>> getProducts(){
        List<ProductResponseDto> products = productService.getProductrs();
        return ResponseEntity.ok(products);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductResponseDto> getProductById(@PathVariable Long id) {
        ProductResponseDto product = productService.getProductById(id);
        return ResponseEntity.ok(product);
    }

    @PutMapping("/{id}")
    public ResponseEntity<String> updateProduct(@PathVariable Long id, @RequestBody ProductUpdateDto updateDto){
        String result = productService.updateProduct(id, updateDto);
        return ResponseEntity.ok(result);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteProduct(@PathVariable Long id){
        String result = productService.deleteProduct(id);
        return ResponseEntity.ok(result);
    }

}
