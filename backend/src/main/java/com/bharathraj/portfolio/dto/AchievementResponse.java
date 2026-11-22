package com.bharathraj.portfolio.dto;

public record AchievementResponse(
        Long id,
        String placeLabel,
        String medalType,
        String title,
        String eventName,
        int sortOrder
) {}
