import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import {
  ShieldCheck,
  Lock,
  QrCode,
  CreditCard,
  Building2,
  Wallet,
  CheckCircle2,
  Clock,
  ArrowRight,
  Shield,
  Smartphone,
  ChevronRight,
  AlertCircle,
  Copy,
  Check,
  RotateCcw,
  Download,
  Printer
} from 'lucide-react';
import UrbanNestLogo from '../common/UrbanNestLogo';

const scanAnimation = keyframes`
  0% { top: 10%; opacity: 0.8; }
  50% { top: 85%; opacity: 1; }
  100% { top: 10%; opacity: 0.8; }
`;

const pulseGlow = keyframes`
  0% { box-shadow: 0 0 15px rgba(224, 35, 28, 0.3); }
  50% { box-shadow: 0 0 30px rgba(224, 35, 28, 0.6); }
  100% { box-shadow: 0 0 15px rgba(224, 35, 28, 0.3); }
`;

const GatewayContainer = styled.div`
  background: #090d14;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.85), 0 0 0 1px rgba(255, 255, 255, 0.08);
  color: #f1f5f9;
  font-family: var(--font-main, 'Onest', sans-serif);
  max-width: 820px;
  width: 100%;
  margin: 0 auto;

  .gateway-header {
    background: linear-gradient(180deg, #111827 0%, #0c121e 100%);
    padding: 1.25rem 1.75rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 1rem;
  }

  .gateway-body {
    display: grid;
    grid-template-columns: 260px 1fr;
    min-height: 480px;

    @media (max-width: 768px) {
      grid-template-columns: 1fr;
    }
  }

  .methods-sidebar {
    background: rgba(10, 14, 22, 0.95);
    border-right: 1px solid rgba(255, 255, 255, 0.06);
    padding: 1.25rem 0.75rem;
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
  }

  .method-tab {
    display: flex;
    align-items: center;
    gap: 0.85rem;
    padding: 0.85rem 1rem;
    border-radius: 12px;
    background: transparent;
    border: 1px solid transparent;
    color: #94a3b8;
    font-size: 0.9rem;
    font-weight: 600;
    cursor: pointer;
    text-align: left;
    transition: all 0.2s ease;
    width: 100%;

    &:hover {
      background: rgba(255, 255, 255, 0.04);
      color: #f8fafc;
    }

    &.active {
      background: linear-gradient(90deg, rgba(224, 35, 28, 0.15) 0%, rgba(224, 35, 28, 0.05) 100%);
      border-color: rgba(224, 35, 28, 0.4);
      color: #ffffff;

      .tab-icon {
        color: #ff5a3c;
      }
    }
  }

  .method-content {
    padding: 1.75rem;
    background: #090d14;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .qr-scanner-box {
    position: relative;
    width: 190px;
    height: 190px;
    background: #ffffff;
    border-radius: 16px;
    padding: 12px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5);

    .scan-bar {
      position: absolute;
      left: 8px;
      right: 8px;
      height: 3px;
      background: linear-gradient(90deg, transparent, #e0231c, #ff5a3c, transparent);
      box-shadow: 0 0 12px #ff5a3c;
      animation: ${scanAnimation} 2.5s ease-in-out infinite;
      border-radius: 2px;
    }
  }

  .card-preview {
    background: linear-gradient(135deg, #1e293b 0%, #0f172a 50%, #05070a 100%);
    border: 1px solid rgba(255, 255, 255, 0.15);
    border-radius: 16px;
    padding: 1.5rem;
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.6);
    position: relative;
    overflow: hidden;
    margin-bottom: 1.5rem;

    &:before {
      content: '';
      position: absolute;
      top: -50%;
      right: -30%;
      width: 250px;
      height: 250px;
      background: radial-gradient(circle, rgba(224, 35, 28, 0.25) 0%, transparent 70%);
      pointer-events: none;
    }
  }

  .form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
  }

  .gateway-input {
    width: 100%;
    background: #111827;
    border: 1px solid rgba(255, 255, 255, 0.12);
    border-radius: 10px;
    padding: 0.75rem 1rem;
    color: #f8fafc;
    font-size: 0.95rem;
    font-family: inherit;
    transition: all 0.2s ease;

    &:focus {
      outline: none;
      border-color: #ff5a3c;
      box-shadow: 0 0 0 3px rgba(224, 35, 28, 0.2);
    }
  }

  .bank-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 0.75rem;

    @media (max-width: 550px) {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  .bank-tile {
    background: #111827;
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 12px;
    padding: 0.85rem 0.5rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.4rem;
    cursor: pointer;
    transition: all 0.2s ease;
    text-align: center;

    &:hover {
      background: #1e293b;
      border-color: rgba(255, 255, 255, 0.2);
      transform: translateY(-2px);
    }

    &.selected {
      border-color: #ff5a3c;
      background: rgba(224, 35, 28, 0.1);
    }
  }
`;

