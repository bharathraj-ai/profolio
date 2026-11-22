import { motion } from "framer-motion";
import { usePortfolio } from "../../context/PortfolioContext";
import { useApi } from "../../hooks/useApi";
import { getProfile } from "../../api/profileService";
import { getEducation } from "../../api/educationService";
import { EducationData, ProfileData } from "../../types/api";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export function About() {
  const portfolio = usePortfolio();
  const fallbackProfile = useApi<ProfileData>(getProfile);
  const fallbackEdu = useApi<EducationData[]>(getEducation);

  const profile = portfolio?.data?.profile || fallbackProfile.data;
  const education = portfolio?.data?.education || fallbackEdu.data;

  const loading = portfolio ? portfolio.loading && (!profile || !education) : (fallbackProfile.loading || fallbackEdu.loading);
  const error = portfolio?.error && (!profile || !education) ? portfolio.error : (fallbackProfile.error || fallbackEdu.error);

  return (
    <section id="about" className="section section--alt">
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
                        {edu.startYear ? ` (${edu.startYear} - ${edu.isCurrent ? 'Present' : edu.endYear || ''})` : ''}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="section-empty">No education records found.</div>
                )}
              </div>

              <div className="card">
                <h3 className="about__card-title">Career Interests</h3>
                <div className="about__card-item">
                  <strong>Backend Development</strong>
                  <span>Java, Spring Boot, REST APIs, Microservices</span>
                </div>
                <div className="about__card-item">
                  <strong>Software Engineering</strong>
                  <span>Scalable systems, clean architecture, databases</span>
                </div>
                <div className="about__card-item">
                  <strong>AI &amp; Data Science</strong>
                  <span>Machine learning, NLP, data-driven applications</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
