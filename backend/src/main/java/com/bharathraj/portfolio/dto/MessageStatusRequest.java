package com.bharathraj.portfolio.dto;

import jakarta.validation.constraints.NotBlank;

public record MessageStatusRequest(
        @NotBlank String status
) {}
