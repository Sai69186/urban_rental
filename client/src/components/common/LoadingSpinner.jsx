import React from 'react';
import Loader from './Loader';

const LoadingSpinner = ({ text = 'Loading data...', fullScreen = false }) => {
  const content = (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', padding: '2rem' }}>
      <Loader />
      {text && (
        <span
          style={{
            color: 'var(--kage-bone-dim, #9aa89f)',
            fontSize: '0.85rem',
            fontWeight: 500,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            textAlign: 'center',
          }}
        >
          {text}
        </span>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {content}
      </div>
    );
  }

  return content;
};

export default LoadingSpinner;
