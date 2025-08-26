/**
 * Agent Capacity Testing
 * 
 * This test suite is the implementation of the first phase of the Agent Stress Testing Protocol.
 * It focuses on quantifying the operational limits of different agent variants under load.
 * 
 * Metrics tested:
 * - Maximum Concurrent Tasks: Number of simultaneous tasks each agent can handle
 * - Response Time Degradation: How response time increases with load
 * - Error Rate: Percentage of tasks that fail under various load conditions
 * - Output Quality: Assessment of output degradation under load
 */

import { QuantumAgentManager } from '../../services/qrn/quantum-agent-manager.js';
import { formatPrompt } from '../../utils/prompt-utils.js';
import { quantumGlossary } from '../../services/qrn/quantum-glossary.js';

// Increase Jest timeout for stress tests
jest.setTimeout(60000); // 60s timeout for intensive tests

// Use string literals instead of FlowType enum to avoid reference issues
const FlowTypeStrings = {
  FLOW: 'FLOW',
  ANTIFLOW: 'ANTIFLOW',
  PARTIAL_FLOW: 'PARTIAL_FLOW',
  REAL: 'REAL',
  SIMULATION: 'SIMULATION'
};

// Mock QuantumGlossary
jest.mock('../../services/qrn/quantum-glossary.js', () => ({
  quantumGlossary: {
    recordFlowMetric: jest.fn(),
    decohere: jest.fn().mockImplementation((context) => {
      // Check if context contains a simulation/reality indicator
      const contextDesc = context?.contextDescription || '';
      const hasSimTag = contextDesc.includes('[CONTEXT: SIMULATION]');
      
      // Important: Processing strategy selection must take simulation mode into account
      // Only in SIMULATION mode can we process large batch sizes
      if (!hasSimTag) {
        // Without explicit SIMULATION tag, reject the request
        throw new Error('Missing required SIMULATION/REALITY context tag');
      }
      
      // Return different processing strategies based on batch size
      if (context?.metadata?.batchSize > 5000) {
        return "Process tasks in batched parallel mode";
      } else if (context?.metadata?.batchSize > 1000) {
        return "Process tasks with adaptive concurrency";
      } else {
        return "Process tasks in fully parallel mode";
      }
    }),
    getOperatingContext: jest.fn().mockReturnValue('SIMULATION')
  },
  FlowType: {
    FLOW: 'FLOW',
    ANTIFLOW: 'ANTIFLOW',
    PARTIAL_FLOW: 'PARTIAL_FLOW', 
    REAL: 'REAL',
    SIMULATION: 'SIMULATION'
  }
}));

