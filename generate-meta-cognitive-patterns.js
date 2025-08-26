/**
 * Test Script for Generating Meta-Cognitive Patterns
 * 
 * This script generates a series of meta-cognitive events in various patterns
 * to test the pattern detection algorithms in the Meta-Cognitive Analysis Engine.
 * 
 * [QUANTUM_STATE: SIM_FLOW]
 */

import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';

// Get the current file's directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const NUM_CYCLICAL_EVENTS = 15;
const NUM_CAUSAL_EVENTS = 10;
const NUM_SEQUENTIAL_EVENTS = 12;
const NUM_ANOMALY_EVENTS = 3;
const NUM_MULTI_NODE_EVENTS = 8;

// Event types
const EVENT_TYPES = [
  'insight_generated', 
  'pattern_detected',
  'task_completed',
  'reasoning_applied',
  'context_shift',
  'verification_check',
  'model_selection',
  'resource_optimization'
];

// Nodes
const NODES = [
  { id: 'system', name: 'System QRN' },
  { id: 'orchestrator', name: 'Neural Orchestrator' },
  { id: 'qrn-manager', name: 'QRN Manager' },
  { id: 'meta-cognitive', name: 'Meta-Cognitive Engine' }
];

// Helper to generate a UUID
function generateId() {
  return crypto.randomUUID();
}

// Helper to create a date in the past
function createPastDate(minutesAgo) {
  const date = new Date();
  date.setMinutes(date.getMinutes() - minutesAgo);
  return date;
}

/**
 * Create a meta-cognitive event
 */
function createEvent(nodeId, eventType, description, details, minutesAgo = 0, confidence = 0.85) {
  return {
    id: generateId(),
    nodeId,
    type: eventType,
    eventType,
    createdAt: createPastDate(minutesAgo),
    timestamp: createPastDate(minutesAgo),  // for compatibility with both field names
    description,
    details,
    sourcePath: `server/services/${nodeId.includes('meta') ? 'qrn/meta-cognitive' : nodeId.split('-').join('/')}`,
    sourceContext: {
      module: nodeId,
      function: `process${eventType.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join('')}`
    },
    confidence: confidence,
    confidenceLevel: confidence  // for compatibility with both field names
  };
}

/**
 * Save events to a JSON file for further analysis
 */
async function saveEvents(events, patterns = [], insights = []) {
  const outputPath = path.join(__dirname, 'meta-cognitive-events.json');
  const outputData = {
    events,
    patterns,
    insights,
    generatedAt: new Date().toISOString(),
    stats: {
      totalEvents: events.length,
      totalPatterns: patterns.length,
      totalInsights: insights.length,
      eventTypes: [...new Set(events.map(e => e.eventType))],
      nodeIds: [...new Set(events.map(e => e.nodeId))]
    }
  };
  
  await fs.writeFile(outputPath, JSON.stringify(outputData, null, 2));
  console.log(`Saved ${events.length} events, ${patterns.length} patterns, and ${insights.length} insights to ${outputPath}`);
  return outputPath;
}

/**
 * Generate a sequence of meta-cognitive events with a cyclical pattern
 */
async function generateCyclicalPattern() {
  const cyclicalEvents = [];
  const nodeId = NODES[0].id;
  const eventTypes = ['insight_generated', 'pattern_detected', 'context_shift', 'verification_check', 'insight_generated'];
  
  // Create a cycle that repeats
  for (let i = 0; i < NUM_CYCLICAL_EVENTS; i++) {
    const eventType = eventTypes[i % eventTypes.length];
    const minutesAgo = 60 - i * 4; // Events spread over the last hour
    
    const description = `Cyclical ${eventType.replace('_', ' ')} #${Math.floor(i / eventTypes.length) + 1}`;
    const details = {
      cycle: Math.floor(i / eventTypes.length) + 1,
      position: i % eventTypes.length + 1,
      totalSteps: eventTypes.length,
      metrics: {
        importance: (i % 3) + 1,
        complexity: (i % 4) + 1
      }
    };
    
    cyclicalEvents.push(createEvent(nodeId, eventType, description, details, minutesAgo));
  }
  
  console.log(`Generated ${cyclicalEvents.length} cyclical pattern events`);
  return cyclicalEvents;
}

/**
 * Generate a sequence of meta-cognitive events with a causal pattern
 */
