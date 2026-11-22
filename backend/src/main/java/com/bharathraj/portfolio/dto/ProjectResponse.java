package com.bharathraj.portfolio.dto;

import java.util.List;

public record ProjectResponse(
        Long id,
        String name,
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
