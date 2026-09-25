import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import '../../styles/kage-theme.css';
import {
  Search,
  MapPin,
  CheckCircle2,
  Lock,
  Award,
  FileCheck2,
  CreditCard,
  Wrench,
  ShieldCheck,
  ChevronRight,
  ArrowUpRight,
  UserCheck,
  Building,
  KeyRound,
  Bed,
  Bath,
  Maximize2
} from 'lucide-react';

export function Scene() {
  const [featuredProperties, setFeaturedProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchCity, setSearchCity] = useState('');
  const [searchType, setSearchType] = useState('All');
  const [activeSection, setActiveSection] = useState('hero');
  const iframeRef = useRef(null);
  const navigate = useNavigate();

  // Load properties from API with high-end fallback samples
  useEffect(() => {
    let isMounted = true;
    const fetchFeatured = async () => {
      try {
        const res = await api.get('/properties?limit=6');
        if (res.data?.success && res.data.data?.length > 0) {
          if (isMounted) setFeaturedProperties(res.data.data);
        } else {
          if (isMounted) setFeaturedProperties(getDefaultFeatured());
        }
      } catch (err) {
        if (isMounted) setFeaturedProperties(getDefaultFeatured());
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchFeatured();
    return () => { isMounted = false; };
  }, []);

  // Handle iframe background presentation & scroll sync
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? scrollY / docHeight : 0;

      // Sync scroll inside the Kage 3D scene iframe
      if (iframeRef.current?.contentWindow) {
        try {
          const iframeDoc = iframeRef.current.contentDocument;
          const targetY = progress * ((iframeDoc?.body?.scrollHeight || 3000) - window.innerHeight);
          iframeRef.current.contentWindow.scrollTo(0, targetY);
        } catch (e) {
          // Cross-origin fallback
        }
      }

      // Update active section based on scroll position
      const sections = ['hero', 'residences', 'ecosystem', 'portals', 'gateway'];
      for (const id of sections) {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= window.innerHeight * 0.4 && rect.bottom >= window.innerHeight * 0.2) {
            setActiveSection(id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle pointer move to relay mouse parallax to 3D scene
  const handlePointerMove = (e) => {
    if (iframeRef.current?.contentWindow) {
      try {
        iframeRef.current.contentWindow.dispatchEvent(
          new MouseEvent('pointermove', {
            clientX: e.clientX,
            clientY: e.clientY,
            bubbles: true,
          })
        );
      } catch (err) {
        // Ignore iframe cross-origin if restricted
      }
    }
  };

  const handleHeroSearch = (e) => {
    e.preventDefault();
    const query = new URLSearchParams();
    if (searchCity.trim()) query.append('city', searchCity.trim());
    if (searchType && searchType !== 'All') query.append('propertyType', searchType);
    navigate(`/explore?${query.toString()}`);
  };

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const onIframeLoad = () => {
    try {
      const doc = iframeRef.current?.contentDocument;
      if (!doc) return;

      // Ensure canvas runs full screen and template text is clean
      doc.documentElement.setAttribute('data-threeui-presentation', 'background');
      const style = doc.createElement('style');
      style.textContent = `
        html[data-threeui-presentation="background"],
        html[data-threeui-presentation="background"] body {
          width: 100% !important;
          height: 100% !important;
          overflow: hidden !important;
          background: #05070a !important;
        }
        body * {
          visibility: hidden !important;
          pointer-events: none !important;
        }
        #gl, #gl * {
          visibility: visible !important;
          position: fixed !important;
          inset: 0 !important;
          width: 100vw !important;
          height: 100vh !important;
        }
      `;
      doc.head.appendChild(style);
    } catch (e) {
      // Safe fallback
    }
  };

  return (
    <div className="kage-landing-root" onMouseMove={handlePointerMove}>
      {/* ── Fixed Three.js WebGL 3D Scene Viewport ───────────────────── */}
      <div className="kage-canvas-viewport" aria-hidden="true">
        <iframe
          ref={iframeRef}
          src="/landing-pages/kage.html"
          title="Kage 3D Architectural Scene"
          sandbox="allow-scripts allow-same-origin"
          onLoad={onIframeLoad}
        />
      </div>

      {/* Atmospheric Contrast Scrim */}
      <div className="kage-atmospheric-veil" aria-hidden="true" />

      {/* ── Floating Vertical Section Navigation Dots ──────────────── */}
      <nav className="kage-nav-dots" aria-label="Section Navigation">
        {[
          { id: 'hero', label: '00 Overview' },
          { id: 'residences', label: '01 Residences' },
          { id: 'ecosystem', label: '02 Ecosystem' },
          { id: 'portals', label: '03 Portals' },
          { id: 'gateway', label: '04 Gateway' },
        ].map((item) => (
          <button
            key={item.id}
            type="button"
            className={`kage-nav-dot ${activeSection === item.id ? 'active' : ''}`}
            onClick={() => scrollToSection(item.id)}
            title={item.label}
          >
            <span className="kage-dot-indicator" />
            <span className="kage-dot-label">{item.label}</span>
          </button>
        ))}
      </nav>

      {/* ── Top Header Navigation ──────────────────────────────────── */}
      <header className="kage-header">
        <Link to="/" className="kage-brand">
          <div className="kage-brand-symbol">
            <svg viewBox="0 0 44 44" fill="none" style={{ width: '100%', height: '100%' }}>
              <circle cx="22" cy="22" r="14" fill="#e0231c" fillOpacity="0.88" />
              <path d="M12 22h20M22 12v20M15 15l14 14M29 15l-14 14" stroke="#dfe7e0" strokeWidth="1.2" strokeOpacity="0.8" />
            </svg>
          </div>
          <div className="kage-brand-tx">
            <b>URBANNEST</b>
            <i>ARCHITECTURAL RESIDENCES</i>
          </div>
        </Link>

        <nav className="kage-nav-links">
          <button type="button" className="kage-nav-link" onClick={() => scrollToSection('residences')}>
            Residences
          </button>
          <button type="button" className="kage-nav-link" onClick={() => scrollToSection('ecosystem')}>
            Ecosystem
          </button>
          <button type="button" className="kage-nav-link" onClick={() => scrollToSection('portals')}>
            Portals
          </button>
          <Link to="/explore" className="kage-nav-link">
            Explore All
          </Link>
        </nav>

        <div className="kage-header-actions">
          <Link to="/login" className="kage-btn-ghost">
            Sign In
          </Link>
          <Link to="/register" className="kage-btn-vermilion">
            Get Started <ArrowUpRight size={14} />
          </Link>
        </div>
      </header>

      {/* ── Main Content Layer ─────────────────────────────────────── */}
      <main className="kage-content-layer">
        {/* ============================================================
            HERO SECTION (Chapter 00)
            ============================================================ */}
        <section id="hero" className="kage-hero-section">
          <div className="kage-eyebrow">
            <span className="dot" />
            <span>00 — The Urban Sanctuary</span>
          </div>

          <h1 className="kage-hero-title">
            Where architectural <em>stillness</em> meets modern tenancy.
          </h1>

          <p className="kage-hero-subtitle">
            Curated residential leasing with digital contracts, automated escrow ledgers, and authenticated owner-tenant portals.
          </p>

          {/* Floating Search Bar */}
          <form onSubmit={handleHeroSearch} className="kage-search-panel">
            <div className="kage-search-group">
              <MapPin size={20} style={{ color: 'var(--kage-vermilion)', flexShrink: 0 }} />
              <input
                type="text"
                placeholder="Search city (e.g. Mumbai, Bangalore, Pune, Delhi...)"
                value={searchCity}
                onChange={(e) => setSearchCity(e.target.value)}
                className="kage-search-input"
              />
            </div>

            <div className="kage-search-divider" />

            <div className="kage-search-select-wrap">
              <select
                value={searchType}
                onChange={(e) => setSearchType(e.target.value)}
                className="kage-search-select"
              >
                <option value="All">All Property Types</option>
                <option value="Apartment">Apartments</option>
                <option value="Villa">Villas</option>
                <option value="Studio">Studios</option>
                <option value="House">Independent Houses</option>
                <option value="PG">Co-Living / PG</option>
              </select>
            </div>

            <button type="submit" className="kage-search-submit">
              <Search size={15} /> Search Homes
            </button>
          </form>

          {/* Quick Metrics */}
          <div className="kage-metrics-row">
            <div className="kage-metric-item">
              <span className="kage-metric-icon"><CheckCircle2 size={16} /></span>
              <span>100% Verified Sanctuaries</span>
            </div>
            <div className="kage-metric-item">
              <span className="kage-metric-icon"><Lock size={16} /></span>
              <span>Cryptographic Role Security</span>
            </div>
            <div className="kage-metric-item">
              <span className="kage-metric-icon"><Award size={16} /></span>
              <span>Automated PDF Leases</span>
            </div>
          </div>
        </section>

        {/* ============================================================
            CHAPTER 01 — HANDPICKED RESIDENCES
            ============================================================ */}
        <section id="residences" className="kage-section">
          <div className="kage-sec-head">
            <span className="kage-sec-badge">01 — Handpicked Residences</span>
            <span className="kage-sec-rule" />
            <span className="kage-sec-subtitle">Curated Living</span>
          </div>

          <div className="kage-sec-title-row">
            <div>
              <h2 className="kage-sec-title">Spaces designed for intentional living.</h2>
              <p className="kage-sec-desc">
                Explore verified architectural residences currently open for tenancy across premier urban hubs.
              </p>
            </div>
            <Link to="/explore" className="kage-sec-cta-link">
              Browse All Residences <ArrowUpRight size={15} />
            </Link>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px', color: 'var(--kage-bone-dim)' }}>
              <div style={{ display: 'inline-block', width: '32px', height: '32px', border: '2px solid rgba(224, 35, 28, 0.2)', borderTopColor: 'var(--kage-vermilion)', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
              <p style={{ marginTop: '16px', fontSize: '13px', letterSpacing: '0.14em', textTransform: 'uppercase' }}>Gathering residences...</p>
            </div>
          ) : (
            <div className="kage-cards-grid">
              {featuredProperties.map((prop) => (
                <Link
                  key={prop._id || prop.id}
                  to={`/properties/${prop._id || prop.id}`}
                  className="kage-prop-card"
                >
                  <div className="kage-prop-media">
                    <img
                      src={prop.images?.[0] || prop.image || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80'}
                      alt={prop.title}
                      className="kage-prop-img"
                      loading="lazy"
                    />
                    <div className="kage-prop-badges">
                      <span className="kage-badge kage-badge-verified">Verified</span>
                      <span className="kage-badge kage-badge-type">{prop.propertyType || 'Residence'}</span>
                    </div>
                    <div className="kage-prop-arrow">
                      <ArrowUpRight size={18} />
                    </div>
                  </div>

                  <div className="kage-prop-body">
                    <h3 className="kage-prop-title">{prop.title}</h3>
                    <div className="kage-prop-location">
                      <MapPin size={14} style={{ color: 'var(--kage-vermilion)' }} />
                      <span>{prop.location?.address ? `${prop.location.address}, ${prop.location.city}` : prop.location?.city || prop.city || 'Bangalore, India'}</span>
                    </div>

                    <div className="kage-prop-specs">
                      <span className="kage-spec-item">
                        <Bed size={14} /> <b>{prop.specifications?.bedrooms || prop.bedrooms || 2}</b> BHK
                      </span>
                      <span className="kage-spec-item">
                        <Bath size={14} /> <b>{prop.specifications?.bathrooms || prop.bathrooms || 2}</b> Baths
                      </span>
                      <span className="kage-spec-item">
                        <Maximize2 size={14} /> <b>{prop.specifications?.carpetArea || prop.carpetArea || 1250}</b> sq.ft
                      </span>
                    </div>

                    <div className="kage-prop-footer">
                      <div className="kage-prop-price">
                        ₹{(prop.pricing?.rentAmount || prop.price || 45000).toLocaleString('en-IN')}
                        <span> / mo</span>
                      </div>
                      <span className="kage-prop-view">
                        View Details <ChevronRight size={14} />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* ============================================================
            CHAPTER 02 — THE INTELLIGENT ECOSYSTEM
            ============================================================ */}
        <section id="ecosystem" className="kage-section">
          <div className="kage-sec-head">
            <span className="kage-sec-badge">02 — Intelligent Ecosystem</span>
            <span className="kage-sec-rule" />
            <span className="kage-sec-subtitle">Four Pillars</span>
          </div>

          <div className="kage-sec-title-row">
            <div>
              <h2 className="kage-sec-title">Four pillars. Zero paperwork. Total peace of mind.</h2>
              <p className="kage-sec-desc">
                A full-stack SaaS platform engineered to eliminate friction from every stage of residential leasing.
              </p>
            </div>
          </div>

          <div className="kage-pillars-grid">
            <div className="kage-pillar-card">
              <span className="kage-pillar-num">01 / 04</span>
              <div className="kage-pillar-icon">
                <FileCheck2 size={26} />
              </div>
              <h3 className="kage-pillar-title">Digital Tenancy Agreements</h3>
              <p className="kage-pillar-desc">
                Standardized lease contracts generated automatically upon application approval with PDF download and digital counter-signatures.
              </p>
            </div>

            <div className="kage-pillar-card">
              <span className="kage-pillar-num">02 / 04</span>
              <div className="kage-pillar-icon">
                <CreditCard size={26} />
              </div>
              <h3 className="kage-pillar-title">Rent Schedule & Ledger</h3>
              <p className="kage-pillar-desc">
                Automated monthly rent invoice tracking, due date reminders, online payment logging, and comprehensive transaction ledgers.
              </p>
            </div>

            <div className="kage-pillar-card">
              <span className="kage-pillar-num">03 / 04</span>
              <div className="kage-pillar-icon">
                <Wrench size={26} />
              </div>
              <h3 className="kage-pillar-title">Maintenance Lifecycle</h3>
              <p className="kage-pillar-desc">
                Tenants submit categorized issue tickets with priority tags; owners assign technicians, update progress, and track resolution costs.
              </p>
            </div>

            <div className="kage-pillar-card">
              <span className="kage-pillar-num">04 / 04</span>
              <div className="kage-pillar-icon">
                <ShieldCheck size={26} />
              </div>
              <h3 className="kage-pillar-title">Admin Security & Logs</h3>
              <p className="kage-pillar-desc">
                Platform admins verify property listings, moderate users, resolve support disputes, and monitor immutable system audit logs.
              </p>
            </div>
          </div>
        </section>

        {/* ============================================================
            CHAPTER 03 — PURPOSE-BUILT PORTALS
            ============================================================ */}
        <section id="portals" className="kage-section">
          <div className="kage-sec-head">
            <span className="kage-sec-badge">03 — Purpose-Built Portals</span>
            <span className="kage-sec-rule" />
            <span className="kage-sec-subtitle">Role Workflows</span>
          </div>

          <div className="kage-sec-title-row">
            <div>
              <h2 className="kage-sec-title">Tuned to every role in the tenancy journey.</h2>
              <p className="kage-sec-desc">
                Dedicated interfaces for tenants, property owners, and platform administrators.
              </p>
            </div>
          </div>

          <div className="kage-roles-grid">
            {/* Tenant Card */}
            <div className="kage-role-card">
              <div className="kage-role-header">
                <div className="kage-role-icon">
                  <UserCheck size={24} />
                </div>
                <div>
                  <h3 className="kage-role-title">Tenants</h3>
                  <span className="kage-role-tag">Tenancy Experience</span>
                </div>
              </div>

              <ul className="kage-role-features">
                <li className="kage-role-feature">
                  <ChevronRight size={16} /> Filter & explore verified residential sanctuaries
                </li>
                <li className="kage-role-feature">
                  <ChevronRight size={16} /> Submit digital screening applications in seconds
                </li>
                <li className="kage-role-feature">
                  <ChevronRight size={16} /> Digital counter-signing of legal lease agreements
                </li>
                <li className="kage-role-feature">
                  <ChevronRight size={16} /> Seamless rent payments with automated receipts
                </li>
                <li className="kage-role-feature">
                  <ChevronRight size={16} /> Instant maintenance ticket logging with tracking
                </li>
              </ul>

              <Link to="/register" className="kage-role-cta">
                <span>Enter as Tenant</span>
                <ArrowUpRight size={16} />
              </Link>
            </div>

            {/* Owner Card */}
            <div className="kage-role-card">
              <div className="kage-role-header">
                <div className="kage-role-icon">
                  <Building size={24} />
                </div>
                <div>
                  <h3 className="kage-role-title">Property Owners</h3>
                  <span className="kage-role-tag">Portfolio Control</span>
                </div>
              </div>

              <ul className="kage-role-features">
                <li className="kage-role-feature">
                  <ChevronRight size={16} /> Multi-property inventory listing & management
                </li>
                <li className="kage-role-feature">
                  <ChevronRight size={16} /> Screen prospective tenant income & backgrounds
                </li>
                <li className="kage-role-feature">
                  <ChevronRight size={16} /> Generate customized digital tenancy contracts
                </li>
                <li className="kage-role-feature">
                  <ChevronRight size={16} /> Monitor monthly rent ledger & overdue statuses
                </li>
                <li className="kage-role-feature">
                  <ChevronRight size={16} /> Assign repair tasks & track maintenance costs
                </li>
              </ul>

              <Link to="/register" className="kage-role-cta">
                <span>Enter as Owner</span>
                <ArrowUpRight size={16} />
              </Link>
            </div>

            {/* Admin Card */}
            <div className="kage-role-card">
              <div className="kage-role-header">
                <div className="kage-role-icon">
                  <KeyRound size={24} />
                </div>
                <div>
                  <h3 className="kage-role-title">Administrators</h3>
                  <span className="kage-role-tag">Governance & Trust</span>
                </div>
              </div>

              <ul className="kage-role-features">
                <li className="kage-role-feature">
                  <ChevronRight size={16} /> Comprehensive platform metrics & KPIs
                </li>
                <li className="kage-role-feature">
                  <ChevronRight size={16} /> Review, approve or reject property listings
                </li>
                <li className="kage-role-feature">
                  <ChevronRight size={16} /> User account moderation & verification badges
                </li>
                <li className="kage-role-feature">
                  <ChevronRight size={16} /> Dispute resolution & grievance arbitration
                </li>
                <li className="kage-role-feature">
                  <ChevronRight size={16} /> Immutable system-wide audit logging
                </li>
              </ul>

              <Link to="/login" className="kage-role-cta">
                <span>Admin Access</span>
                <ArrowUpRight size={16} />
              </Link>
            </div>
          </div>
        </section>

        {/* ============================================================
            CHAPTER 04 — AFTERLIGHT GATEWAY (CTA)
            ============================================================ */}
        <section id="gateway" className="kage-gateway-section">
          <div className="kage-gateway-box">
            <div className="kage-eyebrow" style={{ justifyContent: 'center' }}>
              <span className="dot" />
              <span>Chapter 04 — Enter the Residency</span>
            </div>

            <h2 className="kage-gateway-title">
              Ready to elevate your residential experience?
            </h2>

            <p className="kage-gateway-desc">
              Join verified property owners and discerning tenants managing modern sanctuaries with zero friction, complete transparency, and cryptographic security.
            </p>

            <div className="kage-gateway-actions">
              <Link to="/register" className="kage-btn-vermilion" style={{ padding: '16px 36px', fontSize: '13px' }}>
                Begin Your Walk <ArrowUpRight size={16} />
              </Link>
              <Link to="/login" className="kage-btn-ghost" style={{ padding: '16px 32px', fontSize: '13px', border: '1px solid var(--kage-line)' }}>
                Sign In to Portal
              </Link>
              <Link to="/explore" className="kage-btn-ghost" style={{ padding: '16px 32px', fontSize: '13px', border: '1px solid var(--kage-line)' }}>
                Browse Catalog
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* ── Kage Architectural Footer ──────────────────────────────── */}
      <footer className="kage-footer">
        <div className="kage-footer-inner">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '28px', height: '28px' }}>
              <svg viewBox="0 0 44 44" fill="none" style={{ width: '100%', height: '100%' }}>
                <circle cx="22" cy="22" r="14" fill="#e0231c" fillOpacity="0.88" />
                <path d="M12 22h20M22 12v20" stroke="#dfe7e0" strokeWidth="1.2" strokeOpacity="0.8" />
              </svg>
            </div>
            <span style={{ fontSize: '13px', fontWeight: 600, letterSpacing: '0.14em', color: 'var(--kage-bone-bright)' }}>
              URBANNEST PLATFORM
            </span>
          </div>

          <div className="kage-footer-links">
            <Link to="/explore" className="kage-footer-link">Residences</Link>
            <Link to="/about" className="kage-footer-link">About</Link>
            <Link to="/contact" className="kage-footer-link">Contact</Link>
            <Link to="/login" className="kage-footer-link">Portal Login</Link>
            <Link to="/register" className="kage-footer-link">Create Account</Link>
          </div>

          <div className="kage-footer-status">
            <span className="kage-status-pulse" />
            <span>All Systems Operational</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Fallback high-end residences matching Kage aesthetic
function getDefaultFeatured() {
  return [
    {
      _id: 'sample-1',
      title: 'Komorebi Glass Pavilion & Garden',
      propertyType: 'Villa',
      location: { city: 'Bangalore', address: 'Indiranagar Defence Colony' },
      pricing: { rentAmount: 85000 },
      specifications: { bedrooms: 3, bathrooms: 3, carpetArea: 2400 },
      images: ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80'],
    },
    {
      _id: 'sample-2',
      title: 'Monolithic Charcoal Penthouse',
      propertyType: 'Apartment',
      location: { city: 'Mumbai', address: 'Worli Sea Face' },
      pricing: { rentAmount: 140000 },
      specifications: { bedrooms: 4, bathrooms: 4, carpetArea: 3200 },
      images: ['https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80'],
    },
    {
      _id: 'sample-3',
      title: 'Zenith Courtyard Loft Residence',
      propertyType: 'Studio',
      location: { city: 'Pune', address: 'Koregaon Park North Main Rd' },
      pricing: { rentAmount: 48000 },
      specifications: { bedrooms: 2, bathrooms: 2, carpetArea: 1450 },
      images: ['https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80'],
    },
    {
      _id: 'sample-4',
      title: 'Cypress Wood & Basalt Stone Villa',
      propertyType: 'Villa',
      location: { city: 'Hyderabad', address: 'Jubilee Hills Road 36' },
      pricing: { rentAmount: 110000 },
      specifications: { bedrooms: 4, bathrooms: 5, carpetArea: 3800 },
      images: ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80'],
    },
    {
      _id: 'sample-5',
      title: 'The Torii Terraced High-Rise',
      propertyType: 'Apartment',
      location: { city: 'Gurugram', address: 'Golf Course Extension Rd' },
      pricing: { rentAmount: 72000 },
      specifications: { bedrooms: 3, bathrooms: 3, carpetArea: 2100 },
      images: ['https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80'],
    },
    {
      _id: 'sample-6',
      title: 'Minimalist Shinden Co-Living Studio',
      propertyType: 'PG',
      location: { city: 'Bangalore', address: 'Koramangala 4th Block' },
      pricing: { rentAmount: 32000 },
      specifications: { bedrooms: 1, bathrooms: 1, carpetArea: 650 },
      images: ['https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80'],
    },
  ];
}

export default Scene;
