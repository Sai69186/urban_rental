// Filter non-fatal browser extension & autofill heuristic warnings
(function () {
  const isTargetWarning = (item) => {
    if (!item) return false;
    const str = typeof item === 'string' ? item : item.message || item.stack || String(item);
    return (
      str.includes('deprecated parameters for the initialization function') ||
      str.includes('feature_collector')
    );
  };

  ['warn', 'error', 'log', 'info'].forEach((method) => {
    const orig = console[method];
    if (orig) {
      console[method] = function (...args) {
        for (let i = 0; i < args.length; i++) {
          if (isTargetWarning(args[i])) return;
        }
        return orig.apply(console, args);
      };
    }
  });
})();

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
