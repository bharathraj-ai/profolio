import { type FormEvent, useState } from "react";
import { motion } from "framer-motion";
import { usePortfolio } from "../../context/PortfolioContext";
import { useApi } from "../../hooks/useApi";
import { getProfile } from "../../api/profileService";
import { submitContact } from "../../api/contactService";
import { ProfileData } from "../../types/api";

export function Contact() {
  const portfolio = usePortfolio();
  const fallback = useApi<ProfileData>(getProfile);
  const profile = portfolio?.data?.profile || fallback.data;
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    setErrorMessage("");
    try {
      await submitContact(form);
      setStatus("success");
      setForm({ name: "", email: "", message: "" });
    } catch (err: unknown) {
      setStatus("error");
      const errObj = err as { response?: { data?: { message?: string } }; message?: string };
      setErrorMessage(errObj.response?.data?.message || errObj.message || "Failed to submit message");
    }
  };

  const update = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  return (
    <section id="contact" className="section">
      <div className="container">
        <div className="section__header">
          <h2 className="section__title">Get In Touch</h2>
          <p className="section__subtitle">
            Have a question or want to work together? Feel free to reach out.
          </p>
          <div className="section__divider" />
        </div>

        <motion.div
          className="contact__grid"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="contact__info">
            <h3>Let's Connect</h3>
            <p>
              I'm always open to discussing new projects, opportunities, or
              just having a conversation about technology and software development.
            </p>

            <div className="contact__links">
              {profile?.email && (
                <a href={`mailto:${profile.email}`} className="contact__link">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="4" width="20" height="16" rx="2" />
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                  </svg>
                  {profile.email}
                </a>
              )}
              {profile?.githubUrl && (
                <a
                  href={profile.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contact__link"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2Z" />
                  </svg>
                  {profile.githubUrl.replace("https://", "")}
                </a>
              )}
              {profile?.linkedinUrl && (
                <a
                  href={profile.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contact__link"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286ZM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065Zm1.782 13.019H3.555V9h3.564v11.452ZM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003Z" />
                  </svg>
                  {profile.linkedinUrl.replace("https://", "")}
                </a>
              )}
            </div>
          </div>

          <form className="contact__form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                id="name"
                type="text"
                required
                placeholder="Your name"
                value={form.name}
                onChange={update("name")}
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                required
                placeholder="your@email.com"
                value={form.email}
                onChange={update("email")}
              />
            </div>
            <div className="form-group">
              <label htmlFor="message">Message</label>
              <textarea
                id="message"
                required
                rows={5}
                placeholder="Your message..."
                value={form.message}
                onChange={update("message")}
              />
            </div>
            <button type="submit" className="btn btn--primary" disabled={status === "sending"}>
              {status === "sending" ? "Sending…" : "Send Message"}
            </button>
            {status === "success" && (
              <p className="form-status form-status--success">Message sent successfully! Thank you for reaching out.</p>
            )}
            {status === "error" && (
              <p className="form-status form-status--error">
                {errorMessage || "Something went wrong. Please try again or email me directly."}
              </p>
            )}
          </form>
        </motion.div>
      </div>
    </section>
  );
}
