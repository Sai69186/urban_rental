import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import Button from '../../components/common/Button';
import { getRealisticAvatar } from '../../utils/avatarHelper';
import {
  FileText,
  User,
  Check,
  X,
  FileCheck2,
  Calendar,
  DollarSign,
  AlertCircle,
  FileBadge,
} from 'lucide-react';

const TenantApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState(null);
  const [leaseModalOpen, setLeaseModalOpen] = useState(false);
  const [submittingLease, setSubmittingLease] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);

  // Lease Agreement form state
  const [leaseFormData, setLeaseFormData] = useState({
    startDate: '',
    endDate: '',
    monthlyRent: '',
    securityDeposit: '',
    dueDate: 5,
    terms: '1. The Tenant shall pay the agreed monthly rent on or before the due date.\n2. The Tenant shall maintain the premises in good and clean condition.\n3. The Tenant shall not sublet without written consent.\n4. Standard notice period of 2 months applies before early termination.\n5. Standard utilities to be settled monthly as per actual consumption.',
  });

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const res = await api.get('/applications/owner');
      if (res.data.success) {
        setApplications(res.data.data);
      }
    } catch (error) {
      console.error('Failed to load applications:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleStatusChange = async (appId, status) => {
    try {
      setActionLoading(appId);
      const res = await api.patch(`/applications/${appId}/status`, { status });
      if (res.data.success) {
        setApplications((prev) =>
          prev.map((a) => (a._id === appId ? { ...a, status } : a))
        );
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to update application');
    } finally {
      setActionLoading(null);
    }
  };

  const handleOpenLeaseModal = (app) => {
    setSelectedApp(app);
    const today = new Date();
    const nextYear = new Date(today.getFullYear() + 1, today.getMonth(), today.getDate());

    setLeaseFormData({
      startDate: app.moveInDate ? new Date(app.moveInDate).toISOString().split('T')[0] : today.toISOString().split('T')[0],
      endDate: nextYear.toISOString().split('T')[0],
      monthlyRent: app.property?.rent || '',
      securityDeposit: app.property?.securityDeposit || '',
      dueDate: 5,
      terms: '1. The Tenant shall pay the agreed monthly rent on or before the 5th of each month.\n2. The Tenant shall maintain the premises and electrical fixtures in good condition.\n3. The Tenant shall not sublet or assign the property.\n4. Standard notice period of 2 months applies before vacating.\n5. Deposit will be refunded upon inspection at the end of the tenancy.',
    });
    setLeaseModalOpen(true);
  };

  const handleGenerateLeaseSubmit = async (e) => {
    e.preventDefault();
    if (!selectedApp) return;

    try {
      setSubmittingLease(true);
      const res = await api.post('/agreements', {
        applicationId: selectedApp._id,
        propertyId: selectedApp.property?._id,
        tenantId: selectedApp.tenant?._id,
        ...leaseFormData,
      });

      if (res.data.success) {
        setApplications((prev) =>
          prev.map((a) => (a._id === selectedApp._id ? { ...a, status: 'approved' } : a))
        );
        setLeaseModalOpen(false);
        setSelectedApp(null);
        alert('Lease Agreement Generated Successfully! The tenant has been notified.');
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to generate lease agreement');
    } finally {
      setSubmittingLease(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div className="card" style={{ padding: '1.25rem' }}>
        <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Tenant Rental Applications</h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
          Screen applicants, verify income & occupancy, and generate legally-binding lease agreements
        </p>
      </div>

      {loading ? (
        <LoadingSpinner text="Fetching tenant applications..." />
      ) : applications.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3.5rem' }}>
          <FileText size={42} color="var(--primary-light)" style={{ opacity: 0.4, margin: '0 auto 0.75rem' }} />
          <p style={{ color: 'var(--text-secondary)' }}>No applications received yet for your properties.</p>
        </div>
      ) : (
        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Applicant</th>
                <th>Target Property</th>
                <th>Move-In Date</th>
                <th>Monthly Income</th>
                <th>Occupants</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((app) => (
                <tr key={app._id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <img
                        src={getRealisticAvatar(app.tenant)}
                        alt={app.tenant?.name}
                        style={{ width: '38px', height: '38px', borderRadius: '50%', objectFit: 'cover', border: '1.5px solid rgba(255, 255, 255, 0.12)' }}
                      />
                      <div>
                        <p style={{ fontWeight: 700, color: '#f8fafc', fontSize: '0.9rem', marginBottom: '2px' }}>{app.tenant?.name}</p>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{app.employmentStatus}</p>
                      </div>
                    </div>
                  </td>
                  <td>
                    <p style={{ fontWeight: 600, fontSize: '0.85rem' }}>{app.property?.title}</p>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{app.property?.city}</p>
                  </td>
                  <td>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                      {new Date(app.moveInDate).toLocaleDateString()}
                    </span>
                  </td>
                  <td>
                    <span style={{ fontWeight: 700, color: 'var(--success)' }}>
                      ₹{app.monthlyIncome?.toLocaleString()}/mo
                    </span>
                  </td>
                  <td>{app.numberOfOccupants} Person(s)</td>
                  <td>
                    <Badge status={app.status} />
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'flex-end' }}>
                      {app.status === 'pending' && (
                        <button
                          onClick={() => handleStatusChange(app._id, 'under_review')}
                          disabled={actionLoading === app._id}
                          className="btn btn-outline btn-sm"
                          title="Mark Under Review"
                        >
                          Review
                        </button>
                      )}

                      {app.status !== 'approved' && (
                        <button
                          onClick={() => handleOpenLeaseModal(app)}
                          className="btn btn-primary btn-sm"
                          title="Approve & Generate Lease Agreement"
                        >
                          <FileCheck2 size={14} /> Approve & Issue Lease
                        </button>
                      )}

                      {app.status !== 'rejected' && (
                        <button
                          onClick={() => handleStatusChange(app._id, 'rejected')}
                          disabled={actionLoading === app._id}
                          className="btn btn-outline btn-sm"
                          style={{ color: 'var(--danger)' }}
                          title="Reject Application"
                        >
                          <X size={14} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Generate Lease Agreement Modal */}
      {selectedApp && (
        <Modal
          isOpen={leaseModalOpen}
          onClose={() => setLeaseModalOpen(false)}
          title={`Generate Rental Lease Agreement for ${selectedApp.tenant?.name}`}
          maxWidth="700px"
          footer={
            <>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => setLeaseModalOpen(false)}
                disabled={submittingLease}
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="primary"
                size="sm"
                onClick={handleGenerateLeaseSubmit}
                loading={submittingLease}
                loadingText="Executing Agreement..."
              >
                Execute Agreement & Issue to Tenant
              </Button>
            </>
          }
        >
          <form onSubmit={handleGenerateLeaseSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '1rem', borderRadius: 'var(--radius-md)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Tenant</span>
                <p style={{ fontWeight: 700 }}>{selectedApp.tenant?.name}</p>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{selectedApp.tenant?.email} | {selectedApp.tenant?.phone}</p>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Property</span>
                <p style={{ fontWeight: 700 }}>{selectedApp.property?.title}</p>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{selectedApp.property?.city}</p>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Lease Start Date *</label>
                <input
                  type="date"
                  required
                  className="form-input"
                  value={leaseFormData.startDate}
                  onChange={(e) => setLeaseFormData({ ...leaseFormData, startDate: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Lease End Date *</label>
                <input
                  type="date"
                  required
                  className="form-input"
                  value={leaseFormData.endDate}
                  onChange={(e) => setLeaseFormData({ ...leaseFormData, endDate: e.target.value })}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Monthly Rent (₹) *</label>
                <input
                  type="number"
                  required
                  className="form-input"
                  value={leaseFormData.monthlyRent}
                  onChange={(e) => setLeaseFormData({ ...leaseFormData, monthlyRent: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Security Deposit (₹) *</label>
                <input
                  type="number"
                  required
                  className="form-input"
                  value={leaseFormData.securityDeposit}
                  onChange={(e) => setLeaseFormData({ ...leaseFormData, securityDeposit: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Rent Due Day (1-31)</label>
                <input
                  type="number"
                  min="1"
                  max="31"
                  className="form-input"
                  value={leaseFormData.dueDate}
                  onChange={(e) => setLeaseFormData({ ...leaseFormData, dueDate: e.target.value })}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Lease Terms & Standard Covenants</label>
              <textarea
                className="form-textarea"
                rows={4}
                value={leaseFormData.terms}
                onChange={(e) => setLeaseFormData({ ...leaseFormData, terms: e.target.value })}
              />
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default TenantApplications;