const RealisticPaymentGateway = ({
  rentItem,
  onClose,
  onPaymentSuccess
}) => {
  const [activeTab, setActiveTab] = useState('upi'); // 'upi' | 'card' | 'netbanking' | 'wallet'
  const [upiSubTab, setUpiSubTab] = useState('qr'); // 'qr' | 'vpa'
  const [vpaInput, setVpaInput] = useState('');
  
  // Card details state
  const [cardNumber, setCardNumber] = useState('4532 •••• •••• 8892');
  const [cardHolder, setCardHolder] = useState('SAI CHANDAN');
  const [cardExpiry, setCardExpiry] = useState('08/29');
  const [cardCvv, setCardCvv] = useState('924');

  // Net banking state
  const [selectedBank, setSelectedBank] = useState('HDFC');

  // Processing & verification simulation
  const [stage, setStage] = useState('checkout'); // 'checkout' | 'authorizing' | 'otp' | 'success'
  const [countdown, setCountdown] = useState(299); // 5 mins QR timer
  const [otpCode, setOtpCode] = useState('');
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [txnRef, setTxnRef] = useState('');

  const totalAmount = rentItem ? rentItem.amount + (rentItem.lateFee || 0) : 25000;

  useEffect(() => {
    let timer;
    if (countdown > 0 && stage === 'checkout') {
      timer = setInterval(() => setCountdown(prev => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [countdown, stage]);

  const formatTimer = (sec) => {
    const m = Math.floor(sec / 60).toString().padStart(2, '0');
    const s = (sec % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const startPaymentFlow = () => {
    setStage('authorizing');
    const generatedTxn = `PAY-UN-${Date.now().toString().slice(-8)}`;
    setTxnRef(generatedTxn);

    // Simulate bank authorization -> OTP prompt
    setTimeout(() => {
      setStage('otp');
    }, 1600);
  };

  const handleVerifyOtpAndSettle = async () => {
    setStage('authorizing');
    
    try {
      if (onPaymentSuccess) {
        await onPaymentSuccess({
          rentId: rentItem?._id,
          agreementId: rentItem?.agreement?._id || rentItem?.agreement,
          amount: totalAmount,
          paymentMethod: activeTab.toUpperCase(),
          transactionReference: txnRef || `UPI-${Date.now().toString().slice(-8)}`,
          notes: `Settled via UrbanNest Verified Escrow Gateway (${activeTab.toUpperCase()})`
        });
      }
      setStage('success');
    } catch (err) {
      alert('Payment authorization failed: ' + (err.message || 'Please try again'));
      setStage('checkout');
    }
  };

  const popularBanks = [
    { id: 'HDFC', name: 'HDFC Bank', code: 'HDFC' },
    { id: 'SBI', name: 'State Bank of India', code: 'SBI' },
    { id: 'ICICI', name: 'ICICI Bank', code: 'ICICI' },
    { id: 'AXIS', name: 'Axis Bank', code: 'UTIB' },
    { id: 'KOTAK', name: 'Kotak Mahindra', code: 'KKBK' },
    { id: 'PNB', name: 'Punjab National', code: 'PUNB' }
  ];

  return (
    <GatewayContainer>
      {/* Top Gateway Header */}
      <div className="gateway-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <UrbanNestLogo variant="horizontal" size="sm" />
          <div style={{ height: '24px', width: '1px', background: 'rgba(255,255,255,0.15)' }} />
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Lock size={13} color="#10b981" />
              <span style={{ fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.04em', color: '#10b981', textTransform: 'uppercase' }}>
                UrbanNest Escrow Secure Checkout
              </span>
            </div>
            <p style={{ fontSize: '0.75rem', color: '#94a3b8', margin: 0 }}>
              {rentItem?.property?.title || 'Sanctuary Apartment'} • {rentItem?.month || 'September'} {rentItem?.year || 2026}
            </p>
          </div>
        </div>

        <div style={{ textAlign: 'right' }}>
          <span style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block' }}>Total Payable Amount</span>
          <span style={{ fontSize: '1.4rem', fontWeight: 900, color: '#ff5a3c', letterSpacing: '-0.02em' }}>
            ₹{totalAmount.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Stage 1: Main Gateway Selection & Form */}
      {stage === 'checkout' && (
        <div className="gateway-body">
          {/* Methods Sidebar */}
          <div className="methods-sidebar">
            <div style={{ padding: '0.5rem 0.5rem 0.8rem', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Select Payment Method
            </div>

            <button
              type="button"
              className={`method-tab ${activeTab === 'upi' ? 'active' : ''}`}
              onClick={() => setActiveTab('upi')}
            >
              <QrCode size={18} className="tab-icon" />
              <div style={{ flex: 1 }}>
                <div>UPI / QR Instant</div>
                <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 400 }}>GPay, PhonePe, Paytm</div>
              </div>
              <span style={{ fontSize: '0.65rem', background: 'rgba(16, 185, 129, 0.2)', color: '#34d399', padding: '2px 6px', borderRadius: '4px', fontWeight: 700 }}>0% FEE</span>
            </button>

            <button
              type="button"
              className={`method-tab ${activeTab === 'card' ? 'active' : ''}`}
              onClick={() => setActiveTab('card')}
            >
              <CreditCard size={18} className="tab-icon" />
              <div style={{ flex: 1 }}>
                <div>Credit & Debit Cards</div>
                <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 400 }}>Visa, Master, RuPay</div>
              </div>
            </button>

            <button
              type="button"
              className={`method-tab ${activeTab === 'netbanking' ? 'active' : ''}`}
              onClick={() => setActiveTab('netbanking')}
            >
              <Building2 size={18} className="tab-icon" />
              <div style={{ flex: 1 }}>
                <div>Net Banking</div>
                <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 400 }}>All Major Indian Banks</div>
              </div>
            </button>

            <button
              type="button"
              className={`method-tab ${activeTab === 'wallet' ? 'active' : ''}`}
              onClick={() => setActiveTab('wallet')}
            >
              <Wallet size={18} className="tab-icon" />
              <div style={{ flex: 1 }}>
                <div>Wallets & PayLater</div>
                <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 400 }}>Amazon Pay, Simpl</div>
              </div>
            </button>

            <div style={{ marginTop: 'auto', padding: '1rem 0.5rem 0.5rem', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#64748b', fontSize: '0.72rem' }}>
                <ShieldCheck size={16} color="#10b981" />
                <span>PCI-DSS Level 1 Compliant Escrow</span>
              </div>
            </div>
          </div>

          {/* Methods Main Panel */}
          <div className="method-content">
            {/* UPI Flow */}
            {activeTab === 'upi' && (
              <div>
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem', background: '#111827', padding: '4px', borderRadius: '10px' }}>
                  <button
                    type="button"
                    onClick={() => setUpiSubTab('qr')}
                    className={`btn btn-sm ${upiSubTab === 'qr' ? 'btn-primary' : 'btn-outline'}`}
                    style={{ flex: 1, border: 'none' }}
                  >
                    Scan QR Code
                  </button>
                  <button
                    type="button"
                    onClick={() => setUpiSubTab('vpa')}
                    className={`btn btn-sm ${upiSubTab === 'vpa' ? 'btn-primary' : 'btn-outline'}`}
                    style={{ flex: 1, border: 'none' }}
                  >
                    Enter UPI ID / VPA
                  </button>
                </div>

                {upiSubTab === 'qr' ? (
                  <div style={{ textAlign: 'center' }}>
                    <div className="qr-scanner-box">
                      <div className="scan-bar" />
                      {/* Realistic SVG QR Code Representation */}
                      <svg width="160" height="160" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect width="200" height="200" fill="white" />
                        {/* Corner Positioners */}
                        <rect x="10" y="10" width="50" height="50" fill="#05070a" rx="8" />
                        <rect x="20" y="20" width="30" height="30" fill="white" rx="4" />
                        <rect x="26" y="26" width="18" height="18" fill="#e0231c" rx="2" />

                        <rect x="140" y="10" width="50" height="50" fill="#05070a" rx="8" />
                        <rect x="150" y="20" width="30" height="30" fill="white" rx="4" />
                        <rect x="156" y="26" width="18" height="18" fill="#e0231c" rx="2" />

                        <rect x="10" y="140" width="50" height="50" fill="#05070a" rx="8" />
                        <rect x="20" y="150" width="30" height="30" fill="white" rx="4" />
                        <rect x="26" y="156" width="18" height="18" fill="#e0231c" rx="2" />

                        {/* QR Matrix Bits */}
                        <rect x="75" y="15" width="12" height="12" fill="#05070a" />
                        <rect x="95" y="15" width="12" height="12" fill="#05070a" />
                        <rect x="115" y="15" width="12" height="12" fill="#05070a" />
                        <rect x="75" y="35" width="12" height="12" fill="#05070a" />
                        <rect x="105" y="35" width="12" height="12" fill="#05070a" />
                        <rect x="15" y="75" width="12" height="12" fill="#05070a" />
                        <rect x="35" y="75" width="12" height="12" fill="#05070a" />
                        <rect x="55" y="75" width="12" height="12" fill="#05070a" />
                        <rect x="75" y="75" width="12" height="12" fill="#05070a" />
                        <rect x="95" y="75" width="12" height="12" fill="#e0231c" />
                        <rect x="115" y="75" width="12" height="12" fill="#05070a" />
                        <rect x="145" y="75" width="12" height="12" fill="#05070a" />
                        <rect x="175" y="75" width="12" height="12" fill="#05070a" />

                        <rect x="15" y="105" width="12" height="12" fill="#05070a" />
                        <rect x="45" y="105" width="12" height="12" fill="#05070a" />
                        <rect x="75" y="105" width="12" height="12" fill="#05070a" />
                        <rect x="105" y="105" width="12" height="12" fill="#05070a" />
                        <rect x="135" y="105" width="12" height="12" fill="#05070a" />
                        <rect x="165" y="105" width="12" height="12" fill="#05070a" />

                        <rect x="75" y="135" width="12" height="12" fill="#05070a" />
                        <rect x="95" y="135" width="12" height="12" fill="#05070a" />
                        <rect x="115" y="135" width="12" height="12" fill="#05070a" />
                        <rect x="145" y="135" width="12" height="12" fill="#05070a" />
                        <rect x="175" y="135" width="12" height="12" fill="#05070a" />

                        <rect x="75" y="165" width="12" height="12" fill="#05070a" />
                        <rect x="105" y="165" width="12" height="12" fill="#05070a" />
                        <rect x="135" y="165" width="12" height="12" fill="#05070a" />
                        <rect x="165" y="165" width="12" height="12" fill="#05070a" />
                      </svg>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', marginTop: '0.75rem', color: '#fbbf24', fontSize: '0.85rem' }}>
                      <Clock size={14} />
                      <span>QR Code expires in <strong>{formatTimer(countdown)}</strong></span>
                    </div>

                    <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '0.4rem' }}>
                      Scan with any UPI App (Google Pay, PhonePe, Paytm, BHIM, CRED)
                    </p>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div>
                      <label style={{ fontSize: '0.825rem', fontWeight: 600, color: '#cbd5e1', display: 'block', marginBottom: '0.4rem' }}>
                        Virtual Payment Address (VPA) / UPI ID
                      </label>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <input
                          type="text"
                          className="gateway-input"
                          placeholder="e.g. yourname@okhdfcbank"
                          value={vpaInput}
                          onChange={(e) => setVpaInput(e.target.value)}
                        />
                        <button
                          type="button"
                          className="btn btn-outline btn-sm"
                          onClick={() => setVpaInput('saichand@okhdfcbank')}
                          style={{ whiteSpace: 'nowrap' }}
                        >
                          Fill Demo
                        </button>
                      </div>
                    </div>

                    <div style={{ background: '#111827', padding: '0.85rem', borderRadius: '10px', fontSize: '0.78rem', color: '#94a3b8' }}>
                      💡 A payment collect request of <strong>₹{totalAmount.toLocaleString()}</strong> will be dispatched to your UPI app for instant MPIN authentication.
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Card Flow */}
            {activeTab === 'card' && (
              <div>
                {/* 3D Realistic Credit Card Representation */}
                <div className="card-preview">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <div style={{ width: '32px', height: '24px', background: '#c9a24a', borderRadius: '4px', opacity: 0.8 }} />
                      <span style={{ fontSize: '0.75rem', letterSpacing: '0.05em', color: '#94a3b8' }}>EMV CHIP</span>
                    </div>
                    <span style={{ fontWeight: 900, fontStyle: 'italic', letterSpacing: '0.05em', fontSize: '1.2rem', color: '#ffffff' }}>
                      VISA
                    </span>
                  </div>

                  <div style={{ fontSize: '1.25rem', fontWeight: 700, letterSpacing: '0.12em', color: '#ffffff', fontFamily: 'monospace', marginBottom: '1.25rem' }}>
                    {cardNumber || '•••• •••• •••• ••••'}
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                    <div>
                      <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', color: '#94a3b8' }}>Card Holder</div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#f1f5f9', letterSpacing: '0.05em' }}>
                        {cardHolder || 'CARDHOLDER NAME'}
                      </div>
                    </div>

                    <div>
                      <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', color: '#94a3b8' }}>Expires</div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#f1f5f9' }}>
                        {cardExpiry || 'MM/YY'}
                      </div>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                  <div>
                    <label style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'block', marginBottom: '0.3rem' }}>Card Number</label>
                    <input
                      type="text"
                      className="gateway-input"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                    />
                  </div>

                  <div className="form-row">
                    <div>
                      <label style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'block', marginBottom: '0.3rem' }}>Cardholder Name</label>
                      <input
                        type="text"
                        className="gateway-input"
                        value={cardHolder}
                        onChange={(e) => setCardHolder(e.target.value)}
                      />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                      <div>
                        <label style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'block', marginBottom: '0.3rem' }}>Expiry</label>
                        <input
                          type="text"
                          className="gateway-input"
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                        />
                      </div>
                      <div>
                        <label style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'block', marginBottom: '0.3rem' }}>CVV</label>
                        <input
                          type="password"
                          className="gateway-input"
                          maxLength="4"
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Net Banking Flow */}
            {activeTab === 'netbanking' && (
              <div>
                <label style={{ fontSize: '0.825rem', fontWeight: 600, color: '#cbd5e1', display: 'block', marginBottom: '0.75rem' }}>
                  Select Your Bank
                </label>
                <div className="bank-grid">
                  {popularBanks.map((b) => (
                    <div
                      key={b.id}
                      className={`bank-tile ${selectedBank === b.id ? 'selected' : ''}`}
                      onClick={() => setSelectedBank(b.id)}
                    >
                      <Building2 size={24} color={selectedBank === b.id ? '#ff5a3c' : '#94a3b8'} />
                      <span style={{ fontSize: '0.8rem', fontWeight: 600, color: selectedBank === b.id ? '#ffffff' : '#cbd5e1' }}>
                        {b.name}
                      </span>
                    </div>
                  ))}
                </div>

                <div style={{ marginTop: '1.25rem' }}>
                  <label style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'block', marginBottom: '0.4rem' }}>Or search 50+ other banks</label>
                  <select className="gateway-input" style={{ cursor: 'pointer' }}>
                    <option>Bank of Baroda</option>
                    <option>Canara Bank</option>
                    <option>Union Bank of India</option>
                    <option>IDFC FIRST Bank</option>
                    <option>Federal Bank</option>
                    <option>IndusInd Bank</option>
                  </select>
                </div>
              </div>
            )}

            {/* Wallets & PayLater Flow */}
            {activeTab === 'wallet' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                <label style={{ fontSize: '0.825rem', fontWeight: 600, color: '#cbd5e1' }}>Select Wallet or Credit Line</label>
                {['Amazon Pay (Balance: ₹35,000)', 'Simpl PayLater (Approved ₹40,000)', 'Paytm Wallet', 'Mobikwik ZIP'].map((w, idx) => (
                  <label
                    key={w}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      background: '#111827',
                      padding: '0.85rem 1rem',
                      borderRadius: '10px',
                      cursor: 'pointer',
                      border: idx === 0 ? '1px solid #ff5a3c' : '1px solid rgba(255,255,255,0.08)'
                    }}
                  >
                    <input type="radio" name="wallet" defaultChecked={idx === 0} />
                    <span style={{ fontSize: '0.88rem', fontWeight: 600 }}>{w}</span>
                  </label>
                ))}
              </div>
            )}

            {/* Bottom Action Footer */}
            <div style={{ marginTop: '2rem', paddingTop: '1.25rem', borderTop: '1px solid rgba(255,255,255,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <button
                type="button"
                onClick={onClose}
                className="btn btn-outline btn-sm"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={startPaymentFlow}
                className="btn btn-primary"
                style={{ padding: '0.75rem 2rem', fontWeight: 800, fontSize: '0.95rem' }}
              >
                Authorize Payment ₹{totalAmount.toLocaleString()} <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Stage 2: Authorization Spinner */}
      {stage === 'authorizing' && (
        <div style={{ padding: '4.5rem 2rem', textAlign: 'center' }}>
          <div
            style={{
              width: '72px',
              height: '72px',
              border: '4px solid rgba(224, 35, 28, 0.2)',
              borderTopColor: '#e0231c',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 1.5rem'
            }}
          />
          <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#f8fafc' }}>Contacting National Payments Gateway...</h3>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginTop: '0.4rem' }}>
            Encrypting payload with 256-Bit TLS and authenticating with {selectedBank || 'Bank'} Core Switch
          </p>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', marginTop: '1.25rem', background: '#111827', padding: '0.4rem 1rem', borderRadius: '20px', fontSize: '0.78rem', color: '#64748b' }}>
            <Lock size={13} color="#10b981" /> Please do not refresh or close this browser window.
          </div>
        </div>
      )}

      {/* Stage 3: 3D Secure OTP Modal Simulation */}
      {stage === 'otp' && (
        <div style={{ padding: '2.5rem 2rem', maxWidth: '480px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{ width: '48px', height: '48px', background: 'rgba(201,162,74,0.15)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
            <Smartphone size={24} color="#c9a24a" />
          </div>

          <h3 style={{ fontSize: '1.3rem', fontWeight: 800 }}>3D Secure OTP Authentication</h3>
          <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: '0.25rem' }}>
            An authentication OTP has been dispatched to your registered mobile number ending in •••• 9210
          </p>

          <div style={{ background: '#111827', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '1.25rem', margin: '1.5rem 0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '0.75rem' }}>
              <span>Merchant: <strong>UrbanNest Escrow</strong></span>
              <span>Amount: <strong>₹{totalAmount.toLocaleString()}</strong></span>
            </div>

            <input
              type="text"
              maxLength="6"
              className="gateway-input"
              style={{ textAlign: 'center', fontSize: '1.5rem', letterSpacing: '0.35em', fontWeight: 800, padding: '0.6rem' }}
              placeholder="••••••"
              value={otpCode}
              onChange={(e) => setOtpCode(e.target.value)}
            />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.75rem' }}>
              <button
                type="button"
                onClick={() => setOtpCode('482910')}
                className="btn btn-outline btn-sm"
                style={{ fontSize: '0.75rem' }}
              >
                Auto-Fill Demo OTP (482910)
              </button>
              <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Resend in 24s</span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button
              type="button"
              onClick={() => setStage('checkout')}
              className="btn btn-outline"
              style={{ flex: 1 }}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleVerifyOtpAndSettle}
              className="btn btn-primary"
              style={{ flex: 2, fontWeight: 800 }}
            >
              Verify & Complete Settlement
            </button>
          </div>
        </div>
      )}

      {/* Stage 4: Official Verified Payment Receipt */}
      {stage === 'success' && (
        <div style={{ padding: '2.5rem 2rem', textAlign: 'center' }}>
          <div style={{ width: '64px', height: '64px', background: 'rgba(16, 185, 129, 0.15)', border: '2px solid #10b981', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', boxShadow: '0 0 25px rgba(16, 185, 129, 0.3)' }}>
            <CheckCircle2 size={36} color="#10b981" />
          </div>

          <span className="badge badge-success" style={{ marginBottom: '0.5rem' }}>Settlement Confirmed</span>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#f8fafc', marginTop: '0.5rem' }}>
            ₹{totalAmount.toLocaleString()} Settled Successfully
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '0.875rem' }}>
            Funds transferred to Landlord Escrow Account and ledger marked as <strong>PAID</strong>.
          </p>

          {/* Official Receipt Card */}
          <div style={{ background: '#111827', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '1.25rem 1.5rem', maxWidth: '520px', margin: '1.5rem auto', textAlign: 'left' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed rgba(255,255,255,0.12)', paddingBottom: '0.75rem', marginBottom: '0.75rem' }}>
              <div>
                <span style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase' }}>Transaction UTR / Ref</span>
                <p style={{ fontSize: '0.9rem', fontWeight: 700, color: '#ff5a3c', margin: 0 }}>{txnRef || 'PAY-UN-8849201'}</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase' }}>Timestamp</span>
                <p style={{ fontSize: '0.85rem', color: '#cbd5e1', margin: 0 }}>{new Date().toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}</p>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', fontSize: '0.85rem' }}>
              <div>
                <span style={{ fontSize: '0.72rem', color: '#64748b' }}>Property</span>
                <p style={{ fontWeight: 600, color: '#f1f5f9', margin: 0 }}>{rentItem?.property?.title || 'Sanctuary Apartment'}</p>
              </div>
              <div>
                <span style={{ fontSize: '0.72rem', color: '#64748b' }}>Payment Mode</span>
                <p style={{ fontWeight: 600, color: '#f1f5f9', margin: 0 }}>{activeTab.toUpperCase()} (Instant Escrow)</p>
              </div>
              <div>
                <span style={{ fontSize: '0.72rem', color: '#64748b' }}>Rent Period</span>
                <p style={{ fontWeight: 600, color: '#f1f5f9', margin: 0 }}>{rentItem?.month || 'September'} {rentItem?.year || 2026}</p>
              </div>
              <div>
                <span style={{ fontSize: '0.72rem', color: '#64748b' }}>Escrow Status</span>
                <p style={{ fontWeight: 700, color: '#10b981', margin: 0 }}>Verified & Reconciled</p>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '1.5rem' }}>
            <button
              type="button"
              onClick={() => window.print()}
              className="btn btn-outline btn-sm"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
            >
              <Printer size={15} /> Print Receipt
            </button>
            <button
              type="button"
              onClick={onClose}
              className="btn btn-primary btn-sm"
              style={{ padding: '0.6rem 2rem' }}
            >
              Return to Ledger
            </button>
          </div>
        </div>
      )}
    </GatewayContainer>
  );
};

export default RealisticPaymentGateway;
