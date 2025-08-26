/**
 * OROBORO NEXUS Validation Script
 * 
 * This script validates the OROBORO NEXUS system with real-world esports data,
 * demonstrating its functionality and performance with the complete "0-8 Flow" structure.
 * 
 * [QUANTUM_STATE: SIM_FLOW]
 */

import { oroboroNexus } from './server/services/OROBORO-NEXUS.js';

/**
 * Formats a timestamp in a human-readable format
 */
function formatTimestamp(timestamp) {
  const date = new Date(timestamp);
  return date.toISOString();
}

/**
 * Calculate durations between steps
 */
function calculateStepDurations(timings) {
  const durations = {};
  const steps = Object.keys(timings).filter(key => key !== 'end');
  
  for (let i = 0; i < steps.length - 1; i++) {
    const current = steps[i];
    const next = steps[i + 1];
    durations[current] = timings[next] - timings[current];
  }
  durations[steps[steps.length - 1]] = timings.end - timings[steps[steps.length - 1]];
  
  return durations;
}

/**
 * Format the output for display
 */
function formatOutput(result, durations) {
  const timings = result.timings;
  return {
    flow: "0-8 OROBORO NEXUS Flow",
    output: {
      response: result.response,
      timestamp: formatTimestamp(result.timestamp),
      enhanced: result.enhanced
    },
    metrics: {
      totalTime: timings.end - timings['0-Start'],
      stepDurations: durations
    }
  };
}

/**
 * Run the validation
 */
async function validate() {
  const pitchData = {
    stats: {
      reach: 478000,
      impressions: 1600000,
      engagement: "1.08%",
      views: 1600000,
      instagram: { reach: 144000, engagement: "8.3%", views: 220000 },
      youtube: { subs: 13000, views: 302000, hours: 25000 }
    },
    titles: "Major 2016 Bicampeão",
    segments: ["Interviews", "Betting Tips", "Ascension Moment"]
  };

  console.log('Starting OROBORO NEXUS validation with real-world esports data...');
  try {
    const result = await oroboroNexus.run(pitchData);
    const timings = result.timings;
    const durations = calculateStepDurations(timings);
    
    console.log('Output:', JSON.stringify(result, null, 2));
    console.log('Timings:', timings);
    console.log('Step Durations:', durations);
    console.log('Total Duration:', timings.end - timings['0-Start'], 'ms');
    
    // Format the output for display
    const formattedOutput = formatOutput(result, durations);
    console.log('Formatted Output:', JSON.stringify(formattedOutput, null, 2));
    
    console.log('OROBORO NEXUS validation successful!');
  } catch (error) {
    console.error('OROBORO NEXUS validation failed:', error);
  }
}

// Execute the validation
validate().catch(console.error);