import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Sparkles, ShieldCheck, Activity, Cpu, ArrowUpRight, Zap, Key, Layers, Globe, Radio } from 'lucide-react';
import { Link } from 'react-router-dom';
import UrbanNestLogo from '../common/UrbanNestLogo';

/**
 * ThreeDDashboardHero
 * Inspired by Damian Zaleski's 3D Dashboard:
 * Features an interactive 3D isometric command stage, floating holographic nodes,
 * live telemetry radar, and multi-layer depth elevation.
 */
const ThreeDDashboardHero = ({
  role = 'admin',
  title = 'Enterprise Platform Intelligence',
  subtitle = 'Real-time telemetry across decentralized tenancy, automated escrow, and verified residences.',
  stats = [],
  primaryAction = { label: 'Explore Network', to: '/admin/properties' },
  secondaryAction = { label: 'Live Audit Log', to: '/admin/audit-logs' },
}) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [uptime, setUptime] = useState(99.98);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 20;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -20;
    setMousePos({ x, y });
  };

  const handleMouseLeave = () => {
    setMousePos({ x: 0, y: 0 });
  };

  const roleColors = {
    admin: { primary: '#e0231c', secondary: '#ff5a3c', glow: 'rgba(224, 35, 28, 0.35)', badge: 'ADMINISTRATIVE CORE' },
    owner: { primary: '#c9a24a', secondary: '#e5be65', glow: 'rgba(201, 162, 74, 0.35)', badge: 'OWNER ASSET MATRIX' },
    tenant: { primary: '#10b981', secondary: '#34d399', glow: 'rgba(16, 185, 129, 0.35)', badge: 'TENANT SANCTUARY HUB' },
  };

  const config = roleColors[role] || roleColors.admin;

  return (
    <StyledHeroWrapper
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      $primaryColor={config.primary}
      $glowColor={config.glow}
    >
      {/* Background ambient radial grid & 3D light streams */}
      <div className="ambient-grid-canvas" />
      <div className="ambient-orb orb-left" />
      <div className="ambient-orb orb-right" />

      {/* Main Split Grid */}
      <div className="hero-content-grid">
        {/* Left Column: Mission Narrative & 3D Telemetry Actions */}
        <div className="narrative-col">
          <div className="chip-beacon">
            <span className="live-dot" />
            <span className="chip-text">{config.badge}</span>
            <span className="chip-code">SYS-v2.6</span>
          </div>

          <h1 className="hero-title">
            {title}
          </h1>

          <p className="hero-desc">
            {subtitle}
          </p>

          {/* Quick Metrics Bar */}
          <div className="metrics-pills-row">
            <div className="metric-pill">
              <Activity size={14} className="metric-icon" />
              <span><b>{uptime}%</b> Platform SLA</span>
            </div>
            <div className="metric-pill">
              <Zap size={14} className="metric-icon" />
              <span><b>&lt; 12ms</b> Ledger Sync</span>
            </div>
            <div className="metric-pill">
              <Radio size={14} className="metric-icon" />
              <span><b>Live</b> Telemetry Active</span>
            </div>
          </div>

          {/* CTA Action Buttons */}
          <div className="actions-row">
            {primaryAction && (
              <Link to={primaryAction.to} className="hero-btn primary-btn btn-31">
                <span className="text-container">
                  <span className="text">
                    <span>{primaryAction.label}</span>
                    <ArrowUpRight size={16} />
                  </span>
                </span>
              </Link>
            )}
            {secondaryAction && (
              <Link to={secondaryAction.to} className="hero-btn secondary-btn btn-31">
                <span className="text-container">
                  <span className="text">
                    <span>{secondaryAction.label}</span>
                  </span>
                </span>
              </Link>
            )}
          </div>
        </div>

        {/* Right Column: 3D Holographic Interactive Stage */}
        <div className="stage-col">
          <div
            className="isometric-3d-stage"
            style={{
              transform: `rotateY(${mousePos.x * 0.7}deg) rotateX(${mousePos.y * 0.7}deg)`,
            }}
          >
            {/* Hologram Rings */}
            <div className="holo-ring ring-outer" />
            <div className="holo-ring ring-middle" />
            <div className="holo-ring ring-inner" />

            {/* Floating 3D Node Center */}
            <div className="isometric-cube-assembly">
              <div className="cube-top">
                <UrbanNestLogo height={42} variant="icon-only" />
              </div>
              <div className="cube-face cube-front" />
              <div className="cube-face cube-right" />
            </div>

            {/* Orbiting 3D Status Chips */}
            <div className="orbit-chip chip-1">
              <div className="chip-icon-box green">
                <ShieldCheck size={14} />
              </div>
              <div>
                <span className="chip-lbl">Verified Security</span>
                <b className="chip-val">100% Encrypted</b>
              </div>
            </div>

            <div className="orbit-chip chip-2">
              <div className="chip-icon-box vermilion">
                <Layers size={14} />
              </div>
              <div>
                <span className="chip-lbl">Active Tenancy</span>
                <b className="chip-val">Automated Escrow</b>
              </div>
            </div>

            <div className="orbit-chip chip-3">
              <div className="chip-icon-box gold">
                <Globe size={14} />
              </div>
              <div>
                <span className="chip-lbl">Network Node</span>
                <b className="chip-val">Mumbai • BLR • DEL</b>
              </div>
            </div>
          </div>
        </div>
      </div>
    </StyledHeroWrapper>
  );
};

