import React from 'react';
import styled from 'styled-components';
import { PieChart, ArrowUpRight, Sparkles } from 'lucide-react';

const ThreeDProgressWidget = ({
  title = 'Capacity & Occupancy Matrix',
  subtitle = 'Decentralized Allocation',
  percentage = 86,
  items = [
    { label: 'Occupied Units', value: '86%', color: '#10b981' },
    { label: 'Pending Leases', value: '10%', color: '#c9a24a' },
    { label: 'Under Maintenance', value: '4%', color: '#e0231c' },
  ],
}) => {
  return (
    <StyledWidget>
      <div className="widget-header">
        <div>
          <span className="widget-tag">
            <Sparkles size={13} /> Live Allocation
          </span>
          <h3 className="widget-title">{title}</h3>
        </div>
        <div className="status-badge">
          <span className="badge-dot" />
          <span>Optimal</span>
        </div>
      </div>

      {/* Radial 3D Donut Gauge Center */}
      <div className="radial-gauge-container">
        <div
          className="donut-ring-3d"
          style={{
            background: `conic-gradient(#10b981 0% ${percentage}%, #c9a24a ${percentage}% 96%, #e0231c 96% 100%)`,
          }}
        >
          <div className="donut-center-hole">
            <span className="donut-num">{percentage}%</span>
            <span className="donut-sub">Occupancy</span>
          </div>
        </div>
      </div>

      {/* Breakdown Items List */}
      <div className="breakdown-list">
        {items.map((item, idx) => (
          <div key={idx} className="breakdown-row">
            <div className="row-left">
              <span className="item-bullet" style={{ background: item.color, boxShadow: `0 0 10px ${item.color}` }} />
              <span className="item-label">{item.label}</span>
            </div>
            <span className="item-value" style={{ color: item.color }}>{item.value}</span>
          </div>
        ))}
      </div>
    </StyledWidget>
  );
};

const StyledWidget = styled.div`
  position: relative;
  background: linear-gradient(135deg, rgba(14, 20, 30, 0.65) 0%, rgba(8, 12, 18, 0.75) 100%);
  border: 1px solid rgba(223, 231, 224, 0.1);
  border-radius: 24px;
  padding: 1.75rem;
  box-shadow: 0 20px 45px -10px rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  overflow: hidden;
  transition: all 0.3s ease;

  &:hover {
    border-color: rgba(224, 35, 28, 0.3);
    box-shadow: 0 25px 55px -10px rgba(0, 0, 0, 0.95), 0 0 35px rgba(224, 35, 28, 0.2);
  }

  .widget-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
  }

  .widget-tag {
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
    font-size: 0.72rem;
    font-weight: 700;
    color: #34d399;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    margin-bottom: 0.35rem;
  }

  .widget-title {
    font-size: 1.15rem;
    font-weight: 800;
    color: #ffffff;
    letter-spacing: -0.015em;
    margin: 0;
    font-family: var(--font-heading, "Plus Jakarta Sans", sans-serif);
  }

  .status-badge {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    padding: 0.3rem 0.65rem;
    border-radius: 100px;
    background: rgba(16, 185, 129, 0.15);
    border: 1px solid rgba(16, 185, 129, 0.3);
    color: #34d399;
    font-size: 0.72rem;
    font-weight: 700;
    text-transform: uppercase;
  }

  .badge-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #34d399;
    box-shadow: 0 0 8px #34d399;
  }

  .radial-gauge-container {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 1.5rem 0;
  }

  .donut-ring-3d {
    width: 150px;
    height: 150px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.8), 0 0 25px rgba(224, 35, 28, 0.25);
    position: relative;
    transition: transform 0.4s ease;
  }

  .donut-ring-3d:hover {
    transform: scale(1.05) rotate(5deg);
  }

  .donut-center-hole {
    width: 106px;
    height: 106px;
    border-radius: 50%;
    background: #05070a;
    border: 1px solid rgba(255, 255, 255, 0.1);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    box-shadow: inset 0 6px 14px rgba(0, 0, 0, 0.8);
  }

  .donut-num {
    font-size: 1.6rem;
    font-weight: 800;
    color: #ffffff;
    line-height: 1;
    font-family: var(--font-heading, "Plus Jakarta Sans", sans-serif);
  }

  .donut-sub {
    font-size: 0.68rem;
    font-weight: 700;
    color: #94a3b8;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    margin-top: 2px;
  }

  .breakdown-list {
    display: flex;
    flex-direction: column;
    gap: 0.65rem;
    border-top: 1px solid rgba(255, 255, 255, 0.08);
    padding-top: 1rem;
  }

  .breakdown-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 0.825rem;
  }

  .row-left {
    display: flex;
    align-items: center;
    gap: 0.6rem;
  }

  .item-bullet {
    width: 8px;
    height: 8px;
    border-radius: 50%;
  }

  .item-label {
    color: #cbd5e1;
    font-weight: 500;
  }

  .item-value {
    font-weight: 700;
  }
`;

export default ThreeDProgressWidget;
