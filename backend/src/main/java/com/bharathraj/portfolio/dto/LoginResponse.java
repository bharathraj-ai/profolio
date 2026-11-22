package com.bharathraj.portfolio.dto;

public record LoginResponse(
        String token,
        String email,
        String message
) {
}

