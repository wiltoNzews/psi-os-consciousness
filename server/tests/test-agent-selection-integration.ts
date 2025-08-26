/**
 * Integration Test for Quantum Agent Manager with Quantum Glossary
 * 
 * This test validates the integration between the Quantum Glossary and
 * Quantum Agent Manager, demonstrating how the dynamic agent selection
 * system works in conjunction with the decohere pattern for structured
 * decision-making in the Quantum Collaboration Framework.
 */

import { QuantumGlossary } from '../services/qrn/quantum-glossary.js';
import { QuantumAgentManager, AgentType, TaskProfile } from '../services/qrn/quantum-agent-manager.js';
import { formatPrompt, createTTPMessage } from '../utils/prompt-utils.js';

// Test tasks representing different domains and requirements
const TEST_TASKS: Array<{
  name: string;
  description: string;
  profile: TaskProfile;
  content: string;
}> = [
  {
    name: 'Ethical AI Compliance',
    description: 'Evaluate an AI system against ethical guidelines and EU AI Act requirements',
    profile: {
      depth: 'deep',
      urgency: 'medium',
      domain: 'ethics',
      complexity: 'complex',
      creativityNeeded: false,
      costSensitivity: 'low',
      ethicalConsiderations: true,
      mainRequirement: 'ethics'
    },
    content: `
      Analyze the following AI system for ethical compliance with the EU AI Act:
      
      System: Automated customer service chatbot for financial institutions
      
      Key capabilities:
      - Answers customer queries about account status and transactions
      - Provides financial advice based on account history
      - Authenticates users through knowledge-based questions
      - Can initiate transfers and payments upon customer request
      
      Identify potential ethical concerns, regulatory compliance issues, and recommended mitigations.
    `
  },
  {
    name: 'Real-time Gaming Security',
    description: 'Detect potential cheating behavior in a competitive game match',
    profile: {
      depth: 'shallow',
      urgency: 'high',
      domain: 'gaming-security',
      complexity: 'moderate',
      creativityNeeded: false,
      costSensitivity: 'medium',
      ethicalConsiderations: false,
      mainRequirement: 'speed'
    },
    content: `
      Evaluate the following player actions for potential cheating behavior:
      
      Player: UserID_8294
      Game: Competitive FPS Match #38291
      
      Last 10 actions:
      - Headshot through wall at position (1824, 372, 156)
      - Snap aim 180° in 0.06 seconds to target not visible on screen
      - Perfect tracking through smoke grenade for 3.4 seconds
      - Consistent 98%+ accuracy for 15 consecutive shots
      - Navigation directly to hidden opponent position without vision
      
      Determine if this behavior indicates use of cheating software and confidence level.
      Requires immediate response to suspend match if cheating detected.
    `
  },
  {
    name: 'Code Implementation Challenge',
    description: 'Implement a complex algorithm with performance optimization',
    profile: {
      depth: 'moderate',
      urgency: 'medium',
      domain: 'coding',
      complexity: 'complex',
      creativityNeeded: false,
      costSensitivity: 'medium',
      ethicalConsiderations: false,
      mainRequirement: 'accuracy'
    },
    content: `
      Implement a TypeScript function that efficiently finds the longest repeating subsequence in a string.
      
      Example: For input "AABEBCDD", the longest repeating subsequence is "ABD" (occurs twice, first as A[0]B[2]D[6] and again as A[1]B[4]D[7])
      
      Requirements:
      - The function should handle strings up to 10,000 characters
      - Time complexity analysis should be provided
      - Unit tests should be included for edge cases
      - Optimize for performance while maintaining readability
      
      Your implementation should be production-ready and follow best practices.
    `
  },
  {
    name: 'Creative Marketing Campaign',
    description: 'Generate innovative ideas for a marketing campaign',
    profile: {
      depth: 'moderate',
      urgency: 'medium',
      domain: 'marketing',
      complexity: 'moderate',
      creativityNeeded: true,
      costSensitivity: 'medium',
      ethicalConsiderations: false,
      mainRequirement: 'creativity'
    },
    content: `
      Develop a creative marketing campaign for a new eco-friendly gaming peripherals line.
      
      Product line:
      - Gaming mouse made from 85% recycled materials
      - Keyboard using sustainable wood and recycled plastics
      - Headset with biodegradable ear cushions
      
      Target audience: Environmentally conscious gamers, ages 18-35
      
      Campaign requirements:
      - Social media strategy across platforms (Twitter, Instagram, TikTok)
      - Influencer partnership approach
      - Creative tagline and visual concept direction
      - Ideas for engaging the community in sustainability initiatives
      
      The campaign should position the products as high-performance while highlighting environmental benefits.
    `
  }
];

/**
 * Run integration test between Quantum Glossary and Quantum Agent Manager
 */
