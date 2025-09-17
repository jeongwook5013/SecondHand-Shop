# 🛍️ SecondHand Shop - 중고거래 플랫폼

Spring Boot와 JWT를 활용한 안전하고 현대적인 중고거래 플랫폼입니다.

## 📋 프로젝트 개요

개인간 중고물품 거래를 위한 RESTful API 기반 웹 애플리케이션입니다. Spring Security와 JWT를 통한 강력한 인증/인가 시스템과 BCrypt 암호화로 사용자 데이터를 안전하게 보호합니다.

## 🛠️ 기술 스택

### Backend
- **Java 17**
- **Spring Boot 3.2.10**
- **Spring Security** - 인증/인가
- **Spring Data JPA** - 데이터베이스 ORM
- **JWT (JSON Web Token)** - Stateless 인증
- **BCrypt** - 비밀번호 암호화
- **Lombok** - 코드 간소화

### Database
- **MariaDB 11.8.2** - 메인 데이터베이스

### Build Tool
- **Gradle 8.14.3**

## 🔐 보안 기능

### ✅ 완료된 보안 기능
- **BCrypt 암호화**: 사용자 비밀번호 안전 저장
- **JWT 토큰 인증**: Stateless 세션 관리
- **Spring Security**: API 별 접근 권한 제어
- **CORS 설정**: 프론트엔드 통신 보안
- **입력값 검증**: 데이터 무결성 보장
- **민감 정보 보호**: 설정 파일 Git 제외

### 🔒 보안 정책
```java
// API 접근 권한
public APIs: /api/users/signup, /api/users/login, /api/products (GET)
protected APIs: 상품 등록/수정/삭제, 사용자 프로필

// 비밀번호 정책
- BCrypt 해시 알고리즘 사용
- Salt 자동 생성으로 레인보우 테이블 공격 방어

// JWT 토큰 정책
- HS256 알고리즘 사용
- 24시간 유효기간
- 서명 검증을 통한 위조 방지
- 강력한 32자 이상의 비밀키 사용

// 환경 설정 보안
- 민감한 정보는 환경변수 또는 별도 설정 파일 사용
- 데이터베이스 접속 정보 Git 제외
- JWT 서명 키 Git 제외
```

### ⚠️ 보안 주의사항
- `application.properties` 파일은 **절대 Git에 커밋하지 마세요**
- JWT 비밀키는 32자 이상의 강력한 키를 사용하세요
- 운영 환경에서는 환경변수를 사용하세요
- 정기적으로 JWT 비밀키를 교체하세요

## 📊 데이터베이스 구조

### 주요 엔티티
```sql
Users (사용자)
├── id (PK)
├── username (UNIQUE)
├── password (BCrypt 암호화)
├── email (UNIQUE)
└── created_at

Products (상품)
├── id (PK)
├── title
├── description
├── price
├── location
├── is_sold
├── image_url
├── seller_id (FK → Users)
├── category_id (FK → Categories)
├── created_at
└── updated_at

Categories (카테고리)
├── id (PK)
└── name (UNIQUE)
```

## 🚀 API 엔드포인트

### 🔓 Public APIs (인증 불필요)
```http
POST   /api/users/signup     # 회원가입
POST   /api/users/login      # 로그인 (JWT 토큰 발급)
GET    /api/products         # 상품 목록 조회
GET    /api/products/{id}    # 상품 상세 조회
```

### 🔒 Protected APIs (JWT 토큰 필요)
```http
POST   /api/products         # 상품 등록
PUT    /api/products/{id}    # 상품 수정
DELETE /api/products/{id}    # 상품 삭제
GET    /api/users/profile    # 내 프로필 조회 (예정)
```

## 💻 로컬 개발 환경 설정

### 1. 사전 요구사항
- Java 17 이상
- MariaDB 10.x 이상
- Git

### 2. 프로젝트 클론
```bash
git clone https://github.com/jeongwook5013/SecondHand-Shop.git
cd SecondHand-Shop
```

### 3. 데이터베이스 설정
```sql
-- MariaDB에서 실행
CREATE DATABASE secondhand_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 4. 설정 파일 생성 및 수정
```bash
# 템플릿 파일을 복사해서 실제 설정 파일 생성
cp src/main/resources/application.properties.template src/main/resources/application.properties
```

```properties
# src/main/resources/application.properties
spring.datasource.url=jdbc:mariadb://localhost:3306/secondhand_db
spring.datasource.username=your_username
spring.datasource.password=your_password

