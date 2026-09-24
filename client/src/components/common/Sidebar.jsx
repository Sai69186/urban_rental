import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
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

  const roleGradients = {
    admin: 'linear-gradient(135deg, #8b5cf6, #4f46e5)',
    owner: 'linear-gradient(135deg, #0ea5e9, #4f46e5)',
    tenant: 'linear-gradient(135deg, #10b981, #0ea5e9)',
  };

  const roleBadgeColors = {
    admin: '#c084fc',
    owner: '#38bdf8',
    tenant: '#34d399',
  };

  return (
    <aside
      className={`dashboard-sidebar ${isOpen ? 'open' : ''}`}
      style={{
        width: '280px',
        background: '#0d1322',
        borderRight: '1px solid #1e293b',
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        top: 0,
        bottom: 0,
        left: 0,
        zIndex: 40,
        boxShadow: '10px 0 30px rgba(0, 0, 0, 0.4)',
      }}
    >
      {/* Brand Header */}
      <div
        style={{
          padding: '1.5rem',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.85rem',
          background: 'rgba(15, 23, 42, 0.6)',
        }}
      >
        <div
          style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: roleGradients[user?.role] || 'linear-gradient(135deg, #4f46e5, #8b5cf6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            boxShadow: '0 4px 14px rgba(79, 70, 229, 0.4)',
            flexShrink: 0,
          }}
        >
          <Building2 size={22} />
        </div>
        <div>
          <span
            style={{
              fontSize: '1.35rem',
              fontWeight: 800,
              letterSpacing: '-0.02em',
              color: '#ffffff',
              fontFamily: 'var(--font-heading)',
              display: 'block',
              lineHeight: 1.15,
            }}
          >
            UrbanNest
          </span>
          <span
            style={{
              fontSize: '0.68rem',
              fontWeight: 800,
              color: roleBadgeColors[user?.role] || '#818cf8',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
            }}
          >
            {user?.role?.toUpperCase()} PORTAL
          </span>
        </div>
      </div>

      {/* Navigation List */}
      <div
        style={{
          flex: 1,
          padding: '1.25rem 0.85rem',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.35rem',
        }}
      >
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={onClose}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: '0.85rem',
                padding: '0.75rem 1rem',
                borderRadius: '12px',
                fontSize: '0.9rem',
                fontWeight: isActive ? 700 : 500,
                color: isActive ? '#ffffff' : '#94a3b8',
                background: isActive
                  ? 'linear-gradient(90deg, rgba(79, 70, 229, 0.35) 0%, rgba(139, 92, 246, 0.15) 100%)'
                  : 'transparent',
                borderLeft: isActive ? '3px solid #818cf8' : '3px solid transparent',
                textDecoration: 'none',
                transition: 'all 0.15s ease',
              })}
            >
              {({ isActive }) => (
                <>
                  <Icon
                    size={18}
                    style={{
                      color: isActive ? '#818cf8' : '#64748b',
                      flexShrink: 0,
                      transition: 'color 0.15s ease',
                    }}
                  />
                  <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {link.label}
                  </span>
                  {isActive && <ChevronRight size={14} style={{ color: '#818cf8', opacity: 0.8 }} />}
                </>
              )}
            </NavLink>
          );
        })}
      </div>

      {/* User Info & Sign Out Footer */}
      <div
        style={{
          padding: '1.25rem',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          background: 'rgba(15, 23, 42, 0.85)',
          backdropFilter: 'blur(10px)',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '0.65rem 0.75rem',
            borderRadius: '12px',
            background: 'rgba(30, 41, 59, 0.5)',
            border: '1px solid rgba(255, 255, 255, 0.05)',
            marginBottom: '0.85rem',
          }}
        >
          <img
            src={
              user?.profileImage ||
              `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=4f46e5&color=fff`
            }
            alt={user?.name}
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              objectFit: 'cover',
              border: '2px solid rgba(129, 140, 248, 0.4)',
              flexShrink: 0,
            }}
          />
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontSize: '0.875rem', fontWeight: 700, color: '#ffffff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {user?.name}
            </p>
            <p style={{ fontSize: '0.725rem', color: '#64748b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {user?.email}
            </p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="btn btn-outline btn-sm"
          style={{
            width: '100%',
            justifyContent: 'center',
            fontSize: '0.825rem',
            padding: '0.55rem',
            borderColor: 'rgba(239, 68, 68, 0.3)',
            color: '#f87171',
          }}
        >
          <LogOut size={15} /> Sign Out
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
