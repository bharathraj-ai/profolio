import React, { useEffect, useRef, useState } from 'react';
import * as PageFlipModule from 'page-flip';
import { ProjectData } from '../../types/api';
import { getImageUrl } from '../../utils/imageUrl';
import '../../styles/book.css';

// Safe multi-format module resolver (works in Vite dev, Vite preview, and Rollup production build)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const PageFlipClass: any =
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (PageFlipModule as any).PageFlip ||
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (PageFlipModule as any).default?.PageFlip ||
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (PageFlipModule as any).default ||
  PageFlipModule;

interface ProjectBookProps {
  projects: ProjectData[];
}

export function ProjectBook({ projects }: ProjectBookProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const pageFlipRef = useRef<any>(null);

  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isReady, setIsReady] = useState(false);

  // Guarantee projects order: Data Guardian 2.0, Udhayam, KIT Hackathon, then any others
  const sortedProjects = [...projects].sort((a, b) => {
    const priority = ['data guardian 2.0', 'udhayam', 'kit hackathon'];
    const aIdx = priority.indexOf(a.name.toLowerCase());
    const bIdx = priority.indexOf(b.name.toLowerCase());
    if (aIdx !== -1 && bIdx !== -1) return aIdx - bIdx;
    if (aIdx !== -1) return -1;
    if (bIdx !== -1) return 1;
    return (a.sortOrder || 0) - (b.sortOrder || 0);
  });

  useEffect(() => {
    if (!containerRef.current) return;

    let isMounted = true;
    const timer = setTimeout(() => {
      try {
        if (!containerRef.current || !isMounted) return;

        if (typeof PageFlipClass !== 'function') {
          console.warn('PageFlip is not a constructor, falling back to CSS book display');
          setIsReady(true);
          return;
        }

        const pageFlip = new PageFlipClass(containerRef.current, {
          width: 480,
          height: 640,
          size: 'stretch',
          minWidth: 320,
          maxWidth: 520,
          minHeight: 480,
          maxHeight: 700,
          maxShadowOpacity: 0.85,
          showCover: false,
          mobileScrollSupport: true,
          swipeDistance: 25,
          drawShadow: true,
          flippingTime: 850,
          useMouseEvents: true,
          showPageCorners: true,
          usePortrait: true,
          startPage: 0,
        });

        const pageElements = containerRef.current.querySelectorAll('.book-page');
        if (pageElements.length > 0) {
          pageFlip.loadFromHTML(pageElements);
          pageFlipRef.current = pageFlip;
          setTotalPages(pageFlip.getPageCount());
          setIsReady(true);

          pageFlip.on('flip', (e: { data: number }) => {
            if (isMounted) setCurrentPage(e.data);
          });
        }
      } catch (err) {
        console.error('3D book flip initialization notice:', err);
        if (isMounted) setIsReady(true);
      }
    }, 120);

    return () => {
      isMounted = false;
      clearTimeout(timer);
      if (pageFlipRef.current) {
        try {
          pageFlipRef.current.destroy();
        } catch (e) {
          console.warn('PageFlip destroy warning', e);
        }
        pageFlipRef.current = null;
      }
    };
  }, [sortedProjects.length]);

  // Keyboard navigation (ArrowLeft & ArrowRight)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!pageFlipRef.current) return;
      if (e.key === 'ArrowRight') {
        pageFlipRef.current.flipNext('top');
      } else if (e.key === 'ArrowLeft') {
        pageFlipRef.current.flipPrev('top');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleNext = () => {
    if (pageFlipRef.current) {
      pageFlipRef.current.flipNext('top');
    }
  };

  const handlePrev = () => {
    if (pageFlipRef.current) {
      pageFlipRef.current.flipPrev('top');
    }
  };

  const currentSpread = Math.floor(currentPage / 2) + 1;
  const totalSpreads = Math.max(1, Math.ceil((totalPages || sortedProjects.length * 2) / 2));
  const activeProject = sortedProjects[Math.floor(currentPage / 2)] || sortedProjects[0];

  return (
    <div className="book-wrapper">
      <div className="book-hardcover">
        <div className="book-stage" ref={containerRef}>
          {sortedProjects.map((proj, idx) => {
            const projectNumber = String(idx + 1).padStart(2, '0');
            const leftPageNum = idx * 2 + 1;
            const rightPageNum = idx * 2 + 2;

            return (
              <React.Fragment key={proj.id || idx}>
                {/* LEFT PAGE: Specifications & Overview */}
                <div className="book-page book-page--left">
                  <div className="book-page-content">
                    <div>
                      <div className="book-running-header">
                        <span className="book-running-header__title">Project {projectNumber}</span>
                        <span>Portfolio Archive</span>
                      </div>

                      <span className="book-project-tag">Case Study</span>
                      <h3 className="book-project-title">{proj.name}</h3>
                      {proj.tagline && (
                        <div className="book-project-subtitle">{proj.tagline}</div>
                      )}
                      <div className="book-project-divider" />

                      <p className="book-project-desc">{proj.description}</p>

                      {proj.features && proj.features.length > 0 && (
                        <div>
                          <div className="book-features-title">Core Architecture & Highlights</div>
                          <ul className="book-features-list">
                            {proj.features.slice(0, 4).map((f, fIdx) => (
                              <li key={fIdx}>{f}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>

                    <div className="book-running-footer">
                      <span className="book-page-num">— {leftPageNum} —</span>
                      <span className="book-corner-hint">◂ Turn back</span>
                    </div>
                  </div>
                </div>

                {/* RIGHT PAGE: Technical Exhibition & Interaction */}
                <div className="book-page book-page--right">
                  <div className="book-page-content">
                    <div>
                      <div className="book-running-header">
                        <span>Technical Blueprint</span>
                        <span className="book-running-header__title">Bharathraj S</span>
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
                            <div className="book-schematic__icon">⚙</div>
                            <div className="book-schematic__title">{proj.name}</div>
                            <div className="book-schematic__sub">
                              Architectural Blueprint &amp; System Flow
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Technologies & Stack */}
                      {proj.technologies && proj.technologies.length > 0 && (
                        <div>
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
                            <span>⌥</span> View Source
                          </a>
                        )}
                        {proj.demoUrl && (
                          <a
                            href={proj.demoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="book-btn book-btn--outline"
                          >
                            <span>↗</span> Live Preview
                          </a>
                        )}
                      </div>
                    </div>

                    <div className="book-running-footer">
                      <span className="book-corner-hint">Drag corner to flip ▸</span>
                      <span className="book-page-num">— {rightPageNum} —</span>
                    </div>
                  </div>
                </div>
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Navigation UI Outside the Book */}
      <div className="book-nav-controls">
        <button
          type="button"
          className="book-nav-arrow"
          onClick={handlePrev}
          disabled={currentPage <= 0}
          title="Previous Page (ArrowLeft)"
          aria-label="Previous page"
        >
          ←
        </button>

        <div className="book-nav-meta">
          <div className="book-nav-spread">
            {activeProject ? activeProject.name : 'Projects'} · Spread {currentSpread} of {totalSpreads}
          </div>
          <div className="book-nav-hint">
            💡 Drag top/bottom corners with mouse, touch swipe, or use ← → keys
          </div>
        </div>

        <button
          type="button"
          className="book-nav-arrow"
          onClick={handleNext}
          disabled={totalPages > 0 && currentPage >= totalPages - 2}
          title="Next Page (ArrowRight)"
          aria-label="Next page"
        >
          →
        </button>
      </div>
    </div>
  );
}
