import { motion } from "framer-motion";
import { usePortfolio } from "../../context/PortfolioContext";
import { useApi } from "../../hooks/useApi";
import { getCodingProfiles } from "../../api/codingProfileService";
import { CodingProfileData } from "../../types/api";

const cardVariant: import("framer-motion").Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.45 },
  }),
};

export function CodingProfiles() {
  const portfolio = usePortfolio();
  const fallback = useApi<CodingProfileData[]>(getCodingProfiles);
  const profiles = portfolio?.data?.codingProfiles || fallback.data;
  const loading = portfolio ? portfolio.loading && !profiles : fallback.loading;
  const error = portfolio?.error && !profiles ? portfolio.error : fallback.error;

  return (
    <section id="profiles" className="section section--alt">
      <div className="container">
        <div className="section__header">
          <h2 className="section__title">Coding Profiles</h2>
          <p className="section__subtitle">
            Platforms where I practice and share code.
          </p>
          <div className="section__divider" />
        </div>

        {loading && (
          <div className="section-loading">
            <span className="section-loading__spinner" /> Loading coding profiles...
          </div>
        )}

        {error && (
          <div className="section-error">
            Failed to load coding profiles: {error}
          </div>
        )}

        {!loading && !error && profiles && profiles.length === 0 && (
          <div className="section-empty">No coding profiles listed.</div>
        )}

        {!loading && !error && profiles && profiles.length > 0 && (
          <div className="profiles__grid">
            {profiles.map((p, i) => (
              <motion.div
                key={p.id}
                className="card profile-card"
                variants={cardVariant}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-40px" }}
                custom={i}
              >
                <div className="profile-card__icon">{p.iconText || "⟨/⟩"}</div>
                <h3 className="profile-card__name">{p.platformName}</h3>
                {p.description && <p className="profile-card__desc">{p.description}</p>}
                <a
                  href={p.profileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn--sm btn--outline"
                >
                  Visit Profile
                </a>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
