package com.example.market.secondhandshop.config;

import com.example.market.secondhandshop.entity.Category;
import com.example.market.secondhandshop.entity.Product;
import com.example.market.secondhandshop.entity.User;
import com.example.market.secondhandshop.repository.CategoryRepository;
import com.example.market.secondhandshop.repository.ProductRepository;
import com.example.market.secondhandshop.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

/**
 * 애플리케이션 시작 시 초기 데이터를 설정하는 클래스
 */
@Component
public class DataInitializer implements CommandLineRunner {

    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(CategoryRepository categoryRepository,
                          UserRepository userRepository,
                          ProductRepository productRepository,
                          PasswordEncoder passwordEncoder) {
        this.categoryRepository = categoryRepository;
        this.userRepository = userRepository;
        this.productRepository = productRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        
        if (categoryRepository.count() > 0) {
            return;
        }

        System.out.println("🚀 초기 데이터를 설정합니다...");

        // 1. 카테고리 생성
        Category electronics = createCategory("전자제품");
        Category fashion = createCategory("패션/의류");
        Category books = createCategory("도서/음반");
        Category furniture = createCategory("가구/인테리어");
        Category sports = createCategory("스포츠/레저");
        Category etc = createCategory("기타");

        // 2. 테스트 사용자 생성
        User testUser1 = createUser("testuser1", "test123!", "test1@example.com");
        User testUser2 = createUser("testuser2", "test123!", "test2@example.com");
        User admin = createUser("admin", "admin123!", "admin@example.com");

        // 3. 샘플 상품 생성
        createProduct("아이폰 14 Pro", "거의 새것 상태입니다", 850000, "서울 강남구", electronics, testUser1);
        createProduct("MacBook Air M2", "사용기간 6개월", 1200000, "서울 서초구", electronics, testUser2);
        createProduct("나이키 신발", "사이즈 270", 120000, "서울 홍대", fashion, testUser1);
        createProduct("자바 책", "프로그래밍 학습서", 35000, "서울 대학로", books, admin);

        System.out.println("✅ 초기 데이터 설정이 완료되었습니다!");
        System.out.println("📋 테스트 계정: testuser1 / test123!");
        System.out.println("🌐 H2 콘솔: http://localhost:8080/h2-console");
    }

    private Category createCategory(String name) {
        Category category = new Category();
        category.setName(name);
        return categoryRepository.save(category);
    }

    private User createUser(String username, String password, String email) {
        User user = new User();
        user.setUsername(username);
        user.setPassword(passwordEncoder.encode(password));
        user.setEmail(email);
        return userRepository.save(user);
    }

    private void createProduct(String title, String description, int price, 
                              String location, Category category, User seller) {
        Product product = new Product();
        product.setTitle(title);
        product.setDescription(description);
        product.setPrice(price);
        product.setLocation(location);
        product.setCategory(category);
        product.setSeller(seller);
        product.setSold(false);
        
        productRepository.save(product);
    }
}
