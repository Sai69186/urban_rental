import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import { Building2, Check, X, Eye, MapPin, DollarSign, Bed, Bath, Maximize2 } from 'lucide-react';

const PropertyApprovals = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('pending'); // default pending approvals
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [actionModal, setActionModal] = useState(null); // 'approve' | 'reject' | 'view'
  const [rejectionReason, setRejectionReason] = useState('');
  const [processing, setProcessing] = useState(false);

  const fetchAdminProperties = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filterStatus !== 'All') params.append('approvalStatus', filterStatus);

      const res = await api.get(`/admin/properties?${params.toString()}`);
      if (res.data.success) {
        setProperties(res.data.data);
      }
    } catch (error) {
      console.error('Failed to load admin properties:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminProperties();
  }, [filterStatus]);

  const handleApprovalSubmit = async (approvalStatus) => {
    if (!selectedProperty) return;
    try {
      setProcessing(true);
      const res = await api.patch(`/admin/properties/${selectedProperty._id}/approval`, {
        approvalStatus,
        rejectionReason: approvalStatus === 'rejected' ? rejectionReason : '',
      });

      if (res.data.success) {
        setProperties((prev) =>
          prev.map((p) => (p._id === selectedProperty._id ? res.data.data : p))
        );
        setActionModal(null);
        setSelectedProperty(null);
        setRejectionReason('');
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to update property status');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Filter Tabs */}
      <div className="card" style={{ padding: '1rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginRight: '0.5rem' }}>
            Listing Status:
          </span>
          {['pending', 'approved', 'rejected', 'All'].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`btn btn-sm ${filterStatus === st ? 'btn-primary' : 'btn-outline'}`}
              style={{ textTransform: 'capitalize' }}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Properties Table */}
      {loading ? (
        <LoadingSpinner text="Loading property listings..." />
      ) : properties.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3.5rem' }}>
          <Building2 size={42} color="var(--primary-light)" style={{ opacity: 0.4, margin: '0 auto 0.75rem' }} />
          <h3 style={{ fontSize: '1.25rem' }}>No {filterStatus} properties</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            All listings in this category have been processed.
          </p>
        </div>
      ) : (
        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Property</th>
                <th>Owner</th>
                <th>Rent / Deposit</th>
                <th>Approval</th>
                <th>Availability</th>
                <th>Listed Date</th>
                <th style={{ textAlign: 'right' }}>Review Actions</th>
              </tr>
            </thead>
            <tbody>
              {properties.map((p) => (
                <tr key={p._id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <img
                        src={p.images?.[0] || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=150&q=80'}
                        alt={p.title}
                        style={{ width: '56px', height: '42px', borderRadius: 'var(--radius-sm)', objectFit: 'cover' }}
                      />
                      <div>
                        <p style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.9rem' }}>{p.title}</p>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          {p.city}, {p.state} | {p.propertyType}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td>
                    <p style={{ fontWeight: 600, fontSize: '0.85rem' }}>{p.owner?.name}</p>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{p.owner?.email}</p>
                  </td>
                  <td>
                    <p style={{ fontWeight: 700, color: 'var(--text-primary)' }}>₹{p.rent?.toLocaleString()}/mo</p>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Dep: ₹{p.securityDeposit?.toLocaleString()}</p>
                  </td>
                  <td>
                    <Badge status={p.approvalStatus} />
                  </td>
                  <td>
                    <Badge status={p.availabilityStatus} />
                  </td>
                  <td>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      {new Date(p.createdAt).toLocaleDateString()}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'flex-end' }}>
                      <button
                        onClick={() => {
                          setSelectedProperty(p);
                          setActionModal('view');
                        }}
                        className="btn btn-outline btn-sm"
                        title="View Full Details"
                      >
                        <Eye size={14} /> View
                      </button>

                      {p.approvalStatus !== 'approved' && (
                        <button
                          onClick={() => {
                            setSelectedProperty(p);
                            setActionModal('approve');
                          }}
                          className="btn btn-success btn-sm"
                          title="Approve Listing"
                        >
                          <Check size={14} /> Approve
                        </button>
                      )}

                      {p.approvalStatus !== 'rejected' && (
                        <button
                          onClick={() => {
                            setSelectedProperty(p);
                            setActionModal('reject');
                          }}
                          className="btn btn-danger btn-sm"
                          title="Reject Listing"
                        >
                          <X size={14} /> Reject
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

      {/* Review / View Modal */}
      {selectedProperty && (
        <Modal
          isOpen={!!actionModal}
          onClose={() => {
            setActionModal(null);
            setSelectedProperty(null);
          }}
          title={
            actionModal === 'approve'
              ? `Approve Listing: ${selectedProperty.title}`
              : actionModal === 'reject'
              ? `Reject Listing: ${selectedProperty.title}`
              : `Property Details: ${selectedProperty.title}`
          }
          maxWidth="680px"
          footer={
            <>
              <button
                type="button"
                onClick={() => setActionModal(null)}
                className="btn btn-secondary btn-sm"
              >
                Close
              </button>
              {actionModal === 'approve' && (
                <button
                  type="button"
                  onClick={() => handleApprovalSubmit('approved')}
                  disabled={processing}
                  className="btn btn-success btn-sm"
                >
                  {processing ? 'Approving...' : 'Confirm Approval'}
                </button>
              )}
              {actionModal === 'reject' && (
                <button
                  type="button"
                  onClick={() => handleApprovalSubmit('rejected')}
                  disabled={processing || !rejectionReason}
                  className="btn btn-danger btn-sm"
                >
                  {processing ? 'Rejecting...' : 'Confirm Rejection'}
                </button>
              )}
            </>
          }
        >
          {actionModal === 'reject' ? (
            <div className="form-group">
              <label className="form-label">Reason for Rejection *</label>
              <textarea
                className="form-textarea"
                placeholder="Specify what needs correction (e.g. invalid address, unclear photos, pricing anomaly)..."
                required
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
              />
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', background: 'rgba(15, 23, 42, 0.6)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Type</span>
                  <p style={{ fontWeight: 700 }}>{selectedProperty.propertyType}</p>
                </div>
                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Monthly Rent</span>
                  <p style={{ fontWeight: 700, color: 'var(--success)' }}>₹{selectedProperty.rent?.toLocaleString()}</p>
                </div>
                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Deposit</span>
                  <p style={{ fontWeight: 700 }}>₹{selectedProperty.securityDeposit?.toLocaleString()}</p>
                </div>
              </div>

              <div>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Location</span>
                <p style={{ fontWeight: 600 }}>{selectedProperty.address}, {selectedProperty.city}, {selectedProperty.state} - {selectedProperty.pincode}</p>
              </div>

              <div>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Description</span>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6, whiteSpace: 'pre-line' }}>{selectedProperty.description}</p>
              </div>

              {selectedProperty.amenities && selectedProperty.amenities.length > 0 && (
                <div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Amenities</span>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginTop: '0.35rem' }}>
                    {selectedProperty.amenities.map((a, i) => (
                      <span key={i} className="badge badge-primary">{a}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </Modal>
      )}
    </div>
  );
};

export default PropertyApprovals;
