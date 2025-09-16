package com.example.market.secondhandshop.service;

import com.example.market.secondhandshop.dto.LoginRequestDto;
import com.example.market.secondhandshop.dto.UserRequestDto;
import com.example.market.secondhandshop.entity.User;
import com.example.market.secondhandshop.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.stereotype.Service;

import java.util.Optional;

/**
 * 사용자 관련 비즈니스 로직을 처리하는 서비스 (보안 강화 버전)
 * 
 * 보안 기능:
 * 1. BCrypt 비밀번호 암호화
 * 2. JWT 토큰 기반 인증
 * 3. 중복 검증
 */
@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;  // 비밀번호 암호화
    private final JwtService jwtService;           // JWT 토큰 관리

    public UserService(UserRepository userRepository, 
                      PasswordEncoder passwordEncoder,
                      JwtService jwtService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    /**
     * 회원가입 로직
     * 
     * 보안 처리:
     * 1. 중복 검증 (username, email)
     * 2. 비밀번호 BCrypt 암호화
     */
    @Transactional
    public void signUp(UserRequestDto requestDto) {
        String username = requestDto.getUsername();
        String password = requestDto.getPassword();
        String email = requestDto.getEmail();

        // 중복 검증
        if (userRepository.findByUsername(username).isPresent()) {
            throw new IllegalArgumentException("이미 존재하는 사용자명입니다.");
        }
        
        if (userRepository.findByEmail(email).isPresent()) {
            throw new IllegalArgumentException("이미 존재하는 이메일입니다.");
        }

        // User 엔티티 생성
        User user = new User();
        user.setUsername(username);
        user.setPassword(passwordEncoder.encode(password)); // 🔐 비밀번호 암호화
        user.setEmail(email);

        // 데이터베이스에 저장
        userRepository.save(user);
    }

    /**
     * 로그인 로직
     * 
     * 보안 처리:
     * 1. 암호화된 비밀번호와 비교
     * 2. JWT 토큰 생성 및 반환
     */
    @Transactional(readOnly = true)
    public String login(LoginRequestDto requestDto) {
        String username = requestDto.getUsername();
        String password = requestDto.getPassword();

        // 사용자 조회
        Optional<User> userOptional = userRepository.findByUsername(username);
        
        if (userOptional.isEmpty()) {
            throw new IllegalArgumentException("사용자를 찾을 수 없습니다.");
        }

        User user = userOptional.get();
        
        // 🔐 암호화된 비밀번호와 비교
        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new IllegalArgumentException("비밀번호가 일치하지 않습니다.");
        }

        // 🎫 JWT 토큰 생성 및 반환
        return jwtService.generateToken(username);
    }
}
