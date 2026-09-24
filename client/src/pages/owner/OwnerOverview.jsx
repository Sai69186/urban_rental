import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import StatCard from '../../components/common/StatCard';
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
      {/* Welcome Banner & Quick Action */}
      <div
        style={{
          background: 'linear-gradient(135deg, rgba(14, 165, 233, 0.25) 0%, rgba(79, 70, 229, 0.2) 50%, rgba(15, 23, 42, 0.9) 100%)',
          border: '1px solid rgba(56, 189, 248, 0.3)',
          borderRadius: '24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1.5rem',
          padding: '2.25rem',
          boxShadow: '0 20px 40px -15px rgba(0, 0, 0, 0.5)',
        }}
      >
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#38bdf8', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.5rem' }}>
            <Sparkles size={15} /> Real Estate Portfolio
          </div>
          <h2 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em' }}>
            Owner Portfolio Hub
          </h2>
          <p style={{ color: '#cbd5e1', fontSize: '0.95rem', marginTop: '0.35rem' }}>
            Manage listings, review incoming lease applications, and track rent collection in real-time.
          </p>
        </div>
        <Link to="/owner/properties" className="btn btn-primary btn-lg shadow-xl hover:shadow-indigo-500/40">
          <PlusCircle size={18} /> Add New Property
        </Link>
      </div>

      {/* Stats Cards Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '1.5rem',
        }}
      >
        <StatCard
          title="Total Properties"
          value={totalProperties}
          icon={Building2}
          subtitle={`${availableCount} Available | ${rentedCount} Leased`}
        />
        <StatCard
          title="Pending Applications"
          value={pendingApps}
          icon={FileText}
          changeType={pendingApps > 0 ? 'neutral' : 'positive'}
          subtitle="Tenants awaiting screening"
        />
        <StatCard
          title="Rent Collected"
          value={`₹${(rents?.paidRent || 0).toLocaleString()}`}
          icon={CreditCard}
          changeType="positive"
          subtitle={`₹${(rents?.pendingRent || 0).toLocaleString()} Dues Pending`}
        />
        <StatCard
          title="Maintenance Tickets"
          value={openTickets}
          icon={Wrench}
          changeType={openTickets > 0 ? 'neutral' : 'positive'}
          subtitle="Open repair requests"
        />
      </div>

      {/* Two Column Layout: Recent Applications & Maintenance Tickets */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.75rem' }} className="owner-overview-grid">
        {/* Recent Applications */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#ffffff' }}>Incoming Tenant Applications</h3>
              <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Review tenant credentials and issue leases</p>
            </div>
            <Link to="/owner/applications" className="btn btn-outline btn-sm">
              View All <ExternalLink size={14} />
            </Link>
          </div>

          {applications.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2.5rem 1rem' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(79, 70, 229, 0.1)', color: '#818cf8', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                <FileText size={24} />
              </div>
              <p style={{ color: '#cbd5e1', fontWeight: 600, fontSize: '0.95rem' }}>No tenant applications received</p>
              <p style={{ color: '#64748b', fontSize: '0.825rem', marginTop: '0.25rem' }}>
                Incoming tenant applications will appear here for verification
              </p>
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
                    <p style={{ fontWeight: 700, fontSize: '0.95rem', color: '#ffffff' }}>{app.tenant?.name}</p>
                    <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '0.15rem' }}>
                      For {app.property?.title?.slice(0, 32)}...
                    </p>
                  </div>
                  <Badge status={app.status} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Maintenance */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#ffffff' }}>Recent Maintenance Tickets</h3>
              <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Repair tickets logged by your tenants</p>
            </div>
            <Link to="/owner/maintenance" className="btn btn-outline btn-sm">
              View All <ExternalLink size={14} />
            </Link>
          </div>

          {maintenance.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2.5rem 1rem' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.1)', color: '#34d399', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                <CheckCircle2 size={24} />
              </div>
              <p style={{ color: '#cbd5e1', fontWeight: 600, fontSize: '0.95rem' }}>All properties in pristine condition</p>
              <p style={{ color: '#64748b', fontSize: '0.825rem', marginTop: '0.25rem' }}>
                No active repair or maintenance requests logged
              </p>
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
                      {m.category} | Priority: {m.priority}
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
          .owner-overview-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

export default OwnerOverview;
