import React, { useState } from 'react';
import api from '../../services/api';
import { Radio, Send, CheckCircle2, AlertCircle } from 'lucide-react';

const BroadcastNotification = () => {
  const [targetRole, setTargetRole] = useState('');
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleBroadcast = async (e) => {
    e.preventDefault();
    try {
      setSending(true);
      setErrorMsg('');
      setSuccessMsg('');

      const res = await api.post('/admin/broadcast', {
        targetRole: targetRole || undefined,
        title,
        message,
      });

      if (res.data.success) {
        setSuccessMsg(res.data.message);
        setTitle('');
        setMessage('');
      }
    } catch (error) {
      setErrorMsg(error.response?.data?.message || 'Failed to dispatch broadcast');
    } finally {
      setSending(false);
    }
  };

  return (
    <div style={{ maxWidth: '650px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div className="card" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
          <div style={{ padding: '0.6rem', background: 'rgba(79, 70, 229, 0.15)', borderRadius: 'var(--radius-md)', color: 'var(--primary-light)' }}>
            <Radio size={24} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Broadcast Announcement</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
              Dispatch in-app notifications instantly to all platform users or specific groups
            </p>
          </div>
        </div>

        {successMsg && (
          <div style={{ padding: '0.85rem 1rem', background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: 'var(--radius-md)', color: '#34d399', fontSize: '0.875rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <CheckCircle2 size={16} /> {successMsg}
          </div>
        )}

        {errorMsg && (
          <div style={{ padding: '0.85rem 1rem', background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: 'var(--radius-md)', color: '#f87171', fontSize: '0.875rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <AlertCircle size={16} /> {errorMsg}
          </div>
        )}

        <form onSubmit={handleBroadcast} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="form-group">
            <label className="form-label">Target Audience</label>
            <select
              className="form-select"
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
            >
              <option value="">All Users (Owners & Tenants)</option>
              <option value="owner">Property Owners Only</option>
              <option value="tenant">Tenants Only</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Announcement Title *</label>
            <input
              type="text"
              required
              className="form-input"
              placeholder="e.g. Scheduled System Maintenance & Lease Updates"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Message Content *</label>
            <textarea
              required
              className="form-textarea"
              placeholder="Type your message here..."
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={sending}
            className="btn btn-primary"
            style={{ width: '100%', padding: '0.8rem' }}
          >
            {sending ? 'Broadcasting...' : 'Send Broadcast Notification'} <Send size={16} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default BroadcastNotification;
