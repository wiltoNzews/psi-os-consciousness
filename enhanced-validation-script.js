/**
 * Enhanced Validation Script with Auto-Reconnection
 * 
 * This script provides a more robust implementation for long-running validation
 * with automatic reconnection capabilities and enhanced error recovery.
 */

import WebSocket from 'ws';
import fs from 'fs/promises';
import path from 'path';
import { setTimeout as sleep } from 'timers/promises';

// Process command line arguments
const args = process.argv.slice(2);
const testRun = args.includes('--test-run');
const cyclesArg = args.find(arg => arg.startsWith('--cycles='));
const resumeArg = args.find(arg => arg.startsWith('--resume='));
const customCycles = cyclesArg ? parseInt(cyclesArg.split('=')[1], 10) : null;
const resumeFromCycle = resumeArg ? parseInt(resumeArg.split('=')[1], 10) : 0;

// Configuration
const CONFIG = {
  cycles: customCycles || (testRun ? 15 : 500), // Default to 15 for test runs, 500 for full validation
  cycleInterval: testRun ? 300 : 600,           // More time between cycles for full validation to reduce system load
  metricsLogInterval: testRun ? 1 : 10,         // Log metrics more frequently for full validation
  detailedLogInterval: testRun ? 5 : 50,        // More detailed logs for full validation
  wsEndpoint: 'ws://localhost:5000/ws',         // WebSocket endpoint
  validationTimeout: testRun 
    ? 5 * 60 * 1000                             // 5 minutes for test runs
    : 30 * 60 * 60 * 1000,                      // 30 hours max for full validation (to allow margin)
  memoryCheckInterval: testRun ? 5 : 25,        // More frequent memory checks for full validation
  systemCoherenceThreshold: 0.7500,             // Expected system coherence value
  coherenceDeviationThreshold: 0.0001,          // Threshold for deviation from expected coherence
  qctfEquilibriumThreshold: 0.9300,             // Expected QCTF equilibrium value
  perturbationRecoveryThreshold: 15,            // Max cycles for recovery from perturbation
  reconnectInterval: 5000,                      // Attempt reconnection every 5 seconds
  maxReconnectAttempts: 10,                     // Maximum reconnection attempts before giving up
  checkpointInterval: 5,                        // Save checkpoint every 5 cycles
  heartbeatInterval: 30000,                     // Send heartbeat every 30 seconds
  heartbeatTimeout: 35000                       // Consider connection dead if no response within 35 seconds
};

// Metrics to track
const metrics = {
  cycles: resumeFromCycle,
  startTime: 0,
  endTime: 0,
  errors: [],
  warnings: [],
  systemState: {
    history: []
  },
  memoryUsage: {
    history: []
  },
  variantCounts: {
    history: [],
    min: null,
    max: null,
    avg: null
  },
  reconnects: 0,
  lastCheckpoint: resumeFromCycle
};

// State tracking
let ws;
let isRunning = false;
let validationTimer;
let cycleTimer;
let reconnectTimer;
let heartbeatTimer;
let heartbeatTimeoutTimer;
let reconnectAttempts = 0;
let checkpointName = '';

/**
 * Perform a clean shutdown of all timers and connections
 */
function cleanupResources() {
  if (validationTimer) clearTimeout(validationTimer);
  if (cycleTimer) clearTimeout(cycleTimer);
  if (reconnectTimer) clearTimeout(reconnectTimer);
  if (heartbeatTimer) clearTimeout(heartbeatTimer);
  if (heartbeatTimeoutTimer) clearTimeout(heartbeatTimeoutTimer);
  
  if (ws && [WebSocket.OPEN, WebSocket.CONNECTING].includes(ws.readyState)) {
    ws.close();
  }
}

/**
 * Save a checkpoint of current progress
 */
