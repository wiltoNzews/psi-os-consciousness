/**
 * Test script for Quantum Chunking integration with QuantumAgentManager
 * 
 * This script demonstrates how the Quantum Chunking architecture is used
 * by the QuantumAgentManager to process tasks through multiple approaches
 * simultaneously before selecting the optimal approach.
 * 
 * [α/S+/🧪] Quantum Agent Chunking Integration Test
 */

import { QuantumAgentManager } from '../services/qrn/quantum-agent-manager.ts';
import { QuantumGlossary } from '../services/qrn/quantum-glossary.ts';
import { systemLogger, DomainEmoji } from '../utils/symbolic-logger.ts';

// Sample task profiles for testing
const sampleTaskProfiles = {
  simpleAnalysis: {
    depth: 'shallow',
    urgency: 'medium',
    domain: 'data analysis',
    complexity: 'simple',
    creativityNeeded: false,
    costSensitivity: 'medium',
    ethicalConsiderations: false,
    mainRequirement: 'accuracy'
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
    urgency: 'high',
    domain: 'ethics',
    complexity: 'moderate',
    creativityNeeded: false,
    costSensitivity: 'medium',
    ethicalConsiderations: true,
    mainRequirement: 'ethics'
  },
  urgentCode: {
    depth: 'shallow',
    urgency: 'high',
    domain: 'code optimization',
    complexity: 'moderate',
    creativityNeeded: false,
    costSensitivity: 'high',
    ethicalConsiderations: false,
    mainRequirement: 'speed'
  }
};

// Sample tasks
const sampleTasks = {
  simpleAnalysis: "Analyze the following sales data for Q1 2025 and identify the key trends: [Sales data would be here]",
  complexCreative: "Create a compelling sci-fi short story that explores the ethical implications of quantum consciousness",
  ethicalDecision: "Evaluate the ethical considerations of deploying autonomous vehicles in urban environments",
  urgentCode: "Optimize this sorting algorithm for better performance: [Code would be here]"
};

/**
 * Main test function
 */
async function runTest() {
  systemLogger.info('Starting Quantum Agent Chunking Integration Test', DomainEmoji.TESTING);
  
  try {
    // Initialize the quantum glossary and agent manager
    const glossary = new QuantumGlossary();
    const agentManager = new QuantumAgentManager(glossary);
    
    // Test each task profile with quantum chunking
    for (const [profileName, profile] of Object.entries(sampleTaskProfiles)) {
      systemLogger.info(`Testing task profile: ${profileName}`, DomainEmoji.TESTING);
      
      // Process the task with quantum chunking
      const taskContent = sampleTasks[profileName];
      const result = await agentManager.processTaskWithQuantumChunking(
        taskContent,
        profile
      );
      
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
      console.log('\n' + '-'.repeat(80) + '\n');
    }
    
    systemLogger.info('Quantum Agent Chunking Integration Test completed successfully', DomainEmoji.TESTING);
    
  } catch (error) {
    systemLogger.error(`Test failed: ${error.message}`, DomainEmoji.SYSTEM);
    console.error(error);
  }
}

// Run the test
runTest().catch(err => console.error('Test error:', err));