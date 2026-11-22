import { useApi } from "../../hooks/useApi";
import { getProjects } from "../../api/projectService";
import { ProjectData } from "../../types/api";
import { ProjectBook } from "../book/ProjectBook";

export function Projects() {
  const { data: projects, loading, error } = useApi<ProjectData[]>(getProjects);

  const fallbackProjects: ProjectData[] = [
    {
      id: 1,
      name: "Data Guardian 2.0",
      tagline: "Data Privacy & Automated Protection Tool",
      description: "A comprehensive data privacy and security platform designed to automatically detect, classify, and mask personally identifiable information (PII) across enterprise datasets with compliance auditing.",
      githubUrl: "https://github.com/bharathrajS/data-guardian",
      demoUrl: "https://data-guardian.bharathraj.dev",
      isFeatured: true,
      sortOrder: 0,
      technologies: ["Java", "Spring Boot", "PostgreSQL", "REST API", "Docker"],
      features: [
        "Automated PII detection and rule-based masking",
        "Multi-format file processing (CSV, JSON, SQL dumps)",
        "Real-time privacy compliance and audit logging",
        "Role-based security and encrypted data exports"
      ]
    },
    {
      id: 2,
      name: "Udhayam",
      tagline: "Community Empowerment & Social Impact Platform",
      description: "A full-stack collaborative platform built to connect rural communities and educational initiatives with mentors, resources, and event organizing tools.",
      githubUrl: "https://github.com/bharathrajS/udhayam",
      demoUrl: "https://udhayam.bharathraj.dev",
      isFeatured: true,
      sortOrder: 1,
      technologies: ["React", "TypeScript", "Spring Boot", "PostgreSQL", "Tailwind CSS"],
      features: [
        "Centralized portal for community resource distribution",
        "Real-time event notifications and volunteer coordination",
        "Interactive dashboard for administrative management",
        "Secure authentication and localized multilingual support"
      ]
    },
    {
      id: 3,
      name: "KIT Hackathon",
      tagline: "Award-Winning Hackathon Innovation Project",
      description: "An intensive rapid-prototyping solution created during the competitive KIT Hackathon, focusing on high-concurrency event processing and AI-driven automation.",
      githubUrl: "https://github.com/bharathrajS/kit-hackathon",
      demoUrl: "https://kit-hackathon.bharathraj.dev",
      isFeatured: true,
      sortOrder: 2,
      technologies: ["Python", "Java", "REST APIs", "PostgreSQL", "WebSockets"],
      features: [
        "High-speed data processing pipeline with sub-second latency",
        "AI-assisted predictive analysis and automated workflow triggers",
        "Team collaboration and live scoring visualization",
        "Awarded 1st place recognition for engineering design"
      ]
    }
  ];

  // Merge projects ensuring Data Guardian 2.0, Udhayam, and KIT Hackathon are always present
  const mergedProjects: ProjectData[] = [];
  const requiredNames = ["data guardian 2.0", "udhayam", "kit hackathon"];

  // Add from API or fallback
  for (const name of requiredNames) {
    const fromApi = projects?.find((p) => p.name.toLowerCase() === name);
    if (fromApi) {
      mergedProjects.push(fromApi);
    } else {
      const fromFallback = fallbackProjects.find((p) => p.name.toLowerCase() === name);
      if (fromFallback) mergedProjects.push(fromFallback);
    }
  }

  // Also include any other projects added via admin dashboard
  if (projects) {
    for (const p of projects) {
      if (!requiredNames.includes(p.name.toLowerCase())) {
        mergedProjects.push(p);
      }
    }
  }

  const activeProjects = mergedProjects.length > 0 ? mergedProjects : fallbackProjects;

  return (
    <section id="projects" className="section section--alt book-section">
      <div className="container">
        <div className="section__header">
          <h2 className="section__title">Featured Projects</h2>
          <p className="section__subtitle">
            An interactive hardcover portfolio book. Flip or drag the page corners to explore.
          </p>
          <div className="section__divider" />
        </div>

        {loading && (
          <div className="section-loading" style={{ marginBottom: '1.25rem' }}>
            <span className="section-loading__spinner" /> Loading project archives...
          </div>
        )}

        {error && (
          <div className="section-error" style={{ marginBottom: '1.25rem' }}>
            Connected to local project archives ({error})
          </div>
        )}

        <ProjectBook projects={activeProjects} />
      </div>
    </section>
  );
}