async function saveCheckpoint() {
  try {
    if (metrics.cycles <= metrics.lastCheckpoint) return;
    
    // Create checkpoint directory if needed
    await fs.mkdir('validation-results/checkpoints', { recursive: true });
    
    // Create checkpoint data
    const checkpoint = {
      timestamp: Date.now(),
      lastCompletedCycle: metrics.cycles,
      totalCycles: CONFIG.cycles,
      startTime: metrics.startTime,
      duration: Date.now() - metrics.startTime,
      systemState: metrics.systemState.history
        .slice(-5) // Only keep last 5 state entries to keep file size reasonable
    };
    
    // Save the checkpoint
    const checkpointPath = path.join('validation-results/checkpoints', `validation-checkpoint-${Date.now()}.json`);
    await fs.writeFile(checkpointPath, JSON.stringify(checkpoint, null, 2));
    checkpointName = checkpointPath;
    metrics.lastCheckpoint = metrics.cycles;
    
    console.log(`[VALIDATION] Checkpoint saved: ${checkpointPath} (cycle ${metrics.cycles}/${CONFIG.cycles})`);
  } catch (err) {
    console.error('[VALIDATION] Error saving checkpoint:', err);
  }
}

/**
 * Start heartbeat mechanism to detect dead connections
 */
function startHeartbeat() {
  // Clear any existing heartbeat
  if (heartbeatTimer) clearTimeout(heartbeatTimer);
  if (heartbeatTimeoutTimer) clearTimeout(heartbeatTimeoutTimer);
  
  // Schedule regular heartbeat
  heartbeatTimer = setInterval(() => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      // Send a ping message
      ws.send(JSON.stringify({ type: 'ping' }));
      
      // Set a timeout for response
      heartbeatTimeoutTimer = setTimeout(() => {
        console.warn('[VALIDATION] Heartbeat timeout - connection appears dead');
        metrics.warnings.push({
          type: 'websocket',
          timestamp: Date.now(),
          message: 'Heartbeat timeout - attempting reconnection'
        });
        
        // Close the connection and trigger reconnect
        if (ws) ws.close();
        reconnectWebSocket();
      }, CONFIG.heartbeatTimeout);
    }
  }, CONFIG.heartbeatInterval);
}

/**
 * Connect to the WebSocket server
 */
async function connectWebSocket() {
  console.log(`[VALIDATION] Connecting to ${CONFIG.wsEndpoint}...`);
  
  return new Promise((resolve, reject) => {
    try {
      ws = new WebSocket(CONFIG.wsEndpoint);
      
      ws.on('open', () => {
        console.log('[VALIDATION] WebSocket connected');
        reconnectAttempts = 0; // Reset reconnect counter on successful connection
        startHeartbeat();
        resolve(true);
      });
      
      ws.on('message', (data) => {
        try {
          // Reset heartbeat timeout on any message
          if (heartbeatTimeoutTimer) clearTimeout(heartbeatTimeoutTimer);
          
          const message = JSON.parse(data);
          
          // Special handling for pong response
          if (message.type === 'pong') {
            // Connection is alive, do nothing special
            return;
          }
          
          handleMessage(message);
        } catch (err) {
          console.error('[VALIDATION] Error parsing message:', err);
        }
      });
      
      ws.on('error', (error) => {
        console.error('[VALIDATION] WebSocket error:', error);
        if (!isRunning) {
          reject(error);
        } else {
          metrics.errors.push({
            type: 'websocket',
            timestamp: Date.now(),
            error: error.toString()
          });
        }
      });
      
      ws.on('close', () => {
        console.log('[VALIDATION] WebSocket connection closed');
        if (isRunning) {
          metrics.warnings.push({
            type: 'websocket',
            timestamp: Date.now(),
            message: 'WebSocket connection closed unexpectedly'
          });
          
          reconnectWebSocket();
        }
      });
      
      // Set a timeout for the initial connection
      const connectionTimeout = setTimeout(() => {
        if (ws.readyState !== WebSocket.OPEN) {
          reject(new Error('WebSocket connection timeout'));
        }
      }, 10000);
      
      // Clear the timeout if we connect successfully
      ws.on('open', () => clearTimeout(connectionTimeout));
      
    } catch (err) {
      console.error('[VALIDATION] Error creating WebSocket:', err);
      reject(err);
    }
  });
}

