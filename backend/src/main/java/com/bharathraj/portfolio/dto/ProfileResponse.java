package com.bharathraj.portfolio.dto;

public record ProfileResponse(
        Long id,
        String fullName,
        String roleTitle,
        String tagline,
        String introText,
        String githubUrl,
        String linkedinUrl,
        String email,
        String avatarUrl,
        String resumeUrl
) {}
