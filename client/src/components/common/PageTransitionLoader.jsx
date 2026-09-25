import React, { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import Loader from './Loader';

/**
 * PageTransitionLoader
 * Intercepts every route navigation across the entire application,
 * displaying a premium obsidian-glassmorphic vortex loader before smoothly
 * revealing the destination page.
 */
const PageTransitionLoader = ({ children }) => {
  const location = useLocation();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [displayLocation, setDisplayLocation] = useState(location);
  const prevPathRef = useRef(location.pathname);

  useEffect(() => {
    // Only trigger transition if the route pathname actually changes (ignore query params)
    if (prevPathRef.current !== location.pathname) {
      prevPathRef.current = location.pathname;
      setIsTransitioning(true);

      // Scroll to top instantly on route change
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });

      // Clean, snappy page reveal
      const timer = setTimeout(() => {
        setDisplayLocation(location);
        setIsTransitioning(false);
      }, 220);

      return () => clearTimeout(timer);
    }
  }, [location.pathname]);

  return (
    <>
      {/* Global Page Transition Overlay */}
      {isTransitioning && (
        <div
          id="global-page-transition-overlay"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 99999,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(5, 7, 10, 0.94)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            animation: 'fadeInOverlay 0.15s ease-out forwards',
            pointerEvents: 'all',
          }}
        >
          {/* Ambient red & gold glow */}
          <div
            style={{
              position: 'absolute',
              width: '300px',
              height: '300px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(224, 35, 28, 0.25) 0%, rgba(212, 175, 55, 0.08) 50%, transparent 70%)',
              filter: 'blur(40px)',
              pointerEvents: 'none',
              animation: 'pulseGlow 1.5s ease-in-out infinite alternate',
            }}
          />

          <div
            style={{
              position: 'relative',
              zIndex: 2,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '1.25rem',
            }}
          >
            {/* Custom Vortex Loader */}
            <Loader size="3.8rem" color="#e0231c" />

            {/* Brand Status Label */}
            <div style={{ textAlign: 'center' }}>
              <div
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  letterSpacing: '0.22em',
                  textTransform: 'uppercase',
                  color: '#ffffff',
                  marginBottom: '0.35rem',
                  fontFamily: 'var(--font-heading, "Plus Jakarta Sans", sans-serif)',
                }}
              >
                UrbanNest
              </div>
              <div
                style={{
                  fontSize: '0.72rem',
                  letterSpacing: '0.12em',
                  color: 'rgba(255, 255, 255, 0.55)',
                  fontWeight: 500,
                  textTransform: 'uppercase',
                }}
              >
                Loading Sanctuary...
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Page Content with smooth fade-in */}
      <div
        className="page-content-wrapper"
        key={location.pathname}
        style={{
          animation: 'pageFadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards',
          minHeight: '100%',
        }}
      >
        {children}
      </div>

      <style>{`
        @keyframes fadeInOverlay {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes pulseGlow {
          from {
            transform: scale(0.85);
            opacity: 0.6;
          }
          to {
            transform: scale(1.15);
            opacity: 1;
          }
        }

        @keyframes pageFadeIn {
          from {
            opacity: 0.85;
            transform: translateY(4px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </>
  );
};

export default PageTransitionLoader;
