import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ProjectData } from '../../types/api';
import { getImageUrl } from '../../utils/imageUrl';
import '../../styles/book.css';

interface ProjectBookProps {
  projects: ProjectData[];
}

export function ProjectBook({ projects }: ProjectBookProps) {
  // Sort by backend sortOrder; no hardcoded project-name priority
  const sortedProjects = [...projects].sort((a, b) => {
    return (a.sortOrder || 0) - (b.sortOrder || 0);
  });

  const totalSpreads = Math.max(1, sortedProjects.length);
  const [activeSpread, setActiveSpread] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);
  const [flipDirection, setFlipDirection] = useState<'next' | 'prev' | null>(null);
  const [targetSpread, setTargetSpread] = useState<number | null>(null);
  const [mobileTab, setMobileTab] = useState<'left' | 'right'>('left');

  // Touch gesture refs
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  const flipToSpread = useCallback(
    (target: number) => {
      if (isFlipping || target === activeSpread || target < 0 || target >= totalSpreads) return;

      const direction = target > activeSpread ? 'next' : 'prev';
      setIsFlipping(true);
      setFlipDirection(direction);
      setTargetSpread(target);

      setTimeout(() => {
        setActiveSpread(target);
        setIsFlipping(false);
        setFlipDirection(null);
        setTargetSpread(null);
      }, 620);
    },
    [isFlipping, activeSpread, totalSpreads]
  );

  const handleNext = useCallback(() => {
    if (activeSpread < totalSpreads - 1) {
      flipToSpread(activeSpread + 1);
    }
  }, [activeSpread, totalSpreads, flipToSpread]);

  const handlePrev = useCallback(() => {
    if (activeSpread > 0) {
      flipToSpread(activeSpread - 1);
    }
  }, [activeSpread, flipToSpread]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if user is typing in an input/textarea
      const tag = (e.target as HTMLElement)?.tagName?.toLowerCase();
      if (tag === 'input' || tag === 'textarea') return;

      if (e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrev]);

  // Touch handlers for swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length > 0) {
      touchStartX.current = e.touches[0].clientX;
      touchStartY.current = e.touches[0].clientY;
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return;
    const touchEndX = e.changedTouches[0]?.clientX ?? touchStartX.current;
    const touchEndY = e.changedTouches[0]?.clientY ?? touchStartY.current;

    const diffX = touchStartX.current - touchEndX;
    const diffY = touchStartY.current - touchEndY;

    // Detect horizontal swipe if deltaX > 45px and predominantly horizontal
    if (Math.abs(diffX) > 45 && Math.abs(diffX) > Math.abs(diffY)) {
      if (diffX > 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }

    touchStartX.current = null;
    touchStartY.current = null;
  };

  const currentProject = sortedProjects[activeSpread] || sortedProjects[0];
  const targetProject = targetSpread !== null ? sortedProjects[targetSpread] : null;

  // Render left page content (Specifications & Overview)
  const renderLeftPage = (proj: ProjectData, pageNum: number, isTurning = false) => {
    const projectNumber = String(Math.floor(pageNum / 2) + 1).padStart(2, '0');

    return (
      <div className={`book-page book-page--left ${isTurning ? 'book-page--turning' : ''}`}>
        <div className="book-page-texture" />
        <div className="book-spine-crease book-spine-crease--left" />
        <div className="book-page-content">
          <div>
            <div className="book-running-header">
              <span className="book-running-header__title">Archive Vol. {projectNumber}</span>
              <span className="book-running-header__tag">Portfolio Collection</span>
            </div>

            <div className="book-project-badge">Case Study</div>
            <h3 className="book-project-title">{proj.name}</h3>
            {proj.tagline && <div className="book-project-subtitle">{proj.tagline}</div>}
            <div className="book-project-divider">
              <span className="book-divider-diamond">✦</span>
            </div>

            <p className="book-project-desc">{proj.description}</p>

            {proj.features && proj.features.length > 0 && (
              <div className="book-features-block">
                <div className="book-features-title">Core Architecture &amp; Key Highlights</div>
                <ul className="book-features-list">
                  {proj.features.slice(0, 4).map((f, fIdx) => (
                    <li key={fIdx}>
                      <span className="book-bullet-icon">✦</span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="book-running-footer">
            <span className="book-page-num">— {pageNum} —</span>
            <button
              type="button"
              className="book-corner-hint book-corner-hint--left"
              onClick={handlePrev}
              disabled={activeSpread <= 0 || isFlipping}
              title="Turn back to previous project"
            >
              ◂ Turn Back
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Render right page content (Blueprint & Interactions)
  const renderRightPage = (proj: ProjectData, pageNum: number, isTurning = false) => {
    // Generic architecture flow for any project — no hardcoded project names
    return (
      <div className={`book-page book-page--right ${isTurning ? 'book-page--turning' : ''}`}>
        <div className="book-page-texture" />
        <div className="book-spine-crease book-spine-crease--right" />
        <div className="book-page-content">
          <div>
            <div className="book-running-header">
              <span className="book-running-header__title">Technical Blueprint</span>
              <span className="book-running-header__author">Bharathraj S</span>
            </div>

            {/* Visual Exhibition Frame */}
            <div className="book-visual-frame">
              {proj.imageUrl ? (
                <img
                  src={getImageUrl(proj.imageUrl)}
                  alt={proj.name}
                  className="book-visual-img"
                />
              ) : (
                <div className="book-schematic">
                  <div className="book-schematic__grid-lines" />
                  <div className="book-schematic__badge">
                    {proj.isFeatured ? ' Featured Project' : ' Production Architecture'}
                  </div>

                  {/* Generic architecture flow derived from technologies */}
                  <div className="book-schematic__flow">
                    {proj.technologies && proj.technologies.length > 0 ? (
                      proj.technologies.slice(0, 4).flatMap((tech, idx, arr) => {
                        const nodes = [<div key={`step-${idx}`} className="flow-step">{tech}</div>];
                        if (idx < arr.length - 1) {
                          nodes.push(<div key={`arrow-${idx}`} className="flow-arrow">➔</div>);
                        }
                        return nodes;
                      })
                    ) : (
                      <>
                        <div className="flow-step">Client App</div>
                        <div className="flow-arrow">➔</div>
                        <div className="flow-step">REST Gateway</div>
                        <div className="flow-arrow">➔</div>
                        <div className="flow-step">Service Layer</div>
                        <div className="flow-arrow">➔</div>
                        <div className="flow-step">Database</div>
                      </>
                    )}
                  </div>

                  <div className="book-schematic__sub">
                    {proj.name} · System Architecture &amp; Data Pipeline
                  </div>
                </div>
              )}
            </div>

            {/* Technologies & Frameworks */}
            {proj.technologies && proj.technologies.length > 0 && (
              <div className="book-tech-section">
                <div className="book-tech-title">Technologies &amp; Frameworks</div>
                <div className="book-tech-tags">
                  {proj.technologies.map((t, tIdx) => (
                    <span key={tIdx} className="book-tech-tag">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="book-actions">
              {proj.githubUrl && (
                <a
                  href={proj.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="book-btn book-btn--primary"
                >
                  <span className="book-btn__icon">⌥</span> View Source
                </a>
              )}
              {proj.demoUrl && (
                <a
                  href={proj.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="book-btn book-btn--outline"
                >
                  <span className="book-btn__icon">↗</span> Live Demo
                </a>
              )}
            </div>
          </div>

          <div className="book-running-footer">
            <button
              type="button"
              className="book-corner-hint book-corner-hint--right"
              onClick={handleNext}
              disabled={activeSpread >= totalSpreads - 1 || isFlipping}
              title="Turn forward to next project"
            >
              Turn Forward ▸
            </button>
            <span className="book-page-num">— {pageNum} —</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="book-wrapper">
      {/* Bookmark Ribbon Tabs for direct navigation */}
      <div className="book-ribbon-tabs" role="tablist" aria-label="Project Spreads">
        {sortedProjects.map((p, idx) => (
          <button
            key={p.id || idx}
            type="button"
            role="tab"
            aria-selected={idx === activeSpread}
            className={`book-ribbon-tab ${idx === activeSpread ? 'book-ribbon-tab--active' : ''}`}
            onClick={() => flipToSpread(idx)}
            disabled={isFlipping}
          >
            <span className="book-ribbon-tab__num">0{idx + 1}</span>
            <span className="book-ribbon-tab__name">{p.name}</span>
          </button>
        ))}
      </div>

      {/* 3D Hardcover Outer Frame */}
      <div
        className="book-hardcover"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Embossed Corner Metal Accents */}
        <div className="book-hardcover-corner book-hardcover-corner--tl" />
        <div className="book-hardcover-corner book-hardcover-corner--tr" />
        <div className="book-hardcover-corner book-hardcover-corner--bl" />
        <div className="book-hardcover-corner book-hardcover-corner--br" />

        {/* Hanging Silk Bookmark Ribbon */}
        <div className="book-silk-bookmark" />

        {/* Central 3D Leather Spine */}
        <div className="book-spine" />

        {/* Mobile View Toggle Pills (Visible only on mobile/narrow screens) */}
        <div className="book-mobile-toggle">
          <button
            type="button"
            className={`book-mobile-btn ${mobileTab === 'left' ? 'book-mobile-btn--active' : ''}`}
            onClick={() => setMobileTab('left')}
          >
            ✦ Overview
          </button>
          <button
            type="button"
            className={`book-mobile-btn ${mobileTab === 'right' ? 'book-mobile-btn--active' : ''}`}
            onClick={() => setMobileTab('right')}
          >
            ⚙ Blueprint &amp; Tech
          </button>
        </div>

        {/* The Open Book Stage with 3D Page Spread */}
        <div className="book-stage">
          {/* Paper Thickness Layer Shadow (Stacked Pages Illusion) */}
          <div className="book-paper-stack-edge book-paper-stack-edge--left" />
          <div className="book-paper-stack-edge book-paper-stack-edge--right" />

          {/* Desktop Dual-Page Spread View */}
          <div className={`book-spread ${mobileTab === 'right' ? 'book-spread--mobile-right' : ''}`}>
            {/* Underneath/Base Pages */}
            <div className="book-spread-base">
              {/* If flipping next: right page shows the target project */}
              {/* If flipping prev: left page shows the target project */}
              {isFlipping && flipDirection === 'next' && targetProject ? (
                <>
                  {renderLeftPage(currentProject, activeSpread * 2 + 1)}
                  {renderRightPage(targetProject, (targetSpread ?? activeSpread) * 2 + 2)}
                </>
              ) : isFlipping && flipDirection === 'prev' && targetProject ? (
                <>
                  {renderLeftPage(targetProject, (targetSpread ?? activeSpread) * 2 + 1)}
                  {renderRightPage(currentProject, activeSpread * 2 + 2)}
                </>
              ) : (
                <>
                  {renderLeftPage(currentProject, activeSpread * 2 + 1)}
                  {renderRightPage(currentProject, activeSpread * 2 + 2)}
                </>
              )}
            </div>

            {/* 3D Flipping Leaf during Animation */}
            {isFlipping && flipDirection === 'next' && targetProject && (
              <div className="book-flipping-leaf book-flipping-leaf--next">
                {/* Front of flipping leaf (current right page) */}
                <div className="book-flipping-face book-flipping-face--front">
                  {renderRightPage(currentProject, activeSpread * 2 + 2, true)}
                  <div className="book-page-shade book-page-shade--front" />
                </div>
                {/* Back of flipping leaf (next left page) */}
                <div className="book-flipping-face book-flipping-face--back">
                  {renderLeftPage(targetProject, (targetSpread ?? activeSpread) * 2 + 1, true)}
                  <div className="book-page-shade book-page-shade--back" />
                </div>
              </div>
            )}

            {isFlipping && flipDirection === 'prev' && targetProject && (
              <div className="book-flipping-leaf book-flipping-leaf--prev">
                {/* Front of flipping leaf (current left page) */}
                <div className="book-flipping-face book-flipping-face--front">
                  {renderLeftPage(currentProject, activeSpread * 2 + 1, true)}
                  <div className="book-page-shade book-page-shade--front" />
                </div>
                {/* Back of flipping leaf (previous right page) */}
                <div className="book-flipping-face book-flipping-face--back">
                  {renderRightPage(targetProject, (targetSpread ?? activeSpread) * 2 + 2, true)}
                  <div className="book-page-shade book-page-shade--back" />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* External Book Navigation Controls */}
      <div className="book-nav-controls">
        <button
          type="button"
          className="book-nav-arrow"
          onClick={handlePrev}
          disabled={activeSpread <= 0 || isFlipping}
          title="Previous Project (ArrowLeft)"
          aria-label="Previous Project"
        >
          ←
        </button>

        <div className="book-nav-meta">
          <div className="book-nav-spread">
            <span className="book-nav-spread__name">{currentProject.name}</span>
            <span className="book-nav-spread__dot">·</span>
            <span className="book-nav-spread__count">
              Spread {activeSpread + 1} of {totalSpreads}
            </span>
          </div>
          <div className="book-nav-hint">
            💡 Drag corner, click tabs, or use ← → arrow keys to flip pages
          </div>
        </div>

        <button
          type="button"
          className="book-nav-arrow"
          onClick={handleNext}
          disabled={activeSpread >= totalSpreads - 1 || isFlipping}
          title="Next Project (ArrowRight)"
          aria-label="Next Project"
        >
          →
        </button>
      </div>
    </div>
  );
}
