/**
 * Direct test script for Explicit-Implicit Quantum Balance principle
 * 
 * This script demonstrates how the Quantum Glossary maintains balance between
 * explicit tactical definitions and implicit strategic framework, preventing
 * recursive loops while preserving quantum adaptation capability.
 */

// Import required dependencies
import fs from 'fs';
import path from 'path';

// Mock verification patterns to avoid external dependencies
const countBoundaryPatterns = () => 5;
const countResponsibilityPatterns = () => 3;
const boundaryPatterns = [{ name: 'test' }];
const responsibilityPatterns = [{ name: 'test' }];

// Mock ChronosDateHandler
class ChronosDateHandler {
  static createDate() {
    return new Date();
  }
  
  static formatDateISO(date) {
    return date.toISOString();
  }
}

/**
 * OperatingContext enum (copied from quantum-glossary.ts)
 */
const OperatingContext = {
  SIMULATION: 'SIM',
  REAL_WORLD: 'REAL'
};

/**
 * FlowType enum (copied from quantum-glossary.ts)
 */
const FlowType = {
  FLOW: 'FLOW',
  ANTIFLOW: 'ANTIFLOW'
};

/**
 * VerificationStatus enum (copied from quantum-glossary.ts)
 */
const VerificationStatus = {
  VERIFIED: 'VERIFIED',
  WARNING: 'WARNING',
  FAILED: 'FAILED',
  UNKNOWN: 'UNKNOWN'
};

/**
 * Strategic Context interface (copied from quantum-glossary.ts)
 */
class StrategicContext {
  constructor(contextDescription, possibleNextActions, metadata = {}) {
    this.contextDescription = contextDescription;
    this.possibleNextActions = possibleNextActions;
    this.metadata = metadata;
  }
}

/**
 * Test version of Quantum Glossary class
 */
class TestQuantumGlossary {
  constructor() {
    // Determine operating context based on NODE_ENV
    this.currentContext = process.env.NODE_ENV === 'production'
      ? OperatingContext.REAL_WORLD
      : OperatingContext.SIMULATION;
    
    // Set verification thresholds
    this.verificationConfig = {
      boundaryThreshold: 2,
      responsibilityThreshold: 2
    };
    
    this.lastOperationTimestamp = ChronosDateHandler.createDate();
    this.flowMetrics = [];
    
    // Initialize verification metrics
    this.verificationMetrics = new Map();
    this.verificationStatistics = {
      totalBoundaries: 0,
      totalResponsibilities: 0,
      modulesAnalyzed: 0,
      lastFullScan: new Date(0)
    };
    
    // Core principles array - maintains the implicit strategic flexibility
    this.corePrinciples = [
      {
        name: 'Explicit-Implicit Balance',
        description: 'Maintain balance between explicit tactical definitions and implicit strategic framework',
        adaptivity: 0.8
      },
      {
        name: 'Boundary-Aware Decomposition',
        description: 'Recognize and respect system boundaries during operations',
        adaptivity: 0.7
      },
      {
        name: 'Quantum-Adaptive Framework',
        description: 'Core conceptual framework remains adaptive and resists full decoherence',
        adaptivity: 0.9
      },
      {
        name: 'Tactical Clarity',
        description: 'Individual actions and operations are explicitly defined',
        adaptivity: 0.3
      },
      {
        name: 'Strategic Flexibility',
        description: 'High-level strategies remain implicitly defined to prevent recursive loops',
        adaptivity: 0.85
      }
    ];
  }
  
  getOperatingContext() {
    this.lastOperationTimestamp = ChronosDateHandler.createDate();
    return this.currentContext;
  }
  
  tagWithContext(message) {
    const tag = `[${this.currentContext}]`;
    this.lastOperationTimestamp = ChronosDateHandler.createDate();
    return `${tag} ${message}`;
  }
  
  isSimulation() {
    this.lastOperationTimestamp = ChronosDateHandler.createDate();
    return this.currentContext === OperatingContext.SIMULATION;
  }
  
  isRealWorld() {
    this.lastOperationTimestamp = ChronosDateHandler.createDate();
    return this.currentContext === OperatingContext.REAL_WORLD;
  }
  
  getVerificationConfig() {
    this.lastOperationTimestamp = ChronosDateHandler.createDate();
    return { ...this.verificationConfig };
  }
  
