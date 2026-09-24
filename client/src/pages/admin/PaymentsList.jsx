import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Badge from '../../components/common/Badge';
import { CreditCard, ArrowDownLeft, ShieldCheck, CheckCircle2 } from 'lucide-react';

const PaymentsList = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        setLoading(true);
        const res = await api.get('/payments');
        if (res.data.success) {
          setPayments(res.data.data);
        }
      } catch (error) {
        console.error('Failed to load payments ledger:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPayments();
  }, []);

  const totalAmount = payments.reduce((acc, p) => acc + (p.amount || 0), 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div className="card" style={{ padding: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Platform Financial & Payments Ledger</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
            Verified rental transactions, receipts, and settlements
          </p>
        </div>
        <div style={{ background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '0.5rem 1rem', borderRadius: 'var(--radius-md)' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Total Volume Processed</span>
          <p style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--success)' }}>₹{totalAmount.toLocaleString()}</p>
        </div>
      </div>

      {loading ? (
        <LoadingSpinner text="Fetching financial records..." />
      ) : payments.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3.5rem' }}>
          <CreditCard size={42} color="var(--primary-light)" style={{ opacity: 0.4, margin: '0 auto 0.75rem' }} />
          <p style={{ color: 'var(--text-secondary)' }}>No transactions recorded.</p>
        </div>
      ) : (
        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Txn Reference</th>
                <th>Paid By (Tenant)</th>
                <th>Property</th>
                <th>Amount</th>
                <th>Payment Method</th>
                <th>Status</th>
                <th>Date & Time</th>
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
                    <p style={{ fontWeight: 600, fontSize: '0.9rem' }}>{p.tenant?.name}</p>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{p.tenant?.phone}</p>
                  </td>
                  <td>
                    <p style={{ fontWeight: 600, fontSize: '0.85rem' }}>{p.property?.title}</p>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{p.property?.city}</p>
                  </td>
                  <td>
                    <span style={{ fontWeight: 800, color: 'var(--success)', fontSize: '0.95rem' }}>
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
  );
};

export default PaymentsList;
