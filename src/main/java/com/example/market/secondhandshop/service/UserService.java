package com.example.market.secondhandshop.service;


import com.example.market.secondhandshop.dto.LoginRequestDto;
import com.example.market.secondhandshop.dto.UserRequestDto;
import com.example.market.secondhandshop.entity.User;
import com.example.market.secondhandshop.repository.UserRepository;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {


    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;

    }

    @Transactional
    public void signUp(UserRequestDto requestDto) {
        //1. DTO에서 사용자 정보 가져오기
        String username = requestDto.getUsername();
        String password = requestDto.getPassword();
        String email = requestDto.getEmail();

        //2. 새로운 User엔티티 생성
        User user = new User();
        user.setUsername(username);
        user.setPassword(password); //실제로는 비밀번호를 암호화 해야함.
        user.setEmail(email);

        //3. 엔티티를 데이터베이스에 저장
        userRepository.save(user);
    }

    //로그인 로직임
    @Transactional(readOnly = true)
    public String login(LoginRequestDto requestDto){
        //1. DTO에서 사용자 이름, 비필번호를 가져옴
        String username = requestDto.getUsername();
        String password = requestDto.getPassword();

        //2. UserRepository에 사용자 이름이 있는지 찾아본다
        Optional<User> userOptional = userRepository.findByUsername(username);

        //3. 사용자가 존재하지 않거나 비밀번호가 일치하지 않으면 예외 처리
        if (userOptional.isEmpty()){
            throw new IllegalArgumentException("사용자를 찾을 수 없습니다.");
        }

        User user = userOptional.get();
        if(!user.getPassword().equals(password)){
            throw new IllegalArgumentException("비밀번호가 일치하지 않습니다.");
        }

        //4. 모든 검증 통과하면 성공 메시지 반환
        return "로그인 성공!";
    }
}
