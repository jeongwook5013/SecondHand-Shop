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

    /**
     * 파일 없는 상품 등록 (JWT 인증용)
     */
    @Transactional
    public String registerProductWithoutFile(ProductRequestDto requestDto, String currentUsername) {
        //판매자(User)를 JWT 토큰의 username으로 찾기
        User seller = userRepository.findByUsername(currentUsername)
                .orElseThrow(() -> new IllegalArgumentException("로그인한 사용자를 찾을 수 없습니다: " + currentUsername));

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
        product.setImageUrl(null);  // 이미지 없음

        //데이터베이스에 저장
        productRepository.save(product);

        return "상품 등록이 완료되었습니다. (JWT 인증 완료)";
    }

    @Transactional(readOnly = true)
    public List<ProductResponseDto> getProducts(){
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
    public String updateProduct(Long id, ProductUpdateDto updateDto, String currentUsername) {
        // ID를 사용해 상품을 찾음. 없으면 예외 발생.
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("상품을 찾을 수 없습니다."));

        // 본인 상품인지 검증
        validateProductOwnership(product, currentUsername);

        //DTO 정보를 엔티티에 업테이트
        product.setTitle(updateDto.getTitle());
        product.setDescription(updateDto.getDescription());
        product.setPrice(updateDto.getPrice());

        return "상품 수정이 완료되었습니다.";
    }

    @Transactional
    public String deleteProduct(Long id, String currentUsername){
        //ID를 사용해 상품을 찾고 없으면 예외 발생
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("상품을 찾을 수 없습니다."));

        // 본인 상품인지 검증
        validateProductOwnership(product, currentUsername);

        //상품 삭제
        productRepository.delete(product);

        return "상품 삭제가 완료 되었습니다.";
    }

    /**
     * 상품 소유권 검증 메서드
     * 현재 로그인한 사용자가 해당 상품의 소유자인지 확인
     * 
     * @param product 검증할 상품
     * @param currentUsername 현재 로그인한 사용자명
     * @throws IllegalArgumentException 본인 상품이 아닌 경우
     */
    private void validateProductOwnership(Product product, String currentUsername) {
        String productOwner = product.getSeller().getUsername();
        
        if (!productOwner.equals(currentUsername)) {
            throw new IllegalArgumentException(
                String.format("권한이 없습니다. 이 상품은 '%s'님이 등록한 상품입니다.", productOwner)
            );
        }
    }

}