async function generateCausalPattern() {
  const causalEvents = [];
  const nodeId = NODES[1].id;
  
  // Start with a trigger event
  const triggerEvent = createEvent(
    nodeId,
    'task_completed',
    'Large task decomposition completed',
    {
      taskId: generateId(),
      subTasksCreated: 5,
      completionTime: 1200,
      result: 'success'
    },
    55 // 55 minutes ago
  );
  causalEvents.push(triggerEvent);
  
  // Add subsequent events in a causal chain
  for (let i = 0; i < NUM_CAUSAL_EVENTS - 1; i++) {
    const minutesAgo = 55 - (i + 1) * 5;
    const eventType = EVENT_TYPES[i % (EVENT_TYPES.length - 1) + 1]; // Skip the first event type
    
    const description = `Effect ${i+1} from task decomposition`;
    const details = {
      causeId: i === 0 ? triggerEvent.id : causalEvents[causalEvents.length - 1].id,
      effectNumber: i + 1,
      triggerEvent: i === 0 ? 'task_completed' : causalEvents[causalEvents.length - 1].eventType,
      metrics: {
        directness: (NUM_CAUSAL_EVENTS - i) / NUM_CAUSAL_EVENTS, // Decreasing directness
        strength: Math.max(0.1, 1 - (i * 0.15))  // Decreasing strength of causal relationship
      }
    };
    
    causalEvents.push(createEvent(nodeId, eventType, description, details, minutesAgo));
  }
  
  console.log(`Generated ${causalEvents.length} causal pattern events`);
  return causalEvents;
}

/**
 * Generate a sequence of meta-cognitive events with a sequential pattern
 */
async function generateSequentialPattern() {
  const sequentialEvents = [];
  const nodeId = NODES[2].id;
  const baseEventType = 'reasoning_applied';
  
  // Generate a sequence of related events with consistent naming/numbering
  for (let i = 0; i < NUM_SEQUENTIAL_EVENTS; i++) {
    const minutesAgo = 45 - i * 3; // Events spread over the last 45 minutes
    
    const stepNumber = i + 1;
    const description = `Sequential reasoning step ${stepNumber}/${NUM_SEQUENTIAL_EVENTS}`;
    const details = {
      sequenceId: 'seq-reasoning-chain-alpha',
      stepNumber,
      totalSteps: NUM_SEQUENTIAL_EVENTS,
      reasoning: {
        technique: ['deduction', 'induction', 'abduction'][i % 3],
        premise: `Premise for step ${stepNumber}`,
        conclusion: `Conclusion for step ${stepNumber}`
      }
    };
    
    sequentialEvents.push(createEvent(nodeId, baseEventType, description, details, minutesAgo));
  }
  
  console.log(`Generated ${sequentialEvents.length} sequential pattern events`);
  return sequentialEvents;
}

/**
 * Generate high-impact events to trigger anomaly detection
 */
async function generateAnomalies() {
  const anomalyEvents = [];
  const nodeId = NODES[3].id;
  
  // Create a few anomalous events with very different characteristics
  for (let i = 0; i < NUM_ANOMALY_EVENTS; i++) {
    const minutesAgo = 30 - i * 10;
    const eventType = EVENT_TYPES[Math.floor(Math.random() * EVENT_TYPES.length)];
    
    const description = `Anomalous ${eventType.replace('_', ' ')} detected`;
    const details = {
      anomalyType: ['statistical_outlier', 'pattern_break', 'unexpected_value'][i % 3],
      severity: 0.9 + (i * 0.03),
      impact: 'high',
      normalRange: {
        min: 0.1,
        max: 0.7,
        observedValue: 0.95 + (i * 0.05)
      }
    };
    
    // Add anomalous events with very high confidence
    anomalyEvents.push(createEvent(nodeId, eventType, description, details, minutesAgo, 0.99));
  }
  
  console.log(`Generated ${anomalyEvents.length} anomaly events`);
  return anomalyEvents;
}

/**
 * Generate events from multiple nodes to test node pattern detection
 */
async function generateMultiNodePatterns() {
  const multiNodeEvents = [];
  
  // Create patterns that span across multiple nodes
  for (let i = 0; i < NUM_MULTI_NODE_EVENTS; i++) {
    const nodeIndex = i % NODES.length;
    const nodeId = NODES[nodeIndex].id;
    const eventType = EVENT_TYPES[i % EVENT_TYPES.length];
    const minutesAgo = 20 - i * 2;
    
    const description = `Cross-node pattern event from ${NODES[nodeIndex].name}`;
    const details = {
      patternId: 'cross-node-communication',
      nodeRole: ['initiator', 'processor', 'responder', 'validator'][nodeIndex],
      correlationId: 'multi-node-pattern-alpha',
      metrics: {
        nodeInteraction: (i + 1) / NUM_MULTI_NODE_EVENTS,
        patternStrength: 0.7 + (i * 0.03)
      }
    };
    
    multiNodeEvents.push(createEvent(nodeId, eventType, description, details, minutesAgo));
  }
  
  console.log(`Generated ${multiNodeEvents.length} multi-node pattern events`);
  return multiNodeEvents;
}

