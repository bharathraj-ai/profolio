package com.bharathraj.portfolio.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record ProfileRequest(
        @NotBlank String fullName,
        @NotBlank String roleTitle,
        String tagline,
        String introText,
        String githubUrl,
        String linkedinUrl,
        @Email String email,
        String avatarUrl,
        String resumeUrl
) {}
