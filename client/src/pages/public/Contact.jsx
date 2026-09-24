import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2 } from 'lucide-react';

const Contact = () => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="container" style={{ padding: '4rem 1.5rem 6rem', maxWidth: '850px' }}>
      <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '0.75rem' }}>
          Contact Support & Inquiries
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Have questions about the platform or need partnership assistance? Our support team is here to help.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '2.5rem' }} className="contact-grid">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="card">
            <Mail size={22} color="var(--primary-light)" style={{ marginBottom: '0.5rem' }} />
            <h4 style={{ fontSize: '1rem', fontWeight: 700 }}>Email Us</h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>support@urbannestplatform.com</p>
          </div>

          <div className="card">
            <Phone size={22} color="var(--success)" style={{ marginBottom: '0.5rem' }} />
            <h4 style={{ fontSize: '1rem', fontWeight: 700 }}>Call Center</h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>+91 (800) 234-7890</p>
          </div>

          <div className="card">
            <MapPin size={22} color="var(--secondary)" style={{ marginBottom: '0.5rem' }} />
            <h4 style={{ fontSize: '1rem', fontWeight: 700 }}>Headquarters</h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Bandra Kurla Complex, Mumbai, India</p>
          </div>
        </div>

        <div className="card">
          {submitted ? (
            <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
              <CheckCircle2 size={48} color="var(--success)" style={{ margin: '0 auto 1rem' }} />
              <h3 style={{ fontSize: '1.3rem', marginBottom: '0.5rem' }}>Message Dispatched!</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                Thank you for contacting us. A platform representative will reply to your email shortly.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '0.5rem' }}>Send a Message</h3>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  required
                  className="form-input"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  required
                  className="form-input"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Subject</label>
                <input
                  type="text"
                  required
                  className="form-input"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Message</label>
                <textarea
                  required
                  className="form-textarea"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                />
              </div>

              <button type="submit" className="btn btn-primary" style={{ marginTop: '0.5rem' }}>
                <Send size={16} /> Send Message
              </button>
            </form>
          )}
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .contact-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Contact;
