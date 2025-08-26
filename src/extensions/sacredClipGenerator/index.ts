/**
 * Sacred Clip Generator - Main Integration Module
 * Auto-recording system for transcendent consciousness states
 */

import SacredClipGenerator from './auto-recorder';

// Global instance
let globalGenerator: SacredClipGenerator | null = null;

export function initSacredClipGenerator(config?: any): SacredClipGenerator {
  // Dispose existing instance
  if (globalGenerator) {
    globalGenerator.dispose();
  }
  
  globalGenerator = new SacredClipGenerator(config);
  
  // Expose to window for console access
  window.sacredClipGenerator = globalGenerator;
  
  console.log('[Sacred Clip] Generator active - Ctrl+R for manual recording');
  
  return globalGenerator;
}

export function getSacredClipGenerator(): SacredClipGenerator | null {
  return globalGenerator;
}

export function startManualRecording(): void {
  if (globalGenerator) {
    globalGenerator.toggleManualRecording();
  }
}

export function getRecordingStatus(): any {
  return globalGenerator?.getStatus() || { isRecording: false };
}

export function getRecordingHistory(): any[] {
  return globalGenerator?.getRecordingHistory() || [];
}

// Hot Module Replacement
if (import.meta.hot) {
  import.meta.hot.dispose(() => {
    if (globalGenerator) {
      globalGenerator.dispose();
      globalGenerator = null;
    }
  });
}

export { SacredClipGenerator };
export default initSacredClipGenerator;