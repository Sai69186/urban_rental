import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Bed, Bath, Maximize2, MapPin, Heart, ArrowUpRight, CheckCircle2 } from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const Isometric3DPropertyCard = ({ property, onFavoriteToggle, initialFavorited = false }) => {
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
      const res = await api.post('/favorites/toggle', { propertyId: property._id || property.id });
      if (res.data.success) {
        setIsFavorited(res.data.isFavorited);
        if (onFavoriteToggle) onFavoriteToggle(property._id || property.id, res.data.isFavorited);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    } finally {
      setSavingFav(false);
    }
  };

  const rawRent = property.pricing?.rentAmount || property.rent || property.price || 45000;
  const formattedRent = rawRent >= 100000 
    ? `₹${(rawRent / 100000).toFixed(1)}L` 
    : `₹${(rawRent / 1000).toFixed(0)}K`;

  const mainImage =
    property.images && property.images.length > 0
      ? property.images[0]
      : property.image ||
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80';

  const bedrooms = property.specifications?.bedrooms || property.bedrooms || 2;
  const bathrooms = property.specifications?.bathrooms || property.bathrooms || 2;
  const area = property.specifications?.carpetArea || property.carpetArea || property.area || 1250;
  const city = property.location?.city || property.city || 'Bangalore';
  const address = property.location?.address ? `${property.location.address}, ${city}` : city;
  const propType = property.propertyType || 'Residence';
  const propId = property._id || property.id;

  return (
    <StyledWrapper>
      <div className="parent">
        <div className="card">
          {/* Floating 3D Price / Status Box */}
          <div className="date-box">
            <span className="month">{propType}</span>
            <span className="date">{formattedRent}</span>
            <span className="sub">/mo</span>
          </div>

          {/* Floating Favorite Heart Button */}
          {user?.role !== 'owner' && user?.role !== 'admin' && (
            <button
              onClick={handleFavoriteClick}
              disabled={savingFav}
              className="fav-btn"
              title="Save to Favorites"
            >
              <Heart
                size={16}
                className={isFavorited ? 'fav-active' : ''}
              />
            </button>
          )}

          {/* 3D Elevated Content Box */}
          <div className="content-box">
            {/* Elevated Media Image */}
            <div className="media-box">
              <img src={mainImage} alt={property.title} className="card-img" loading="lazy" />
              <div className="badge-tag">
                <CheckCircle2 size={12} /> Verified
              </div>
            </div>

            {/* Location & Title */}
            <div className="location-row">
              <MapPin size={13} style={{ color: 'var(--kage-vermilion, #e0231c)', flexShrink: 0 }} />
              <span className="location-text">{address}</span>
            </div>

            <h3 className="card-title">{property.title}</h3>

            {/* Specifications Row */}
            <div className="card-content">
              <div className="spec-pill">
                <Bed size={13} /> <b>{bedrooms}</b> BHK
              </div>
              <div className="spec-pill">
                <Bath size={13} /> <b>{bathrooms}</b> Bath
              </div>
              <div className="spec-pill">
                <Maximize2 size={13} /> <b>{area}</b> sq.ft
              </div>
            </div>

            {/* Action Button */}
            <Link to={`/properties/${propId}`} className="see-more">
              <span>View Sanctuary</span>
              <ArrowUpRight size={13} />
            </Link>
          </div>
        </div>
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;

  .parent {
    width: 100%;
    max-width: 380px;
    padding: 8px 4px;
    perspective: 1000px;
  }

  .card {
    position: relative;
    padding-top: 26px;
    border-radius: 18px;
    border: 2px solid rgba(224, 35, 28, 0.35);
    transform-style: preserve-3d;
    background: linear-gradient(135deg, rgba(5, 7, 10, 0.92) 18.75%, rgba(20, 25, 34, 0.95) 0 31.25%, rgba(5, 7, 10, 0.92) 0),
      repeating-linear-gradient(45deg, rgba(224, 35, 28, 0.06) -6.25% 6.25%, #080c14 0 18.75%);
    background-size: 60px 60px;
    background-position: 0 0, 0 0;
    background-color: #070a0f;
    width: 100%;
    box-shadow: 0 15px 35px -8px rgba(0, 0, 0, 0.9), 0 0 18px rgba(224, 35, 28, 0.12);
    transition: all 0.5s cubic-bezier(0.22, 0.61, 0.36, 1);
    cursor: pointer;
  }

  .card:hover {
    background-position: -100px 100px, -100px 100px;
    transform: rotate3d(0.5, 1, 0, 22deg);
    border-color: #e0231c;
    box-shadow: 0 25px 50px -10px rgba(0, 0, 0, 0.95), 0 0 30px rgba(224, 35, 28, 0.3);
  }

  .date-box {
    position: absolute;
    top: 10px;
    right: 12px;
    min-width: 70px;
    background: #05070a;
    border: 1.5px solid #e0231c;
    border-radius: 10px;
    padding: 5px 8px;
    transform: translate3d(0px, 0px, 75px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.8), 0 0 12px rgba(224, 35, 28, 0.3);
    z-index: 10;
    text-align: center;
    transition: transform 0.4s ease, border-color 0.4s ease;
  }

  .date-box span {
    display: block;
    line-height: 1.1;
  }

  .date-box .month {
    color: #ff5a3c;
    font-size: 8px;
    font-weight: 800;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    margin-bottom: 2px;
  }

  .date-box .date {
    font-size: 15px;
    font-weight: 900;
    color: #ffffff;
    letter-spacing: -0.02em;
  }

  .date-box .sub {
    font-size: 8.5px;
    font-weight: 600;
    color: #94a3b8;
  }

  .fav-btn {
    position: absolute;
    top: 10px;
    left: 12px;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: rgba(5, 7, 10, 0.85);
    border: 1px solid rgba(255, 255, 255, 0.15);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #cbd5e1;
    transform: translate3d(0px, 0px, 65px);
    z-index: 10;
    cursor: pointer;
    transition: transform 0.3s ease, background 0.3s ease;
  }

  .fav-btn:hover {
    transform: translate3d(0px, 0px, 80px) scale(1.1);
    color: #f43f5e;
    border-color: #f43f5e;
  }

  .fav-active {
    color: #f43f5e;
    fill: #f43f5e;
  }

  .content-box {
    background: rgba(11, 16, 24, 0.95);
    border-radius: 14px;
    border: 1px solid rgba(223, 231, 224, 0.1);
    transition: all 0.5s cubic-bezier(0.22, 0.61, 0.36, 1);
    padding: 12px 14px;
    transform-style: preserve-3d;
    margin: 0 8px 8px 8px;
  }

  .media-box {
    position: relative;
    width: 100%;
    height: 135px;
    border-radius: 10px;
    overflow: hidden;
    margin-bottom: 8px;
    transform: translate3d(0px, 0px, 35px);
    transition: transform 0.5s ease;
    background: #020305;
  }

  .card:hover .media-box {
    transform: translate3d(0px, 0px, 45px);
  }

  .card-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.6s ease;
  }

  .card:hover .card-img {
    transform: scale(1.08);
  }

  .badge-tag {
    position: absolute;
    bottom: 6px;
    left: 6px;
    background: rgba(16, 185, 129, 0.85);
    color: #ffffff;
    font-size: 9.5px;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    padding: 2.5px 7px;
    border-radius: 5px;
    display: inline-flex;
    align-items: center;
    gap: 3px;
    backdrop-filter: blur(8px);
  }

  .location-row {
    display: flex;
    align-items: center;
    gap: 5px;
    margin-bottom: 4px;
    transform: translate3d(0px, 0px, 40px);
    transition: transform 0.5s ease;
  }

  .location-text {
    font-size: 11.5px;
    color: #94a3b8;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .content-box .card-title {
    display: block;
    color: #ffffff;
    font-size: 14.5px;
    font-weight: 700;
    line-height: 1.25;
    margin-bottom: 6px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    transition: all 0.5s ease-in-out;
    transform: translate3d(0px, 0px, 45px);
  }

  .content-box .card-title:hover {
    transform: translate3d(0px, 0px, 60px);
    color: #ff5a3c;
  }

  .content-box .card-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 6px;
    padding: 6px 0;
    border-top: 1px solid rgba(255, 255, 255, 0.08);
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
    margin-bottom: 8px;
    transition: all 0.5s ease-in-out;
    transform: translate3d(0px, 0px, 30px);
  }

  .content-box .card-content:hover {
    transform: translate3d(0px, 0px, 45px);
  }

  .spec-pill {
    font-size: 11px;
    color: #cbd5e1;
    display: flex;
    align-items: center;
    gap: 3px;
  }

  .spec-pill svg {
    color: #ff5a3c;
  }

  .spec-pill b {
    color: #ffffff;
    font-weight: 700;
  }

  .content-box .see-more {
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 5px;
    width: 100%;
    font-weight: 700;
    font-size: 10.5px;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: #ffffff;
    background: #e0231c;
    border-radius: 8px;
    padding: 7px 12px;
    text-decoration: none;
    box-shadow: 0 3px 14px rgba(224, 35, 28, 0.35);
    transition: all 0.5s ease-in-out;
    transform: translate3d(0px, 0px, 20px);
  }

  .content-box .see-more:hover {
    transform: translate3d(0px, 0px, 45px);
    background: #c41e17;
    box-shadow: 0 5px 20px rgba(224, 35, 28, 0.5);
  }
`;

export default Isometric3DPropertyCard;
