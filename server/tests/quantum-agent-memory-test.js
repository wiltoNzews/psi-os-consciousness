/**
 * Test script for Quantum Chunking integration with QuantumAgentManager
 * using the InMemoryPersistenceLayer for high-performance testing
 * 
 * This script demonstrates how the Quantum Chunking architecture is used
 * by the QuantumAgentManager to process tasks through multiple approaches
 * simultaneously before selecting the optimal approach.
 * 
 * [α/S+/🧪] Quantum Agent Memory Persistence Integration Test
 */

import { QuantumAgentManager } from '../services/qrn/quantum-agent-manager.js';
import { quantumGlossary } from '../services/qrn/quantum-glossary.js';
import { systemLogger, DomainEmoji } from '../utils/symbolic-logger.js';

// Create a simple in-memory persistence layer for JavaScript to avoid TypeScript import issues
class InMemoryPersistenceLayer {
  constructor() {
    this.storage = new Map();
    console.log('[α/S+/💾] InMemoryPersistenceLayer initialized for agent testing');
  }
  
  async save(key, data) {
    // Deep clone to simulate serialization
    this.storage.set(key, JSON.parse(JSON.stringify(data)));
    return Promise.resolve();
  }
  
  async load(key) {
    const data = this.storage.get(key);
    return Promise.resolve(data ? JSON.parse(JSON.stringify(data)) : null);
  }
  
  async delete(key) {
    const existed = this.storage.has(key);
    this.storage.delete(key);
    return Promise.resolve(existed);
  }
  
  async getKeys(prefix) {
    const keys = [];
    for (const key of this.storage.keys()) {
      if (!prefix || key.startsWith(prefix)) {
        keys.push(key);
      }
    }
    return Promise.resolve(keys);
  }
  
  getSize() {
    return this.storage.size;
  }
  
  clear() {
    this.storage.clear();
    return Promise.resolve();
  }
}

// Create a persistence layer for testing
const memoryPersistence = new InMemoryPersistenceLayer();

// Sample task profiles for testing different task characteristics
const sampleTaskProfiles = {
  simpleAnalysis: {
    depth: 'shallow',
    urgency: 'medium',
    domain: 'data analysis',
    complexity: 'simple',
    creativityNeeded: false,
    costSensitivity: 'medium',
    ethicalConsiderations: false,
    mainRequirement: 'speed'
  },
  
  complexCreative: {
    depth: 'deep',
    urgency: 'low',
    domain: 'creative writing',
    complexity: 'complex',
    creativityNeeded: true,
    costSensitivity: 'low',
    ethicalConsiderations: false,
    mainRequirement: 'creativity'
  },
  
  ethicalDecision: {
    depth: 'moderate',
    urgency: 'medium',
    domain: 'ethics',
    complexity: 'moderate',
    creativityNeeded: false,
    costSensitivity: 'low',
    ethicalConsiderations: true,
    mainRequirement: 'ethics'
  },
  
  urgentCode: {
    depth: 'moderate',
    urgency: 'high',
    domain: 'code',
    complexity: 'moderate',
    creativityNeeded: false,
    costSensitivity: 'medium',
    ethicalConsiderations: false,
    mainRequirement: 'speed'
  }
};

// Sample task content for each profile
const sampleTasks = {
  simpleAnalysis: "Analyze the attached CSV file and provide basic statistics on customer purchase patterns.",
  complexCreative: "Write a creative short story about a world where time flows backwards, focusing on emotional impact.",
  ethicalDecision: "Evaluate the ethical considerations of an AI system that predicts criminal recidivism.",
  urgentCode: "Debug this function that's causing a memory leak in our production environment: function processArray(data) {...}"
};

/**
 * Main test function
 */
async function runTest() {
  systemLogger.info('Starting Quantum Agent Memory Persistence Integration Test', DomainEmoji.TESTING);
  
  const startTime = Date.now();
  
  try {
    // Initialize the agent manager (using the singleton quantumGlossary)
    const agentManager = new QuantumAgentManager();
    
    // Save initial state to memory persistence
    await memoryPersistence.save('agent-test:start', {
      timestamp: new Date(),
      agentManager: 'initialized',
      taskCount: Object.keys(sampleTaskProfiles).length
    });
    
    // Test each task profile with quantum chunking
    for (const [profileName, profile] of Object.entries(sampleTaskProfiles)) {
      const taskStart = Date.now();
      systemLogger.info(`Testing task profile: ${profileName}`, DomainEmoji.TESTING);
      
      // Process the task with quantum chunking
      const taskContent = sampleTasks[profileName];
      const result = await agentManager.processTaskWithQuantumChunking(
        taskContent,
        profile
      );
      
      const taskEnd = Date.now();
      const taskDuration = taskEnd - taskStart;
      
      // Save task result to memory persistence
      await memoryPersistence.save(`agent-test:task:${profileName}`, {
        profileName,
        selectedApproach: result.selectedApproach,
        processingTime: result.metrics.processingTime,
        confidence: result.metrics.confidence,
        exploredApproaches: result.metrics.exploredApproaches,
        chunkState: result.quantumChunk.state.current,
        duration: taskDuration
      });
      
      // Log the results
      systemLogger.info(
        `✓ Task processed with ${result.metrics.exploredApproaches} approaches in ${result.metrics.processingTime}ms`,
        DomainEmoji.TESTING
      );
      systemLogger.info(
        `✓ Selected approach: ${result.selectedApproach}`,
        DomainEmoji.TESTING
      );
      systemLogger.info(
        `✓ Confidence score: ${result.metrics.confidence}`,
        DomainEmoji.TESTING
      );
      
      // Log with symbolic formatting
      console.log(`\n[α/S+/🧪] ${profileName.toUpperCase()} TASK RESULTS:`);
      console.log(`  • Selected approach: ${result.selectedApproach}`);
      console.log(`  • Processing time: ${result.metrics.processingTime}ms`);
      console.log(`  • Confidence: ${result.metrics.confidence}`);
      console.log(`  • Chunk state: ${result.quantumChunk.state.current}`);
      console.log(`  • Total task duration: ${taskDuration}ms`);
      console.log('\n' + '-'.repeat(80) + '\n');
    }
    
    const endTime = Date.now();
    const totalDuration = endTime - startTime;
    
    // Save final results to memory persistence
    await memoryPersistence.save('agent-test:results', {
      timestamp: new Date(),
      totalDuration,
      status: 'success',
      taskCount: Object.keys(sampleTaskProfiles).length
    });
    
    // Log summary stats
    console.log(`[α/S+/🧪] MEMORY PERSISTENCE STATISTICS:`);
    const keys = await memoryPersistence.getKeys();
    console.log(`  • Total items in memory storage: ${memoryPersistence.getSize()}`);
    console.log(`  • Keys in memory storage: ${keys.length}`);
    console.log(`  • Total test duration: ${totalDuration}ms`);
    
    systemLogger.info(`Quantum Agent Memory Test completed successfully in ${totalDuration}ms`, DomainEmoji.TESTING);
    
  } catch (error) {
    systemLogger.error(`Test failed: ${error.message}`, DomainEmoji.SYSTEM);
    console.error(`\n[α/S-/🚫] TEST FAILURE: ${error.message}\n`);
    console.error(error);
    
    // Save error to memory persistence
    await memoryPersistence.save('agent-test:error', {
      timestamp: new Date(),
      error: error.message,
      stack: error.stack
    });
  }
}

// Run the test
runTest().catch(err => {
  console.error('Error running agent test:', err);
});