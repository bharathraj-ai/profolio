import { motion } from "framer-motion";
import { usePortfolio } from "../../context/PortfolioContext";
import { useLazyApi } from "../../hooks/useLazyApi";
import { getEducation } from "../../api/educationService";
import { EducationData } from "../../types/api";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

function formatEducationPeriod(edu: EducationData) {
  const parts: string[] = [];
  if (edu.startYear && edu.endYear) {
    parts.push(`${edu.startYear} - ${edu.endYear}`);
  } else if (edu.startYear) {
    parts.push(`${edu.startYear}`);
  } else if (edu.endYear) {
    parts.push(`${edu.endYear}`);
  }

  if (edu.description && edu.description.trim()) {
    parts.push(edu.description.trim());
  }

  if (edu.isCurrent) {
    parts.push('Present');
  }

  return parts.length > 0 ? ` (${parts.join(' • ')})` : '';
}

export function About() {
  const portfolio = usePortfolio();
  const profile = portfolio?.profile ?? null;
  const { data: education, loading: eduLoading, error: eduError, ref: eduRef } = useLazyApi<EducationData[]>(getEducation);

  const loading = (portfolio?.loading && !profile) || eduLoading;
  const error = (portfolio?.error && !profile) ? portfolio.error : eduError;

  return (
    <section id="about" className="section section--alt" ref={eduRef}>
      <div className="container">
        <div className="section__header">
          <h2 className="section__title">About Me</h2>
          <div className="section__divider" />
        </div>

        {loading && (
          <div className="section-loading">
            <span className="section-loading__spinner" /> Loading about details...
          </div>
        )}

        {error && (
          <div className="section-error">
            Unable to load about data: {error}
          </div>
        )}

        {!loading && !error && (
          <motion.div
            className="about__grid"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={{ visible: { transition: { staggerChildren: 0.15 } } }}
          >
            <motion.div className="about__text" variants={fadeIn}>
              {profile?.introText ? (
                profile.introText.split("\n\n").map((para, i) => (
                  <p key={i}>{para}</p>
                ))
              ) : (
                <p>Welcome to my portfolio.</p>
              )}
            </motion.div>

            <motion.div variants={fadeIn} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              <div className="card">
                <h3 className="about__card-title">Education</h3>
                {education && education.length > 0 ? (
                  education.map((edu) => (
                    <div className="about__card-item" key={edu.id}>
                      <strong>
                        {edu.degree} {edu.fieldOfStudy ? `— ${edu.fieldOfStudy}` : ""}
                      </strong>
                      <span>
                        {edu.institution}
                        {formatEducationPeriod(edu)}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="section-empty">No education records found.</div>
                )}
              </div>

              {profile?.tagline && (
                <div className="card">
                  <h3 className="about__card-title">Tagline</h3>
                  <div className="about__card-item">
                    <span>{profile.tagline}</span>
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
