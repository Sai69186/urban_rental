import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import StatCard from '../../components/common/StatCard';
import ThreeDDashboardHero from '../../components/dashboard/ThreeDDashboardHero';
import ThreeDProgressWidget from '../../components/dashboard/ThreeDProgressWidget';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Badge from '../../components/common/Badge';
import {
  Building2,
  FileText,
  CreditCard,
  Wrench,
  PlusCircle,
  Users,
  CheckCircle2,
  Clock,
  ArrowRight,
  ExternalLink,
  Sparkles,
} from 'lucide-react';

const OwnerOverview = () => {
  const [properties, setProperties] = useState([]);
  const [applications, setApplications] = useState([]);
  const [rents, setRents] = useState([]);
  const [maintenance, setMaintenance] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchOwnerData = async () => {
      try {
        setLoading(true);
        const [propsRes, appsRes, rentsRes, maintRes] = await Promise.allSettled([
          api.get('/properties/owner/my-properties'),
          api.get('/applications/owner'),
          api.get('/rents/summary'),
          api.get('/maintenance'),
        ]);

        if (!isMounted) return;

        if (propsRes.status === 'fulfilled' && propsRes.value?.data?.success) {
          setProperties(propsRes.value.data.data || []);
        }
        if (appsRes.status === 'fulfilled' && appsRes.value?.data?.success) {
          setApplications(appsRes.value.data.data || []);
        }
        if (rentsRes.status === 'fulfilled' && rentsRes.value?.data?.success) {
          setRents(rentsRes.value.data.data || []);
        }
        if (maintRes.status === 'fulfilled' && maintRes.value?.data?.success) {
          setMaintenance(maintRes.value.data.data || []);
        }
      } catch (error) {
        console.warn('Owner dashboard data fetch warning:', error?.message);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchOwnerData();

    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) return <LoadingSpinner text="Loading your portfolio metrics..." fullScreen />;

  const totalProperties = properties.length;
  const rentedCount = properties.filter((p) => p.availabilityStatus === 'rented').length;
  const availableCount = properties.filter((p) => p.availabilityStatus === 'available').length;
  const pendingApps = applications.filter((a) => a.status === 'pending' || a.status === 'under_review').length;
  const openTickets = maintenance.filter((m) => m.status !== 'Resolved' && m.status !== 'Closed').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* 3D Isometric Interactive Hero Centerpiece */}
      <ThreeDDashboardHero
        role="owner"
        title="Real Estate Asset Matrix"
        subtitle="Manage verified residences, track automated rent payouts, and counter-sign legally binding digital lease covenants."
        primaryAction={{ label: 'Add New Residence', to: '/owner/properties' }}
        secondaryAction={{ label: 'Rent Ledger', to: '/owner/rent-ledger' }}
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
          title="Portfolio Listings"
          value={totalProperties}
          icon={Building2}
          color="#c9a24a"
          change="+12.5%"
          changeType="positive"
          subtitle={`${availableCount} Available • ${rentedCount} Leased`}
        />
        <StatCard
          title="Tenant Applications"
          value={pendingApps}
          icon={FileText}
          color="#e0231c"
          changeType={pendingApps > 0 ? 'neutral' : 'positive'}
          subtitle="Tenants awaiting screening"
        />
        <StatCard
          title="Rent Collected"
          value={`₹${(rents?.paidRent || 0).toLocaleString()}`}
          icon={CreditCard}
          color="#10b981"
          change="+19.2%"
          changeType="positive"
          subtitle={`₹${(rents?.pendingRent || 0).toLocaleString()} Dues Pending`}
        />
        <StatCard
          title="Maintenance Requests"
          value={openTickets}
          icon={Wrench}
          color="#ff5a3c"
          changeType={openTickets > 0 ? 'neutral' : 'positive'}
          subtitle="Open repair requests"
        />
      </div>

      {/* Analytics & Distribution Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '1.75rem' }} className="owner-analytics-grid">
        {/* Recent Applications Card */}
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
                Incoming Tenant Applications
              </h3>
              <p style={{ fontSize: '0.8rem', color: '#9aa89f', margin: '2px 0 0 0' }}>Review tenant credentials & credit checks</p>
            </div>
            <Link to="/owner/applications" className="btn btn-outline btn-sm btn-animated">
              <span className="text-container">
                <span className="text">
                  <span>View All</span> <ExternalLink size={13} />
                </span>
              </span>
            </Link>
          </div>

          {applications.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2.5rem 1rem' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(224, 35, 28, 0.1)', color: '#ff5a3c', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                <FileText size={24} />
              </div>
              <p style={{ color: '#dfe7e0', fontWeight: 600, fontSize: '0.95rem' }}>No tenant applications received</p>
              <p style={{ color: '#67756c', fontSize: '0.825rem', marginTop: '0.25rem' }}>
                Incoming tenant applications will appear here for verification
              </p>
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
                    <p style={{ fontWeight: 700, fontSize: '0.95rem', color: '#ffffff', margin: 0 }}>{app.tenant?.name}</p>
                    <p style={{ fontSize: '0.8rem', color: '#9aa89f', marginTop: '0.15rem' }}>
                      For {app.property?.title?.slice(0, 32)}...
                    </p>
                  </div>
                  <Badge status={app.status} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 3D Radial Occupancy Donut */}
        <ThreeDProgressWidget
          title="Portfolio Occupancy Yield"
          percentage={Math.round((rentedCount / (totalProperties || 1)) * 100) || 80}
          items={[
            { label: 'Leased & Yielding', value: `${rentedCount} units`, color: '#10b981' },
            { label: 'Vacant / Listed', value: `${availableCount} units`, color: '#c9a24a' },
            { label: 'Repair Pipeline', value: `${openTickets} tickets`, color: '#e0231c' },
          ]}
        />
      </div>

      <style>{`
        @media (max-width: 1024px) {
          .owner-analytics-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

export default OwnerOverview;
