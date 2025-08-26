/**
 * Coherence Ratio Indicator
 * 
 * Visual indicator showing the current coherence ratio in relation to
 * stability and exploration thresholds.
 */

import React from 'react';

// Constants for thresholds
const STABILITY_COHERENCE = 0.7500;
const EXPLORATION_COHERENCE = 0.2494;

// Helper function to format numbers
const formatNumber = (value) => {
  return parseFloat(value.toFixed(4));
};

const CoherenceRatioIndicator = ({ value, showTarget = true, size = 'medium' }) => {
  // Calculate percentage for the indicator
  const percentage = Math.min(Math.max(value, 0), 1) * 100;
  
  // Determine status based on thresholds
  const getStatus = () => {
    if (Math.abs(value - STABILITY_COHERENCE) < 0.01) {
      return 'stability';
    } else if (Math.abs(value - EXPLORATION_COHERENCE) < 0.01) {
      return 'exploration';
    } else if (value > STABILITY_COHERENCE) {
      return 'high-stability';
    } else if (value < EXPLORATION_COHERENCE) {
      return 'high-exploration';
    } else {
      return 'balanced';
    }
  };
  
  const status = getStatus();
  
  // Determine colors based on status
  const getStatusColor = () => {
    switch (status) {
      case 'stability':
      case 'high-stability':
        return '#0a84ff';
      case 'exploration':
      case 'high-exploration':
        return '#ff375f';
      case 'balanced':
        return '#30d158';
      default:
        return '#8e8e93';
    }
  };
  
  // Get label text based on status
  const getStatusLabel = () => {
    switch (status) {
      case 'stability':
        return 'Stability Threshold';
      case 'high-stability':
        return 'High Stability';
      case 'exploration':
        return 'Exploration Threshold'; 
      case 'high-exploration':
        return 'High Exploration';
      case 'balanced':
        return 'Balanced Coherence';
      default:
        return 'Unknown';
    }
  };
  
  // Size-based dimensions
  const getDimensions = () => {
    switch (size) {
      case 'small':
        return {
          width: 150,
          height: 8,
          fontSize: 12
        };
      case 'large':
        return {
          width: 300,
          height: 16,
          fontSize: 16
        };
      case 'medium':
      default:
        return {
          width: 220,
          height: 12,
          fontSize: 14
        };
    }
  };
  
  const dimensions = getDimensions();
  
  // Marker positions for stability and exploration thresholds
  const stabilityMarker = STABILITY_COHERENCE * 100;
  const explorationMarker = EXPLORATION_COHERENCE * 100;
  
  return (
    <div className="flex flex-col items-center">
      <div className="mb-1 text-sm font-medium">
        {getStatusLabel()}: {formatNumber(value)}
      </div>
      
      <div 
        className="relative rounded-full w-full overflow-hidden bg-gray-200 dark:bg-gray-700"
        style={{ height: dimensions.height }}
      >
        {/* Progress bar */}
        <div 
          className="h-full rounded-full transition-all duration-500"
          style={{ 
            width: `${percentage}%`,
            backgroundColor: getStatusColor() 
          }}
        />
        
        {/* Stability threshold marker */}
        {showTarget && (
          <div 
            className="absolute top-0 h-full w-0.5 bg-blue-500"
            style={{ 
              left: `${stabilityMarker}%`,
              backgroundColor: '#0a84ff' 
            }}
          >
            <div className="absolute -top-3 -ml-1 w-2 h-2 rounded-full bg-blue-500" />
          </div>
        )}
        
        {/* Exploration threshold marker */}
        {showTarget && (
          <div 
            className="absolute top-0 h-full w-0.5 bg-red-500"
            style={{ 
              left: `${explorationMarker}%`,
              backgroundColor: '#ff375f' 
            }}
          >
            <div className="absolute -top-3 -ml-1 w-2 h-2 rounded-full bg-red-500" />
          </div>
        )}
      </div>
      
      {/* Value labels */}
      <div className="w-full flex justify-between mt-1">
        <span className="text-xs text-gray-500">0.0</span>
        {showTarget && (
          <>
            <span className="text-xs text-red-500">{formatNumber(EXPLORATION_COHERENCE)}</span>
            <span className="text-xs text-blue-500">{formatNumber(STABILITY_COHERENCE)}</span>
          </>
        )}
        <span className="text-xs text-gray-500">1.0</span>
      </div>
    </div>
  );
};

export default CoherenceRatioIndicator;