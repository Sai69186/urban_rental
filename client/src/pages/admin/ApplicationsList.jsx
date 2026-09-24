import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Badge from '../../components/common/Badge';
import { FileText, User, Building2, Calendar, DollarSign } from 'lucide-react';

const ApplicationsList = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllApplications = async () => {
      try {
        setLoading(true);
        // Admin gets agreements & apps from backend
        const res = await api.get('/applications/owner'); // backend allows admin query or returns all
        if (res.data.success) {
          setApplications(res.data.data);
        }
      } catch (error) {
        console.error('Failed to load applications:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAllApplications();
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div className="card" style={{ padding: '1.25rem' }}>
        <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>All Platform Rental Applications</h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
          Real-time record of all tenant applications submitted to property owners
        </p>
      </div>

      {loading ? (
        <LoadingSpinner text="Fetching applications ledger..." />
      ) : applications.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3.5rem' }}>
          <FileText size={42} color="var(--primary-light)" style={{ opacity: 0.4, margin: '0 auto 0.75rem' }} />
          <p style={{ color: 'var(--text-secondary)' }}>No applications recorded yet.</p>
        </div>
      ) : (
        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Applicant (Tenant)</th>
                <th>Property</th>
                <th>Move-In Date</th>
                <th>Monthly Income</th>
                <th>Occupants</th>
                <th>Status</th>
                <th>Submitted</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((app) => (
                <tr key={app._id}>
                  <td>
                    <p style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{app.tenant?.name}</p>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{app.tenant?.email}</p>
                  </td>
                  <td>
                    <p style={{ fontWeight: 600, fontSize: '0.9rem' }}>{app.property?.title}</p>
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
                  <td>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      {new Date(app.createdAt).toLocaleDateString()}
                    </span>
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

export default ApplicationsList;
