package com.bharathraj.portfolio.dto;

import jakarta.validation.constraints.NotBlank;

public record CodingProfileRequest(
        @NotBlank String platformName,
        String iconText,
        String description,
        @NotBlank String profileUrl,
        int sortOrder
) {}
