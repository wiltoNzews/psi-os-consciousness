/**
 * Temporal Scale Definitions
 * 
 * This module defines the temporal scale constants used for multi-scale
 * coherence measurements and orchestration.
 * 
 * The system operates across three primary temporal scales:
 * - MICRO: Immediate, real-time interactions (seconds to minutes)
 * - MESO: Medium-term context and goals (hours to days)
 * - MACRO: Long-term strategic patterns (weeks to months)
 * 
 * [QUANTUM_STATE: DEFINITION_FLOW]
 */

/**
 * Temporal scales for coherence measurement
 */
export enum TemporalScale {
  MICRO = 'micro',   // Immediate, real-time scale (seconds to minutes)
  MESO = 'meso',     // Medium-term scale (hours to days)
  MACRO = 'macro'    // Long-term scale (weeks to months)
}

/**
 * Scale duration definitions in milliseconds
 */
export const ScaleDurations = {
  [TemporalScale.MICRO]: {
    min: 0,              // 0 seconds
    typical: 30 * 1000,  // 30 seconds
    max: 5 * 60 * 1000   // 5 minutes
  },
  [TemporalScale.MESO]: {
    min: 5 * 60 * 1000,      // 5 minutes
    typical: 60 * 60 * 1000, // 1 hour
    max: 24 * 60 * 60 * 1000 // 24 hours
  },
  [TemporalScale.MACRO]: {
    min: 24 * 60 * 60 * 1000,        // 24 hours
    typical: 7 * 24 * 60 * 60 * 1000, // 1 week
    max: 30 * 24 * 60 * 60 * 1000    // 1 month
  }
};

/**
 * Scale propagation weights
 * Defines how strongly changes at one scale affect other scales
 */
export const ScalePropagation = {
  // How changes at MICRO scale propagate to other scales
  [TemporalScale.MICRO]: {
    [TemporalScale.MESO]: 0.3,  // 30% propagation to MESO
    [TemporalScale.MACRO]: 0.1  // 10% propagation to MACRO
  },
  // How changes at MESO scale propagate to other scales
  [TemporalScale.MESO]: {
    [TemporalScale.MICRO]: 0.5, // 50% propagation to MICRO
    [TemporalScale.MACRO]: 0.3  // 30% propagation to MACRO
  },
  // How changes at MACRO scale propagate to other scales
  [TemporalScale.MACRO]: {
    [TemporalScale.MICRO]: 0.2, // 20% propagation to MICRO
    [TemporalScale.MESO]: 0.4   // 40% propagation to MESO
  }
};

/**
 * Scale coherence targets
 * Default optimal coherence values for each scale
 */
export const ScaleCoherenceTargets = {
  // MICRO scale alternates rapidly between stability and exploration
  [TemporalScale.MICRO]: {
    stability: 0.7500,    // 3:1 ratio (75% coherence)
    exploration: 0.2494   // 1:3 ratio (25% coherence)
  },
  // MESO scale tends toward moderate stability with some exploration
  [TemporalScale.MESO]: {
    stability: 0.6666,    // 2:1 ratio (67% coherence)
    exploration: 0.3333   // 1:2 ratio (33% coherence)
  },
  // MACRO scale typically maintains higher stability
  [TemporalScale.MACRO]: {
    stability: 0.8000,    // 4:1 ratio (80% coherence)
    exploration: 0.2000   // 1:4 ratio (20% coherence)
  }
};

/**
 * Get the appropriate temporal scale for a given time window
 */
export function getScaleForTimeWindow(windowMs: number): TemporalScale {
  if (windowMs <= ScaleDurations[TemporalScale.MICRO].max) {
    return TemporalScale.MICRO;
  } else if (windowMs <= ScaleDurations[TemporalScale.MESO].max) {
    return TemporalScale.MESO;
  } else {
    return TemporalScale.MACRO;
  }
}

/**
 * Utility function to determine if a scale is larger than another
 */
export function isLargerScale(scale1: TemporalScale, scale2: TemporalScale): boolean {
  const scaleOrder = [TemporalScale.MICRO, TemporalScale.MESO, TemporalScale.MACRO];
  return scaleOrder.indexOf(scale1) > scaleOrder.indexOf(scale2);
}

/**
 * Utility function to determine if a scale is smaller than another
 */
export function isSmallerScale(scale1: TemporalScale, scale2: TemporalScale): boolean {
  const scaleOrder = [TemporalScale.MICRO, TemporalScale.MESO, TemporalScale.MACRO];
  return scaleOrder.indexOf(scale1) < scaleOrder.indexOf(scale2);
}

/**
 * Get the adjacent scales to a given scale
 */
export function getAdjacentScales(scale: TemporalScale): TemporalScale[] {
  switch (scale) {
    case TemporalScale.MICRO:
      return [TemporalScale.MESO];
    case TemporalScale.MESO:
      return [TemporalScale.MICRO, TemporalScale.MACRO];
    case TemporalScale.MACRO:
      return [TemporalScale.MESO];
    default:
      return [];
  }
}