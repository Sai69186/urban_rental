import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../../context/AuthContext';
import {
  Building2,
  LayoutDashboard,
  Users,
  Home,
  FileText,
  FileCheck,
  CreditCard,
  Wrench,
  AlertCircle,
  Bell,
  ScrollText,
  Radio,
  Bookmark,
  PlusCircle,
  LogOut,
  User,
  ShieldCheck,
  ChevronRight,
  Sparkles,
  Zap,
} from 'lucide-react';

const Sidebar = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const adminLinks = [
    { to: '/admin/overview', label: 'Platform Overview', icon: LayoutDashboard },
    { to: '/admin/users', label: 'User Management', icon: Users },
    { to: '/admin/properties', label: 'Property Approvals', icon: Building2 },
    { to: '/admin/applications', label: 'All Applications', icon: FileText },
    { to: '/admin/agreements', label: 'Rental Agreements', icon: FileCheck },
    { to: '/admin/payments', label: 'Payments & Revenue', icon: CreditCard },
    { to: '/admin/maintenance', label: 'Maintenance Requests', icon: Wrench },
    { to: '/admin/complaints', label: 'Support & Complaints', icon: AlertCircle },
    { to: '/admin/audit-logs', label: 'Audit Trail', icon: ScrollText },
    { to: '/admin/broadcast', label: 'Broadcast Message', icon: Radio },
  ];

  const ownerLinks = [
    { to: '/owner/overview', label: 'Dashboard Overview', icon: LayoutDashboard },
    { to: '/owner/properties', label: 'My Properties', icon: Building2 },
    { to: '/owner/applications', label: 'Tenant Applications', icon: FileText },
    { to: '/owner/agreements', label: 'Rental Agreements', icon: FileCheck },
    { to: '/owner/rent-ledger', label: 'Rent Ledger & Billing', icon: CreditCard },
    { to: '/owner/maintenance', label: 'Maintenance Tickets', icon: Wrench },
    { to: '/owner/profile', label: 'Account Profile', icon: User },
  ];

  const tenantLinks = [
    { to: '/tenant/overview', label: 'Tenant Hub', icon: LayoutDashboard },
    { to: '/explore', label: 'Find Properties', icon: Home },
    { to: '/tenant/favorites', label: 'Saved Favorites', icon: Bookmark },
    { to: '/tenant/applications', label: 'My Applications', icon: FileText },
    { to: '/tenant/rental', label: 'Current Rental', icon: Building2 },
    { to: '/tenant/agreement', label: 'Lease Agreement', icon: FileCheck },
    { to: '/tenant/rent', label: 'Pay Rent & Receipts', icon: CreditCard },
    { to: '/tenant/maintenance', label: 'Maintenance Requests', icon: Wrench },
    { to: '/tenant/complaints', label: 'File Complaint', icon: AlertCircle },
    { to: '/tenant/profile', label: 'My Profile', icon: User },
  ];

  let links = tenantLinks;
  if (user?.role === 'admin') links = adminLinks;
  else if (user?.role === 'owner') links = ownerLinks;

  const roleTheme = {
    admin: { color: '#8b5cf6', badge: '#c084fc', glow: 'rgba(139, 92, 246, 0.4)' },
    owner: { color: '#0ea5e9', badge: '#38bdf8', glow: 'rgba(14, 165, 233, 0.4)' },
    tenant: { color: '#10b981', badge: '#34d399', glow: 'rgba(16, 185, 129, 0.4)' },
  };

  const theme = roleTheme[user?.role] || roleTheme.tenant;

  return (
    <StyledSidebarWrapper className={`dashboard-sidebar ${isOpen ? 'open' : ''}`} $themeColor={theme.color} $themeGlow={theme.glow}>
      {/* Brand & 3D Logo Header */}
      <div className="sidebar-brand-box">
        <div className="logo-cube-3d">
          <Building2 size={22} />
        </div>
        <div className="brand-titles">
          <span className="brand-name">UrbanNest</span>
          <span className="brand-role" style={{ color: theme.badge }}>
            {user?.role?.toUpperCase()} PORTAL
          </span>
        </div>
      </div>

      {/* Navigation Rail */}
      <div className="sidebar-nav-container">
        <div className="nav-group-label">Navigation Engine</div>
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={onClose}
              className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}
            >
              {({ isActive }) => (
                <>
                  <div className="icon-wrapper">
                    <Icon size={18} />
                  </div>
                  <span className="nav-label-text">{link.label}</span>
                  {isActive && <ChevronRight size={14} className="active-arrow" />}
                </>
              )}
            </NavLink>
          );
        })}
      </div>

      {/* 3D User Status & Sign Out Footer */}
      <div className="sidebar-footer-box">
        <div className="user-profile-capsule">
          <img
            src={
              user?.profileImage ||
              `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=4f46e5&color=fff`
            }
            alt={user?.name}
            className="user-avatar-img"
          />
          <div className="user-meta-info">
            <p className="user-display-name">{user?.name}</p>
            <p className="user-display-email">{user?.email}</p>
          </div>
        </div>

        <button onClick={handleLogout} className="sign-out-btn">
          <LogOut size={15} /> Sign Out
        </button>
      </div>
    </StyledSidebarWrapper>
  );
};

