package com.bharathraj.portfolio.dto;

import jakarta.validation.constraints.NotBlank;

public record SkillCategoryRequest(
        @NotBlank String name,
        String iconText,
        int sortOrder
) {}
