package com.bharathraj.portfolio.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record SkillRequest(
        @NotBlank String name,
        @NotNull Long categoryId,
        int sortOrder
) {}
