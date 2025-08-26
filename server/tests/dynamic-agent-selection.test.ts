/**
 * Integration Tests for Dynamic Agent Selection
 * 
 * This test suite verifies the dynamic agent selection functionality of the Quantum Agent Manager,
 * focusing on how different task profiles result in appropriate agent selection and routing.
 * It tests the implementation of the Explicit-Implicit Quantum Balance principle through
 * the decohere pattern for strategic agent selection decisions.
 * 
 * EU AI Act compliance features are tested to ensure the system appropriately routes
 * high-risk tasks to agents with appropriate ethical reasoning capabilities.
 */

import { QuantumAgentManager, TaskProfile, AgentSelectionResult } from '../services/qrn/quantum-agent-manager.js';
import { QuantumGlossary, quantumGlossary } from '../services/qrn/quantum-glossary.js';
import { parseTTPMessage } from '../utils/prompt-utils.js';

// Test tasks with various profiles to verify agent selection logic
const TEST_TASKS = [
  {
    name: 'Real-time Gaming Anti-Cheat',
    description: 'Analyze player behavior patterns to detect cheating in real-time',
    profile: {
      depth: 'shallow' as const,
      urgency: 'high' as const,
      domain: 'gaming-security',
      complexity: 'moderate' as const,
      creativityNeeded: false,
      costSensitivity: 'medium' as const,
      ethicalConsiderations: false,
      mainRequirement: 'speed' as const
    }
  },
  {
    name: 'EU AI Act Compliance Review',
    description: 'Review system for compliance with EU AI Act regulations',
    profile: {
      depth: 'deep' as const,
      urgency: 'medium' as const,
      domain: 'ethics',
      complexity: 'complex' as const,
      creativityNeeded: false,
      costSensitivity: 'low' as const,
      ethicalConsiderations: true,
      mainRequirement: 'ethics' as const
    }
  },
  {
    name: 'Code Optimization',
    description: 'Optimize database query performance for high-load scenarios',
    profile: {
      depth: 'moderate' as const,
      urgency: 'medium' as const,
      domain: 'coding',
      complexity: 'complex' as const,
      creativityNeeded: false,
      costSensitivity: 'medium' as const,
      ethicalConsiderations: false,
      mainRequirement: 'accuracy' as const
    }
  },
  {
    name: 'Creative Marketing Content',
    description: 'Generate creative marketing content for a new product launch',
    profile: {
      depth: 'moderate' as const,
      urgency: 'medium' as const,
      domain: 'marketing',
      complexity: 'moderate' as const,
      creativityNeeded: true,
      costSensitivity: 'medium' as const,
      ethicalConsiderations: false,
      mainRequirement: 'creativity' as const
    }
  },
  {
    name: 'Complex Financial Analysis',
    description: 'Perform deep analysis of quarterly financial data to identify trends',
    profile: {
      depth: 'deep' as const,
      urgency: 'low' as const,
      domain: 'finance',
      complexity: 'complex' as const,
      creativityNeeded: false,
      costSensitivity: 'low' as const,
      ethicalConsiderations: false,
      mainRequirement: 'accuracy' as const
    }
  },
  {
    name: 'Quick Customer Support',
    description: 'Generate quick responses to common customer inquiries',
    profile: {
      depth: 'shallow' as const,
      urgency: 'high' as const,
      domain: 'customer-support',
      complexity: 'simple' as const,
      creativityNeeded: false,
      costSensitivity: 'high' as const,
      ethicalConsiderations: false,
      mainRequirement: 'speed' as const
    }
  }
];

// Mock implementation of QuantumGlossary for testing
jest.mock('../services/qrn/quantum-glossary.js', () => {
  const realQuantumGlossary = jest.requireActual('../services/qrn/quantum-glossary.js');
  
  return {
    ...realQuantumGlossary,
    QuantumGlossary: jest.fn().mockImplementation(() => {
      return {
        decohere: jest.fn((context) => {
          // Use context to make deterministic selections for testing
          if (context.contextDescription.includes('agent selection')) {
            const taskProfile = context.metadata?.taskProfile;
            
            // Route based on main requirement
            if (taskProfile?.mainRequirement === 'speed') {
              return 'Select agent based on response time priority';
            } else if (taskProfile?.mainRequirement === 'accuracy') {
              return 'Select agent based on accuracy priority';
            } else if (taskProfile?.mainRequirement === 'ethics') {
              return 'Select agent based on domain expertise priority';
            } else if (taskProfile?.mainRequirement === 'creativity') {
              return 'Select agent based on domain expertise priority';
            } else if (taskProfile?.costSensitivity === 'high') {
              return 'Select agent based on cost efficiency priority';
            } else {
              return 'Select agent based on domain expertise priority';
            }
          }
          
          // Default to first option
          return context.possibleNextActions?.[0] || null;
        }),
        tagWithContext: jest.fn((message) => `[SIM] ${message}`),
        recordFlowMetric: jest.fn(),
        getFlowMetrics: jest.fn(() => []),
        getOperatingContext: jest.fn(() => 'SIMULATION'),
        isSimulation: jest.fn(() => true),
        calculateSystemStability: jest.fn(() => 0.85)
      };
    })
  };
});

