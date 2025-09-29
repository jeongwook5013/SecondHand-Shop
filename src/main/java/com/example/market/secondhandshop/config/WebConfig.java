package com.example.market.secondhandshop.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * 웹 MVC 설정
 * 
 * 주요 기능:
 * 1. 업로드된 이미지 파일을 URL로 접근 가능하도록 설정
 * 2. 정적 리소스 경로 매핑
 */
@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Value("${file.upload.directory:uploads/}")
    private String uploadDirectory;

    /**
     * 정적 리소스 핸들러 설정
     * 
     * /uploads/** URL로 요청이 오면 실제 파일 디렉토리에서 파일을 서빙
     */
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        
        System.out.println("🌐 정적 리소스 핸들러 설정: /uploads/** -> " + uploadDirectory);
        
        // 업로드된 파일 서빙
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations("file:" + uploadDirectory)
                .setCachePeriod(3600); // 1시간 캐시
        
        // 기본 정적 리소스 (필요시)
        registry.addResourceHandler("/static/**")
                .addResourceLocations("classpath:/static/")
                .setCachePeriod(3600);
    }
}
