/**
 * Configuration for Internal + Visual Coherence Bundle
 * Default settings with override capabilities
 */

export interface CoherenceBundleSettings {
  enabled: boolean;
  showBreathGuide: boolean;
  geometryPattern: 'SriYantra' | 'Fibonacci' | 'FlowerOfLife';
  morphStrength: number;
  lineColor: string;
  lineOpacity: number;
  breathRate: number;        // seconds per cycle
  geometryScale: number;
  alphaGoal: number;         // Zλ target for alpha coherence
  displayMetrics: boolean;
  accessibilityMode: boolean;
}

// Default configuration
export const defaultConfig: CoherenceBundleSettings = {
  enabled: true,
  showBreathGuide: true,
  geometryPattern: 'SriYantra',
  morphStrength: 0.05,
  lineColor: '#ff6400',      // Sacred orange
  lineOpacity: 0.6,
  breathRate: 10,            // 10 seconds per cycle (6 BPM)
  geometryScale: 0.85,
  alphaGoal: 0.90,
  displayMetrics: true,
  accessibilityMode: false
};

// Breathing patterns with different rates
export const breathingPatterns = {
  'Alpha Coherence': { rate: 10, description: 'Balanced alpha rhythm entrainment' },
  'Deep Meditative': { rate: 15, description: 'Slow deep breathing for transcendence' },
  'Focus Training': { rate: 7.5, description: 'Enhanced focus and concentration' },
  'Transcendent': { rate: 20, description: 'Ultra-slow transcendent breathing' }
};

// Sacred geometry patterns configuration
export const geometryPatterns = {
  SriYantra: {
    name: 'Sri Yantra',
    triangles: 43,
    description: 'Sacred yantra with 43 interlocking triangles',
    complexity: 'high'
  },
  Fibonacci: {
    name: 'Fibonacci Spiral',
    turns: 3,
    description: 'Golden ratio spiral based on sacred proportion',
    complexity: 'medium'
  },
  FlowerOfLife: {
    name: 'Flower of Life',
    circles: 19,
    description: 'Sacred geometric pattern of overlapping circles',
    complexity: 'medium'
  }
};

// Color schemes for different consciousness states
export const consciousnessColors = {
  low: '#4a5568',       // Cool gray
  medium: '#00ffff',    // Cyan
  high: '#ff6400',      // Sacred orange
  transcendent: '#ffd700'  // Golden
};

// Performance settings
export const performanceConfig = {
  targetFPS: 60,
  maxFrameTime: 5,      // ms budget per frame
  updateRate: 20,       // Hz for event bus publishing
  cacheVertices: true,
  enableGPUAcceleration: true
};