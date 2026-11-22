package com.bharathraj.portfolio.dto;

public record EducationRequest(
        String degree,
        String institution,
        String fieldOfStudy,
        Integer startYear,
        Integer endYear,
        boolean isCurrent,
        String description,
        int sortOrder
) {}