const StyledHeroWrapper = styled.div`
  position: relative;
  width: 100%;
  border-radius: 28px;
  background: linear-gradient(135deg, rgba(14, 20, 30, 0.65) 0%, rgba(8, 12, 18, 0.75) 100%);
  border: 1px solid rgba(223, 231, 224, 0.1);
  box-shadow: 0 30px 70px -15px rgba(0, 0, 0, 0.5), 0 0 45px ${props => props.$glowColor || 'rgba(224, 35, 28, 0.15)'};
  padding: clamp(2rem, 3.5vw, 3rem);
  overflow: hidden;
  perspective: 1200px;
  transition: border-color 0.4s ease, box-shadow 0.4s ease;

  &:hover {
    border-color: rgba(224, 35, 28, 0.3);
    box-shadow: 0 35px 80px -15px rgba(0, 0, 0, 0.95), 0 0 60px ${props => props.$glowColor || 'rgba(224, 35, 28, 0.25)'};
  }

  .ambient-grid-canvas {
    display: none;
  }

  .ambient-orb {
    position: absolute;
    border-radius: 50%;
    filter: blur(70px);
    pointer-events: none;
  }

  .orb-left {
    top: -80px;
    left: 10%;
    width: 320px;
    height: 320px;
    background: ${props => props.$glowColor || 'rgba(224, 35, 28, 0.2)'};
    opacity: 0.6;
  }

  .orb-right {
    bottom: -100px;
    right: 5%;
    width: 360px;
    height: 360px;
    background: radial-gradient(circle, rgba(224, 35, 28, 0.15) 0%, transparent 70%);
    opacity: 0.5;
  }

  .hero-content-grid {
    position: relative;
    z-index: 2;
    display: grid;
    grid-template-columns: 1.25fr 0.95fr;
    gap: 2.5rem;
    align-items: center;
  }

  @media (max-width: 1024px) {
    .hero-content-grid {
      grid-template-columns: 1fr;
    }
  }

  .narrative-col {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .chip-beacon {
    display: inline-flex;
    align-items: center;
    gap: 0.55rem;
    padding: 0.35rem 0.85rem;
    border-radius: 100px;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.12);
    width: fit-content;
  }

  .live-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #34d399;
    box-shadow: 0 0 10px #34d399;
    animation: pulseBeacon 1.8s infinite alternate ease-in-out;
  }

  @keyframes pulseBeacon {
    from { opacity: 0.6; transform: scale(0.9); }
    to { opacity: 1; transform: scale(1.3); }
  }

  .chip-text {
    font-size: 0.72rem;
    font-weight: 800;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: #ffffff;
  }

  .chip-code {
    font-size: 0.68rem;
    font-weight: 700;
    color: #94a3b8;
    padding-left: 0.4rem;
    border-left: 1px solid rgba(255, 255, 255, 0.15);
  }

  .hero-title {
    font-size: clamp(1.8rem, 3.2vw, 2.5rem);
    font-weight: 800;
    color: #ffffff;
    letter-spacing: -0.025em;
    line-height: 1.2;
    margin: 0;
    font-family: var(--font-heading, "Plus Jakarta Sans", sans-serif);
    text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
  }

  .hero-desc {
    color: #94a3b8;
    font-size: 0.95rem;
    line-height: 1.65;
    margin: 0;
    max-width: 580px;
  }

  .metrics-pills-row {
    display: flex;
    flex-wrap: wrap;
    gap: 0.65rem;
    margin-top: 0.25rem;
  }

  .metric-pill {
    display: flex;
    align-items: center;
    gap: 0.45rem;
    padding: 0.4rem 0.85rem;
    border-radius: 12px;
    background: rgba(255, 255, 255, 0.04);
    border: 1px solid rgba(255, 255, 255, 0.08);
    font-size: 0.78rem;
    color: #cbd5e1;
  }

  .metric-pill b {
    color: #ffffff;
  }

  .metric-icon {
    color: ${props => props.$primaryColor || '#e0231c'};
  }

  .actions-row {
    display: flex;
    align-items: center;
    gap: 1rem;
    flex-wrap: wrap;
    margin-top: 0.75rem;
  }

  .hero-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 0.75rem 1.75rem;
    border-radius: 100px;
    font-size: 0.85rem;
    font-weight: 800;
    letter-spacing: 0.04em;
    text-decoration: none;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.25s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .primary-btn {
    background: ${props => props.$primaryColor || '#e0231c'};
    color: #ffffff;
    border: 1px solid rgba(255, 255, 255, 0.2);
    box-shadow: 0 8px 24px -4px ${props => props.$glowColor || 'rgba(224, 35, 28, 0.4)'};
  }

  .primary-btn:hover {
    transform: translateY(-2px) scale(1.02);
    box-shadow: 0 12px 30px -4px ${props => props.$glowColor || 'rgba(224, 35, 28, 0.6)'};
  }

  .secondary-btn {
    background: rgba(10, 15, 26, 0.7);
    color: #ffffff;
    border: 1px solid rgba(223, 231, 224, 0.15);
    backdrop-filter: blur(12px);
  }

  .secondary-btn:hover {
    background: rgba(20, 28, 42, 0.85);
    border-color: rgba(224, 35, 28, 0.4);
    transform: translateY(-2px);
  }

  .hero-btn:before {
    --progress: 100%;
    background: #ffffff;
    -webkit-clip-path: polygon(
      100% 0,
      var(--progress) var(--progress),
      0 100%,
      100% 100%
    );
    clip-path: polygon(
      100% 0,
      var(--progress) var(--progress),
      0 100%,
      100% 100%
    );
    content: "";
    inset: 0;
    position: absolute;
    transition: -webkit-clip-path 0.25s cubic-bezier(0.16, 1, 0.3, 1), clip-path 0.25s cubic-bezier(0.16, 1, 0.3, 1);
    z-index: 1;
    pointer-events: none;
  }

  .hero-btn:hover:before {
    --progress: 0%;
  }

  .hero-btn .text-container {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    position: relative;
    z-index: 2;
  }

  .hero-btn .text {
    display: inline-flex;
    align-items: center;
    gap: 0.45rem;
    font-weight: 800;
    position: relative;
    color: #ffffff;
    transition: color 0.2s ease;
  }

  .hero-btn:hover .text {
    color: #05070a !important;
    -webkit-animation: move-up-alternate 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    animation: move-up-alternate 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  }

  /* 3D Stage Styling */
  .stage-col {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 280px;
  }

  .isometric-3d-stage {
    position: relative;
    width: 280px;
    height: 260px;
    display: flex;
    align-items: center;
    justify-content: center;
    transform-style: preserve-3d;
    transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .holo-ring {
    position: absolute;
    border-radius: 50%;
    border: 1.5px dashed rgba(255, 255, 255, 0.15);
    transform-style: preserve-3d;
    transform: rotateX(65deg);
  }

  .ring-outer {
    width: 280px;
    height: 280px;
    border-color: rgba(255, 255, 255, 0.08);
    animation: spinRing 25s linear infinite;
  }

  .ring-middle {
    width: 210px;
    height: 210px;
    border-color: ${props => props.$glowColor || 'rgba(224, 35, 28, 0.3)'};
    animation: spinRingRev 18s linear infinite;
  }

  .ring-inner {
    width: 140px;
    height: 140px;
    border-color: rgba(201, 162, 74, 0.4);
    animation: spinRing 12s linear infinite;
  }

  @keyframes spinRing {
    from { transform: rotateX(65deg) rotateZ(0deg); }
    to { transform: rotateX(65deg) rotateZ(360deg); }
  }

  @keyframes spinRingRev {
    from { transform: rotateX(65deg) rotateZ(360deg); }
    to { transform: rotateX(65deg) rotateZ(0deg); }
  }

  .isometric-cube-assembly {
    position: relative;
    width: 80px;
    height: 80px;
    transform-style: preserve-3d;
    transform: rotateX(-25deg) rotateY(45deg);
    animation: floatNode 4s ease-in-out infinite alternate;
  }

  @keyframes floatNode {
    from { transform: rotateX(-25deg) rotateY(45deg) translateY(0px); }
    to { transform: rotateX(-25deg) rotateY(45deg) translateY(-14px); }
  }

  .cube-top {
    position: absolute;
    width: 80px;
    height: 80px;
    background: linear-gradient(135deg, ${props => props.$primaryColor || '#e0231c'}, #c41e17);
    border-radius: 20px;
    box-shadow: 0 0 35px ${props => props.$glowColor || 'rgba(224, 35, 28, 0.6)'};
    display: flex;
    align-items: center;
    justify-content: center;
    color: #ffffff;
    border: 2px solid rgba(255, 255, 255, 0.4);
  }

  .node-icon {
    filter: drop-shadow(0 4px 10px rgba(0, 0, 0, 0.5));
  }

  .orbit-chip {
    position: absolute;
    display: flex;
    align-items: center;
    gap: 0.65rem;
    padding: 0.55rem 0.85rem;
    border-radius: 16px;
    background: rgba(10, 15, 26, 0.92);
    border: 1px solid rgba(255, 255, 255, 0.15);
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.8), 0 0 20px rgba(255, 255, 255, 0.05);
    backdrop-filter: blur(12px);
    z-index: 10;
    transition: transform 0.3s ease;
  }

  .chip-1 {
    top: 10px;
    left: -20px;
    animation: floatChip1 5s ease-in-out infinite alternate;
  }

  .chip-2 {
    bottom: 10px;
    right: -25px;
    animation: floatChip2 6s ease-in-out infinite alternate;
  }

  .chip-3 {
    bottom: -15px;
    left: 10px;
    animation: floatChip3 5.5s ease-in-out infinite alternate;
  }

  @keyframes floatChip1 {
    from { transform: translateY(0px); }
    to { transform: translateY(-8px); }
  }

  @keyframes floatChip2 {
    from { transform: translateY(0px); }
    to { transform: translateY(8px); }
  }

  @keyframes floatChip3 {
    from { transform: translateY(0px); }
    to { transform: translateY(-6px); }
  }

  .chip-icon-box {
    width: 28px;
    height: 28px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .chip-icon-box.green { background: rgba(16, 185, 129, 0.2); color: #34d399; }
  .chip-icon-box.vermilion { background: rgba(224, 35, 28, 0.2); color: #ff5a3c; }
  .chip-icon-box.gold { background: rgba(201, 162, 74, 0.2); color: #e5be65; }

  .chip-lbl {
    font-size: 0.65rem;
    color: #94a3b8;
    text-transform: uppercase;
    font-weight: 700;
    letter-spacing: 0.06em;
    display: block;
  }

  .chip-val {
    font-size: 0.78rem;
    color: #ffffff;
    font-weight: 700;
    display: block;
  }
`;

export default ThreeDDashboardHero;
