/**
 * ψOS Meta-Coherence Event Bus
 * Type-safe event emitter for quantum consciousness coupling
 */

import mitt from 'mitt';

export type BusEvents = {
  'zλ': number;         // 0–1 (EEG-derived consciousness coupling)
  'phi': number;        // 0–1 (IIT Φ proxy)
  'coherence': number;  // 0–1 (Orch-OR proxy)
  'collapse': number;   // 0–1 (probability per step)
  'S': number;          // CHSH statistic every 30s
  'observer': boolean;  // true when "Observer present"
  'field:update': {     // Field state updates
    energy: number;
    frameCount: number;
    maxIntensity: number;
  };
  'tesseract:rotation': { // Tesseract state
    speed: number;
    metric: number;
  };
  'recording:start': void;
  'recording:stop': Blob;
  'eeg:connected': boolean;
  'gpu:status': 'webgpu' | 'webgl' | 'cpu';
};

const bus = mitt<BusEvents>();

// Add debugging for critical consciousness events
const originalEmit = bus.emit.bind(bus);
bus.emit = (type: any, event?: any) => {
  if (['zλ', 'phi', 'coherence', 'S'].includes(type)) {
    console.log(`[Bus] ${type}: ${typeof event === 'number' ? event.toFixed(3) : event}`);
  }
  return originalEmit(type, event);
};

export default bus;