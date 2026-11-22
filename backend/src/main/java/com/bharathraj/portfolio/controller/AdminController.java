package com.bharathraj.portfolio.controller;

import com.bharathraj.portfolio.dto.AchievementRequest;
import com.bharathraj.portfolio.dto.AchievementResponse;
import com.bharathraj.portfolio.dto.ApiResponse;
import com.bharathraj.portfolio.dto.CertificationRequest;
import com.bharathraj.portfolio.dto.CertificationResponse;
import com.bharathraj.portfolio.dto.CodingProfileRequest;
import com.bharathraj.portfolio.dto.CodingProfileResponse;
import com.bharathraj.portfolio.dto.ContactMessageResponse;
import com.bharathraj.portfolio.dto.EducationRequest;
import com.bharathraj.portfolio.dto.EducationResponse;
import com.bharathraj.portfolio.dto.MessageStatusRequest;
import com.bharathraj.portfolio.dto.ProfileRequest;
import com.bharathraj.portfolio.dto.ProfileResponse;
import com.bharathraj.portfolio.dto.ProjectRequest;
import com.bharathraj.portfolio.dto.ProjectResponse;
import com.bharathraj.portfolio.dto.SkillCategoryRequest;
import com.bharathraj.portfolio.dto.SkillCategoryResponse;
import com.bharathraj.portfolio.dto.SkillRequest;
import com.bharathraj.portfolio.dto.SkillResponse;
import com.bharathraj.portfolio.service.AchievementService;
import com.bharathraj.portfolio.service.CertificationService;
import com.bharathraj.portfolio.service.CodingProfileService;
import com.bharathraj.portfolio.service.ContactService;
import com.bharathraj.portfolio.service.EducationService;
import com.bharathraj.portfolio.service.ProfileService;
import com.bharathraj.portfolio.service.ProjectService;
import com.bharathraj.portfolio.service.SkillService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final ProfileService profileService;
    private final EducationService educationService;
    private final SkillService skillService;
    private final ProjectService projectService;
    private final AchievementService achievementService;
    private final CertificationService certificationService;
    private final CodingProfileService codingProfileService;
    private final ContactService contactService;

    public AdminController(ProfileService profileService,
                           EducationService educationService,
                           SkillService skillService,
                           ProjectService projectService,
                           AchievementService achievementService,
                           CertificationService certificationService,
                           CodingProfileService codingProfileService,
                           ContactService contactService) {
        this.profileService = profileService;
        this.educationService = educationService;
        this.skillService = skillService;
        this.projectService = projectService;
        this.achievementService = achievementService;
        this.certificationService = certificationService;
        this.codingProfileService = codingProfileService;
        this.contactService = contactService;
    }

    // --- Profile ---
    @GetMapping("/profile")
    public ResponseEntity<ApiResponse<ProfileResponse>> getProfile() {
        return ResponseEntity.ok(ApiResponse.ok(profileService.findProfile()));
    }

    @PutMapping("/profile")
    public ResponseEntity<ApiResponse<ProfileResponse>> updateProfile(@Valid @RequestBody ProfileRequest req) {
        return ResponseEntity.ok(ApiResponse.ok(profileService.updateProfile(req)));
    }

    // --- Education ---
    @GetMapping("/education")
    public ResponseEntity<ApiResponse<List<EducationResponse>>> getEducation() {
        return ResponseEntity.ok(ApiResponse.ok(educationService.findAll()));
    }

    @PostMapping("/education")
    public ResponseEntity<ApiResponse<EducationResponse>> createEducation(@Valid @RequestBody EducationRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok(educationService.create(req)));
    }

    @PutMapping("/education/{id}")
    public ResponseEntity<ApiResponse<EducationResponse>> updateEducation(@PathVariable Long id,
                                                                          @Valid @RequestBody EducationRequest req) {
        return ResponseEntity.ok(ApiResponse.ok(educationService.update(id, req)));
    }

    @DeleteMapping("/education/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteEducation(@PathVariable Long id) {
        educationService.delete(id);
        return ResponseEntity.ok(ApiResponse.ok(null));
    }

    // --- Skills ---
    @GetMapping("/skills")
    public ResponseEntity<ApiResponse<List<SkillCategoryResponse>>> getSkills() {
        return ResponseEntity.ok(ApiResponse.ok(skillService.findAllCategories()));
    }

    @PostMapping("/skills/categories")
    public ResponseEntity<ApiResponse<SkillCategoryResponse>> createCategory(@Valid @RequestBody SkillCategoryRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok(skillService.createCategory(req)));
    }

    @PutMapping("/skills/categories/{id}")
    public ResponseEntity<ApiResponse<SkillCategoryResponse>> updateCategory(@PathVariable Long id,
                                                                             @Valid @RequestBody SkillCategoryRequest req) {
        return ResponseEntity.ok(ApiResponse.ok(skillService.updateCategory(id, req)));
    }

    @DeleteMapping("/skills/categories/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteCategory(@PathVariable Long id) {
        skillService.deleteCategory(id);
        return ResponseEntity.ok(ApiResponse.ok(null));
    }

    @PostMapping("/skills")
    public ResponseEntity<ApiResponse<SkillResponse>> createSkill(@Valid @RequestBody SkillRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok(skillService.createSkill(req)));
    }

    @PutMapping("/skills/{id}")
    public ResponseEntity<ApiResponse<SkillResponse>> updateSkill(@PathVariable Long id,
                                                                 @Valid @RequestBody SkillRequest req) {
        return ResponseEntity.ok(ApiResponse.ok(skillService.updateSkill(id, req)));
    }

    @DeleteMapping("/skills/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteSkill(@PathVariable Long id) {
        skillService.deleteSkill(id);
        return ResponseEntity.ok(ApiResponse.ok(null));
    }

    // --- Projects ---
    @GetMapping("/projects")
    public ResponseEntity<ApiResponse<List<ProjectResponse>>> getProjects() {
        return ResponseEntity.ok(ApiResponse.ok(projectService.findAll()));
    }

    @GetMapping("/projects/{id}")
    public ResponseEntity<ApiResponse<ProjectResponse>> getProjectById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(projectService.findById(id)));
    }

    @PostMapping("/projects")
    public ResponseEntity<ApiResponse<ProjectResponse>> createProject(@Valid @RequestBody ProjectRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok(projectService.create(req)));
    }

    @PutMapping("/projects/{id}")
    public ResponseEntity<ApiResponse<ProjectResponse>> updateProject(@PathVariable Long id,
                                                                      @Valid @RequestBody ProjectRequest req) {
        return ResponseEntity.ok(ApiResponse.ok(projectService.update(id, req)));
    }

    @DeleteMapping("/projects/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteProject(@PathVariable Long id) {
        projectService.delete(id);
        return ResponseEntity.ok(ApiResponse.ok(null));
    }

    // --- Achievements ---
    @GetMapping("/achievements")
    public ResponseEntity<ApiResponse<List<AchievementResponse>>> getAchievements() {
        return ResponseEntity.ok(ApiResponse.ok(achievementService.findAll()));
    }

    @PostMapping("/achievements")
    public ResponseEntity<ApiResponse<AchievementResponse>> createAchievement(@Valid @RequestBody AchievementRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok(achievementService.create(req)));
    }

    @PutMapping("/achievements/{id}")
    public ResponseEntity<ApiResponse<AchievementResponse>> updateAchievement(@PathVariable Long id,
                                                                              @Valid @RequestBody AchievementRequest req) {
        return ResponseEntity.ok(ApiResponse.ok(achievementService.update(id, req)));
    }

    @DeleteMapping("/achievements/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteAchievement(@PathVariable Long id) {
        achievementService.delete(id);
        return ResponseEntity.ok(ApiResponse.ok(null));
    }

    // --- Certifications ---
    @GetMapping("/certifications")
    public ResponseEntity<ApiResponse<List<CertificationResponse>>> getCertifications() {
        return ResponseEntity.ok(ApiResponse.ok(certificationService.findAll()));
    }

    @PostMapping("/certifications")
    public ResponseEntity<ApiResponse<CertificationResponse>> createCertification(@Valid @RequestBody CertificationRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok(certificationService.create(req)));
    }

    @PutMapping("/certifications/{id}")
    public ResponseEntity<ApiResponse<CertificationResponse>> updateCertification(@PathVariable Long id,
                                                                                  @Valid @RequestBody CertificationRequest req) {
        return ResponseEntity.ok(ApiResponse.ok(certificationService.update(id, req)));
    }

    @DeleteMapping("/certifications/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteCertification(@PathVariable Long id) {
        certificationService.delete(id);
        return ResponseEntity.ok(ApiResponse.ok(null));
    }

    // --- Coding Profiles ---
    @GetMapping("/coding-profiles")
    public ResponseEntity<ApiResponse<List<CodingProfileResponse>>> getCodingProfiles() {
        return ResponseEntity.ok(ApiResponse.ok(codingProfileService.findAll()));
    }

    @PostMapping("/coding-profiles")
    public ResponseEntity<ApiResponse<CodingProfileResponse>> createCodingProfile(@Valid @RequestBody CodingProfileRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok(codingProfileService.create(req)));
    }

    @PutMapping("/coding-profiles/{id}")
    public ResponseEntity<ApiResponse<CodingProfileResponse>> updateCodingProfile(@PathVariable Long id,
                                                                                  @Valid @RequestBody CodingProfileRequest req) {
        return ResponseEntity.ok(ApiResponse.ok(codingProfileService.update(id, req)));
    }

    @DeleteMapping("/coding-profiles/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteCodingProfile(@PathVariable Long id) {
        codingProfileService.delete(id);
        return ResponseEntity.ok(ApiResponse.ok(null));
    }

    // --- Messages ---
    @GetMapping("/messages")
    public ResponseEntity<ApiResponse<List<ContactMessageResponse>>> getMessages(
            @RequestParam(required = false) String status) {
        return ResponseEntity.ok(ApiResponse.ok(contactService.findByStatus(status)));
    }

    @PutMapping("/messages/{id}/status")
    public ResponseEntity<ApiResponse<ContactMessageResponse>> updateMessageStatus(
            @PathVariable Long id,
            @Valid @RequestBody MessageStatusRequest req) {
        return ResponseEntity.ok(ApiResponse.ok(contactService.updateStatus(id, req.status())));
    }
}

