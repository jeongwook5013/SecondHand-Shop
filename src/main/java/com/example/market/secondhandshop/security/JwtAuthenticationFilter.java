package com.example.market.secondhandshop.security;

import com.example.market.secondhandshop.service.JwtService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.ArrayList;

/**
 * JWT 토큰을 검증하고 인증 정보를 설정하는 필터
 * 
 * 동작 과정:
 * 1. Authorization 헤더에서 JWT 토큰 추출
 * 2. 토큰 유효성 검증
 * 3. 유효한 경우 SecurityContext에 인증 정보 설정
 */
@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;

    public JwtAuthenticationFilter(JwtService jwtService) {
        this.jwtService = jwtService;
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain) throws ServletException, IOException {

        // 1. Authorization 헤더에서 토큰 추출
        final String authHeader = request.getHeader("Authorization");
        
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        final String jwt = authHeader.substring(7);
        
        try {
            // 2. JWT에서 username 추출
            final String username = jwtService.getUsernameFromToken(jwt);
            
            // 3. 현재 SecurityContext에 인증 정보가 없는 경우에만 처리
            if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                
                // 4. 토큰 유효성 검증
                if (jwtService.validateToken(jwt, username)) {
                    
                    // 5. 인증 객체 생성
                    UsernamePasswordAuthenticationToken authToken = 
                        new UsernamePasswordAuthenticationToken(
                            username, 
                            null, 
                            new ArrayList<>() // 권한 목록 (현재는 빈 리스트)
                        );
                    
                    authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    
                    // 6. SecurityContext에 인증 정보 설정
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                    
                    System.out.println("✅ JWT 인증 성공: " + username);
                }
            }
        } catch (Exception e) {
            // JWT 파싱 또는 검증 실패 시 로그 출력하고 계속 진행
            System.err.println("❌ JWT 토큰 처리 중 오류 발생: " + e.getMessage());
        }

        // 7. 다음 필터로 진행
        filterChain.doFilter(request, response);
    }

    /**
     * 특정 경로에서는 이 필터를 건너뛸 수 있음
     * 예: /api/users/login, /api/users/signup 등
     */
    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        String path = request.getRequestURI();
        return path.startsWith("/api/users/login") || 
               path.startsWith("/api/users/signup") ||
               (path.startsWith("/api/products") && request.getMethod().equals("GET"));
    }
}
