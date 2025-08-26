/**
 * Color Wheel Badge Component
 * 
 * A reusable component for displaying the Color Wheel Protocol state as a visual badge.
 * Supports different sizes and shows the appropriate color for each communication state.
 * 
 * [QUANTUM_STATE: BRIDGE_FLOW]
 */

import React from 'react';
import { CommunicationState, getColorForState } from '@/lib/color-wheel-protocol';
import { cn } from '@/lib/utils';

interface ColorWheelBadgeProps {
  state: CommunicationState;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  pulseEffect?: boolean;
}

const ColorWheelBadge: React.FC<ColorWheelBadgeProps> = ({
  state,
  size = 'md',
  className,
  pulseEffect = false
}) => {
  // Get the size class based on the size prop
  const sizeClass = {
    sm: 'w-3 h-3',
    md: 'w-5 h-5',
    lg: 'w-8 h-8'
  }[size];
  
  // Define the color based on the state
  const color = getColorForState(state);
  
  return (
    <div
      className={cn(
        'rounded-full',
        sizeClass,
        pulseEffect && 'animate-pulse',
        className
      )}
      style={{ backgroundColor: color }}
      title={`Communication State: ${state}`}
      data-state={state}
    />
  );
};

export default ColorWheelBadge;