import React from 'react';
import Isometric3DPropertyCard from './Isometric3DPropertyCard';

const PropertyCard = ({ property, onFavoriteToggle, initialFavorited = false }) => {
  return (
    <Isometric3DPropertyCard
      property={property}
      onFavoriteToggle={onFavoriteToggle}
      initialFavorited={initialFavorited}
    />
  );
};

export default PropertyCard;
