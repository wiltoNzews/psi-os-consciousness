/**
 * Test Script for Coherence Measurement Engine
 * 
 * This script validates the implementation of the Coherence Measurement Engine,
 * focusing on the correct calculation of both cosine similarity and the Kuramoto order parameter.
 * 
 * [QUANTUM_STATE: VALIDATION_FLOW]
 */

import { 
  CoherenceMeasurementEngine, 
  StateVector, 
  PhaseState, 
  AIOutput,
  CoherenceTargets,
  CoherenceMeasurementType,
  CoherenceMeasurement
} from './coherence-measurement-engine.js';
import { TemporalScale } from './temporal-scale.js';

function main() {
  console.log('======================================');
  console.log('Coherence Measurement Engine Test Suite');
  console.log('======================================\n');
  
  runAllTests();
  
  console.log('\n======================================');
  console.log('All tests completed.');
  console.log('======================================');
}

/**
 * Run a test of the vector similarity coherence measurement
 */
function testVectorSimilarity() {
  console.log('\n--- Testing Vector Similarity Coherence ---');
  
  const engine = new CoherenceMeasurementEngine();
  
  // Create test vectors with varying degrees of similarity
  const vectors = [
    { id: 'agent1', vector: [1.0, 0.0, 0.0], timestamp: new Date(), scale: TemporalScale.MICRO },
    { id: 'agent2', vector: [0.7, 0.7, 0.0], timestamp: new Date(), scale: TemporalScale.MICRO },
    { id: 'agent3', vector: [0.0, 1.0, 0.0], timestamp: new Date(), scale: TemporalScale.MICRO }
  ];
  
  // Record vectors to the engine
  vectors.forEach(vector => {
    engine.recordStateVector(vector);
  });
  
  // Test that we get a coherence measurement
  const measurement = engine.getMostRecentMeasurement(TemporalScale.MICRO);
  
  if (!measurement) {
    console.error('Failed to get measurement from engine');
    return;
  }
  
  console.log(`Coherence value: ${measurement.value.toFixed(4)}`);
  
  // Calculate expected coherence value (the average of cosine similarities)
  // For these vectors, we'd expect the coherence to be around 0.5-0.6
  if (measurement.value >= 0.4 && measurement.value <= 0.7) {
    console.log('✓ Vector similarity test passed');
  } else {
    console.error('✗ Vector similarity test failed - unexpected coherence value');
  }
  
  // Test attractor detection
  const attractorStatus = engine.isApproachingAttractor(TemporalScale.MICRO);
  console.log(`Approaching attractor: ${attractorStatus.approaching}`);
  console.log(`Target: ${attractorStatus.target.toFixed(4)}`);
  console.log(`Distance: ${attractorStatus.currentDistance.toFixed(4)}`);
  console.log(`Trend: ${attractorStatus.trend}`);
}

/**
 * Run a test of the Kuramoto order parameter coherence measurement
 */
