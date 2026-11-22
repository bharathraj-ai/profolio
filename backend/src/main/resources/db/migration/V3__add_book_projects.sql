-- Migration V3: Add projects for realistic 3D book experience (Udhayam, KIT Hackathon)
INSERT INTO project (name, tagline, description, github_url, demo_url, is_featured, sort_order)
VALUES
    (
        'Udhayam',
        'Community Empowerment & Social Impact Platform',
        'A full-stack collaborative platform built to connect rural communities and educational initiatives with mentors, resources, and event organizing tools.',
        'https://github.com/bharathrajS/udhayam',
        'https://udhayam.bharathraj.dev',
        true,
        2
    ),
    (
        'KIT Hackathon',
        'Award-Winning Hackathon Innovation Project',
        'An intensive rapid-prototyping solution created during the competitive KIT Hackathon, focusing on high-concurrency event processing and AI-driven automation.',
        'https://github.com/bharathrajS/kit-hackathon',
        'https://kit-hackathon.bharathraj.dev',
        true,
        3
    );

INSERT INTO project_technology (project_id, name, sort_order)
SELECT id, 'React',        0 FROM project WHERE name = 'Udhayam'
UNION ALL
SELECT id, 'TypeScript',   1 FROM project WHERE name = 'Udhayam'
UNION ALL
SELECT id, 'Spring Boot',  2 FROM project WHERE name = 'Udhayam'
UNION ALL
SELECT id, 'PostgreSQL',   3 FROM project WHERE name = 'Udhayam'
UNION ALL
SELECT id, 'Python',       0 FROM project WHERE name = 'KIT Hackathon'
UNION ALL
SELECT id, 'Java',         1 FROM project WHERE name = 'KIT Hackathon'
UNION ALL
SELECT id, 'REST APIs',    2 FROM project WHERE name = 'KIT Hackathon'
UNION ALL
SELECT id, 'WebSockets',   3 FROM project WHERE name = 'KIT Hackathon';

INSERT INTO project_feature (project_id, feature_text, sort_order)
SELECT id, 'Centralized portal for community resource distribution', 0 FROM project WHERE name = 'Udhayam'
UNION ALL
SELECT id, 'Real-time event notifications and volunteer coordination', 1 FROM project WHERE name = 'Udhayam'
UNION ALL
SELECT id, 'Interactive dashboard for administrative management',      2 FROM project WHERE name = 'Udhayam'
UNION ALL
SELECT id, 'Secure authentication and localized multilingual support', 3 FROM project WHERE name = 'Udhayam'
UNION ALL
SELECT id, 'High-speed data processing pipeline with sub-second latency', 0 FROM project WHERE name = 'KIT Hackathon'
UNION ALL
SELECT id, 'AI-assisted predictive analysis and automated workflow triggers', 1 FROM project WHERE name = 'KIT Hackathon'
UNION ALL
SELECT id, 'Team collaboration and live scoring visualization',               2 FROM project WHERE name = 'KIT Hackathon'
UNION ALL
SELECT id, 'Awarded 1st place recognition for engineering design',            3 FROM project WHERE name = 'KIT Hackathon';

