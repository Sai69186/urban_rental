import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import {
  Bed,
  Bath,
  Maximize2,
  MapPin,
  Heart,
  CheckCircle2,
  Calendar,
  DollarSign,
  ShieldCheck,
  User,
  Phone,
  Mail,
  Send,
  AlertCircle,
  FileText,
} from 'lucide-react';

const PropertyDetails = () => {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isFavorited, setIsFavorited] = useState(false);

  // Application Modal state
  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [submittingApp, setSubmittingApp] = useState(false);
  const [appError, setAppError] = useState('');
  const [appSuccess, setAppSuccess] = useState(false);
  const [appFormData, setAppFormData] = useState({
    moveInDate: '',
    employmentStatus: 'Employed',
    monthlyIncome: '',
    numberOfOccupants: 1,
    message: '',
    documents: [],
  });

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/properties/${id}`);
        if (res.data.success) {
          setProperty(res.data.data);
        }

        if (isAuthenticated && user?.role === 'tenant') {
          const favRes = await api.get(`/favorites/check/${id}`);
          if (favRes.data.success) {
            setIsFavorited(favRes.data.isFavorited);
          }
        }
      } catch (error) {
        console.error('Error fetching property details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id, isAuthenticated]);

  const handleFavoriteToggle = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (user?.role !== 'tenant') {
      alert('Only tenants can favorite properties');
      return;
    }
    try {
      const res = await api.post('/favorites/toggle', { propertyId: id });
      if (res.data.success) {
        setIsFavorited(res.data.isFavorited);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleApplicationSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (user?.role !== 'tenant') {
      setAppError('Only tenant accounts can submit rental applications.');
      return;
    }

    try {
      setSubmittingApp(true);
      setAppError('');
      const res = await api.post('/applications', {
        propertyId: id,
        ...appFormData,
      });

      if (res.data.success) {
        setAppSuccess(true);
        setTimeout(() => {
          setApplyModalOpen(false);
          setAppSuccess(false);
          navigate('/tenant/applications');
        }, 2000);
      }
    } catch (error) {
      setAppError(error.response?.data?.message || 'Failed to submit rental application.');
    } finally {
      setSubmittingApp(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading property details..." fullScreen />;
  }

  if (!property) {
    return (
      <div className="container" style={{ padding: '5rem 1.5rem', textAlign: 'center' }}>
        <h2 style={{ fontSize: '1.8rem', marginBottom: '1rem' }}>Property Not Found</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
          This property listing may have been removed or is no longer accessible.
        </p>
        <Link to="/explore" className="btn btn-primary">
          Browse Available Homes
        </Link>
      </div>
    );
  }

  const images = property.images && property.images.length > 0
    ? property.images
    : ['https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80'];

  const canApply = property.availabilityStatus === 'available' || property.availabilityStatus === 'under_application';

  return (
    <div className="container" style={{ padding: '3rem 1.5rem 6rem' }}>
      {/* Breadcrumb Navigation */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
        <Link to="/">Home</Link>
        <span>/</span>
        <Link to="/explore">Properties</Link>
        <span>/</span>
        <span style={{ color: 'var(--text-secondary)' }}>{property.city}</span>
      </div>

      {/* Title & Actions Row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.5rem', marginBottom: '2rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
            <Badge status={property.availabilityStatus} />
            <span className="badge badge-primary">{property.propertyType}</span>
            {property.featured && <span className="badge badge-warning">Featured</span>}
          </div>
          <h1 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)', fontWeight: 800, color: '#ffffff' }}>
            {property.title}
          </h1>
          <p style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-secondary)', marginTop: '0.4rem' }}>
            <MapPin size={16} color="var(--primary-light)" />
            {property.address}, {property.city}, {property.state} - {property.pincode}
          </p>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {user?.role !== 'owner' && user?.role !== 'admin' && (
            <button
              onClick={handleFavoriteToggle}
              className="btn btn-outline"
              style={{ color: isFavorited ? '#ef4444' : 'var(--text-secondary)' }}
            >
              <Heart size={18} fill={isFavorited ? '#ef4444' : 'none'} />
              {isFavorited ? 'Saved' : 'Save'}
            </button>
          )}

          {canApply ? (
            <button
              onClick={() => {
                if (!isAuthenticated) navigate('/login');
                else setApplyModalOpen(true);
              }}
              className="btn btn-primary btn-lg"
            >
              Apply for Lease Now
            </button>
          ) : (
            <button disabled className="btn btn-secondary btn-lg">
              Currently Not Available
            </button>
          )}
        </div>
      </div>

      {/* Main Image Gallery */}
      <div style={{ marginBottom: '3rem' }}>
        <div style={{ height: '460px', borderRadius: 'var(--radius-lg)', overflow: 'hidden', marginBottom: '1rem' }}>
          <img
            src={images[activeImageIndex]}
            alt={property.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>
        {images.length > 1 && (
          <div style={{ display: 'flex', gap: '1rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
            {images.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt={`Thumbnail ${idx + 1}`}
                onClick={() => setActiveImageIndex(idx)}
                style={{
                  width: '120px',
                  height: '80px',
                  borderRadius: 'var(--radius-md)',
                  objectFit: 'cover',
                  cursor: 'pointer',
                  border: activeImageIndex === idx ? '2px solid var(--primary)' : '2px solid transparent',
                  opacity: activeImageIndex === idx ? 1 : 0.6,
                  transition: 'all var(--transition-fast)',
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Content Layout: Specs & Description vs Sidebar Card */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2.5rem' }} className="details-layout">
        {/* Left Specs & Info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
          {/* Quick Specs Highlight Box */}
          <div
            className="card"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
              gap: '1.5rem',
              textAlign: 'center',
            }}
          >
            <div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Bedrooms</span>
              <p style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '0.2rem' }}>
                {property.bedrooms} BHK
              </p>
            </div>
            <div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Bathrooms</span>
              <p style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '0.2rem' }}>
                {property.bathrooms} Baths
              </p>
            </div>
            <div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Carpet Area</span>
              <p style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '0.2rem' }}>
                {property.area} sq ft
              </p>
            </div>
            <div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Furnishing</span>
              <p style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--secondary)', marginTop: '0.35rem' }}>
                {property.furnishingStatus}
              </p>
            </div>
          </div>

          {/* Description */}
          <div className="card">
            <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '1rem' }}>
              About This Property
            </h3>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: '0.95rem', whiteSpace: 'pre-line' }}>
              {property.description}
            </p>
          </div>

          {/* Amenities Checklist */}
          <div className="card">
            <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '1.25rem' }}>
              Features & Amenities
            </h3>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                gap: '1rem',
              }}
            >
              {property.amenities && property.amenities.length > 0 ? (
                property.amenities.map((amenity, index) => (
                  <div
                    key={index}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      color: 'var(--text-secondary)',
                      fontSize: '0.925rem',
                    }}
                  >
                    <CheckCircle2 size={18} color="var(--success)" />
                    <span>{amenity}</span>
                  </div>
                ))
              ) : (
                <p style={{ color: 'var(--text-muted)' }}>Standard residential fittings included.</p>
              )}
            </div>
          </div>
        </div>

        {/* Right Sticky Pricing & Landlord Card */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Pricing Box */}
          <div className="card" style={{ position: 'sticky', top: '90px' }}>
            <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '1.25rem', marginBottom: '1.25rem' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Monthly Rent</span>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.4rem', marginTop: '0.25rem' }}>
                <span style={{ fontSize: '2.2rem', fontWeight: 800, color: '#ffffff' }}>
                  ₹{property.rent?.toLocaleString()}
                </span>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>/ month</span>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Security Deposit</span>
                <span style={{ fontWeight: 700 }}>₹{property.securityDeposit?.toLocaleString()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Listing ID</span>
                <span style={{ color: 'var(--text-secondary)' }}>{property._id.slice(-8).toUpperCase()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Availability</span>
                <Badge status={property.availabilityStatus} />
              </div>
            </div>

            {canApply ? (
              <button
                onClick={() => {
                  if (!isAuthenticated) navigate('/login');
                  else setApplyModalOpen(true);
                }}
                className="btn btn-primary"
                style={{ width: '100%', marginBottom: '1rem' }}
              >
                Apply for Property
              </button>
            ) : (
              <button disabled className="btn btn-secondary" style={{ width: '100%', marginBottom: '1rem' }}>
                Application Closed
              </button>
            )}

            {/* Landlord Card */}
            {property.owner && (
              <div
                style={{
                  background: 'rgba(15, 23, 42, 0.6)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                  padding: '1rem',
                  marginTop: '1rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                  <img
                    src={property.owner.profileImage}
                    alt={property.owner.name}
                    style={{ width: '44px', height: '44px', borderRadius: '50%', objectFit: 'cover' }}
                  />
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>{property.owner.name}</span>
                      {property.owner.isVerified && <ShieldCheck size={16} color="var(--success)" title="Verified Landlord" />}
                    </div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Property Owner</span>
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Mail size={14} /> {property.owner.email}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Phone size={14} /> {property.owner.phone}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Application Submission Modal */}
      <Modal
        isOpen={applyModalOpen}
        onClose={() => setApplyModalOpen(false)}
        title={`Apply to Rent: ${property.title}`}
        footer={
          <>
            <button
              type="button"
              onClick={() => setApplyModalOpen(false)}
              className="btn btn-secondary btn-sm"
              disabled={submittingApp}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleApplicationSubmit}
              className="btn btn-primary btn-sm"
              disabled={submittingApp || !appFormData.moveInDate || !appFormData.monthlyIncome}
            >
              {submittingApp ? 'Submitting Application...' : 'Confirm & Submit Application'}
            </button>
          </>
        }
      >
        {appSuccess ? (
          <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
            <CheckCircle2 size={48} color="var(--success)" style={{ margin: '0 auto 1rem' }} />
            <h3 style={{ fontSize: '1.3rem', marginBottom: '0.5rem' }}>Application Submitted!</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              The property owner has been notified and will review your profile and income details.
            </p>
          </div>
        ) : (
          <form onSubmit={handleApplicationSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {appError && (
              <div
                style={{
                  padding: '0.75rem 1rem',
                  background: 'rgba(239, 68, 68, 0.15)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  borderRadius: 'var(--radius-md)',
                  color: '#f87171',
                  fontSize: '0.85rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                }}
              >
                <AlertCircle size={16} /> {appError}
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Proposed Move-In Date *</label>
                <input
                  type="date"
                  className="form-input"
                  required
                  value={appFormData.moveInDate}
                  onChange={(e) => setAppFormData({ ...appFormData, moveInDate: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Monthly Income (₹) *</label>
                <input
                  type="number"
                  className="form-input"
                  placeholder="e.g. 150000"
                  required
                  value={appFormData.monthlyIncome}
                  onChange={(e) => setAppFormData({ ...appFormData, monthlyIncome: e.target.value })}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Employment Status</label>
                <select
                  className="form-select"
                  value={appFormData.employmentStatus}
                  onChange={(e) => setAppFormData({ ...appFormData, employmentStatus: e.target.value })}
                >
                  <option value="Employed">Employed (Full-Time)</option>
                  <option value="Self-Employed">Self-Employed / Freelancer</option>
                  <option value="Business Owner">Business Owner / Founder</option>
                  <option value="Student">Student</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Number of Occupants</label>
                <input
                  type="number"
                  min="1"
                  className="form-input"
                  value={appFormData.numberOfOccupants}
                  onChange={(e) => setAppFormData({ ...appFormData, numberOfOccupants: e.target.value })}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Message / Introduction for Landlord</label>
              <textarea
                className="form-textarea"
                placeholder="Introduce yourself, duration of lease intended, lifestyle notes..."
                value={appFormData.message}
                onChange={(e) => setAppFormData({ ...appFormData, message: e.target.value })}
              />
            </div>
          </form>
        )}
      </Modal>

      <style>{`
        @media (max-width: 900px) {
          .details-layout {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

export default PropertyDetails;
