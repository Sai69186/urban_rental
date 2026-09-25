import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Card from '../../components/common/Rotating3DCardCarousel';
import Isometric3DPropertyCard from '../../components/property/Isometric3DPropertyCard';
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

const Home = () => {
  const [featuredProperties, setFeaturedProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchCity, setSearchCity] = useState('');
  const [searchType, setSearchType] = useState('All');
  const navigate = useNavigate();

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
      } catch (error) {
        if (isMounted) setFeaturedProperties(getDefaultFeatured());
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchFeatured();
    return () => { isMounted = false; };
  }, []);

  const handleHeroSearch = (e) => {
    e.preventDefault();
    const query = new URLSearchParams();
    if (searchCity.trim()) query.append('city', searchCity.trim());
    if (searchType && searchType !== 'All') query.append('propertyType', searchType);
    navigate(`/explore?${query.toString()}`);
  };

  return (
    <div className="kage-full-theme">
      {/* ── Atmospheric Ambient Canvas & Light Rays ────────────────── */}
      <div className="kage-ambient-canvas" aria-hidden="true" />

      {/* ── Main Content Container ─────────────────────────────────── */}
      <div className="kage-theme-container">
        {/* ============================================================
            HERO SECTION — Chapter 00 (Split Hero Layout)
            ============================================================ */}
        <section
          className="kage-hero-split-wrap"
          style={{
            position: 'relative',
            minHeight: '620px',
            display: 'grid',
            gridTemplateColumns: '1.15fr 0.85fr',
            gap: '2.5rem',
            alignItems: 'center',
            paddingTop: '3rem',
            paddingBottom: '4rem',
          }}
        >
          {/* ── Left Column: Editorial & Search Matter ─────────────── */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              textAlign: 'left',
              width: '100%',
              zIndex: 10,
            }}
          >
            <div className="kage-chip" style={{ backdropFilter: 'blur(16px)', background: 'rgba(5, 7, 10, 0.85)', marginBottom: '1.25rem' }}>
              <span className="kage-chip-dot" />
              <span className="kage-chip-tx">00 — The Urban Sanctuary</span>
              <span className="kage-chip-jp">山門</span>
            </div>

            <h1
              className="kage-hero-heading"
              style={{
                textAlign: 'left',
                margin: '0 0 1.25rem 0',
                fontSize: 'clamp(2.4rem, 4.2vw, 3.8rem)',
                lineHeight: 1.12,
                textShadow: '0 4px 35px rgba(0, 0, 0, 0.95)',
              }}
            >
              Where architectural <em>stillness</em> meets modern tenancy.
            </h1>

            <p
              className="kage-hero-sub"
              style={{
                textAlign: 'left',
                margin: '0 0 2rem 0',
                maxWidth: '620px',
                fontSize: '1.05rem',
                lineHeight: 1.65,
                color: 'var(--kage-bone-dim)',
              }}
            >
              Curated residential leasing with digital contracts, automated escrow ledgers, and authenticated owner-tenant portals.
            </p>

            {/* Ultra-Transparent Search Bar */}
            <form
              onSubmit={handleHeroSearch}
              className="kage-search-bar"
              style={{
                margin: '0 0 2rem 0',
                width: '100%',
                maxWidth: '640px',
                backdropFilter: 'blur(24px)',
                WebkitBackdropFilter: 'blur(24px)',
                background: 'rgba(8, 12, 18, 0.85)',
                border: '1px solid rgba(255, 255, 255, 0.16)',
                boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.9), 0 0 35px rgba(224, 35, 28, 0.2)',
              }}
            >
              <div className="kage-search-input-box">
                <MapPin size={18} style={{ color: 'var(--kage-vermilion)', flexShrink: 0 }} />
                <input
                  type="text"
                  placeholder="Search city (e.g. Mumbai, Bangalore...)"
                  value={searchCity}
                  onChange={(e) => setSearchCity(e.target.value)}
                  className="kage-search-input-field"
                />
              </div>

              <div className="kage-search-vrule" />

              <div className="kage-search-select-box">
                <select
                  value={searchType}
                  onChange={(e) => setSearchType(e.target.value)}
                  className="kage-search-select-field"
                >
                  <option value="All">All Types</option>
                  <option value="Apartment">Apartments</option>
                  <option value="Villa">Villas</option>
                  <option value="Studio">Studios</option>
                  <option value="House">Houses</option>
                  <option value="PG">PG</option>
                </select>
              </div>

              <button type="submit" className="kage-search-btn" style={{ padding: '12px 24px', fontSize: '11px' }}>
                <Search size={14} /> Search
              </button>
            </form>

            {/* Quick Metrics */}
            <div className="kage-trust-pills" style={{ justifyContent: 'flex-start', gap: '0.85rem' }}>
              <div
                className="kage-trust-pill"
                style={{
                  backdropFilter: 'blur(14px)',
                  WebkitBackdropFilter: 'blur(14px)',
                  background: 'rgba(8, 12, 18, 0.85)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  padding: '6px 14px',
                  borderRadius: '100px',
                  fontSize: '11px',
                }}
              >
                <CheckCircle2 size={15} />
                <span>100% Verified</span>
              </div>
              <div
                className="kage-trust-pill"
                style={{
                  backdropFilter: 'blur(14px)',
                  WebkitBackdropFilter: 'blur(14px)',
                  background: 'rgba(8, 12, 18, 0.85)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  padding: '6px 14px',
                  borderRadius: '100px',
                  fontSize: '11px',
                }}
              >
                <Lock size={15} />
                <span>Role Security</span>
              </div>
              <div
                className="kage-trust-pill"
                style={{
                  backdropFilter: 'blur(14px)',
                  WebkitBackdropFilter: 'blur(14px)',
                  background: 'rgba(8, 12, 18, 0.85)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  padding: '6px 14px',
                  borderRadius: '100px',
                  fontSize: '11px',
                }}
              >
                <Award size={15} />
                <span>PDF Leases</span>
              </div>
            </div>
          </div>

          {/* ── Right Column: 3D Rotating House Cards Carousel ─────── */}
          <div
            style={{
              position: 'relative',
              width: '100%',
              height: '520px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'visible',
            }}
          >
            <Card isBackdrop={false} />
          </div>
        </section>

        <style>{`
          @media (max-width: 992px) {
            .kage-hero-split-wrap {
              grid-template-columns: 1fr !important;
              text-align: center !important;
            }
            .kage-hero-split-wrap > div:first-child {
              align-items: center !important;
              text-align: center !important;
            }
            .kage-hero-split-wrap .kage-hero-heading,
            .kage-hero-split-wrap .kage-hero-sub {
              text-align: center !important;
            }
            .kage-hero-split-wrap .kage-trust-pills {
              justify-content: center !important;
            }
          }
        `}</style>

        {/* ============================================================
            CHAPTER 01 — HANDPICKED RESIDENCES
            ============================================================ */}
        <section className="kage-block" style={{ position: 'relative' }}>
          <div className="kage-header-row">
            <span className="kage-chapter-tag">01 — Handpicked Residences</span>
            <span className="kage-chapter-line" />
            <span className="kage-chapter-jp">参道 01 / 03</span>
          </div>

          <div className="kage-title-row">
            <div>
              <h2 className="kage-main-title">Spaces crafted for quiet minds.</h2>
              <p className="kage-main-subtitle">
                Explore verified architectural residences currently open for tenancy across premier urban hubs.
              </p>
            </div>
            <Link to="/explore" className="kage-action-link">
              Browse All Residences <ArrowUpRight size={15} />
            </Link>
          </div>

          {loading ? (
            <LoadingSpinner text="Gathering residences..." />
          ) : (
            <div className="kage-residences-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '30px' }}>
              {featuredProperties.map((prop) => (
                <Isometric3DPropertyCard
                  key={prop._id || prop.id}
                  property={prop}
                />
              ))}
            </div>
          )}
        </section>

        {/* ============================================================
            CHAPTER 02 — THE FOUR PILLARS (Sacred Craft / Ecosystem)
            ============================================================ */}
        <section className="kage-block" style={{ position: 'relative' }}>
          <div className="kage-header-row">
            <span className="kage-chapter-tag">02 — The Intelligent Ecosystem</span>
            <span className="kage-chapter-line" />
            <span className="kage-chapter-jp">手業 02 / 04</span>
          </div>


          <div className="kage-title-row">
            <div>
              <h2 className="kage-main-title">Four pillars. Zero paperwork. Total peace of mind.</h2>
              <p className="kage-main-subtitle">
                A full-stack SaaS platform engineered to eliminate friction from every stage of residential leasing.
              </p>
            </div>
          </div>

          <div className="kage-curriculum-grid">
            <div className="kage-curriculum-card">
              <div className="kage-curriculum-num">
                <span>01</span>
                <span className="kage-curriculum-jp">山門</span>
              </div>
              <div className="kage-curriculum-icon">
                <FileCheck2 size={26} />
              </div>
              <h3 className="kage-curriculum-title">Digital Tenancy Agreements</h3>
              <p className="kage-curriculum-desc">
                Standardized lease contracts generated automatically upon application approval with PDF download and digital counter-signatures.
              </p>
            </div>

            <div className="kage-curriculum-card">
              <div className="kage-curriculum-num">
                <span>02</span>
                <span className="kage-curriculum-jp">借景</span>
              </div>
              <div className="kage-curriculum-icon">
                <CreditCard size={26} />
              </div>
              <h3 className="kage-curriculum-title">Rent Schedule & Ledger</h3>
              <p className="kage-curriculum-desc">
                Automated monthly rent invoice tracking, due date reminders, online payment logging, and balance ledgers.
              </p>
            </div>

            <div className="kage-curriculum-card">
              <div className="kage-curriculum-num">
                <span>03</span>
                <span className="kage-curriculum-jp">焼杉</span>
              </div>
              <div className="kage-curriculum-icon">
                <Wrench size={26} />
              </div>
              <h3 className="kage-curriculum-title">Maintenance Lifecycle</h3>
              <p className="kage-curriculum-desc">
                Tenants submit categorized issue tickets with priority tags; owners assign technicians, update progress, and track resolution costs.
              </p>
            </div>

            <div className="kage-curriculum-card">
              <div className="kage-curriculum-num">
                <span>04</span>
                <span className="kage-curriculum-jp">灯籠</span>
              </div>
              <div className="kage-curriculum-icon">
                <ShieldCheck size={26} />
              </div>
              <h3 className="kage-curriculum-title">Admin Security & Logs</h3>
              <p className="kage-curriculum-desc">
                Platform admins verify property listings, moderate users, resolve support disputes, and monitor comprehensive audit logs.
              </p>
            </div>
          </div>
        </section>

        {/* ============================================================
            CHAPTER 03 — PURPOSE-BUILT PORTALS (Role Workflows)
            ============================================================ */}
        <section className="kage-block">
          <div className="kage-header-row">
            <span className="kage-chapter-tag">03 — Purpose-Built Portals</span>
            <span className="kage-chapter-line" />
            <span className="kage-chapter-jp">神事 03 / 04</span>
          </div>

          <div className="kage-title-row">
            <div>
              <h2 className="kage-main-title">Tuned to every role in the tenancy journey.</h2>
              <p className="kage-main-subtitle">
                Dedicated interfaces for tenants, property owners, and platform administrators.
              </p>
            </div>
          </div>

          <div className="kage-portals-grid">
            {/* Tenant Card */}
            <div className="kage-portal-card">
              <div className="kage-portal-header">
                <div className="kage-portal-icon">
                  <UserCheck size={24} />
                </div>
                <div>
                  <h3 className="kage-portal-title">Tenants</h3>
                  <span className="kage-portal-tag">Tenancy Experience</span>
                </div>
              </div>

              <ul className="kage-portal-list">
                <li className="kage-portal-item">
                  <ChevronRight size={16} /> Filter & explore verified residential sanctuaries
                </li>
                <li className="kage-portal-item">
                  <ChevronRight size={16} /> Submit digital screening applications in seconds
                </li>
                <li className="kage-portal-item">
                  <ChevronRight size={16} /> Digital counter-signing of legal lease agreements
                </li>
                <li className="kage-portal-item">
                  <ChevronRight size={16} /> Seamless rent payments with automated receipts
                </li>
                <li className="kage-portal-item">
                  <ChevronRight size={16} /> Instant maintenance ticket logging with tracking
                </li>
              </ul>

              <Link to="/register" className="kage-portal-cta">
                <span>Enter as Tenant</span>
                <ArrowUpRight size={16} />
              </Link>
            </div>

            {/* Owner Card */}
            <div className="kage-portal-card">
              <div className="kage-portal-header">
                <div className="kage-portal-icon">
                  <Building size={24} />
                </div>
                <div>
                  <h3 className="kage-portal-title">Property Owners</h3>
                  <span className="kage-portal-tag">Portfolio Control</span>
                </div>
              </div>

              <ul className="kage-portal-list">
                <li className="kage-portal-item">
                  <ChevronRight size={16} /> Multi-property inventory listing & management
                </li>
                <li className="kage-portal-item">
                  <ChevronRight size={16} /> Screen prospective tenant income & backgrounds
                </li>
                <li className="kage-portal-item">
                  <ChevronRight size={16} /> Generate customized digital tenancy contracts
                </li>
                <li className="kage-portal-item">
                  <ChevronRight size={16} /> Monitor monthly rent ledger & overdue statuses
                </li>
                <li className="kage-portal-item">
                  <ChevronRight size={16} /> Assign repair tasks & track maintenance costs
                </li>
              </ul>

              <Link to="/register" className="kage-portal-cta">
                <span>Enter as Owner</span>
                <ArrowUpRight size={16} />
              </Link>
            </div>

            {/* Admin Card */}
            <div className="kage-portal-card">
              <div className="kage-portal-header">
                <div className="kage-portal-icon">
                  <KeyRound size={24} />
                </div>
                <div>
                  <h3 className="kage-portal-title">Administrators</h3>
                  <span className="kage-portal-tag">Governance & Trust</span>
                </div>
              </div>

              <ul className="kage-portal-list">
                <li className="kage-portal-item">
                  <ChevronRight size={16} /> Comprehensive platform metrics & KPIs
                </li>
                <li className="kage-portal-item">
                  <ChevronRight size={16} /> Review, approve or reject property listings
                </li>
                <li className="kage-portal-item">
                  <ChevronRight size={16} /> User account moderation & verification badges
                </li>
                <li className="kage-portal-item">
                  <ChevronRight size={16} /> Dispute resolution & grievance arbitration
                </li>
                <li className="kage-portal-item">
                  <ChevronRight size={16} /> Immutable system-wide audit logging
                </li>
              </ul>

              <Link to="/login" className="kage-portal-cta">
                <span>Admin Access</span>
                <ArrowUpRight size={16} />
              </Link>
            </div>
          </div>
        </section>

        {/* ============================================================
            CHAPTER 04 — AFTERLIGHT GATEWAY (CTA Box)
            ============================================================ */}
        <section className="kage-gateway-wrap">
          <div className="kage-gateway-panel">
            <div className="kage-chip" style={{ marginBottom: '24px' }}>
              <span className="kage-chip-dot" />
              <span className="kage-chip-tx">Chapter 04 — Afterlight</span>
              <span className="kage-chip-jp">残光</span>
            </div>

            <h2 className="kage-gateway-title">
              The gate does not close behind you.
            </h2>

            <p className="kage-gateway-text">
              Step into a seamless tenancy experience. Join verified property owners and discerning tenants managing modern sanctuaries with zero friction, complete transparency, and cryptographic security.
            </p>

            <div className="kage-gateway-buttons">
              <Link to="/register" className="kage-search-btn" style={{ padding: '16px 38px', fontSize: '13px', textDecoration: 'none' }}>
                Begin Your Walk <ArrowUpRight size={16} />
              </Link>
              <Link to="/login" className="kage-action-link" style={{ padding: '16px 32px', fontSize: '12px' }}>
                Sign In to Portal
              </Link>
              <Link to="/explore" className="kage-action-link" style={{ padding: '16px 32px', fontSize: '12px' }}>
                Browse Catalog
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

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

export default Home;
