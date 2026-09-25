import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../../services/api';
import PropertyCard from '../../components/property/PropertyCard';
import PropertyFilter from '../../components/property/PropertyFilter';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { Search, Home, SlidersHorizontal, ChevronLeft, ChevronRight } from 'lucide-react';

const ExploreProperties = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const [filters, setFilters] = useState({
    city: searchParams.get('city') || '',
    propertyType: searchParams.get('propertyType') || 'All',
    minRent: searchParams.get('minRent') || '',
    maxRent: searchParams.get('maxRent') || '',
    bedrooms: searchParams.get('bedrooms') || 'All',
    furnishingStatus: searchParams.get('furnishingStatus') || 'All',
    sort: searchParams.get('sort') || 'newest',
    page: Number(searchParams.get('page')) || 1,
    limit: 9,
  });

  const fetchProperties = async (customFilters = filters) => {
    try {
      setLoading(true);
      const params = new URLSearchParams();

      if (customFilters.city) params.append('city', customFilters.city);
      if (customFilters.propertyType && customFilters.propertyType !== 'All') params.append('propertyType', customFilters.propertyType);
      if (customFilters.minRent) params.append('minRent', customFilters.minRent);
      if (customFilters.maxRent) params.append('maxRent', customFilters.maxRent);
      if (customFilters.bedrooms && customFilters.bedrooms !== 'All') params.append('bedrooms', customFilters.bedrooms);
      if (customFilters.furnishingStatus && customFilters.furnishingStatus !== 'All') params.append('furnishingStatus', customFilters.furnishingStatus);
      if (customFilters.sort) params.append('sort', customFilters.sort);
      params.append('page', customFilters.page);
      params.append('limit', customFilters.limit);

      const res = await api.get(`/properties?${params.toString()}`);
      if (res.data.success) {
        setProperties(res.data.data);
        setTotalCount(res.data.total);
        setTotalPages(res.data.pages);
      }
    } catch (error) {
      console.error('Failed to load properties:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties(filters);
  }, [filters.page, filters.sort]);

  const handleApplyFilters = () => {
    const newFilters = { ...filters, page: 1 };
    setFilters(newFilters);
    fetchProperties(newFilters);
    setMobileFilterOpen(false);

    // Sync to URL without causing full re-transitions
    const params = new URLSearchParams();
    if (newFilters.city) params.append('city', newFilters.city);
    if (newFilters.propertyType && newFilters.propertyType !== 'All') params.append('propertyType', newFilters.propertyType);
    if (newFilters.minRent) params.append('minRent', newFilters.minRent);
    if (newFilters.maxRent) params.append('maxRent', newFilters.maxRent);
    if (newFilters.bedrooms && newFilters.bedrooms !== 'All') params.append('bedrooms', newFilters.bedrooms);
    if (newFilters.furnishingStatus && newFilters.furnishingStatus !== 'All') params.append('furnishingStatus', newFilters.furnishingStatus);
    if (newFilters.sort) params.append('sort', newFilters.sort);
    setSearchParams(params, { replace: true });
  };

  const handleResetFilters = () => {
    const defaultFilters = {
      city: '',
      propertyType: 'All',
      minRent: '',
      maxRent: '',
      bedrooms: 'All',
      furnishingStatus: 'All',
      sort: 'newest',
      page: 1,
      limit: 9,
    };
    setFilters(defaultFilters);
    setSearchParams(new URLSearchParams(), { replace: true });
    fetchProperties(defaultFilters);
  };

  return (
    <div style={{ minHeight: 'calc(100vh - 76px)', background: 'radial-gradient(circle at 50% 10%, rgba(224, 35, 28, 0.07), transparent 50%), #05070a', color: '#f2f4f8' }}>
      <div className="container" style={{ padding: '3rem 1.5rem 5rem' }}>
        {/* Page Header */}
        <div style={{ marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '2.4rem', fontWeight: 800, color: '#ffffff' }}>
              Explore Verified Rental Properties
            </h1>
            <p style={{ color: '#94a3b8', marginTop: '0.25rem' }}>
              Showing {totalCount} verified homes available for lease
            </p>
          </div>

        <button
          onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
          className="btn btn-outline mobile-filter-btn"
          style={{ display: 'none' }}
        >
          <SlidersHorizontal size={18} /> Filters
        </button>
      </div>

      {/* Main Grid: Filters Sidebar + Properties Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '2rem' }} className="explore-layout">
        {/* Filter Sidebar */}
        <div className={`filter-sidebar-col ${mobileFilterOpen ? 'show-mobile' : ''}`}>
          <PropertyFilter
            filters={filters}
            setFilters={setFilters}
            onApply={handleApplyFilters}
            onReset={handleResetFilters}
          />
        </div>

        {/* Properties Container */}
        <div>
          {loading && properties.length === 0 ? (
            <div style={{ padding: '3rem 0', minHeight: '350px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <LoadingSpinner text="Searching available sanctuaries..." />
            </div>
          ) : properties.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
              <Home size={48} color="var(--primary-light)" style={{ opacity: 0.5, margin: '0 auto 1rem' }} />
              <h3 style={{ fontSize: '1.4rem', marginBottom: '0.5rem' }}>No properties found</h3>
              <p style={{ color: 'var(--text-secondary)', maxWidth: '450px', margin: '0 auto 1.5rem' }}>
                Try adjusting your search criteria, price range, or city filters to find matching listings.
              </p>
              <button onClick={handleResetFilters} className="btn btn-secondary">
                Reset All Filters
              </button>
            </div>
          ) : (
            <>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))',
                  gap: '1.5rem',
                  marginBottom: '2.5rem',
                  opacity: loading ? 0.65 : 1,
                  transition: 'opacity 0.2s ease',
                  position: 'relative',
                }}
              >
                {properties.map((property) => (
                  <PropertyCard key={property._id} property={property} />
                ))}
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: '0.75rem',
                    marginTop: '2rem',
                  }}
                >
                  <button
                    disabled={filters.page <= 1}
                    onClick={() => setFilters((p) => ({ ...p, page: p.page - 1 }))}
                    className="btn btn-outline btn-sm"
                  >
                    <ChevronLeft size={16} /> Previous
                  </button>
                  <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                    Page {filters.page} of {totalPages}
                  </span>
                  <button
                    disabled={filters.page >= totalPages}
                    onClick={() => setFilters((p) => ({ ...p, page: p.page + 1 }))}
                    className="btn btn-outline btn-sm"
                  >
                    Next <ChevronRight size={16} />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .explore-layout {
            grid-template-columns: 1fr !important;
          }
          .mobile-filter-btn {
            display: flex !important;
          }
          .filter-sidebar-col {
            display: none;
          }
          .filter-sidebar-col.show-mobile {
            display: block !important;
            margin-bottom: 1.5rem;
          }
        }
      `}</style>
      </div>
    </div>
  );
};

export default ExploreProperties;
