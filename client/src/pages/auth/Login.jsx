import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Building2, Lock, Mail, AlertCircle, ArrowRight, ShieldCheck, UserCheck, KeyRound, Sparkles } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');
      const data = await login(email, password);

      // Redirect by role
      const userRole = data.data.role;
      if (userRole === 'admin') navigate('/admin/overview');
      else if (userRole === 'owner') navigate('/owner/overview');
      else navigate('/tenant/overview');
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Invalid credentials or connection error');
    } finally {
      setLoading(false);
    }
  };

  // Quick-fill demo account helper
  const handleQuickFill = (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setError('');
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
      <div style={{ width: '100%', maxWidth: '460px' }}>
        {/* Brand Header */}
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
            Welcome Back
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '0.925rem', marginTop: '0.35rem' }}>
            Sign in to access your properties, leases, and payments
          </p>
        </div>

        {/* 1-Click Quick Demo Switcher */}
        <div
          style={{
            marginBottom: '1.25rem',
            padding: '1rem',
            background: 'rgba(17, 24, 39, 0.75)',
            border: '1px dashed rgba(129, 140, 248, 0.3)',
            borderRadius: '16px',
          }}
        >
          <span
            style={{
              fontSize: '0.75rem',
              fontWeight: 700,
              color: '#818cf8',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              marginBottom: '0.65rem',
            }}
          >
            <Sparkles size={14} /> 1-Click Demo Accounts
          </span>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
            <button
              type="button"
              onClick={() => handleQuickFill('admin@rentalsystem.com', 'Password123!')}
              className="btn btn-secondary btn-sm"
              style={{ fontSize: '0.75rem', padding: '0.45rem 0.2rem', justifyContent: 'center' }}
            >
              <ShieldCheck size={13} className="text-purple-400" /> Admin
            </button>
            <button
              type="button"
              onClick={() => handleQuickFill('owner1@rentalsystem.com', 'Password123!')}
              className="btn btn-secondary btn-sm"
              style={{ fontSize: '0.75rem', padding: '0.45rem 0.2rem', justifyContent: 'center' }}
            >
              <Building2 size={13} className="text-sky-400" /> Owner
            </button>
            <button
              type="button"
              onClick={() => handleQuickFill('tenant1@rentalsystem.com', 'Password123!')}
              className="btn btn-secondary btn-sm"
              style={{ fontSize: '0.75rem', padding: '0.45rem 0.2rem', justifyContent: 'center' }}
            >
              <UserCheck size={13} className="text-emerald-400" /> Tenant
            </button>
          </div>
        </div>

        {/* Login Card */}
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

          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="email"
                  required
                  className="form-input"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ paddingLeft: '2.5rem' }}
                />
                <Mail
                  size={18}
                  style={{
                    position: 'absolute',
                    left: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#64748b',
                    pointerEvents: 'none',
                  }}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="password"
                  required
                  className="form-input"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ paddingLeft: '2.5rem' }}
                />
                <Lock
                  size={18}
                  style={{
                    position: 'absolute',
                    left: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#64748b',
                    pointerEvents: 'none',
                  }}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary btn-lg"
              style={{ width: '100%', marginTop: '0.75rem', padding: '0.85rem' }}
            >
              {loading ? 'Authenticating...' : 'Sign In'} <ArrowRight size={17} />
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem', color: '#94a3b8' }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: '#818cf8', fontWeight: 700 }}>
              Create an account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