  /**
   * Get core principles - provides read-only access to the implicit strategic framework
   */
  getCorePrinciples() {
    const timestamp = ChronosDateHandler.createDate();
    this.logOperation('Accessed core principles', timestamp);
    
    // Return a deep copy to prevent modification of the original principles
    return JSON.parse(JSON.stringify(this.corePrinciples));
  }
  
  /**
   * Decohere strategic context into explicit tactical action
   */
  decohere(context) {
    const timestamp = ChronosDateHandler.createDate();
    
    // Validate input
    if (!context.possibleNextActions || context.possibleNextActions.length === 0) {
      this.logError('Cannot decohere empty context with no possible actions', null);
      return 'ERROR: No possible actions provided';
    }
    
    // Choose the first action as the explicit tactical step
    const chosenAction = context.possibleNextActions[0];
    
    // Log the decoherence operation
    this.logOperation(`Decohered context "${context.contextDescription}" to explicit action: ${chosenAction}`, timestamp);
    
    // Record a flow metric for the decoherence operation
    this.recordFlowMetric(
      FlowType.FLOW,
      'quantum-decoherence',
      0.95,
      {
        contextDescription: context.contextDescription,
        numPossibleActions: context.possibleNextActions.length,
        chosenAction,
        timestamp: timestamp.toISOString()
      }
    );
    
    return chosenAction;
  }
  
  getGlossaryInfo() {
    const timestamp = ChronosDateHandler.createDate();
    
    // Calculate recent metrics
    const recentFlowMetrics = this.getFlowMetrics(undefined, 10);
    const systemStability = this.calculateSystemStability();
    
    // Count metrics by type
    const flowMetricsCount = this.flowMetrics.filter(m => m.type === FlowType.FLOW).length;
    const antiflowMetricsCount = this.flowMetrics.filter(m => m.type === FlowType.ANTIFLOW).length;
    
    return {
      // Operating context
      operatingContext: this.currentContext,
      contextTag: this.tagWithContext(''),
      isProduction: this.isRealWorld(),
      
      // Module verification metrics 
      verificationMetrics: {
        boundaryThreshold: this.verificationConfig.boundaryThreshold,
        responsibilityThreshold: this.verificationConfig.responsibilityThreshold,
        modulesVerified: this.verificationMetrics.size,
        totalBoundaries: this.verificationStatistics.totalBoundaries,
        totalResponsibilities: this.verificationStatistics.totalResponsibilities,
        modulesAnalyzed: this.verificationStatistics.modulesAnalyzed,
        lastFullScan: this.verificationStatistics.lastFullScan.toISOString()
      },
      
      // Flow metrics and system stability
      flowMetrics: {
        totalMetricsRecorded: this.flowMetrics.length,
        flowCount: flowMetricsCount,
        antiflowCount: antiflowMetricsCount,
        recentMetrics: recentFlowMetrics.map(m => ({
          type: m.type,
          source: m.source,
          value: m.value,
          timestamp: m.timestamp.toISOString()
        })),
        systemStability: systemStability
      },
      
      // System timestamps
      timestamps: {
        current: timestamp.toISOString(),
        lastOperation: this.lastOperationTimestamp.toISOString()
      }
    };
  }
  
  logOperation(message, timestamp) {
    const contextTag = this.tagWithContext('');
    console.log(`${contextTag} ${ChronosDateHandler.formatDateISO(timestamp)} - Quantum Glossary: ${message}`);
  }
  
  logError(message, error) {
    const timestamp = ChronosDateHandler.createDate();
    const contextTag = this.tagWithContext('');
    console.error(`${contextTag} ${ChronosDateHandler.formatDateISO(timestamp)} - ERROR - Quantum Glossary: ${message}`);
    if (error) {
      console.error(error);
    }
  }
  
  recordFlowMetric(type, source, value, metadata = {}) {
    const timestamp = ChronosDateHandler.createDate();
    this.flowMetrics.push({ type, source, value, metadata, timestamp });
    
    // Trim flow metrics if needed to prevent unbounded growth
    if (this.flowMetrics.length > 1000) {
      this.flowMetrics = this.flowMetrics.slice(-1000);
    }
  }
  
