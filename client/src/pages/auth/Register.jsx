import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Building2, Lock, Mail, User, Phone, AlertCircle, ArrowRight, Home } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'tenant',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const data = await register(formData);

      // Redirect by role
      const userRole = data.data.role;
      if (userRole === 'owner') navigate('/owner/overview');
      else navigate('/tenant/overview');
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: 'calc(100vh - 76px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '3rem 1.5rem',
        background: 'radial-gradient(circle at 50% 30%, rgba(79, 70, 229, 0.15), transparent 60%), #0b0f19',
      }}
    >
      <div style={{ width: '100%', maxWidth: '520px' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '16px',
              background: 'linear-gradient(135deg, #4f46e5 0%, #8b5cf6 100%)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              boxShadow: '0 8px 24px rgba(79, 70, 229, 0.4)',
              marginBottom: '1rem',
            }}
          >
            <Building2 size={30} />
          </div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.025em' }}>
            Create Your Account
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '0.925rem', marginTop: '0.35rem' }}>
            Join UrbanNest to manage rentals, lease agreements, and payments
          </p>
        </div>

        {/* Card */}
        <div
          className="card"
          style={{
            padding: '2rem',
            background: 'rgba(30, 41, 59, 0.8)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            boxShadow: '0 20px 40px -15px rgba(0, 0, 0, 0.6)',
          }}
        >
          {error && (
            <div
              style={{
                padding: '0.75rem 1rem',
                background: 'rgba(239, 68, 68, 0.15)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                borderRadius: '10px',
                color: '#f87171',
                fontSize: '0.875rem',
                marginBottom: '1.25rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              <AlertCircle size={16} style={{ flexShrink: 0 }} /> {error}
            </div>
          )}

          {/* Account Role Selector */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label className="form-label" style={{ marginBottom: '0.65rem' }}>Select Account Type</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, role: 'tenant' })}
                style={{
                  padding: '1rem',
                  borderRadius: '14px',
                  border: formData.role === 'tenant' ? '2px solid #6366f1' : '1px solid #334155',
                  background: formData.role === 'tenant' ? 'rgba(79, 70, 229, 0.2)' : 'rgba(15, 23, 42, 0.6)',
                  cursor: 'pointer',
                  textAlign: 'center',
                  transition: 'all 0.15s ease',
                }}
              >
                <Home size={22} color={formData.role === 'tenant' ? '#818cf8' : '#64748b'} style={{ margin: '0 auto 0.35rem' }} />
                <p style={{ fontSize: '0.9rem', fontWeight: 700, color: formData.role === 'tenant' ? '#ffffff' : '#94a3b8' }}>
                  I'm a Tenant
                </p>
                <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Search & Rent Properties</span>
              </button>

              <button
                type="button"
                onClick={() => setFormData({ ...formData, role: 'owner' })}
                style={{
                  padding: '1rem',
                  borderRadius: '14px',
                  border: formData.role === 'owner' ? '2px solid #6366f1' : '1px solid #334155',
                  background: formData.role === 'owner' ? 'rgba(79, 70, 229, 0.2)' : 'rgba(15, 23, 42, 0.6)',
                  cursor: 'pointer',
                  textAlign: 'center',
                  transition: 'all 0.15s ease',
                }}
              >
                <Building2 size={22} color={formData.role === 'owner' ? '#818cf8' : '#64748b'} style={{ margin: '0 auto 0.35rem' }} />
                <p style={{ fontSize: '0.9rem', fontWeight: 700, color: formData.role === 'owner' ? '#ffffff' : '#94a3b8' }}>
                  I'm an Owner
                </p>
                <span style={{ fontSize: '0.75rem', color: '#64748b' }}>List & Manage Leases</span>
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="register-name">Full Name</label>
              <div style={{ position: 'relative' }}>
                <input
                  id="register-name"
                  name="name"
                  type="text"
                  required
                  autoComplete="name"
                  className="form-input"
                  placeholder="e.g. John Doe"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  style={{ paddingLeft: '2.5rem' }}
                />
                <User
                  size={18}
                  style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748b', pointerEvents: 'none' }}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="register-email">Email Address</label>
              <div style={{ position: 'relative' }}>
                <input
                  id="register-email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  className="form-input"
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  style={{ paddingLeft: '2.5rem' }}
                />
                <Mail
                  size={18}
                  style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748b', pointerEvents: 'none' }}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="register-phone">Phone Number</label>
              <div style={{ position: 'relative' }}>
                <input
                  id="register-phone"
                  name="phone"
                  type="tel"
                  required
                  autoComplete="tel"
                  className="form-input"
                  placeholder="+91 9876543210"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  style={{ paddingLeft: '2.5rem' }}
                />
                <Phone
                  size={18}
                  style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748b', pointerEvents: 'none' }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }} className="register-password-grid">
              <div className="form-group">
                <label className="form-label" htmlFor="register-password">Password</label>
                <input
                  id="register-password"
                  name="password"
                  type="password"
                  required
                  autoComplete="new-password"
                  minLength={6}
                  className="form-input"
                  placeholder="Min 6 chars"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="register-confirm-password">Confirm Password</label>
                <input
                  id="register-confirm-password"
                  name="confirmPassword"
                  type="password"
                  required
                  autoComplete="new-password"
                  minLength={6}
                  className="form-input"
                  placeholder="Re-enter password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary btn-lg"
              style={{ width: '100%', marginTop: '0.75rem', padding: '0.85rem' }}
            >
              {loading ? 'Creating Account...' : 'Complete Registration'} <ArrowRight size={17} />
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem', color: '#94a3b8' }}>
            Already registered?{' '}
            <Link to="/login" style={{ color: '#818cf8', fontWeight: 700 }}>
              Sign in here
            </Link>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 540px) {
          .register-password-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Register;
