/**
 * Test script for Dynamic Agent Selection
 * 
 * This script tests the QuantumAgentManager's ability to dynamically
 * select the most appropriate agent based on task profiles and performance metrics.
 * It demonstrates the implementation of the dynamic agent selection and task routing
 * mechanism as specified in the Quantum Collaboration Framework.
 */

// Import required modules
import { QuantumGlossary } from './server/services/qrn/quantum-glossary.js';
import { QuantumAgentManager, AgentType } from './server/services/qrn/quantum-agent-manager.js';

/**
 * Run a test for dynamic agent selection with various task profiles
 */
async function runTest() {
  console.log('Starting Dynamic Agent Selection Test...\n');
  
  // Initialize quantum glossary with a mock decohere function
  const mockQuantumGlossary = {
    decohere: (context) => {
      console.log(`[Mock Quantum Glossary] Decohering context: ${context.contextDescription}`);
      // Randomly select from possible next actions to simulate decision-making
      const options = context.possibleNextActions;
      return options[Math.floor(Math.random() * options.length)];
    },
    tagWithContext: (message) => `[SIM] ${new Date().toISOString()} - ${message}`
  };
  
  // Initialize the agent manager
  const agentManager = new QuantumAgentManager(mockQuantumGlossary);
  
  // Define test task profiles
  const testProfiles = [
    {
      name: 'Real-time Gaming Anti-Cheat',
      profile: {
        depth: 'shallow',
        urgency: 'high',
        domain: 'gaming-security',
        complexity: 'moderate',
        creativityNeeded: false,
        costSensitivity: 'medium',
        ethicalConsiderations: false,
        mainRequirement: 'speed'
      }
    },
    {
      name: 'Ethical AI Review',
      profile: {
        depth: 'deep',
        urgency: 'low',
        domain: 'ethics',
        complexity: 'complex',
        creativityNeeded: false,
        costSensitivity: 'low',
        ethicalConsiderations: true,
        mainRequirement: 'ethics'
      }
    },
    {
      name: 'Code Implementation',
      profile: {
        depth: 'moderate',
        urgency: 'medium',
        domain: 'coding',
        complexity: 'complex',
        creativityNeeded: false,
        costSensitivity: 'medium',
        ethicalConsiderations: false,
        mainRequirement: 'accuracy'
      }
    },
    {
      name: 'Creative Marketing Content',
      profile: {
        depth: 'moderate',
        urgency: 'medium',
        domain: 'marketing',
        complexity: 'moderate',
        creativityNeeded: true,
        costSensitivity: 'medium',
        ethicalConsiderations: false,
        mainRequirement: 'creativity'
      }
    },
    {
      name: 'Financial Data Analysis',
      profile: {
        depth: 'deep',
        urgency: 'low',
        domain: 'finance',
        complexity: 'complex',
        creativityNeeded: false,
        costSensitivity: 'low',
        ethicalConsiderations: false,
        mainRequirement: 'accuracy'
      }
    },
    {
      name: 'Quick Customer Support Response',
      profile: {
        depth: 'shallow',
        urgency: 'high',
        domain: 'customer-support',
        complexity: 'simple',
        creativityNeeded: false,
        costSensitivity: 'high',
        ethicalConsiderations: false,
        mainRequirement: 'speed'
      }
    }
  ];
  
  // Process each test profile
  for (const test of testProfiles) {
    console.log(`\n### Testing: ${test.name} ###`);
    
    // Select the most appropriate agent
    const selectionResult = agentManager.selectAgent(test.profile);
    
    console.log(`Selected Agent: ${selectionResult.selectedAgent}`);
    console.log(`Reasoning: ${selectionResult.reason}`);
    console.log(`Confidence: ${selectionResult.confidenceScore.toFixed(2)}%`);
    console.log(`Estimated Response Time: ${selectionResult.estimatedResponseTime.toFixed(2)}ms`);
    console.log(`Estimated Cost: $${selectionResult.estimatedCost.toFixed(4)}`);
    console.log(`Alternatives: ${selectionResult.alternatives.join(', ')}`);
    
    // Simulate task completion with random success/failure and response time
    const success = Math.random() > 0.2; // 80% success rate
    const responseTime = selectionResult.estimatedResponseTime * (0.8 + Math.random() * 0.4); // ±20%
    const flowType = success ? 'FLOW' : (Math.random() > 0.5 ? 'PARTIAL_FLOW' : 'ANTIFLOW');
    
    // Complete the task with actual metrics
    agentManager.completeCurrentTask(responseTime, success, flowType);
    
    console.log(`Task completion: ${success ? 'SUCCESS' : 'FAILURE'}`);
    console.log(`Actual response time: ${responseTime.toFixed(2)}ms`);
    console.log(`Flow metric: ${flowType}`);
    
    // Test formatting a task for the selected agent
    const taskContent = `Process the following ${test.name} task with ${test.profile.complexity} analysis...`;
    const formattedTask = agentManager.formatTaskForAgent(taskContent, selectionResult.selectedAgent, test.profile);
    
    console.log('\nFormatted Task Preview:');
    console.log(formattedTask.substring(0, 300) + '...');
    
    // Test agent handoff
    if (selectionResult.alternatives.length > 0) {
      const handoffTarget = selectionResult.alternatives[0];
      const decisions = [
        {
          decision: `Selected ${selectionResult.selectedAgent} for initial processing`,
          alternatives: [`Use ${handoffTarget} directly`, 'Use human expert'],
          reasoning: `${selectionResult.selectedAgent} provides optimal balance of speed and accuracy for this task`
        }
      ];
      
      const handoffMessage = agentManager.createAgentHandoff(
        selectionResult.selectedAgent,
        handoffTarget,
        taskContent,
        test.profile,
        decisions
      );
      
      console.log('\nAgent Handoff Preview:');
      console.log(handoffMessage.substring(0, 300) + '...');
    }
  }
  
  // Generate and display performance report
  console.log('\n' + agentManager.getPerformanceReport());
}

// Run the test as main module
if (import.meta.url === import.meta.resolve('./test-dynamic-agent-selection.js')) {
  runTest().catch(err => {
    console.error('Error running dynamic agent selection test:', err);
  });
}

// Export for other modules
export { runTest };