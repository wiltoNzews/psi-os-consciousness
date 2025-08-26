/**
 * Integration Tests for QuantumAgentManager
 * 
 * This test suite verifies the key functionality of the Quantum Agent Manager, including:
 * - Dynamic agent selection based on task profiles
 * - Agent handoff using the Thought Transfer Protocol (TTP)
 * - Parallel processing with multiple GPT Pro instances
 * - Performance reporting and metrics
 * 
 * Tests are designed to validate the implementation of the Explicit-Implicit Quantum Balance
 * principle through the use of the decohere pattern for strategic decision-making.
 */

import { QuantumAgentManager, TaskProfile, AgentSelectionResult, ParallelProcessingResult } from '../services/qrn/quantum-agent-manager.js';
import { QuantumGlossary } from '../services/qrn/quantum-glossary.js';
import { ChronosDateHandler } from '../services/utils/chronos-date-handler.js';
import { parseTTPMessage } from '../utils/prompt-utils.js';

// Mock implementation of QuantumGlossary for testing
jest.mock('../services/qrn/quantum-glossary.js', () => {
  return {
    QuantumGlossary: jest.fn().mockImplementation(() => {
      return {
        decohere: jest.fn((context) => {
          // Simulate strategic decision making
          const options = context.possibleNextActions;
          if (options && options.length > 0) {
            // For testing purposes, select specific decisions based on context
            if (context.contextDescription.includes('agent selection')) {
              if (context.metadata?.taskProfile?.mainRequirement === 'speed') {
                return 'Select agent based on response time priority';
              } else if (context.metadata?.taskProfile?.mainRequirement === 'accuracy') {
                return 'Select agent based on accuracy priority';
              } else if (context.metadata?.taskProfile?.costSensitivity === 'high') {
                return 'Select agent based on cost efficiency priority';
              } else {
                return 'Select agent based on domain expertise priority';
              }
            } else if (context.contextDescription.includes('response simulation')) {
              if (context.metadata?.agent === 'Grok') {
                return 'Simulate successful response';
              } else if (context.metadata?.instanceId && context.metadata.instanceId % 3 === 0) {
                return 'Simulate failure';
              } else {
                return 'Simulate successful response';
              }
            }
            
            // Default to the first option for other contexts
            return options[0];
          }
          return null;
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

// Mock ChronosDateHandler for consistent date handling in tests
jest.mock('../services/utils/chronos-date-handler.js', () => {
  let mockDate = new Date('2025-03-25T12:00:00Z');
  
  return {
    ChronosDateHandler: {
      createDate: jest.fn(() => new Date(mockDate)),
      formatDateISO: jest.fn((date) => date.toISOString()),
      stringifyWithDates: jest.fn((obj) => JSON.stringify(obj)),
      parseWithDates: jest.fn((json) => JSON.parse(json))
    }
  };
});

describe('QuantumAgentManager', () => {
  let agentManager: QuantumAgentManager;
  let quantumGlossary: QuantumGlossary;
  
  beforeEach(() => {
    jest.clearAllMocks();
    quantumGlossary = new QuantumGlossary();
    agentManager = new QuantumAgentManager(quantumGlossary);
    
    // Add some simulated task history for testing
    // @ts-ignore - Accessing private property for testing
    agentManager.taskHistory = [
      {
        taskProfile: {
          depth: 'deep',
          urgency: 'medium',
          domain: 'coding',
          complexity: 'complex',
          creativityNeeded: false,
          costSensitivity: 'medium',
          ethicalConsiderations: false,
          mainRequirement: 'accuracy'
        },
        selectedAgent: 'Claude',
        actualResponseTime: 2200,
        success: true,
        flowMetricType: 'FLOW'
      },
      {
        taskProfile: {
          depth: 'shallow',
          urgency: 'high',
          domain: 'gaming',
          complexity: 'simple',
          creativityNeeded: false,
          costSensitivity: 'high',
          ethicalConsiderations: false,
          mainRequirement: 'speed'
        },
        selectedAgent: 'Grok',
        actualResponseTime: 150,
        success: true,
        flowMetricType: 'FLOW'
      }
    ];
  });
  
  describe('selectAgent', () => {
    test('should select agent based on speed priority for urgent tasks', () => {
      const taskProfile: TaskProfile = {
        depth: 'shallow',
        urgency: 'high',
        domain: 'gaming',
        complexity: 'simple',
        creativityNeeded: false,
        costSensitivity: 'medium',
        ethicalConsiderations: false,
        mainRequirement: 'speed'
      };
      
      const result = agentManager.selectAgent(taskProfile);
      
      expect(result.selectedAgent).toBe('Grok');
      expect(result.reason).toContain('speed');
      expect(result.estimatedResponseTime).toBeLessThan(500);
      expect(result.confidenceScore).toBeGreaterThan(0.8);
    });
    
    test('should select agent based on accuracy priority for complex tasks', () => {
      const taskProfile: TaskProfile = {
        depth: 'deep',
        urgency: 'low',
        domain: 'coding',
        complexity: 'complex',
        creativityNeeded: false,
        costSensitivity: 'low',
        ethicalConsiderations: false,
        mainRequirement: 'accuracy'
      };
      
      const result = agentManager.selectAgent(taskProfile);
      
      expect(['Claude', 'GPT-4 Pro']).toContain(result.selectedAgent);
      expect(result.reason).toContain('accuracy');
      expect(result.confidenceScore).toBeGreaterThan(0.8);
    });
    
    test('should select agent based on cost efficiency for cost-sensitive tasks', () => {
      const taskProfile: TaskProfile = {
        depth: 'moderate',
        urgency: 'medium',
        domain: 'general',
        complexity: 'moderate',
        creativityNeeded: false,
        costSensitivity: 'high',
        ethicalConsiderations: false,
        mainRequirement: 'accuracy' // Even though accuracy is required, cost sensitivity should influence the selection
      };
      
      const result = agentManager.selectAgent(taskProfile);
      
      // Should not choose the most expensive agent for cost-sensitive tasks
      expect(result.selectedAgent).not.toBe('GPT-4 Pro');
      expect(result.reason).toContain('cost');
    });
    
    test('should select Claude for tasks with ethical considerations', () => {
      const taskProfile: TaskProfile = {
        depth: 'deep',
        urgency: 'low',
        domain: 'ethics',
        complexity: 'complex',
        creativityNeeded: false,
        costSensitivity: 'low',
        ethicalConsiderations: true,
        mainRequirement: 'ethics'
      };
      
      const result = agentManager.selectAgent(taskProfile);
      
      expect(result.selectedAgent).toBe('Claude');
      expect(result.reason).toContain('ethical');
    });
    
    test('should select Gemini Advanced for creative tasks', () => {
      const taskProfile: TaskProfile = {
        depth: 'moderate',
        urgency: 'medium',
        domain: 'creative-writing',
        complexity: 'moderate',
        creativityNeeded: true,
        costSensitivity: 'medium',
        ethicalConsiderations: false,
        mainRequirement: 'creativity'
      };
      
      const result = agentManager.selectAgent(taskProfile);
      
      expect(result.selectedAgent).toBe('Gemini Advanced');
      expect(result.reason).toContain('creativity');
    });
    
    test('should select agent based on domain expertise', () => {
      const taskProfile: TaskProfile = {
        depth: 'moderate',
        urgency: 'medium',
        domain: 'coding',
        complexity: 'moderate',
        creativityNeeded: false,
        costSensitivity: 'medium',
        ethicalConsiderations: false,
        mainRequirement: 'accuracy'
      };
      
      const result = agentManager.selectAgent(taskProfile);
      
      expect(['Claude', 'GPT-4 Pro']).toContain(result.selectedAgent);
      expect(result.reason).toContain('domain');
    });
    
    test('should enable parallel processing for complex GPT-4 Pro tasks', () => {
      const taskProfile: TaskProfile = {
        depth: 'deep',
        urgency: 'medium',
        domain: 'research',
        complexity: 'complex',
        creativityNeeded: false,
        costSensitivity: 'low',
        ethicalConsiderations: false,
        mainRequirement: 'accuracy'
      };
      
      // Set GPT Pro instance count high enough to trigger parallel processing
      // @ts-ignore - Accessing private property for testing
      agentManager.gptProInstances = 3;
      
      const result = agentManager.selectAgent(taskProfile);
      
      expect(result.selectedAgent).toBe('GPT-4 Pro');
      expect(result.parallelProcessingEnabled).toBe(true);
      expect(result.suggestedParallelCount).toBeGreaterThanOrEqual(2);
    });
  });
  
  describe('createAgentHandoff', () => {
    test('should create a valid TTP message for agent handoff', () => {
      const fromAgent = 'Claude';
      const toAgent = 'GPT-4 Pro';
      const content = 'This is a test handoff message with code implementation.';
      const context = 'Task implementation handoff';
      const decisions = [
        {
          decision: 'Implement using TypeScript',
          alternatives: ['Use JavaScript', 'Use Python'],
          reason: 'TypeScript provides better type safety'
        }
      ];
      const metadata = {
        taskId: 'task-123',
        domain: 'coding',
        priority: 'high'
      };
      
      const ttpMessage = agentManager.createAgentHandoff(
        fromAgent,
        toAgent,
        content,
        context,
        decisions,
        metadata
      );
      
      // Parse the TTP message to validate its structure
      const parsed = parseTTPMessage(ttpMessage);
      
      // Check fundamental TTP structure
      expect(parsed.from).toBe(fromAgent);
      expect(parsed.to).toBe(toAgent);
      expect(parsed.contextDescription).toBe(context);
      expect(parsed.content).toBe(content);
      
      // Check decisions
      expect(parsed.decisionsMade).toHaveLength(decisions.length);
      expect(parsed.decisionsMade[0].decision).toBe(decisions[0].decision);
      expect(parsed.decisionsMade[0].alternatives).toEqual(expect.arrayContaining(decisions[0].alternatives));
      
      // Check metadata
      expect(parsed.metadata).toMatchObject(metadata);
      
      // Check for next decohere point
      expect(parsed.nextDecohere).toBeDefined();
      expect(parsed.nextDecohere.options).toBeDefined();
      expect(parsed.nextDecohere.options.length).toBeGreaterThan(0);
      
      // Check for flow metrics
      expect(parsed.metrics).toBeDefined();
      expect(parsed.metrics.length).toBeGreaterThan(0);
      expect(parsed.metrics[0].type).toBeDefined();
    });
    
    test('should include relevant TTP formatting for ethical considerations', () => {
      const ttpMessage = agentManager.createAgentHandoff(
        'Claude',
        'Human',
        'Ethical analysis of the AI decision system.',
        'Ethical review handoff',
        [
          {
            decision: 'Recommend additional transparency measures',
            alternatives: ['Proceed without changes', 'Halt development'],
            reason: 'Transparency is required for EU AI Act compliance'
          }
        ],
        {
          complianceFramework: 'EU AI Act',
          riskCategory: 'high',
          domain: 'healthcare'
        }
      );
      
      // Check for explicit EU AI Act compliance information in the message
      expect(ttpMessage).toContain('EU AI Act');
      expect(ttpMessage).toContain('transparency');
      expect(ttpMessage).toContain('healthcare');
      
      // Parse and verify the structure
      const parsed = parseTTPMessage(ttpMessage);
      expect(parsed.metadata.complianceFramework).toBe('EU AI Act');
      expect(parsed.metadata.riskCategory).toBe('high');
    });
  });
  
  describe('processTaskInParallel', () => {
    // Mock the simulateAgentResponse method for testing
    let simulateAgentResponseSpy: jest.SpyInstance;
    
    beforeEach(() => {
      // @ts-ignore - Accessing private method for mocking
      simulateAgentResponseSpy = jest.spyOn(agentManager, 'simulateAgentResponse');
      
      // Mock implementation of simulateAgentResponse
      simulateAgentResponseSpy.mockImplementation((content, agent, taskProfile, instanceId) => {
        if (instanceId !== undefined && instanceId % 3 === 0) {
          // Simulate periodic failures for testing error handling
          return Promise.reject(new Error(`Simulated failure on instance ${instanceId}`));
        }
        
        return Promise.resolve(`Response from ${agent} (instance ${instanceId}): Processed "${content.substring(0, 30)}..."`);
      });
    });
    
    test('should process tasks using multiple GPT-4 Pro instances for complex tasks', async () => {
      const taskContent = 'Analyze this complex dataset for patterns and insights.';
      const taskProfile: TaskProfile = {
        depth: 'deep',
        urgency: 'medium',
        domain: 'data-analysis',
        complexity: 'complex',
        creativityNeeded: false,
        costSensitivity: 'low',
        ethicalConsiderations: false,
        mainRequirement: 'accuracy'
      };
      
      // Set up agent manager to recommend parallel processing
      // @ts-ignore - Accessing private property for testing
      agentManager.gptProInstances = 3;
      
      const result = await agentManager.processTaskInParallel(taskContent, taskProfile, 3);
      
      // Verify the basic structure
      expect(result.responses.length).toBeGreaterThan(0);
      expect(result.metrics).toBeDefined();
      expect(result.metrics.totalTime).toBeGreaterThan(0);
      expect(result.metrics.successRate).toBeGreaterThanOrEqual(0);
      expect(result.metrics.successRate).toBeLessThanOrEqual(1);
      
      // Verify that multiple instances were called
      expect(simulateAgentResponseSpy).toHaveBeenCalledTimes(3);
      
      // Each call should have a different instance ID
      const instanceIds = Array.from(Array(3).keys());
      instanceIds.forEach(id => {
        expect(simulateAgentResponseSpy).toHaveBeenCalledWith(
          taskContent,
          expect.any(String),
          taskProfile,
          id
        );
      });
    });
    
    test('should fall back to single-instance processing when parallel is not suitable', async () => {
      const taskContent = 'Simple task that does not require parallel processing.';
      const taskProfile: TaskProfile = {
        depth: 'shallow',
        urgency: 'high',
        domain: 'general',
        complexity: 'simple',
        creativityNeeded: false,
        costSensitivity: 'high',
        ethicalConsiderations: false,
        mainRequirement: 'speed'
      };
      
      const result = await agentManager.processTaskInParallel(taskContent, taskProfile);
      
      // Should have only one response as it falls back to single-instance
      expect(result.responses.length).toBe(1);
      expect(simulateAgentResponseSpy).toHaveBeenCalledTimes(1);
      
      // Should not have instanceId in the call to simulateAgentResponse
      expect(simulateAgentResponseSpy).toHaveBeenCalledWith(
        taskContent,
        expect.any(String),
        taskProfile,
        undefined
      );
    });
    
    test('should handle failures in parallel instances gracefully', async () => {
      const taskContent = 'Task where some instances will fail.';
      const taskProfile: TaskProfile = {
        depth: 'deep',
        urgency: 'medium',
        domain: 'research',
        complexity: 'complex',
        creativityNeeded: false,
        costSensitivity: 'low',
        ethicalConsiderations: false,
        mainRequirement: 'accuracy'
      };
      
      // Set up agent manager to recommend parallel processing
      // @ts-ignore - Accessing private property for testing
      agentManager.gptProInstances = 3;
      
      const result = await agentManager.processTaskInParallel(taskContent, taskProfile, 3);
      
      // Should have at least some successful responses
      expect(result.responses.length).toBeGreaterThan(0);
      
      // Should have some errors
      expect(result.errors).toBeDefined();
      if (result.errors) {
        expect(result.errors.length).toBeGreaterThan(0);
        expect(result.errors[0]).toContain('Simulated failure');
      }
      
      // Success rate should reflect the failures
      expect(result.metrics.successRate).toBeLessThan(1);
    });
  });
  
  describe('getPerformanceReport', () => {
    test('should generate a comprehensive performance report for all agents', () => {
      const report = agentManager.getPerformanceReport();
      
      // Check the report structure and content
      expect(report).toContain('Agent Performance Report');
      expect(report).toContain('Overall Statistics');
      expect(report).toContain('Agent-Specific Performance');
      expect(report).toContain('Claude');
      expect(report).toContain('Grok');
      expect(report).toContain('Task');
      expect(report).toContain('Success rate');
      
      // Check that it includes optimization suggestions
      expect(report).toContain('Optimization Suggestions');
    });
    
    test('should include domain-specific performance insights', () => {
      // Add some specific task history for testing domain insights
      // @ts-ignore - Accessing private property for testing
      agentManager.taskHistory = [
        ...agentManager.taskHistory,
        {
          taskProfile: {
            depth: 'deep',
            urgency: 'low',
            domain: 'coding',
            complexity: 'complex',
            creativityNeeded: false,
            costSensitivity: 'medium',
            ethicalConsiderations: false,
            mainRequirement: 'accuracy'
          },
          selectedAgent: 'Claude',
          actualResponseTime: 2500,
          success: true,
          flowMetricType: 'FLOW'
        },
        {
          taskProfile: {
            depth: 'deep',
            urgency: 'low',
            domain: 'coding',
            complexity: 'complex',
            creativityNeeded: false,
            costSensitivity: 'medium',
            ethicalConsiderations: false,
            mainRequirement: 'accuracy'
          },
          selectedAgent: 'Claude',
          actualResponseTime: 2300,
          success: true,
          flowMetricType: 'FLOW'
        },
        {
          taskProfile: {
            depth: 'deep',
            urgency: 'low',
            domain: 'coding',
            complexity: 'complex',
            creativityNeeded: false,
            costSensitivity: 'medium',
            ethicalConsiderations: false,
            mainRequirement: 'accuracy'
          },
          selectedAgent: 'Claude',
          actualResponseTime: 2400,
          success: true,
          flowMetricType: 'FLOW'
        },
        {
          taskProfile: {
            depth: 'shallow',
            urgency: 'high',
            domain: 'gaming',
            complexity: 'simple',
            creativityNeeded: false,
            costSensitivity: 'high',
            ethicalConsiderations: false,
            mainRequirement: 'speed'
          },
          selectedAgent: 'Grok',
          actualResponseTime: 120,
          success: true,
          flowMetricType: 'FLOW'
        },
        {
          taskProfile: {
            depth: 'shallow',
            urgency: 'high',
            domain: 'gaming',
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
            depth: 'shallow',
            urgency: 'high',
            domain: 'gaming',
            complexity: 'simple',
            creativityNeeded: false,
            costSensitivity: 'high',
            ethicalConsiderations: false,
            mainRequirement: 'speed'
          },
          selectedAgent: 'Grok',
          actualResponseTime: 160,
          success: false,
          flowMetricType: 'ANTIFLOW'
        }
      ];
      
      const report = agentManager.getPerformanceReport();
      
      // Should have domain-specific recommendations
      expect(report).toContain('For coding tasks');
      expect(report).toContain('For gaming tasks');
      
      // Should have specific agents recommended
      expect(report).toMatch(/For coding tasks,.*Claude.*has the highest success rate/);
      expect(report).toMatch(/For gaming tasks,.*Grok.*has the highest success rate/);
    });
  });
});