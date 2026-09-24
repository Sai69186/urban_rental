import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Badge from '../../components/common/Badge';
import { FileText, Eye, AlertCircle, XCircle } from 'lucide-react';

const MyApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const res = await api.get('/applications/my-applications');
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

  const handleWithdraw = async (appId) => {
    if (!window.confirm('Are you sure you want to withdraw this rental application?')) return;
    try {
      setActionLoading(appId);
      const res = await api.patch(`/applications/${appId}/withdraw`);
      if (res.data.success) {
        setApplications((prev) =>
          prev.map((a) => (a._id === appId ? { ...a, status: 'withdrawn' } : a))
        );
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to withdraw application');
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div className="card" style={{ padding: '1.25rem' }}>
        <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>My Rental Applications</h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
          Track application review progress, landlord approval decisions, and issued agreements
        </p>
      </div>

      {loading ? (
        <LoadingSpinner text="Loading applications..." />
      ) : applications.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <FileText size={48} color="var(--primary-light)" style={{ opacity: 0.4, margin: '0 auto 1rem' }} />
          <h3 style={{ fontSize: '1.3rem', marginBottom: '0.5rem' }}>No active applications</h3>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '450px', margin: '0 auto 1.5rem' }}>
            Explore our curated rental listings and apply to your preferred apartment or villa.
          </p>
          <Link to="/explore" className="btn btn-primary">
            Explore Properties
          </Link>
        </div>
      ) : (
        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Property</th>
                <th>Landlord</th>
                <th>Move-In Date</th>
                <th>Declared Income</th>
                <th>Status</th>
                <th>Owner Remarks</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((app) => (
                <tr key={app._id}>
                  <td>
                    <p style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.9rem' }}>
                      {app.property?.title}
                    </p>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {app.property?.address}, {app.property?.city}
                    </p>
                  </td>
                  <td>
                    <p style={{ fontWeight: 600, fontSize: '0.85rem' }}>{app.owner?.name}</p>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{app.owner?.phone}</p>
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
                  <td>
                    <Badge status={app.status} />
                  </td>
                  <td>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      {app.ownerNotes || '—'}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'flex-end' }}>
                      {app.status === 'approved' && (
                        <Link to="/tenant/agreement" className="btn btn-primary btn-sm">
                          View Agreement
                        </Link>
                      )}
                      {(app.status === 'pending' || app.status === 'under_review') && (
                        <button
                          onClick={() => handleWithdraw(app._id)}
                          disabled={actionLoading === app._id}
                          className="btn btn-outline btn-sm"
                          style={{ color: 'var(--danger)' }}
                        >
                          Withdraw
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
    </div>
  );
};

export default MyApplications;