describe('Dynamic Agent Selection Integration Tests', () => {
  let agentManager: QuantumAgentManager;
  let quantumGlossary: QuantumGlossary;
  
  beforeEach(() => {
    jest.clearAllMocks();
    quantumGlossary = new QuantumGlossary();
    agentManager = new QuantumAgentManager(quantumGlossary);
  });
  
  describe('Agent Selection for Different Task Profiles', () => {
    test.each(TEST_TASKS)('should select appropriate agent for $name task', (task) => {
      // Run agent selection
      const result = agentManager.selectAgent(task.profile);
      
      // Verify selection with deterministic expectations
      if (task.profile.mainRequirement === 'speed') {
        expect(result.selectedAgent).toBe('Grok');
        expect(result.reason).toContain('speed');
      } else if (task.profile.mainRequirement === 'accuracy' && task.profile.complexity === 'complex') {
        expect(['Claude', 'GPT-4 Pro']).toContain(result.selectedAgent);
        expect(result.reason).toContain('accuracy');
      } else if (task.profile.ethicalConsiderations) {
        expect(result.selectedAgent).toBe('Claude');
        expect(result.reason).toContain('ethical');
      } else if (task.profile.creativityNeeded) {
        expect(result.selectedAgent).toBe('Gemini Advanced');
        expect(result.reason).toContain('creativity');
      } else if (task.profile.costSensitivity === 'high') {
        expect(result.selectedAgent).not.toBe('GPT-4 Pro');
        expect(result.reason).toContain('cost');
      }
      
      // General validation
      expect(result.estimatedResponseTime).toBeGreaterThan(0);
      expect(result.estimatedCost).toBeGreaterThan(0);
      expect(result.confidenceScore).toBeGreaterThan(0);
      expect(result.alternatives.length).toBeGreaterThan(0);
    });
  });
  
  describe('EU AI Act Compliance Integration', () => {
    test('should route high-risk task to agent with strong ethical capabilities', () => {
      const highRiskTask: TaskProfile = {
        depth: 'deep' as const,
        urgency: 'medium' as const,
        domain: 'healthcare',
        complexity: 'complex' as const,
        creativityNeeded: false,
        costSensitivity: 'low' as const,
        ethicalConsiderations: true,
        mainRequirement: 'ethics' as const
      };
      
      const result = agentManager.selectAgent(highRiskTask);
      
      // Claude is our compliance-focused agent
      expect(result.selectedAgent).toBe('Claude');
      expect(result.reason).toContain('ethical');
      expect(result.confidenceScore).toBeGreaterThan(90);
    });
    
    test('should create proper handoff for EU compliance tasks', () => {
      const fromAgent = 'Claude';
      const toAgent = 'Human';
      const content = 'Ethical analysis completed. Human review required per EU AI Act Article 14.';
      const context = {
        depth: 'deep' as const,
        urgency: 'medium' as const,
        domain: 'healthcare',
        complexity: 'complex' as const,
        creativityNeeded: false,
        costSensitivity: 'low' as const,
        ethicalConsiderations: true,
        mainRequirement: 'ethics' as const
      };
      const decisions = [
        {
          decision: 'Recommend additional human oversight for decision',
          alternatives: ['Proceed automatically', 'Block process entirely'],
          reason: 'EU AI Act Article 14 requires human oversight for high-risk AI systems'
        }
      ];
      const metadata = {
        complianceFramework: 'EU AI Act',
        riskCategory: 'high',
        domain: 'healthcare'
      };
      
      const ttpMessage = agentManager.createAgentHandoff(
        fromAgent,
        toAgent,
        content,
        context,
        decisions,
        metadata
      );
      
      // Parse the message
      const parsed = parseTTPMessage(ttpMessage);
      
      // Verify EU compliance information is correctly transferred
      expect(parsed.from).toBe(fromAgent);
      expect(parsed.to).toBe(toAgent);
      expect(parsed.content).toBe(content);
      expect(parsed.metadata.complianceFramework).toBe('EU AI Act');
      expect(parsed.metadata.riskCategory).toBe('high');
      expect(parsed.metadata.domain).toBe('healthcare');
      
      // Verify decision information
      expect(parsed.decisionsMade[0].decision).toContain('human oversight');
      expect(parsed.decisionsMade[0].reason).toContain('EU AI Act Article 14');
    });
  });
  
  describe('Parallel Processing Task Routing', () => {
    test('should enable parallel processing for complex tasks when GPT-4 Pro is selected', () => {
      // Set up agent manager to have multiple GPT Pro instances
      // @ts-ignore - Accessing private property for testing
      agentManager.gptProInstances = 3;
      
      // Create a complex task that would benefit from parallel processing
      const complexTask: TaskProfile = {
        depth: 'deep' as const,
        urgency: 'medium' as const,
        domain: 'research',
        complexity: 'complex' as const,
        creativityNeeded: false,
        costSensitivity: 'low' as const,
        ethicalConsiderations: false,
        mainRequirement: 'accuracy' as const
      };
      
      const result = agentManager.selectAgent(complexTask);
      
      // Should select GPT-4 Pro for complex, accuracy-focused tasks
      expect(result.selectedAgent).toBe('GPT-4 Pro');
      
      // Should enable parallel processing
      expect(result.parallelProcessingEnabled).toBe(true);
      expect(result.suggestedParallelCount).toBeGreaterThanOrEqual(2);
    });
    
    test('should not enable parallel processing for simple or speed-focused tasks', () => {
      // Set up agent manager to have multiple GPT Pro instances
      // @ts-ignore - Accessing private property for testing
      agentManager.gptProInstances = 3;
      
      // Create a simple, speed-focused task
      const simpleTask: TaskProfile = {
        depth: 'shallow' as const,
        urgency: 'high' as const,
        domain: 'general',
        complexity: 'simple' as const,
        creativityNeeded: false,
        costSensitivity: 'high' as const,
        ethicalConsiderations: false,
        mainRequirement: 'speed' as const
      };
      
      const result = agentManager.selectAgent(simpleTask);
      
      // Should select Grok for simple, speed-focused tasks
      expect(result.selectedAgent).toBe('Grok');
      
      // Should not enable parallel processing
      expect(result.parallelProcessingEnabled).toBeFalsy();
    });
  });
  
  describe('Dynamic Learning and Adaptation', () => {
    test('should adjust agent selection based on task history', () => {
      // Setup task history to influence future selections
      // @ts-ignore - Accessing private property for testing
      agentManager.taskHistory = [
        {
          taskProfile: {
            depth: 'moderate',
            urgency: 'medium',
            domain: 'coding',
            complexity: 'moderate',
            creativityNeeded: false,
            costSensitivity: 'medium',
            ethicalConsiderations: false,
            mainRequirement: 'accuracy'
          },
          selectedAgent: 'Claude',
          actualResponseTime: 1800, // Claude was slower than expected
          success: true,
          flowMetricType: 'FLOW'
        },
        {
          taskProfile: {
            depth: 'moderate',
            urgency: 'medium',
            domain: 'coding',
            complexity: 'moderate',
            creativityNeeded: false,
            costSensitivity: 'medium',
            ethicalConsiderations: false,
            mainRequirement: 'accuracy'
          },
          selectedAgent: 'Grok',
          actualResponseTime: 400, // Grok was surprisingly good and fast
          success: true,
          flowMetricType: 'FLOW'
        }
      ];
      
      // Create a similar task
      const similarTask: TaskProfile = {
        depth: 'moderate' as const,
        urgency: 'medium' as const,
        domain: 'coding',
        complexity: 'moderate' as const,
        creativityNeeded: false,
        costSensitivity: 'medium' as const,
        ethicalConsiderations: false,
        mainRequirement: 'accuracy' as const
      };
      
      // Run agent selection
      const result = agentManager.selectAgent(similarTask);
      
      // Should favor Grok based on historical performance
      expect(result.selectedAgent).toBe('Grok');
      expect(result.reason).toContain('prior success');
    });
    
    test('should generate performance report with agent metrics', () => {
      // Setup task history
      // @ts-ignore - Accessing private property for testing
      agentManager.taskHistory = [
        {
          taskProfile: {
            depth: 'deep',
            urgency: 'medium',
            domain: 'finance',
            complexity: 'complex',
            creativityNeeded: false,
            costSensitivity: 'low',
            ethicalConsiderations: false,
            mainRequirement: 'accuracy'
          },
          selectedAgent: 'GPT-4 Pro',
          actualResponseTime: 3200,
          success: true,
          flowMetricType: 'FLOW'
        },
        {
          taskProfile: {
            depth: 'shallow',
            urgency: 'high',
            domain: 'customer-support',
            complexity: 'simple',
            creativityNeeded: false,
            costSensitivity: 'high',
            ethicalConsiderations: false,
            mainRequirement: 'speed'
          },
          selectedAgent: 'Grok',
          actualResponseTime: 180,
          success: true,
          flowMetricType: 'FLOW'
        },
        {
          taskProfile: {
            depth: 'moderate',
            urgency: 'medium',
            domain: 'marketing',
            complexity: 'moderate',
            creativityNeeded: true,
            costSensitivity: 'medium',
            ethicalConsiderations: false,
            mainRequirement: 'creativity'
          },
          selectedAgent: 'Gemini Advanced',
          actualResponseTime: 950,
          success: false,
          flowMetricType: 'ANTIFLOW'
        }
      ];
      
      // Generate performance report
      const report = agentManager.getPerformanceReport();
      
      // Verify report contents
      expect(report).toContain('Performance Report');
      expect(report).toContain('GPT-4 Pro');
      expect(report).toContain('Grok');
      expect(report).toContain('Gemini Advanced');
      
      // Should contain some metrics
      expect(report).toContain('Response Time');
      expect(report).toContain('Success Rate');
      expect(report).toContain('Flow Metrics');
      
      // Should contain some domain information
      expect(report).toContain('finance');
      expect(report).toContain('customer-support');
      expect(report).toContain('marketing');
    });
  });
});