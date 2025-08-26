/**
 * Test Script to Generate Meta-Cognitive Events for Pattern Recognition
 * 
 * This script generates a series of meta-cognitive events that follow
 * specific patterns to trigger the pattern detection mechanisms in
 * the Meta-Cognitive Analysis Engine.
 * 
 * [QUANTUM_STATE: SIM_FLOW]
 */

// Import required modules
import { qrnService } from './server/services/qrn/quantum-root-node-service.js';
import { MetaCognitiveAnalysisEngine } from './server/services/qrn/meta-cognitive-analysis-engine.js';
import { storage } from './server/storage.js';

// Get the analysis engine instance
const analysisEngine = MetaCognitiveAnalysisEngine.getInstance();

/**
 * Generate a sequence of meta-cognitive events with a cyclical pattern
 */
async function generateCyclicalPattern() {
  console.log('Generating cyclical pattern of events...');
  
  const nodeId = 'test-node-cyclical';
  const eventType = 'system-heartbeat';
  
  // Create 10 events with consistent timing (every 2 seconds)
  for (let i = 0; i < 10; i++) {
    await qrnService.recordMetaCognitiveEvent({
      nodeId,
      type: eventType,
      description: `Regular system heartbeat #${i+1}`,
      details: {
        iteration: i+1,
        patternType: 'cyclical'
      },
      confidence: 0.9,
      impact: 2
    });
    
    // Wait exactly 2 seconds between events to create a clear pattern
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
  
  console.log('Cyclical pattern generation complete.');
}

/**
 * Generate a sequence of meta-cognitive events with a causal pattern
 */
async function generateCausalPattern() {
  console.log('Generating causal pattern of events...');
  
  const nodeId = 'test-node-causal';
  
  // Create 5 pairs of events with a cause-effect relationship
  for (let i = 0; i < 5; i++) {
    // First event (cause)
    await qrnService.recordMetaCognitiveEvent({
      nodeId,
      type: 'resource-allocation',
      description: `Allocating resources for task #${i+1}`,
      details: {
        iteration: i+1,
        patternType: 'causal',
        role: 'cause'
      },
      confidence: 0.95,
      impact: 4
    });
    
    // Wait a consistent 1 second before the effect
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Second event (effect)
    await qrnService.recordMetaCognitiveEvent({
      nodeId,
      type: 'performance-change',
      description: `Performance improved after resource allocation #${i+1}`,
      details: {
        iteration: i+1,
        patternType: 'causal',
        role: 'effect'
      },
      confidence: 0.85,
      impact: 6
    });
    
    // Wait between pairs
    await new Promise(resolve => setTimeout(resolve, 3000));
  }
  
  console.log('Causal pattern generation complete.');
}

/**
 * Generate a sequence of meta-cognitive events with a sequential pattern
 */
async function generateSequentialPattern() {
  console.log('Generating sequential pattern of events...');
  
  const nodeId = 'test-node-sequential';
  const sequence = [
    'initialization',
    'data-load',
    'processing',
    'validation',
    'completion'
  ];
  
  // Repeat the sequence 3 times
  for (let iteration = 0; iteration < 3; iteration++) {
    console.log(`Generating sequence iteration ${iteration + 1}`);
    
    for (let i = 0; i < sequence.length; i++) {
      const eventType = sequence[i];
      
      await qrnService.recordMetaCognitiveEvent({
        nodeId,
        type: eventType,
        description: `${eventType} step in process flow (iteration ${iteration + 1})`,
        details: {
          iteration: iteration + 1,
          sequenceStep: i + 1,
          patternType: 'sequential'
        },
        confidence: 0.9,
        impact: 3 + i // Impact increases with each step in the sequence
      });
      
      // Wait a short time between events in the sequence
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    // Wait longer between sequence iterations
    await new Promise(resolve => setTimeout(resolve, 5000));
  }
  
  console.log('Sequential pattern generation complete.');
}

/**
 * Generate high-impact events to trigger anomaly detection
 */
async function generateAnomalies() {
  console.log('Generating anomalous high-impact events...');
  
  const nodeId = 'test-node-anomalies';
  
  // Create several regular, low-impact events
  for (let i = 0; i < 5; i++) {
    await qrnService.recordMetaCognitiveEvent({
      nodeId,
      type: 'routine-operation',
      description: `Routine operation #${i+1}`,
      details: {
        iteration: i+1
      },
      confidence: 0.95,
      impact: 2
    });
    
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  // Now create a high-impact anomalous event
  await qrnService.recordMetaCognitiveEvent({
    nodeId,
    type: 'critical-system-event',
    description: 'Unexpected high-impact system event',
    details: {
      isAnomaly: true,
      severity: 'high'
    },
    confidence: 0.9,
    impact: 9
  });
  
  // Add a few more routine events
  for (let i = 0; i < 3; i++) {
    await qrnService.recordMetaCognitiveEvent({
      nodeId,
      type: 'routine-operation',
      description: `Post-anomaly routine operation #${i+1}`,
      details: {
        iteration: i+1,
        phase: 'recovery'
      },
      confidence: 0.8,
      impact: 3
    });
    
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  console.log('Anomaly generation complete.');
}

/**
 * Generate events from multiple nodes to test node pattern detection
 */
async function generateMultiNodePatterns() {
  console.log('Generating multi-node interaction patterns...');
  
  const nodes = ['node-A', 'node-B', 'node-C'];
  
  // Generate coordinated events across nodes
  for (let i = 0; i < 3; i++) {
    // Node A initiates
    await qrnService.recordMetaCognitiveEvent({
      nodeId: nodes[0],
      type: 'request-initiation',
      description: `Node A initiates request #${i+1}`,
      details: {
        iteration: i+1,
        target: 'node-B'
      },
      confidence: 0.95,
      impact: 4
    });
    
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Node B processes
    await qrnService.recordMetaCognitiveEvent({
      nodeId: nodes[1],
      type: 'request-processing',
      description: `Node B processes request #${i+1} from Node A`,
      details: {
        iteration: i+1,
        source: 'node-A',
        target: 'node-C'
      },
      confidence: 0.9,
      impact: 5
    });
    
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    // Node C responds
    await qrnService.recordMetaCognitiveEvent({
      nodeId: nodes[2],
      type: 'request-completion',
      description: `Node C completes processing for request #${i+1}`,
      details: {
        iteration: i+1,
        source: 'node-B',
        responseFor: 'node-A'
      },
      confidence: 0.85,
      impact: 6
    });
    
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
  
  console.log('Multi-node pattern generation complete.');
}

/**
 * Run a full test suite for meta-cognitive pattern generation
 */
async function runPatternGenerationTest() {
  console.log('=== META-COGNITIVE PATTERN GENERATION TEST ===');
  
  // First, get current count of events, patterns, and insights
  const events = await storage.getAllMetaCognitiveEvents();
  console.log(`Current stats: ${events.length} events`);
  console.log(`Patterns: ${analysisEngine.getAllPatterns().length}, Insights: ${analysisEngine.getAllInsights().length}`);
  
  // Generate various patterns
  await generateCyclicalPattern();
  await generateCausalPattern();
  await generateSequentialPattern();
  await generateAnomalies();
  await generateMultiNodePatterns();
  
  // Force background analysis
  console.log('Forcing background analysis...');
  await analysisEngine.performBackgroundAnalysis();
  
  // Check results
  console.log('=== TEST COMPLETED ===');
  const newEventCount = (await storage.getAllMetaCognitiveEvents()).length;
  console.log(`New stats: ${newEventCount} events (${newEventCount - events.length} new)`);
  console.log(`Patterns: ${analysisEngine.getAllPatterns().length}, Insights: ${analysisEngine.getAllInsights().length}`);
  
  console.log('Pattern detection test complete. Check the dashboard for visualized patterns and insights.');
}

// Run the test
runPatternGenerationTest().catch(error => {
  console.error('Error in pattern generation test:', error);
});