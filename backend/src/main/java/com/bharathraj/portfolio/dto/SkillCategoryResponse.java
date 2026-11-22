package com.bharathraj.portfolio.dto;

import java.util.List;

public record SkillCategoryResponse(
        Long id,
        String name,
        String iconText,
        List<SkillResponse> skills
) {}
