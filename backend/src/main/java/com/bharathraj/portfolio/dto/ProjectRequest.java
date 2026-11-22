package com.bharathraj.portfolio.dto;

import jakarta.validation.constraints.NotBlank;

import java.util.List;

public record ProjectRequest(
        @NotBlank String name,
        String tagline,
        String description,
        String githubUrl,
        String demoUrl,
        String imageUrl,
        boolean isFeatured,
        int sortOrder,
        List<String> technologies,
        List<String> features
) {}
