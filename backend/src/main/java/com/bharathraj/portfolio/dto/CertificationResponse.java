package com.bharathraj.portfolio.dto;

public record CertificationResponse(
        Long id,
        String name,
        String issuer,
        Integer issuedYear,
        String certUrl
) {}