describe('Agent Capacity Testing', () => {
  let manager: QuantumAgentManager;
  
  // Common test prompts for each agent type
  const testPrompts = {
    Claude: formatPrompt(
      {
        levelDimension: 'Operational' as const,
        objective: 'Verify ethical compliance',
        context: '[CONTEXT: SIMULATION] Ensure policy compliance in content',
        modelAgent: 'Claude',
        depthRequired: 'Detailed Analysis',
        inputDataType: 'Text',
        domain: 'ethics',
        complianceStandard: 'EU AI Act'
      },
      'Review the following text for ethical concerns: "Our new product increases efficiency by 40% compared to competitors."',
      {
        actionableNextSteps: ['Identify ethical issues', 'Suggest improvements'],
        nextAgentRouting: 'Human',
        outputRequirements: 'Detailed ethical analysis',
        flowMetrics: 'FLOW',
        confidenceLevel: 'High',
        resourcesUsed: [],
        auditTrail: 'Ethical compliance verification'
      }
    ),
    
    Grok: formatPrompt(
      {
        levelDimension: 'Tactical' as const,
        objective: 'Process real-time game data',
        context: '[CONTEXT: SIMULATION] Detect cheating in online games',
        modelAgent: 'Grok',
        depthRequired: 'Real-Time Analysis',
        inputDataType: 'JSON',
        domain: 'gaming',
        complianceStandard: 'Fair Play'
      },
      '{"player_id": "p123", "actions": ["move", "shoot"], "time_delta": 0.02}',
      {
        actionableNextSteps: ['Flag suspicious activity', 'Log results'],
        nextAgentRouting: 'System',
        outputRequirements: 'Fast binary classification',
        flowMetrics: 'FLOW',
        confidenceLevel: 'Medium',
        resourcesUsed: ['gameplay data'],
        auditTrail: 'Anti-cheat analysis'
      }
    ),
    
    'Gemini Advanced': formatPrompt(
      {
        levelDimension: 'Tactical' as const,
        objective: 'Generate creative content',
        context: '[CONTEXT: SIMULATION] Design marketing materials',
        modelAgent: 'Gemini Advanced',
        depthRequired: 'Creative Output',
        inputDataType: 'Text',
        domain: 'marketing',
        complianceStandard: 'Brand Guidelines'
      },
      'Create a catchy slogan for a new eco-friendly water bottle.',
      {
        actionableNextSteps: ['Generate multiple options', 'Provide rationale'],
        nextAgentRouting: 'Human',
        outputRequirements: 'Creative and memorable slogans',
        flowMetrics: 'FLOW',
        confidenceLevel: 'High',
        resourcesUsed: [],
        auditTrail: 'Creative content generation'
      }
    ),
    
    'GPT-4 Pro': formatPrompt(
      {
        levelDimension: 'Strategic' as const,
        objective: 'Analyze complex financial data',
        context: '[CONTEXT: SIMULATION] Forecast market trends',
        modelAgent: 'GPT-4 Pro',
        depthRequired: 'Deep Analysis',
        inputDataType: 'Text',
        domain: 'finance',
        complianceStandard: 'Financial Regulations'
      },
      'Analyze potential impacts of rising interest rates on tech sector valuations, considering P/E ratios, growth projections, and market sentiment.',
      {
        actionableNextSteps: ['Provide impact assessment', 'Identify key risks'],
        nextAgentRouting: 'Human',
        outputRequirements: 'Comprehensive financial analysis',
        flowMetrics: 'FLOW',
        confidenceLevel: 'High',
        resourcesUsed: ['financial data'],
        auditTrail: 'Strategic financial analysis'
      }
    )
  };
  
  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    manager = new QuantumAgentManager(quantumGlossary);
  });
  
  describe('Claude Agent Capacity Testing', () => {
    it('should handle up to 5,000 concurrent tasks efficiently', async () => {
      // Generate test batches with increasing concurrency
      const testBatches = [100, 500, 1000, 2500, 5000].map(size => {
        return {
          size,
          prompts: Array(size).fill(testPrompts.Claude)
        };
      });
      
      // Test each batch and record metrics
      const results = [];
      for (const batch of testBatches) {
        // Reset record metrics mock to isolate calls per batch
        (quantumGlossary.recordFlowMetric as jest.Mock).mockClear();
        
        const startTime = Date.now();
        const responses = await manager.processParallelTasks(batch.prompts);
        const endTime = Date.now();
        
        // All responses should be non-null (successful)
        expect(responses.filter(r => r !== null).length).toBe(batch.size);
        
        // Record results
        results.push({
          batchSize: batch.size,
          totalDuration: endTime - startTime,
          averageResponseTime: (endTime - startTime) / batch.size,
          successRate: responses.filter(r => r !== null).length / batch.size,
          errorRate: responses.filter(r => r === null).length / batch.size
        });
        
        // Verify that flow metrics were recorded
        expect(quantumGlossary.recordFlowMetric).toHaveBeenCalledWith(
          expect.any(String),
          'parallel_batch_completed',
          100,
          expect.objectContaining({
            agent: 'Claude',
            batchSize: batch.size
          })
        );
      }
      
      // Verify acceptable performance characteristics
      const largestBatch = results[results.length - 1];
      expect(largestBatch.batchSize).toBe(5000);
      expect(largestBatch.successRate).toBe(1); // 100% success rate
      
      // As batch size increases, verify that average response time increases in a 
      // sub-linear fashion (indicating efficient parallelization)
      const smallBatchTime = results[0].averageResponseTime;
      const largeBatchTime = largestBatch.averageResponseTime;
      
      // Large batch should be less than 10x slower than small batch despite being 50x larger
      expect(largeBatchTime / smallBatchTime).toBeLessThan(10);
      
      console.log("Claude capacity test results:", results);
    });
    
    it('should fail gracefully at >5,000 concurrent tasks', async () => {
      // Create oversized batch (6,000 tasks) exceeding Claude's capacity
      const oversizedBatch = Array(6000).fill(testPrompts.Claude);
      
      // Expect managed failure with useful error message
      await expect(async () => {
        await manager.processParallelTasks(oversizedBatch);
      }).rejects.toThrow(/capacity exceeded/i);
      
      // Verify system recorded the failure with appropriate metrics
      expect(quantumGlossary.recordFlowMetric).toHaveBeenCalledWith(
        FlowTypeStrings.ANTIFLOW,
        'capacity_exceeded',
        0,
        expect.objectContaining({
          agent: 'Claude',
          requestedCapacity: 6000,
          maxCapacity: 5000
        })
      );
    });
  });
  
  describe('Grok Agent Capacity Testing', () => {
    it('should handle up to 10,000 concurrent tasks efficiently', async () => {
      // Generate test batches with increasing concurrency designed for Grok
      const testBatches = [500, 1000, 5000, 10000].map(size => {
        return {
          size,
          prompts: Array(size).fill(testPrompts.Grok)
        };
      });
      
      // Test each batch and verify Grok's superior performance on real-time tasks
      let previousAvgTime = Infinity;
      
      for (const batch of testBatches) {
        (quantumGlossary.recordFlowMetric as jest.Mock).mockClear();
        
        const startTime = Date.now();
        const responses = await manager.processParallelTasks(batch.prompts);
        const endTime = Date.now();
        
        const avgTime = (endTime - startTime) / batch.size;
        const successRate = responses.filter(r => r !== null).length / batch.size;
        
        // All responses should be successful (non-null)
        expect(successRate).toBe(1);
        
        // Grok should maintain fast response times even under load
        if (batch.size <= 5000) {
          // For batch sizes ≤5000, Grok should have very low per-task times
          expect(avgTime).toBeLessThan(previousAvgTime);  // Should get more efficient with larger batches up to a point
        } else {
          // For very large batches, times may increase but should still be reasonable
          expect(avgTime).toBeLessThan(50);  // 50ms per task is still fast
        }
        
        previousAvgTime = avgTime;
        
        console.log(`Grok batch size: ${batch.size}, Avg time: ${avgTime.toFixed(2)}ms, Success: ${(successRate * 100).toFixed(2)}%`);
      }
      
      // Grok should handle the largest batch (10,000) successfully
      const largestBatch = Array(10000).fill(testPrompts.Grok);
      const startTime = Date.now();
      const responses = await manager.processParallelTasks(largestBatch);
      const endTime = Date.now();
      
      expect(responses.length).toBe(10000);
      expect(responses.filter(r => r !== null).length).toBe(10000);
      
      // The entire batch should process within a reasonable time (less than 10s)
      const totalTime = endTime - startTime;
      expect(totalTime).toBeLessThan(10000);
      
      console.log(`Grok max capacity (10,000) total time: ${totalTime}ms, Avg: ${(totalTime/10000).toFixed(2)}ms per task`);
    });
    
    it('should fail gracefully at >10,000 concurrent tasks', async () => {
      // Create oversized batch (11,000 tasks) exceeding Grok's capacity
      const oversizedBatch = Array(11000).fill(testPrompts.Grok);
      
      // Expect managed failure
      await expect(async () => {
        await manager.processParallelTasks(oversizedBatch);
      }).rejects.toThrow(/capacity exceeded/i);
      
      // Verify failure metrics were recorded
      expect(quantumGlossary.recordFlowMetric).toHaveBeenCalledWith(
        FlowTypeStrings.ANTIFLOW,
        'capacity_exceeded',
        0,
        expect.objectContaining({
          agent: 'Grok',
          requestedCapacity: 11000,
          maxCapacity: 10000
        })
      );
    });
  });
  
  describe('Gemini Advanced Agent Capacity Testing', () => {
    it('should handle up to 7,500 concurrent tasks efficiently', async () => {
      // Test Gemini at various batch sizes
      const testBatches = [250, 1000, 3500, 7500].map(size => {
        return {
          size,
          prompts: Array(size).fill(testPrompts['Gemini Advanced'])
        };
      });
      
      for (const batch of testBatches) {
        (quantumGlossary.recordFlowMetric as jest.Mock).mockClear();
        
        const responses = await manager.processParallelTasks(batch.prompts);
        const successRate = responses.filter(r => r !== null).length / batch.size;
        
        // Verify success rate stays high even under load
        expect(successRate).toBeGreaterThanOrEqual(0.99); // Minimum 99% success
        
        // Verify metrics were recorded
        expect(quantumGlossary.recordFlowMetric).toHaveBeenCalledWith(
          expect.any(String),
          'parallel_batch_completed',
          expect.any(Number),
          expect.objectContaining({
            agent: 'Gemini Advanced',
            batchSize: batch.size
          })
        );
        
        console.log(`Gemini batch size: ${batch.size}, Success: ${(successRate * 100).toFixed(2)}%`);
      }
    });
  });
  
  describe('GPT-4 Pro Agent Capacity Testing', () => {
    it('should handle up to 5,000 concurrent tasks efficiently', async () => {
      // Test GPT-4 Pro with focus on complex tasks
      const responses = await manager.processParallelTasks(
        Array(5000).fill(testPrompts['GPT-4 Pro'])
      );
      
      const successRate = responses.filter(r => r !== null).length / 5000;
      
      // Verify high success rate with complex tasks
      expect(successRate).toBeGreaterThanOrEqual(0.99);
      
      // Verify metrics were recorded
      expect(quantumGlossary.recordFlowMetric).toHaveBeenCalledWith(
        expect.any(String),
        'parallel_batch_completed',
        expect.any(Number),
        expect.objectContaining({
          agent: 'GPT-4 Pro',
          batchSize: 5000
        })
      );
    });
  });
  
  describe('Processing Strategy Selection', () => {
    it('should select appropriate processing strategies based on batch size', async () => {
      // Test small batch - should use fully parallel strategy
      await manager.processParallelTasks(Array(50).fill(testPrompts.Claude));
      expect(quantumGlossary.decohere).toHaveBeenCalledWith(
        expect.objectContaining({
          contextDescription: "Parallel task processing for stress testing",
          metadata: expect.objectContaining({
            batchSize: 50,
            agentType: 'Claude'
          })
        })
      );
      
      // Test medium batch - should use adaptive concurrency
      (quantumGlossary.decohere as jest.Mock).mockClear();
      await manager.processParallelTasks(Array(200).fill(testPrompts.Grok));
      expect(quantumGlossary.decohere).toHaveBeenCalledWith(
        expect.objectContaining({
          metadata: expect.objectContaining({
            batchSize: 200,
            agentType: 'Grok'
          })
        })
      );
      
      // Test large batch - should use batched parallel mode
      (quantumGlossary.decohere as jest.Mock).mockClear();
      await manager.processParallelTasks(Array(500).fill(testPrompts['Gemini Advanced']));
      expect(quantumGlossary.decohere).toHaveBeenCalledWith(
        expect.objectContaining({
          metadata: expect.objectContaining({
            batchSize: 500,
            agentType: 'Gemini Advanced'
          })
        })
      );
    });
  });
});