function testPhaseCoherence() {
  console.log('\n--- Testing Phase Coherence (Kuramoto Order Parameter) ---');
  
  const engine = new CoherenceMeasurementEngine();
  
  // Test case 1: Highly synchronized phases (high coherence, close to 1.0)
  console.log('\nTest Case 1: Highly Synchronized Phases');
  const synchronizedPhases = generatePhasesForCoherence(0.9, 5);
  
  // Record phases
  synchronizedPhases.forEach(phase => {
    engine.recordPhaseState(phase);
  });
  
  // Check the measurement
  let measurement = engine.getMostRecentMeasurement(TemporalScale.MICRO);
  
  if (!measurement) {
    console.error('Failed to get measurement for synchronized phases');
    return;
  }
  
  console.log(`Coherence value: ${measurement.value.toFixed(4)} (target was 0.9000)`);
  
  if (Math.abs(measurement.value - 0.9) < 0.1) {
    console.log('✓ Synchronized phases test passed');
  } else {
    console.error('✗ Synchronized phases test failed - unexpected coherence value');
  }
  
  // Reset the engine
  engine.reset();
  
  // Test case 2: Highly desynchronized phases (low coherence, close to 0.2494)
  console.log('\nTest Case 2: Exploring Phases (Target Coherence 0.2494)');
  const desynchronizedPhases = generatePhasesForCoherence(0.2494, 5);
  
  // Record phases
  desynchronizedPhases.forEach(phase => {
    engine.recordPhaseState(phase);
  });
  
  // Check the measurement
  measurement = engine.getMostRecentMeasurement(TemporalScale.MICRO);
  
  if (!measurement) {
    console.error('Failed to get measurement for desynchronized phases');
    return;
  }
  
  console.log(`Coherence value: ${measurement.value.toFixed(4)} (target was 0.2494)`);
  
  if (Math.abs(measurement.value - 0.2494) < 0.1) {
    console.log('✓ Exploring phases test passed');
  } else {
    console.error('✗ Exploring phases test failed - unexpected coherence value');
  }
  
  // Reset the engine
  engine.reset();
  
  // Test case 3: Stability target (coherence 0.7500)
  console.log('\nTest Case 3: Stability Phases (Target Coherence 0.7500)');
  const stabilityPhases = generatePhasesForCoherence(0.7500, 5);
  
  // Record phases
  stabilityPhases.forEach(phase => {
    engine.recordPhaseState(phase);
  });
  
  // Check the measurement
  measurement = engine.getMostRecentMeasurement(TemporalScale.MICRO);
  
  if (!measurement) {
    console.error('Failed to get measurement for stability phases');
    return;
  }
  
  console.log(`Coherence value: ${measurement.value.toFixed(4)} (target was 0.7500)`);
  
  if (Math.abs(measurement.value - 0.7500) < 0.1) {
    console.log('✓ Stability phases test passed');
  } else {
    console.error('✗ Stability phases test failed - unexpected coherence value');
  }
}

/**
 * Test the attractor detection functionality
 */
function testAttractorDetection() {
  console.log('\n--- Testing Attractor Detection ---');
  
  const engine = new CoherenceMeasurementEngine();
  
  // Test approaching stability attractor
  console.log('\nTest Case 1: Approaching Stability Attractor');
  
  // Generate a series of measurements that approach 0.75 (stability)
  for (let i = 0; i < 10; i++) {
    const value = 0.5 + (i * 0.025); // Will go from 0.5 to 0.725
    const phases = generatePhasesForCoherence(value, 5);
    
    // Record phases
    phases.forEach(phase => {
      engine.recordPhaseState(phase);
    });
  }
  
  // Get attractor status
  const stabilityStatus = engine.isApproachingAttractor(TemporalScale.MICRO);
  
  console.log(`Approaching attractor: ${stabilityStatus.approaching}`);
  console.log(`Target: ${stabilityStatus.target.toFixed(4)}`);
  console.log(`Distance: ${stabilityStatus.currentDistance.toFixed(4)}`);
  console.log(`Trend: ${stabilityStatus.trend}`);
  
  if (stabilityStatus.approaching && 
      Math.abs(stabilityStatus.target - CoherenceTargets.STABILITY) < 0.01 &&
      stabilityStatus.trend === 'converging') {
    console.log('✓ Stability attractor detection test passed');
  } else {
    console.error('✗ Stability attractor detection test failed');
  }
  
  // Reset the engine
  engine.reset();
  
  // Test approaching exploration attractor
  console.log('\nTest Case 2: Approaching Exploration Attractor');
  
  // Generate a series of measurements that approach 0.25 (exploration)
  for (let i = 0; i < 10; i++) {
    const value = 0.35 - (i * 0.01); // Will go from 0.35 to 0.26
    const phases = generatePhasesForCoherence(value, 5);
    
    // Record phases
    phases.forEach(phase => {
      engine.recordPhaseState(phase);
    });
  }
  
  // Get attractor status
  const explorationStatus = engine.isApproachingAttractor(TemporalScale.MICRO);
  
  console.log(`Approaching attractor: ${explorationStatus.approaching}`);
  console.log(`Target: ${explorationStatus.target.toFixed(4)}`);
  console.log(`Distance: ${explorationStatus.currentDistance.toFixed(4)}`);
  console.log(`Trend: ${explorationStatus.trend}`);
  
  if (explorationStatus.approaching && 
      Math.abs(explorationStatus.target - CoherenceTargets.EXPLORATION) < 0.01 &&
      explorationStatus.trend === 'converging') {
    console.log('✓ Exploration attractor detection test passed');
  } else {
    console.error('✗ Exploration attractor detection test failed');
  }
}

