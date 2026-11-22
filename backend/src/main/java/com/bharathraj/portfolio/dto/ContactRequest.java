package com.bharathraj.portfolio.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ContactRequest(
        @NotBlank String name,
        @Email @NotBlank String email,
        @NotBlank @Size(max = 2000) String message
) {}
