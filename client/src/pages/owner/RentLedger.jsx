import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import { CreditCard, PlusCircle, CheckCircle2, AlertTriangle, ArrowDownLeft } from 'lucide-react';

const RentLedger = () => {
  const [rents, setRents] = useState([]);
  const [agreements, setAgreements] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  // Generate Invoice Modal
  const [invoiceModalOpen, setInvoiceModalOpen] = useState(false);
  const [submittingInvoice, setSubmittingInvoice] = useState(false);
  const [invoiceForm, setInvoiceForm] = useState({
    agreementId: '',
    month: 'October',
    year: 2026,
    amount: '',
    lateFee: 0,
    notes: '',
  });

  // Record Offline Payment Modal
  const [recordPaymentModalOpen, setRecordPaymentModalOpen] = useState(false);
  const [submittingPayment, setSubmittingPayment] = useState(false);
  const [selectedRentRecord, setSelectedRentRecord] = useState(null);
  const [paymentForm, setPaymentForm] = useState({
    paymentMethod: 'Cash',
    transactionReference: '',
    notes: 'Offline cash payment collected',
  });

  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  const fetchLedgerData = async () => {
    try {
      setLoading(true);
      const [rentsRes, sumRes, agrRes] = await Promise.all([
        api.get('/rents'),
        api.get('/rents/summary'),
        api.get('/agreements'),
      ]);

      if (rentsRes.data.success) setRents(rentsRes.data.data);
      if (sumRes.data.success) setSummary(sumRes.data.data);
      if (agrRes.data.success) {
        const active = agrRes.data.data.filter((a) => a.status === 'active');
        setAgreements(active);
        if (active.length > 0) {
          setInvoiceForm((prev) => ({
            ...prev,
            agreementId: active[0]._id,
            amount: active[0].monthlyRent,
          }));
        }
      }
    } catch (error) {
      console.error('Failed to load rent ledger:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLedgerData();
  }, []);

  const handleGenerateInvoice = async (e) => {
    e.preventDefault();
    try {
      setSubmittingInvoice(true);
      const res = await api.post('/rents/generate', invoiceForm);
      if (res.data.success) {
        setRents((prev) => [res.data.data, ...prev]);
        setInvoiceModalOpen(false);
        fetchLedgerData();
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to generate rent invoice');
    } finally {
      setSubmittingInvoice(false);
    }
  };

  const handleOpenRecordPayment = (rent) => {
    setSelectedRentRecord(rent);
    setPaymentForm({
      paymentMethod: 'Cash',
      transactionReference: `OFFLINE-${Date.now().toString().slice(-6)}`,
      notes: `Recorded manual payment for ${rent.month} ${rent.year}`,
    });
    setRecordPaymentModalOpen(true);
  };

  const handleRecordPaymentSubmit = async (e) => {
    e.preventDefault();
    if (!selectedRentRecord) return;

    try {
      setSubmittingPayment(true);
      const res = await api.post('/payments', {
        rentId: selectedRentRecord._id,
        agreementId: selectedRentRecord.agreement?._id || selectedRentRecord.agreement,
        amount: selectedRentRecord.amount + (selectedRentRecord.lateFee || 0),
        ...paymentForm,
      });

      if (res.data.success) {
        setRents((prev) =>
          prev.map((r) => (r._id === selectedRentRecord._id ? { ...r, status: 'paid', paidDate: new Date() } : r))
        );
        setRecordPaymentModalOpen(false);
        setSelectedRentRecord(null);
        fetchLedgerData();
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to record payment');
    } finally {
      setSubmittingPayment(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Top Header & Metrics Banner */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem' }}>
        <div className="card">
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Total Rent Billed</span>
          <p style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '0.2rem' }}>
            ₹{(summary?.totalRent || 0).toLocaleString()}
          </p>
        </div>

        <div className="card">
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Collected Rent</span>
          <p style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--success)', marginTop: '0.2rem' }}>
            ₹{(summary?.paidRent || 0).toLocaleString()}
          </p>
        </div>

        <div className="card">
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Pending Rent</span>
          <p style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--warning)', marginTop: '0.2rem' }}>
            ₹{(summary?.pendingRent || 0).toLocaleString()}
          </p>
        </div>

        <div className="card">
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Overdue Rent</span>
          <p style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--danger)', marginTop: '0.2rem' }}>
            ₹{(summary?.overdueRent || 0).toLocaleString()}
          </p>
        </div>
      </div>

      {/* Action bar */}
      <div className="card" style={{ padding: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Monthly Rent Ledger</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
            Issue invoices to tenants and record received cash, bank transfer, or online payments
          </p>
        </div>
        <button
          onClick={() => setInvoiceModalOpen(true)}
          disabled={agreements.length === 0}
          className="btn btn-primary"
        >
          <PlusCircle size={18} /> Issue Rent Invoice
        </button>
      </div>

      {/* Rent Records Table */}
      {loading ? (
        <LoadingSpinner text="Loading rent records..." />
      ) : rents.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3.5rem' }}>
          <CreditCard size={42} color="var(--primary-light)" style={{ opacity: 0.4, margin: '0 auto 0.75rem' }} />
          <p style={{ color: 'var(--text-secondary)' }}>No rent billing records created yet.</p>
        </div>
      ) : (
        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Billing Period</th>
                <th>Tenant Name</th>
                <th>Property</th>
                <th>Amount (₹)</th>
                <th>Due Date</th>
                <th>Status</th>
                <th>Payment Date</th>
                <th style={{ textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {rents.map((r) => (
                <tr key={r._id}>
                  <td>
                    <span style={{ fontWeight: 800, color: 'var(--text-primary)' }}>
                      {r.month} {r.year}
                    </span>
                  </td>
                  <td>
                    <p style={{ fontWeight: 600, fontSize: '0.9rem' }}>{r.tenant?.name}</p>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{r.tenant?.phone}</p>
                  </td>
                  <td>
                    <p style={{ fontWeight: 600, fontSize: '0.85rem' }}>{r.property?.title}</p>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{r.property?.city}</p>
                  </td>
                  <td>
                    <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
                      ₹{r.amount?.toLocaleString()}
                    </span>
                    {r.lateFee > 0 && (
                      <span style={{ fontSize: '0.7rem', color: 'var(--danger)', display: 'block' }}>
                        +₹{r.lateFee} Late Fee
                      </span>
                    )}
                  </td>
                  <td>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                      {new Date(r.dueDate).toLocaleDateString()}
                    </span>
                  </td>
                  <td>
                    <Badge status={r.status} />
                  </td>
                  <td>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      {r.paidDate ? new Date(r.paidDate).toLocaleDateString() : '—'}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    {r.status !== 'paid' ? (
                      <button
                        onClick={() => handleOpenRecordPayment(r)}
                        className="btn btn-success btn-sm"
                        title="Record Payment"
                      >
                        <CheckCircle2 size={14} /> Record Paid
                      </button>
                    ) : (
                      <span style={{ fontSize: '0.8rem', color: 'var(--success)', fontWeight: 600 }}>
                        Settled
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Generate Invoice Modal */}
      <Modal
        isOpen={invoiceModalOpen}
        onClose={() => setInvoiceModalOpen(false)}
        title="Issue Monthly Rent Invoice"
        maxWidth="600px"
        footer={
          <>
            <button
              type="button"
              onClick={() => setInvoiceModalOpen(false)}
              className="btn btn-secondary btn-sm"
              disabled={submittingInvoice}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleGenerateInvoice}
              className="btn btn-primary btn-sm"
              disabled={submittingInvoice || !invoiceForm.agreementId || !invoiceForm.amount}
            >
              {submittingInvoice ? 'Generating...' : 'Issue Invoice'}
            </button>
          </>
        }
      >
        <form onSubmit={handleGenerateInvoice} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="form-group">
            <label className="form-label">Select Tenant Lease *</label>
            <select
              className="form-select"
              value={invoiceForm.agreementId}
              onChange={(e) => {
                const agr = agreements.find((a) => a._id === e.target.value);
                setInvoiceForm({
                  ...invoiceForm,
                  agreementId: e.target.value,
                  amount: agr ? agr.monthlyRent : invoiceForm.amount,
                });
              }}
            >
              {agreements.map((agr) => (
                <option key={agr._id} value={agr._id}>
                  {agr.tenant?.name} — {agr.property?.title} (₹{agr.monthlyRent}/mo)
                </option>
              ))}
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Billing Month *</label>
              <select
                className="form-select"
                value={invoiceForm.month}
                onChange={(e) => setInvoiceForm({ ...invoiceForm, month: e.target.value })}
              >
                {months.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Billing Year *</label>
              <input
                type="number"
                required
                className="form-input"
                value={invoiceForm.year}
                onChange={(e) => setInvoiceForm({ ...invoiceForm, year: Number(e.target.value) })}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Invoice Amount (₹) *</label>
              <input
                type="number"
                required
                className="form-input"
                value={invoiceForm.amount}
                onChange={(e) => setInvoiceForm({ ...invoiceForm, amount: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Late Fee / Penalty (₹)</label>
              <input
                type="number"
                className="form-input"
                value={invoiceForm.lateFee}
                onChange={(e) => setInvoiceForm({ ...invoiceForm, lateFee: e.target.value })}
              />
            </div>
          </div>
        </form>
      </Modal>

      {/* Record Offline Payment Modal */}
      {selectedRentRecord && (
        <Modal
          isOpen={recordPaymentModalOpen}
          onClose={() => setRecordPaymentModalOpen(false)}
          title={`Record Payment for ${selectedRentRecord.month} ${selectedRentRecord.year}`}
          maxWidth="550px"
          footer={
            <>
              <button
                type="button"
                onClick={() => setRecordPaymentModalOpen(false)}
                className="btn btn-secondary btn-sm"
                disabled={submittingPayment}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleRecordPaymentSubmit}
                className="btn btn-success btn-sm"
                disabled={submittingPayment}
              >
                {submittingPayment ? 'Recording...' : 'Confirm Payment Receipt'}
              </button>
            </>
          }
        >
          <form onSubmit={handleRecordPaymentSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ background: 'rgba(16, 185, 129, 0.15)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Tenant Name</p>
              <p style={{ fontWeight: 700, fontSize: '1rem' }}>{selectedRentRecord.tenant?.name}</p>
              <p style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--success)', marginTop: '0.25rem' }}>
                ₹{(selectedRentRecord.amount + (selectedRentRecord.lateFee || 0)).toLocaleString()}
              </p>
            </div>

            <div className="form-group">
              <label className="form-label">Payment Method</label>
              <select
                className="form-select"
                value={paymentForm.paymentMethod}
                onChange={(e) => setPaymentForm({ ...paymentForm, paymentMethod: e.target.value })}
              >
                <option value="Cash">Cash (In-person)</option>
                <option value="Bank Transfer">Direct Bank Transfer / NEFT</option>
                <option value="UPI">UPI / GooglePay / PhonePe</option>
                <option value="Card">Credit / Debit Card</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Transaction Reference Number</label>
              <input
                type="text"
                className="form-input"
                value={paymentForm.transactionReference}
                onChange={(e) => setPaymentForm({ ...paymentForm, transactionReference: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Receipt Notes</label>
              <input
                type="text"
                className="form-input"
                value={paymentForm.notes}
                onChange={(e) => setPaymentForm({ ...paymentForm, notes: e.target.value })}
              />
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default RentLedger;
