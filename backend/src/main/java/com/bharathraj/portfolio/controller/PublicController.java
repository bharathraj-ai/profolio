package com.bharathraj.portfolio.controller;

import com.bharathraj.portfolio.dto.AchievementResponse;
import com.bharathraj.portfolio.dto.ApiResponse;
import com.bharathraj.portfolio.dto.CertificationResponse;
import com.bharathraj.portfolio.dto.CodingProfileResponse;
import com.bharathraj.portfolio.dto.EducationResponse;
import com.bharathraj.portfolio.dto.ProfileResponse;
import com.bharathraj.portfolio.dto.ProjectResponse;
import com.bharathraj.portfolio.dto.SkillCategoryResponse;
import com.bharathraj.portfolio.service.AchievementService;
import com.bharathraj.portfolio.service.CertificationService;
import com.bharathraj.portfolio.service.CodingProfileService;
import com.bharathraj.portfolio.service.EducationService;
import com.bharathraj.portfolio.service.ProfileService;
import com.bharathraj.portfolio.service.ProjectService;
import com.bharathraj.portfolio.service.SkillService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/public")
public class PublicController {

    private final ProfileService profileService;
    private final EducationService educationService;
    private final SkillService skillService;
    private final ProjectService projectService;
    private final AchievementService achievementService;
    private final CertificationService certificationService;
    private final CodingProfileService codingProfileService;

    public PublicController(ProfileService profileService,
                            EducationService educationService,
                            SkillService skillService,
                            ProjectService projectService,
                            AchievementService achievementService,
                            CertificationService certificationService,
                            CodingProfileService codingProfileService) {
        this.profileService = profileService;
        this.educationService = educationService;
        this.skillService = skillService;
        this.projectService = projectService;
        this.achievementService = achievementService;
        this.certificationService = certificationService;
        this.codingProfileService = codingProfileService;
    }

    @GetMapping("/profile")
    public ResponseEntity<ApiResponse<ProfileResponse>> getProfile() {
        return ResponseEntity.ok(ApiResponse.ok(profileService.findProfile()));
    }

    @GetMapping("/education")
    public ResponseEntity<ApiResponse<List<EducationResponse>>> getEducation() {
        return ResponseEntity.ok(ApiResponse.ok(educationService.findAll()));
    }

    @GetMapping("/skills")
    public ResponseEntity<ApiResponse<List<SkillCategoryResponse>>> getSkills() {
        return ResponseEntity.ok(ApiResponse.ok(skillService.findAllCategories()));
    }

    @GetMapping("/projects")
    public ResponseEntity<ApiResponse<List<ProjectResponse>>> getProjects() {
        return ResponseEntity.ok(ApiResponse.ok(projectService.findAll()));
    }

    @GetMapping("/achievements")
    public ResponseEntity<ApiResponse<List<AchievementResponse>>> getAchievements() {
        return ResponseEntity.ok(ApiResponse.ok(achievementService.findAll()));
    }

    @GetMapping("/certifications")
    public ResponseEntity<ApiResponse<List<CertificationResponse>>> getCertifications() {
        return ResponseEntity.ok(ApiResponse.ok(certificationService.findAll()));
    }

    @GetMapping("/coding-profiles")
    public ResponseEntity<ApiResponse<List<CodingProfileResponse>>> getCodingProfiles() {
        return ResponseEntity.ok(ApiResponse.ok(codingProfileService.findAll()));
    }

    @GetMapping("/profiles")
    public ResponseEntity<ApiResponse<List<CodingProfileResponse>>> getProfilesAlias() {
        return ResponseEntity.ok(ApiResponse.ok(codingProfileService.findAll()));
    }
}

