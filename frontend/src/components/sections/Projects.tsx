import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { useApi } from "../../hooks/useApi";
import { getProjects } from "../../api/projectService";
import { ProjectData } from "../../types/api";
import { getImageUrl } from "../../utils/imageUrl";

export function Projects() {
  const { data: projects, loading, error } = useApi<ProjectData[]>(getProjects);

  const fallbackProjects: ProjectData[] = [
    {
      id: 1,
      name: "Data Guardian 2.0",
      tagline: "Data Privacy & Automated Protection Tool",
      description:
        "A comprehensive data privacy and security platform designed to automatically detect, classify, and mask personally identifiable information (PII) across enterprise datasets with compliance auditing.",
      githubUrl: "https://github.com/bharathrajS/data-guardian",
      demoUrl: "https://data-guardian.bharathraj.dev",
      isFeatured: true,
      sortOrder: 0,
      technologies: ["Java", "Spring Boot", "PostgreSQL", "REST API", "Docker"],
      features: [
        "Automated PII detection and rule-based masking",
        "Multi-format file processing (CSV, JSON, SQL dumps)",
        "Real-time privacy compliance and audit logging",
        "Role-based security and encrypted data exports",
      ],
    },
    {
      id: 2,
      name: "Udhayam",
      tagline: "Community Empowerment & Social Impact Platform",
      description:
        "A full-stack collaborative platform built to connect rural communities and educational initiatives with mentors, resources, and event organizing tools.",
      githubUrl: "https://github.com/bharathrajS/udhayam",
      demoUrl: "https://udhayam.bharathraj.dev",
      isFeatured: true,
      sortOrder: 1,
      technologies: ["React", "TypeScript", "Spring Boot", "PostgreSQL", "Tailwind CSS"],
      features: [
        "Centralized portal for community resource distribution",
        "Real-time event notifications and volunteer coordination",
        "Interactive dashboard for administrative management",
        "Secure authentication and localized multilingual support",
      ],
    },
    {
      id: 3,
      name: "KIT Hackathon",
      tagline: "Award-Winning Hackathon Innovation Project",
      description:
        "An intensive rapid-prototyping solution created during the competitive KIT Hackathon, focusing on high-concurrency event processing and AI-driven automation.",
      githubUrl: "https://github.com/bharathrajS/kit-hackathon",
      demoUrl: "https://kit-hackathon.bharathraj.dev",
      isFeatured: true,
      sortOrder: 2,
      technologies: ["Python", "Java", "REST APIs", "PostgreSQL", "WebSockets"],
      features: [
        "High-speed data processing pipeline with sub-second latency",
        "AI-assisted predictive analysis and automated workflow triggers",
        "Team collaboration and live scoring visualization",
        "Awarded 1st place recognition for engineering design",
      ],
    },
  ];

  // Merge projects ensuring Data Guardian 2.0, Udhayam, and KIT Hackathon are always present
  const mergedProjects: ProjectData[] = [];
  const requiredNames = ["data guardian 2.0", "udhayam", "kit hackathon"];

  for (const name of requiredNames) {
    const fromApi = projects?.find((p) => p.name.toLowerCase() === name);
    if (fromApi) {
      mergedProjects.push(fromApi);
    } else {
      const fromFallback = fallbackProjects.find((p) => p.name.toLowerCase() === name);
      if (fromFallback) mergedProjects.push(fromFallback);
    }
  }

  if (projects) {
    for (const p of projects) {
      if (!requiredNames.includes(p.name.toLowerCase())) {
        mergedProjects.push(p);
      }
    }
  }

  const activeProjects = mergedProjects.length > 0 ? mergedProjects : fallbackProjects;
  const count = activeProjects.length;

  const [activeIndex, setActiveIndex] = useState(0);

  const handleNext = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % count);
  }, [count]);

  const handlePrev = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + count) % count);
  }, [count]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName?.toLowerCase();
      if (tag === "input" || tag === "textarea") return;

      if (e.key === "ArrowRight") {
        handleNext();
      } else if (e.key === "ArrowLeft") {
        handlePrev();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleNext, handlePrev]);

  // Precise 3D layout coordinates based on card index
  const getCardStyle = (index: number) => {
    let diff = (index - activeIndex) % count;
    if (diff > count / 2) diff -= count;
    if (diff < -count / 2) diff += count;

    if (diff === 0) {
      // Active Center Card: 100% opaque, elevated, top z-index
      return {
        x: "0px",
        y: 0,
        scale: 1,
        rotateY: 0,
        zIndex: 10,
        opacity: 1,
        display: "block",
        pointerEvents: "auto" as const,
      };
    } else if (diff === 1) {
      // Right Card: 100% opaque background, angled inward in 3D
      return {
        x: "340px",
        y: 0,
        scale: 0.88,
        rotateY: -18,
        zIndex: 5,
        opacity: 1,
        display: "block",
        pointerEvents: "auto" as const,
      };
    } else if (diff === -1) {
      // Left Card: 100% opaque background, angled inward in 3D
      return {
        x: "-340px",
        y: 0,
        scale: 0.88,
        rotateY: 18,
        zIndex: 5,
        opacity: 1,
        display: "block",
        pointerEvents: "auto" as const,
      };
    } else {
      // Background hidden cards: display none so they can never leak or overlap
      return {
        x: diff > 0 ? "520px" : "-520px",
        y: 0,
        scale: 0.7,
        rotateY: diff > 0 ? -25 : 25,
        zIndex: 1,
        opacity: 0,
        display: "none",
        pointerEvents: "none" as const,
      };
    }
  };

  return (
    <section id="projects" className="section section--alt">
      <div className="container">
        <div className="section__header">
          <h2 className="section__title">Featured Projects</h2>
          <p className="section__subtitle">
            Explore recent work across data privacy, community platforms, and AI automation.
          </p>
          <div className="section__divider" />
        </div>

        {loading && (
          <div className="section-loading">
            <span className="section-loading__spinner" /> Loading projects...
          </div>
        )}

        {error && (
          <div className="section-error">
            Failed to load projects: {error}
          </div>
        )}

        {/* 3D Rotating Card Carousel */}
        <div className="projects-carousel">
          <div className="projects-carousel__stage">
            {activeProjects.map((p, i) => {
              const style = getCardStyle(i);
              let diff = (i - activeIndex) % count;
              if (diff > count / 2) diff -= count;
              if (diff < -count / 2) diff += count;
              const isActive = diff === 0;

              const nameLower = p.name.toLowerCase();
              const badgeLabel = nameLower.includes("hackathon")
                ? "🏆 Award Winner"
                : nameLower.includes("guardian")
                ? "🛡️ Privacy Suite"
                : nameLower.includes("udhayam")
                ? "🤝 Community Impact"
                : "Featured Project";

              const projectNum = String(i + 1).padStart(2, "0");

              return (
                <motion.div
                  key={p.name}
                  className={`projects-carousel__card-wrapper ${
                    isActive ? "projects-carousel__card-wrapper--active" : ""
                  }`}
                  animate={style}
                  transition={{
                    type: "spring",
                    stiffness: 280,
                    damping: 28,
                    mass: 0.7,
                  }}
                  onClick={() => {
                    if (!isActive) setActiveIndex(i);
                  }}
                  drag={isActive ? "x" : false}
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.25}
                  onDragEnd={(_, info) => {
                    if (info.offset.x < -40) handleNext();
                    else if (info.offset.x > 40) handlePrev();
                  }}
                >
                  <div className="project-card">
                    {/* Subtle veil overlay for inactive cards */}
                    <div className="projects-carousel__card-veil" />

                    {/* Optional Image Preview */}
                    {p.imageUrl && (
                      <div className="project-card__image-frame">
                        <img
                          src={getImageUrl(p.imageUrl)}
                          alt={p.name}
                          className="project-card__image"
                        />
                      </div>
                    )}

                    <div className="project-card__top-row">
                      <span className="project-card__badge">{badgeLabel}</span>
                      <span className="project-card__index">{projectNum} / 0{count}</span>
                    </div>

                    <div className="project-card__header">
                      <h3 className="project-card__name">{p.name}</h3>
                      {p.tagline && (
                        <div className="project-card__tagline">{p.tagline}</div>
                      )}
                    </div>

                    <div className="project-card__divider" />

                    <p className="project-card__desc">{p.description}</p>

                    {p.features && p.features.length > 0 && (
                      <div className="project-card__features">
                        <div className="project-card__features-title">
                          Key Highlights &amp; Architecture
                        </div>
                        <ul className="project-card__features-list">
                          {p.features.slice(0, 3).map((f, fIdx) => (
                            <li key={fIdx}>{f}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {p.technologies && p.technologies.length > 0 && (
                      <div className="project-card__tech">
                        {p.technologies.map((t, tIdx) => (
                          <span key={tIdx} className="project-card__tech-tag">
                            {t}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="project-card__links">
                      {p.githubUrl && (
                        <a
                          href={p.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn--outline btn--sm"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <span className="project-card__btn-icon">⌥</span> View Source
                        </a>
                      )}
                      {p.demoUrl && (
                        <a
                          href={p.demoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn--primary btn--sm"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <span className="project-card__btn-icon">↗</span> Live Demo
                        </a>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Carousel Controls */}
          <div className="projects-carousel__controls">
            <button
              type="button"
              className="projects-carousel__arrow"
              onClick={handlePrev}
              aria-label="Previous project (ArrowLeft)"
              title="Previous (ArrowLeft)"
            >
              ←
            </button>

            <div className="projects-carousel__dots">
              {activeProjects.map((_, dotIdx) => (
                <button
                  key={dotIdx}
                  type="button"
                  className={`projects-carousel__dot ${
                    dotIdx === activeIndex ? "projects-carousel__dot--active" : ""
                  }`}
                  onClick={() => setActiveIndex(dotIdx)}
                  aria-label={`Go to project ${dotIdx + 1}`}
                />
              ))}
            </div>

            <button
              type="button"
              className="projects-carousel__arrow"
              onClick={handleNext}
              aria-label="Next project (ArrowRight)"
              title="Next (ArrowRight)"
            >
              →
            </button>
          </div>

          <div className="projects-carousel__meta">
            <span className="projects-carousel__counter">
              {activeIndex + 1} of {count} · {activeProjects[activeIndex]?.name}
            </span>
            <span className="projects-carousel__hint">
              💡 Drag card, click side cards, use arrows or keyboard ← → keys
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
