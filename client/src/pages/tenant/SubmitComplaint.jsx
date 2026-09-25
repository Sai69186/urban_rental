import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Badge from '../../components/common/Badge';
import { AlertCircle, Send, CheckCircle2, MessageSquare } from 'lucide-react';
import Button from '../../components/common/Button';

const SubmitComplaint = () => {
  const [complaints, setComplaints] = useState([]);
  const [agreements, setAgreements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formSuccess, setFormSuccess] = useState('');
  const [formError, setFormError] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Property Issue',
    propertyId: '',
  });

  const fetchComplaintsData = async () => {
    try {
      setLoading(true);
      const [compRes, agrRes] = await Promise.all([
        api.get('/complaints'),
        api.get('/agreements'),
      ]);

      if (compRes.data.success) setComplaints(compRes.data.data);
      if (agrRes.data.success) {
        setAgreements(agrRes.data.data);
        if (agrRes.data.data.length > 0) {
          setFormData((prev) => ({
            ...prev,
            propertyId: agrRes.data.data[0].property?._id || agrRes.data.data[0].property,
          }));
        }
      }
    } catch (error) {
      console.error('Failed to load complaints:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaintsData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      setFormError('');
      setFormSuccess('');

      const res = await api.post('/complaints', formData);
      if (res.data.success) {
        setComplaints((prev) => [res.data.data, ...prev]);
        setFormSuccess('Your complaint has been submitted to platform administrators for investigation.');
        setFormData({
          title: '',
          description: '',
          category: 'Property Issue',
          propertyId: agreements[0]?.property?._id || '',
        });
      }
    } catch (error) {
      setFormError(error.response?.data?.message || 'Failed to submit complaint');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '2rem' }} className="complaints-grid">
      {/* File Complaint Form */}
      <div className="card">
        <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.4rem' }}>
          File a Dispute or Complaint
        </h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
          Report landlord conduct, property misrepresentation, or platform issues directly to admin moderation
        </p>

        {formSuccess && (
          <div style={{ padding: '0.85rem 1rem', background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: 'var(--radius-md)', color: '#34d399', fontSize: '0.85rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <CheckCircle2 size={16} /> {formSuccess}
          </div>
        )}

        {formError && (
          <div style={{ padding: '0.85rem 1rem', background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: 'var(--radius-md)', color: '#f87171', fontSize: '0.85rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <AlertCircle size={16} /> {formError}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="form-group">
            <label className="form-label">Category</label>
            <select
              className="form-select"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            >
              <option value="Property Issue">Property Issue / Uninhabitable Condition</option>
              <option value="Owner Conduct">Owner Conduct / Harassment</option>
              <option value="Payment Dispute">Payment Dispute / Security Deposit Withholding</option>
              <option value="Platform Issue">Platform Technical Issue</option>
              <option value="Other">Other Grievance</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Subject / Title *</label>
            <input
              type="text"
              required
              className="form-input"
              placeholder="e.g. Deposit return delay after vacating..."
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Detailed Statement *</label>
            <textarea
              required
              className="form-textarea"
              placeholder="Provide exact dates, communication attempts, and circumstances..."
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <Button
            type="submit"
            loading={submitting}
            loadingText="Submitting Report..."
            variant="primary"
            icon={Send}
            iconPosition="right"
            style={{ marginTop: '0.5rem' }}
          >
            Submit to Admin Team
          </Button>
        </form>
      </div>

      {/* Submitted Complaints History */}
      <div className="card">
        <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1.25rem' }}>
          My Filed Reports
        </h3>

        {loading ? (
          <LoadingSpinner text="Loading your complaints..." />
        ) : complaints.length === 0 ? (
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>No disputes or reports filed.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {complaints.map((c) => (
              <div
                key={c._id}
                style={{
                  padding: '1rem',
                  background: 'rgba(15, 23, 42, 0.6)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 800, color: 'var(--danger)', fontSize: '0.85rem' }}>
                    {c.ticketId}
                  </span>
                  <Badge status={c.status} />
                </div>
                <p style={{ fontWeight: 700, fontSize: '0.95rem' }}>{c.title}</p>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                  {c.description}
                </p>
                {c.resolution && (
                  <div style={{ marginTop: '0.5rem', padding: '0.5rem', background: 'rgba(16, 185, 129, 0.1)', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--success)' }}>ADMIN VERDICT:</span>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-primary)' }}>{c.resolution}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <style>{`
        @media (max-width: 900px) {
          .complaints-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

export default SubmitComplaint;
