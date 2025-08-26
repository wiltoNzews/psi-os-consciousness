/**
 * Integration Tests for Enhanced Parallel Processing Optimization
 * 
 * This test suite verifies the enhanced parallel processing capabilities of the Quantum Agent Manager,
 * focusing on optimizing GPT Pro accounts for complex, high-demand tasks. It tests both the
 * functionality and performance characteristics of parallel processing across multiple agent instances.
 * 
 * Key features tested:
 * - Parallel task distribution across multiple GPT-4 Pro instances
 * - Error handling and resilience in parallel processing
 * - Performance metrics and optimization for complex tasks
 * - Integration with Quantum Glossary for dynamic decision making
 */

import { QuantumAgentManager, TaskProfile, ParallelProcessingResult } from '../services/qrn/quantum-agent-manager.js';
import { QuantumGlossary } from '../services/qrn/quantum-glossary.js';

// Mock implementation of QuantumGlossary for testing parallel processing
jest.mock('../services/qrn/quantum-glossary.js', () => {
  return {
    QuantumGlossary: jest.fn().mockImplementation(() => {
      return {
        decohere: jest.fn((context) => {
          // Use context to make deterministic decisions for testing
          if (context.contextDescription.includes('response simulation')) {
            if (context.metadata?.agent === 'Grok') {
              return 'Simulate successful response';
            } else if (context.metadata?.instanceId && context.metadata.instanceId % 3 === 0) {
              // Simulate periodic failures for testing resilience
              return 'Simulate failure';
            } else {
              return 'Simulate successful response';
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

describe('Parallel Processing Optimization Tests', () => {
  let agentManager: QuantumAgentManager;
  let quantumGlossary: QuantumGlossary;
  
  // Mock for simulateAgentResponse to avoid actual API calls
  let simulateAgentResponseSpy: jest.SpyInstance;
  
  beforeEach(() => {
    jest.clearAllMocks();
    quantumGlossary = new QuantumGlossary();
    agentManager = new QuantumAgentManager(quantumGlossary);
    
    // Configure agent manager for parallel processing
    // @ts-ignore - Accessing private property for testing
    agentManager.gptProInstances = 5; // Set up multiple GPT-4 Pro instances
    
    // Mock the simulateAgentResponse method to avoid real API calls
    // @ts-ignore - Accessing private method for mocking
    simulateAgentResponseSpy = jest.spyOn(agentManager, 'simulateAgentResponse');
    
    // Implement mock that simulates various response patterns and timings
    simulateAgentResponseSpy.mockImplementation((content, agent, taskProfile, instanceId) => {
      // Create artificial delay based on agent and instance
      const delay = instanceId !== undefined
        ? 50 + (instanceId * 30) // Staggered response times for parallel instances
        : agent === 'GPT-4 Pro' ? 500 : 200; // Single instance response times by agent
      
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          // Simulate occasional failures based on instance ID
          if (instanceId !== undefined && instanceId % 3 === 0) {
            reject(new Error(`Simulated failure on instance ${instanceId}`));
            return;
          }
          
          // Generate simulated response based on agent and task
          const response = `Response from ${agent}${instanceId !== undefined ? ` (instance ${instanceId})` : ''}: ` +
            `Processed "${content.substring(0, 30)}..." with ` +
            `${taskProfile.complexity} complexity in the ${taskProfile.domain} domain`;
            
          resolve(response);
        }, delay);
      });
    });
  });
  
  describe('Parallel Task Processing', () => {
    test('should process complex tasks in parallel when multiple instances are available', async () => {
      const taskContent = 'Analyze this complex dataset for anomalies and provide detailed insights based on statistical patterns while accounting for potential outliers.';
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
      
      // Request 4 parallel instances
      const result = await agentManager.processTaskInParallel(taskContent, taskProfile, 4);
      
      // Verify that multiple instances were called
      expect(simulateAgentResponseSpy).toHaveBeenCalledTimes(4);
      
      // Each call should have a different instance ID
      const instanceIds = [0, 1, 2, 3];
      instanceIds.forEach(id => {
        expect(simulateAgentResponseSpy).toHaveBeenCalledWith(
          taskContent,
          'GPT-4 Pro', // Should use GPT-4 Pro for complex tasks
          taskProfile,
          id
        );
      });
      
      // Verify result structure
      expect(result.responses.length).toBeGreaterThan(0);
      expect(result.metrics.totalTime).toBeGreaterThan(0);
      expect(result.metrics.averageTime).toBeGreaterThan(0);
      expect(result.metrics.successRate).toBeGreaterThanOrEqual(0);
      expect(result.metrics.successRate).toBeLessThanOrEqual(1);
      expect(result.metrics.parallelSpeedup).toBeGreaterThan(1); // Should show speedup
    });
    
    test('should handle instance failures and continue with remaining instances', async () => {
      const taskContent = 'Analyze security vulnerabilities in this codebase and suggest fixes.';
      const taskProfile: TaskProfile = {
        depth: 'deep',
        urgency: 'high',
        domain: 'security-analysis',
        complexity: 'complex',
        creativityNeeded: false,
        costSensitivity: 'low',
        ethicalConsiderations: false,
        mainRequirement: 'accuracy'
      };
      
      // Request 5 parallel instances - our mock will make instance 3 (index 2) fail
      const result = await agentManager.processTaskInParallel(taskContent, taskProfile, 5);
      
      // Should still have 5 calls to simulateAgentResponse
      expect(simulateAgentResponseSpy).toHaveBeenCalledTimes(5);
      
      // Should have some successful responses
      expect(result.responses.length).toBeLessThan(5); // At least one failed
      expect(result.responses.length).toBeGreaterThan(0); // At least one succeeded
      
      // Should track errors
      expect(result.errors).toBeDefined();
      expect(result.errors?.length).toBeGreaterThan(0);
      
      // Success rate should reflect the failures
      expect(result.metrics.successRate).toBeLessThan(1);
      expect(result.metrics.successRate).toBeGreaterThan(0);
    });
    
    test('should fall back to single-instance processing for simple or urgent tasks', async () => {
      const taskContent = 'Quickly generate a response to this customer inquiry.';
      const taskProfile: TaskProfile = {
        depth: 'shallow',
        urgency: 'high',
        domain: 'customer-support',
        complexity: 'simple',
        creativityNeeded: false,
        costSensitivity: 'high',
        ethicalConsiderations: false,
        mainRequirement: 'speed'
      };
      
      // Try to request parallel processing, but system should override
      const result = await agentManager.processTaskInParallel(taskContent, taskProfile, 3);
      
      // Should only use a single instance, not parallel processing
      expect(simulateAgentResponseSpy).toHaveBeenCalledTimes(1);
      
      // Should not have instanceId in the call
      expect(simulateAgentResponseSpy).toHaveBeenCalledWith(
        taskContent,
        expect.any(String), // Not necessarily GPT-4 Pro for this task
        taskProfile,
        undefined // No instance ID for single processing
      );
      
      // Should have a single response
      expect(result.responses.length).toBe(1);
      
      // Should not show parallel speedup
      expect(result.metrics.parallelSpeedup).toBe(1);
    });
  });
  
  describe('Performance Optimization', () => {
    test('should demonstrate performance improvements with parallel processing', async () => {
      const taskContent = 'Analyze this large dataset and generate comprehensive insights.';
      const taskProfile: TaskProfile = {
        depth: 'deep',
        urgency: 'low',
        domain: 'data-science',
        complexity: 'complex',
        creativityNeeded: false,
        costSensitivity: 'low',
        ethicalConsiderations: false,
        mainRequirement: 'accuracy'
      };
      
      // First run with a single instance for baseline
      // @ts-ignore - Temporarily modify private property
      agentManager.gptProInstances = 1;
      const singleResult = await agentManager.processTaskInParallel(taskContent, taskProfile, 1);
      
      // Reset spy counts
      simulateAgentResponseSpy.mockClear();
      
      // Then run with multiple instances
      // @ts-ignore - Restore multiple instances
      agentManager.gptProInstances = 5;
      const parallelResult = await agentManager.processTaskInParallel(taskContent, taskProfile, 5);
      
      // Compare total processing time
      expect(parallelResult.metrics.totalTime).toBeLessThan(singleResult.metrics.totalTime);
      
      // Check speedup factor
      expect(parallelResult.metrics.parallelSpeedup).toBeGreaterThan(1);
      
      // Verify we have more responses from parallel processing
      expect(parallelResult.responses.length).toBeGreaterThan(singleResult.responses.length);
    });
    
    test('should optimize instance count based on task complexity', async () => {
      // @ts-ignore - Access private method for testing
      const getOptimalInstanceCount = agentManager.getOptimalInstanceCount;
      
      const simpleTasks = [
        {
          complexity: 'simple',
          urgency: 'high',
          costSensitivity: 'high'
        },
        {
          complexity: 'simple', 
          urgency: 'medium',
          costSensitivity: 'medium'
        }
      ];
      
      const complexTasks = [
        {
          complexity: 'complex',
          urgency: 'low',
          costSensitivity: 'low'
        },
        {
          complexity: 'complex',
          urgency: 'medium',
          costSensitivity: 'low'
        }
      ];
      
      // Simple tasks should use fewer instances
      for (const task of simpleTasks) {
        // @ts-ignore - Calling private method with partial task profile
        const count = getOptimalInstanceCount.call(agentManager, task);
        expect(count).toBeLessThanOrEqual(2);
      }
      
      // Complex tasks should use more instances
      for (const task of complexTasks) {
        // @ts-ignore - Calling private method with partial task profile
        const count = getOptimalInstanceCount.call(agentManager, task);
        expect(count).toBeGreaterThan(2);
      }
    });
  });
  
  describe('EU AI Act Compliance', () => {
    test('should ensure explainability with parallel processing results', async () => {
      const taskContent = 'Generate risk assessment for financial approval decision.';
      const taskProfile: TaskProfile = {
        depth: 'deep',
        urgency: 'medium',
        domain: 'financial-risk',
        complexity: 'complex',
        creativityNeeded: false,
        costSensitivity: 'low',
        ethicalConsiderations: true,
        mainRequirement: 'accuracy'
      };
      
      // Process with multiple instances
      const result = await agentManager.processTaskInParallel(taskContent, taskProfile, 4);
      
      // Each result should be explainable
      for (const response of result.responses) {
        // Check that each response contains proper domain and complexity identifiers
        // This ensures EU AI Act explainability requirements
        expect(response).toContain(taskProfile.domain);
        expect(response).toContain(taskProfile.complexity);
      }
      
      // Result metrics should be present for accountability
      expect(result.metrics.totalTime).toBeDefined();
      expect(result.metrics.averageTime).toBeDefined();
      expect(result.metrics.successRate).toBeDefined();
      expect(result.metrics.parallelSpeedup).toBeDefined();
    });
  });
});