  getFlowMetrics(type, limit = 10) {
    const filteredMetrics = type 
      ? this.flowMetrics.filter(m => m.type === type)
      : this.flowMetrics;
      
    return filteredMetrics.slice(-limit);
  }
  
  calculateSystemStability() {
    // Get recent metrics, weighted more heavily toward recent events
    const recentMetrics = this.getFlowMetrics(undefined, 20);
    
    if (recentMetrics.length === 0) {
      return 0.5; // Default neutral stability
    }
    
    // Calculate weighted stability score
    const weightedSum = recentMetrics.reduce((acc, metric, index) => {
      const weight = (index + 1) / recentMetrics.length; // More recent = higher weight
      const value = metric.type === FlowType.FLOW ? metric.value : -metric.value;
      return acc + (value * weight);
    }, 0);
    
    // Normalize to 0-1 range
    return Math.min(Math.max((weightedSum + 1) / 2, 0), 1);
  }
}

// Create singleton instance
const quantumGlossary = new TestQuantumGlossary();

/**
 * Run a test demonstration of the Explicit-Implicit Quantum Balance
 */
async function runTest() {
  console.log('===== Testing Explicit-Implicit Quantum Balance =====');
  console.log('\n1. Reading the implicit strategic core principles:');
  
  // Get the core principles which represent the implicit strategic framework
  const corePrinciples = quantumGlossary.getCorePrinciples();
  
  // Display the principles
  console.log('Core Principles (Implicit Strategic Framework):');
  corePrinciples.forEach(principle => {
    console.log(`- ${principle.name} (adaptivity: ${principle.adaptivity})`);
    console.log(`  ${principle.description}`);
  });
  
  // Create a strategic context with multiple possible actions
  console.log('\n2. Creating a strategic context with multiple possible actions:');
  const strategicContext = new StrategicContext(
    'User needs to analyze large dataset',
    [
      'Split dataset into manageable chunks',
      'Perform preliminary data analysis',
      'Check data integrity',
      'Create visualization of dataset structure'
    ],
    {
      datasetSize: '2.3GB',
      priority: 'high',
      dataType: 'structured'
    }
  );
  
  console.log(`Context: ${strategicContext.contextDescription}`);
  console.log('Possible actions:');
  strategicContext.possibleNextActions.forEach(action => {
    console.log(`- ${action}`);
  });
  
  // Use the decohere method to get explicit tactical guidance
  console.log('\n3. Decohering the strategic context into explicit tactical action:');
  const explicitAction = quantumGlossary.decohere(strategicContext);
  console.log(`Chosen explicit action: ${explicitAction}`);
  
  // Demonstrate a second strategic context
  console.log('\n4. Creating a different strategic context:');
  const anotherContext = new StrategicContext(
    'System needs to optimize memory usage',
    [
      'Implement memory pooling',
      'Add garbage collection hooks',
      'Analyze memory usage patterns',
      'Refactor large data structures'
    ],
    {
      currentMemoryUsage: '1.2GB',
      criticalThreshold: '1.5GB',
      priority: 'medium'
    }
  );
  
  console.log(`Context: ${anotherContext.contextDescription}`);
  console.log('Possible actions:');
  anotherContext.possibleNextActions.forEach(action => {
    console.log(`- ${action}`);
  });
  
  // Use the decohere method to get explicit tactical guidance
  console.log('\n5. Decohering this context into explicit tactical action:');
  const anotherExplicitAction = quantumGlossary.decohere(anotherContext);
  console.log(`Chosen explicit action: ${anotherExplicitAction}`);
  
  // Get system information which includes both explicit and implicit aspects
  console.log('\n6. Getting system information (combination of explicit and implicit aspects):');
  const glossaryInfo = quantumGlossary.getGlossaryInfo();
  console.log('System information:');
  console.log(`- Operating context: ${glossaryInfo.operatingContext}`);
  console.log(`- System stability: ${glossaryInfo.flowMetrics.systemStability.toFixed(2)}`);
  console.log(`- Verification metrics available: ${glossaryInfo.verificationMetrics.modulesVerified}`);
  
  console.log('\n===== Explicit-Implicit Quantum Balance Test Complete =====');
}

// Run the test
runTest().catch(error => {
  console.error('Test failed:', error);
});