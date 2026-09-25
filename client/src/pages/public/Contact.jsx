import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2, MessageSquare, Clock, Shield } from 'lucide-react';
import Button from '../../components/common/Button';
import '../../styles/kage-theme.css';

const Contact = () => {
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSending(true);
    setTimeout(() => {
      setSending(false);
      setSubmitted(true);
    }, 600);
  };

  return (
    <div className="kage-full-theme" style={{ minHeight: 'calc(100vh - 76px)', position: 'relative' }}>
      {/* Ambient background light rays */}
      <div className="kage-ambient-canvas" aria-hidden="true" />

      <div className="kage-theme-container" style={{ paddingTop: '2.5rem', paddingBottom: '6rem' }}>
        {/* Header Section */}
        <div style={{ textAlign: 'center', marginBottom: '3rem', position: 'relative', zIndex: 2 }}>
          <div className="kage-chip">
            <span className="kage-chip-dot" />
            <span className="kage-chip-tx">Support & Concierge</span>
            <span className="kage-chip-jp">問合せ</span>
          </div>

          <h1
            className="kage-hero-heading"
            style={{
              fontSize: 'clamp(2.4rem, 5vw, 3.8rem)',
              marginBottom: '0.75rem',
            }}
          >
            Contact & <em>Support</em>
          </h1>

          <p
            className="kage-hero-sub"
            style={{
              maxWidth: '680px',
              margin: '0 auto',
            }}
          >
            Have inquiries regarding residential listings, digital tenancy contracts, or automated rent ledgers? Our concierge team is at your service.
          </p>
        </div>

        {/* Responsive Contact Grid */}
        <div
          className="contact-layout-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(280px, 1fr) minmax(320px, 1.4fr)',
            gap: '2rem',
            position: 'relative',
            zIndex: 2,
          }}
        >
          {/* Left Column: Contact Cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* Email Card */}
            <div
              style={{
                background: 'rgba(10, 14, 20, 0.78)',
                border: '1px solid var(--kage-line)',
                borderRadius: '20px',
                padding: '1.6rem',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                transition: 'transform 0.3s ease, border-color 0.3s ease',
              }}
              className="contact-info-hover"
            >
              <div
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '12px',
                  background: 'rgba(224, 35, 28, 0.12)',
                  border: '1px solid rgba(224, 35, 28, 0.25)',
                  color: 'var(--kage-vermilion)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1rem',
                }}
              >
                <Mail size={22} />
              </div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: '#ffffff', marginBottom: '0.25rem' }}>
                Email Inquiries
              </h3>
              <p style={{ color: 'var(--kage-bone-dim)', fontSize: '0.875rem' }}>
                support@urbannestplatform.com
              </p>
              <span style={{ fontSize: '0.75rem', color: 'var(--kage-muted)', marginTop: '0.5rem', display: 'block' }}>
                Average response time: &lt; 2 hours
              </span>
            </div>

            {/* Direct Phone Line */}
            <div
              style={{
                background: 'rgba(10, 14, 20, 0.78)',
                border: '1px solid var(--kage-line)',
                borderRadius: '20px',
                padding: '1.6rem',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                transition: 'transform 0.3s ease, border-color 0.3s ease',
              }}
              className="contact-info-hover"
            >
              <div
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '12px',
                  background: 'rgba(16, 185, 129, 0.12)',
                  border: '1px solid rgba(16, 185, 129, 0.25)',
                  color: '#34d399',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1rem',
                }}
              >
                <Phone size={22} />
              </div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: '#ffffff', marginBottom: '0.25rem' }}>
                Direct Concierge Line
              </h3>
              <p style={{ color: 'var(--kage-bone-dim)', fontSize: '0.875rem' }}>
                +91 (800) 234-7890 / +91 (22) 6789-0123
              </p>
              <span style={{ fontSize: '0.75rem', color: 'var(--kage-muted)', marginTop: '0.5rem', display: 'block' }}>
                Mon – Sat, 9:00 AM – 8:00 PM IST
              </span>
            </div>

            {/* Headquarters Location */}
            <div
              style={{
                background: 'rgba(10, 14, 20, 0.78)',
                border: '1px solid var(--kage-line)',
                borderRadius: '20px',
                padding: '1.6rem',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                transition: 'transform 0.3s ease, border-color 0.3s ease',
              }}
              className="contact-info-hover"
            >
              <div
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '12px',
                  background: 'rgba(59, 130, 246, 0.12)',
                  border: '1px solid rgba(59, 130, 246, 0.25)',
                  color: '#60a5fa',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1rem',
                }}
              >
                <MapPin size={22} />
              </div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: '#ffffff', marginBottom: '0.25rem' }}>
                Platform Headquarters
              </h3>
              <p style={{ color: 'var(--kage-bone-dim)', fontSize: '0.875rem' }}>
                UrbanNest Towers, Bandra Kurla Complex (BKC), Mumbai, Maharashtra 400051
              </p>
            </div>
          </div>

          {/* Right Column: Interactive Dispatch Form */}
          <div
            style={{
              background: 'rgba(10, 14, 20, 0.82)',
              border: '1px solid var(--kage-line)',
              borderRadius: '24px',
              padding: 'clamp(1.75rem, 3.5vw, 2.5rem)',
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
              boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.85), 0 0 35px rgba(224, 35, 28, 0.08)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
            }}
          >
            {submitted ? (
              <div style={{ textAlign: 'center', padding: '3rem 1.5rem' }}>
                <div
                  style={{
                    width: '68px',
                    height: '68px',
                    borderRadius: '50%',
                    background: 'rgba(16, 185, 129, 0.15)',
                    border: '1px solid rgba(16, 185, 129, 0.35)',
                    color: '#34d399',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 1.5rem',
                  }}
                >
                  <CheckCircle2 size={36} />
                </div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.65rem', color: '#ffffff' }}>
                  Dispatch Received
                </h3>
                <p style={{ color: 'var(--kage-bone-dim)', fontSize: '0.95rem', lineHeight: 1.6, maxWidth: '420px', margin: '0 auto 1.5rem' }}>
                  Thank you for reaching out. A platform representative has been assigned and will reply to your registered email shortly.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({ name: '', email: '', subject: '', message: '' });
                  }}
                  className="btn btn-secondary"
                  style={{ borderRadius: '100px', padding: '0.65rem 1.75rem' }}
                >
                  Send Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div style={{ marginBottom: '0.25rem' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--kage-vermilion)' }}>
                    Dispatch Transmission
                  </span>
                  <h3 style={{ fontSize: '1.4rem', fontWeight: 600, color: '#ffffff', marginTop: '0.2rem' }}>
                    Send a Direct Message
                  </h3>
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" style={{ color: 'var(--kage-bone)' }}>Your Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ananya Roy"
                    className="form-input"
                    style={{
                      background: 'rgba(5, 7, 10, 0.75)',
                      borderColor: 'var(--kage-line)',
                      color: 'var(--kage-bone-bright)',
                      borderRadius: '12px',
                    }}
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" style={{ color: 'var(--kage-bone)' }}>Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. ananya@example.com"
                    className="form-input"
                    style={{
                      background: 'rgba(5, 7, 10, 0.75)',
                      borderColor: 'var(--kage-line)',
                      color: 'var(--kage-bone-bright)',
                      borderRadius: '12px',
                    }}
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" style={{ color: 'var(--kage-bone)' }}>Subject / Category</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Tenancy Verification Inquiry"
                    className="form-input"
                    style={{
                      background: 'rgba(5, 7, 10, 0.75)',
                      borderColor: 'var(--kage-line)',
                      color: 'var(--kage-bone-bright)',
                      borderRadius: '12px',
                    }}
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  />
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" style={{ color: 'var(--kage-bone)' }}>Detailed Message</label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Describe your inquiry or support requirements..."
                    className="form-textarea"
                    style={{
                      background: 'rgba(5, 7, 10, 0.75)',
                      borderColor: 'var(--kage-line)',
                      color: 'var(--kage-bone-bright)',
                      borderRadius: '12px',
                    }}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  />
                </div>

                <Button
                  type="submit"
                  loading={sending}
                  loadingText="Transmitting..."
                  variant="primary"
                  icon={Send}
                  style={{
                    marginTop: '0.5rem',
                    padding: '0.85rem 1.75rem',
                    borderRadius: '12px',
                    fontWeight: 700,
                    letterSpacing: '0.05em',
                  }}
                >
                  Transmit Message
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .contact-info-hover:hover {
          transform: translateY(-4px);
          border-color: rgba(224, 35, 28, 0.4) !important;
          box-shadow: 0 15px 35px rgba(0, 0, 0, 0.7) !important;
        }
        @media (max-width: 820px) {
          .contact-layout-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Contact;
