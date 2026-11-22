package com.bharathraj.portfolio.service;

import com.bharathraj.portfolio.dto.ProfileRequest;
import com.bharathraj.portfolio.dto.ProfileResponse;
import com.bharathraj.portfolio.entity.Profile;
import com.bharathraj.portfolio.exception.ResourceNotFoundException;
import com.bharathraj.portfolio.repository.ProfileRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@Transactional
public class ProfileService {

    private final ProfileRepository profileRepository;

    public ProfileService(ProfileRepository profileRepository) {
        this.profileRepository = profileRepository;
    }

    @Transactional(readOnly = true)
    public ProfileResponse findProfile() {
        Profile profile = profileRepository.findAll().stream()
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("Profile", "default", "1"));
        return mapToResponse(profile);
    }

    public ProfileResponse updateProfile(ProfileRequest req) {
        Profile profile = profileRepository.findAll().stream()
                .findFirst()
                .orElseGet(Profile::new);

        profile.setFullName(req.fullName());
        profile.setRoleTitle(req.roleTitle());
        profile.setTagline(req.tagline());
        profile.setIntroText(req.introText());
        profile.setGithubUrl(req.githubUrl());
        profile.setLinkedinUrl(req.linkedinUrl());
        profile.setEmail(req.email());
        profile.setAvatarUrl(req.avatarUrl());
        profile.setResumeUrl(req.resumeUrl());
        profile.setUpdatedAt(LocalDateTime.now());
        if (profile.getCreatedAt() == null) {
            profile.setCreatedAt(LocalDateTime.now());
        }

        Profile saved = profileRepository.save(profile);
        return mapToResponse(saved);
    }

    private ProfileResponse mapToResponse(Profile p) {
        return new ProfileResponse(
                p.getId(),
                p.getFullName(),
                p.getRoleTitle(),
                p.getTagline(),
                p.getIntroText(),
                p.getGithubUrl(),
                p.getLinkedinUrl(),
                p.getEmail(),
                p.getAvatarUrl(),
                p.getResumeUrl()
        );
    }
}

