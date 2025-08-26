/**
 * IDDR Cognitive Loop Integration Test
 * 
 * This test validates the full IDDR (Identify, Decompose, Distribute, Recompose) pipeline,
 * testing the integration between the Quantum Chunking Engine and the
 * Persistent Neural Orchestration Engine with proper persistent context management.
 */

import { InMemoryPersistenceLayer } from './mocks/mock-persistence-layer.js';
import { FileSystemPersistentContextService } from '../services/persistence-layer.js';
import { CognitiveLayer, IPersistentContextService } from '../services/context-manager.js';
import { PersistentNeuralOrchestrationEngine, Task } from '../services/neural-orchestrator/persistent-orchestration-engine.js';
import { ModelType } from '../services/neural-orchestrator/model-strength-analyzer.js';
import { quantumChunkingEngine } from '../services/neural-orchestrator/quantum-chunking-engine.js';
import { v4 as uuidv4 } from 'uuid';

describe('IDDR Cognitive Loop Integration', () => {
  let persistenceLayer: InMemoryPersistenceLayer;
  let contextService: IPersistentContextService;
  let orchestrationEngine: PersistentNeuralOrchestrationEngine;
  const sessionId = 'iddr-test-session';

  // Sample complex text for testing decomposition
  const complexText = `
# Quantum Computing: A Comprehensive Overview

Quantum computing is a rapidly evolving field that leverages the principles of quantum mechanics to process information. Unlike classical computers that use bits (0s and 1s), quantum computers use quantum bits or qubits, which can exist in multiple states simultaneously due to superposition.

## Fundamental Concepts

### Superposition
Superposition allows qubits to represent multiple states at once, enabling quantum computers to process a vast number of possibilities simultaneously.

### Entanglement
Quantum entanglement creates correlations between qubits, allowing the state of one qubit to depend on the state of another, regardless of distance.

### Quantum Gates
Quantum gates are the building blocks of quantum circuits, manipulating qubits to perform computations.

## Quantum Algorithms

### Shor's Algorithm
Shor's algorithm can factorize large numbers exponentially faster than the best-known classical algorithms, posing a significant threat to RSA encryption.

### Grover's Algorithm
Grover's algorithm provides a quadratic speedup for unstructured search problems, making it valuable for database searches and optimization problems.

## Current Challenges

Quantum computers face numerous challenges, including:
- Decoherence: Quantum states are fragile and can collapse when interacting with the environment
- Error correction: Quantum error correction is essential but requires additional qubits
- Scalability: Building large-scale, fault-tolerant quantum computers remains difficult

## Future Prospects

Despite challenges, quantum computing shows promise in:
- Breaking current encryption methods
- Drug discovery and materials science
- Optimization problems
- Machine learning
- Climate modeling

As technology advances, quantum computing will likely revolutionize our approach to solving complex computational problems.
  `;

  beforeAll(async () => {
    // Use in-memory persistence for faster tests
    persistenceLayer = new InMemoryPersistenceLayer();
    contextService = new FileSystemPersistentContextService(persistenceLayer);
    orchestrationEngine = new PersistentNeuralOrchestrationEngine(contextService);
    
    // Initialize the test session
    await orchestrationEngine.initializeSession(sessionId);
    
    // Reset quantum chunking engine state
    quantumChunkingEngine.reset();
  });

  afterEach(() => {
    // Clear in-memory storage between tests
    persistenceLayer.reset();
    
    // Reset quantum chunking engine state
    quantumChunkingEngine.reset();
  });

  it('should decompose, process, and recompose a complex task using the IDDR pipeline', async () => {
    // Create a complex task that will trigger the IDDR pipeline
    const task: Task = {
      id: uuidv4(),
      prompt: complexText,
      type: 'summarization',
      cognitiveLayer: CognitiveLayer.STRATEGIC,
      requirements: {
        complexity: 8, // High complexity to ensure chunking
        precision: 7,
        creativity: 5
      },
      modelType: ModelType.ADVANCED,
      tags: ['test', 'quantum', 'summarization']
    };

    // Execute the task through the orchestration engine
    const result = await orchestrationEngine.executeTask(task);

    // Verify the result
    expect(result).toBeDefined();
    expect(result.taskId).toBe(task.id);
    expect(result.output).toBeTruthy();
    expect(result.metadata).toBeDefined();
    expect(result.metadata?.iddrPipeline).toBe(true);
    expect(result.metadata?.chunkCount).toBeGreaterThan(1);

    // Verify that meta events were emitted
    const context = await contextService.loadContext(sessionId);
    expect(context).toBeDefined();
    
    // Check that history chunks were created
    expect(context.historyChunks.length).toBeGreaterThan(0);
    
    // Check that strategic plans were created
    const strategicPlans = context.strategicPlans;
    expect(strategicPlans.length).toBeGreaterThan(0);
    
    // Find the plan for our task
    const taskPlan = strategicPlans.find(p => p.taskId === task.id);
    expect(taskPlan).toBeDefined();
    expect(taskPlan?.status).toBe('completed');
    expect(taskPlan?.subTasks.length).toBeGreaterThan(1);
    
    // Check that meta insights were created
    const metaInsights = context.metaInsights;
    expect(metaInsights.length).toBeGreaterThan(0);
    
    // Verify pattern recognition event was emitted
    const decompositionEvent = metaInsights.find(
      i => i.eventType === 'pattern-recognition' && i.summary.includes('decomposed')
    );
    expect(decompositionEvent).toBeDefined();
    
    // Verify task completion event was emitted
    const completionEvent = metaInsights.find(
      i => i.eventType === 'task-completion' && i.summary.includes('Completed task')
    );
    expect(completionEvent).toBeDefined();
  });

  it('should handle errors gracefully in the IDDR pipeline', async () => {
    // Modify the quantum chunking engine to fail during processing
    const originalDecomposeTask = quantumChunkingEngine.decomposeTask;
    quantumChunkingEngine.decomposeTask = jest.fn().mockImplementation(() => {
      throw new Error('Simulated decomposition failure');
    });

    // Create a task that will trigger the IDDR pipeline
    const task: Task = {
      id: uuidv4(),
      prompt: 'This task will fail due to a simulated error',
      type: 'analysis',
      cognitiveLayer: CognitiveLayer.STRATEGIC,
      requirements: {
        complexity: 9
      }
    };

    try {
      // Execute the task through the orchestration engine
      await orchestrationEngine.executeTask(task);
      fail('Should have thrown an error');
    } catch (error) {
      // Expected to fail
    }

    // Verify that failure meta events were emitted
    const context = await contextService.loadContext(sessionId);
    expect(context).toBeDefined();
    
    // Find the failure event
    const failureEvent = context.metaInsights.find(
      i => i.eventType === 'task-failure' && i.details.taskId === task.id
    );
    expect(failureEvent).toBeDefined();
    expect(failureEvent?.details.error).toContain('Simulated decomposition failure');
    
    // Find the strategic plan and verify it's marked as failed
    const taskPlan = context.strategicPlans.find(p => p.taskId === task.id);
    expect(taskPlan).toBeDefined();
    expect(taskPlan?.status).toBe('failed');

    // Restore original function
    quantumChunkingEngine.decomposeTask = originalDecomposeTask;
  });

  it('should correctly process subtasks with different processors', async () => {
    // Register a custom processor for testing
    const mockProcessor = jest.fn().mockImplementation(async (task: Task) => {
      return `Processed subtask ${task.id} with custom processor`;
    });
    
    orchestrationEngine.registerTaskProcessor('custom_task', mockProcessor);

    // Create a task that will use the custom processor
    const task: Task = {
      id: uuidv4(),
      prompt: 'This is a task that will use a custom processor',
      type: 'custom_task',
      cognitiveLayer: CognitiveLayer.STRATEGIC,
      requirements: {
        complexity: 7
      }
    };

    // Execute the task
    const result = await orchestrationEngine.executeTask(task);

    // Verify the custom processor was called
    expect(mockProcessor).toHaveBeenCalled();
    expect(result.output).toBeTruthy();
    
    // Check meta insights for subtask events
    const context = await contextService.loadContext(sessionId);
    const subtaskEvents = context.metaInsights.filter(
      i => i.summary.includes('Subtask')
    );
    
    // Should have start and completion events for each subtask
    expect(subtaskEvents.length).toBeGreaterThan(0);
  });

  it('should enrich tasks with context from memory', async () => {
    // First, create some history that can be used for context
    await contextService.addHistoryChunk(sessionId, {
      chunkId: uuidv4(),
      content: 'Previous information about quantum computing',
      cognitiveLayer: CognitiveLayer.STRATEGIC,
      timestamp: new Date(),
      tags: ['quantum', 'computing']
    });

    // Create a task that should be enriched with the previous context
    const task: Task = {
      id: uuidv4(),
      prompt: 'Tell me about quantum computing',
      type: 'summarization',
      cognitiveLayer: CognitiveLayer.STRATEGIC,
      requirements: {
        complexity: 6
      },
      tags: ['quantum']
    };

    // Execute the task
    const result = await orchestrationEngine.executeTask(task);

    // Verify context enrichment
    expect(result.metadata?.contextEnriched).toBe(true);
    expect(result.metadata?.historyChunks).toBeGreaterThan(0);
  });
});