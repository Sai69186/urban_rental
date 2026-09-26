import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import StatCard from '../../components/common/StatCard';
import ThreeDDashboardHero from '../../components/dashboard/ThreeDDashboardHero';
import ThreeDProgressWidget from '../../components/dashboard/ThreeDProgressWidget';
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
    let isMounted = true;

    const fetchTenantData = async () => {
      try {
        setLoading(true);
        const [agrRes, rentRes, appRes, maintRes, favRes] = await Promise.allSettled([
          api.get('/agreements'),
          api.get('/rents'),
          api.get('/applications/my-applications'),
          api.get('/maintenance'),
          api.get('/favorites'),
        ]);

        if (!isMounted) return;

        if (agrRes.status === 'fulfilled' && agrRes.value?.data?.success) {
          setAgreements(agrRes.value.data.data || []);
        }
        if (rentRes.status === 'fulfilled' && rentRes.value?.data?.success) {
          setRents(rentRes.value.data.data || []);
        }
        if (appRes.status === 'fulfilled' && appRes.value?.data?.success) {
          setApplications(appRes.value.data.data || []);
        }
        if (maintRes.status === 'fulfilled' && maintRes.value?.data?.success) {
          setMaintenance(maintRes.value.data.data || []);
        }
        if (favRes.status === 'fulfilled' && favRes.value?.data?.success) {
          setFavorites(favRes.value.data.data || []);
        }
      } catch (error) {
        console.warn('Dashboard data fetch warning:', error?.message);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchTenantData();

    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) return <LoadingSpinner text="Loading your tenant hub..." fullScreen />;

  const activeAgreement = agreements.find((a) => a.status === 'active');
  const pendingRent = rents.find((r) => r.status === 'pending' || r.status === 'overdue');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* 3D Isometric Interactive Hero Centerpiece */}
      <ThreeDDashboardHero
        role="tenant"
        title={activeAgreement ? `Sanctuary: ${activeAgreement.property?.title}` : "Discover Architectural Living"}
        subtitle={
          activeAgreement
            ? `${activeAgreement.property?.address}, ${activeAgreement.property?.city} — ₹${activeAgreement.monthlyRent?.toLocaleString()}/mo automated lease ledger.`
            : "Search verified residences, submit 1-click digital applications, and manage escrow contracts."
        }
        primaryAction={
          activeAgreement
            ? { label: 'Rental Sanctum', to: '/tenant/rental' }
            : { label: 'Find Properties', to: '/explore' }
        }
        secondaryAction={
          activeAgreement
            ? { label: 'Pay Rent Dues', to: '/tenant/rent' }
            : { label: 'Saved Favorites', to: '/tenant/favorites' }
        }
      />

      {/* 3D Stat Cards Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '1.5rem',
        }}
      >
        <StatCard
          title="Tenancy Status"
          value={activeAgreement ? 'Active Lease' : 'Searching'}
          icon={Home}
          color="#10b981"
          changeType="positive"
          subtitle={activeAgreement ? `Lease #${activeAgreement.agreementNumber}` : 'No active lease'}
        />
        <StatCard
          title="Current Due Balance"
          value={pendingRent ? `₹${(pendingRent.amount + (pendingRent.lateFee || 0)).toLocaleString()}` : '₹0'}
          icon={CreditCard}
          color="#e0231c"
          changeType={pendingRent?.status === 'overdue' ? 'negative' : pendingRent ? 'neutral' : 'positive'}
          subtitle={pendingRent ? `Due ${new Date(pendingRent.dueDate).toLocaleDateString()}` : 'All dues clear'}
        />
        <StatCard
          title="My Applications"
          value={applications.length}
          icon={FileText}
          color="#c9a24a"
          subtitle={`${applications.filter((a) => a.status === 'pending').length} Under Screening`}
        />
        <StatCard
          title="Saved Sanctuaries"
          value={favorites.length}
          icon={Bookmark}
          color="#ff5a3c"
          subtitle="Bookmarked for review"
        />
      </div>

      {/* Two Column Layout: Applications & Maintenance */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '1.75rem' }} className="tenant-analytics-grid">
        {/* Applications Card */}
        <div
          style={{
            background: 'linear-gradient(135deg, rgba(14, 20, 30, 0.65) 0%, rgba(8, 12, 18, 0.75) 100%)',
            border: '1px solid rgba(223, 231, 224, 0.1)',
            borderRadius: '24px',
            padding: '1.75rem',
            boxShadow: '0 20px 45px -10px rgba(0, 0, 0, 0.5)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#ffffff', margin: 0, fontFamily: 'var(--font-heading)' }}>
                My Applications
              </h3>
              <p style={{ fontSize: '0.8rem', color: '#9aa89f', margin: '2px 0 0 0' }}>Live screening and approval telemetry</p>
            </div>
            <Link to="/tenant/applications" className="btn btn-outline btn-sm btn-animated">
              <span className="text-container">
                <span className="text">
                  <span>View All</span> <ExternalLink size={13} />
                </span>
              </span>
            </Link>
          </div>

          {applications.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2.5rem 1rem' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.1)', color: '#34d399', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                <FileText size={24} />
              </div>
              <p style={{ color: '#dfe7e0', fontWeight: 600, fontSize: '0.95rem' }}>No rental applications submitted</p>
              <p style={{ color: '#67756c', fontSize: '0.825rem', marginTop: '0.25rem', marginBottom: '1.25rem' }}>
                Explore properties and apply with 1-click tenant screening
              </p>
              <Link to="/explore" className="btn btn-primary btn-sm btn-animated">
                <span className="text-container">
                  <span className="text">
                    <Search size={13} /> <span>Browse Residences</span>
                  </span>
                </span>
              </Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {applications.slice(0, 4).map((app) => (
                <div
                  key={app._id}
                  style={{
                    padding: '1rem 1.25rem',
                    background: 'rgba(8, 12, 18, 0.6)',
                    borderRadius: '16px',
                    border: '1px solid rgba(223, 231, 224, 0.08)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
                  }}
                >
                  <div>
                    <p style={{ fontWeight: 700, fontSize: '0.95rem', color: '#ffffff', margin: 0 }}>{app.property?.title}</p>
                    <p style={{ fontSize: '0.8rem', color: '#9aa89f', marginTop: '0.15rem' }}>
                      Move-In: {new Date(app.moveInDate).toLocaleDateString()} | {app.occupantsCount} Occupants
                    </p>
                  </div>
                  <Badge status={app.status} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 3D Telemetry Health Ring Widget */}
        <ThreeDProgressWidget
          title="Tenancy Health Score"
          percentage={96}
          items={[
            { label: 'On-Time Payments', value: '100%', color: '#10b981' },
            { label: 'Covenant Verification', value: '100%', color: '#c9a24a' },
            { label: 'Open Service Logs', value: `${maintenance.filter((m) => m.status !== 'Resolved').length} tickets`, color: '#e0231c' },
          ]}
        />
      </div>

      <style>{`
        @media (max-width: 1024px) {
          .tenant-analytics-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

export default TenantOverview;