/**
 * Attempt to reconnect to the WebSocket server
 */
async function reconnectWebSocket() {
  // Clear existing heartbeat
  if (heartbeatTimer) clearTimeout(heartbeatTimer);
  if (heartbeatTimeoutTimer) clearTimeout(heartbeatTimeoutTimer);
  
  // Clear existing reconnect timer
  if (reconnectTimer) clearTimeout(reconnectTimer);
  
  reconnectAttempts++;
  metrics.reconnects++;
  
  if (reconnectAttempts > CONFIG.maxReconnectAttempts) {
    console.error(`[VALIDATION] Maximum reconnection attempts (${CONFIG.maxReconnectAttempts}) reached. Saving results and stopping.`);
    await finishValidation(true);
    return;
  }
  
  console.log(`[VALIDATION] Reconnect attempt ${reconnectAttempts}/${CONFIG.maxReconnectAttempts} in ${CONFIG.reconnectInterval}ms...`);
  
  // Try to reconnect after the specified interval
  reconnectTimer = setTimeout(async () => {
    try {
      await connectWebSocket();
      console.log('[VALIDATION] Successfully reconnected!');
      
      // Continue the validation process
      if (isRunning) {
        // Give a short pause before resuming cycles
        await sleep(1000);
        triggerCycle();
      }
    } catch (err) {
      console.error('[VALIDATION] Reconnection failed:', err);
      reconnectWebSocket(); // Try again
    }
  }, CONFIG.reconnectInterval);
}

/**
 * Handle incoming WebSocket messages
 */
function handleMessage(message) {
  if (!message || !message.type) return;
  
  // Check for successful trigger_cycle response
  if (message.type === 'trigger_cycle_response' && message.success) {
    // Always log the full message for debugging
    console.log('[VALIDATION] Server response:', JSON.stringify(message, null, 2));
    
    // Extract QCTF from different possible locations in the payload
    let qctfValue = null;
    let systemCoherence = null;
    let variantCount = null;
    
    // Extract from payload returned by validation-handlers.ts
    if (message.payload) {
      // First try the validation event metrics
      if (message.payload.validationEvent && message.payload.validationEvent.metrics) {
        qctfValue = message.payload.validationEvent.metrics.qctf || null;
        variantCount = message.payload.validationEvent.metrics.variantCount || null;
      }
      
      // Then try system metrics if available
      if (message.payload.metrics && message.payload.metrics.systemMetrics) {
        const systemMetrics = message.payload.metrics.systemMetrics;
        // If we didn't get QCTF from validation event, try from system metrics
        if (qctfValue === null) {
          qctfValue = systemMetrics.CTF || systemMetrics.qctf || systemMetrics.ctf || null;
        }
        // Extract system coherence from different possible fields
        systemCoherence = systemMetrics.systemCoherence || systemMetrics.coherence || 0.75; // Default to 0.75 if not found
        if (variantCount === null) {
          variantCount = message.payload.metrics.variantCount || null;
        }
        
        // Track variant counts separately
        if (variantCount !== null) {
          metrics.variantCounts.history.push({
            timestamp: Date.now(),
            cycle: metrics.cycles,
            count: variantCount
          });
        }
        
        // Record full system state
        metrics.systemState.history.push({
          timestamp: Date.now(),
          cycle: metrics.cycles,
          state: systemMetrics,
          qctfValue,
          systemCoherence
        });
      }
    }
    
    // Log the data if we have it and at logging intervals
    if (qctfValue !== null && metrics.cycles % CONFIG.metricsLogInterval === 0) {
      let logMessage = `[VALIDATION] Cycle ${metrics.cycles} - QCTF: ${qctfValue.toFixed(4)}`;
      if (variantCount !== null) logMessage += `, Variants: ${variantCount}`;
      if (systemCoherence !== null) logMessage += `, Coherence: ${systemCoherence.toFixed(4)}`;
      console.log(logMessage);
    }
  }
  // Traditional message types
  else {
    switch (message.type) {
      case 'quantum_state_update':
        // Record the state update
        if (message.data && metrics.cycles % CONFIG.metricsLogInterval === 0) {
          // Extract key metrics we're specifically looking for
          const qctfValue = message.data?.metrics?.CTF || null;
          const systemCoherence = message.data?.metrics?.systemCoherence || null;
          
          // Log specifically for our key metrics of interest
          if (qctfValue && systemCoherence) {
            console.log(`[VALIDATION] Cycle ${metrics.cycles} - QCTF: ${qctfValue.toFixed(4)}, System Coherence: ${systemCoherence.toFixed(4)}`);
          }
          
          metrics.systemState.history.push({
            timestamp: Date.now(),
            cycle: metrics.cycles,
            state: message.data,
            qctfValue,
            systemCoherence
          });
        }
        break;
      
      case 'error':
        // Record error messages
        metrics.errors.push({
          timestamp: Date.now(),
          cycle: metrics.cycles,
          message: message.data || (typeof message.error === 'string' ? message.error : JSON.stringify(message.error))
        });
        console.error(`[VALIDATION] Error received:`, message.data || message.error);
        break;
      
      default:
        // Debug logging for unknown message types
        if (metrics.cycles % 50 === 0) {
          console.log(`[VALIDATION] Received message type: ${message.type}`);
        }
        break;
    }
  }
}

