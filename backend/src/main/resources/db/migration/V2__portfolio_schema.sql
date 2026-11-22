-- ============================================================
-- V2__portfolio_schema.sql
-- Portfolio REST API – full schema + seed data
-- ============================================================

-- Drop placeholder table from V1
DROP TABLE IF EXISTS app_info CASCADE;

-- ============================================================
-- 1. profile
-- ============================================================
CREATE TABLE profile (
    id          BIGSERIAL PRIMARY KEY,
    full_name   VARCHAR(120) NOT NULL,
    role_title  VARCHAR(200) NOT NULL,
    tagline     VARCHAR(200),
    intro_text  TEXT,
    github_url  VARCHAR(300),
    linkedin_url VARCHAR(300),
    email       VARCHAR(150),
    avatar_url  VARCHAR(500),
    resume_url  VARCHAR(500),
    created_at  TIMESTAMPTZ DEFAULT now(),
    updated_at  TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- 2. education
-- ============================================================
CREATE TABLE education (
    id              BIGSERIAL PRIMARY KEY,
    degree          VARCHAR(100) NOT NULL,
    institution     VARCHAR(200) NOT NULL,
    field_of_study  VARCHAR(200),
    start_year      INT,
    end_year        INT,
    is_current      BOOLEAN DEFAULT false,
    description     TEXT,
    sort_order      INT DEFAULT 0
);

-- ============================================================
-- 3. skill_category
-- ============================================================
CREATE TABLE skill_category (
    id         BIGSERIAL PRIMARY KEY,
    name       VARCHAR(80) NOT NULL,
    icon_text  VARCHAR(20),
    sort_order INT DEFAULT 0
);

-- ============================================================
-- 4. skill
-- ============================================================
CREATE TABLE skill (
    id          BIGSERIAL PRIMARY KEY,
    category_id BIGINT NOT NULL REFERENCES skill_category(id) ON DELETE CASCADE,
    name        VARCHAR(80) NOT NULL,
    sort_order  INT DEFAULT 0
);

-- ============================================================
-- 5. project
-- ============================================================
CREATE TABLE project (
    id          BIGSERIAL PRIMARY KEY,
    name        VARCHAR(150) NOT NULL,
    tagline     VARCHAR(200),
    description TEXT,
    github_url  VARCHAR(500),
    demo_url    VARCHAR(500),
    image_url   VARCHAR(500),
    is_featured BOOLEAN DEFAULT false,
    sort_order  INT DEFAULT 0,
    created_at  TIMESTAMPTZ DEFAULT now(),
    updated_at  TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- 6. project_technology
-- ============================================================
CREATE TABLE project_technology (
    id         BIGSERIAL PRIMARY KEY,
    project_id BIGINT NOT NULL REFERENCES project(id) ON DELETE CASCADE,
    name       VARCHAR(80) NOT NULL,
    sort_order INT DEFAULT 0
);

-- ============================================================
-- 7. project_feature
-- ============================================================
CREATE TABLE project_feature (
    id           BIGSERIAL PRIMARY KEY,
    project_id   BIGINT NOT NULL REFERENCES project(id) ON DELETE CASCADE,
    feature_text TEXT NOT NULL,
    sort_order   INT DEFAULT 0
);

-- ============================================================
-- 8. achievement
-- ============================================================
CREATE TABLE achievement (
    id          BIGSERIAL PRIMARY KEY,
    place_label VARCHAR(20)  NOT NULL,
    medal_type  VARCHAR(10)  NOT NULL CHECK (medal_type IN ('gold', 'silver', 'other')),
    title       VARCHAR(100) NOT NULL,
    event_name  VARCHAR(200) NOT NULL,
    sort_order  INT DEFAULT 0
);

-- ============================================================
-- 9. certification
-- ============================================================
CREATE TABLE certification (
    id           BIGSERIAL PRIMARY KEY,
    name         VARCHAR(200) NOT NULL,
    issuer       VARCHAR(200),
    issued_year  INT,
    cert_url     VARCHAR(500),
    sort_order   INT DEFAULT 0
);

-- ============================================================
-- 10. coding_profile
-- ============================================================
CREATE TABLE coding_profile (
    id            BIGSERIAL PRIMARY KEY,
    platform_name VARCHAR(80)  NOT NULL,
    icon_text     VARCHAR(20),
    description   TEXT,
    profile_url   VARCHAR(500) NOT NULL,
    sort_order    INT DEFAULT 0
);

-- ============================================================
-- 11. contact_message
-- ============================================================
CREATE TABLE contact_message (
    id           BIGSERIAL PRIMARY KEY,
    sender_name  VARCHAR(120) NOT NULL,
    sender_email VARCHAR(150) NOT NULL,
    message      TEXT NOT NULL,
    submitted_at TIMESTAMPTZ DEFAULT now(),
    status       VARCHAR(20)  DEFAULT 'UNREAD'
                     CHECK (status IN ('UNREAD', 'READ', 'REPLIED'))
);

-- ============================================================
-- 12. trusted_device
-- ============================================================
CREATE TABLE trusted_device (
    id           BIGSERIAL PRIMARY KEY,
    device_name  VARCHAR(120) NOT NULL,
    token_hash   VARCHAR(64)  NOT NULL UNIQUE,
    created_at   TIMESTAMPTZ DEFAULT now(),
    last_seen_at TIMESTAMPTZ,
    is_active    BOOLEAN DEFAULT true
);

-- ============================================================
-- SEED DATA
-- ============================================================

-- profile
INSERT INTO profile (full_name, role_title, tagline, intro_text, github_url, linkedin_url, email)
VALUES (
    'Bharathraj S',
    'Software Developer | AI & Data Science Student',
    'Dream. Build. Innovate.',
    'Aspiring backend developer with a passion for building scalable applications, working with Java, Spring Boot, and modern web technologies. Currently pursuing B.Tech in AI & Data Science.',
    'https://github.com/bharathrajS',
    'https://linkedin.com/in/bharathraj-s',
    'bharathraj.dev@gmail.com'
);

-- education
INSERT INTO education (degree, institution, field_of_study, start_year, is_current, sort_order)
VALUES (
    'B.Tech',
    'College',
    'Artificial Intelligence & Data Science',
    2022,
    true,
    0
);

-- skill_category
INSERT INTO skill_category (name, icon_text, sort_order) VALUES
    ('Languages', '{ }', 0),
    ('Backend',   '⚙',   1),
    ('Databases', '⛁',   2),
    ('Tools',     '⌘',   3);

-- skill  (using subquery to resolve category ids by name)
INSERT INTO skill (category_id, name, sort_order)
SELECT id, 'Java',       0 FROM skill_category WHERE name = 'Languages'
UNION ALL
SELECT id, 'Python',     1 FROM skill_category WHERE name = 'Languages'
UNION ALL
SELECT id, 'C++',        2 FROM skill_category WHERE name = 'Languages'
UNION ALL
SELECT id, 'JavaScript', 3 FROM skill_category WHERE name = 'Languages'
UNION ALL
SELECT id, 'Spring Boot', 0 FROM skill_category WHERE name = 'Backend'
UNION ALL
SELECT id, 'REST APIs',   1 FROM skill_category WHERE name = 'Backend'
UNION ALL
SELECT id, 'PostgreSQL',  0 FROM skill_category WHERE name = 'Databases'
UNION ALL
SELECT id, 'MySQL',       1 FROM skill_category WHERE name = 'Databases'
UNION ALL
SELECT id, 'Git',    0 FROM skill_category WHERE name = 'Tools'
UNION ALL
SELECT id, 'GitHub', 1 FROM skill_category WHERE name = 'Tools'
UNION ALL
SELECT id, 'Docker', 2 FROM skill_category WHERE name = 'Tools';

-- projects
INSERT INTO project (name, tagline, description, is_featured, sort_order)
VALUES
    (
        'Data Guardian 2.0',
        'Data Privacy & Protection Tool',
        'A comprehensive data privacy tool designed to help users protect sensitive information through automated detection and masking of personal data.',
        true,
        0
    ),
    (
        'Intella',
        'Text-to-SQL AI System',
        'An AI-powered system that converts natural language questions into SQL queries.',
        true,
        1
    );

-- project_technology for Data Guardian 2.0
INSERT INTO project_technology (project_id, name, sort_order)
SELECT id, 'Java',        0 FROM project WHERE name = 'Data Guardian 2.0'
UNION ALL
SELECT id, 'Spring Boot', 1 FROM project WHERE name = 'Data Guardian 2.0'
UNION ALL
SELECT id, 'PostgreSQL',  2 FROM project WHERE name = 'Data Guardian 2.0'
UNION ALL
SELECT id, 'REST API',    3 FROM project WHERE name = 'Data Guardian 2.0';

-- project_feature for Data Guardian 2.0
INSERT INTO project_feature (project_id, feature_text, sort_order)
SELECT id, 'Automated PII detection and masking',         0 FROM project WHERE name = 'Data Guardian 2.0'
UNION ALL
SELECT id, 'Support for multiple data formats',           1 FROM project WHERE name = 'Data Guardian 2.0'
UNION ALL
SELECT id, 'Privacy compliance reporting',                2 FROM project WHERE name = 'Data Guardian 2.0'
UNION ALL
SELECT id, 'User-friendly interface for data management', 3 FROM project WHERE name = 'Data Guardian 2.0';

-- project_technology for Intella
INSERT INTO project_technology (project_id, name, sort_order)
SELECT id, 'Python',         0 FROM project WHERE name = 'Intella'
UNION ALL
SELECT id, 'NLP',            1 FROM project WHERE name = 'Intella'
UNION ALL
SELECT id, 'SQL',            2 FROM project WHERE name = 'Intella'
UNION ALL
SELECT id, 'Machine Learning', 3 FROM project WHERE name = 'Intella';

-- project_feature for Intella
INSERT INTO project_feature (project_id, feature_text, sort_order)
SELECT id, 'Natural language to SQL conversion',   0 FROM project WHERE name = 'Intella'
UNION ALL
SELECT id, 'Support for complex query structures', 1 FROM project WHERE name = 'Intella'
UNION ALL
SELECT id, 'Interactive query refinement',         2 FROM project WHERE name = 'Intella'
UNION ALL
SELECT id, 'Database schema understanding',        3 FROM project WHERE name = 'Intella';

-- achievements
INSERT INTO achievement (place_label, medal_type, title, event_name, sort_order)
VALUES
    ('1st',  'gold',   '1st Place',   'IntraCollege Project Hackathon',   0),
    ('1st',  'gold',   '1st Place',   'Codewar 2.0',                      1),
    ('2nd',  'silver', '2nd Place',   'IntraCollege Coding Hackathon',    2),
    ('R-up', 'silver', 'Runner-up',   'CLONE-X',                          3),
    ('5th',  'other',  '5th Place',   'PaperBuddy Industry Hackathon',    4);

-- certifications
INSERT INTO certification (name, sort_order)
VALUES
    ('Technical certifications in software development', 0),
    ('Internship experience in technology',              1);

-- coding_profiles
INSERT INTO coding_profile (platform_name, icon_text, profile_url, sort_order)
VALUES
    ('LeetCode', '⟨/⟩', 'https://leetcode.com/',          0),
    ('CodeChef', '★',    'https://www.codechef.com/',      1),
    ('GitHub',   '⌥',    'https://github.com/bharathrajS', 2);
