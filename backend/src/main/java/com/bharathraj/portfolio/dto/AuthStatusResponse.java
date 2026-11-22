package com.bharathraj.portfolio.dto;

public record AuthStatusResponse(
        boolean authenticated,
        String email
) {}

