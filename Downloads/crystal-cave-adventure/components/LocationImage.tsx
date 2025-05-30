
import React from 'react';

interface LocationImageProps {
  imageUrl: string;
  altText: string;
}

export const LocationImage: React.FC<LocationImageProps> = ({ imageUrl, altText }) => {
  if (!imageUrl) return null;

  return (
    <div className="w-full h-48 md:h-64 bg-gray-700 flex items-center justify-center overflow-hidden">
      <img src={imageUrl} alt={altText} className="w-full h-full object-cover" />
    </div>
  );
};