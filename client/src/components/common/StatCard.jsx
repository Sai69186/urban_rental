import React from 'react';

const StatCard = ({ title, value, icon: Icon, change, changeType = 'positive', color = '#4f46e5', subtitle }) => {
  return (
    <div className="stat-card group">
      {/* Background soft glow accent */}
      <div className="stat-card-glow" />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'relative', zIndex: 1 }}>
        <div>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block' }}>
            {title}
          </span>
          <h3 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#ffffff', marginTop: '0.35rem', letterSpacing: '-0.02em' }}>
            {value}
          </h3>
        </div>
        {Icon && (
          <div
            style={{
              padding: '0.75rem',
              borderRadius: '14px',
              background: 'rgba(79, 70, 229, 0.15)',
              color: '#818cf8',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
            className="group-hover:scale-110 transition-transform"
          >
            <Icon size={22} />
          </div>
        )}
      </div>

      {(change || subtitle) && (
        <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', fontWeight: 500, position: 'relative', zIndex: 1 }}>
          {change && (
            <span
              style={{
                fontWeight: 700,
                color: changeType === 'positive' ? '#34d399' : changeType === 'negative' ? '#f87171' : '#fbbf24',
              }}
            >
              {change}
            </span>
          )}
          {subtitle && <span style={{ color: '#94a3b8' }}>{subtitle}</span>}
        </div>
      )}
    </div>
  );
};

export default StatCard;
