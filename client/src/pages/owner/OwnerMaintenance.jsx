import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import { Wrench, CheckCircle2, Clock, DollarSign, AlertCircle } from 'lucide-react';

const OwnerMaintenance = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [ticketStatus, setTicketStatus] = useState('Acknowledged');
  const [estimatedCost, setEstimatedCost] = useState(0);
  const [actualCost, setActualCost] = useState(0);
  const [ownerNotes, setOwnerNotes] = useState('');
  const [saving, setSaving] = useState(false);

  const fetchMaintenance = async () => {
    try {
      setLoading(true);
      const res = await api.get('/maintenance');
      if (res.data.success) {
        setRequests(res.data.data);
      }
    } catch (error) {
      console.error('Failed to load owner maintenance tickets:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMaintenance();
  }, []);

  const handleOpenUpdateModal = (ticket) => {
    setSelectedTicket(ticket);
    setTicketStatus(ticket.status);
    setEstimatedCost(ticket.estimatedCost || 0);
    setActualCost(ticket.actualCost || 0);
    setOwnerNotes(ticket.ownerNotes || '');
  };

  const handleUpdateTicketSubmit = async (e) => {
    e.preventDefault();
    if (!selectedTicket) return;

    try {
      setSaving(true);
      const res = await api.patch(`/maintenance/${selectedTicket._id}/status`, {
        status: ticketStatus,
        estimatedCost,
        actualCost,
        ownerNotes,
      });

      if (res.data.success) {
        setRequests((prev) =>
          prev.map((t) => (t._id === selectedTicket._id ? res.data.data : t))
        );
        setSelectedTicket(null);
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to update ticket');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div className="card" style={{ padding: '1.25rem' }}>
        <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Maintenance & Repair Requests</h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
          Manage service requests from tenants, assign technicians, track repair costs, and mark resolution
        </p>
      </div>

      {loading ? (
        <LoadingSpinner text="Loading maintenance tickets..." />
      ) : requests.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3.5rem' }}>
          <CheckCircle2 size={42} color="var(--success)" style={{ margin: '0 auto 0.75rem' }} />
          <h3 style={{ fontSize: '1.25rem' }}>No Maintenance Tickets</h3>
          <p style={{ color: 'var(--text-secondary)' }}>All property fixtures are running smoothly.</p>
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
                <th>Tenant</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
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
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{r.property?.city}</p>
                  </td>
                  <td>
                    <p style={{ fontWeight: 600, fontSize: '0.85rem' }}>{r.tenant?.name}</p>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{r.tenant?.phone}</p>
                  </td>
                  <td>
                    <Badge status={r.status} />
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <button
                      onClick={() => handleOpenUpdateModal(r)}
                      className="btn btn-primary btn-sm"
                    >
                      Update Status
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Ticket Update Modal */}
      {selectedTicket && (
        <Modal
          isOpen={!!selectedTicket}
          onClose={() => setSelectedTicket(null)}
          title={`Update Maintenance Ticket #${selectedTicket.ticketNumber}`}
          maxWidth="600px"
          footer={
            <>
              <button
                type="button"
                onClick={() => setSelectedTicket(null)}
                className="btn btn-secondary btn-sm"
                disabled={saving}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleUpdateTicketSubmit}
                className="btn btn-primary btn-sm"
                disabled={saving}
              >
                {saving ? 'Updating...' : 'Save Ticket Status'}
              </button>
            </>
          }
        >
          <form onSubmit={handleUpdateTicketSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Tenant Issue Description</span>
              <p style={{ fontWeight: 700, fontSize: '1rem', marginTop: '0.2rem' }}>{selectedTicket.title}</p>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginTop: '0.35rem', lineHeight: 1.5 }}>
                {selectedTicket.description}
              </p>
            </div>

            <div className="form-group">
              <label className="form-label">Update Ticket Status</label>
              <select
                className="form-select"
                value={ticketStatus}
                onChange={(e) => setTicketStatus(e.target.value)}
              >
                <option value="Submitted">Submitted (Pending)</option>
                <option value="Acknowledged">Acknowledged</option>
                <option value="In Progress">In Progress / Technician Scheduled</option>
                <option value="Resolved">Resolved (Work Completed)</option>
                <option value="Closed">Closed</option>
              </select>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Estimated Repair Cost (₹)</label>
                <input
                  type="number"
                  className="form-input"
                  value={estimatedCost}
                  onChange={(e) => setEstimatedCost(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Actual Incurred Cost (₹)</label>
                <input
                  type="number"
                  className="form-input"
                  value={actualCost}
                  onChange={(e) => setActualCost(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Owner Note / Action Taken for Tenant</label>
              <textarea
                className="form-textarea"
                placeholder="e.g. Plumber scheduled for tomorrow 11 AM; repair completed and tested..."
                rows={3}
                value={ownerNotes}
                onChange={(e) => setOwnerNotes(e.target.value)}
              />
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default OwnerMaintenance;
