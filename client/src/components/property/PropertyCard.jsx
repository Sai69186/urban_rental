import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bed, Bath, Maximize2, MapPin, Heart } from 'lucide-react';
import Badge from '../common/Badge';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const PropertyCard = ({ property, onFavoriteToggle, initialFavorited = false }) => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isFavorited, setIsFavorited] = useState(initialFavorited);
  const [savingFav, setSavingFav] = useState(false);

  const handleFavoriteClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (user?.role !== 'tenant') {
      alert('Only tenants can save favorite properties.');
      return;
    }

    try {
      setSavingFav(true);
      const res = await api.post('/favorites/toggle', { propertyId: property._id });
      if (res.data.success) {
        setIsFavorited(res.data.isFavorited);
        if (onFavoriteToggle) onFavoriteToggle(property._id, res.data.isFavorited);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    } finally {
      setSavingFav(false);
    }
  };

  const mainImage =
    property.images && property.images.length > 0
      ? property.images[0]
      : 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80';

  return (
    <div className="bg-slate-900/90 backdrop-blur-md border border-slate-800 hover:border-indigo-500/50 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col group">
      {/* Property Image with Zoom & Floating Tags */}
      <div className="relative h-56 w-full overflow-hidden">
        <img
          src={mainImage}
          alt={property.title}
          className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
        />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex gap-2 z-10">
          <Badge status={property.availabilityStatus} />
          <span className="badge badge-primary backdrop-blur-md">
            {property.propertyType}
          </span>
        </div>

        {/* Favorite Button */}
        {user?.role !== 'owner' && user?.role !== 'admin' && (
          <button
            onClick={handleFavoriteClick}
            disabled={savingFav}
            className="absolute top-3 right-3 w-9 h-9 rounded-full bg-slate-900/75 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:scale-110 active:scale-95 transition-all z-10"
          >
            <Heart
              size={18}
              className={isFavorited ? 'text-rose-500 fill-rose-500' : 'text-white'}
            />
          </button>
        )}

        {/* Rent Tag Floating Banner */}
        <div className="absolute bottom-3 left-3 bg-slate-950/85 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-700/80 shadow-md">
          <span className="text-lg font-extrabold text-white">
            ₹{property.rent?.toLocaleString()}
          </span>
          <span className="text-xs text-slate-400 ml-1">/mo</span>
        </div>
      </div>

      {/* Property Details */}
      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1.5">
          <MapPin size={14} className="text-indigo-400 shrink-0" />
          <span className="truncate">{property.city}, {property.state}</span>
        </div>

        <h4 className="text-base font-bold text-white mb-2 line-clamp-1 group-hover:text-indigo-300 transition-colors">
          {property.title}
        </h4>

        {/* Specs Pill Row */}
        <div className="flex items-center justify-between py-3 border-y border-slate-800/80 my-2 text-xs font-semibold text-slate-300">
          <span className="flex items-center gap-1.5">
            <Bed size={15} className="text-sky-400" /> {property.bedrooms} Beds
          </span>
          <span className="flex items-center gap-1.5">
            <Bath size={15} className="text-sky-400" /> {property.bathrooms} Baths
          </span>
          <span className="flex items-center gap-1.5">
            <Maximize2 size={15} className="text-sky-400" /> {property.area} sq ft
          </span>
        </div>

        {/* Footer info & CTA */}
        <div className="flex items-center justify-between mt-auto pt-3">
          <span className="text-xs text-slate-400 font-medium">
            Deposit: ₹{property.securityDeposit?.toLocaleString()}
          </span>
          <Link
            to={`/properties/${property._id}`}
            className="btn btn-primary btn-sm shadow-md hover:shadow-indigo-500/30"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
