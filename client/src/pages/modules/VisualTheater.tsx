import React from 'react';

const VisualTheater: React.FC = () => {
  return (
    <div className="w-full h-screen">
      <iframe 
        src="/teatro-visual/index.html" 
        className="w-full h-full border-0"
        title="Visual Theater"
      />
    </div>
  );
};

export default VisualTheater;