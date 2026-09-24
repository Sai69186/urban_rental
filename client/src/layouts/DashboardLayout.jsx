import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../components/common/Sidebar';
import NotificationDropdown from '../components/common/NotificationDropdown';
import { Menu, Sparkles } from 'lucide-react';
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
    admin: { bg: 'rgba(168, 85, 247, 0.15)', text: '#c084fc', border: 'rgba(168, 85, 247, 0.4)' },
    owner: { bg: 'rgba(14, 165, 233, 0.15)', text: '#38bdf8', border: 'rgba(14, 165, 233, 0.4)' },
    tenant: { bg: 'rgba(16, 185, 129, 0.15)', text: '#34d399', border: 'rgba(16, 185, 129, 0.4)' },
  };

  const currentRoleStyle = roleStyles[user?.role] || roleStyles.tenant;

  return (
    <div className="dashboard-layout" style={{ display: 'flex', minHeight: '100vh', background: '#0b0f19' }}>
      {/* Sidebar */}
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
          background: 'radial-gradient(circle at 80% 10%, rgba(79, 70, 229, 0.08), transparent 500px), #0b0f19',
        }}
      >
        {/* Sticky Dashboard Header */}
        <header
          style={{
            position: 'sticky',
            top: 0,
            zIndex: 30,
            height: '76px',
            background: 'rgba(13, 19, 34, 0.9)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            borderBottom: '1px solid #1e293b',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 2.5rem',
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
                  fontFamily: 'var(--font-heading)',
                  lineHeight: 1.2,
                }}
              >
                {getPageTitle()}
              </h2>
              <p style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 500 }}>
                Welcome back, <span style={{ color: '#e2e8f0' }}>{user?.name}</span> 👋
              </p>
            </div>
          </div>

          {/* Right Header items */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <NotificationDropdown />

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                background: 'rgba(30, 41, 59, 0.6)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                padding: '0.35rem 0.85rem 0.35rem 0.45rem',
                borderRadius: '9999px',
              }}
            >
              <img
                src={
                  user?.profileImage ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=4f46e5&color=fff`
                }
                alt={user?.name}
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '2px solid rgba(129, 140, 248, 0.4)',
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
        <main style={{ padding: '2.5rem', flex: 1, maxWidth: '1440px', width: '100%' }}>
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
