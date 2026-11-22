package com.bharathraj.portfolio.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import static org.junit.jupiter.api.Assertions.*;

class AuthServiceTest {

    private AuthService authService;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @BeforeEach
    void setUp() {
        // Hash for "bharathraj@2006"
        String hash = passwordEncoder.encode("bharathraj@2006");
        authService = new AuthService(
                passwordEncoder,
                "bharathraj95317@gmail.com",
                hash,
                "test_secret_key_12345"
        );
    }

    @Test
    void testValidCredentials() {
        assertTrue(authService.validateCredentials("bharathraj95317@gmail.com", "bharathraj@2006"));
        assertTrue(authService.validateCredentials("BHARATHRAJ95317@GMAIL.COM", "bharathraj@2006")); // case-insensitive email
    }

    @Test
    void testInvalidCredentials() {
        assertFalse(authService.validateCredentials("bharathraj95317@gmail.com", "wrong_pass"));
        assertFalse(authService.validateCredentials("other@gmail.com", "bharathraj@2006"));
        assertFalse(authService.validateCredentials(null, "bharathraj@2006"));
        assertFalse(authService.validateCredentials("bharathraj95317@gmail.com", null));
    }

    @Test
    void testSessionTokenLifecycle() {
        String token = authService.generateSessionToken("bharathraj95317@gmail.com");
        assertNotNull(token);
        assertTrue(authService.validateToken(token));

        // Tampered token must fail
        assertFalse(authService.validateToken(token + "tampered"));
        assertFalse(authService.validateToken("invalid.token.here"));
    }
}

