import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import {
  Building2,
  PlusCircle,
  Edit,
  Trash2,
  Eye,
  MapPin,
  CheckCircle2,
  AlertCircle,
  ToggleLeft,
  ToggleRight,
} from 'lucide-react';

const MyProperties = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    propertyType: 'Apartment',
    address: '',
    city: '',
    state: '',
    pincode: '',
    rent: '',
    securityDeposit: '',
    bedrooms: 1,
    bathrooms: 1,
    area: '',
    furnishingStatus: 'Semi-Furnished',
    amenities: '',
    images: '',
  });

  const fetchMyProperties = async () => {
    try {
      setLoading(true);
      const res = await api.get('/properties/owner/my-properties');
      if (res.data.success) {
        setProperties(res.data.data);
      }
    } catch (error) {
      console.error('Failed to load my properties:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyProperties();
  }, []);

  const handleOpenCreateModal = () => {
    setEditingProperty(null);
    setFormData({
      title: '',
      description: '',
      propertyType: 'Apartment',
      address: '',
      city: '',
      state: '',
      pincode: '',
      rent: '',
      securityDeposit: '',
      bedrooms: 1,
      bathrooms: 1,
      area: '',
      furnishingStatus: 'Semi-Furnished',
      amenities: 'Elevator, Power Backup, 24/7 Security, Covered Parking',
      images: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
    });
    setFormError('');
    setModalOpen(true);
  };

  const handleOpenEditModal = (property) => {
    setEditingProperty(property);
    setFormData({
      title: property.title,
      description: property.description,
      propertyType: property.propertyType,
      address: property.address,
      city: property.city,
      state: property.state,
      pincode: property.pincode,
      rent: property.rent,
      securityDeposit: property.securityDeposit,
      bedrooms: property.bedrooms,
      bathrooms: property.bathrooms,
      area: property.area,
      furnishingStatus: property.furnishingStatus,
      amenities: property.amenities?.join(', ') || '',
      images: property.images?.join('\n') || '',
    });
    setFormError('');
    setModalOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      setFormError('');

      const payload = {
        ...formData,
        rent: Number(formData.rent),
        securityDeposit: Number(formData.securityDeposit),
        bedrooms: Number(formData.bedrooms),
        bathrooms: Number(formData.bathrooms),
        area: Number(formData.area),
        amenities: formData.amenities.split(',').map((a) => a.trim()).filter(Boolean),
        images: formData.images.split('\n').map((url) => url.trim()).filter(Boolean),
      };

      if (editingProperty) {
        const res = await api.put(`/properties/${editingProperty._id}`, payload);
        if (res.data.success) {
          setProperties((prev) =>
            prev.map((p) => (p._id === editingProperty._id ? res.data.data : p))
          );
          setModalOpen(false);
        }
      } else {
        const res = await api.post('/properties', payload);
        if (res.data.success) {
          setProperties((prev) => [res.data.data, ...prev]);
          setModalOpen(false);
        }
      }
    } catch (error) {
      setFormError(error.response?.data?.message || 'Failed to save property listing');
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleAvailability = async (property) => {
    const nextStatus = property.availabilityStatus === 'available' ? 'maintenance' : 'available';
    try {
      const res = await api.patch(`/properties/${property._id}/availability`, {
        availabilityStatus: nextStatus,
      });
      if (res.data.success) {
        setProperties((prev) =>
          prev.map((p) => (p._id === property._id ? { ...p, availabilityStatus: nextStatus } : p))
        );
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to toggle availability');
    }
  };

  const handleDeleteProperty = async (propertyId) => {
    if (!window.confirm('Are you sure you want to delete this property listing?')) return;
    try {
      const res = await api.delete(`/properties/${propertyId}`);
      if (res.data.success) {
        setProperties((prev) => prev.filter((p) => p._id !== propertyId));
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to delete property');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header bar */}
      <div className="card" style={{ padding: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>My Property Inventory</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
            List, update specifications, and toggle availability of your rental units
          </p>
        </div>
        <button onClick={handleOpenCreateModal} className="btn btn-primary">
          <PlusCircle size={18} /> Add New Property Listing
        </button>
      </div>

      {loading ? (
        <LoadingSpinner text="Loading your properties..." />
      ) : properties.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <Building2 size={48} color="var(--primary-light)" style={{ opacity: 0.4, margin: '0 auto 1rem' }} />
          <h3 style={{ fontSize: '1.3rem', marginBottom: '0.5rem' }}>No properties added yet</h3>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '450px', margin: '0 auto 1.5rem' }}>
            Start listing your apartments, villas, and residential floors to begin receiving tenant applications.
          </p>
          <button onClick={handleOpenCreateModal} className="btn btn-primary">
            <PlusCircle size={18} /> Create Your First Listing
          </button>
        </div>
      ) : (
        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Property</th>
                <th>Type</th>
                <th>Monthly Rent</th>
                <th>Approval</th>
                <th>Availability</th>
                <th>Created</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {properties.map((p) => (
                <tr key={p._id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <img
                        src={p.images?.[0] || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=150&q=80'}
                        alt={p.title}
                        style={{ width: '56px', height: '42px', borderRadius: 'var(--radius-sm)', objectFit: 'cover' }}
                      />
                      <div>
                        <p style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.9rem' }}>{p.title}</p>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          {p.address}, {p.city}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="badge badge-secondary">{p.propertyType}</span>
                  </td>
                  <td>
                    <span style={{ fontWeight: 800, color: 'var(--success)' }}>
                      ₹{p.rent?.toLocaleString()}/mo
                    </span>
                  </td>
                  <td>
                    <Badge status={p.approvalStatus} />
                  </td>
                  <td>
                    <button
                      onClick={() => handleToggleAvailability(p)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                      title="Click to toggle availability / maintenance"
                    >
                      <Badge status={p.availabilityStatus} />
                    </button>
                  </td>
                  <td>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      {new Date(p.createdAt).toLocaleDateString()}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'flex-end' }}>
                      <button
                        onClick={() => handleOpenEditModal(p)}
                        className="btn btn-outline btn-sm"
                        title="Edit Property"
                      >
                        <Edit size={14} /> Edit
                      </button>
                      <button
                        onClick={() => handleDeleteProperty(p._id)}
                        className="btn btn-outline btn-sm"
                        style={{ color: 'var(--danger)' }}
                        title="Delete Property"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Create / Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingProperty ? 'Edit Property Listing' : 'List New Rental Property'}
        maxWidth="750px"
        footer={
          <>
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="btn btn-secondary btn-sm"
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleFormSubmit}
              className="btn btn-primary btn-sm"
              disabled={submitting}
            >
              {submitting ? 'Saving...' : editingProperty ? 'Save Updates' : 'Publish for Approval'}
            </button>
          </>
        }
      >
        {formError && (
          <div style={{ padding: '0.75rem 1rem', background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: 'var(--radius-md)', color: '#f87171', fontSize: '0.85rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <AlertCircle size={16} /> {formError}
          </div>
        )}

        <form onSubmit={handleFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="form-group">
            <label className="form-label">Property Title *</label>
            <input
              type="text"
              required
              className="form-input"
              placeholder="e.g. Spacious 3BHK Penthouse with Sea View"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Property Type *</label>
              <select
                className="form-select"
                value={formData.propertyType}
                onChange={(e) => setFormData({ ...formData, propertyType: e.target.value })}
              >
                <option value="Apartment">Apartment</option>
                <option value="Villa">Villa</option>
                <option value="House">House</option>
                <option value="Studio">Studio</option>
                <option value="PG">PG / Co-Living</option>
                <option value="Room">Private Room</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Furnishing</label>
              <select
                className="form-select"
                value={formData.furnishingStatus}
                onChange={(e) => setFormData({ ...formData, furnishingStatus: e.target.value })}
              >
                <option value="Fully-Furnished">Fully-Furnished</option>
                <option value="Semi-Furnished">Semi-Furnished</option>
                <option value="Unfurnished">Unfurnished</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Carpet Area (sq ft) *</label>
              <input
                type="number"
                required
                className="form-input"
                placeholder="e.g. 1450"
                value={formData.area}
                onChange={(e) => setFormData({ ...formData, area: e.target.value })}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Bedrooms *</label>
              <input
                type="number"
                min="0"
                required
                className="form-input"
                value={formData.bedrooms}
                onChange={(e) => setFormData({ ...formData, bedrooms: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Bathrooms *</label>
              <input
                type="number"
                min="0"
                required
                className="form-input"
                value={formData.bathrooms}
                onChange={(e) => setFormData({ ...formData, bathrooms: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Monthly Rent (₹) *</label>
              <input
                type="number"
                required
                className="form-input"
                placeholder="e.g. 45000"
                value={formData.rent}
                onChange={(e) => setFormData({ ...formData, rent: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Deposit (₹) *</label>
              <input
                type="number"
                required
                className="form-input"
                placeholder="e.g. 150000"
                value={formData.securityDeposit}
                onChange={(e) => setFormData({ ...formData, securityDeposit: e.target.value })}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Street Address *</label>
              <input
                type="text"
                required
                className="form-input"
                placeholder="Flat 402, Royal Residency..."
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">City *</label>
              <input
                type="text"
                required
                className="form-input"
                placeholder="e.g. Mumbai"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">State *</label>
              <input
                type="text"
                required
                className="form-input"
                placeholder="e.g. Maharashtra"
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Pincode *</label>
              <input
                type="text"
                required
                className="form-input"
                placeholder="400001"
                value={formData.pincode}
                onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Property Description *</label>
            <textarea
              required
              className="form-textarea"
              placeholder="Highlight architectural details, neighborhood perks, proximity to tech parks/schools..."
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Amenities (Comma separated)</label>
            <input
              type="text"
              className="form-input"
              placeholder="Gym, Swimming Pool, Covered Parking, Power Backup, 24/7 Security"
              value={formData.amenities}
              onChange={(e) => setFormData({ ...formData, amenities: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Image URLs (One per line)</label>
            <textarea
              className="form-textarea"
              placeholder="https://images.unsplash.com/..."
              rows={2}
              value={formData.images}
              onChange={(e) => setFormData({ ...formData, images: e.target.value })}
            />
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default MyProperties;
