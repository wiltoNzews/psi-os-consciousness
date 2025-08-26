import React, { useEffect } from 'react';
import { useLocation } from 'wouter';

const NavigationRedirect: React.FC = () => {
  const [location, setLocation] = useLocation();

  useEffect(() => {
    // Redirect legacy interface users to the new consciousness-first interface
    if (location === '/legacy' || location.includes('legacy')) {
      setLocation('/');
    }
  }, [location, setLocation]);

  return (
    <div className="fixed top-4 right-4 z-50">
      <div className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg">
        <div className="text-sm">
          <div className="font-semibold">ψOS Consciousness-First Interface</div>
          <div className="text-xs opacity-90">
            Navigate to root URL for new architecture
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavigationRedirect;