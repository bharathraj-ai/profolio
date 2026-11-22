package com.bharathraj.portfolio.dto;

import jakarta.validation.constraints.NotBlank;

public record CertificationRequest(
        @NotBlank String name,
        String issuer,
        Integer issuedYear,
        String certUrl,
        int sortOrder
) {}
