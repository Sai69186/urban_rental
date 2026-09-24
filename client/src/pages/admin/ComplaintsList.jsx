import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import { AlertCircle, CheckCircle2, MessageSquare, ShieldAlert } from 'lucide-react';

const ComplaintsList = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [resolutionStatus, setResolutionStatus] = useState('resolved');
  const [adminNotes, setAdminNotes] = useState('');
  const [resolution, setResolution] = useState('');
  const [saving, setSaving] = useState(false);

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      const res = await api.get('/complaints');
      if (res.data.success) {
        setComplaints(res.data.data);
      }
    } catch (error) {
      console.error('Failed to load complaints:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const handleUpdateComplaint = async (e) => {
    e.preventDefault();
    if (!selectedComplaint) return;
    try {
      setSaving(true);
      const res = await api.patch(`/complaints/${selectedComplaint._id}/status`, {
        status: resolutionStatus,
        adminNotes,
        resolution,
      });

      if (res.data.success) {
        setComplaints((prev) =>
          prev.map((c) => (c._id === selectedComplaint._id ? res.data.data : c))
        );
        setSelectedComplaint(null);
        setAdminNotes('');
        setResolution('');
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to update complaint');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div className="card" style={{ padding: '1.25rem' }}>
        <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Dispute Resolution & Grievance Triage</h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
          Investigate and resolve reports filed by tenants or property owners
        </p>
      </div>

      {loading ? (
        <LoadingSpinner text="Loading complaint tickets..." />
      ) : complaints.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3.5rem' }}>
          <CheckCircle2 size={42} color="var(--success)" style={{ margin: '0 auto 0.75rem' }} />
          <h3 style={{ fontSize: '1.25rem' }}>All Clear!</h3>
          <p style={{ color: 'var(--text-secondary)' }}>No open dispute or grievance reports.</p>
        </div>
      ) : (
        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Ticket ID</th>
                <th>Category</th>
                <th>Complainant</th>
                <th>Subject / Details</th>
                <th>Status</th>
                <th>Reported Date</th>
                <th style={{ textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {complaints.map((c) => (
                <tr key={c._id}>
                  <td>
                    <span style={{ fontWeight: 800, color: 'var(--danger)', fontSize: '0.85rem' }}>
                      {c.ticketId}
                    </span>
                  </td>
                  <td>
                    <span className="badge badge-warning">{c.category}</span>
                  </td>
                  <td>
                    <p style={{ fontWeight: 600, fontSize: '0.9rem' }}>{c.user?.name}</p>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{c.user?.role?.toUpperCase()}</p>
                  </td>
                  <td>
                    <p style={{ fontWeight: 700, fontSize: '0.9rem' }}>{c.title}</p>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', maxWidth: '300px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {c.description}
                    </p>
                  </td>
                  <td>
                    <Badge status={c.status} />
                  </td>
                  <td>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      {new Date(c.createdAt).toLocaleDateString()}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <button
                      onClick={() => {
                        setSelectedComplaint(c);
                        setResolutionStatus(c.status);
                        setAdminNotes(c.adminNotes || '');
                        setResolution(c.resolution || '');
                      }}
                      className="btn btn-primary btn-sm"
                    >
                      Resolve
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Resolution Modal */}
      {selectedComplaint && (
        <Modal
          isOpen={!!selectedComplaint}
          onClose={() => setSelectedComplaint(null)}
          title={`Resolve Dispute #${selectedComplaint.ticketId}`}
          footer={
            <>
              <button
                type="button"
                onClick={() => setSelectedComplaint(null)}
                className="btn btn-secondary btn-sm"
                disabled={saving}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleUpdateComplaint}
                className="btn btn-primary btn-sm"
                disabled={saving}
              >
                {saving ? 'Updating...' : 'Save Resolution'}
              </button>
            </>
          }
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Complainant Statement</p>
              <p style={{ fontWeight: 700, fontSize: '1rem', marginTop: '0.2rem' }}>{selectedComplaint.title}</p>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginTop: '0.5rem', lineHeight: 1.5 }}>
                {selectedComplaint.description}
              </p>
            </div>

            <div className="form-group">
              <label className="form-label">Update Case Status</label>
              <select
                className="form-select"
                value={resolutionStatus}
                onChange={(e) => setResolutionStatus(e.target.value)}
              >
                <option value="open">Open</option>
                <option value="investigating">Under Investigation</option>
                <option value="resolved">Resolved</option>
                <option value="closed">Closed</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Resolution Summary / Verdict</label>
              <textarea
                className="form-textarea"
                placeholder="Details of investigation findings and outcome..."
                value={resolution}
                onChange={(e) => setResolution(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Internal Administrator Notes</label>
              <input
                type="text"
                className="form-input"
                placeholder="Private note for audit trail..."
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
              />
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default ComplaintsList;
