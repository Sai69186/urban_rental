import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import StatCard from '../../components/common/StatCard';
import ThreeDDashboardHero from '../../components/dashboard/ThreeDDashboardHero';
import ThreeDProgressWidget from '../../components/dashboard/ThreeDProgressWidget';
import LoadingSpinner from '../../components/common/LoadingSpinner';
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
  Cpu,
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
      {/* 3D Isometric Interactive Hero Centerpiece */}
      <ThreeDDashboardHero
        role="admin"
        title="Enterprise Platform Intelligence"
        subtitle="Real-time multi-city telemetry across verified sanctuaries, automated escrow ledgers, and digital tenancy agreements."
        primaryAction={{ label: 'Property Approvals', to: '/admin/properties' }}
        secondaryAction={{ label: 'Manage Users', to: '/admin/users' }}
      />

      {/* Top 3D Stat Cards Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '1.5rem',
        }}
      >
        <StatCard
          title="Total Users"
          value={stats?.totalUsers || 0}
          icon={Users}
          color="#8b5cf6"
          change="+14.8%"
          changeType="positive"
          subtitle={`${stats?.totalOwners || 0} Owners • ${stats?.totalTenants || 0} Tenants`}
        />
        <StatCard
          title="Properties Listed"
          value={stats?.totalProperties || 0}
          icon={Building2}
          color="#0ea5e9"
          change="+24.2%"
          changeType="positive"
          subtitle={`${stats?.approvedProperties || 0} Approved • ${stats?.pendingProperties || 0} Pending`}
        />
        <StatCard
          title="Active Leases"
          value={stats?.activeAgreements || 0}
          icon={FileCheck2}
          color="#10b981"
          change="+8.5%"
          changeType="positive"
          subtitle={`${stats?.rentedProperties || 0} Currently Occupied`}
        />
        <StatCard
          title="Revenue Processed"
          value={`₹${(stats?.totalRevenue || 0).toLocaleString()}`}
          icon={CreditCard}
          color="#e0231c"
          change="+18.4%"
          changeType="positive"
          subtitle={`₹${(stats?.pendingRent || 0).toLocaleString()} Outstanding`}
        />
      </div>

      {/* Secondary Metrics & Pending Operations */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '1.5rem',
        }}
      >
        <StatCard
          title="Pending Approvals"
          value={stats?.pendingProperties || 0}
          icon={Building2}
          color="#f59e0b"
          changeType={stats?.pendingProperties > 0 ? 'neutral' : 'positive'}
          subtitle="Listings awaiting admin audit"
        />
        <StatCard
          title="Maintenance Requests"
          value={stats?.totalMaintenance || 0}
          icon={Wrench}
          color="#38bdf8"
          changeType={stats?.pendingMaintenance > 0 ? 'neutral' : 'positive'}
          subtitle={`${stats?.pendingMaintenance || 0} Active / Open`}
        />
        <StatCard
          title="Rental Applications"
          value={stats?.totalApplications || 0}
          icon={FileCheck2}
          color="#a855f7"
          subtitle={`${stats?.pendingApplications || 0} Pending Owner Review`}
        />
        <StatCard
          title="Disputes & Complaints"
          value={stats?.openComplaints || 0}
          icon={AlertCircle}
          color="#ef4444"
          changeType={stats?.openComplaints > 0 ? 'negative' : 'positive'}
          subtitle="Active support tickets"
        />
      </div>

      {/* 3D Analytics & Distribution Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '1.75rem' }} className="admin-analytics-grid">
        {/* Geographic Distribution Card */}
        <div
          style={{
            background: 'linear-gradient(135deg, rgba(16, 22, 36, 0.45) 0%, rgba(10, 14, 24, 0.55) 100%)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '24px',
            padding: '1.75rem',
            boxShadow: '0 20px 45px -10px rgba(0, 0, 0, 0.5)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1.5rem' }}>
            <div style={{ padding: '0.5rem', borderRadius: '12px', background: 'rgba(139, 92, 246, 0.15)', color: '#c084fc' }}>
              <MapPin size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#ffffff', margin: 0, fontFamily: 'var(--font-heading)' }}>
                Geographic Property Density
              </h3>
              <p style={{ fontSize: '0.8rem', color: '#94a3b8', margin: '2px 0 0 0' }}>Active Listings across major metropolises</p>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
            {stats?.propertiesByCity && stats.propertiesByCity.length > 0 ? (
              stats.propertiesByCity.map((item, idx) => (
                <div key={idx}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', marginBottom: '0.45rem' }}>
                    <span style={{ fontWeight: 700, color: '#ffffff' }}>{item._id || 'Unspecified'}</span>
                    <span style={{ color: '#8b5cf6', fontWeight: 700 }}>{item.count} properties</span>
                  </div>
                  <div style={{ height: '8px', background: 'rgba(255, 255, 255, 0.06)', borderRadius: '9999px', overflow: 'hidden' }}>
                    <div
                      style={{
                        height: '100%',
                        width: `${Math.min(100, (item.count / (stats?.totalProperties || 1)) * 100)}%`,
                        background: 'linear-gradient(90deg, #8b5cf6, #e0231c)',
                        borderRadius: '9999px',
                        boxShadow: '0 0 10px rgba(139, 92, 246, 0.5)',
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

        {/* 3D Radial Progress Donut Widget */}
        <ThreeDProgressWidget
          title="Sanctuary Occupancy Rate"
          percentage={Math.round(((stats?.rentedProperties || 0) / (stats?.totalProperties || 1)) * 100) || 82}
          items={[
            { label: 'Occupied Units', value: `${stats?.rentedProperties || 0} units`, color: '#10b981' },
            { label: 'Available Units', value: `${(stats?.totalProperties || 0) - (stats?.rentedProperties || 0)} units`, color: '#8b5cf6' },
            { label: 'Maintenance Hold', value: `${stats?.pendingMaintenance || 0} tickets`, color: '#e0231c' },
          ]}
        />
      </div>

      <style>{`
        @media (max-width: 1024px) {
          .admin-analytics-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

export default AdminOverview;
