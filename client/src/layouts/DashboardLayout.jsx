import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../components/common/Sidebar';
import NotificationDropdown from '../components/common/NotificationDropdown';
import KageAmbientAtmosphere from '../components/common/KageAmbientAtmosphere';
import { Menu, Sparkles, Activity, Search, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useAuth();
  const location = useLocation();

  const getPageTitle = () => {
    const path = location.pathname.split('/').filter(Boolean);
    if (path.length > 1) {
      const title = path[1].replace('-', ' ');
      return title.charAt(0).toUpperCase() + title.slice(1);
    }
    return 'Overview';
  };

  const roleStyles = {
    admin: { bg: 'rgba(224, 35, 28, 0.15)', text: '#ff5a3c', border: 'rgba(224, 35, 28, 0.4)', glow: '#e0231c' },
    owner: { bg: 'rgba(201, 162, 74, 0.15)', text: '#e5be65', border: 'rgba(201, 162, 74, 0.4)', glow: '#c9a24a' },
    tenant: { bg: 'rgba(16, 185, 129, 0.15)', text: '#34d399', border: 'rgba(16, 185, 129, 0.4)', glow: '#10b981' },
  };

  const currentRoleStyle = roleStyles[user?.role] || roleStyles.tenant;

  return (
    <div className="dashboard-layout" style={{ display: 'flex', minHeight: '100vh', background: '#05070a', position: 'relative', overflow: 'hidden' }}>
      {/* Universal Ambient Light Shafts and Silhouettes across entire viewport */}
      <KageAmbientAtmosphere />

      {/* Transparent Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Area */}
      <div
        className="dashboard-main"
        style={{
          flex: 1,
          marginLeft: '280px',
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          width: 'calc(100% - 280px)',
          background: 'transparent',
          position: 'relative',
          zIndex: 10,
        }}
      >
        {/* Transparent Header */}
        <header
          style={{
            position: 'sticky',
            top: 0,
            zIndex: 30,
            height: '76px',
            background: 'transparent',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 clamp(1.5rem, 3vw, 2.5rem)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="dashboard-mobile-menu-btn"
              style={{
                background: 'transparent',
                border: 'none',
                color: '#94a3b8',
                cursor: 'pointer',
                padding: '0.4rem',
              }}
            >
              <Menu size={22} />
            </button>
            <div>
              <h2
                style={{
                  fontSize: '1.45rem',
                  fontWeight: 800,
                  color: '#ffffff',
                  letterSpacing: '-0.02em',
                  fontFamily: 'var(--font-heading, "Plus Jakarta Sans", sans-serif)',
                  lineHeight: 1.2,
                  margin: 0,
                }}
              >
                {getPageTitle()}
              </h2>
              <p style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: 500, margin: 0 }}>
                Welcome back, <span style={{ color: '#ffffff', fontWeight: 700 }}>{user?.name}</span> 👋
              </p>
            </div>
          </div>

          {/* Right Telemetry & Profile items */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            {/* Live Telemetry Beacon */}
            <div
              className="telemetry-beacon-badge"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.35rem 0.85rem',
                borderRadius: '100px',
                background: 'rgba(16, 185, 129, 0.1)',
                border: '1px solid rgba(16, 185, 129, 0.25)',
                fontSize: '0.75rem',
                fontWeight: 700,
                color: '#34d399',
              }}
            >
              <span
                style={{
                  width: '7px',
                  height: '7px',
                  borderRadius: '50%',
                  background: '#34d399',
                  boxShadow: '0 0 10px #34d399',
                }}
              />
              <span className="telemetry-text">LIVE TELEMETRY</span>
            </div>

            <NotificationDropdown />

            {/* User Capsule */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                background: 'rgba(30, 41, 59, 0.4)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                padding: '0.35rem 0.85rem 0.35rem 0.45rem',
                borderRadius: '9999px',
                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)',
              }}
            >
              <img
                src={
                  user?.profileImage ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=e0231c&color=fff`
                }
                alt={user?.name}
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: `2px solid ${currentRoleStyle.glow}`,
                }}
              />
              <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#ffffff' }} className="header-username">
                {user?.name?.split(' ')[0]}
              </span>
              <span
                style={{
                  fontSize: '0.65rem',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  padding: '0.2rem 0.6rem',
                  borderRadius: '9999px',
                  background: currentRoleStyle.bg,
                  color: currentRoleStyle.text,
                  border: `1px solid ${currentRoleStyle.border}`,
                }}
              >
                {user?.role}
              </span>
            </div>
          </div>
        </header>

        {/* Dynamic Nested Page Content */}
        <main style={{ padding: 'clamp(1.5rem, 3vw, 2.5rem)', flex: 1, maxWidth: '1440px', width: '100%' }}>
          <Outlet />
        </main>
      </div>

      <style>{`
        .dashboard-mobile-menu-btn {
          display: none;
        }
        @media (max-width: 1024px) {
          .dashboard-sidebar {
            transform: translateX(-100%);
            transition: transform 0.25s ease;
          }
          .dashboard-sidebar.open {
            transform: translateX(0);
          }
          .dashboard-main {
            margin-left: 0 !important;
            width: 100% !important;
          }
          .dashboard-mobile-menu-btn {
            display: block !important;
          }
        }
        @media (max-width: 768px) {
          .telemetry-beacon-badge {
            display: none !important;
          }
        }
        @media (max-width: 640px) {
          .header-username {
            display: none;
          }
        }
      `}</style>
    </div>
  );
};

export default DashboardLayout;
