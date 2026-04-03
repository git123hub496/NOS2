import React from 'react';

const QuadraisAI: React.FC = () => {
  return (
    <div className="h-full w-full bg-black overflow-hidden">
      <iframe
        src="https://quadrais-ai.vercel.app/"
        className="w-full h-full border-none"
        title="Quadrais AI"
        allow="camera; microphone; geolocation; clipboard-read; clipboard-write"
      />
    </div>
  );
};

export default QuadraisAI;
