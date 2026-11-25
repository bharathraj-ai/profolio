import type React from "react";

/**
 * Smoothly scrolls to a section by ID without appending a `#hash` to the browser URL.
 */
export function scrollToSection(e: React.MouseEvent<HTMLAnchorElement>, sectionId: string): void {
  e.preventDefault();
  const target = document.getElementById(sectionId);
  if (target) {
    target.scrollIntoView({ behavior: "smooth" });
  }
  if (window.location.hash) {
    window.history.replaceState(null, "", window.location.pathname + window.location.search);
  }
}

