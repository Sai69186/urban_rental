import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Badge from '../../components/common/Badge';
import { Wrench, AlertTriangle, CheckCircle2, Clock } from 'lucide-react';

const MaintenanceList = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMaintenance = async () => {
      try {
        setLoading(true);
        const res = await api.get('/maintenance');
        if (res.data.success) {
          setRequests(res.data.data);
        }
      } catch (error) {
        console.error('Failed to load maintenance requests:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchMaintenance();
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div className="card" style={{ padding: '1.25rem' }}>
        <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Platform Maintenance & Repair Oversight</h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
          Monitoring all tenant-reported service tickets and resolutions across properties
        </p>
      </div>

      {loading ? (
        <LoadingSpinner text="Fetching maintenance tickets..." />
      ) : requests.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3.5rem' }}>
          <Wrench size={42} color="var(--primary-light)" style={{ opacity: 0.4, margin: '0 auto 0.75rem' }} />
          <p style={{ color: 'var(--text-secondary)' }}>No maintenance tickets recorded.</p>
        </div>
      ) : (
        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Ticket #</th>
                <th>Issue / Category</th>
                <th>Property</th>
                <th>Priority</th>
                <th>Tenant</th>
                <th>Status</th>
                <th>Reported On</th>
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
                    <p style={{ fontWeight: 700, fontSize: '0.9rem' }}>{r.title}</p>
                    <span className="badge badge-info" style={{ fontSize: '0.65rem' }}>{r.category}</span>
                  </td>
                  <td>
                    <p style={{ fontWeight: 600, fontSize: '0.85rem' }}>{r.property?.title}</p>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{r.property?.city}</p>
                  </td>
                  <td>
                    <Badge status={r.priority} />
                  </td>
                  <td>
                    <p style={{ fontWeight: 600, fontSize: '0.85rem' }}>{r.tenant?.name}</p>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{r.tenant?.phone}</p>
                  </td>
                  <td>
                    <Badge status={r.status} />
                  </td>
                  <td>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      {new Date(r.createdAt).toLocaleDateString()}
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

export default MaintenanceList;
