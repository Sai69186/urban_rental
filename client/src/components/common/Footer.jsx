import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, Shield, Heart, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer
      style={{
        background: 'transparent',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        paddingTop: '4rem',
        paddingBottom: '2.5rem',
        position: 'relative',
        zIndex: 10,
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
      }}
      className="no-print"
    >
      <div className="container">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '2.5rem',
            marginBottom: '3rem',
          }}
        >
          {/* Brand Col */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: 'var(--radius-md)',
                  background: 'linear-gradient(135deg, var(--primary), var(--accent))',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                }}
              >
                <Building2 size={20} />
              </div>
              <span style={{ fontSize: '1.25rem', fontWeight: 800, fontFamily: 'var(--font-heading)' }}>
                UrbanNest
              </span>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6 }}>
              Enterprise-grade Rental Property Management SaaS platform connecting verified owners and tenants with automated billing, digital agreements, and maintenance workflow.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1.25rem', color: '#ffffff' }}>
              Platform Navigation
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              <li>
                <Link to="/explore" style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                  Browse Rental Properties
                </Link>
              </li>
              <li>
                <Link to="/login" style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                  Owner Portal
                </Link>
              </li>
              <li>
                <Link to="/login" style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                  Tenant Dashboard
                </Link>
              </li>
              <li>
                <Link to="/register" style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                  List Your Property
                </Link>
              </li>
            </ul>
          </div>

          {/* Trust & Safety */}
          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1.25rem', color: '#ffffff' }}>
              Security & Legal
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              <li>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Shield size={14} color="var(--success)" /> Verified Tenant Screening
                </span>
              </li>
              <li>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                  Legally-Sound Lease Templates
                </span>
              </li>
              <li>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                  Encrypted Payment Records
                </span>
              </li>
              <li>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                  Audit Logging Compliance
                </span>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1.25rem', color: '#ffffff' }}>
              Contact & Support
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Mail size={16} color="var(--primary-light)" /> support@urbannestplatform.com
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Phone size={16} color="var(--primary-light)" /> +91 (800) 234-7890
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <MapPin size={16} color="var(--primary-light)" /> Tech Boulevard, Innovation District
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          style={{
            borderTop: '1px solid var(--border-color)',
            paddingTop: '1.5rem',
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '1rem',
            fontSize: '0.825rem',
            color: 'var(--text-muted)',
          }}
        >
          <p>© 2026 UrbanNest Rental Management Inc. All rights reserved.</p>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>Security Center</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
