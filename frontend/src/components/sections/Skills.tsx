import { motion } from "framer-motion";
import { useLazyApi } from "../../hooks/useLazyApi";
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
  const { data: categories, loading, error, ref } = useLazyApi<SkillCategoryData[]>(getSkills);

  return (
    <section id="skills" className="section" ref={ref}>
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
            <span className="section-loading__spinner" /> Loading skills...
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
            {categories.map((category, i) => (
              <motion.div
                key={category.id}
                className="card skill-card"
                variants={cardVariant}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-40px" }}
                custom={i}
              >
                <div className="skill-card__header">
                  <span className="skill-card__icon">{category.iconText || "⚡"}</span>
                  <h3 className="skill-card__title">{category.name}</h3>
                </div>
                <div className="skill-card__list">
                  {category.skills && category.skills.length > 0 ? (
                    category.skills.map((skill) => (
                      <span key={skill.id} className="skill-tag">
                        {skill.name}
                      </span>
                    ))
                  ) : (
                    <span className="section-empty">No skills in this category.</span>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
