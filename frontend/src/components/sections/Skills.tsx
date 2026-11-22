import { motion } from "framer-motion";
import { useApi } from "../../hooks/useApi";
import { getSkills } from "../../api/skillService";
import { SkillCategoryData } from "../../types/api";

const cardVariant: import("framer-motion").Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.45 },
  }),
};

export function Skills() {
  const { data: categories, loading, error } = useApi<SkillCategoryData[]>(getSkills);

  return (
    <section id="skills" className="section">
      <div className="container">
        <div className="section__header">
          <h2 className="section__title">Technical Skills</h2>
          <p className="section__subtitle">
            Technologies and tools I work with to build reliable software.
          </p>
          <div className="section__divider" />
        </div>

        {loading && (
          <div className="section-loading">
            <span className="section-loading__spinner" /> Loading technical skills...
          </div>
        )}

        {error && (
          <div className="section-error">
            Failed to load skills: {error}
          </div>
        )}

        {!loading && !error && categories && categories.length === 0 && (
          <div className="section-empty">No skills listed yet.</div>
        )}

        {!loading && !error && categories && categories.length > 0 && (
          <div className="skills__grid">
            {categories.map((cat, i) => (
              <motion.div
                key={cat.id}
                className="card skill-card"
                variants={cardVariant}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-60px" }}
                custom={i}
              >
                <div className="skill-card__icon">{cat.iconText || "⚙"}</div>
                <h3 className="skill-card__title">{cat.name}</h3>
                <div className="skill-card__list">
                  {cat.skills && cat.skills.map((s) => (
                    <span key={s.id} className="skill-tag">
                      {s.name}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
