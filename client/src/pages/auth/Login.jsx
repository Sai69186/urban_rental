import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../../context/AuthContext';
import { ShieldCheck, Building2, UserCheck, Sparkles, AlertCircle } from 'lucide-react';
import Loader from '../../components/common/Loader';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
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
    <StyledWrapper>
      <div className="login-page-container">
        {/* 1-Click Quick Demo Switcher */}
        <div className="demo-accounts-bar">
          <span className="demo-title">
            <Sparkles size={14} /> 1-Click Demo Accounts
          </span>
          <div className="demo-buttons-grid">
            <button
              type="button"
              onClick={() => handleQuickFill('admin@rentalsystem.com', 'Password123!')}
              className="demo-btn admin"
            >
              <ShieldCheck size={14} /> Admin
            </button>
            <button
              type="button"
              onClick={() => handleQuickFill('owner1@rentalsystem.com', 'Password123!')}
              className="demo-btn owner"
            >
              <Building2 size={14} /> Owner
            </button>
            <button
              type="button"
              onClick={() => handleQuickFill('tenant1@rentalsystem.com', 'Password123!')}
              className="demo-btn tenant"
            >
              <UserCheck size={14} /> Tenant
            </button>
          </div>
        </div>

        {/* 3D Glassmorphic Form */}
        <form className="form" onSubmit={handleLogin}>
          <div className="form-header">
            <div className="kage-badge">AUTHENTICATION PORTAL</div>
            <h2 className="form-heading">Welcome Back</h2>
            <p className="form-subheading">Sign in to access your properties, smart leases & escrow</p>
          </div>

          {error && (
            <div className="error-alert">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          <div className="flex-column">
            <label htmlFor="login-email">Email Address</label>
          </div>
          <div className="inputForm">
            <svg xmlns="http://www.w3.org/2000/svg" width={18} viewBox="0 0 32 32" height={18}>
              <g data-name="Layer 3" id="Layer_3">
                <path d="m30.853 13.87a15 15 0 0 0 -29.729 4.082 15.1 15.1 0 0 0 12.876 12.918 15.6 15.6 0 0 0 2.016.13 14.85 14.85 0 0 0 7.715-2.145 1 1 0 1 0 -1.031-1.711 13.007 13.007 0 1 1 5.458-6.529 2.149 2.149 0 0 1 -4.158-.759v-10.856a1 1 0 0 0 -2 0v1.726a8 8 0 1 0 .2 10.325 4.135 4.135 0 0 0 7.83.274 15.2 15.2 0 0 0 .823-7.455zm-14.853 8.13a6 6 0 1 1 6-6 6.006 6.006 0 0 1 -6 6z" />
              </g>
            </svg>
            <input
              id="login-email"
              placeholder="Enter your email address"
              className="input"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="flex-column">
            <label htmlFor="login-password">Password</label>
          </div>
          <div className="inputForm">
            <svg xmlns="http://www.w3.org/2000/svg" width={18} viewBox="-64 0 512 512" height={18}>
              <path d="m336 512h-288c-26.453125 0-48-21.523438-48-48v-224c0-26.476562 21.546875-48 48-48h288c26.453125 0 48 21.523438 48 48v224c0 26.476562-21.546875 48-48 48zm-288-288c-8.8125 0-16 7.167969-16 16v224c0 8.832031 7.1875 16 16 16h288c8.8125 0 16-7.167969 16-16v-224c0-8.832031-7.1875-16-16-16zm0 0" />
              <path d="m304 224c-8.832031 0-16-7.167969-16-16v-80c0-52.929688-43.070312-96-96-96s-96 43.070312-96 96v80c0 8.832031-7.167969 16-16 16s-16-7.167969-16-16v-80c0-70.59375 57.40625-128 128-128s128 57.40625 128 128v80c0 8.832031-7.167969 16-16 16zm0 0" />
            </svg>
            <input
              id="login-password"
              placeholder="Enter your secret password"
              className="input"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="flex-row">
            <div className="remember-box">
              <input
                type="checkbox"
                id="remember"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <label htmlFor="remember">Remember me</label>
            </div>
            <span className="span forgot-link" onClick={() => alert('Password reset link will be sent to your registered email.')}>
              Forgot password?
            </span>
          </div>

          <button className="button-submit" type="submit" disabled={loading}>
            {loading ? <Loader size="1.4rem" color="#ffffff" inline /> : 'Sign In to Dashboard'}
          </button>

          <p className="p">
            Don't have an account?{' '}
            <Link to="/register" className="span link-to-auth">
              Sign Up
            </Link>
          </p>

          <div className="divider-row">
            <span className="divider-line" />
            <span className="divider-text">Or Continue With</span>
            <span className="divider-line" />
          </div>

          <div className="flex-row social-row">
            <button
              type="button"
              className="btn social-btn google"
              onClick={() => handleQuickFill('tenant1@rentalsystem.com', 'Password123!')}
            >
              <svg xmlSpace="preserve" viewBox="0 0 512 512" width={18} height={18} version="1.1">
                <path d="M113.47,309.408L95.648,375.94l-65.139,1.378C11.042,341.211,0,299.9,0,256 c0-42.451,10.324-82.483,28.624-117.732h0.014l57.992,10.632l25.404,57.644c-5.317,15.501-8.215,32.141-8.215,49.456 C103.821,274.792,107.225,292.797,113.47,309.408z" style={{ fill: '#FBBB00' }} />
                <path d="M507.527,208.176C510.467,223.662,512,239.655,512,256c0,18.328-1.927,36.206-5.598,53.451 c-12.462,58.683-45.025,109.925-90.134,146.187l-0.014-0.014l-73.044-3.727l-10.338-64.535 c29.932-17.554,53.324-45.025,65.646-77.911h-136.89V208.176h138.887L507.527,208.176L507.527,208.176z" style={{ fill: '#518EF8' }} />
                <path d="M416.253,455.624l0.014,0.014C372.396,490.901,316.666,512,256,512 c-97.491,0-182.252-54.491-225.491-134.681l82.961-67.91c21.619,57.698,77.278,98.771,142.53,98.771 c28.047,0,54.323-7.582,76.87-20.818L416.253,455.624z" style={{ fill: '#28B446' }} />
                <path d="M419.404,58.936l-82.933,67.896c-23.335-14.586-50.919-23.012-80.471-23.012 c-66.729,0-123.429,42.957-143.965,102.724l-83.397-68.276h-0.014C71.23,56.123,157.06,0,256,0 C318.115,0,375.068,22.126,419.404,58.936z" style={{ fill: '#F14336' }} />
              </svg>
              <span>Google</span>
            </button>
            <button
              type="button"
              className="btn social-btn apple"
              onClick={() => handleQuickFill('owner1@rentalsystem.com', 'Password123!')}
            >
              <svg viewBox="0 0 22.773 22.773" width={18} height={18} fill="#ffffff">
                <path d="M15.769,0c0.053,0,0.106,0,0.162,0c0.13,1.606-0.483,2.806-1.228,3.675c-0.731,0.863-1.732,1.7-3.351,1.573 c-0.108-1.583,0.506-2.694,1.25-3.561C13.292,0.879,14.557,0.16,15.769,0z" />
                <path d="M20.67,16.716c0,0.016,0,0.03,0,0.045c-0.455,1.378-1.104,2.559-1.896,3.655c-0.723,0.995-1.609,2.334-3.191,2.334 c-1.367,0-2.275-0.879-3.676-0.903c-1.482-0.024-2.297,0.735-3.652,0.926c-0.155,0-0.31,0-0.462,0 c-0.995-0.144-1.798-0.932-2.383-1.642c-1.725-2.098-3.058-4.808-3.306-8.276c0-0.34,0-0.679,0-1.019 c0.105-2.482,1.311-4.5,2.914-5.478c0.846-0.52,2.009-0.963,3.304-0.765c0.555,0.086,1.122,0.276,1.619,0.464 c0.471,0.181,1.06,0.502,1.618,0.485c0.378-0.011,0.754-0.208,1.135-0.347c1.116-0.403,2.21-0.865,3.652-0.648 c1.733,0.262,2.963,1.032,3.723,2.22c-1.466,0.933-2.625,2.339-2.427,4.74C17.818,14.688,19.086,15.964,20.67,16.716z" />
              </svg>
              <span>Apple</span>
            </button>
          </div>
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

  .login-page-container {
    width: 100%;
    max-width: 480px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .demo-accounts-bar {
    width: 100%;
    margin-bottom: 1.25rem;
    padding: 0.85rem 1rem;
    background: rgba(13, 19, 32, 0.55);
    border: 1px dashed rgba(224, 35, 28, 0.4);
    border-radius: 18px;
  }

  .demo-title {
    font-size: 0.72rem;
    font-weight: 700;
    color: #ff5a3c;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    display: flex;
    align-items: center;
    gap: 0.35rem;
    margin-bottom: 0.5rem;
  }

  .demo-buttons-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 0.5rem;
  }

  .demo-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.35rem;
    font-size: 0.78rem;
    font-weight: 700;
    padding: 0.5rem 0.3rem;
    border-radius: 12px;
    background: rgba(255, 255, 255, 0.04);
    border: 1px solid rgba(255, 255, 255, 0.1);
    color: #ffffff;
    cursor: pointer;
    transition: all 0.25s ease;
  }

  .demo-btn:hover {
    background: rgba(255, 255, 255, 0.12);
    transform: translateY(-2px);
  }

  .demo-btn.admin { color: #ff5a3c; border-color: rgba(224, 35, 28, 0.35); }
  .demo-btn.owner { color: #e5be65; border-color: rgba(201, 162, 74, 0.35); }
  .demo-btn.tenant { color: #34d399; border-color: rgba(16, 185, 129, 0.35); }

  /* 3D Transparent Form */
  .form {
    display: flex;
    flex-direction: column;
    gap: 12px;
    background: linear-gradient(135deg, rgba(13, 19, 32, 0.55) 0%, rgba(8, 12, 22, 0.65) 100%);
    border: 1px solid rgba(255, 255, 255, 0.12);
    padding: 2.25rem 2rem;
    width: 100%;
    max-width: 480px;
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
    margin-bottom: 0.75rem;
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
    line-height: 1.45;
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

  .flex-row {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 10px;
    justify-content: space-between;
    margin-top: 4px;
  }

  .remember-box {
    display: flex;
    align-items: center;
    gap: 7px;
  }

  .remember-box > label {
    font-size: 0.82rem;
    color: #94a3b8;
    font-weight: 500;
    cursor: pointer;
  }

  .remember-box > input[type="checkbox"] {
    cursor: pointer;
    accent-color: #e0231c;
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

  .divider-row {
    display: flex;
    align-items: center;
    gap: 12px;
    margin: 8px 0;
  }

  .divider-line {
    flex: 1;
    height: 1px;
    background: rgba(255, 255, 255, 0.08);
  }

  .divider-text {
    font-size: 0.72rem;
    color: #64748b;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.08em;
  }

  .social-btn {
    flex: 1;
    height: 44px;
    border-radius: 14px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: 600;
    font-size: 0.85rem;
    color: #ffffff;
    gap: 8px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(255, 255, 255, 0.04);
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .social-btn:hover {
    border-color: rgba(224, 35, 28, 0.4);
    background: rgba(224, 35, 28, 0.1);
    transform: translateY(-1px);
  }

  .social-row {
    display: flex;
    gap: 10px;
  }
`;

export default Login;