const StyledSidebarWrapper = styled.aside`
  width: 280px;
  background: rgba(5, 7, 10, 0.25);
  border-right: 1px solid rgba(255, 255, 255, 0.08);
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  z-index: 40;
  box-shadow: 10px 0 30px rgba(0, 0, 0, 0.3);

  .sidebar-brand-box {
    padding: 1.5rem 1.4rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
    display: flex;
    align-items: center;
    gap: 0.85rem;
    background: rgba(255, 255, 255, 0.02);
  }

  .logo-cube-3d {
    width: 42px;
    height: 42px;
    border-radius: 12px;
    background: linear-gradient(135deg, ${props => props.$themeColor || '#8b5cf6'}, #e0231c);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #ffffff;
    box-shadow: 0 4px 16px ${props => props.$themeGlow || 'rgba(139, 92, 246, 0.4)'};
    flex-shrink: 0;
    transition: transform 0.3s ease;
  }

  .sidebar-brand-box:hover .logo-cube-3d {
    transform: rotate(10deg) scale(1.05);
  }

  .brand-titles {
    display: flex;
    flex-direction: column;
  }

  .brand-name {
    font-size: 1.35rem;
    font-weight: 800;
    letter-spacing: -0.02em;
    color: #ffffff;
    font-family: var(--font-heading, "Plus Jakarta Sans", sans-serif);
    line-height: 1.15;
  }

  .brand-role {
    font-size: 0.68rem;
    font-weight: 800;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    margin-top: 2px;
  }

  .sidebar-nav-container {
    flex: 1;
    padding: 1.25rem 0.85rem;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
  }

  .nav-group-label {
    font-size: 0.68rem;
    font-weight: 800;
    letter-spacing: 0.12em;
    color: #64748b;
    text-transform: uppercase;
    padding: 0.4rem 0.85rem;
    margin-bottom: 0.2rem;
  }

  .sidebar-nav-item {
    display: flex;
    align-items: center;
    gap: 0.85rem;
    padding: 0.75rem 1rem;
    border-radius: 14px;
    font-size: 0.88rem;
    font-weight: 500;
    color: #94a3b8;
    background: transparent;
    border: 1px solid transparent;
    text-decoration: none;
    transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
    position: relative;
    overflow: hidden;
  }

  .sidebar-nav-item:hover {
    color: #ffffff;
    background: rgba(255, 255, 255, 0.05);
    border-color: rgba(255, 255, 255, 0.08);
    transform: translateX(3px);
  }

  .sidebar-nav-item.active {
    font-weight: 700;
    color: #ffffff;
    background: linear-gradient(90deg, ${props => props.$themeGlow || 'rgba(139, 92, 246, 0.25)'} 0%, rgba(255, 255, 255, 0.03) 100%);
    border: 1px solid rgba(255, 255, 255, 0.12);
    border-left: 3px solid ${props => props.$themeColor || '#8b5cf6'};
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
  }

  .icon-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    color: #64748b;
    transition: color 0.2s ease, transform 0.2s ease;
  }

  .sidebar-nav-item:hover .icon-wrapper {
    color: #ffffff;
    transform: scale(1.1);
  }

  .sidebar-nav-item.active .icon-wrapper {
    color: ${props => props.$themeColor || '#8b5cf6'};
  }

  .nav-label-text {
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .active-arrow {
    color: ${props => props.$themeColor || '#8b5cf6'};
    opacity: 0.9;
  }

  .sidebar-footer-box {
    padding: 1.25rem;
    border-top: 1px solid rgba(255, 255, 255, 0.08);
    background: rgba(10, 14, 24, 0.85);
    backdrop-filter: blur(10px);
  }

  .user-profile-capsule {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.65rem 0.75rem;
    border-radius: 14px;
    background: rgba(30, 41, 59, 0.4);
    border: 1px solid rgba(255, 255, 255, 0.08);
    margin-bottom: 0.75rem;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
  }

  .user-avatar-img {
    width: 38px;
    height: 38px;
    border-radius: 50%;
    object-fit: cover;
    border: 2px solid ${props => props.$themeColor || 'rgba(139, 92, 246, 0.5)'};
    flex-shrink: 0;
  }

  .user-meta-info {
    flex: 1;
    min-width: 0;
  }

  .user-display-name {
    font-size: 0.875rem;
    font-weight: 700;
    color: #ffffff;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    margin: 0;
  }

  .user-display-email {
    font-size: 0.72rem;
    color: #94a3b8;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    margin: 0;
  }

  .sign-out-btn {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.4rem;
    font-size: 0.825rem;
    font-weight: 600;
    padding: 0.55rem;
    border-radius: 10px;
    background: rgba(239, 68, 68, 0.1);
    border: 1px solid rgba(239, 68, 68, 0.25);
    color: #f87171;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .sign-out-btn:hover {
    background: rgba(239, 68, 68, 0.2);
    border-color: rgba(239, 68, 68, 0.4);
    transform: translateY(-1px);
  }
`;

export default Sidebar;
