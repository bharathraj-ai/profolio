import { motion } from "framer-motion";
import { useLazyApi } from "../../hooks/useLazyApi";
import { getAchievements, getCertifications } from "../../api/achievementService";
import { AchievementData, CertificationData } from "../../types/api";

const cardVariant: import("framer-motion").Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.4 },
  }),
};

export function Achievements() {
  const { data: achievements, loading: achLoading, error: achError, ref: achRef } = useLazyApi<AchievementData[]>(getAchievements);
  const { data: certifications, loading: certLoading, error: certError, ref: certRef } = useLazyApi<CertificationData[]>(getCertifications);

  const loading = achLoading || certLoading;
  const error = achError || certError;

  return (
    <section
      id="achievements"
      className="section"
      ref={(node) => { achRef(node); certRef(node); }}
    >
      <div className="container">
        <div className="section__header">
          <h2 className="section__title">Achievements</h2>
          <p className="section__subtitle">
            Competitions, certifications, and milestones along the way.
          </p>
          <div className="section__divider" />
        </div>

        {loading && (
          <div className="section-loading">
            <span className="section-loading__spinner" /> Loading achievements...
          </div>
        )}

        {error && (
          <div className="section-error">
            Failed to load achievements: {error}
          </div>
        )}

        {!loading && !error && (
          <>
            {achievements && achievements.length > 0 ? (
              <div className="achievements__grid">
                {achievements.map((a, i) => (
                  <motion.div
                    key={a.id}
                    className="card achievement-card"
                    variants={cardVariant}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-40px" }}
                    custom={i}
                  >
                    <div
                      className={`achievement-card__medal${
                        a.medalType === "gold"
                          ? " achievement-card__medal--gold"
                          : a.medalType === "silver"
                          ? " achievement-card__medal--silver"
                          : ""
                      }`}
                    >
                      {a.placeLabel}
                    </div>
                    <div className="achievement-card__content">
                      <h3>{a.title}</h3>
                      <p>{a.eventName}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="section-empty">No achievements recorded yet.</div>
            )}

            {certifications && certifications.length > 0 && (
              <motion.div
                className="certifications"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <h3 className="certifications__title">Certifications &amp; Experience</h3>
                <div className="certifications__list">
                  {certifications.map((c) => (
                    <div key={c.id} className="certifications__item">
                      {c.name} {c.issuer ? `(${c.issuer})` : ""}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
