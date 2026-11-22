package com.bharathraj.portfolio.config;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;

import java.io.File;
import java.io.FileWriter;

import static org.junit.jupiter.api.Assertions.*;

class EnvLoaderTest {

    @AfterEach
    void cleanup() {
        System.clearProperty("DATABASE_URL");
        System.clearProperty("DB_URL");
        System.clearProperty("DB_USER");
        System.clearProperty("DB_PASSWORD");
        System.clearProperty("spring.datasource.url");
        System.clearProperty("spring.datasource.username");
        System.clearProperty("spring.datasource.password");
        System.clearProperty("TEST_ENV_VAR");
        new File(".env").delete();
        new File(".env.test").delete();
    }

    @Test
    void testNeonPostgresUriConversion() throws Exception {
        File tempEnv = new File(".env");
        try (FileWriter writer = new FileWriter(tempEnv)) {
            writer.write("DATABASE_URL=postgresql://neondb_owner:secret_pass_123@ep-bold-glitter-12345.us-east-2.aws.neon.tech/neondb?sslmode=require\n");
            writer.write("TEST_ENV_VAR=hello_bharath\n");
        }

        EnvLoader.load();

        assertEquals("hello_bharath", System.getProperty("TEST_ENV_VAR"));
        assertEquals("neondb_owner", System.getProperty("spring.datasource.username"));
        assertEquals("secret_pass_123", System.getProperty("spring.datasource.password"));
        assertTrue(System.getProperty("spring.datasource.url").startsWith("jdbc:postgresql://ep-bold-glitter-12345.us-east-2.aws.neon.tech:5432/neondb?sslmode=require"));
    }
}
