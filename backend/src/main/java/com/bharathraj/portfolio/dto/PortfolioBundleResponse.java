package com.bharathraj.portfolio.dto;

import java.util.List;

public record PortfolioBundleResponse(
        ProfileResponse profile,
        List<EducationResponse> education,
        List<SkillCategoryResponse> skills,
        List<ProjectResponse> projects,
        List<AchievementResponse> achievements,
        List<CertificationResponse> certifications,
        List<CodingProfileResponse> codingProfiles
) {
}

