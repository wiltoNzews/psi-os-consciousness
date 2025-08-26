import React from 'react';
import HyperSimple from './pages/hyper-simple';

/**
 * StandaloneApp - A completely standalone app outside the normal app structure
 * 
 * This component is designed to completely bypass the normal application structure,
 * avoiding all providers, contexts, and other potential sources of the API call issue.
 */
export default function StandaloneApp() {
  return (
    <div className="min-h-screen w-full bg-black text-white">
      <HyperSimple />
    </div>
  );
}