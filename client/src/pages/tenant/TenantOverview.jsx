import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import StatCard from '../../components/common/StatCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Badge from '../../components/common/Badge';
import {
  Home,
  FileText,
  CreditCard,
  Wrench,
  Bookmark,
  Search,
  CheckCircle2,
  Calendar,
  AlertCircle,
  ArrowRight,
  Sparkles,
  MapPin,
  Clock,
  ExternalLink,
} from 'lucide-react';

const TenantOverview = () => {
  const [agreements, setAgreements] = useState([]);
  const [rents, setRents] = useState([]);
  const [applications, setApplications] = useState([]);
  const [maintenance, setMaintenance] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTenantData = async () => {
      try {
        setLoading(true);
        const [agrRes, rentRes, appRes, maintRes, favRes] = await Promise.all([
          api.get('/agreements'),
          api.get('/rents'),
          api.get('/applications/my-applications'),
          api.get('/maintenance'),
          api.get('/favorites'),
        ]);

        if (agrRes.data.success) setAgreements(agrRes.data.data);
        if (rentRes.data.success) setRents(rentRes.data.data);
        if (appRes.data.success) setApplications(appRes.data.data);
        if (maintRes.data.success) setMaintenance(maintRes.data.data);
        if (favRes.data.success) setFavorites(favRes.data.data);
      } catch (error) {
        console.error('Failed to load tenant dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTenantData();
  }, []);

  if (loading) return <LoadingSpinner text="Loading your tenant hub..." fullScreen />;

  const activeAgreement = agreements.find((a) => a.status === 'active');
  const pendingRent = rents.find((r) => r.status === 'pending' || r.status === 'overdue');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Active Lease Hero Banner or Search Callout */}
      {activeAgreement ? (
        <div
          style={{
            background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.28) 0%, rgba(16, 185, 129, 0.18) 50%, rgba(15, 23, 42, 0.8) 100%)',
            border: '1px solid rgba(129, 140, 248, 0.3)',
            borderRadius: '24px',
            padding: '2.25rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1.5rem',
            boxShadow: '0 20px 40px -15px rgba(0, 0, 0, 0.5)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div style={{ position: 'relative', zIndex: 2 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.3rem 0.8rem', borderRadius: '9999px', background: 'rgba(16, 185, 129, 0.2)', border: '1px solid rgba(16, 185, 129, 0.4)', color: '#34d399', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.75rem' }}>
              <CheckCircle2 size={13} /> Active Tenancy Lease
            </div>
            <h2 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em' }}>
              {activeAgreement.property?.title}
            </h2>
            <p style={{ color: '#cbd5e1', fontSize: '0.95rem', marginTop: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <MapPin size={16} className="text-indigo-400" />
              {activeAgreement.property?.address}, {activeAgreement.property?.city} — <span style={{ color: '#ffffff', fontWeight: 700 }}>₹{activeAgreement.monthlyRent?.toLocaleString()}/mo</span>
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.85rem', flexWrap: 'wrap', position: 'relative', zIndex: 2 }}>
            <Link to="/tenant/rental" className="btn btn-primary btn-lg shadow-lg hover:shadow-indigo-500/30">
              View Rental Details <ArrowRight size={16} />
            </Link>
            <Link to="/tenant/rent" className="btn btn-secondary btn-lg">
              <CreditCard size={18} /> Pay Rent
            </Link>
          </div>
        </div>
      ) : (
        <div
          style={{
            background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.3) 0%, rgba(14, 165, 233, 0.18) 50%, rgba(15, 23, 42, 0.9) 100%)',
            border: '1px solid rgba(129, 140, 248, 0.3)',
            borderRadius: '24px',
            padding: '2.5rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1.5rem',
            boxShadow: '0 20px 40px -15px rgba(0, 0, 0, 0.5), 0 0 30px rgba(79, 70, 229, 0.15)',
          }}
        >
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#818cf8', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.5rem' }}>
              <Sparkles size={15} /> Find Your Dream Home
            </div>
            <h2 style={{ fontSize: '1.9rem', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em' }}>
              Looking for your next home?
            </h2>
            <p style={{ color: '#cbd5e1', fontSize: '0.95rem', marginTop: '0.35rem', maxWidth: '600px' }}>
              Browse verified rental apartments, independent villas, and co-living spaces with instant online screening.
            </p>
          </div>
          <Link to="/explore" className="btn btn-primary btn-lg shadow-xl hover:shadow-indigo-500/40">
            <Search size={18} /> Find Properties
          </Link>
        </div>
      )}

      {/* Stats Cards Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '1.5rem',
        }}
      >
        <StatCard
          title="Rental Status"
          value={activeAgreement ? 'Active Lease' : 'Searching'}
          icon={Home}
          changeType="positive"
          subtitle={activeAgreement ? `Agreement #${activeAgreement.agreementNumber}` : 'No active lease'}
        />
        <StatCard
          title="Current Due"
          value={pendingRent ? `₹${(pendingRent.amount + (pendingRent.lateFee || 0)).toLocaleString()}` : '₹0'}
          icon={CreditCard}
          changeType={pendingRent?.status === 'overdue' ? 'negative' : (pendingRent ? 'neutral' : 'positive')}
          subtitle={pendingRent ? `Due ${new Date(pendingRent.dueDate).toLocaleDateString()}` : 'All bills settled'}
        />
        <StatCard
          title="Applications"
          value={applications.length}
          icon={FileText}
          subtitle={`${applications.filter((a) => a.status === 'pending').length} In Review`}
        />
        <StatCard
          title="Saved Favorites"
          value={favorites.length}
          icon={Bookmark}
          subtitle="Bookmarked properties"
        />
      </div>

      {/* Two Column Section: Applications & Maintenance */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.75rem' }} className="tenant-overview-grid">
        {/* Applications */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#ffffff' }}>My Recent Applications</h3>
              <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Tracking submitted rental applications</p>
            </div>
            <Link to="/tenant/applications" className="btn btn-outline btn-sm">
              View All <ExternalLink size={14} />
            </Link>
          </div>

          {applications.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2.5rem 1rem' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(79, 70, 229, 0.1)', color: '#818cf8', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                <FileText size={24} />
              </div>
              <p style={{ color: '#cbd5e1', fontWeight: 600, fontSize: '0.95rem' }}>No rental applications submitted</p>
              <p style={{ color: '#64748b', fontSize: '0.825rem', marginTop: '0.25rem', marginBottom: '1.25rem' }}>
                Explore properties and apply with 1-click tenant screening
              </p>
              <Link to="/explore" className="btn btn-secondary btn-sm">
                <Search size={14} /> Browse Listings
              </Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {applications.slice(0, 4).map((app) => (
                <div
                  key={app._id}
                  style={{
                    padding: '1rem',
                    background: 'rgba(15, 23, 42, 0.6)',
                    borderRadius: '14px',
                    border: '1px solid rgba(255, 255, 255, 0.06)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <div>
                    <p style={{ fontWeight: 700, fontSize: '0.95rem', color: '#ffffff' }}>{app.property?.title}</p>
                    <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '0.15rem' }}>
                      Move-In: {new Date(app.moveInDate).toLocaleDateString()} | {app.occupantsCount} Occupants
                    </p>
                  </div>
                  <Badge status={app.status} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Maintenance Requests */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#ffffff' }}>Maintenance Tickets</h3>
              <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Repair & service request status</p>
            </div>
            <Link to="/tenant/maintenance" className="btn btn-outline btn-sm">
              Submit Ticket <ExternalLink size={14} />
            </Link>
          </div>

          {maintenance.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2.5rem 1rem' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(14, 165, 233, 0.1)', color: '#38bdf8', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                <Wrench size={24} />
              </div>
              <p style={{ color: '#cbd5e1', fontWeight: 600, fontSize: '0.95rem' }}>No active maintenance tickets</p>
              <p style={{ color: '#64748b', fontSize: '0.825rem', marginTop: '0.25rem', marginBottom: '1.25rem' }}>
                Have an issue? Submit a ticket and landlord will be notified instantly
              </p>
              <Link to="/tenant/maintenance" className="btn btn-secondary btn-sm">
                <Wrench size={14} /> Request Service
              </Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {maintenance.slice(0, 4).map((m) => (
                <div
                  key={m._id}
                  style={{
                    padding: '1rem',
                    background: 'rgba(15, 23, 42, 0.6)',
                    borderRadius: '14px',
                    border: '1px solid rgba(255, 255, 255, 0.06)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <div>
                    <p style={{ fontWeight: 700, fontSize: '0.95rem', color: '#ffffff' }}>{m.title}</p>
                    <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '0.15rem' }}>
                      {m.category} | Reported {new Date(m.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge status={m.status} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .tenant-overview-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

export default TenantOverview;
