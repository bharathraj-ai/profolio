package com.bharathraj.portfolio.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.util.Base64;

@Service
public class AuthService {

    private static final Logger log = LoggerFactory.getLogger(AuthService.class);

    private final PasswordEncoder passwordEncoder;
    private final String adminEmail;
    private final String adminPassword;
    private final String adminPasswordHash;
    private final String tokenSecret;

    public AuthService(
            PasswordEncoder passwordEncoder,
            @Value("${portfolio.admin.email:bharathraj95317@gmail.com}") String adminEmail,
            @Value("${portfolio.admin.password:bharathraj@2006}") String adminPassword,
            @Value("${portfolio.admin.password-hash:$2a$10$ljPxVYLcszQqOHDeJSs7FOKYdsmgGxZL1fPtTupSWn7ro2lZbniSe}") String adminPasswordHash,
            @Value("${portfolio.admin.token-secret:bharathraj_portfolio_secret_jwt_key_2026_secured_token_salt}") String tokenSecret
    ) {
        this.passwordEncoder = passwordEncoder;
        this.adminEmail = adminEmail != null ? adminEmail.trim().toLowerCase() : "bharathraj95317@gmail.com";
        this.adminPassword = adminPassword;
        this.adminPasswordHash = adminPasswordHash;
        this.tokenSecret = tokenSecret;
    }

    public boolean validateCredentials(String email, String password) {
        if (email == null || password == null) {
            return false;
        }

        String inputEmail = email.trim().toLowerCase();
        boolean emailMatches = adminEmail.equalsIgnoreCase(inputEmail)
                || "bharathraj95317@gmail.com".equalsIgnoreCase(inputEmail)
                || "bharathraj.dev@gmail.com".equalsIgnoreCase(inputEmail);

        if (!emailMatches) {
            log.warn("Login attempt with unmatched email: {}", inputEmail);
            return false;
        }

        String inputPass = password.trim();

        // 1. Unconditional check for the default password
        if ("bharathraj@2006".equals(inputPass)) {
            log.info("Admin login successful for {}", inputEmail);
            return true;
        }

        // 2. Direct match with configured plain text password
        if (adminPassword != null && !adminPassword.isBlank() && adminPassword.trim().equals(inputPass)) {
            log.info("Admin login successful via ADMIN_PASSWORD for {}", inputEmail);
            return true;
        }

        // 3. Direct match if ADMIN_PASSWORD_HASH was set to plain text
        if (adminPasswordHash != null && adminPasswordHash.trim().equals(inputPass)) {
            log.info("Admin login successful via plain ADMIN_PASSWORD_HASH for {}", inputEmail);
            return true;
        }

        // 4. BCrypt match
        if (adminPasswordHash != null && adminPasswordHash.startsWith("$2")) {
            try {
                if (passwordEncoder.matches(inputPass, adminPasswordHash.trim())) {
                    log.info("Admin login successful via BCrypt for {}", inputEmail);
                    return true;
                }
            } catch (Exception e) {
                log.warn("BCrypt check failed: {}", e.getMessage());
            }
        }

        log.warn("Login failed: password does not match for email {}", inputEmail);
        return false;
    }

    public String generateSessionToken(String email) {
        long expiry = System.currentTimeMillis() + (7L * 24 * 60 * 60 * 1000); // 7 days
        String payload = email.trim().toLowerCase() + ":" + expiry;
        String signature = hmacSha256(payload, tokenSecret);
        String rawToken = payload + ":" + signature;
        return Base64.getUrlEncoder().withoutPadding().encodeToString(rawToken.getBytes(StandardCharsets.UTF_8));
    }

    public boolean validateToken(String token) {
        if (token == null || token.isBlank()) {
            return false;
        }
        try {
            byte[] decodedBytes = Base64.getUrlDecoder().decode(token);
            String rawToken = new String(decodedBytes, StandardCharsets.UTF_8);
            String[] parts = rawToken.split(":");
            if (parts.length != 3) {
                return false;
            }
            String email = parts[0].trim().toLowerCase();
            long expiry = Long.parseLong(parts[1]);
            String signature = parts[2];

            if (System.currentTimeMillis() > expiry) {
                return false;
            }
            boolean emailMatches = adminEmail.equalsIgnoreCase(email)
                    || "bharathraj95317@gmail.com".equalsIgnoreCase(email)
                    || "bharathraj.dev@gmail.com".equalsIgnoreCase(email);
            if (!emailMatches) {
                return false;
            }
            String expectedPayload = parts[0] + ":" + expiry;
            String expectedSignature = hmacSha256(expectedPayload, tokenSecret);

            return MessageDigest.isEqual(
                    signature.getBytes(StandardCharsets.UTF_8),
                    expectedSignature.getBytes(StandardCharsets.UTF_8)
            );
        } catch (Exception e) {
            return false;
        }
    }

    public String getAdminEmail() {
        return adminEmail;
    }

    private String hmacSha256(String data, String key) {
        try {
            Mac mac = Mac.getInstance("HmacSHA256");
            SecretKeySpec secretKeySpec = new SecretKeySpec(key.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
            mac.init(secretKeySpec);
            byte[] hmacBytes = mac.doFinal(data.getBytes(StandardCharsets.UTF_8));
            return Base64.getUrlEncoder().withoutPadding().encodeToString(hmacBytes);
        } catch (Exception e) {
            throw new RuntimeException("Failed to compute HMAC", e);
        }
    }
}
