package com.bharathraj.portfolio.controller;

import com.bharathraj.portfolio.dto.ApiResponse;
import com.bharathraj.portfolio.dto.ProfileResponse;
import com.bharathraj.portfolio.entity.Profile;
import com.bharathraj.portfolio.repository.ProfileRepository;
import com.bharathraj.portfolio.service.FileUploadService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/admin")
public class UploadController {

    private final FileUploadService fileUploadService;
    private final ProfileRepository profileRepository;

    public UploadController(FileUploadService fileUploadService, ProfileRepository profileRepository) {
        this.fileUploadService = fileUploadService;
        this.profileRepository = profileRepository;
    }

    @PostMapping("/upload")
    public ResponseEntity<ApiResponse<String>> uploadFile(@RequestParam("file") MultipartFile file) {
        try {
            String fileUrl = fileUploadService.saveFile(file);
            return ResponseEntity.ok(ApiResponse.ok(fileUrl));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error(e.getMessage()));
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to save uploaded file: " + e.getMessage()));
        }
    }

    @PostMapping("/profile/avatar")
    public ResponseEntity<ApiResponse<ProfileResponse>> uploadAvatar(@RequestParam("file") MultipartFile file) {
        try {
            String fileUrl = fileUploadService.saveFile(file);
            Profile profile = profileRepository.findAll().stream().findFirst().orElseGet(() -> {
                Profile p = new Profile();
                p.setFullName("Bharathraj S");
                p.setRoleTitle("Software Developer");
                p.setCreatedAt(LocalDateTime.now());
                return p;
            });

            profile.setAvatarUrl(fileUrl);
            profile.setUpdatedAt(LocalDateTime.now());
            Profile saved = profileRepository.save(profile);

            ProfileResponse response = new ProfileResponse(
                    saved.getId(),
                    saved.getFullName(),
                    saved.getRoleTitle(),
                    saved.getTagline(),
                    saved.getIntroText(),
                    saved.getGithubUrl(),
                    saved.getLinkedinUrl(),
                    saved.getEmail(),
                    saved.getAvatarUrl(),
                    saved.getResumeUrl()
            );

            return ResponseEntity.ok(ApiResponse.ok(response));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error(e.getMessage()));
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to upload avatar: " + e.getMessage()));
        }
    }
}

