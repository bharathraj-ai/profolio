package com.bharathraj.portfolio.config;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.net.URI;
import java.util.Arrays;
import java.util.List;

public final class EnvLoader {

    private EnvLoader() {}

    public static void load() {
        List<String> searchPaths = Arrays.asList(
                ".env",
                ".evn",
                "../.env",
                "../.evn",
                "backend/.env",
                "backend/.evn"
        );

        for (String path : searchPaths) {
            File file = new File(path);
            if (file.exists() && file.isFile()) {
                loadFile(file);
            }
        }

        processDatabaseUrl();
    }

    private static void loadFile(File file) {
        try (BufferedReader reader = new BufferedReader(new FileReader(file))) {
            String line;
            while ((line = reader.readLine()) != null) {
                line = line.trim();
                if (line.isEmpty() || line.startsWith("#")) {
                    continue;
                }
                int eqIdx = line.indexOf('=');
                if (eqIdx > 0) {
                    String key = line.substring(0, eqIdx).trim();
                    String value = line.substring(eqIdx + 1).trim();

                    if ((value.startsWith("\"") && value.endsWith("\"")) ||
                        (value.startsWith("'") && value.endsWith("'"))) {
                        if (value.length() >= 2) {
                            value = value.substring(1, value.length() - 1);
                        }
                    }

                    if (System.getProperty(key) == null && System.getenv(key) == null) {
                        System.setProperty(key, value);
                    }
                }
            }
        } catch (Exception e) {
            System.err.println("Warning: failed to read env file: " + file.getAbsolutePath() + " - " + e.getMessage());
        }
    }

    private static void processDatabaseUrl() {
        String dbUrl = getPropertyOrEnv("DATABASE_URL");
        if (dbUrl == null || dbUrl.isBlank()) {
            dbUrl = getPropertyOrEnv("NEON_DATABASE_URL");
        }
        if (dbUrl == null || dbUrl.isBlank()) {
            dbUrl = getPropertyOrEnv("DB_URL");
        }
        if (dbUrl == null || dbUrl.isBlank()) {
            dbUrl = getPropertyOrEnv("SPRING_DATASOURCE_URL");
        }

        if (dbUrl != null && !dbUrl.isBlank()) {
            // Check if it is a standard postgres / postgresql URI
            // e.g. postgresql://user:pass@host:port/dbname?sslmode=require
            if (dbUrl.startsWith("postgres://") || dbUrl.startsWith("postgresql://")) {
                try {
                    String uriString = dbUrl;
                    if (uriString.startsWith("postgres://")) {
                        uriString = "postgresql://" + uriString.substring("postgres://".length());
                    }

                    URI uri = URI.create(uriString.replace("postgresql://", "http://"));
                    String host = uri.getHost();
                    int port = uri.getPort() > 0 ? uri.getPort() : 5432;
                    String path = uri.getPath();
                    String query = uri.getQuery();

                    StringBuilder jdbcUrl = new StringBuilder("jdbc:postgresql://")
                            .append(host)
                            .append(":").append(port)
                            .append(path != null && !path.isEmpty() ? path : "/portfolio");

                    if (query != null && !query.isBlank()) {
                        jdbcUrl.append("?").append(query);
                    } else if (host != null && host.contains("neon.tech")) {
                        jdbcUrl.append("?sslmode=require");
                    }

                    System.setProperty("spring.datasource.url", jdbcUrl.toString());
                    System.setProperty("DB_URL", jdbcUrl.toString());

                    String userInfo = uri.getUserInfo();
                    if (userInfo != null && !userInfo.isBlank()) {
                        String[] parts = userInfo.split(":", 2);
                        System.setProperty("spring.datasource.username", parts[0]);
                        System.setProperty("DB_USER", parts[0]);
                        if (parts.length > 1) {
                            System.setProperty("spring.datasource.password", parts[1]);
                            System.setProperty("DB_PASSWORD", parts[1]);
                        }
                    }
                } catch (Exception ex) {
                    System.err.println("Warning: could not parse DATABASE_URL as URI, fallback to direct jdbc: " + ex.getMessage());
                    if (!dbUrl.startsWith("jdbc:")) {
                        String directJdbc = "jdbc:" + dbUrl;
                        System.setProperty("spring.datasource.url", directJdbc);
                        System.setProperty("DB_URL", directJdbc);
                    } else {
                        System.setProperty("spring.datasource.url", dbUrl);
                        System.setProperty("DB_URL", dbUrl);
                    }
                }
            } else if (dbUrl.startsWith("jdbc:")) {
                System.setProperty("spring.datasource.url", dbUrl);
                System.setProperty("DB_URL", dbUrl);
            }
        }
    }

    private static String getPropertyOrEnv(String name) {
        String val = System.getProperty(name);
        if (val == null || val.isBlank()) {
            val = System.getenv(name);
        }
        return val;
    }
}

