import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../../context/AuthContext';
import { Building2, Home, AlertCircle } from 'lucide-react';
import Loader from '../../components/common/Loader';

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
    <StyledWrapper>
      <div className="register-page-container">
        {/* 3D Glassmorphic Form */}
        <form className="form" onSubmit={handleSubmit}>
          <div className="form-header">
            <div className="kage-badge">NEW ACCOUNT REGISTRATION</div>
            <h2 className="form-heading">Create Account</h2>
            <p className="form-subheading">Join UrbanNest for verified rentals & smart leases</p>
          </div>

          {error && (
            <div className="error-alert">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          {/* Account Role Selector */}
          <div className="role-selector-box">
            <label className="role-label">Select Account Type</label>
            <div className="role-buttons-grid">
              <button
                type="button"
                className={`role-btn ${formData.role === 'tenant' ? 'active' : ''}`}
                onClick={() => setFormData({ ...formData, role: 'tenant' })}
              >
                <Home size={18} />
                <span>I'm a Tenant</span>
              </button>
              <button
                type="button"
                className={`role-btn ${formData.role === 'owner' ? 'active' : ''}`}
                onClick={() => setFormData({ ...formData, role: 'owner' })}
              >
                <Building2 size={18} />
                <span>I'm an Owner</span>
              </button>
            </div>
          </div>

          {/* Full Name */}
          <div className="flex-column">
            <label htmlFor="register-name">Full Name</label>
          </div>
          <div className="inputForm">
            <svg xmlns="http://www.w3.org/2000/svg" width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            <input
              id="register-name"
              placeholder="Enter your Full Name"
              className="input"
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          {/* Email */}
          <div className="flex-column">
            <label htmlFor="register-email">Email Address</label>
          </div>
          <div className="inputForm">
            <svg xmlns="http://www.w3.org/2000/svg" width={18} viewBox="0 0 32 32" height={18}>
              <g data-name="Layer 3" id="Layer_3">
                <path d="m30.853 13.87a15 15 0 0 0 -29.729 4.082 15.1 15.1 0 0 0 12.876 12.918 15.6 15.6 0 0 0 2.016.13 14.85 14.85 0 0 0 7.715-2.145 1 1 0 1 0 -1.031-1.711 13.007 13.007 0 1 1 5.458-6.529 2.149 2.149 0 0 1 -4.158-.759v-10.856a1 1 0 0 0 -2 0v1.726a8 8 0 1 0 .2 10.325 4.135 4.135 0 0 0 7.83.274 15.2 15.2 0 0 0 .823-7.455zm-14.853 8.13a6 6 0 1 1 6-6 6.006 6.006 0 0 1 -6 6z" />
              </g>
            </svg>
            <input
              id="register-email"
              placeholder="Enter your Email"
              className="input"
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          {/* Phone */}
          <div className="flex-column">
            <label htmlFor="register-phone">Phone Number</label>
          </div>
          <div className="inputForm">
            <svg xmlns="http://www.w3.org/2000/svg" width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
            <input
              id="register-phone"
              placeholder="+91 9876543210"
              className="input"
              type="tel"
              required
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>

          {/* Password */}
          <div className="flex-column">
            <label htmlFor="register-password">Password</label>
          </div>
          <div className="inputForm">
            <svg xmlns="http://www.w3.org/2000/svg" width={18} viewBox="-64 0 512 512" height={18}>
              <path d="m336 512h-288c-26.453125 0-48-21.523438-48-48v-224c0-26.476562 21.546875-48 48-48h288c26.453125 0 48 21.523438 48 48v224c0 26.476562-21.546875 48-48 48zm-288-288c-8.8125 0-16 7.167969-16 16v224c0 8.832031 7.1875 16 16 16h288c8.8125 0 16-7.167969 16-16v-224c0-8.832031-7.1875-16-16-16zm0 0" />
              <path d="m304 224c-8.832031 0-16-7.167969-16-16v-80c0-52.929688-43.070312-96-96-96s-96 43.070312-96 96v80c0 8.832031-7.167969 16-16 16s-16-7.167969-16-16v-80c0-70.59375 57.40625-128 128-128s128 57.40625 128 128v80c0 8.832031-7.167969 16-16 16zm0 0" />
            </svg>
            <input
              id="register-password"
              placeholder="Create a strong password"
              className="input"
              type="password"
              required
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>

          {/* Confirm Password */}
          <div className="flex-column">
            <label htmlFor="register-confirm-password">Confirm Password</label>
          </div>
          <div className="inputForm">
            <svg xmlns="http://www.w3.org/2000/svg" width={18} viewBox="-64 0 512 512" height={18}>
              <path d="m336 512h-288c-26.453125 0-48-21.523438-48-48v-224c0-26.476562 21.546875-48 48-48h288c26.453125 0 48 21.523438 48 48v224c0 26.476562-21.546875 48-48 48zm-288-288c-8.8125 0-16 7.167969-16 16v224c0 8.832031 7.1875 16 16 16h288c8.8125 0 16-7.167969 16-16v-224c0-8.832031-7.1875-16-16-16zm0 0" />
              <path d="m304 224c-8.832031 0-16-7.167969-16-16v-80c0-52.929688-43.070312-96-96-96s-96 43.070312-96 96v80c0 8.832031-7.167969 16-16 16s-16-7.167969-16-16v-80c0-70.59375 57.40625-128 128-128s128 57.40625 128 128v80c0 8.832031-7.167969 16-16 16zm0 0" />
            </svg>
            <input
              id="register-confirm-password"
              placeholder="Confirm your password"
              className="input"
              type="password"
              required
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
            />
          </div>

          <button className="button-submit" type="submit" disabled={loading}>
            {loading ? <Loader size="1.4rem" color="#ffffff" inline /> : 'Create Verified Account'}
          </button>

          <p className="p">
            Already have an account?{' '}
            <Link to="/login" className="span link-to-auth">
              Sign In
            </Link>
          </p>
        </form>
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  min-height: calc(100vh - 76px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 3rem 1.5rem;
  background: transparent;
  position: relative;
  z-index: 10;

  .register-page-container {
    width: 100%;
    max-width: 520px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .form {
    display: flex;
    flex-direction: column;
    gap: 11px;
    background: linear-gradient(135deg, rgba(13, 19, 32, 0.55) 0%, rgba(8, 12, 22, 0.65) 100%);
    border: 1px solid rgba(255, 255, 255, 0.12);
    padding: 2.25rem 2rem;
    width: 100%;
    max-width: 520px;
    border-radius: 26px;
    box-shadow: 0 30px 70px -15px rgba(0, 0, 0, 0.7), 0 0 45px rgba(224, 35, 28, 0.2);
    box-sizing: border-box;
    transition: all 0.3s ease;
  }

  .form:hover {
    border-color: rgba(224, 35, 28, 0.35);
    box-shadow: 0 35px 80px -15px rgba(0, 0, 0, 0.85), 0 0 55px rgba(224, 35, 28, 0.3);
  }

  .form-header {
    text-align: center;
    margin-bottom: 0.5rem;
  }

  .kage-badge {
    display: inline-block;
    padding: 0.25rem 0.75rem;
    border-radius: 100px;
    background: rgba(224, 35, 28, 0.15);
    border: 1px solid rgba(224, 35, 28, 0.3);
    color: #ff5a3c;
    font-size: 0.68rem;
    font-weight: 800;
    letter-spacing: 0.1em;
    margin-bottom: 0.6rem;
  }

  .form-heading {
    font-size: 1.85rem;
    font-weight: 800;
    color: #ffffff;
    margin: 0;
    letter-spacing: -0.02em;
    font-family: var(--font-heading, "Plus Jakarta Sans", sans-serif);
  }

  .form-subheading {
    color: #94a3b8;
    font-size: 0.85rem;
    font-weight: 500;
    margin-top: 0.35rem;
  }

  .error-alert {
    padding: 0.75rem 1rem;
    background: rgba(239, 68, 68, 0.15);
    border: 1px solid rgba(239, 68, 68, 0.35);
    border-radius: 14px;
    color: #fca5a5;
    font-size: 0.825rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .role-selector-box {
    margin-bottom: 0.25rem;
  }

  .role-label {
    display: block;
    font-size: 0.8rem;
    font-weight: 600;
    color: #dfe7e0;
    margin-bottom: 0.4rem;
  }

  .role-buttons-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.75rem;
  }

  .role-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.6rem;
    padding: 0.65rem 1rem;
    border-radius: 14px;
    background: rgba(255, 255, 255, 0.04);
    border: 1px solid rgba(255, 255, 255, 0.1);
    color: #94a3b8;
    font-size: 0.85rem;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.25s ease;
  }

  .role-btn:hover {
    background: rgba(255, 255, 255, 0.08);
    color: #ffffff;
    border-color: rgba(255, 255, 255, 0.2);
  }

  .role-btn.active {
    background: rgba(224, 35, 28, 0.18);
    border-color: #e0231c;
    color: #ffffff;
    box-shadow: 0 0 15px rgba(224, 35, 28, 0.35);
  }

  .flex-column {
    display: flex;
    flex-direction: column;
    margin-top: 2px;
  }

  .flex-column > label {
    color: #dfe7e0;
    font-weight: 600;
    font-size: 0.82rem;
    letter-spacing: 0.01em;
    margin-bottom: 0.25rem;
  }

  .inputForm {
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 14px;
    height: 48px;
    display: flex;
    align-items: center;
    padding-left: 14px;
    padding-right: 14px;
    transition: 0.2s ease-in-out;
    background: rgba(255, 255, 255, 0.04);
  }

  .inputForm svg {
    flex-shrink: 0;
    stroke: #94a3b8;
    fill: #94a3b8;
  }

  .input {
    margin-left: 10px;
    border: none;
    width: 100%;
    height: 100%;
    font-size: 0.9rem;
    color: #ffffff;
    background: transparent;
  }

  .input::placeholder {
    color: #64748b;
    font-size: 0.85rem;
  }

  .input:focus {
    outline: none;
  }

  .inputForm:focus-within {
    border: 1px solid #e0231c;
    box-shadow: 0 0 0 3px rgba(224, 35, 28, 0.25), 0 0 20px rgba(224, 35, 28, 0.2);
    background: rgba(255, 255, 255, 0.07);
  }

  .span {
    font-size: 0.82rem;
    color: #ff5a3c;
    font-weight: 700;
    cursor: pointer;
    text-decoration: none;
    transition: all 0.2s;
  }

  .span:hover {
    color: #ffffff;
    text-decoration: underline;
  }

  .link-to-auth {
    margin-left: 4px;
    color: #ff5a3c;
  }

  .button-submit {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 48px;
    border-radius: 14px;
    background: linear-gradient(135deg, #e0231c 0%, #ff5a3c 100%);
    border: none;
    color: #ffffff;
    font-size: 0.95rem;
    font-weight: 700;
    letter-spacing: -0.01em;
    cursor: pointer;
    box-shadow: 0 6px 20px rgba(224, 35, 28, 0.4);
    transition: all 0.25s ease;
    margin-top: 8px;
  }

  .button-submit:hover:not(:disabled) {
    background: linear-gradient(135deg, #c41e17 0%, #e0231c 100%);
    box-shadow: 0 8px 25px rgba(224, 35, 28, 0.55);
    transform: translateY(-2px);
  }

  .button-submit:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }

  .p {
    text-align: center;
    color: #94a3b8;
    font-size: 0.85rem;
    font-weight: 500;
    margin: 4px 0;
  }
`;

export default Register;
