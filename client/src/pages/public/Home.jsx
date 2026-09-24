import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import PropertyCard from '../../components/property/PropertyCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ThreeHeroCanvas from '../../components/common/ThreeHeroCanvas';
import {
  Search,
  Building2,
  ShieldCheck,
  Zap,
  FileCheck2,
  CreditCard,
  Wrench,
  ChevronRight,
  Sparkles,
  MapPin,
  ArrowRight,
  CheckCircle2,
  Lock,
  Users,
  Award,
} from 'lucide-react';

const Home = () => {
  const [featuredProperties, setFeaturedProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchCity, setSearchCity] = useState('');
  const [searchType, setSearchType] = useState('All');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await api.get('/properties?limit=6');
        if (res.data.success) {
          setFeaturedProperties(res.data.data);
        }
      } catch (error) {
        console.error('Failed to load featured properties:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  const handleHeroSearch = (e) => {
    e.preventDefault();
    const query = new URLSearchParams();
    if (searchCity.trim()) query.append('city', searchCity.trim());
    if (searchType && searchType !== 'All') query.append('propertyType', searchType);
    navigate(`/explore?${query.toString()}`);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '5rem', paddingBottom: '4rem' }}>
      {/* Hero Section with Interactive Three.js 3D Canvas */}
      <section className="hero-section">
        {/* Three.js 3D Interactive Backdrop */}
        <ThreeHeroCanvas />

        <div className="container" style={{ position: 'relative', zIndex: 10 }}>
          <div className="hero-badge">
            <Sparkles size={16} /> Enterprise MERN Rental Platform
          </div>

          <h1 className="hero-heading">
            Smart, Seamless & Transparent Rental Management
          </h1>

          <p className="hero-subheading">
            Connecting verified property owners, tenants, and administrators with instant screening, digital lease agreements, automated rent tracking, and maintenance ticketing.
          </p>

          {/* Floating Search Bar */}
          <form onSubmit={handleHeroSearch} className="hero-search-wrapper">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.5rem 0.75rem' }}>
              <MapPin size={22} className="text-indigo-400" style={{ flexShrink: 0 }} />
              <input
                type="text"
                placeholder="Search city (e.g. Mumbai, Bangalore, Pune, Delhi...)"
                value={searchCity}
                onChange={(e) => setSearchCity(e.target.value)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: '#ffffff',
                  fontSize: '1rem',
                  width: '100%',
                }}
              />
            </div>

            <div style={{ padding: '0.5rem 0.75rem', borderLeft: '1px solid rgba(255, 255, 255, 0.1)' }}>
              <select
                value={searchType}
                onChange={(e) => setSearchType(e.target.value)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: '#ffffff',
                  fontSize: '0.95rem',
                  width: '100%',
                  cursor: 'pointer',
                }}
              >
                <option value="All" style={{ background: '#1e293b', color: '#ffffff' }}>All Property Types</option>
                <option value="Apartment" style={{ background: '#1e293b', color: '#ffffff' }}>Apartments</option>
                <option value="Villa" style={{ background: '#1e293b', color: '#ffffff' }}>Villas</option>
                <option value="Studio" style={{ background: '#1e293b', color: '#ffffff' }}>Studios</option>
                <option value="House" style={{ background: '#1e293b', color: '#ffffff' }}>Independent Houses</option>
                <option value="PG" style={{ background: '#1e293b', color: '#ffffff' }}>Co-Living / PG</option>
              </select>
            </div>

            <button type="submit" className="btn btn-primary btn-lg shadow-lg hover:shadow-indigo-500/30">
              <Search size={18} /> Search Homes
            </button>
          </form>

          {/* Quick Metrics Pill */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '2.5rem', marginTop: '3rem', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#94a3b8', fontSize: '0.875rem' }}>
              <CheckCircle2 size={18} className="text-emerald-400" />
              <span>100% Verified Listings</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#94a3b8', fontSize: '0.875rem' }}>
              <Lock size={18} className="text-indigo-400" />
              <span>JWT & Role Security</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#94a3b8', fontSize: '0.875rem' }}>
              <Award size={18} className="text-amber-400" />
              <span>Automated PDF Leases</span>
            </div>
          </div>
        </div>
      </section>

      {/* Value Pillars Grid */}
      <section className="container">
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '2.25rem', fontWeight: 800, color: '#ffffff', marginBottom: '0.75rem' }}>
            Why Property Managers & Tenants Choose UrbanNest
          </h2>
          <p style={{ color: '#94a3b8', maxWidth: '650px', margin: '0 auto', fontSize: '1.05rem' }}>
            A complete full-stack SaaS ecosystem engineered to eliminate manual paperwork and friction in residential rentals.
          </p>
        </div>

        <div className="grid-4-responsive">
          <div className="card card-hover">
            <div style={{ width: '56px', height: '56px', borderRadius: '14px', background: 'rgba(79, 70, 229, 0.15)', color: '#818cf8', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
              <FileCheck2 size={28} />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.5rem' }}>Digital Lease Agreements</h3>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: '1.6' }}>
              Standard tenancy contracts generated automatically upon application approval with PDF download and digital counter-signatures.
            </p>
          </div>

          <div className="card card-hover">
            <div style={{ width: '56px', height: '56px', borderRadius: '14px', background: 'rgba(16, 185, 129, 0.15)', color: '#34d399', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
              <CreditCard size={28} />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.5rem' }}>Rent Schedule & Ledger</h3>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: '1.6' }}>
              Automated monthly rent invoice tracking, due date reminders, online payment logging, and detailed transaction receipts.
            </p>
          </div>

          <div className="card card-hover">
            <div style={{ width: '56px', height: '56px', borderRadius: '14px', background: 'rgba(14, 165, 233, 0.15)', color: '#38bdf8', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
              <Wrench size={28} />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.5rem' }}>Maintenance Lifecycle</h3>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: '1.6' }}>
              Tenants submit categorized issue tickets with priority tags; owners assign technicians, update progress, and track resolution costs.
            </p>
          </div>

          <div className="card card-hover">
            <div style={{ width: '56px', height: '56px', borderRadius: '14px', background: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
              <ShieldCheck size={28} />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.5rem' }}>Admin Oversight & Logs</h3>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: '1.6' }}>
              Platform admins verify property listings, moderate users, resolve support disputes, and monitor comprehensive system audit logs.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Properties Showcase */}
      <section className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <span style={{ color: '#818cf8', fontWeight: 700, fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Handpicked Residences
            </span>
            <h2 style={{ fontSize: '2.25rem', fontWeight: 800, color: '#ffffff', marginTop: '0.25rem' }}>
              Featured Rental Properties
            </h2>
          </div>
          <Link to="/explore" className="btn btn-outline">
            Browse All Properties <ChevronRight size={18} />
          </Link>
        </div>

        {loading ? (
          <LoadingSpinner text="Loading featured homes..." />
        ) : featuredProperties.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
            <p style={{ color: '#94a3b8' }}>No properties currently listed.</p>
          </div>
        ) : (
          <div className="grid-3-responsive">
            {featuredProperties.map((property) => (
              <PropertyCard key={property._id} property={property} />
            ))}
          </div>
        )}
      </section>

      {/* Role-Based Portal CTA */}
      <section className="container">
        <div
          style={{
            background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.25) 0%, #111827 50%, rgba(14, 165, 233, 0.2) 100%)',
            border: '1px solid #334155',
            borderRadius: '24px',
            padding: '4rem 2rem',
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.6)',
          }}
        >
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, color: '#ffffff', marginBottom: '1rem' }}>
            Ready to Streamline Your Rental Journey?
          </h2>
          <p style={{ color: '#cbd5e1', fontSize: '1.1rem', maxWidth: '650px', margin: '0 auto 2.5rem auto', lineHeight: '1.6' }}>
            Join verified owners and tenants managing property listings, digital lease agreements, and maintenance requests effortlessly.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/register" className="btn btn-primary btn-lg shadow-xl hover:shadow-indigo-500/40">
              Create Free Account <ArrowRight size={18} />
            </Link>
            <Link to="/login" className="btn btn-secondary btn-lg">
              Sign In to Dashboard
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
