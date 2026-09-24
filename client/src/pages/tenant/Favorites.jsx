import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import PropertyCard from '../../components/property/PropertyCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { Bookmark, Search } from 'lucide-react';

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFavorites = async () => {
    try {
      setLoading(true);
      const res = await api.get('/favorites');
      if (res.data.success) {
        setFavorites(res.data.data);
      }
    } catch (error) {
      console.error('Failed to load favorites:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  const handleRemoveFavorite = (propertyId) => {
    setFavorites((prev) => prev.filter((p) => p._id !== propertyId));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div className="card" style={{ padding: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Saved Favorite Properties</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
            Bookmarked residences for quick comparison and lease application
          </p>
        </div>
        <Link to="/explore" className="btn btn-outline btn-sm">
          <Search size={14} /> Explore More
        </Link>
      </div>

      {loading ? (
        <LoadingSpinner text="Loading saved properties..." />
      ) : favorites.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <Bookmark size={48} color="var(--primary-light)" style={{ opacity: 0.4, margin: '0 auto 1rem' }} />
          <h3 style={{ fontSize: '1.3rem', marginBottom: '0.5rem' }}>No saved properties</h3>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '450px', margin: '0 auto 1.5rem' }}>
            Click the heart icon on any property in the explore catalog to bookmark it here for later.
          </p>
          <Link to="/explore" className="btn btn-primary">
            Browse Properties
          </Link>
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))',
            gap: '1.5rem',
          }}
        >
          {favorites.map((prop) => (
            <PropertyCard
              key={prop._id}
              property={prop}
              initialFavorited={true}
              onFavoriteToggle={(id, isFav) => !isFav && handleRemoveFavorite(id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Favorites;
