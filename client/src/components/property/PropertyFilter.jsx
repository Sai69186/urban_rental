import React from 'react';
import { Filter, RotateCcw, Search } from 'lucide-react';
import GlowSearchInput from '../common/GlowSearchInput';

const PropertyFilter = ({ filters, setFilters, onApply, onReset }) => {
  const propertyTypes = ['All', 'Apartment', 'House', 'Villa', 'Studio', 'PG', 'Room'];
  const furnishingOptions = ['All', 'Fully-Furnished', 'Semi-Furnished', 'Unfurnished'];
  const bedroomOptions = ['All', '1', '2', '3', '4'];
  const sortOptions = [
    { value: 'newest', label: 'Newest Listed' },
    { value: 'lowest_rent', label: 'Rent: Low to High' },
    { value: 'highest_rent', label: 'Rent: High to Low' },
    { value: 'oldest', label: 'Oldest' },
  ];

  const handleChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value, page: 1 }));
  };

  return (
    <div className="card" style={{ padding: '1.5rem', height: 'fit-content' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Filter size={18} color="var(--primary-light)" />
          <h4 style={{ fontSize: '1.05rem', fontWeight: 700 }}>Search Filters</h4>
        </div>
        <button
          onClick={onReset}
          className="btn btn-outline btn-sm"
          style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem' }}
          title="Reset All Filters"
        >
          <RotateCcw size={13} /> Reset
        </button>
      </div>

      {/* City */}
      <div className="form-group">
        <label className="form-label">City / Location</label>
        <GlowSearchInput
          placeholder="e.g. Mumbai, Bangalore..."
          value={filters.city || ''}
          onChange={(e) => handleChange('city', e.target.value)}
          showFilter={false}
        />
      </div>

      {/* Property Type */}
      <div className="form-group">
        <label className="form-label">Property Type</label>
        <select
          className="form-select"
          value={filters.propertyType || 'All'}
          onChange={(e) => handleChange('propertyType', e.target.value)}
        >
          {propertyTypes.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      {/* Monthly Budget Range */}
      <div className="form-group">
        <label className="form-label">Monthly Rent Range (₹)</label>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
          <input
            type="number"
            className="form-input"
            placeholder="Min ₹"
            value={filters.minRent || ''}
            onChange={(e) => handleChange('minRent', e.target.value)}
          />
          <input
            type="number"
            className="form-input"
            placeholder="Max ₹"
            value={filters.maxRent || ''}
            onChange={(e) => handleChange('maxRent', e.target.value)}
          />
        </div>
      </div>

      {/* Bedrooms */}
      <div className="form-group">
        <label className="form-label">Bedrooms (BHK)</label>
        <div style={{ display: 'flex', gap: '0.35rem' }}>
          {bedroomOptions.map((b) => (
            <button
              key={b}
              type="button"
              onClick={() => handleChange('bedrooms', b)}
              className={`btn btn-sm ${filters.bedrooms === b ? 'btn-primary' : 'btn-outline'}`}
              style={{ flex: 1, padding: '0.4rem 0.2rem', textAlign: 'center' }}
            >
              {b === 'All' ? 'All' : `${b}+`}
            </button>
          ))}
        </div>
      </div>

      {/* Furnishing */}
      <div className="form-group">
        <label className="form-label">Furnishing Status</label>
        <select
          className="form-select"
          value={filters.furnishingStatus || 'All'}
          onChange={(e) => handleChange('furnishingStatus', e.target.value)}
        >
          {furnishingOptions.map((f) => (
            <option key={f} value={f}>
              {f}
            </option>
          ))}
        </select>
      </div>

      {/* Sort Order */}
      <div className="form-group">
        <label className="form-label">Sort Order</label>
        <select
          className="form-select"
          value={filters.sort || 'newest'}
          onChange={(e) => handleChange('sort', e.target.value)}
        >
          {sortOptions.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
      </div>

      <button
        onClick={onApply}
        className="btn btn-primary"
        style={{ width: '100%', marginTop: '0.5rem' }}
      >
        <Search size={16} /> Apply Filters
      </button>
    </div>
  );
};

export default PropertyFilter;
