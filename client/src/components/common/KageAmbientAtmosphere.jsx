import React from 'react';
import styled from 'styled-components';

/**
 * KageAmbientAtmosphere
 * Renders atmospheric vermilion light rays and low-transparency foreground
 * silhouettes (sakura, pine, stone lantern, basalt stones, shrine ruins)
 * across all pages and dashboards.
 */
const KageAmbientAtmosphere = ({ variant = 'default' }) => {
  return (
    <AtmosphereContainer aria-hidden="true">
      {/* ── Atmospheric Light Shafts & Glows ────────────────── */}
      <div className="light-shaft top-center-shaft" />
      <div className="light-shaft top-right-shaft" />
      <div className="light-shaft bottom-left-shaft" />

      {/* ── Low-Transparency Foreground Silhouette Assets ───── */}
      {/* Top-Right Sakura Branch with subtle ambient light illumination */}
      <img
        src="/landing-pages/secret-pathways-assets/foreground/png/sakura-branch.webp"
        alt=""
        className="fg-silhouette fg-sakura"
      />

      {/* Top-Left Pine Tree Silhouette */}
      <img
        src="/landing-pages/secret-pathways-assets/foreground/png/pine-tree.webp"
        alt=""
        className="fg-silhouette fg-pine"
      />

      {/* Mid-Left Maple Leaves Silhouette */}
      <img
        src="/landing-pages/secret-pathways-assets/foreground/png/maple-leaves.webp"
        alt=""
        className="fg-silhouette fg-maple"
      />

      {/* Bottom-Right Stone Lantern with gentle light halo */}
      <div className="lantern-group">
        <div className="lantern-light-halo" />
        <img
          src="/landing-pages/secret-pathways-assets/foreground/png/stone-lantern.webp"
          alt=""
          className="fg-silhouette fg-lantern"
        />
      </div>

      {/* Bottom-Left Shrine Ruins Silhouette */}
      <img
        src="/landing-pages/secret-pathways-assets/foreground/png/shrine-ruins.webp"
        alt=""
        className="fg-silhouette fg-ruins"
      />

      {/* Bottom Ground Basalt Stones */}
      <img
        src="/landing-pages/secret-pathways-assets/foreground/png/basalt-stones.webp"
        alt=""
        className="fg-silhouette fg-stones"
      />
    </AtmosphereContainer>
  );
};

const AtmosphereContainer = styled.div`
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
  z-index: 0;

  /* Atmospheric Light Rays & Crimson Aurora */
  .light-shaft {
    position: absolute;
    border-radius: 50%;
    pointer-events: none;
    filter: blur(70px);
  }

  .top-center-shaft {
    top: -220px;
    left: 50%;
    transform: translateX(-50%);
    width: clamp(700px, 85vw, 1400px);
    height: clamp(700px, 85vw, 1400px);
    background: radial-gradient(circle, rgba(224, 35, 28, 0.22) 0%, rgba(255, 90, 60, 0.08) 35%, transparent 70%);
  }

  .top-right-shaft {
    top: 5%;
    right: -80px;
    width: 650px;
    height: 650px;
    background: radial-gradient(circle, rgba(224, 35, 28, 0.16) 0%, rgba(255, 120, 80, 0.05) 45%, transparent 65%);
    filter: blur(80px);
  }

  .bottom-left-shaft {
    bottom: 2%;
    left: -80px;
    width: 750px;
    height: 750px;
    background: radial-gradient(circle, rgba(224, 35, 28, 0.14) 0%, rgba(212, 175, 55, 0.06) 40%, transparent 70%);
    filter: blur(85px);
  }

  /* Silhouette Base */
  .fg-silhouette {
    position: absolute;
    pointer-events: none;
    user-select: none;
    transition: opacity 0.5s ease;
  }

  /* Top Right Sakura */
  .fg-sakura {
    top: 0;
    right: -20px;
    width: clamp(320px, 36vw, 600px);
    opacity: 0.22;
    filter: drop-shadow(0 0 25px rgba(224, 35, 28, 0.35)) brightness(1.2);
    animation: driftSakura 14s ease-in-out infinite alternate;
  }

  /* Top Left Pine */
  .fg-pine {
    top: 30px;
    left: -30px;
    width: clamp(260px, 28vw, 480px);
    opacity: 0.18;
    filter: drop-shadow(0 0 20px rgba(255, 90, 60, 0.25));
    animation: driftPine 16s ease-in-out infinite alternate;
  }

  /* Mid Left Maple */
  .fg-maple {
    top: 42%;
    left: -20px;
    width: clamp(190px, 22vw, 340px);
    opacity: 0.16;
    filter: drop-shadow(0 0 20px rgba(224, 35, 28, 0.3));
  }

  /* Bottom Right Lantern Group with Glow */
  .lantern-group {
    position: absolute;
    bottom: 30px;
    right: 20px;
    width: clamp(160px, 18vw, 260px);
    height: clamp(230px, 26vw, 400px);
  }

  .lantern-light-halo {
    position: absolute;
    top: 25%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 120px;
    height: 120px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(255, 140, 50, 0.45) 0%, rgba(224, 35, 28, 0.2) 50%, transparent 75%);
    filter: blur(14px);
    animation: flickerLantern 4s ease-in-out infinite alternate;
  }

  .fg-lantern {
    width: 100%;
    height: 100%;
    object-fit: contain;
    opacity: 0.22;
    filter: drop-shadow(0 0 24px rgba(255, 90, 60, 0.4)) brightness(1.15);
  }

  /* Bottom Left Ruins */
  .fg-ruins {
    bottom: 50px;
    left: 15px;
    width: clamp(220px, 24vw, 380px);
    opacity: 0.18;
    filter: drop-shadow(0 0 20px rgba(224, 35, 28, 0.25));
  }

  /* Bottom Basalt Stones */
  .fg-stones {
    bottom: 0;
    right: 22%;
    width: clamp(220px, 24vw, 380px);
    opacity: 0.18;
    filter: drop-shadow(0 0 20px rgba(0, 0, 0, 0.9));
  }

  @keyframes driftSakura {
    from { transform: translate(0, 0) rotate(0deg); }
    to { transform: translate(-8px, 6px) rotate(1deg); }
  }

  @keyframes driftPine {
    from { transform: translate(0, 0); }
    to { transform: translate(6px, -4px); }
  }

  @keyframes flickerLantern {
    0% { opacity: 0.6; transform: translate(-50%, -50%) scale(0.95); }
    50% { opacity: 1; transform: translate(-50%, -50%) scale(1.1); }
    100% { opacity: 0.75; transform: translate(-50%, -50%) scale(1); }
  }
`;

export default KageAmbientAtmosphere;
