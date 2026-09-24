import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Badge from '../../components/common/Badge';
import {
  Building2,
  MapPin,
  Calendar,
  CreditCard,
  Wrench,
  FileCheck,
  User,
  Phone,
  Mail,
  ShieldCheck,
} from 'lucide-react';

const MyRental = () => {
  const [agreement, setAgreement] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActiveLease = async () => {
      try {
        setLoading(true);
        const res = await api.get('/agreements');
        if (res.data.success) {
          const active = res.data.data.find((a) => a.status === 'active') || res.data.data[0];
          setAgreement(active);
        }
      } catch (error) {
        console.error('Failed to load active lease:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchActiveLease();
  }, []);

  if (loading) return <LoadingSpinner text="Loading current rental..." fullScreen />;

  if (!agreement) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
        <Building2 size={48} color="var(--primary-light)" style={{ opacity: 0.4, margin: '0 auto 1rem' }} />
        <h3 style={{ fontSize: '1.4rem', marginBottom: '0.5rem' }}>No Active Rental</h3>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '450px', margin: '0 auto 1.5rem' }}>
          You do not currently have an active tenancy agreement on the platform. Browse listings and submit an application.
        </p>
        <Link to="/explore" className="btn btn-primary">
          Explore Properties
        </Link>
      </div>
    );
  }

  const prop = agreement.property || {};
  const owner = agreement.owner || {};

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Property Showcase Card */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ position: 'relative', height: '280px', width: '100%' }}>
          <img
            src={prop.images?.[0] || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80'}
            alt={prop.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              background: 'linear-gradient(to top, rgba(11, 15, 25, 0.95), transparent)',
              padding: '2rem 1.5rem 1rem',
            }}
          >
            <span className="badge badge-success" style={{ marginBottom: '0.5rem' }}>Current Active Lease</span>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#ffffff' }}>{prop.title}</h2>
            <p style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              <MapPin size={16} color="var(--primary-light)" /> {prop.address}, {prop.city}, {prop.state} - {prop.pincode}
            </p>
          </div>
        </div>

        {/* Action quick links */}
        <div style={{ padding: '1.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', borderTop: '1px solid var(--border-color)' }}>
          <Link to="/tenant/rent" className="btn btn-primary">
            <CreditCard size={16} /> Pay Monthly Rent
          </Link>
          <Link to="/tenant/maintenance" className="btn btn-secondary">
            <Wrench size={16} /> Request Maintenance
          </Link>
          <Link to="/tenant/agreement" className="btn btn-outline">
            <FileCheck size={16} /> View Lease Agreement
          </Link>
        </div>
      </div>

      {/* Two Column Layout: Lease Overview & Landlord Info */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }} className="rental-grid">
        {/* Lease Summary */}
        <div className="card">
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.25rem' }}>
            Tenancy Terms & Specs
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1.25rem', marginBottom: '1.5rem' }}>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Monthly Rent</span>
              <p style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--success)', marginTop: '0.2rem' }}>
                ₹{agreement.monthlyRent?.toLocaleString()}
              </p>
            </div>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Deposit Paid</span>
              <p style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '0.2rem' }}>
                ₹{agreement.securityDeposit?.toLocaleString()}
              </p>
            </div>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Due Day</span>
              <p style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--primary-light)', marginTop: '0.2rem' }}>
                {agreement.dueDate || 5}th of month
              </p>
            </div>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Agreement ID</span>
              <p style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-secondary)', marginTop: '0.35rem' }}>
                {agreement.agreementNumber}
              </p>
            </div>
          </div>

          <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.25rem' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Lease Period</span>
            <p style={{ fontWeight: 600, marginTop: '0.2rem' }}>
              {new Date(agreement.startDate).toLocaleDateString()} to {new Date(agreement.endDate).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Landlord Contact Box */}
        <div className="card">
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1.25rem' }}>
            Landlord Contact
          </h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
            <img
              src={owner.profileImage || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80'}
              alt={owner.name}
              style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover' }}
            />
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <p style={{ fontWeight: 700 }}>{owner.name}</p>
                {owner.isVerified && <ShieldCheck size={16} color="var(--success)" />}
              </div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Property Owner</span>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Mail size={16} color="var(--primary-light)" /> {owner.email}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Phone size={16} color="var(--primary-light)" /> {owner.phone}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <MapPin size={16} color="var(--primary-light)" /> {owner.address || 'Address provided on contract'}
            </span>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .rental-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

export default MyRental;
