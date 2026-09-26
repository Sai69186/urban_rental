import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import Button from '../../components/common/Button';
import RealisticPaymentGateway from '../../components/payment/RealisticPaymentGateway';
import { CreditCard, CheckCircle2, QrCode, ShieldCheck, AlertCircle, ArrowDownLeft, Lock, Receipt } from 'lucide-react';

const RentPay = () => {
  const [rents, setRents] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Pay Modal & Gateway
  const [payModalOpen, setPayModalOpen] = useState(false);
  const [selectedRent, setSelectedRent] = useState(null);

  const fetchRentData = async () => {
    try {
      setLoading(true);
      const [rentsRes, payRes] = await Promise.all([
        api.get('/rents'),
        api.get('/payments'),
      ]);

      if (rentsRes.data.success) setRents(rentsRes.data.data);
      if (payRes.data.success) setPayments(payRes.data.data);
    } catch (error) {
      console.error('Failed to load rent records:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRentData();
  }, []);

  const handleOpenPayModal = (rent) => {
    setSelectedRent(rent);
    setPayModalOpen(true);
  };

  const handleGatewayPaymentSettlement = async (payload) => {
    const res = await api.post('/payments', payload);
    if (res.data.success) {
      fetchRentData();
    }
    return res.data;
  };

  const pendingDues = rents.filter((r) => r.status === 'pending' || r.status === 'overdue');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Top Pending Invoices Card */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Outstanding Monthly Rent Invoices</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
              Pending invoices scheduled for settlement
            </p>
          </div>
          {pendingDues.length > 0 && (
            <span className="badge badge-warning" style={{ fontSize: '0.8rem' }}>
              {pendingDues.length} Bill(s) Awaiting Payment
            </span>
          )}
        </div>

        {loading ? (
          <LoadingSpinner text="Checking pending dues..." />
        ) : pendingDues.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2.5rem 1rem', background: 'rgba(16, 185, 129, 0.08)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
            <CheckCircle2 size={36} color="var(--success)" style={{ margin: '0 auto 0.5rem' }} />
            <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--success)' }}>All Rent Dues Settled!</h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
              You have zero outstanding rent invoices at this time.
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {pendingDues.map((due) => (
              <div
                key={due._id}
                style={{
                  background: 'rgba(15, 23, 42, 0.7)',
                  border: due.status === 'overdue' ? '1px solid var(--danger)' : '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                  padding: '1.25rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '1rem',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <h4 style={{ fontSize: '1.1rem', fontWeight: 800 }}>{due.month} {due.year} Rent</h4>
                    <Badge status={due.status} />
                  </div>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '0.2rem' }}>
                    {due.property?.title} | Due Date: {new Date(due.dueDate).toLocaleDateString()}
                  </p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '1.4rem', fontWeight: 800, color: '#ffffff' }}>
                      ₹{(due.amount + (due.lateFee || 0)).toLocaleString()}
                    </span>
                    {due.lateFee > 0 && (
                      <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--danger)' }}>
                        Includes ₹{due.lateFee} Late Fee
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => handleOpenPayModal(due)}
                    className="btn btn-primary"
                  >
                    <CreditCard size={16} /> Pay Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Payment History & Receipts */}
      <div className="card">
        <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '1.25rem' }}>
          Payment History & Transaction Receipts
        </h3>

        {loading ? (
          <LoadingSpinner text="Loading receipts..." />
        ) : payments.length === 0 ? (
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>No payment receipts on record.</p>
        ) : (
          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Txn Reference</th>
                  <th>Property</th>
                  <th>Amount Paid</th>
                  <th>Payment Method</th>
                  <th>Status</th>
                  <th>Settled Date</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((p) => (
                  <tr key={p._id}>
                    <td>
                      <span style={{ fontWeight: 700, color: 'var(--primary-light)', fontSize: '0.85rem' }}>
                        {p.transactionReference}
                      </span>
                    </td>
                    <td>
                      <p style={{ fontWeight: 600, fontSize: '0.85rem' }}>{p.property?.title}</p>
                    </td>
                    <td>
                      <span style={{ fontWeight: 800, color: 'var(--success)' }}>
                        ₹{p.amount?.toLocaleString()}
                      </span>
                    </td>
                    <td>
                      <span className="badge badge-info">{p.paymentMethod}</span>
                    </td>
                    <td>
                      <Badge status={p.status} />
                    </td>
                    <td>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        {new Date(p.paymentDate).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* High-Fidelity Realistic Payment Gateway Overlay */}
      {selectedRent && payModalOpen && (
        <div
          className="modal-overlay"
          onClick={() => setPayModalOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(3, 5, 8, 0.85)',
            backdropFilter: 'blur(12px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '1rem'
          }}
        >
          <div onClick={(e) => e.stopPropagation()} style={{ width: '100%', maxWidth: '820px' }}>
            <RealisticPaymentGateway
              rentItem={selectedRent}
              onClose={() => {
                setPayModalOpen(false);
                setSelectedRent(null);
              }}
              onPaymentSuccess={handleGatewayPaymentSettlement}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default RentPay;