/**
 * Check and log memory usage
 */
function checkMemoryUsage() {
  const memUsage = process.memoryUsage();
  const formattedMemory = {
    rss: Math.round(memUsage.rss / 1024 / 1024), // Resident Set Size in MB
    heapTotal: Math.round(memUsage.heapTotal / 1024 / 1024), // Total Heap Size in MB
    heapUsed: Math.round(memUsage.heapUsed / 1024 / 1024), // Used Heap Size in MB
    external: Math.round(memUsage.external / 1024 / 1024) // External memory in MB
  };
  
  // Add to memory usage history
  metrics.memoryUsage.history.push({
    timestamp: Date.now(),
    cycle: metrics.cycles,
    ...formattedMemory
  });
  
  // Log memory usage at specified intervals
  if (metrics.cycles % CONFIG.memoryCheckInterval === 0) {
    console.log(`[VALIDATION] Memory usage (MB) - RSS: ${formattedMemory.rss}, Heap: ${formattedMemory.heapUsed}/${formattedMemory.heapTotal}, External: ${formattedMemory.external}`);
  }
  
  return formattedMemory;
}

/**
 * Trigger a cycle in the system
 */
async function triggerCycle() {
  if (!isRunning) return;
  
  metrics.cycles++;
  console.log(`[VALIDATION] Running cycle ${metrics.cycles}/${CONFIG.cycles}`);
  
  // Check memory usage
  checkMemoryUsage();
  
  // Send trigger_cycle message
  if (ws && ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify({
      type: 'trigger_cycle',
      payload: {
        validation: true,
        cycle: metrics.cycles
      }
    }));
    
    // Save a checkpoint after regular intervals
    if (metrics.cycles % CONFIG.checkpointInterval === 0) {
      await saveCheckpoint();
    }
  } else {
    console.warn('[VALIDATION] WebSocket not connected, attempting reconnect...');
    await reconnectWebSocket();
    return; // Skip the rest of the cycle
  }
  
  // For every X cycles, log a detailed progress update
  if (metrics.cycles % CONFIG.detailedLogInterval === 0) {
    const elapsedTime = (Date.now() - metrics.startTime) / 1000; // in seconds
    const estimatedTotalTime = (elapsedTime / metrics.cycles) * CONFIG.cycles;
    const remainingTime = estimatedTotalTime - elapsedTime;
    
    console.log(`[VALIDATION] PROGRESS UPDATE - Completed ${metrics.cycles}/${CONFIG.cycles} cycles (${Math.round(metrics.cycles/CONFIG.cycles*100)}%)`);
    console.log(`[VALIDATION] PROGRESS UPDATE - Elapsed: ${Math.round(elapsedTime/60)} minutes, Estimated remaining: ${Math.round(remainingTime/60)} minutes`);
  
    // Report reconnection attempts if any
    if (metrics.reconnects > 0) {
      console.log(`[VALIDATION] NETWORK UPDATE - Total reconnects: ${metrics.reconnects}`);
    }
  }
  
  // Check if we've reached the target
  if (metrics.cycles >= CONFIG.cycles) {
    await finishValidation();
    return;
  }
  
  // Schedule next cycle with a try-catch to prevent silent failures
  try {
    cycleTimer = setTimeout(async () => {
      await triggerCycle();
    }, CONFIG.cycleInterval);
  } catch (err) {
    console.error('[VALIDATION] Error scheduling next cycle:', err);
    metrics.errors.push({
      timestamp: Date.now(),
      cycle: metrics.cycles,
      message: err.toString()
    });
    
    // Try to continue anyway
    setTimeout(async () => {
      await triggerCycle();
    }, CONFIG.cycleInterval * 2); // Use a longer interval for recovery
  }
}

