/**
 * Test script for Dynamic Chaos Tuning
 * 
 * This script demonstrates the Dynamic Chaos Tuning mechanism by calculating
 * optimal chaos ratios based on system metrics and scheduling chaos sessions.
 * 
 * [QUANTUM_STATE: SIM_FLOW]
 */

// Mock implementations for testing purposes

// Store for history and sessions
const chaosHistoryStore = [];
const chaosSessionsStore = [];

/**
 * Calculate the dynamic chaos ratio based on system stability and innovation deficit
 */
function calculateDynamicChaosRatio(systemStability, innovationDeficit, timeAvailable = 60) {
  // Baseline ratio is 0.3 (30%)
  const baselineRatio = 0.3;
  
  // Performance adjustment based on the difference between innovation deficit and system stability
  const performanceAdjustment = (innovationDeficit - systemStability) * 0.1;
  
  // Calculate final chaos ratio, constrained to range [0.2, 0.4]
  const finalRatio = Math.min(Math.max(baselineRatio + performanceAdjustment, 0.2), 0.4);
  
  // Generate recommendations based on chaos ratio
  const recommendations = [];
  
  // Chaos ratio recommendations
  if (finalRatio > 0.35) {
    recommendations.push(`Increase chaos allocation to ${Math.round(finalRatio * 100)}% to address high innovation deficit`);
  } else if (finalRatio < 0.25) {
    recommendations.push(`Reduce chaos allocation to ${Math.round(finalRatio * 100)}% to prioritize system stability`);
  } else {
    recommendations.push(`Maintain balanced chaos allocation at ${Math.round(finalRatio * 100)}%`);
  }
  
  // Specific improvement recommendations
  if (innovationDeficit > 0.7 && systemStability > 0.6) {
    recommendations.push("Introduce exploratory sessions to challenge established patterns");
  }
  if (systemStability < 0.4 && innovationDeficit < 0.3) {
    recommendations.push("Focus on structural refinement before increasing chaos");
  }
  
  // Create history record
  const historyRecord = {
    id: `chaos-ratio-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
    timestamp: new Date(),
    baselineRatio,
    performanceAdjustment,
    finalRatio,
    systemStability,
    innovationDeficit,
    recommendedChaosSessionDuration: Math.floor(timeAvailable * finalRatio),
    nextScheduledChaosSession: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week from now
    recommendations
  };
  
  // Store in history
  chaosHistoryStore.push(historyRecord);
  
  return historyRecord;
}

/**
 * Create a chaos tuning session with specified parameters
 */
function createChaosTuningSession(duration, chaosRatio, targetAreas = [], objectives = []) {
  const startTime = new Date();
  startTime.setHours(startTime.getHours() + 1); // Start in 1 hour by default
  
  const endTime = new Date(startTime);
  endTime.setMinutes(endTime.getMinutes() + duration);
  
  // Calculate intensity based on chaos ratio
  const intensity = chaosRatio * 0.8 + Math.random() * 0.2;
  
  // Create session
  const session = {
    id: `session-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
    timestamp: new Date(),
    startTime,
    endTime: null, // Will be set when session completes
    duration,
    chaosRatio,
    intensity,
    targetAreas: targetAreas.length > 0 ? targetAreas : ['general'],
    objectives: objectives.length > 0 ? objectives : ['increase innovation'],
    results: null, // Will be set when session completes
    status: 'scheduled'
  };
  
  // Store in sessions
  chaosSessionsStore.push(session);
  
  return session;
}

/**
 * Start a scheduled chaos tuning session
 */
function startChaosTuningSession(sessionId) {
  const sessionIndex = chaosSessionsStore.findIndex(s => s.id === sessionId);
  if (sessionIndex === -1) return null;
  
  const session = chaosSessionsStore[sessionIndex];
  session.status = 'in_progress';
  session.actualStartTime = new Date();
  
  // Update in store
  chaosSessionsStore[sessionIndex] = session;
  
  return session;
}

/**
 * Complete a chaos tuning session with results
 */
function completeChaosTuningSession(sessionId, innovationScore, structuralImpact, unexpectedInsights = []) {
  const sessionIndex = chaosSessionsStore.findIndex(s => s.id === sessionId);
  if (sessionIndex === -1) return null;
  
  const session = chaosSessionsStore[sessionIndex];
  session.status = 'completed';
  session.endTime = new Date();
  session.results = {
    innovationScore,
    structuralImpact,
    unexpectedInsights
  };
  
  // Update in store
  chaosSessionsStore[sessionIndex] = session;
  
  return session;
}

/**
 * Calculate innovation deficit based on system stability and recent activity
 */
