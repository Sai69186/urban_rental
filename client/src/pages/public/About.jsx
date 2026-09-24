import React from 'react';
import { ShieldCheck, Building2, Users, FileCheck } from 'lucide-react';

const About = () => {
  return (
    <div className="container" style={{ padding: '4rem 1.5rem 6rem', maxWidth: '900px' }}>
      <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
        <h1 style={{ fontSize: '2.6rem', fontWeight: 800, marginBottom: '1rem' }}>
          About UrbanNest Platform
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', lineHeight: 1.6 }}>
          Building the trusted standard in modern residential tenancy and property lifecycle automation.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
        <div className="card">
          <h3 style={{ fontSize: '1.4rem', marginBottom: '0.75rem', color: '#ffffff' }}>Our Mission</h3>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8 }}>
            UrbanNest was architected to eliminate the traditional inefficiencies, paper-heavy workflows, and opacity of property renting. By combining real-time screening, automated digital lease agreements, transparent rent ledgers, and collaborative maintenance tracking, we empower property owners and tenants with confidence and peace of mind.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
          <div className="card">
            <ShieldCheck size={28} color="var(--primary-light)" style={{ marginBottom: '0.75rem' }} />
            <h4 style={{ fontSize: '1.1rem', marginBottom: '0.4rem' }}>Zero Fake Listings</h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
              Every property listing undergoes mandatory administrative verification before going live.
            </p>
          </div>

          <div className="card">
            <FileCheck size={28} color="var(--success)" style={{ marginBottom: '0.75rem' }} />
            <h4 style={{ fontSize: '1.1rem', marginBottom: '0.4rem' }}>Standardized Contracts</h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
              Clear lease terms, automated renewal reminders, and instant legally sound PDF generation.
            </p>
          </div>

          <div className="card">
            <Users size={28} color="var(--secondary)" style={{ marginBottom: '0.75rem' }} />
            <h4 style={{ fontSize: '1.1rem', marginBottom: '0.4rem' }}>Transparent Relations</h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
              In-app ticket escalation, direct notifications, and verified payment audit trails.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