# JWT 설정 (32자 이상의 강력한 비밀키 생성)
jwt.secret=your_very_secure_jwt_secret_key_here_at_least_32_characters
jwt.expiration=86400000
```

⚠️ **중요**: `application.properties` 파일은 민감한 정보를 포함하므로 Git에 커밋하지 마세요!

### 5. 애플리케이션 실행
```bash
# 방법 1: Gradle Wrapper 사용
./gradlew bootRun

# 방법 2: JAR 파일 생성 후 실행
./gradlew build
java -jar build/libs/secondhand-shop-0.0.1-SNAPSHOT.jar
```

## 🧪 API 테스트 예제

### 회원가입
```bash
curl -X POST http://localhost:8080/api/users/signup \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "mypassword",
    "email": "test@example.com"
  }'
```

### 로그인 (JWT 토큰 발급)
```bash
curl -X POST http://localhost:8080/api/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "mypassword"
  }'
```

**응답 예시:**
```json
{
  "message": "로그인 성공",
  "token": "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ0ZXN0dXNlciIsImlhdCI6MTcwMDAwMDAwMCwiZXhwIjoxNzAwMDg2NDAwfQ.signature",
  "username": "testuser",
  "status": "success"
}
```

### 상품 목록 조회
```bash
curl -X GET http://localhost:8080/api/products
```

## 🔄 개발 진행 상황

### ✅ Phase 1: 보안 시스템 구축 (완료)
- [x] Spring Security 설정
- [x] BCrypt 비밀번호 암호화
- [x] JWT 토큰 인증 시스템
- [x] API 접근 권한 제어
- [x] CORS 설정

### 🚧 Phase 2: 기능 완성 (진행 예정)
- [ ] JWT 인증 필터 추가
- [ ] 상품 등록/수정/삭제 API 보호
- [ ] 파일 업로드 시스템 개선
- [ ] 사용자 프로필 관리

### 📋 Phase 3: 고급 기능 (계획)
- [ ] 상품 검색 및 필터링
- [ ] 페이징 처리
- [ ] 즐겨찾기 기능
- [ ] 거래 내역 관리
- [ ] 실시간 알림

## 🏗️ 프로젝트 구조
```
src/
├── main/
│   ├── java/com/example/market/secondhandshop/
│   │   ├── config/
│   │   │   └── SecurityConfig.java     # Spring Security 설정
│   │   ├── controller/
│   │   │   ├── UserController.java     # 사용자 관련 API
│   │   │   └── ProductController.java  # 상품 관련 API
│   │   ├── dto/
│   │   │   ├── UserRequestDto.java     # 회원가입 요청
│   │   │   ├── LoginRequestDto.java    # 로그인 요청
│   │   │   └── Product*.java           # 상품 관련 DTO
│   │   ├── entity/
│   │   │   ├── User.java               # 사용자 엔티티
│   │   │   ├── Product.java            # 상품 엔티티
│   │   │   └── Category.java           # 카테고리 엔티티
│   │   ├── repository/
│   │   │   ├── UserRepository.java     # 사용자 데이터 접근
│   │   │   ├── ProductRepository.java  # 상품 데이터 접근
│   │   │   └── CategoryRepository.java # 카테고리 데이터 접근
│   │   ├── service/
│   │   │   ├── UserService.java        # 사용자 비즈니스 로직
│   │   │   ├── ProductService.java     # 상품 비즈니스 로직
│   │   │   └── JwtService.java         # JWT 토큰 관리
│   │   └── SecondhandShopApplication.java
│   └── resources/
│       └── application.properties      # 설정 파일
└── test/
    └── java/                          # 단위 테스트 (예정)
```

## 🤝 기여하기

1. Fork 프로젝트
2. Feature 브랜치 생성 (`git checkout -b feature/AmazingFeature`)
3. 변경사항 커밋 (`git commit -m 'Add some AmazingFeature'`)
4. 브랜치에 Push (`git push origin feature/AmazingFeature`)
5. Pull Request 오픈

## 📄 라이센스

이 프로젝트는 MIT 라이센스 하에 배포됩니다. 자세한 내용은 `LICENSE` 파일을 참조하세요.

## 📞 연락처

**개발자**: 정정욱  
**GitHub**: [@jeongwook5013](https://github.com/jeongwook5013)  
**프로젝트 링크**: [https://github.com/jeongwook5013/SecondHand-Shop](https://github.com/jeongwook5013/SecondHand-Shop)

---

⭐ 이 프로젝트가 도움이 되었다면 Star를 눌러주세요!
