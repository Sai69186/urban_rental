import React, { useEffect, useRef } from 'react';

const KageHeroBackground = () => {
  const iframeRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? scrollY / docHeight : 0;

      if (iframeRef.current?.contentWindow) {
        try {
          const iframeDoc = iframeRef.current.contentDocument;
          const targetY = progress * ((iframeDoc?.body?.scrollHeight || 3000) - window.innerHeight);
          iframeRef.current.contentWindow.scrollTo(0, targetY);
        } catch (e) {
          // Ignore cross-origin security
        }
      }
    };

    const handlePointerMove = (e) => {
      if (iframeRef.current?.contentWindow) {
        try {
          iframeRef.current.contentWindow.dispatchEvent(
            new MouseEvent('pointermove', {
              clientX: e.clientX,
              clientY: e.clientY,
              bubbles: true,
            })
          );
        } catch (e) {
          // Ignore
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('mousemove', handlePointerMove, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handlePointerMove);
    };
  }, []);

  const onIframeLoad = () => {
    try {
      const doc = iframeRef.current?.contentDocument;
      if (!doc) return;

      doc.documentElement.setAttribute('data-threeui-presentation', 'background');
      const style = doc.createElement('style');
      style.textContent = `
        html[data-threeui-presentation="background"],
        html[data-threeui-presentation="background"] body {
          width: 100% !important;
          height: 100% !important;
          overflow: hidden !important;
          background: #05070a !important;
        }
        body * {
          visibility: hidden !important;
          pointer-events: none !important;
        }
        #gl, #gl * {
          visibility: visible !important;
          position: fixed !important;
          inset: 0 !important;
          width: 100vw !important;
          height: 100vh !important;
        }
      `;
      doc.head.appendChild(style);
    } catch (e) {
      // Safe fallback
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
      }}
      aria-hidden="true"
    >
      <iframe
        ref={iframeRef}
        src="/landing-pages/kage.html"
        title="Kage 3D Architectural Scene"
        sandbox="allow-scripts allow-same-origin"
        onLoad={onIframeLoad}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          border: 0,
          display: 'block',
        }}
      />
      {/* High-Clarity Atmospheric Vignette — highlights 3D scene vividly */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(circle at 50% 30%, rgba(5, 7, 10, 0.05) 0%, rgba(5, 7, 10, 0.25) 60%, rgba(5, 7, 10, 0.65) 100%), linear-gradient(180deg, rgba(5, 7, 10, 0.35) 0%, rgba(5, 7, 10, 0.05) 35%, rgba(5, 7, 10, 0.5) 85%, #05070a 100%)',
          pointerEvents: 'none',
        }}
      />
    </div>
  );
};

export default KageHeroBackground;