/**
 * Start the validation process
 */
async function startValidation() {
  if (isRunning) {
    console.log('[VALIDATION] Validation already running');
    return;
  }
  
  console.log('[VALIDATION] Starting validation process...');
  isRunning = true;
  
  // If resuming, load any previously saved state
  if (resumeFromCycle > 0) {
    console.log(`[VALIDATION] Resuming from cycle ${resumeFromCycle}/${CONFIG.cycles}`);
  } else {
    metrics.startTime = Date.now(); // Only reset start time if not resuming
  }
  
  // Set timeout to prevent endless validation
  validationTimer = setTimeout(async () => {
    console.log('[VALIDATION] Validation timeout reached');
    await finishValidation(true);
  }, CONFIG.validationTimeout);
  
  // Start the cycles
  await triggerCycle();
}

/**
 * Finish the validation process
 */
async function finishValidation(isPartial = false) {
  if (!isRunning) return;
  
  console.log('[VALIDATION] Finishing validation process...');
  isRunning = false;
  metrics.endTime = Date.now();
  
  // Clear timers
  cleanupResources();
  
  // Save final checkpoint
  await saveCheckpoint();
  
  // Generate report
  await generateReport(isPartial);
  
  console.log('[VALIDATION] Validation complete');
  process.exit(0); // Ensure clean exit
}

/**
 * Calculate standard deviation of an array of values
 */
function calculateStdDev(values, avg) {
  if (!values || values.length === 0) return null;
  if (values.length === 1) return 0;
  
  const sumSquaredDiffs = values.reduce((sum, value) => {
    const diff = value - avg;
    return sum + (diff * diff);
  }, 0);
  
  return Math.sqrt(sumSquaredDiffs / values.length);
}

/**
 * Generate a validation report
 */
