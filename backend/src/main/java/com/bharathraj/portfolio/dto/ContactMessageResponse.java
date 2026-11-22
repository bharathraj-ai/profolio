package com.bharathraj.portfolio.dto;

import java.time.Instant;

public record ContactMessageResponse(
        Long id,
        String senderName,
        String senderEmail,
        String message,
        Instant submittedAt,
        String status
) {}
