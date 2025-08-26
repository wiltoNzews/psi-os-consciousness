import React from 'react';

const WiltonOSCodex: React.FC = () => {
  return (
    <div className="w-full h-screen">
      <iframe 
        src="/codex/index.html" 
        className="w-full h-full border-0"
        title="WiltonOS Codex"
      />
    </div>
  );
};

export default WiltonOSCodex;