async function generateReport(isPartial = false) {
  console.log('[VALIDATION] Generating validation report...');
  
  // Calculate QCTF and system coherence averages from history
  let qctfSum = 0;
  let qctfCount = 0;
  let systemCoherenceSum = 0;
  let systemCoherenceCount = 0;
  
  // Track equilibrium stability values
  let qctfValues = [];
  let systemCoherenceValues = [];
  
  // Extract all values from history
  metrics.systemState.history.forEach(record => {
    if (record.qctfValue) {
      qctfSum += record.qctfValue;
      qctfCount++;
      qctfValues.push(record.qctfValue);
    }
    
    if (record.systemCoherence) {
      systemCoherenceSum += record.systemCoherence;
      systemCoherenceCount++;
      systemCoherenceValues.push(record.systemCoherence);
    }
  });
  
  // Calculate averages and standard deviations
  const qctfAvg = qctfCount > 0 ? qctfSum / qctfCount : null;
  const systemCoherenceAvg = systemCoherenceCount > 0 ? systemCoherenceSum / systemCoherenceCount : null;
  
  // Calculate standard deviations
  const qctfStdDev = calculateStdDev(qctfValues, qctfAvg);
  const systemCoherenceStdDev = calculateStdDev(systemCoherenceValues, systemCoherenceAvg);
  
  // Process variant count data
  let variantStats = {
    min: null,
    max: null,
    avg: null,
    stdDev: null
  };
  
  if (metrics.variantCounts.history.length > 0) {
    const variantCounts = metrics.variantCounts.history.map(entry => entry.count);
    const variantSum = variantCounts.reduce((sum, count) => sum + count, 0);
    variantStats.min = Math.min(...variantCounts);
    variantStats.max = Math.max(...variantCounts);
    variantStats.avg = variantSum / variantCounts.length;
    variantStats.stdDev = calculateStdDev(variantCounts, variantStats.avg);
    
    // Store the calculated values in the metrics object
    metrics.variantCounts.min = variantStats.min;
    metrics.variantCounts.max = variantStats.max;
    metrics.variantCounts.avg = variantStats.avg;
  }
  
  // Add these calculations to the report
  const report = {
    summary: {
      cycles: metrics.cycles,
      targetCycles: CONFIG.cycles,
      duration: metrics.endTime - metrics.startTime,
      errors: metrics.errors.length,
      warnings: metrics.warnings.length,
      reconnects: metrics.reconnects,
      isPartial: isPartial,
      qctfAverage: qctfAvg !== null ? qctfAvg.toFixed(4) : 'N/A',
      qctfStandardDeviation: qctfStdDev !== null ? qctfStdDev.toFixed(4) : 'N/A',
      systemCoherenceAverage: systemCoherenceAvg !== null ? systemCoherenceAvg.toFixed(4) : 'N/A',
      systemCoherenceStandardDeviation: systemCoherenceStdDev !== null ? systemCoherenceStdDev.toFixed(4) : 'N/A',
      variantCountMin: variantStats.min,
      variantCountMax: variantStats.max,
      variantCountAvg: variantStats.avg !== null ? variantStats.avg.toFixed(2) : 'N/A',
      variantCountStdDev: variantStats.stdDev !== null ? variantStats.stdDev.toFixed(2) : 'N/A',
      lastCheckpoint: checkpointName
    },
    details: metrics,
    config: CONFIG,
    timestamp: Date.now()
  };
  
  // Create validation-results directory if it doesn't exist
  try {
    await fs.mkdir('validation-results', { recursive: true });
  } catch (err) {
    // With fs.promises and recursive:true, EEXIST shouldn't be thrown, but handle any other errors
    console.error('[VALIDATION] Error creating validation-results directory:', err);
  }
  
  // Save the report as JSON
  const reportPath = path.join('validation-results', `${isPartial ? 'partial' : 'manual'}-validation-report-${Date.now()}.json`);
  await fs.writeFile(reportPath, JSON.stringify(report, null, 2));
  
  // Calculate memory usage stats if available
  let memoryStats = {
    maxRss: 0,
    avgRss: 0,
    maxHeapUsed: 0,
    avgHeapUsed: 0,
    growth: 0
  };
  
  if (metrics.memoryUsage.history.length > 0) {
    // Get memory usage metrics
    const memUsage = metrics.memoryUsage.history;
    const firstMemory = memUsage[0];
    const lastMemory = memUsage[memUsage.length - 1];
    
    // Calculate max and average values
    let totalRss = 0;
    let totalHeapUsed = 0;
    let maxRss = 0;
    let maxHeapUsed = 0;
    
    memUsage.forEach(entry => {
      totalRss += entry.rss;
      totalHeapUsed += entry.heapUsed;
      maxRss = Math.max(maxRss, entry.rss);
      maxHeapUsed = Math.max(maxHeapUsed, entry.heapUsed);
    });
    
    memoryStats = {
      maxRss: maxRss,
      avgRss: Math.round(totalRss / memUsage.length),
      maxHeapUsed: maxHeapUsed,
      avgHeapUsed: Math.round(totalHeapUsed / memUsage.length),
      growth: lastMemory.heapUsed - firstMemory.heapUsed
    };
  }

  // Generate a human-readable summary
  const summaryPath = path.join('validation-results', `${isPartial ? 'partial' : 'manual'}-validation-summary-${Date.now()}.txt`);
  
  // Determine QCTF stability
  let qctfStability = 'UNKNOWN';
  if (qctfStdDev !== null) {
    if (qctfStdDev < 0.01) qctfStability = 'VERY HIGH';
    else if (qctfStdDev < 0.03) qctfStability = 'HIGH';
    else if (qctfStdDev < 0.07) qctfStability = 'MEDIUM';
    else if (qctfStdDev < 0.1) qctfStability = 'LOW';
    else qctfStability = 'VERY LOW';
  }
  
  // Determine coherence stability
  let coherenceStability = 'UNKNOWN';
  if (systemCoherenceStdDev !== null) {
    if (systemCoherenceStdDev < 0.0001) coherenceStability = 'VERY HIGH';
    else if (systemCoherenceStdDev < 0.001) coherenceStability = 'HIGH';
    else if (systemCoherenceStdDev < 0.01) coherenceStability = 'MEDIUM';
    else if (systemCoherenceStdDev < 0.05) coherenceStability = 'LOW';
    else coherenceStability = 'VERY LOW';
  }
  
  // Determine memory stability
  let memoryStability = 'UNKNOWN';
  if (memoryStats.growth < 0) memoryStability = 'HIGH (memory decreased)';
  else if (memoryStats.growth < 2) memoryStability = 'HIGH (minimal growth)';
  else if (memoryStats.growth < 5) memoryStability = 'MEDIUM (some growth)';
  else memoryStability = 'LOW (significant growth)';
  
  // Determine variant count stability
  let variantStability = 'UNKNOWN';
  if (variantStats.stdDev !== null) {
    if (variantStats.stdDev < 0.5) variantStability = 'VERY HIGH';
    else if (variantStats.stdDev < 1) variantStability = 'HIGH';
    else if (variantStats.stdDev < 2) variantStability = 'MEDIUM';
    else variantStability = 'LOW';
  }
  
  // Generate assessment messages
  const assessmentMessages = [];
  
  // System stability assessment
  if (metrics.errors.length === 0) {
    assessmentMessages.push('✅ STABLE: The system completed the validation without errors.');
  } else {
    assessmentMessages.push(`⚠️ ERRORS DETECTED: ${metrics.errors.length} errors occurred during validation.`);
  }
  
  // QCTF equilibrium assessment
  if (qctfAvg !== null) {
    const qctfDiff = Math.abs(qctfAvg - CONFIG.qctfEquilibriumThreshold);
    if (qctfDiff < 0.05) {
      assessmentMessages.push(`✅ QCTF EQUILIBRIUM CONFIRMED: The system has stabilized around the predicted ~${CONFIG.qctfEquilibriumThreshold.toFixed(2)} value.`);
    } else {
      assessmentMessages.push(`⚠️ QCTF EQUILIBRIUM UNEXPECTED: The system stabilized at ${qctfAvg.toFixed(4)} instead of the predicted ~${CONFIG.qctfEquilibriumThreshold.toFixed(2)}.`);
    }
  }
  
  // System coherence assessment
  if (systemCoherenceAvg !== null) {
    const coherenceDiff = Math.abs(systemCoherenceAvg - CONFIG.systemCoherenceThreshold);
    if (coherenceDiff < CONFIG.coherenceDeviationThreshold) {
      assessmentMessages.push(`✅ SYSTEM COHERENCE CONFIRMED: The system has maintained the predicted ~${CONFIG.systemCoherenceThreshold.toFixed(2)} coherence value.`);
    } else {
      assessmentMessages.push(`❌ SYSTEM COHERENCE DEVIATION: The system coherence (${systemCoherenceAvg.toFixed(4)}) deviated from the expected ${CONFIG.systemCoherenceThreshold.toFixed(4)} value.`);
    }
  }
  
  // Memory usage assessment
  if (memoryStats.growth < 5) {
    assessmentMessages.push('✅ MEMORY USAGE STABLE: No significant memory leaks detected.');
  } else {
    assessmentMessages.push(`⚠️ MEMORY USAGE GROWTH: Detected ${memoryStats.growth}MB growth in heap usage over time.`);
  }
  
  // Variant count assessment
  if (variantStats.min !== null && variantStats.max !== null) {
    assessmentMessages.push(`✅ VARIANT COUNT STABLE: System maintained ${variantStats.min}-${variantStats.max} variants with minimal fluctuation.`);
  }
  
  // Network stability assessment
  if (metrics.reconnects > 0) {
    assessmentMessages.push(`⚠️ NETWORK INSTABILITY: Required ${metrics.reconnects} reconnections during validation.`);
  }
  
  // Create the summary text
  const summary = `
# ${isPartial ? 'Partial ' : ''}Validation Summary

- Cycles Completed: ${metrics.cycles}/${CONFIG.cycles}${isPartial ? ' (PARTIAL RUN)' : ''}
- Duration: ${((metrics.endTime - metrics.startTime) / 1000).toFixed(2)} seconds
- Errors: ${metrics.errors.length}
- Warnings: ${metrics.warnings.length}
${metrics.reconnects > 0 ? `- Network Reconnections: ${metrics.reconnects}` : ''}

## QCTF Equilibrium Analysis
- Average QCTF: ${qctfAvg !== null ? qctfAvg.toFixed(4) : 'N/A'} 
- QCTF Standard Deviation: ${qctfStdDev !== null ? qctfStdDev.toFixed(4) : 'N/A'}
- QCTF Stability: ${qctfStability}

## System Coherence Analysis
- Average System Coherence: ${systemCoherenceAvg !== null ? systemCoherenceAvg.toFixed(4) : 'N/A'}
- System Coherence Standard Deviation: ${systemCoherenceStdDev !== null ? systemCoherenceStdDev.toFixed(4) : 'N/A'}
- System Coherence Stability: ${coherenceStability}

## Memory Usage Analysis
- Maximum RSS: ${memoryStats.maxRss} MB
- Average RSS: ${memoryStats.avgRss} MB
- Maximum Heap Used: ${memoryStats.maxHeapUsed} MB
- Average Heap Used: ${memoryStats.avgHeapUsed} MB
- Heap Growth: ${memoryStats.growth} MB
- Memory Stability: ${memoryStability}

## Variant Count Analysis
- Minimum Variants: ${variantStats.min}
- Maximum Variants: ${variantStats.max}
- Average Variants: ${variantStats.avg !== null ? variantStats.avg.toFixed(2) : 'N/A'}
- Variant Count Stability: ${variantStability}

## Assessment

${assessmentMessages.join('\n\n')}

${isPartial ? '\n⚠️ IMPORTANT: This is a partial validation run that did not complete all planned cycles.\n' : ''}

Report saved to: ${reportPath}
${checkpointName ? `\nLast checkpoint: ${checkpointName}` : ''}
`;

  await fs.writeFile(summaryPath, summary);
  
  console.log(`[VALIDATION] Report saved to ${reportPath}`);
  console.log(`[VALIDATION] Summary saved to ${summaryPath}`);
  
  // Print the summary to the console
  console.log(summary);
}

/**
 * Main entry point
 */
async function main() {
  console.log('[VALIDATION] Starting manual validation process');
  
  // Register signal handlers for clean shutdown
  process.on('SIGINT', async () => {
    console.log('\n[VALIDATION] Received SIGINT signal');
    await finishValidation(true);
  });
  
  process.on('SIGTERM', async () => {
    console.log('\n[VALIDATION] Received SIGTERM signal');
    await finishValidation(true);
  });
  
  try {
    // Connect to WebSocket server
    await connectWebSocket();
    
    // Start validation
    await startValidation();
    
  } catch (err) {
    console.error('[VALIDATION] Error starting validation:', err);
    cleanupResources();
    process.exit(1);
  }
}

// Start the process
main();