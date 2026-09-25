import React, { useState } from 'react';
import { ShieldCheck, Building2, Users, FileCheck, Sparkles, ArrowRight, Award, Lock, CheckCircle2, ChevronRight, Maximize2, Layers } from 'lucide-react';
import { Link } from 'react-router-dom';
import '../../styles/kage-theme.css';

const About = () => {
  return (
    <div className="kage-full-theme" style={{ minHeight: 'calc(100vh - 76px)', position: 'relative' }}>
      {/* Ambient background light rays */}
      <div className="kage-ambient-canvas" aria-hidden="true" />

      <div className="kage-theme-container" style={{ paddingTop: '2.5rem', paddingBottom: '6rem' }}>
        {/* Header Section */}
        <div style={{ textAlign: 'center', marginBottom: '3rem', position: 'relative', zIndex: 2 }}>
          <div className="kage-chip">
            <span className="kage-chip-dot" />
            <span className="kage-chip-tx">01 — Sanctuary Tenancy Platform</span>
            <span className="kage-chip-jp">理念</span>
          </div>

          <h1
            className="kage-hero-heading"
            style={{
              fontSize: 'clamp(2.4rem, 5vw, 3.8rem)',
              marginBottom: '0.75rem',
            }}
          >
            About <em>UrbanNest</em>
          </h1>

          <p
            className="kage-hero-sub"
            style={{
              maxWidth: '720px',
              margin: '0 auto',
            }}
          >
            Pioneering the trusted standard in architectural residential tenancy, automated escrow ledgers, and legally binding digital lease counter-signatures.
          </p>
        </div>

        {/* ── Main Structured Information Sections ────────────── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem', position: 'relative', zIndex: 2 }}>
          
          {/* Mission Card */}
          <div
            style={{
              background: 'rgba(10, 14, 20, 0.78)',
              border: '1px solid var(--kage-line)',
              borderRadius: '24px',
              padding: 'clamp(2rem, 4vw, 3.25rem)',
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
              boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.8), 0 0 35px rgba(224, 35, 28, 0.1)',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--kage-vermilion)' }}>
                Our Core Philosophy
              </span>
              <span style={{ height: '1px', width: '40px', background: 'var(--kage-line)' }} />
            </div>

            <h2 style={{ fontSize: 'clamp(1.5rem, 2.5vw, 2.2rem)', fontWeight: 600, color: '#ffffff', marginBottom: '1.25rem', lineHeight: 1.3 }}>
              Architectural purity meets friction-free tenancy governance.
            </h2>

            <p style={{ color: 'var(--kage-bone-dim)', lineHeight: 1.8, fontSize: '1.05rem', maxWidth: '900px' }}>
              UrbanNest was architected to eliminate traditional inefficiencies, predatory brokerages, non-standard covenants, and opaque payment tracking in residential leasing. By integrating tamper-proof digital lease contracts, cryptographic role security, verified property credentials, and real-time maintenance lifecycle monitoring, we empower tenants and owners with unparalleled peace of mind.
            </p>
          </div>

          {/* Three Core Pillars Cards */}
          <div>
            <div className="kage-header-row" style={{ marginBottom: '1.5rem' }}>
              <span className="kage-chapter-tag">02 — Platform Pillars</span>
              <span className="kage-chapter-line" />
              <span className="kage-chapter-jp">柱 01 / 03</span>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '1.75rem',
              }}
            >
              {/* Pillar 1 */}
              <div
                style={{
                  background: 'rgba(10, 14, 20, 0.78)',
                  border: '1px solid var(--kage-line)',
                  borderRadius: '22px',
                  padding: '2rem',
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)',
                  transition: 'transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease',
                  position: 'relative',
                  overflow: 'hidden',
                }}
                className="about-hover-card"
              >
                <div
                  style={{
                    width: '52px',
                    height: '52px',
                    borderRadius: '14px',
                    background: 'rgba(224, 35, 28, 0.12)',
                    border: '1px solid rgba(224, 35, 28, 0.25)',
                    color: 'var(--kage-vermilion)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '1.25rem',
                  }}
                >
                  <ShieldCheck size={26} />
                </div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '0.65rem', color: '#ffffff' }}>
                  100% Verified Sanctuaries
                </h3>
                <p style={{ color: 'var(--kage-bone-dim)', fontSize: '0.925rem', lineHeight: 1.65 }}>
                  Zero ghost listings. Every residence undergoes strict administrative review, land records validation, and ownership verification before being published.
                </p>
              </div>

              {/* Pillar 2 */}
              <div
                style={{
                  background: 'rgba(10, 14, 20, 0.78)',
                  border: '1px solid var(--kage-line)',
                  borderRadius: '22px',
                  padding: '2rem',
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)',
                  transition: 'transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease',
                  position: 'relative',
                  overflow: 'hidden',
                }}
                className="about-hover-card"
              >
                <div
                  style={{
                    width: '52px',
                    height: '52px',
                    borderRadius: '14px',
                    background: 'rgba(16, 185, 129, 0.12)',
                    border: '1px solid rgba(16, 185, 129, 0.25)',
                    color: '#34d399',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '1.25rem',
                  }}
                >
                  <FileCheck size={26} />
                </div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '0.65rem', color: '#ffffff' }}>
                  Digital Automated Leases
                </h3>
                <p style={{ color: 'var(--kage-bone-dim)', fontSize: '0.925rem', lineHeight: 1.65 }}>
                  Standardized, legally compliant lease templates automatically generated on approval with digital countersigning, renewal alerts, and instant PDF downloads.
                </p>
              </div>

              {/* Pillar 3 */}
              <div
                style={{
                  background: 'rgba(10, 14, 20, 0.78)',
                  border: '1px solid var(--kage-line)',
                  borderRadius: '22px',
                  padding: '2rem',
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)',
                  transition: 'transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease',
                  position: 'relative',
                  overflow: 'hidden',
                }}
                className="about-hover-card"
              >
                <div
                  style={{
                    width: '52px',
                    height: '52px',
                    borderRadius: '14px',
                    background: 'rgba(59, 130, 246, 0.12)',
                    border: '1px solid rgba(59, 130, 246, 0.25)',
                    color: '#60a5fa',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '1.25rem',
                  }}
                >
                  <Users size={26} />
                </div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '0.65rem', color: '#ffffff' }}>
                  Transparent Lifecycle
                </h3>
                <p style={{ color: 'var(--kage-bone-dim)', fontSize: '0.925rem', lineHeight: 1.65 }}>
                  Centralized rent schedules, automated payment logging, ticketed maintenance lifecycle with cost audit logs, and instant owner-tenant notifications.
                </p>
              </div>
            </div>
          </div>

          {/* Call to Action Card */}
          <div
            style={{
              textAlign: 'center',
              padding: 'clamp(2.5rem, 5vw, 3.5rem)',
              background: 'rgba(10, 14, 20, 0.72)',
              borderRadius: '24px',
              border: '1px solid var(--kage-line)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.85)',
              marginTop: '1rem',
            }}
          >
            <div className="kage-chip" style={{ marginBottom: '1.25rem' }}>
              <span className="kage-chip-dot" />
              <span className="kage-chip-tx">Begin Your Journey</span>
              <span className="kage-chip-jp">探索</span>
            </div>

            <h3 style={{ fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', fontWeight: 600, marginBottom: '0.75rem', color: '#ffffff' }}>
              Ready to find your architectural sanctuary?
            </h3>
            <p style={{ color: 'var(--kage-bone-dim)', fontSize: '1.05rem', marginBottom: '2rem', maxWidth: '600px', margin: '0 auto 2rem' }}>
              Explore curated and verified residential properties available across major metropolises.
            </p>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              <Link
                to="/explore"
                className="kage-search-btn"
                style={{
                  padding: '14px 34px',
                  fontSize: '13px',
                  textDecoration: 'none',
                  borderRadius: '100px',
                }}
              >
                Browse Residences <ArrowRight size={16} />
              </Link>
              <Link
                to="/contact"
                className="kage-action-link"
                style={{
                  padding: '14px 30px',
                  fontSize: '12px',
                }}
              >
                Contact Support <ChevronRight size={14} />
              </Link>
            </div>
          </div>

        </div>
      </div>

      <style>{`
        .about-hover-card:hover {
          transform: translateY(-5px);
          border-color: rgba(224, 35, 28, 0.4) !important;
          box-shadow: 0 20px 45px rgba(0, 0, 0, 0.75), 0 0 25px rgba(224, 35, 28, 0.15) !important;
        }
      `}</style>
    </div>
  );
};

export default About;
