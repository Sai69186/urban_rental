import React from 'react';

/**
 * UrbanNestLogo Component
 * Replicates the authentic Urban Nest brand mark:
 * - Arched sunbeam trajectory arc
 * - Architectural red gable roofline with chimney & window grid
 * - Bold serif "URBAN NEST" branding
 * - Tagline: "Get Houses without Strain"
 */
const UrbanNestLogo = ({
  height = 54,
  variant = 'full', // 'full' (stacked) | 'horizontal' (compact) | 'icon-only'
  className = '',
  style = {},
}) => {
  if (variant === 'icon-only') {
    return (
      <svg
        viewBox="0 0 140 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ height: `${height}px`, width: 'auto', display: 'block', ...style }}
        className={className}
      >
        <defs>
          <linearGradient id="logo-arch-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#f97316" />
            <stop offset="50%" stopColor="#fb923c" />
            <stop offset="100%" stopColor="#f97316" />
          </linearGradient>
        </defs>

        {/* Ambient Top Sunbeam Arch */}
        <path
          d="M 12 95 A 58 58 0 0 1 128 95"
          stroke="url(#logo-arch-grad)"
          strokeWidth="6"
          strokeLinecap="round"
          fill="none"
        />

        {/* Chimney */}
        <path d="M 76 38 L 87 38 L 87 56 L 76 47 Z" fill="#b91c1c" />

        {/* Gable Roof */}
        <path
          d="M 28 72 L 70 24 L 112 72 L 96 72 L 70 42 L 44 72 Z"
          fill="#dc2626"
        />

        {/* Window Quadrant in Gable */}
        <g opacity="0.85">
          {/* Top-Left Pane */}
          <polygon points="68,48 57,60 68,60" fill="#e2e8f0" />
          {/* Top-Right Pane */}
          <polygon points="72,48 72,60 83,60" fill="#e2e8f0" />
          {/* Bottom-Left Pane */}
          <polygon points="55,63 68,63 68,70 49,70" fill="#cbd5e1" />
          {/* Bottom-Right Pane */}
          <polygon points="72,63 85,63 91,70 72,70" fill="#cbd5e1" />
        </g>
      </svg>
    );
  }

  if (variant === 'horizontal') {
    return (
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.75rem',
          textDecoration: 'none',
          ...style,
        }}
        className={className}
      >
        <svg
          viewBox="0 0 140 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ height: `${height}px`, width: 'auto', display: 'block', flexShrink: 0 }}
        >
          <defs>
            <linearGradient id="logo-arch-grad-h" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#f97316" />
              <stop offset="50%" stopColor="#fb923c" />
              <stop offset="100%" stopColor="#f97316" />
            </linearGradient>
          </defs>

          {/* Ambient Top Sunbeam Arch */}
          <path
            d="M 12 95 A 58 58 0 0 1 128 95"
            stroke="url(#logo-arch-grad-h)"
            strokeWidth="6.5"
            strokeLinecap="round"
            fill="none"
          />

          {/* Chimney */}
          <path d="M 76 38 L 87 38 L 87 56 L 76 47 Z" fill="#b91c1c" />

          {/* Gable Roof */}
          <path
            d="M 28 72 L 70 24 L 112 72 L 96 72 L 70 42 L 44 72 Z"
            fill="#dc2626"
          />

          {/* Window Quadrant */}
          <g opacity="0.85">
            <polygon points="68,48 57,60 68,60" fill="#e2e8f0" />
            <polygon points="72,48 72,60 83,60" fill="#e2e8f0" />
            <polygon points="55,63 68,63 68,70 49,70" fill="#cbd5e1" />
            <polygon points="72,63 85,63 91,70 72,70" fill="#cbd5e1" />
          </g>
        </svg>

        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <span
            style={{
              fontFamily: "'Playfair Display', 'Georgia', 'Cinzel', serif",
              fontWeight: 900,
              fontSize: `${height * 0.44}px`,
              color: '#e0231c',
              letterSpacing: '0.04em',
              lineHeight: 1.1,
              textTransform: 'uppercase',
            }}
          >
            URBAN NEST
          </span>
          <span
            style={{
              fontFamily: "var(--font-main, 'Onest', sans-serif)",
              fontWeight: 600,
              fontSize: `${Math.max(10, height * 0.22)}px`,
              color: '#e0231c',
              letterSpacing: '0.02em',
              lineHeight: 1.2,
              marginTop: '1px',
            }}
          >
            Get Houses without Strain
          </span>
        </div>
      </div>
    );
  }

  // Default: 'full' stacked layout matching the image exactly
  return (
    <div
      style={{
        display: 'inline-flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textDecoration: 'none',
        ...style,
      }}
      className={className}
    >
      <svg
        viewBox="0 0 280 185"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ height: `${height}px`, width: 'auto', display: 'block' }}
      >
        <defs>
          <linearGradient id="logo-arch-grad-full" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#f97316" />
            <stop offset="50%" stopColor="#fb923c" />
            <stop offset="100%" stopColor="#f97316" />
          </linearGradient>
        </defs>

        {/* Ambient Top Sunbeam Arch */}
        <path
          d="M 30 100 A 110 110 0 0 1 250 100"
          stroke="url(#logo-arch-grad-full)"
          strokeWidth="7"
          strokeLinecap="round"
          fill="none"
        />

        {/* Chimney */}
        <path d="M 152 38 L 174 38 L 174 65 L 152 50 Z" fill="#b91c1c" />

        {/* Gable Roof */}
        <path
          d="M 60 90 L 140 22 L 220 90 L 192 90 L 140 46 L 88 90 Z"
          fill="#dc2626"
        />

        {/* Window Quadrant in Gable */}
        <g opacity="0.9">
          {/* Top-Left Pane */}
          <polygon points="136,54 116,72 136,72" fill="#e2e8f0" />
          {/* Top-Right Pane */}
          <polygon points="144,54 144,72 164,72" fill="#e2e8f0" />
          {/* Bottom-Left Pane */}
          <polygon points="112,76 136,76 136,87 99,87" fill="#cbd5e1" />
          {/* Bottom-Right Pane */}
          <polygon points="144,76 168,76 181,87 144,87" fill="#cbd5e1" />
        </g>

        {/* Brand Text: URBAN NEST */}
        <text
          x="140"
          y="136"
          textAnchor="middle"
          fill="#dc2626"
          fontFamily="'Playfair Display', 'Georgia', 'Cinzel', serif"
          fontWeight="900"
          fontSize="36"
          letterSpacing="1.5"
        >
          URBAN NEST
        </text>

        {/* Subtitle: Get Houses without Strain */}
        <text
          x="140"
          y="170"
          textAnchor="middle"
          fill="#dc2626"
          fontFamily="var(--font-main, 'Onest', sans-serif)"
          fontWeight="500"
          fontSize="17"
          letterSpacing="0.5"
        >
          Get Houses without Strain
        </text>
      </svg>
    </div>
  );
};

export default UrbanNestLogo;