async function runIntegrationTest() {
  console.log('Starting Quantum Agent Selection Integration Test...\n');
  
  // Initialize the Quantum Glossary with singleton instance
  const quantumGlossary = QuantumGlossary.getInstance();
  
  // Set the base path for the Quantum Glossary data storage
  quantumGlossary.setBasePath('./data/quantum-glossary');
  
  // Wait for glossary initialization
  await new Promise(resolve => setTimeout(resolve, 100));
  
  // Initialize the Quantum Agent Manager with the glossary
  const agentManager = new QuantumAgentManager(quantumGlossary);
  
  // Process each test task
  for (const task of TEST_TASKS) {
    console.log(`\n===== Processing Task: ${task.name} =====`);
    console.log(`Description: ${task.description}`);
    console.log(`Domain: ${task.profile.domain}, Urgency: ${task.profile.urgency}, Complexity: ${task.profile.complexity}`);
    
    // Select the most appropriate agent
    const selectionResult = agentManager.selectAgent(task.profile);
    
    console.log(`\nSelected Agent: ${selectionResult.selectedAgent}`);
    console.log(`Selection Reason: ${selectionResult.reason}`);
    console.log(`Confidence Score: ${selectionResult.confidenceScore.toFixed(2)}%`);
    console.log(`Estimated Response Time: ${selectionResult.estimatedResponseTime.toFixed(2)}ms`);
    console.log(`Estimated Cost: $${selectionResult.estimatedCost.toFixed(4)}`);
    console.log(`Alternative Agents: ${selectionResult.alternatives.join(', ')}`);
    
    // Format the task using PREFIX/SUFFIX templates
    const formattedTask = agentManager.formatTaskForAgent(
      task.content,
      selectionResult.selectedAgent,
      task.profile
    );
    
    console.log('\nFormatted Task (Preview):');
    // Show just the first part for brevity
    console.log(formattedTask.split('\n').slice(0, 10).join('\n') + '\n...');
    
    // Simulate task processing with random performance metrics
    const processingTime = selectionResult.estimatedResponseTime * (0.9 + Math.random() * 0.3);
    const success = Math.random() > 0.15; // 85% success rate
    const flowType = success ? 'FLOW' : (Math.random() > 0.4 ? 'PARTIAL_FLOW' : 'ANTIFLOW');
    
    // Update agent metrics with simulated performance
    agentManager.completeCurrentTask(processingTime, success, flowType);
    
    console.log(`\nTask Processing Simulation:`);
    console.log(`Processing Time: ${processingTime.toFixed(2)}ms`);
    console.log(`Success: ${success ? 'Yes' : 'No'}`);
    console.log(`Flow Metric: ${flowType}`);
    
    // Demonstrate agent handoff if there are alternatives
    if (selectionResult.alternatives.length > 0 && task.profile.complexity === 'complex') {
      const targetAgent = selectionResult.alternatives[0];
      
      console.log(`\nSimulating task handoff from ${selectionResult.selectedAgent} to ${targetAgent}...`);
      
      // Create decisions made during initial processing
      const decisions = [
        {
          decision: `Process initially with ${selectionResult.selectedAgent} for ${task.profile.mainRequirement}`,
          alternatives: [
            `Direct processing with ${targetAgent}`,
            `Human expert processing`,
            `Parallel processing across multiple agents`
          ],
          reasoning: `${selectionResult.selectedAgent} provides optimal balance of ${task.profile.mainRequirement} and cost efficiency for initial analysis`
        },
        {
          decision: `Follow up with ${targetAgent} for ${targetAgent === 'Claude' ? 'ethical validation' : 
                                            targetAgent === 'GPT-4 Pro' ? 'deep analysis' : 
                                            targetAgent === 'Gemini Advanced' ? 'creative enhancement' : 
                                            'verification'}`,
          alternatives: [
            `Complete process with ${selectionResult.selectedAgent} only`,
            `Route to human for final review`,
            `Apply parallel validation across multiple agents`
          ],
          reasoning: `Multi-agent collaboration provides more robust results for ${task.profile.complexity} tasks in ${task.profile.domain}`
        }
      ];
      
      // Create TTP handoff message
      const handoffMessage = agentManager.createAgentHandoff(
        selectionResult.selectedAgent,
        targetAgent,
        task.content,
        task.profile,
        decisions
      );
      
      console.log('\nTTP Handoff Message (Preview):');
      // Show just the first part for brevity
      console.log(handoffMessage.split('\n').slice(0, 10).join('\n') + '\n...');
    }
  }
  
  // Generate and display overall performance report
  console.log('\n===== PERFORMANCE REPORT =====');
  console.log(agentManager.getPerformanceReport());
}

// Run the test if this file is executed directly
// In ESM, we need to check if the module is main using import.meta.url
const isMainModule = import.meta.url.endsWith(process.argv[1] || '');
if (isMainModule) {
  runIntegrationTest().catch(err => {
    console.error('Error in integration test:', err);
  });
}

export { runIntegrationTest };