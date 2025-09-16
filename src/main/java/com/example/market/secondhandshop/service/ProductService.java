package com.example.market.secondhandshop.service;


import com.example.market.secondhandshop.dto.ProductRequestDto;
import com.example.market.secondhandshop.dto.ProductResponseDto;
import com.example.market.secondhandshop.dto.ProductUpdateDto;
import com.example.market.secondhandshop.entity.Category;
import com.example.market.secondhandshop.entity.Product;
import com.example.market.secondhandshop.entity.User;
import com.example.market.secondhandshop.repository.CategoryRepository;
import com.example.market.secondhandshop.repository.ProductRepository;
import com.example.market.secondhandshop.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class ProductService {

    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;

    public ProductService(ProductRepository productRepository, UserRepository userRepository, CategoryRepository categoryRepository) {
        this.productRepository = productRepository;
        this.userRepository = userRepository;
        this.categoryRepository = categoryRepository;
    }

    @Transactional
    public String registerProduct(ProductRequestDto requestDto, MultipartFile image) throws IOException{
        //이미지 파일 저장 로직
        String uploadDir = "uploads/";  //이미지를 저장할 디렉토리 지정
        File uploadPath = new File(uploadDir);
        if(!uploadPath.exists()){
            uploadPath.mkdirs();
        }
        String fileName = UUID.randomUUID().toString() + "_" + image.getOriginalFilename();
        File dest = new File(uploadPath, fileName);
        image.transferTo(dest);
        String imageUrl = "/" + uploadDir + fileName;   //데이터베이스에 저장할 경로

        //판매자(User)를 찾기
        User seller = userRepository.findById(requestDto.getSellerId())
                .orElseThrow(() -> new IllegalArgumentException("판매자를 찾을 수 없습니다."));

        //카테고리를 찾기
        Category category = categoryRepository.findById(requestDto.getCategoryId())
                .orElseThrow(() -> new IllegalArgumentException("카테고리를 찾을 수 없습니다."));

        //DTO 정보를 바탕으로 Product엔티티 생성
        Product product = new Product();
        product.setTitle(requestDto.getTitle());
        product.setDescription(requestDto.getDescription());
        product.setPrice(requestDto.getPrice());
        product.setLocation(requestDto.getLocation());
        product.setSeller(seller);
        product.setCategory(category);
        product.setImageUrl(imageUrl);  //파일 경로를 엔티티에 저장

        //데이터베이스에 저장
        productRepository.save(product);

        return "상품 등록이 완료되었습니다.";
    }

    @Transactional(readOnly = true)
    public List<ProductResponseDto> getProductrs(){
        //모든 Product 엔티티를 조회
        List<Product> products = productRepository.findAll();

        //엔티티 리스트를 DTO 리스트로 변환해서 반환
        return products.stream()
                .map(ProductResponseDto::new)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public ProductResponseDto getProductById(Long id){
        //ID를 사용해 상품을 찾음. 없으면 예외를 발생하기
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("상품을 찾을 수 없습니다."));

        //찾은 엔티티를 DTO로 변환해서 반환함
        return new ProductResponseDto(product);
    }

    @Transactional
    public String updateProduct(Long id, ProductUpdateDto updateDto) {
        // ID를 사용해 상품을 찾음. 없으면 예외 발생.
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("상품을 찾을 수 없습니다."));

        //DTO 정보를 엔티티에 업테이트
        product.setTitle(updateDto.getTitle());
        product.setDescription(updateDto.getDescription());
        product.setPrice(updateDto.getPrice());

        return "상품 수정이 완료되었습니다.";


    }

    @Transactional
    public String deleteProduct(Long id){
        //ID를 사용해 상품을 찾고 없으면 예외 발생
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("상품을 찾을 수 없습니다."));

        //상품 삭제
        productRepository.delete(product);

        return "상품 삭제가 완료 되었습니다.";
    }

}
