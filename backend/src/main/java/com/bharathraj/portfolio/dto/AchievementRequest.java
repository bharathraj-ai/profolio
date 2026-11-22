package com.bharathraj.portfolio.dto;

import jakarta.validation.constraints.NotBlank;

public record AchievementRequest(
        @NotBlank String placeLabel,
        String medalType,
        @NotBlank String title,
        @NotBlank String eventName,
        int sortOrder
) {}
