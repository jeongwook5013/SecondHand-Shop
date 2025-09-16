package com.example.market.secondhandshop.service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Date;
import java.util.function.Function;

/**
 * JWT 토큰 관리 서비스
 * 
 * 주요 기능:
 * 1. JWT 토큰 생성 - 로그인 성공시 발급
 * 2. JWT 토큰 검증 - API 호출시 인증 확인
 * 3. 토큰에서 사용자 정보 추출
 */
@Service
public class JwtService {

    @Value("${jwt.secret:myVerySecureSecretKey123456789012345678901234567890}")
    private String secretKey;

    @Value("${jwt.expiration:86400000}") // 24시간 (밀리초)
    private long expiration;

    /**
     * 사용자명으로 JWT 토큰 생성
     * 
     * @param username 사용자명
     * @return JWT 토큰 문자열
     */
    public String generateToken(String username) {
        return Jwts.builder()
                .setSubject(username)                    // 토큰 주체 (사용자명)
                .setIssuedAt(new Date(System.currentTimeMillis()))    // 발행 시간
                .setExpiration(new Date(System.currentTimeMillis() + expiration))  // 만료 시간
                .signWith(getSignKey(), SignatureAlgorithm.HS256)     // 서명
                .compact();
    }

    /**
     * 토큰에서 사용자명 추출
     */
    public String getUsernameFromToken(String token) {
        return getClaimFromToken(token, Claims::getSubject);
    }

    /**
     * 토큰 유효성 검증
     */
    public boolean validateToken(String token, String username) {
        final String tokenUsername = getUsernameFromToken(token);
        return (tokenUsername.equals(username) && !isTokenExpired(token));
    }

    /**
     * 토큰 만료 여부 확인
     */
    public boolean isTokenExpired(String token) {
        final Date expiration = getExpirationDateFromToken(token);
        return expiration.before(new Date());
    }

    private Date getExpirationDateFromToken(String token) {
        return getClaimFromToken(token, Claims::getExpiration);
    }

    private <T> T getClaimFromToken(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = getAllClaimsFromToken(token);
        return claimsResolver.apply(claims);
    }

    private Claims getAllClaimsFromToken(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSignKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    private Key getSignKey() {
        return Keys.hmacShaKeyFor(secretKey.getBytes());
    }
}
