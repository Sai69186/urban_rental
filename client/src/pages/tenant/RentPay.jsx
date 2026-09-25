import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import Button from '../../components/common/Button';
import { CreditCard, CheckCircle2, QrCode, ShieldCheck, AlertCircle, ArrowDownLeft, Lock } from 'lucide-react';

const RentPay = () => {
  const [rents, setRents] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Pay Modal
  const [payModalOpen, setPayModalOpen] = useState(false);
  const [selectedRent, setSelectedRent] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [processingPay, setProcessingPay] = useState(false);
  const [paySuccess, setPaySuccess] = useState(false);

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
    setPaySuccess(false);
    setPayModalOpen(true);
  };

  const handleSimulatePayment = async (e) => {
    e.preventDefault();
    if (!selectedRent) return;

    try {
      setProcessingPay(true);
      const res = await api.post('/payments', {
        rentId: selectedRent._id,
        agreementId: selectedRent.agreement?._id || selectedRent.agreement,
        amount: selectedRent.amount + (selectedRent.lateFee || 0),
        paymentMethod,
        transactionReference: `UPI-${Date.now().toString().slice(-8)}`,
        notes: `Simulated secure rent payment for ${selectedRent.month} ${selectedRent.year}`,
      });

      if (res.data.success) {
        setPaySuccess(true);
        setTimeout(() => {
          setPayModalOpen(false);
          setPaySuccess(false);
          setSelectedRent(null);
          fetchRentData();
        }, 2000);
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Payment simulation failed');
    } finally {
      setProcessingPay(false);
    }
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

      {/* Simulated Payment Portal Modal */}
      {selectedRent && (
        <Modal
          isOpen={payModalOpen}
          onClose={() => setPayModalOpen(false)}
          title={`Pay Rent for ${selectedRent.month} ${selectedRent.year}`}
          maxWidth="520px"
          footer={
            !paySuccess && (
              <>
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => setPayModalOpen(false)}
                  disabled={processingPay}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  variant="primary"
                  size="sm"
                  onClick={handleSimulatePayment}
                  loading={processingPay}
                  loadingText="Authorizing Payment..."
                >
                  Authorize ₹{(selectedRent.amount + (selectedRent.lateFee || 0)).toLocaleString()}
                </Button>
              </>
            )
          }
        >
          {paySuccess ? (
            <div style={{ textAlign: 'center', padding: '2.5rem 1rem' }}>
              <CheckCircle2 size={54} color="var(--success)" style={{ margin: '0 auto 1rem' }} />
              <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--success)' }}>Payment Successful!</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.5rem' }}>
                ₹{(selectedRent.amount + (selectedRent.lateFee || 0)).toLocaleString()} settled to landlord. Transaction receipt generated.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSimulatePayment} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {/* Payment Summary Box */}
              <div
                style={{
                  background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.2), rgba(16, 185, 129, 0.15))',
                  border: '1px solid var(--border-color)',
                  padding: '1.25rem',
                  borderRadius: 'var(--radius-md)',
                  textAlign: 'center',
                }}
              >
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Total Amount Due</span>
                <h3 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#ffffff', marginTop: '0.2rem' }}>
                  ₹{(selectedRent.amount + (selectedRent.lateFee || 0)).toLocaleString()}
                </h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  {selectedRent.property?.title} ({selectedRent.month} {selectedRent.year})
                </p>
              </div>

              {/* Payment Method Selector */}
              <div className="form-group">
                <label className="form-label">Select Payment Gateway / Method</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.65rem' }}>
                  {['UPI', 'Card', 'Bank Transfer'].map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setPaymentMethod(m)}
                      className={`btn btn-sm ${paymentMethod === m ? 'btn-primary' : 'btn-outline'}`}
                      style={{ padding: '0.65rem 0.2rem', fontSize: '0.85rem' }}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              {paymentMethod === 'UPI' && (
                <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '1rem', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
                  <QrCode size={36} color="var(--primary-light)" style={{ margin: '0 auto 0.5rem' }} />
                  <p style={{ fontSize: '0.85rem', fontWeight: 600 }}>Simulated Instant UPI Gateway</p>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Clicking Authorize simulates instant bank reconciliation</span>
                </div>
              )}

              {paymentMethod === 'Card' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <input type="text" className="form-input" placeholder="4111 2222 3333 4444 (Card Number)" defaultValue="4111 •••• •••• 4242" />
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                    <input type="text" className="form-input" placeholder="MM/YY" defaultValue="12/28" />
                    <input type="password" className="form-input" placeholder="CVV" defaultValue="123" />
                  </div>
                </div>
              )}

              {paymentMethod === 'Bank Transfer' && (
                <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Beneficiary: UrbanNest Escrow Account</p>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>IFSC: HDFC0001234</p>
                </div>
              )}

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', justifyContent: 'center', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                <Lock size={12} color="var(--success)" /> 256-Bit SSL Encrypted Payment Simulation
              </div>
            </form>
          )}
        </Modal>
      )}
    </div>
  );
};

export default RentPay;
