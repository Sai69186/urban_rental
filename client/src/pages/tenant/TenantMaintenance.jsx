import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import { Wrench, PlusCircle, CheckCircle2, Clock, AlertTriangle, AlertCircle } from 'lucide-react';

const TenantMaintenance = () => {
  const [requests, setRequests] = useState([]);
  const [agreements, setAgreements] = useState([]);
  const [loading, setLoading] = useState(true);

  // New Ticket Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [ticketError, setTicketError] = useState('');
  const [ticketForm, setTicketForm] = useState({
    propertyId: '',
    title: '',
    description: '',
    category: 'Plumbing',
    priority: 'Medium',
  });

  const fetchMaintenance = async () => {
    try {
      setLoading(true);
      const [maintRes, agrRes] = await Promise.all([
        api.get('/maintenance'),
        api.get('/agreements'),
      ]);

      if (maintRes.data.success) setRequests(maintRes.data.data);
      if (agrRes.data.success) {
        const active = agrRes.data.data.filter((a) => a.status === 'active');
        setAgreements(active);
        if (active.length > 0) {
          setTicketForm((prev) => ({
            ...prev,
            propertyId: active[0].property?._id || active[0].property,
          }));
        }
      }
    } catch (error) {
      console.error('Failed to load maintenance data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMaintenance();
  }, []);

  const handleCreateTicket = async (e) => {
    e.preventDefault();
    if (!ticketForm.propertyId) {
      setTicketError('You must have an active rental property to submit maintenance requests.');
      return;
    }

    try {
      setSubmitting(true);
      setTicketError('');
      const res = await api.post('/maintenance', ticketForm);
      if (res.data.success) {
        setRequests((prev) => [res.data.data, ...prev]);
        setModalOpen(false);
        setTicketForm({
          propertyId: agreements[0]?.property?._id || '',
          title: '',
          description: '',
          category: 'Plumbing',
          priority: 'Medium',
        });
      }
    } catch (error) {
      setTicketError(error.response?.data?.message || 'Failed to submit maintenance ticket');
    } finally {
      setSubmitting(false);
    }
  };

  const handleConfirmResolution = async (ticketId) => {
    try {
      const res = await api.patch(`/maintenance/${ticketId}/confirm`);
      if (res.data.success) {
        setRequests((prev) =>
          prev.map((r) => (r._id === ticketId ? { ...r, status: 'Closed' } : r))
        );
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to confirm resolution');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div className="card" style={{ padding: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Maintenance & Repair Requests</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
            Report issues to your landlord and track resolution progress in real-time
          </p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          disabled={agreements.length === 0}
          className="btn btn-primary"
        >
          <PlusCircle size={18} /> Raise Maintenance Request
        </button>
      </div>

      {loading ? (
        <LoadingSpinner text="Loading tickets..." />
      ) : requests.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <CheckCircle2 size={48} color="var(--success)" style={{ margin: '0 auto 1rem' }} />
          <h3 style={{ fontSize: '1.3rem', marginBottom: '0.5rem' }}>No active repair issues</h3>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '450px', margin: '0 auto 1.5rem' }}>
            If you need plumbing, electrical, or appliance repairs at your rental property, raise a ticket here.
          </p>
          {agreements.length > 0 && (
            <button onClick={() => setModalOpen(true)} className="btn btn-primary">
              <PlusCircle size={18} /> Submit Maintenance Request
            </button>
          )}
        </div>
      ) : (
        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Ticket #</th>
                <th>Issue Title</th>
                <th>Category</th>
                <th>Priority</th>
                <th>Property</th>
                <th>Status</th>
                <th>Landlord Note</th>
                <th style={{ textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((r) => (
                <tr key={r._id}>
                  <td>
                    <span style={{ fontWeight: 800, color: 'var(--primary-light)', fontSize: '0.85rem' }}>
                      {r.ticketNumber}
                    </span>
                  </td>
                  <td>
                    <p style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.9rem' }}>{r.title}</p>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      Reported: {new Date(r.createdAt).toLocaleDateString()}
                    </p>
                  </td>
                  <td>
                    <span className="badge badge-info">{r.category}</span>
                  </td>
                  <td>
                    <Badge status={r.priority} />
                  </td>
                  <td>
                    <p style={{ fontWeight: 600, fontSize: '0.85rem' }}>{r.property?.title}</p>
                  </td>
                  <td>
                    <Badge status={r.status} />
                  </td>
                  <td>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      {r.ownerNotes || 'Awaiting update'}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    {r.status === 'Resolved' && (
                      <button
                        onClick={() => handleConfirmResolution(r._id)}
                        className="btn btn-success btn-sm"
                      >
                        Confirm & Close
                      </button>
                    )}
                    {r.status === 'Closed' && (
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Closed</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* New Maintenance Ticket Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Raise Maintenance Ticket"
        maxWidth="600px"
        footer={
          <>
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="btn btn-secondary btn-sm"
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleCreateTicket}
              className="btn btn-primary btn-sm"
              disabled={submitting || !ticketForm.title || !ticketForm.description}
            >
              {submitting ? 'Submitting...' : 'Dispatch Ticket'}
            </button>
          </>
        }
      >
        {ticketError && (
          <div style={{ padding: '0.75rem 1rem', background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: 'var(--radius-md)', color: '#f87171', fontSize: '0.85rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <AlertCircle size={16} /> {ticketError}
          </div>
        )}

        <form onSubmit={handleCreateTicket} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="form-group">
            <label className="form-label">Rental Property</label>
            <select
              className="form-select"
              value={ticketForm.propertyId}
              onChange={(e) => setTicketForm({ ...ticketForm, propertyId: e.target.value })}
            >
              {agreements.map((agr) => (
                <option key={agr.property?._id || agr.property} value={agr.property?._id || agr.property}>
                  {agr.property?.title}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Issue Headline *</label>
            <input
              type="text"
              required
              className="form-input"
              placeholder="e.g. Master bathroom tap leaking, AC not cooling..."
              value={ticketForm.title}
              onChange={(e) => setTicketForm({ ...ticketForm, title: e.target.value })}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Category</label>
              <select
                className="form-select"
                value={ticketForm.category}
                onChange={(e) => setTicketForm({ ...ticketForm, category: e.target.value })}
              >
                <option value="Plumbing">Plumbing</option>
                <option value="Electrical">Electrical</option>
                <option value="Appliance">Appliance</option>
                <option value="Internet">Internet / Cable</option>
                <option value="Structural">Structural / Carpentry</option>
                <option value="Cleaning">Deep Cleaning</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Urgency Priority</label>
              <select
                className="form-select"
                value={ticketForm.priority}
                onChange={(e) => setTicketForm({ ...ticketForm, priority: e.target.value })}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Urgent">Urgent / Emergency</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Detailed Description *</label>
            <textarea
              required
              className="form-textarea"
              placeholder="Describe symptoms, when it started, and access availability for repairmen..."
              rows={3}
              value={ticketForm.description}
              onChange={(e) => setTicketForm({ ...ticketForm, description: e.target.value })}
            />
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default TenantMaintenance;