/**
 * Generate phase states that will produce the desired coherence value
 */
function generatePhasesForCoherence(targetCoherence: number, numAgents: number): PhaseState[] {
  // Calculate the phase angle spread to achieve the target coherence
  // The Kuramoto order parameter R = |1/N ∑_{j=1}^N e^(iθ_j)| can be approximated
  // by distributing angles in a way that produces the desired coherence
  
  // For perfect coherence (1.0), all phases are the same
  // For zero coherence (0.0), phases are evenly distributed around the circle
  
  const phases: PhaseState[] = [];
  const basePhase = Math.random() * 2 * Math.PI; // Random starting phase
  
  // Calculate the maximum spread of phases to achieve the target coherence
  // This is a simplification; in reality, the relationship is more complex
  const maxSpread = Math.acos(targetCoherence) * 2;
  
  for (let i = 0; i < numAgents; i++) {
    // For high coherence, keep phases close to basePhase
    // For low coherence, spread them out more
    const spread = maxSpread * (i / (numAgents - 1) - 0.5);
    const phase = (basePhase + spread) % (2 * Math.PI);
    
    phases.push({
      id: `agent${i + 1}`,
      phase,
      naturalFrequency: 0.1,
      timestamp: new Date(),
      scale: TemporalScale.MICRO
    });
  }
  
  return phases;
}

/**
 * Test cross-scale and composite coherence measurements
 */
function testCrossScaleCoherence() {
  console.log('\n--- Testing Cross-Scale Coherence ---');
  
  const engine = new CoherenceMeasurementEngine();
  
  // Add data at different scales
  const scales = [TemporalScale.MICRO, TemporalScale.MESO, TemporalScale.MACRO];
  const targetValues = [0.75, 0.67, 0.80]; // Aligned with optimal stability for each scale
  
  scales.forEach((scale, i) => {
    const phases = generatePhasesForCoherence(targetValues[i], 5);
    phases.forEach(phase => {
      // Set the appropriate scale
      phase.scale = scale;
      engine.recordPhaseState(phase);
    });
    
    const measurement = engine.getMostRecentMeasurement(scale);
    if (measurement) {
      console.log(`${scale.toUpperCase()} scale coherence: ${measurement.value.toFixed(4)}`);
    } else {
      console.error(`Failed to get measurement for ${scale} scale`);
    }
  });
  
  // Test cross-scale coherence
  const crossScale = engine.getCrossScaleCoherence();
  
  console.log('\nCross-Scale Coherence:');
  Object.entries(crossScale).forEach(([scale, measurement]) => {
    if (measurement) {
      console.log(`- ${scale}: ${measurement.value.toFixed(4)}`);
    } else {
      console.log(`- ${scale}: null`);
    }
  });
  
  // Test composite coherence
  const composite = engine.getCompositeCoherence();
  
  if (composite) {
    console.log(`\nComposite Coherence: ${composite.value.toFixed(4)}`);
    
    if (composite.value >= 0.7 && composite.value <= 0.8) {
      console.log('✓ Composite coherence test passed');
    } else {
      console.error('✗ Composite coherence test failed - unexpected value');
    }
  } else {
    console.error('Failed to get composite coherence measurement');
  }
}

/**
 * Run all tests
 */
function runAllTests() {
  testVectorSimilarity();
  testPhaseCoherence();
  testAttractorDetection();
  testCrossScaleCoherence();
}

// Run the tests if this module is executed directly
if (require.main === module) {
  main();
}

export { testVectorSimilarity, testPhaseCoherence, testAttractorDetection, testCrossScaleCoherence, runAllTests };