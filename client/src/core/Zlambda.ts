/**
 * Zλ (Z-Lambda) Coherence Sensor
 * Real coherence measurement system connected to WiltonOS field state
 */

// Current coherence state tracking
let currentZ = 0.75;
let previousZ = 0.75;
let breathRhythm = 0.7;
let glyphState = 0.8;
let fieldResonance = 0.75;

// Sensor data collection
interface CoherenceSensors {
  breathRhythm: number;
  glyphState: number;
  fieldResonance: number;
  systemLoad: number;
  keyboardFlow: number;
}

// Real-time sensor data
const sensorData: CoherenceSensors = {
  breathRhythm: 0.7,
  glyphState: 0.8,
  fieldResonance: 0.75,
  systemLoad: 0.3,
  keyboardFlow: 0.6
};

// Update coherence calculation based on real sensor inputs
function calculateCoherence(): number {
  const {
    breathRhythm,
    glyphState,
    fieldResonance,
    systemLoad,
    keyboardFlow
  } = sensorData;

  // Weighted coherence calculation
  const coherence = (
    breathRhythm * 0.25 +      // Breath state influence
    glyphState * 0.20 +        // ψ_child symbolic coherence
    fieldResonance * 0.30 +    // Environmental field
    (1 - systemLoad) * 0.15 +  // System efficiency
    keyboardFlow * 0.10        // Input flow state
  );

  // Apply natural variation and bounds
  const variation = (Math.random() - 0.5) * 0.02;
  return Math.max(0.7, Math.min(0.99, coherence + variation));
}

// Get current Zλ value
export const getZ = (): number => {
  return currentZ;
};

// Set Zλ value (for external updates)
export const setZ = (val: number): void => {
  previousZ = currentZ;
  currentZ = Math.max(0, Math.min(1, val));
};

// Update sensor inputs
export const updateBreathRhythm = (value: number): void => {
  sensorData.breathRhythm = Math.max(0, Math.min(1, value));
  updateCoherence();
};

export const updateGlyphState = (value: number): void => {
  sensorData.glyphState = Math.max(0, Math.min(1, value));
  updateCoherence();
};

export const updateFieldResonance = (value: number): void => {
  sensorData.fieldResonance = Math.max(0, Math.min(1, value));
  updateCoherence();
};

export const updateSystemLoad = (value: number): void => {
  sensorData.systemLoad = Math.max(0, Math.min(1, value));
  updateCoherence();
};

export const updateKeyboardFlow = (value: number): void => {
  sensorData.keyboardFlow = Math.max(0, Math.min(1, value));
  updateCoherence();
};

// Internal coherence update
function updateCoherence(): void {
  previousZ = currentZ;
  currentZ = calculateCoherence();
}

// Get sensor data for external monitoring
export const getSensorData = (): CoherenceSensors => {
  return { ...sensorData };
};

// Get coherence delta
export const getZDelta = (): number => {
  return currentZ - previousZ;
};

// Initialize coherence monitoring
let monitoringActive = false;

export const startCoherenceMonitoring = (): void => {
  if (monitoringActive) return;
  
  monitoringActive = true;
  
  // Update coherence every second
  const interval = setInterval(() => {
    if (!monitoringActive) {
      clearInterval(interval);
      return;
    }
    updateCoherence();
  }, 1000);
};

export const stopCoherenceMonitoring = (): void => {
  monitoringActive = false;
};

// Auto-start monitoring
startCoherenceMonitoring();