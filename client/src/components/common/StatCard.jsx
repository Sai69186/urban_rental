import React, { useState } from 'react';
import styled from 'styled-components';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

const StatCard = ({
  title,
  value,
  icon: Icon,
  change,
  changeType = 'positive',
  color = '#8b5cf6',
  subtitle,
  progress = null,
}) => {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 16;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -16;
    setTilt({ x, y });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  return (
    <StyledCard
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      $accentColor={color}
      style={{
        transform: `perspective(1000px) rotateY(${tilt.x}deg) rotateX(${tilt.y}deg)`,
      }}
    >
      {/* 3D Ambient Corner Glow */}
      <div className="card-ambient-glow" />

      {/* Header Row */}
      <div className="card-top-row">
        <div className="title-group">
          <span className="card-title-text">{title}</span>
          <h3 className="card-value-display">{value}</h3>
        </div>

        {Icon && (
          <div className="icon-3d-box">
            <Icon size={22} className="card-icon" />
          </div>
        )}
      </div>

      {/* Progress Bar (Optional) */}
      {progress !== null && (
        <div className="progress-track">
          <div
            className="progress-fill"
            style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
          />
        </div>
      )}

      {/* Footer / Subtitle Row */}
      {(change || subtitle) && (
        <div className="card-footer-row">
          {change && (
            <span className={`trend-pill ${changeType}`}>
              {changeType === 'positive' ? (
                <TrendingUp size={13} />
              ) : changeType === 'negative' ? (
                <TrendingDown size={13} />
              ) : (
                <Minus size={13} />
              )}
              {change}
            </span>
          )}
          {subtitle && <span className="subtitle-text">{subtitle}</span>}
        </div>
      )}
    </StyledCard>
  );
};

const StyledCard = styled.div`
  position: relative;
  background: linear-gradient(135deg, rgba(16, 22, 36, 0.45) 0%, rgba(10, 14, 24, 0.55) 100%);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 22px;
  padding: 1.5rem;
  box-shadow: 0 20px 45px -10px rgba(0, 0, 0, 0.5);
  transform-style: preserve-3d;
  transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;
  overflow: hidden;

  &:hover {
    border-color: rgba(255, 255, 255, 0.22);
    box-shadow: 0 25px 55px -10px rgba(0, 0, 0, 0.95), 0 0 30px ${props => props.$accentColor || 'rgba(139, 92, 246, 0.3)'};
  }

  .card-ambient-glow {
    position: absolute;
    top: -30px;
    right: -30px;
    width: 120px;
    height: 120px;
    border-radius: 50%;
    background: ${props => props.$accentColor || 'rgba(139, 92, 246, 0.25)'};
    filter: blur(40px);
    opacity: 0.4;
    pointer-events: none;
    transition: opacity 0.3s ease;
  }

  &:hover .card-ambient-glow {
    opacity: 0.8;
  }

  .card-top-row {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    position: relative;
    z-index: 2;
    transform: translateZ(20px);
  }

  .title-group {
    display: flex;
    flex-direction: column;
  }

  .card-title-text {
    font-size: 0.75rem;
    font-weight: 700;
    color: #94a3b8;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    font-family: var(--font-heading, "Plus Jakarta Sans", sans-serif);
  }

  .card-value-display {
    font-size: 2rem;
    font-weight: 800;
    color: #ffffff;
    margin-top: 0.35rem;
    letter-spacing: -0.025em;
    line-height: 1.15;
    font-family: var(--font-heading, "Plus Jakarta Sans", sans-serif);
    text-shadow: 0 2px 10px rgba(0, 0, 0, 0.4);
  }

  .icon-3d-box {
    width: 48px;
    height: 48px;
    border-radius: 14px;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.12);
    color: ${props => props.$accentColor || '#8b5cf6'};
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 8px 20px -4px rgba(0, 0, 0, 0.6);
    transform: translateZ(30px);
    transition: transform 0.3s ease, background 0.3s ease;
  }

  &:hover .icon-3d-box {
    transform: translateZ(40px) scale(1.08);
    background: rgba(255, 255, 255, 0.1);
  }

  .progress-track {
    width: 100%;
    height: 6px;
    background: rgba(255, 255, 255, 0.08);
    border-radius: 100px;
    margin-top: 1rem;
    overflow: hidden;
    position: relative;
    z-index: 2;
  }

  .progress-fill {
    height: 100%;
    background: linear-gradient(90deg, ${props => props.$accentColor || '#8b5cf6'}, #e0231c);
    border-radius: 100px;
    box-shadow: 0 0 10px ${props => props.$accentColor || '#8b5cf6'};
    transition: width 0.8s ease-in-out;
  }

  .card-footer-row {
    margin-top: 1rem;
    display: flex;
    align-items: center;
    gap: 0.65rem;
    font-size: 0.825rem;
    position: relative;
    z-index: 2;
    transform: translateZ(15px);
  }

  .trend-pill {
    display: inline-flex;
    align-items: center;
    gap: 0.3rem;
    padding: 0.25rem 0.6rem;
    border-radius: 8px;
    font-size: 0.72rem;
    font-weight: 700;
  }

  .trend-pill.positive {
    background: rgba(16, 185, 129, 0.15);
    color: #34d399;
    border: 1px solid rgba(16, 185, 129, 0.3);
  }

  .trend-pill.negative {
    background: rgba(239, 68, 68, 0.15);
    color: #f87171;
    border: 1px solid rgba(239, 68, 68, 0.3);
  }

  .trend-pill.neutral {
    background: rgba(245, 158, 11, 0.15);
    color: #fbbf24;
    border: 1px solid rgba(245, 158, 11, 0.3);
  }

  .subtitle-text {
    color: #94a3b8;
    font-size: 0.78rem;
    font-weight: 500;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

export default StatCard;
