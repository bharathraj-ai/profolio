package com.bharathraj.portfolio.dto;

public record CodingProfileResponse(
        Long id,
        String platformName,
        String iconText,
        String description,
        String profileUrl
) {}
