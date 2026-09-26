import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Building2, Search, LogOut, Menu, X, LayoutDashboard } from 'lucide-react';
import NotificationDropdown from './NotificationDropdown';
import UrbanNestLogo from './UrbanNestLogo';
import { getRealisticAvatar } from '../../utils/avatarHelper';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const getDashboardRoute = () => {
    if (user?.role === 'admin') return '/admin/overview';
    if (user?.role === 'owner') return '/owner/overview';
    return '/tenant/overview';
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        background: 'rgba(5, 7, 10, 0.35)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
        width: '100%',
        transition: 'background 0.3s ease, border-color 0.3s ease',
      }}
      className="no-print"
    >
      <div
        className="container"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '76px',
        }}
      >
        {/* Brand Logo */}
        <Link
          to="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            textDecoration: 'none',
          }}
        >
          <UrbanNestLogo height={46} variant="horizontal" />
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="navbar-desktop-links">
          <Link
            to="/explore"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              fontSize: '0.925rem',
              fontWeight: 600,
              color: location.pathname === '/explore' ? '#ff5a3c' : '#cbd5e1',
              borderBottom: location.pathname === '/explore' ? '2px solid #e0231c' : '2px solid transparent',
              paddingBottom: '0.25rem',
              transition: 'color 0.15s ease',
            }}
          >
            <Search size={16} /> Explore Homes
          </Link>
          <Link
            to="/about"
            style={{
              fontSize: '0.925rem',
              fontWeight: 600,
              color: location.pathname === '/about' ? '#ff5a3c' : '#cbd5e1',
              borderBottom: location.pathname === '/about' ? '2px solid #e0231c' : '2px solid transparent',
              paddingBottom: '0.25rem',
              transition: 'color 0.15s ease',
            }}
          >
            About
          </Link>
          <Link
            to="/contact"
            style={{
              fontSize: '0.925rem',
              fontWeight: 600,
              color: location.pathname === '/contact' ? '#ff5a3c' : '#cbd5e1',
              borderBottom: location.pathname === '/contact' ? '2px solid #e0231c' : '2px solid transparent',
              paddingBottom: '0.25rem',
              transition: 'color 0.15s ease',
            }}
          >
            Support
          </Link>
        </nav>

        {/* User Actions & Mobile Toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          {isAuthenticated ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
              <NotificationDropdown />
              <Link to={getDashboardRoute()} className="btn btn-primary btn-sm">
                <LayoutDashboard size={15} /> Dashboard
              </Link>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.65rem',
                  paddingLeft: '0.75rem',
                  borderLeft: '1px solid rgba(255,255,255,0.1)',
                }}
              >
                <img
                  src={getRealisticAvatar(user)}
                  alt={user?.name}
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    border: '1.5px solid rgba(255, 255, 255, 0.15)',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
                  }}
                />
                <button
                  onClick={handleLogout}
                  className="p-2 text-slate-400 hover:text-rose-400 rounded-lg"
                  title="Sign Out"
                  style={{
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#94a3b8',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <LogOut size={18} />
                </button>
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Link
                to="/login"
                style={{
                  padding: '0.55rem 1rem',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  color: '#cbd5e1',
                  textDecoration: 'none',
                }}
              >
                Sign In
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                Get Started
              </Link>
            </div>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="navbar-mobile-toggle"
            aria-label="Toggle menu"
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: '#94a3b8',
              padding: '0.4rem',
            }}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div
          style={{
            background: '#0f172a',
            borderTop: '1px solid #334155',
            padding: '1.25rem 1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
          }}
        >
          <Link
            to="/explore"
            onClick={() => setMobileMenuOpen(false)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              color: '#f8fafc',
              fontWeight: 600,
              fontSize: '0.95rem',
            }}
          >
            <Search size={16} /> Explore Homes
          </Link>
          <Link
            to="/about"
            onClick={() => setMobileMenuOpen(false)}
            style={{ color: '#f8fafc', fontWeight: 600, fontSize: '0.95rem' }}
          >
            About
          </Link>
          <Link
            to="/contact"
            onClick={() => setMobileMenuOpen(false)}
            style={{ color: '#f8fafc', fontWeight: 600, fontSize: '0.95rem' }}
          >
            Support
          </Link>
        </div>
      )}

      <style>{`
        .navbar-desktop-links {
          display: flex;
          align-items: center;
          gap: 2.25rem;
        }
        .navbar-mobile-toggle {
          display: none;
        }
        @media (max-width: 768px) {
          .navbar-desktop-links {
            display: none !important;
          }
          .navbar-mobile-toggle {
            display: flex !important;
            align-items: center;
            justify-content: center;
          }
        }
      `}</style>
    </header>
  );
};

export default Navbar;