function calculateInnovationDeficit(systemStability, recentChanges, stagnationDuration) {
  // Base deficit calculation
  let deficit = 0.5;
  
  // Stability factor (higher stability can indicate less innovation)
  const stabilityFactor = systemStability > 0.7 ? (systemStability - 0.7) * 2 : 0;
  
  // Recent changes factor (more changes indicate less deficit)
  const changesFactor = Math.min(recentChanges / 10, 0.5);
  
  // Stagnation factor (longer stagnation indicates higher deficit)
  const stagnationFactor = Math.min(stagnationDuration / 30, 0.5);
  
  // Calculate deficit
  deficit = 0.3 + stabilityFactor + stagnationFactor - changesFactor;
  
  // Ensure result is in valid range
  return Math.max(0, Math.min(1, deficit));
}

/**
 * Get chaos tuning history
 */
function getChaosTuningHistory(limit = 10) {
  // Return most recent first
  return chaosHistoryStore
    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
    .slice(0, limit);
}

/**
 * Get chaos session records
 */
function getChaosSessions(limit = 10, status = null) {
  // Filter by status if provided
  let sessions = status 
    ? chaosSessionsStore.filter(s => s.status === status)
    : chaosSessionsStore;
    
  // Return most recent first
  return sessions
    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
    .slice(0, limit);
}

/**
 * Run a test demonstration of the Dynamic Chaos Tuning mechanism
 */
async function runTest() {
  console.log('===== DYNAMIC CHAOS TUNING TEST =====');
  console.log('[QUANTUM_STATE: SIM_FLOW]');
  console.log('Testing 70/30 Structured Chaos Ratio implementation\n');
  
  // Test different stability and innovation deficit combinations
  const testCases = [
    { stability: 0.8, innovationDeficit: 0.3, description: 'High stability, Low innovation deficit' },
    { stability: 0.6, innovationDeficit: 0.6, description: 'Medium stability, Medium innovation deficit' },
    { stability: 0.4, innovationDeficit: 0.8, description: 'Low stability, High innovation deficit' }
  ];
  
  // Run through test cases
  for (const testCase of testCases) {
    console.log(`\n--- Test Case: ${testCase.description} ---`);
    
    // Calculate the dynamic chaos ratio
    console.log(`System Stability: ${testCase.stability}`);
    console.log(`Innovation Deficit: ${testCase.innovationDeficit}`);
    
    const result = calculateDynamicChaosRatio(
      testCase.stability,
      testCase.innovationDeficit,
      120 // 2 hours available time
    );
    
    console.log(`\nCalculated Chaos Ratio: ${result.finalRatio.toFixed(2)} (${Math.round(result.finalRatio * 100)}%)`);
    console.log(`Baseline: ${result.baselineRatio.toFixed(2)}, Adjustment: ${result.performanceAdjustment.toFixed(2)}`);
    console.log(`Recommended Session Duration: ${result.recommendedChaosSessionDuration} minutes`);
    
    if (result.nextScheduledChaosSession) {
      console.log(`Next Scheduled Session: ${result.nextScheduledChaosSession.toLocaleDateString()}`);
    } else {
      console.log('No session scheduled at this time');
    }
    
    console.log('\nRecommendations:');
    result.recommendations.forEach(rec => console.log(`- ${rec}`));
    
    // If ratio is high enough, create a session
    if (result.finalRatio > 0.25) {
      console.log('\nCreating chaos tuning session...');
      
      const session = createChaosTuningSession(
        result.recommendedChaosSessionDuration,
        result.finalRatio,
        ['architecture', 'user experience'],
        ['increase adaptability', 'find novel approaches']
      );
      
      console.log(`Created session ${session.id} (${session.status})`);
      console.log(`Duration: ${session.duration} minutes, Intensity: ${session.intensity.toFixed(2)}`);
      console.log(`Scheduled start: ${session.startTime.toLocaleTimeString()}`);
      
      // Simulate starting the session
      console.log('\nStarting session...');
      const updatedSession = startChaosTuningSession(session.id);
      
      if (updatedSession) {
        console.log(`Session status: ${updatedSession.status}`);
        
        // Simulate completing the session with results
        console.log('\nCompleting session with results...');
        const completedSession = completeChaosTuningSession(
          session.id,
          0.7, // innovation score
          0.5, // structural impact
          ['Unexpected insight 1', 'Unexpected insight 2']
        );
        
        if (completedSession && completedSession.results) {
          console.log(`Session completed with innovation score: ${completedSession.results.innovationScore}`);
          console.log(`Structural impact: ${completedSession.results.structuralImpact}`);
          console.log('Unexpected insights:');
          completedSession.results.unexpectedInsights.forEach(insight => console.log(`- ${insight}`));
        }
      }
    }
  }
  
  // Get history
  console.log('\n--- Chaos Tuning History ---');
  const history = getChaosTuningHistory();
  console.log(`Retrieved ${history.length} history records`);
  
  // Get sessions
  console.log('\n--- Chaos Sessions ---');
  const sessions = getChaosSessions();
  console.log(`Retrieved ${sessions.length} session records`);
  console.log(`Completed sessions: ${getChaosSessions(10, 'completed').length}`);
  
  console.log('\n=== TEST COMPLETE ===');
}

// Run the test
runTest().catch(error => {
  console.error('Test failed:', error);
});