import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Badge from '../../components/common/Badge';
import PrintAgreementModal from '../../components/agreement/PrintAgreementModal';
import { FileCheck, Printer, CheckCircle2, ShieldCheck, PenTool } from 'lucide-react';

const TenantAgreement = () => {
  const [agreements, setAgreements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAgreement, setSelectedAgreement] = useState(null);
  const [signingId, setSigningId] = useState(null);

  const fetchAgreements = async () => {
    try {
      setLoading(true);
      const res = await api.get('/agreements');
      if (res.data.success) {
        setAgreements(res.data.data);
      }
    } catch (error) {
      console.error('Failed to load tenant agreements:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAgreements();
  }, []);

  const handleSignAgreement = async (agrId) => {
    try {
      setSigningId(agrId);
      const res = await api.patch(`/agreements/${agrId}/sign`);
      if (res.data.success) {
        setAgreements((prev) =>
          prev.map((a) => (a._id === agrId ? res.data.data : a))
        );
        alert('Lease Agreement Digitally Counter-Signed!');
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to sign agreement');
    } finally {
      setSigningId(null);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div className="card" style={{ padding: '1.25rem' }}>
        <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>My Tenancy Lease Agreements</h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
          Access your legally-sound digital lease contracts, review terms, and download printable PDF records
        </p>
      </div>

      {loading ? (
        <LoadingSpinner text="Loading your agreements..." />
      ) : agreements.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3.5rem' }}>
          <FileCheck size={42} color="var(--primary-light)" style={{ opacity: 0.4, margin: '0 auto 0.75rem' }} />
          <p style={{ color: 'var(--text-secondary)' }}>No rental agreements active or issued yet.</p>
        </div>
      ) : (
        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Agreement #</th>
                <th>Property</th>
                <th>Landlord</th>
                <th>Monthly Rent</th>
                <th>Duration</th>
                <th>Tenant Signature</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
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
                    <p style={{ fontWeight: 600, fontSize: '0.9rem' }}>{agr.property?.title}</p>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{agr.property?.city}</p>
                  </td>
                  <td>
                    <p style={{ fontWeight: 600, fontSize: '0.85rem' }}>{agr.owner?.name}</p>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{agr.owner?.phone}</p>
                  </td>
                  <td>
                    <span style={{ fontWeight: 700, color: 'var(--success)' }}>
                      ₹{agr.monthlyRent?.toLocaleString()}/mo
                    </span>
                  </td>
                  <td>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      {new Date(agr.startDate).toLocaleDateString()} to {new Date(agr.endDate).toLocaleDateString()}
                    </span>
                  </td>
                  <td>
                    {agr.tenantSignature?.signed ? (
                      <span className="badge badge-success" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                        <CheckCircle2 size={12} /> Signed
                      </span>
                    ) : (
                      <button
                        onClick={() => handleSignAgreement(agr._id)}
                        disabled={signingId === agr._id}
                        className="btn btn-warning btn-sm"
                        style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}
                      >
                        <PenTool size={12} /> Counter-Sign
                      </button>
                    )}
                  </td>
                  <td>
                    <Badge status={agr.status} />
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <button
                      onClick={() => setSelectedAgreement(agr)}
                      className="btn btn-primary btn-sm"
                      title="View & Download Printable PDF"
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

      {/* Print / View Modal */}
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

export default TenantAgreement;
