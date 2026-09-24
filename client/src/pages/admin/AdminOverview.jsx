import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import StatCard from '../../components/common/StatCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Badge from '../../components/common/Badge';
import {
  Users,
  Building2,
  FileCheck2,
  CreditCard,
  Wrench,
  AlertCircle,
  TrendingUp,
  ShieldCheck,
  MapPin,
  Sparkles,
  ExternalLink,
} from 'lucide-react';

const AdminOverview = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        setLoading(true);
        const res = await api.get('/admin/dashboard-stats');
        if (res.data.success) {
          setStats(res.data.data);
        }
      } catch (error) {
        console.error('Failed to load admin stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

  if (loading) return <LoadingSpinner text="Aggregating platform intelligence..." fullScreen />;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Admin Platform Header Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.25) 0%, rgba(79, 70, 229, 0.2) 50%, rgba(15, 23, 42, 0.9) 100%)',
          border: '1px solid rgba(168, 85, 247, 0.3)',
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
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#c084fc', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.5rem' }}>
            <Sparkles size={15} /> Global Management Console
          </div>
          <h2 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em' }}>
            Enterprise Platform Intelligence
          </h2>
          <p style={{ color: '#cbd5e1', fontSize: '0.95rem', marginTop: '0.35rem' }}>
            Real-time monitoring across user verifications, property listings, transaction ledgers, and maintenance requests.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.85rem', flexWrap: 'wrap' }}>
          <Link to="/admin/properties" className="btn btn-primary btn-lg shadow-xl hover:shadow-indigo-500/40">
            <Building2 size={18} /> Property Approvals
          </Link>
          <Link to="/admin/users" className="btn btn-secondary btn-lg">
            <Users size={18} /> Manage Users
          </Link>
        </div>
      </div>

      {/* Top Stat Cards Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '1.5rem',
        }}
      >
        <StatCard
          title="Total Users"
          value={stats?.totalUsers || 0}
          icon={Users}
          changeType="positive"
          subtitle={`${stats?.totalOwners || 0} Owners | ${stats?.totalTenants || 0} Tenants`}
        />
        <StatCard
          title="Properties Listed"
          value={stats?.totalProperties || 0}
          icon={Building2}
          subtitle={`${stats?.approvedProperties || 0} Approved | ${stats?.pendingProperties || 0} Pending`}
        />
        <StatCard
          title="Active Leases"
          value={stats?.activeAgreements || 0}
          icon={FileCheck2}
          changeType="positive"
          subtitle={`${stats?.rentedProperties || 0} Currently Occupied`}
        />
        <StatCard
          title="Total Revenue Processed"
          value={`₹${(stats?.totalRevenue || 0).toLocaleString()}`}
          icon={CreditCard}
          changeType="positive"
          subtitle={`₹${(stats?.pendingRent || 0).toLocaleString()} Outstanding Dues`}
        />
      </div>

      {/* Secondary Metrics & Pending Actions */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '1.5rem',
        }}
      >
        <StatCard
          title="Pending Approvals"
          value={stats?.pendingProperties || 0}
          icon={Building2}
          changeType={stats?.pendingProperties > 0 ? 'neutral' : 'positive'}
          subtitle="Listings awaiting admin review"
        />
        <StatCard
          title="Maintenance Tickets"
          value={stats?.totalMaintenance || 0}
          icon={Wrench}
          changeType={stats?.pendingMaintenance > 0 ? 'neutral' : 'positive'}
          subtitle={`${stats?.pendingMaintenance || 0} In Progress / Open`}
        />
        <StatCard
          title="Rental Applications"
          value={stats?.totalApplications || 0}
          icon={FileCheck2}
          subtitle={`${stats?.pendingApplications || 0} Pending Owner Review`}
        />
        <StatCard
          title="Support Complaints"
          value={stats?.openComplaints || 0}
          icon={AlertCircle}
          changeType={stats?.openComplaints > 0 ? 'negative' : 'positive'}
          subtitle="Open disputes / reports"
        />
      </div>

      {/* Visual Analytics Row: Distribution by City & Property Type */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.75rem' }} className="admin-analytics-grid">
        {/* Properties by City */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1.5rem' }}>
            <div style={{ padding: '0.5rem', borderRadius: '10px', background: 'rgba(79, 70, 229, 0.15)', color: '#818cf8' }}>
              <MapPin size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#ffffff' }}>Top Cities by Property Listings</h3>
              <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Geographic distribution of listings</p>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
            {stats?.propertiesByCity && stats.propertiesByCity.length > 0 ? (
              stats.propertiesByCity.map((item, idx) => (
                <div key={idx}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '0.45rem' }}>
                    <span style={{ fontWeight: 700, color: '#ffffff' }}>{item._id || 'Unspecified'}</span>
                    <span style={{ color: '#818cf8', fontWeight: 600 }}>{item.count} properties</span>
                  </div>
                  <div style={{ height: '8px', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '9999px', overflow: 'hidden' }}>
                    <div
                      style={{
                        height: '100%',
                        width: `${Math.min(100, (item.count / (stats?.totalProperties || 1)) * 100)}%`,
                        background: 'linear-gradient(90deg, #4f46e5, #0ea5e9)',
                        borderRadius: '9999px',
                      }}
                    />
                  </div>
                </div>
              ))
            ) : (
              <p style={{ color: '#64748b' }}>No city data recorded.</p>
            )}
          </div>
        </div>

        {/* Properties by Type */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1.5rem' }}>
            <div style={{ padding: '0.5rem', borderRadius: '10px', background: 'rgba(14, 165, 233, 0.15)', color: '#38bdf8' }}>
              <Building2 size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#ffffff' }}>Inventory Breakdown by Type</h3>
              <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Breakdown of property categories</p>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
            {stats?.propertiesByType && stats.propertiesByType.length > 0 ? (
              stats.propertiesByType.map((item, idx) => (
                <div key={idx}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '0.45rem' }}>
                    <span style={{ fontWeight: 700, color: '#ffffff' }}>{item._id || 'Other'}</span>
                    <span style={{ color: '#34d399', fontWeight: 600 }}>{item.count} units</span>
                  </div>
                  <div style={{ height: '8px', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '9999px', overflow: 'hidden' }}>
                    <div
                      style={{
                        height: '100%',
                        width: `${Math.min(100, (item.count / (stats?.totalProperties || 1)) * 100)}%`,
                        background: 'linear-gradient(90deg, #10b981, #06b6d4)',
                        borderRadius: '9999px',
                      }}
                    />
                  </div>
                </div>
              ))
            ) : (
              <p style={{ color: '#64748b' }}>No inventory data recorded.</p>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .admin-analytics-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

export default AdminOverview;
