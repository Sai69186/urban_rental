import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { ScrollText, Search, Shield, Clock } from 'lucide-react';

const AuditLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionSearch, setActionSearch] = useState('');
  const [entityFilter, setEntityFilter] = useState('All');

  const fetchAuditLogs = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (actionSearch) params.append('action', actionSearch);
      if (entityFilter !== 'All') params.append('entity', entityFilter);

      const res = await api.get(`/admin/audit-logs?${params.toString()}`);
      if (res.data.success) {
        setLogs(res.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch audit logs:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAuditLogs();
  }, [entityFilter]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div className="card" style={{ padding: '1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>System Audit Trail & Compliance Log</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
              Immutable timeline of administrative, financial, and lease actions
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {['All', 'Property', 'Application', 'Agreement', 'Payment', 'User', 'Complaint'].map((ent) => (
              <button
                key={ent}
                onClick={() => setEntityFilter(ent)}
                className={`btn btn-sm ${entityFilter === ent ? 'btn-primary' : 'btn-outline'}`}
              >
                {ent}
              </button>
            ))}
          </div>
        </div>
      </div>

      {loading ? (
        <LoadingSpinner text="Querying audit records..." />
      ) : logs.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3.5rem' }}>
          <ScrollText size={42} color="var(--primary-light)" style={{ opacity: 0.4, margin: '0 auto 0.75rem' }} />
          <p style={{ color: 'var(--text-secondary)' }}>No audit events found.</p>
        </div>
      ) : (
        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Action Identifier</th>
                <th>Actor (User)</th>
                <th>Entity Affected</th>
                <th>Description</th>
                <th>Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log._id}>
                  <td>
                    <span className="badge badge-primary" style={{ fontFamily: 'monospace', fontSize: '0.75rem' }}>
                      {log.action}
                    </span>
                  </td>
                  <td>
                    <p style={{ fontWeight: 600, fontSize: '0.85rem' }}>{log.userName}</p>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                      {log.userRole}
                    </span>
                  </td>
                  <td>
                    <span className="badge badge-secondary">{log.entity}</span>
                  </td>
                  <td>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                      {log.description}
                    </p>
                  </td>
                  <td>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                      {new Date(log.createdAt).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
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

export default AuditLogs;
