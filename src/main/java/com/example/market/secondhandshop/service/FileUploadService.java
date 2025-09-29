package com.example.market.secondhandshop.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;

/**
 * 파일 업로드 처리 서비스
 * 
 * 기능:
 * 1. 이미지 파일 검증 (확장자, 크기)
 * 2. 고유한 파일명 생성
 * 3. 로컬 저장소에 파일 저장
 * 4. 파일 URL 반환
 */
@Service
public class FileUploadService {

    // application.properties에서 설정
    @Value("${file.upload.directory:uploads/}")
    private String uploadDirectory;

    @Value("${file.upload.max-size:10485760}") // 10MB
    private long maxFileSize;

    // 허용할 이미지 확장자
    private final List<String> allowedExtensions = Arrays.asList(
        "jpg", "jpeg", "png", "gif", "webp"
    );

    /**
     * 단일 이미지 파일 업로드
     */
    public String uploadImage(MultipartFile file) throws IOException {
        
        // 1. 파일 유효성 검증
        validateImageFile(file);
        
        // 2. 업로드 디렉토리 생성
        createUploadDirectory();
        
        // 3. 고유한 파일명 생성
        String fileName = generateUniqueFileName(file.getOriginalFilename());
        
        // 4. 파일 저장
        Path filePath = Paths.get(uploadDirectory, fileName);
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
        
        System.out.println("📁 파일 업로드 성공: " + fileName);
        
        // 5. 접근 가능한 URL 반환
        return "/uploads/" + fileName;
    }

    /**
     * 여러 이미지 파일 업로드
     */
    public List<String> uploadImages(List<MultipartFile> files) throws IOException {
        return files.stream()
                .map(file -> {
                    try {
                        return uploadImage(file);
                    } catch (IOException e) {
                        throw new RuntimeException("파일 업로드 실패: " + file.getOriginalFilename(), e);
                    }
                })
                .toList();
    }

    /**
     * 이미지 파일 검증
     */
    private void validateImageFile(MultipartFile file) {
        
        // 빈 파일 체크
        if (file.isEmpty()) {
            throw new IllegalArgumentException("빈 파일은 업로드할 수 없습니다.");
        }
        
        // 파일 크기 체크
        if (file.getSize() > maxFileSize) {
            throw new IllegalArgumentException("파일 크기는 " + (maxFileSize / 1024 / 1024) + "MB를 초과할 수 없습니다.");
        }
        
        // 파일 확장자 체크
        String originalFilename = file.getOriginalFilename();
        if (originalFilename == null || !hasValidImageExtension(originalFilename)) {
            throw new IllegalArgumentException("허용되지 않는 파일 형식입니다. " + 
                "허용 형식: " + String.join(", ", allowedExtensions));
        }
        
        // MIME 타입 체크 (추가 보안)
        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            throw new IllegalArgumentException("이미지 파일만 업로드 가능합니다.");
        }
    }

    /**
     * 유효한 이미지 확장자인지 확인
     */
    private boolean hasValidImageExtension(String filename) {
        String extension = getFileExtension(filename).toLowerCase();
        return allowedExtensions.contains(extension);
    }

    /**
     * 파일 확장자 추출
     */
    private String getFileExtension(String filename) {
        int lastDotIndex = filename.lastIndexOf('.');
        if (lastDotIndex == -1) {
            return "";
        }
        return filename.substring(lastDotIndex + 1);
    }

    /**
     * 고유한 파일명 생성
     * 형식: UUID_날짜시간.확장자
     */
    private String generateUniqueFileName(String originalFilename) {
        String extension = getFileExtension(originalFilename);
        String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd_HHmmss"));
        String uuid = UUID.randomUUID().toString().substring(0, 8);
        
        return uuid + "_" + timestamp + "." + extension;
    }

    /**
     * 업로드 디렉토리 생성
     */
    private void createUploadDirectory() throws IOException {
        Path uploadPath = Paths.get(uploadDirectory);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
            System.out.println("📁 업로드 디렉토리 생성: " + uploadPath.toAbsolutePath());
        }
    }

    /**
     * 파일 삭제 (상품 삭제 시 사용)
     */
    public void deleteFile(String fileUrl) {
        if (fileUrl == null || !fileUrl.startsWith("/uploads/")) {
            return;
        }
        
        String fileName = fileUrl.substring("/uploads/".length());
        Path filePath = Paths.get(uploadDirectory, fileName);
        
        try {
            Files.deleteIfExists(filePath);
            System.out.println("🗑️ 파일 삭제: " + fileName);
        } catch (IOException e) {
            // 파일 삭제 실패는 로그만 남기고 계속 진행
            System.err.println("❌ 파일 삭제 실패: " + filePath + ", 오류: " + e.getMessage());
        }
    }
}
