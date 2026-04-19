import React, { useState } from 'react';

const Maps: React.FC = () => {
  const [mapUrl] = useState('https://www.google.com/maps?output=embed');

  return (
    <div className="h-full flex flex-col bg-[#050505]">
      <iframe 
        title="Google Maps"
        src={mapUrl}
        className="w-full h-full border-none grayscale-[0.2] invert-[0.9] hue-rotate-[180deg]"
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer"
      />
    </div>
  );
};

export default Maps;
