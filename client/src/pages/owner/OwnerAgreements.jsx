import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Badge from '../../components/common/Badge';
import PrintAgreementModal from '../../components/agreement/PrintAgreementModal';
import { FileCheck, Printer, Eye, User } from 'lucide-react';

const OwnerAgreements = () => {
  const [agreements, setAgreements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAgreement, setSelectedAgreement] = useState(null);

  useEffect(() => {
    const fetchAgreements = async () => {
      try {
        setLoading(true);
        const res = await api.get('/agreements');
        if (res.data.success) {
          setAgreements(res.data.data);
        }
      } catch (error) {
        console.error('Failed to load owner agreements:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAgreements();
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div className="card" style={{ padding: '1.25rem' }}>
        <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Active Tenancy Lease Agreements</h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
          Signed residential contracts and digital agreement templates with your active tenants
        </p>
      </div>

      {loading ? (
        <LoadingSpinner text="Loading agreements..." />
      ) : agreements.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3.5rem' }}>
          <FileCheck size={42} color="var(--primary-light)" style={{ opacity: 0.4, margin: '0 auto 0.75rem' }} />
          <p style={{ color: 'var(--text-secondary)' }}>No active lease agreements generated yet.</p>
        </div>
      ) : (
        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Agreement #</th>
                <th>Tenant Name</th>
                <th>Property</th>
                <th>Monthly Rent</th>
                <th>Deposit</th>
                <th>Term Duration</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Document</th>
              </tr>
            </thead>
            <tbody>
              {agreements.map((agr) => (
                <tr key={agr._id}>
                  <td>
                    <span style={{ fontWeight: 800, color: 'var(--primary-light)', fontSize: '0.85rem' }}>
                      {agr.agreementNumber}
                    </span>
                  </td>
                  <td>
                    <p style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.9rem' }}>{agr.tenant?.name}</p>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{agr.tenant?.phone}</p>
                  </td>
                  <td>
                    <p style={{ fontWeight: 600, fontSize: '0.85rem' }}>{agr.property?.title}</p>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{agr.property?.city}</p>
                  </td>
                  <td>
                    <span style={{ fontWeight: 700, color: 'var(--success)' }}>
                      ₹{agr.monthlyRent?.toLocaleString()}/mo
                    </span>
                  </td>
                  <td>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                      ₹{agr.securityDeposit?.toLocaleString()}
                    </span>
                  </td>
                  <td>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      {new Date(agr.startDate).toLocaleDateString()} to {new Date(agr.endDate).toLocaleDateString()}
                    </span>
                  </td>
                  <td>
                    <Badge status={agr.status} />
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <button
                      onClick={() => setSelectedAgreement(agr)}
                      className="btn btn-primary btn-sm"
                      title="View & Print Lease PDF"
                    >
                      <Printer size={14} /> View / Print PDF
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Print PDF Modal */}
      {selectedAgreement && (
        <PrintAgreementModal
          isOpen={!!selectedAgreement}
          onClose={() => setSelectedAgreement(null)}
          agreement={selectedAgreement}
        />
      )}
    </div>
  );
};

export default OwnerAgreements;
