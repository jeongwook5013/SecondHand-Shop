package com.example.market.secondhandshop.controller;

import com.example.market.secondhandshop.dto.LoginRequestDto;
import com.example.market.secondhandshop.dto.UserRequestDto;
import com.example.market.secondhandshop.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

/**
 * 사용자 관련 API를 처리하는 컨트롤러 (보안 강화 버전)
 * 
 * 보안 기능:
 * 1. JWT 토큰 반환 (로그인 시)
 * 2. 구조적 JSON 응답
 * 3. 적절한 HTTP 상태 코드
 */
@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    /**
     * 회원가입 API
     * 
     * @param requestDto 회원가입 요청 정보 (username, password, email)
     * @return 성공/실패 메시지
     */
    @PostMapping("/signup")
    public ResponseEntity<?> signUp(@RequestBody UserRequestDto requestDto) {
        try {
            userService.signUp(requestDto);
            
            Map<String, String> response = new HashMap<>();
            response.put("message", "회원가입이 완료되었습니다.");
            
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (IllegalArgumentException e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", e.getMessage());
            
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        }
    }

    /**
     * 로그인 API
     * 
     * @param requestDto 로그인 요청 정보 (username, password)
     * @return JWT 토큰과 사용자 정보
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequestDto requestDto) {
        try {
            String jwtToken = userService.login(requestDto);
            
            // 🎫 JWT 토큰을 포함한 구조적 응답
            Map<String, Object> response = new HashMap<>();
            response.put("message", "로그인 성공");
            response.put("token", jwtToken);
            response.put("username", requestDto.getUsername());
            response.put("tokenType", "Bearer");
            
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", e.getMessage());
            
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorResponse);
        }
    }
}