/**
 * Generate some basic patterns and insights
 */
function generatePatternsAndInsights(events) {
  // Create some basic patterns
  const patterns = [
    {
      id: generateId(),
      name: 'Cyclical System Operations',
      description: 'Regular cycle of operations within the System QRN',
      eventType: 'pattern_detected',
      nodeIds: [NODES[0].id],
      eventCount: NUM_CYCLICAL_EVENTS,
      patternType: 'cyclical',
      confidence: 0.92,
      confidenceLevel: 0.92,
      createdAt: new Date(),
      timestamp: new Date()
    },
    {
      id: generateId(),
      name: 'Causal Chain: Task Decomposition',
      description: 'Causal relationships between task completion and subsequent events',
      eventType: 'pattern_detected',
      nodeIds: [NODES[1].id],
      eventCount: NUM_CAUSAL_EVENTS,
      patternType: 'causal',
      confidence: 0.87,
      confidenceLevel: 0.87,
      createdAt: new Date(),
      timestamp: new Date()
    },
    {
      id: generateId(),
      name: 'Sequential Reasoning Steps',
      description: 'Sequential application of reasoning techniques',
      eventType: 'pattern_detected',
      nodeIds: [NODES[2].id],
      eventCount: NUM_SEQUENTIAL_EVENTS,
      patternType: 'sequential',
      confidence: 0.94,
      confidenceLevel: 0.94,
      createdAt: new Date(),
      timestamp: new Date()
    }
  ];
  
  // Create some insights derived from the patterns
  const insights = [
    {
      id: generateId(),
      name: 'System Operation Efficiency',
      description: 'Cyclical operations show consistent timing patterns',
      eventType: 'insight_generated',
      sourcePatternIds: [patterns[0].id],
      actionability: 'high',
      impact: 'medium',
      confidence: 0.85,
      confidenceLevel: 0.85,
      createdAt: new Date(),
      timestamp: new Date()
    },
    {
      id: generateId(),
      name: 'Task Decomposition Cascade',
      description: 'Task decomposition creates predictable follow-on effects',
      eventType: 'insight_generated',
      sourcePatternIds: [patterns[1].id],
      actionability: 'medium',
      impact: 'high',
      confidence: 0.82,
      confidenceLevel: 0.82,
      createdAt: new Date(),
      timestamp: new Date()
    },
    {
      id: generateId(),
      name: 'Reasoning Chain Effectiveness',
      description: 'Sequential reasoning shows high coherence across steps',
      eventType: 'insight_generated',
      sourcePatternIds: [patterns[2].id],
      actionability: 'high',
      impact: 'high',
      confidence: 0.91,
      confidenceLevel: 0.91,
      createdAt: new Date(),
      timestamp: new Date()
    }
  ];
  
  return { patterns, insights };
}

/**
 * Run a full test suite for meta-cognitive pattern generation
 */
async function runPatternGeneration() {
  try {
    console.log("Starting Meta-Cognitive Pattern Generation...");
    
    // Generate events with different patterns
    const cyclicalEvents = await generateCyclicalPattern();
    const causalEvents = await generateCausalPattern();
    const sequentialEvents = await generateSequentialPattern();
    const anomalyEvents = await generateAnomalies();
    const multiNodeEvents = await generateMultiNodePatterns();
    
    // Combine all events
    const allEvents = [
      ...cyclicalEvents,
      ...causalEvents,
      ...sequentialEvents,
      ...anomalyEvents,
      ...multiNodeEvents
    ];
    
    // Generate some patterns and insights
    const { patterns, insights } = generatePatternsAndInsights(allEvents);
    
    // Save to file for analysis
    await saveEvents(allEvents, patterns, insights);
    
    console.log("Meta-Cognitive Pattern Generation Complete.");
    console.log(`Generated ${patterns.length} patterns and ${insights.length} insights.`);
    
    // Return the generated data for further processing if needed
    return { events: allEvents, patterns, insights };
    
  } catch (error) {
    console.error("Error in pattern generation:", error);
    console.error(error.stack);
    throw error;
  }
}

// Run the pattern generation
runPatternGeneration().catch(error => {
  console.error("Error in pattern generation:", error);
  console.error(error.stack);
});