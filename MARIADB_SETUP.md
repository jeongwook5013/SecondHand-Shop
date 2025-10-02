# MariaDB 설정 가이드

## 📋 사전 준비사항

### 1. MariaDB 설치 확인
```bash
# MariaDB 버전 확인
mysql --version

# MariaDB가 실행 중인지 확인
# Windows
sc query mysql

# Linux/Mac
sudo systemctl status mariadb
```

### 2. MariaDB가 설치되어 있지 않다면
- **Windows**: [MariaDB 다운로드](https://mariadb.org/download/)
- **Mac**: `brew install mariadb`
- **Linux**: `sudo apt-get install mariadb-server`

---

## 🗄️ 데이터베이스 설정

### 1. MariaDB 접속
```bash
# root 계정으로 접속
mysql -u root -p

# 비밀번호 입력: 1234 (또는 설정한 비밀번호)
```

### 2. 데이터베이스 생성
```sql
-- 데이터베이스 생성
CREATE DATABASE IF NOT EXISTS secondhand_shop
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

-- 생성 확인
SHOW DATABASES;

-- 사용
USE secondhand_shop;
```

### 3. 권한 설정 (선택사항 - 보안 강화)
```sql
-- 전용 사용자 생성
CREATE USER IF NOT EXISTS 'secondhand_user'@'localhost' 
    IDENTIFIED BY 'your_secure_password';

-- 권한 부여
GRANT ALL PRIVILEGES ON secondhand_shop.* 
    TO 'secondhand_user'@'localhost';

-- 권한 적용
FLUSH PRIVILEGES;

-- 종료
EXIT;
```

---

## ⚙️ Spring Boot 설정

### application.properties 수정
파일 위치: `src/main/resources/application.properties`

```properties
# 데이터베이스 설정 (MariaDB)
spring.datasource.url=jdbc:mariadb://localhost:3306/secondhand_shop?serverTimezone=Asia/Seoul&characterEncoding=UTF-8
spring.datasource.username=root
spring.datasource.password=1234
spring.datasource.driver-class-name=org.mariadb.jdbc.Driver

# JPA/Hibernate 설정
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MariaDBDialect
```

### 비밀번호 변경이 필요한 경우
`spring.datasource.password` 값을 본인의 MariaDB 비밀번호로 변경하세요.

---

## 🚀 애플리케이션 실행

### 1. Gradle 빌드
```bash
# Windows
gradlew.bat clean build

# Linux/Mac
./gradlew clean build
```

### 2. 애플리케이션 실행
```bash
# IntelliJ에서 SecondhandShopApplication.java 실행
# 또는
gradlew.bat bootRun
```

### 3. 실행 확인
애플리케이션이 시작되면 다음과 같은 로그가 출력됩니다:
```
🚀 초기 데이터를 설정합니다...
✅ 초기 데이터 설정이 완료되었습니다!
📋 테스트 계정: testuser1 / test123!
🗄️ 데이터베이스: MariaDB (localhost:3306/secondhand_shop)
```

---

## 🔍 테이블 확인

### MariaDB에서 직접 확인
```bash
# MariaDB 접속
mysql -u root -p secondhand_shop

# 테이블 목록 확인
SHOW TABLES;

# 결과 예시:
# +---------------------------+
# | Tables_in_secondhand_shop |
# +---------------------------+
# | categories                |
# | products                  |
# | users                     |
# +---------------------------+

# 사용자 데이터 확인
SELECT * FROM users;

# 상품 데이터 확인
SELECT * FROM products;

# 카테고리 데이터 확인
SELECT * FROM categories;
```

---

## 🐛 문제 해결

### 1. "Access denied for user" 오류
```
원인: 비밀번호가 틀렸거나 사용자 권한이 없음
해결: application.properties의 username과 password 확인
```

### 2. "Unknown database 'secondhand_shop'" 오류
```
원인: 데이터베이스가 생성되지 않음
해결: CREATE DATABASE secondhand_shop; 실행
```

### 3. "Communications link failure" 오류
```
원인: MariaDB 서비스가 실행되지 않음
해결: 
  - Windows: sc start mysql
  - Linux: sudo systemctl start mariadb
```

### 4. "Table doesn't exist" 오류
```
원인: JPA가 테이블을 생성하지 못함
해결: 
  1. spring.jpa.hibernate.ddl-auto=create-drop 으로 변경 (첫 실행 시)
  2. 애플리케이션 재시작
  3. 다시 update로 변경
```

---

## 📝 중요 설정 변경사항

### ddl-auto 설정 값의 의미
```properties
# create-drop: 시작할 때 테이블 생성, 종료할 때 삭제 (개발/테스트용)
spring.jpa.hibernate.ddl-auto=create-drop

# create: 시작할 때 항상 테이블 재생성 (기존 데이터 삭제됨)
spring.jpa.hibernate.ddl-auto=create

# update: 변경사항만 반영 (기존 데이터 유지) ✅ 권장
spring.jpa.hibernate.ddl-auto=update

# validate: 엔티티와 테이블 일치 여부만 확인
spring.jpa.hibernate.ddl-auto=validate

# none: 아무것도 하지 않음 (운영 환경)
spring.jpa.hibernate.ddl-auto=none
```

**현재 설정: `update` (개발 환경에 적합)**

---

## ✅ 체크리스트

설정이 완료되었다면 다음을 확인하세요:

- [ ] MariaDB가 설치되어 있고 실행 중
- [ ] `secondhand_shop` 데이터베이스가 생성됨
- [ ] `application.properties`의 비밀번호가 올바름
- [ ] 애플리케이션이 오류 없이 시작됨
- [ ] 초기 데이터가 자동으로 생성됨
- [ ] API 테스트가 정상 동작함

---

## 🎯 다음 단계

1. **API 테스트**: Postman이나 curl로 API 동작 확인
2. **프론트엔드 연결**: React 앱과 연동
3. **데이터 백업**: 중요 데이터는 정기적으로 백업

```bash
# MariaDB 백업 명령어
mysqldump -u root -p secondhand_shop > backup.sql

# 복원
mysql -u root -p secondhand_shop < backup.sql
```
