/**
 * Neural Orchestrator API
 * 
 * This module provides RESTful API endpoints for interacting with the Neural Orchestration Engine,
 * allowing for task creation, execution, and monitoring, as well as model management
 * and benchmark operations.
 */

import { Router, Request, Response } from 'express';
import { neuralOrchestrationEngine } from '../services/neural-orchestrator/neural-orchestration-engine.js';
import { ModelType, modelStrengthAnalyzer } from '../services/neural-orchestrator/model-strength-analyzer.js';
import { MetaCognitiveEventBuilder } from '../services/utils/MetaCognitiveEventBuilder.js';

/**
 * Evaluation criteria for assessing output quality
 */
export enum EvaluationCriteria {
  ACCURACY = 'accuracy',
  CREATIVITY = 'creativity',
  SPEED = 'speed',
  CONSISTENCY = 'consistency',
  DETAIL = 'detail',
  FORMAT_ADHERENCE = 'format_adherence',
  CONTEXT_AWARENESS = 'context_awareness',
  INSTRUCTION_FOLLOWING = 'instruction_following',
  REASONING = 'reasoning',
  BREVITY = 'brevity',
  TOOL_USAGE = 'tool_usage',
  EFFICIENCY = 'efficiency',
  CODE_QUALITY = 'code_quality',
  EXPLANATION = 'explanation',
  COHERENCE = 'coherence',
  ENGAGEMENT = 'engagement',
  ADHERENCE_TO_CONSTRAINTS = 'adherence_to_constraints',
  SIMPLIFICATION = 'simplification',
  CLARITY = 'clarity',
  COMPLETENESS = 'completeness'
}

/**
 * Types of tasks the system can process
 */
export enum TaskType {
  SUMMARIZATION = 'summarization',
  ANALYSIS = 'analysis',
  GENERATION = 'generation',
  TRANSLATION = 'translation',
  CLASSIFICATION = 'classification',
  EXTRACTION = 'extraction',
  CONVERSATION = 'conversation',
  CALCULATION = 'calculation',
  TEXT_GENERATION = 'text_generation',
  CODE_GENERATION = 'code_generation',
  REASONING = 'reasoning',
  CREATIVE_WRITING = 'creative_writing',
  POETRY = 'poetry',
  STORY_TELLING = 'story_telling',
  MATHEMATICS = 'mathematics',
  SCIENTIFIC_ANALYSIS = 'scientific_analysis',
  DOMAIN_SPECIFIC = 'domain_specific',
  IMAGE_UNDERSTANDING = 'image_understanding',
  AUDIO_UNDERSTANDING = 'audio_understanding',
  INSTRUCTION_FOLLOWING = 'instruction_following',
  TOOL_USAGE = 'tool_usage',
  PLANNING = 'planning',
  META_COGNITION = 'meta_cognition'
}
import { createModelAgent } from '../services/neural-orchestrator/model-agents.js';
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';
import { metaCognitiveEngine } from '../services/qrn/meta-cognitive-analysis-engine.js';
import { storage } from '../storage.js';
// MemStorage implementation doesn't use direct database queries

export const router = Router();

// Validation schemas
const taskRequirementsSchema = z.object({
  taskType: z.nativeEnum(TaskType),
  complexity: z.number().min(1).max(10).default(5),
  domainSpecificity: z.number().min(1).max(10).default(5),
  creativityLevel: z.number().min(1).max(10).default(5),
  timeConstraint: z.number().min(0).default(0),
  outputFormat: z.string().optional(),
  qualityThreshold: z.number().min(0).max(1).optional(),
  criteriaImportance: z.record(z.number().min(0).max(1)).default({}),
  contextSize: z.number().min(1).max(100000).default(1000),
  multimodalInputs: z.boolean().default(false),
  systemConstraints: z.object({
    maxTokens: z.number().optional(),
    maxLatency: z.number().optional(),
    maxCost: z.number().optional(),
  }).optional(),
});

const taskCreateSchema = z.object({
  prompt: z.string().min(1).max(10000),
  requirements: z.object({
    taskType: z.nativeEnum(TaskType),
    complexity: z.number().min(1).max(10).default(5),
    domainSpecificity: z.number().min(1).max(10).default(5),
    creativityLevel: z.number().min(1).max(10).default(5),
    timeConstraint: z.number().min(0).default(0),
    outputFormat: z.string().optional(),
    qualityThreshold: z.number().min(0).max(1).optional(),
    criteriaImportance: z.record(z.number().min(0).max(1)).default({}),
    contextSize: z.number().min(1).max(100000).default(1000),
    multimodalInputs: z.boolean().default(false),
    enableAdvancedRouting: z.boolean().default(false), // New field for advanced routing
    systemConstraints: z.object({
      maxTokens: z.number().optional(),
      maxLatency: z.number().optional(),
      maxCost: z.number().optional(),
    }).optional(),
  }),
  priority: z.number().min(1).max(10).default(5),
  deadline: z.string().optional(), // ISO date string
  multimodalContent: z.array(
    z.object({
      type: z.enum(['image', 'audio', 'video']),
      data: z.string(), // base64 or URL
    })
  ).optional(),
});

const modelInitializeSchema = z.object({
  modelType: z.nativeEnum(ModelType),
  apiKey: z.string().optional(),
  systemStability: z.number().min(0).max(1).optional(),
  nodeSynergy: z.number().min(0).max(1).optional(),
  globalCoherence: z.number().min(0).max(1).optional(),
});

const benchmarkRunSchema = z.object({
  modelType: z.nativeEnum(ModelType),
  benchmarkId: z.string().optional(), // If not provided, run all benchmarks
});

// GET /api/neural-orchestrator/status
// Get the current status of the Neural Orchestration Engine
router.get('/status', (req: Request, res: Response) => {
  try {
    const stats = neuralOrchestrationEngine.getStatistics();
    const availableModels = neuralOrchestrationEngine.getAvailableModelTypes();
    
    res.json({
      status: 'active',
      statistics: stats,
      availableModels,
      createdAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error getting NOE status:', error);
    res.status(500).json({ error: 'Failed to get Neural Orchestration Engine status' });
  }
});

// Import the System Integration Adapter
import { systemIntegrationAdapter } from '../services/SystemIntegrationAdapter.js';

// POST /api/neural-orchestrator/models/initialize
// Initialize a specific AI model agent
router.post('/models/initialize', async (req: Request, res: Response) => {
  try {
    // Convert modelType from underscore to hyphen format if needed
    const requestBody = { ...req.body };
    if (requestBody.modelType && typeof requestBody.modelType === 'string') {
      // Try to normalize model type if it contains underscores
      requestBody.modelType = requestBody.modelType.replace(/_/g, '-');
    }

    const validation = modelInitializeSchema.safeParse(requestBody);
    if (!validation.success) {
      return res.status(400).json({ error: validation.error.message });
    }
    
    const { modelType, apiKey, systemStability, nodeSynergy, globalCoherence } = validation.data;
    
    // Use the system integration adapter to initialize the model
    // This will coordinate the initialization across all components
    const result = await systemIntegrationAdapter.initializeModel(
      modelType,
      apiKey,
      {
        systemStability, 
        nodeSynergy, 
        globalCoherence
      }
    );
    
    if (!result.success) {
      return res.status(500).json({ 
        error: 'Failed to initialize model agent',
        details: result.error
      });
    }
    
    // Import the broadcast function from the events module
    const { broadcastSystemStatus } = await import('../services/events.js');
    
    // Broadcast the system status update to all clients
    broadcastSystemStatus();
    
    // Log to meta-cognitive system using the builder pattern
    await metaCognitiveEngine.processEvent(
      new MetaCognitiveEventBuilder()
        .withId(uuidv4())
        .withNodeId(uuidv4())
        .withType("model-initialized")
        .withCreatedAt(new Date())
        .withDescription(`Model ${modelType} initialized`)
        .withDetails({
          modelType,
          unified: true,
          createdAt: new Date(),
          hasApiKey: !!apiKey,
          systemMetrics: {
            systemStability: systemStability || null,
            nodeSynergy: nodeSynergy || null,
            globalCoherence: globalCoherence || null
          },
          processingTime: null // Now included in details instead
        })
        .withConfidence(1.0)
        .withImpact(7)
        .withRelatedEvents([]) // Builder handles empty array conversion
        .withOutcome(undefined)
        .withSourceContext({
          source: 'api',
          operation: 'initialize-model'
        })
        .build()
    );
    
    res.status(200).json({
      success: true,
      modelType,
      status: result.model?.status,
      initialized: result.model?.initialized
    });
  } catch (error) {
    console.error('Error initializing model:', error);
    res.status(500).json({ error: 'Failed to initialize model agent' });
  }
});

// GET /api/neural-orchestrator/models
// Get all available models and their capabilities
router.get('/models', (req: Request, res: Response) => {
  try {
    const models = neuralOrchestrationEngine.getAvailableModelTypes();
    const modelsWithCapabilities = models.map(modelType => {
      return {
        modelType,
        capabilities: neuralOrchestrationEngine.getModelCapabilities(modelType)
      };
    });
    
    res.json(modelsWithCapabilities);
  } catch (error) {
    console.error('Error getting models:', error);
    res.status(500).json({ error: 'Failed to get available models' });
  }
});

// GET /api/neural-orchestrator/models/:modelType/performance
// Get the performance profile for a specific model
router.get('/models/:modelType/performance', (req: Request, res: Response) => {
  try {
    // Convert model type from underscore to hyphen format if needed
    let normalizedModelType = req.params.modelType;
    if (normalizedModelType && typeof normalizedModelType === 'string') {
      // Try to normalize model type if it contains underscores
      normalizedModelType = normalizedModelType.replace(/_/g, '-');
    }
    
    // Validate model type
    if (!Object.values(ModelType).includes(normalizedModelType as ModelType)) {
      return res.status(400).json({ error: 'Invalid model type' });
    }
    
    const profile = modelStrengthAnalyzer.getModelPerformanceProfile(normalizedModelType as ModelType);
    res.json(profile);
  } catch (error) {
    console.error('Error getting model performance:', error);
    res.status(500).json({ error: 'Failed to get model performance profile' });
  }
});

// POST /api/neural-orchestrator/models/:modelType/benchmarks
// Run benchmarks for a specific model
router.post('/models/:modelType/benchmarks', async (req: Request, res: Response) => {
  try {
    // Convert model type from underscore to hyphen format if needed
    let normalizedModelType = req.params.modelType;
    if (normalizedModelType && typeof normalizedModelType === 'string') {
      // Try to normalize model type if it contains underscores
      normalizedModelType = normalizedModelType.replace(/_/g, '-');
    }
    
    const validation = benchmarkRunSchema.safeParse({
      ...req.body,
      modelType: normalizedModelType
    });
    
    if (!validation.success) {
      return res.status(400).json({ error: validation.error.message });
    }
    
    const { modelType: validatedModelType, benchmarkId } = validation.data;
    
    // Check if model is available
    const availableModels = neuralOrchestrationEngine.getAvailableModelTypes();
    if (!availableModels.includes(validatedModelType)) {
      return res.status(400).json({ error: 'Model not initialized. Please initialize the model first.' });
    }
    
    // Log to meta-cognitive system using the builder pattern
    await metaCognitiveEngine.processEvent(
      new MetaCognitiveEventBuilder()
        .withId(uuidv4())
        .withNodeId(uuidv4())
        .withType("benchmark-started")
        .withCreatedAt(new Date())
        .withDescription(`Benchmark started for model ${validatedModelType}`)
        .withDetails({
          modelType: validatedModelType,
          benchmarkId,
          processingTime: null // Now included in details instead
        })
        .withConfidence(1.0)
        .withImpact(6)
        .withRelatedEvents([]) // Builder handles empty array conversion
        .withOutcome(undefined)
        .withSourceContext({
          source: 'api',
          operation: 'run-benchmark'
        })
        .build()
    );
    
    // Run the benchmarks (asynchronously)
    modelStrengthAnalyzer.runBenchmarksForModel(validatedModelType)
      .then(results => {
        console.log(`Completed ${results.length} benchmarks for ${validatedModelType}`);
        
        // Log completion to meta-cognitive system using the builder pattern
        metaCognitiveEngine.processEvent(
          new MetaCognitiveEventBuilder()
            .withId(uuidv4())
            .withNodeId(uuidv4())
            .withType("benchmark-completed")
            .withCreatedAt(new Date())
            .withDescription(`Benchmark completed for model ${validatedModelType}`)
            .withDetails({
              modelType: validatedModelType,
              benchmarkCount: results.length,
              processingTime: null // Now included in details instead
            })
            .withConfidence(1.0)
            .withImpact(6)
            .withRelatedEvents([]) // Builder handles empty array conversion
            .withOutcome(undefined)
            .withSourceContext({
              source: 'api',
              operation: 'run-benchmark-complete'
            })
            .build()
        );
      })
      .catch(err => {
        console.error(`Error running benchmarks for ${validatedModelType}:`, err);
        
        // Log error to meta-cognitive system using the builder pattern
        metaCognitiveEngine.processEvent(
          new MetaCognitiveEventBuilder()
            .withId(uuidv4())
            .withNodeId(uuidv4())
            .withType("error")
            .withCreatedAt(new Date())
            .withDescription(`Error running benchmarks for model ${validatedModelType}`)
            .withDetails({
              modelType: validatedModelType,
              error: err.message,
              processingTime: null // Now included in details instead
            })
            .withConfidence(1.0)
            .withImpact(8)
            .withRelatedEvents([]) // Builder handles empty array conversion
            .withOutcome(undefined)
            .withSourceContext({
              source: 'api',
              operation: 'run-benchmark-error'
            })
            .build()
        );
      });
    
    res.status(202).json({
      message: 'Benchmark execution started',
      modelType: validatedModelType
    });
  } catch (error) {
    console.error('Error running benchmarks:', error);
    res.status(500).json({ error: 'Failed to run benchmarks' });
  }
});

// POST /api/neural-orchestrator/tasks
// Create and execute a new task
router.post('/tasks', async (req: Request, res: Response) => {
  try {
    const validation = taskCreateSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ error: validation.error.message });
    }
    
    const taskData = validation.data;
    
    // Convert deadline string to Date if provided
    const metadata: Record<string, any> = {};
    if (taskData.deadline) {
      metadata.deadline = new Date(taskData.deadline);
    }
    
    // Add multimodal content if provided
    if (taskData.multimodalContent) {
      metadata.multimodalContent = taskData.multimodalContent;
    }
    
    // Create the task using the Neural Orchestration Engine
    const task = neuralOrchestrationEngine.createTask({
      prompt: taskData.prompt,
      requirements: taskData.requirements,
      priority: taskData.priority,
      deadline: taskData.deadline ? new Date(taskData.deadline) : undefined,
      multimodalContent: taskData.multimodalContent
    });
    
    // Prepare the task data for processing through the System Integration Adapter
    const taskRequest = {
      id: task.id,
      type: taskData.requirements.taskType,
      prompt: taskData.prompt,
      requirements: taskData.requirements,
      priority: taskData.priority,
      metadata: {
        deadline: taskData.deadline ? new Date(taskData.deadline) : undefined,
        multimodalContent: taskData.multimodalContent,
        isAdvancedRouting: taskData.requirements.enableAdvancedRouting
      }
    };
    
    // Process the task through the System Integration Adapter
    // This will coordinate all necessary components: Meta-Cognitive Engine, 
    // Neural Orchestration Engine, QRN Context Manager, and Adaptive Resonance Service
    const processPromise = systemIntegrationAdapter.processTask(taskRequest);
    
    // Log to meta-cognitive system using the builder pattern
    await metaCognitiveEngine.processEvent(
      new MetaCognitiveEventBuilder()
        .withId(uuidv4())
        .withNodeId(uuidv4())
        .withType("task-created")
        .withCreatedAt(new Date())
        .withDescription(`Task created: ${task.id}`)
        .withDetails({
          taskId: task.id,
          taskType: taskData.requirements.taskType,
          priority: taskData.priority,
          unified: true,
          processingTime: null // Now included in details instead
        })
        .withConfidence(1.0)
        .withImpact(5)
        .withRelatedEvents([]) // Builder handles empty array conversion
        .withOutcome(undefined)
        .withSourceContext({
          source: 'api',
          operation: 'create-task'
        })
        .build()
    );
    
    // Determine response based on routing mode
    const routingMode = taskData.requirements.enableAdvancedRouting ? 'advanced' : 'standard';
    
    // Process the task asynchronously
    processPromise
      .then(result => {
        console.log(`Task ${task.id} processed successfully with ${routingMode} routing`);
      })
      .catch(err => {
        console.error(`Error processing task ${task.id}:`, err);
      });
    
    res.status(202).json({
      message: `Task created and execution started with ${routingMode} routing`,
      taskId: task.id,
      routingMode: routingMode,
      unifiedProcessing: true
    });
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ error: 'Failed to create and execute task' });
  }
});

// GET /api/neural-orchestrator/tasks
// Get all tasks, optionally filtered by status
router.get('/tasks', (req: Request, res: Response) => {
  try {
    const status = req.query.status as string;
    
    if (status && !['pending', 'analyzing', 'executing', 'completed', 'failed'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status filter' });
    }
    
    // Fix: Get all tasks from the Neural Orchestration Engine
    const tasks = status 
      ? neuralOrchestrationEngine.getTasksByStatus(status as any)
      : neuralOrchestrationEngine.getAllTasks();
    
    // Always return an array, even if empty
    res.json(tasks || []);
  } catch (error) {
    console.error('Error getting tasks:', error);
    // Return an empty array even on error to prevent client-side issues
    res.status(200).json([]);
  }
});

// GET /api/neural-orchestrator/chunks
// Get all chunks, optionally filtered by taskId or state
router.get('/chunks', async (req: Request, res: Response) => {
  try {
    const taskId = req.query.taskId as string;
    const state = req.query.state as string;
    
    // Validate state if provided
    if (state && !['pending', 'processing', 'completed', 'error'].includes(state)) {
      return res.status(400).json({ error: 'Invalid state filter' });
    }
    
    // Use MemStorage to get chunks
    const allChunks = await storage.getAllChunks();
    
    // Filter the chunks based on taskId and state
    const chunkResults = allChunks.filter(chunk => {
      if (taskId && chunk.parentTaskId !== taskId) return false;
      if (state && chunk.chunkState !== state) return false;
      return true;
    });
    
    // Log success to meta-cognitive system using the builder pattern
    await metaCognitiveEngine.processEvent(
      new MetaCognitiveEventBuilder()
        .withId(uuidv4())
        .withNodeId(uuidv4())
        .withType("chunks-retrieved")
        .withCreatedAt(new Date())
        .withDescription(`Retrieved ${chunkResults.length} chunks${taskId ? ` for task ${taskId}` : ''}`)
        .withDetails({
          count: chunkResults.length,
          taskId: taskId || null,
          state: state || null,
          unified: true,
          processingTime: null // Now included in details instead
        })
        .withConfidence(1.0)
        .withImpact(3)
        .withRelatedEvents([]) // Builder handles empty array conversion
        .withOutcome(undefined)
        .withSourceContext({
          source: 'api',
          operation: 'get-chunks'
        })
        .build()
    );
    
    // Always return an array, even if empty
    res.json(chunkResults || []);
  } catch (error) {
    console.error('Error getting chunks:', error);
    
    // Log error to meta-cognitive system using the builder pattern
    await metaCognitiveEngine.processEvent(
      new MetaCognitiveEventBuilder()
        .withId(uuidv4())
        .withNodeId(uuidv4())
        .withType("error")
        .withCreatedAt(new Date())
        .withDescription(`Error retrieving chunks: ${(error as Error).message}`)
        .withDetails({
          error: (error as Error).message,
          stack: (error as Error).stack,
          operation: 'get-chunks',
          processingTime: null // Now included in details instead
        })
        .withConfidence(1.0)
        .withImpact(7)
        .withRelatedEvents([]) // Builder handles empty array conversion
        .withOutcome(undefined)
        .withSourceContext({
          source: 'api',
          operation: 'get-chunks-error'
        })
        .build()
    );
    
    // Return an empty array even on error to prevent client-side issues
    res.status(200).json([]);
  }
});

// GET /api/neural-orchestrator/chunks/:chunkId
// Get a specific chunk by ID
router.get('/chunks/:chunkId', async (req: Request, res: Response) => {
  try {
    const chunkId = req.params.chunkId;
    
    // Get chunk from storage
    const chunk = await storage.getChunk(chunkId);
    
    if (!chunk) {
      return res.status(404).json({ error: 'Chunk not found' });
    }
    
    // Log success to meta-cognitive system using the builder pattern
    await metaCognitiveEngine.processEvent(
      new MetaCognitiveEventBuilder()
        .withId(uuidv4())
        .withNodeId(uuidv4())
        .withType("chunk-retrieved")
        .withCreatedAt(new Date())
        .withDescription(`Retrieved chunk ${chunkId}`)
        .withDetails({
          chunkId: chunkId,
          taskId: chunk.parentTaskId,
          state: chunk.chunkState,      // Changed from state to chunkState
          unified: true,
          processingTime: null // Now included in details instead
        })
        .withConfidence(1.0)
        .withImpact(2)
        .withRelatedEvents([]) // Builder handles empty array conversion
        .withOutcome(undefined)
        .withSourceContext({
          source: 'api',
          operation: 'get-chunk-by-id'
        })
        .build()
    );
    
    res.json(chunk);
  } catch (error) {
    console.error(`Error getting chunk ${req.params.chunkId}:`, error);
    
    // Log error to meta-cognitive system using the builder pattern
    await metaCognitiveEngine.processEvent(
      new MetaCognitiveEventBuilder()
        .withId(uuidv4())
        .withNodeId(uuidv4())
        .withType("error")
        .withCreatedAt(new Date())
        .withDescription(`Error retrieving chunk: ${(error as Error).message}`)
        .withDetails({
          error: (error as Error).message,
          stack: (error as Error).stack,
          chunkId: req.params.chunkId,
          operation: 'get-chunk-by-id',
          processingTime: null // Now included in details instead
        })
        .withConfidence(1.0)
        .withImpact(6)
        .withRelatedEvents([]) // Builder handles empty array conversion
        .withOutcome(undefined)
        .withSourceContext({
          source: 'api',
          operation: 'get-chunk-by-id-error'
        })
        .build()
    );
    
    res.status(500).json({ error: 'Failed to get chunk' });
  }
});

// POST /api/neural-orchestrator/chunks
// Create a new chunk
router.post('/chunks', async (req: Request, res: Response) => {
  try {
    const { parentTaskId, content, order, modelType, boundaries, metadata } = req.body;
    
    if (!parentTaskId || !content) {
      return res.status(400).json({ error: 'parentTaskId and content are required' });
    }
    
    // Generate a unique ID for this chunk
    const chunkId = uuidv4();
    
    // Create a start timestamp
    const now = new Date();
    
    // Calculate initial metrics
    const contentLength = content.length;
    const initialMetrics = {
      semanticCoherence: Math.random() * 0.5 + 0.5, // Random value between 0.5 and 1
      contextDependency: Math.random() * 0.5, // Random value between 0 and 0.5
      conceptualDensity: Math.random() * 0.7 + 0.3, // Random value between 0.3 and 1
      microMacroBalance: 0.5, // Default balanced
      decompositionQuality: Math.random() * 0.5 + 0.5, // Random value between 0.5 and 1
      distributionSuitability: Math.random() * 0.5 + 0.5, // Random value between 0.5 and 1
      recompositionPotential: Math.random() * 0.5 + 0.5 // Random value between 0.5 and 1
    };
    
    // Create a new chunk object
    const newChunk = {
      id: chunkId,
      parentTaskId: parentTaskId,
      originalContent: content,
      chunkIndex: order || 0,
      totalChunks: 1, // Will be updated later if needed
      chunkSize: contentLength,
      chunkState: 'pending',
      createdAt: now,
      updatedAt: now,
      processedContent: null,
      embedding: null, // Will be populated later if needed
      metadata: {
        semanticCoherence: initialMetrics.semanticCoherence,
        contextDependency: initialMetrics.contextDependency,
        conceptualDensity: initialMetrics.conceptualDensity,
        microMacroBalance: initialMetrics.microMacroBalance,
        decompositionQuality: initialMetrics.decompositionQuality,
        distributionSuitability: initialMetrics.distributionSuitability,
        recompositionPotential: initialMetrics.recompositionPotential,
        ...(metadata || {}),
        modelType: modelType || null,
        boundaries: boundaries || {
          start: 0,
          end: contentLength
        }
      }
    };
    
    // Store the chunk using MemStorage
    await storage.createChunk(newChunk);
    
    // Get all chunks for this task to count them
    const allTaskChunks = await storage.getAllChunks(undefined, { parentTaskId });
    const chunkCount = allTaskChunks.length;
    
    // Log success to meta-cognitive system using the builder pattern
    await metaCognitiveEngine.processEvent(
      new MetaCognitiveEventBuilder()
        .withId(uuidv4())
        .withNodeId(uuidv4())
        .withType("chunk-created")
        .withCreatedAt(new Date())
        .withDescription(`Created new chunk ${chunkId} for task ${parentTaskId}`)
        .withDetails({
          chunkId: chunkId,
          taskId: parentTaskId,
          contentLength,
          chunkCount,
          metrics: initialMetrics,
          unified: true,
          processingTime: null // Now included in details instead
        })
        .withConfidence(1.0)
        .withImpact(5)
        .withRelatedEvents([]) // Builder handles empty array conversion
        .withOutcome(undefined)
        .withSourceContext({
          source: 'api',
          operation: 'create-chunk'
        })
        .build()
    );
    
    // Import and broadcast the chunk creation event
    const { synBroadcastChunkCreate } = await import('../routes.js');
    synBroadcastChunkCreate(newChunk);
    
    res.status(201).json({
      message: 'Chunk created successfully',
      chunk: newChunk
    });
  } catch (error) {
    console.error('Error creating chunk:', error);
    
    // Log error to meta-cognitive system using the builder pattern
    await metaCognitiveEngine.processEvent(
      new MetaCognitiveEventBuilder()
        .withId(uuidv4())
        .withNodeId(uuidv4())
        .withType("error")
        .withCreatedAt(new Date())
        .withDescription(`Error creating chunk: ${(error as Error).message}`)
        .withDetails({
          error: (error as Error).message,
          stack: (error as Error).stack,
          operation: 'create-chunk',
          processingTime: null // Now included in details instead
        })
        .withConfidence(1.0)
        .withImpact(7)
        .withRelatedEvents([]) // Builder handles empty array conversion
        .withOutcome(undefined)
        .withSourceContext({
          source: 'api',
          operation: 'create-chunk-error'
        })
        .build()
    );
    
    res.status(500).json({ error: 'Failed to create chunk' });
  }
});

// GET /api/neural-orchestrator/tasks/:taskId
// Get a specific task by ID
router.get('/tasks/:taskId', (req: Request, res: Response) => {
  try {
    const taskId = req.params.taskId;
    const task = neuralOrchestrationEngine.getTask(taskId);
    
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    
    res.json(task);
  } catch (error) {
    console.error('Error getting task:', error);
    res.status(500).json({ error: 'Failed to get task' });
  }
});

// POST /api/neural-orchestrator/tasks/:taskId/ensemble
// Create and execute an ensemble plan for an existing task
router.post('/tasks/:taskId/ensemble', async (req: Request, res: Response) => {
  try {
    const taskId = req.params.taskId;
    const task = neuralOrchestrationEngine.getTask(taskId);
    
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    
    if (task.status === 'completed' || task.status === 'failed') {
      return res.status(422).json({ 
        error: 'Task already completed or failed',
        status: task.status
      });
    }
    
    // Create an ensemble execution plan for the task
    const executionPlan = neuralOrchestrationEngine.createEnsembleExecutionPlan(task, {
      parallelExecution: true, // Enable parallel processing
      includeAllModels: req.body.includeAllModels || false,
      weightByPerformance: req.body.weightByPerformance || true,
      minimumModelConfidence: req.body.minimumModelConfidence || 0.6
    });
    
    if (!executionPlan || executionPlan.steps.length === 0) {
      return res.status(422).json({ 
        error: 'Failed to create ensemble execution plan',
        details: 'No suitable models available or task not supported for ensemble execution'
      });
    }
    
    // Log to meta-cognitive system using the builder pattern
    // EXPLICIT BOUNDARY: Event creation and processing begins here
    await metaCognitiveEngine.processEvent(
      new MetaCognitiveEventBuilder()
        .withId(uuidv4())
        .withNodeId(uuidv4())
        .withType("ensemble-plan-created")
        .withCreatedAt(new Date())
        .withDescription(`Ensemble execution plan created for task ${task.id}`)
        .withDetails({
          taskId: task.id,
          executionPlanId: executionPlan.id,
          modelCount: executionPlan.steps.length,
          parallelExecution: executionPlan.parallelExecution,
          taskType: task.requirements.taskType,
          processingTime: null // Now included in details instead
        })
        .withConfidence(0.9)
        .withImpact(7)
        .withRelatedEvents([]) // Builder handles empty array conversion to 'none'
        .withOutcome(undefined)
        .withSourceContext({
          source: 'api',
          operation: 'create-ensemble-plan'
        }) // Converts to "api:create-ensemble-plan"
        .build()
    );
    
    // Execute the ensemble plan asynchronously
    neuralOrchestrationEngine.executeEnsemblePlan(executionPlan)
      .then(result => {
        console.log(`Ensemble plan for task ${task.id} executed successfully`);
      })
      .catch(err => {
        console.error(`Error executing ensemble plan for task ${task.id}:`, err);
      });
    
    res.status(202).json({
      message: 'Ensemble execution plan created and execution started',
      taskId: task.id,
      executionPlanId: executionPlan.id,
      modelCount: executionPlan.steps.length,
      parallelExecution: executionPlan.parallelExecution
    });
  } catch (error) {
    console.error('Error creating ensemble execution plan:', error);
    res.status(500).json({ error: 'Failed to create and execute ensemble plan' });
  }
});

// GET /api/neural-orchestrator/tasks/:taskId/result
// Get the result of a specific task
router.get('/tasks/:taskId/result', (req: Request, res: Response) => {
  try {
    const taskId = req.params.taskId;
    const task = neuralOrchestrationEngine.getTask(taskId);
    
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    
    if (task.status !== 'completed') {
      return res.status(422).json({ 
        error: 'Task not completed',
        status: task.status
      });
    }
    
    // Find the result for this task
    const result = neuralOrchestrationEngine.getTaskResult(taskId);
    
    if (!result) {
      return res.status(404).json({ error: 'Task result not found' });
    }
    
    // Return the actual result with all its properties
    // Ensure timestamp is formatted as ISO string for consistent date handling
    res.json({
      taskId: result.taskId,
      output: result.output,
      completedAt: result.timestamp.toISOString(),
      executionTime: result.executionTime,
      model: result.modelUsed ? result.modelUsed.join(', ') : 'Unknown'
    });
  } catch (error) {
    console.error('Error getting task result:', error);
    res.status(500).json({ error: 'Failed to get task result' });
  }
});

// GET /api/neural-orchestrator/benchmarks
// Get all available benchmarks
router.get('/benchmarks', (req: Request, res: Response) => {
  try {
    const benchmarks = modelStrengthAnalyzer.getAllBenchmarkTasks();
    res.json(benchmarks);
  } catch (error) {
    console.error('Error getting benchmarks:', error);
    res.status(500).json({ error: 'Failed to get benchmarks' });
  }
});

// GET /api/neural-orchestrator/task-types
// Get all task types and their descriptions
router.get('/task-types', (req: Request, res: Response) => {
  try {
    // Create a map of task types with descriptions
    const taskTypes = Object.keys(TaskType)
      .filter(key => isNaN(Number(key))) // Filter out numeric keys
      .map(key => {
        return {
          type: key,
          value: TaskType[key as keyof typeof TaskType],
          description: getTaskTypeDescription(TaskType[key as keyof typeof TaskType])
        };
      });
    
    res.json(taskTypes);
  } catch (error) {
    console.error('Error getting task types:', error);
    res.status(500).json({ error: 'Failed to get task types' });
  }
});

// POST /api/neural-orchestrator/tasks/:taskId/decompose
// Decompose a complex task into subtasks without execution
router.post('/tasks/:taskId/decompose', async (req: Request, res: Response) => {
  try {
    const taskId = req.params.taskId;
    const task = neuralOrchestrationEngine.getTask(taskId);
    
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    
    if (task.status === 'completed' || task.status === 'failed') {
      return res.status(422).json({ 
        error: 'Task already completed or failed',
        status: task.status
      });
    }
    
    // Force complexity to be high enough for decomposition
    const modifiedTask = {
      ...task,
      requirements: {
        ...task.requirements,
        complexity: Math.max(task.requirements.complexity, 7) // Ensure complexity is at least 7 for decomposition
      }
    };
    
    // Decompose the task into subtasks
    const subtasks = neuralOrchestrationEngine.decomposeComplexTask(modifiedTask);
    
    if (subtasks.length <= 1) {
      return res.status(422).json({ 
        error: 'Task decomposition failed',
        details: 'Unable to decompose the task into subtasks'
      });
    }
    
    // Log to meta-cognitive system using the builder pattern
    // EXPLICIT BOUNDARY: Event creation and processing begins here
    await metaCognitiveEngine.processEvent(
      new MetaCognitiveEventBuilder()
        .withId(uuidv4())
        .withNodeId(uuidv4())
        .withType("task-decomposed")
        .withCreatedAt(new Date())
        .withDescription(`Task ${task.id} decomposed into ${subtasks.length} subtasks`)
        .withDetails({
          taskId: task.id,
          subtaskCount: subtasks.length,
          taskType: task.requirements.taskType,
          complexityReduction: task.requirements.complexity - subtasks[0].requirements.complexity,
          processingTime: null // Now included in details instead
        })
        .withConfidence(0.9)
        .withImpact(7)
        .withRelatedEvents([]) // Builder handles empty array conversion to 'none'
        .withOutcome(undefined)
        .withSourceContext({
          source: 'api',
          operation: 'decompose-task'
        }) // Converts to "api:decompose-task"
        .build()
    );
    
    // Format subtask data for response
    const subtaskData = subtasks.map(subtask => ({
      id: subtask.id,
      prompt: subtask.prompt.substring(0, 100) + (subtask.prompt.length > 100 ? '...' : ''),
      taskType: subtask.requirements.taskType,
      complexity: subtask.requirements.complexity,
      priority: subtask.priority,
      isSubtask: subtask.isSubtask,
      parentTaskId: subtask.parentTaskId,
      status: subtask.status
    }));
    
    res.json({
      taskId: task.id,
      originalComplexity: task.requirements.complexity,
      subtaskCount: subtasks.length,
      subtasks: subtaskData,
      createdAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error decomposing task:', error);
    res.status(500).json({ error: 'Failed to decompose task' });
  }
});

// POST /api/neural-orchestrator/task-allocation
// Test dynamic task allocation without executing a task
router.post('/task-allocation', async (req: Request, res: Response) => {
  try {
    const validation = taskRequirementsSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ error: validation.error.message });
    }
    
    const requirements = validation.data;
    
    // Ensure criteria importance is populated if not provided
    if (Object.keys(requirements.criteriaImportance).length === 0) {
      // Default to valuing accuracy highly for most tasks
      requirements.criteriaImportance = {
        [EvaluationCriteria.ACCURACY]: 0.9,
        [EvaluationCriteria.INSTRUCTION_FOLLOWING]: 0.8,
        [EvaluationCriteria.DETAIL]: 0.7,
        [EvaluationCriteria.CONTEXT_AWARENESS]: 0.6,
        [EvaluationCriteria.CONSISTENCY]: 0.6,
        [EvaluationCriteria.SPEED]: 0.5
      };
      
      // For creative tasks, adjust importance
      if (requirements.taskType === TaskType.CREATIVE_WRITING || 
          requirements.taskType === TaskType.POETRY || 
          requirements.taskType === TaskType.STORY_TELLING) {
        requirements.criteriaImportance[EvaluationCriteria.CREATIVITY] = 0.9;
        requirements.criteriaImportance[EvaluationCriteria.ENGAGEMENT] = 0.8;
      }
    }
    
    // Get model recommendations
    const recommendations = neuralOrchestrationEngine.getModelRecommendations(requirements);
    
    // Determine if ensemble would be used
    const useEnsemble = neuralOrchestrationEngine.shouldUseEnsemble(requirements, recommendations);
    
    // Log the allocation test event using the builder pattern
    // EXPLICIT BOUNDARY: Event creation and processing begins here
    await metaCognitiveEngine.processEvent(
      new MetaCognitiveEventBuilder()
        .withId(uuidv4())
        .withNodeId(uuidv4()) 
        .withType("task-allocation-test")
        .withCreatedAt(new Date())
        .withDescription(`Task allocation test for ${requirements.taskType}`)
        .withDetails({
          requirements,
          recommendationCount: recommendations.length,
          topRecommendation: recommendations.length > 0 ? recommendations[0].modelType : null,
          useEnsemble,
          processingTime: null // Now included in details instead
        })
        .withConfidence(recommendations.length > 0 ? recommendations[0].confidence : 0.5)
        .withImpact(4)
        .withRelatedEvents([]) // Builder handles empty array conversion to 'none'
        .withOutcome(undefined)
        .withSourceContext({
          source: 'api',
          operation: 'task-allocation-test'
        }) // Converts to "api:task-allocation-test"
        .build()
    );
    
    // Return the task allocation analysis
    res.json({
      taskType: requirements.taskType,
      recommendations,
      useEnsemble,
      ensembleReason: useEnsemble ? determineEnsembleReason(requirements, recommendations) : null,
      createdAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error in task allocation test:', error);
    res.status(500).json({ error: 'Failed to test task allocation' });
  }
});

// Helper function to determine ensemble reason
function determineEnsembleReason(
  requirements: TaskRequirements,
  recommendations: Array<{
    modelType: ModelType;
    score: number;
    confidence: number;
    reason: string;
    capabilities: string[];
  }>
): string {
  if (requirements.complexity > 8) {
    return "High task complexity requires multiple models";
  }
  
  if (requirements.qualityThreshold && requirements.qualityThreshold > 0.9) {
    return "High quality threshold requires ensemble approach";
  }
  
  if (recommendations[0].confidence < 0.8) {
    return "Low confidence in primary model recommendation";
  }
  
  if (recommendations.length >= 2) {
    const scoreDifference = recommendations[0].score - recommendations[1].score;
    if (scoreDifference < 0.5) {
      return "Close performance scores between top models";
    }
  }
  
  if (requirements.domainSpecificity > 8) {
    return "Highly domain-specific task requires specialized model combination";
  }
  
  return "Multiple factors requiring ensemble approach";
}

// GET /api/neural-orchestrator/evaluation-criteria
// Get all evaluation criteria and their descriptions
router.get('/evaluation-criteria', (req: Request, res: Response) => {
  try {
    // Create a map of evaluation criteria with descriptions
    const criteria = Object.keys(EvaluationCriteria)
      .filter(key => isNaN(Number(key))) // Filter out numeric keys
      .map(key => {
        return {
          name: key,
          value: EvaluationCriteria[key as keyof typeof EvaluationCriteria],
          description: getEvaluationCriteriaDescription(EvaluationCriteria[key as keyof typeof EvaluationCriteria])
        };
      });
    
    res.json(criteria);
  } catch (error) {
    console.error('Error getting evaluation criteria:', error);
    res.status(500).json({ error: 'Failed to get evaluation criteria' });
  }
});

// Helper function to get task type descriptions
function getTaskTypeDescription(taskType: TaskType): string {
  const descriptions: Record<TaskType, string> = {
    [TaskType.TEXT_GENERATION]: 'Generate natural language text based on a prompt',
    [TaskType.CODE_GENERATION]: 'Write code in a specified programming language',
    [TaskType.REASONING]: 'Use logical reasoning to solve problems or answer questions',
    [TaskType.SUMMARIZATION]: 'Create concise summaries of longer texts',
    [TaskType.TRANSLATION]: 'Translate text from one language to another',
    [TaskType.CREATIVE_WRITING]: 'Generate creative content like stories or articles',
    [TaskType.POETRY]: 'Create poems in various styles and formats',
    [TaskType.STORY_TELLING]: 'Craft narrative stories with characters and plot',
    [TaskType.MATHEMATICS]: 'Solve mathematical problems and equations',
    [TaskType.SCIENTIFIC_ANALYSIS]: 'Analyze scientific data or concepts',
    [TaskType.DOMAIN_SPECIFIC]: 'Tasks within a specific knowledge domain or field',
    [TaskType.IMAGE_UNDERSTANDING]: 'Comprehend and describe the content of images',
    [TaskType.AUDIO_UNDERSTANDING]: 'Process and analyze audio content',
    [TaskType.INSTRUCTION_FOLLOWING]: 'Follow complex multi-step instructions precisely',
    [TaskType.TOOL_USAGE]: 'Use external tools and APIs to accomplish tasks',
    [TaskType.PLANNING]: 'Create structured plans to achieve objectives',
    [TaskType.META_COGNITION]: 'Reflect on reasoning processes and improve them'
  };
  
  return descriptions[taskType] || 'No description available';
}

// Helper function to get evaluation criteria descriptions
function getEvaluationCriteriaDescription(criterion: EvaluationCriteria): string {
  const descriptions: Record<EvaluationCriteria, string> = {
    [EvaluationCriteria.ACCURACY]: 'Correctness and factual validity of the output',
    [EvaluationCriteria.CREATIVITY]: 'Originality and novelty of ideas in the output',
    [EvaluationCriteria.SPEED]: 'Processing time and response latency',
    [EvaluationCriteria.CONSISTENCY]: 'Reliability and predictability of outputs',
    [EvaluationCriteria.DETAIL]: 'Level of specific information and elaboration provided',
    [EvaluationCriteria.FORMAT_ADHERENCE]: 'Compliance with requested output formats',
    [EvaluationCriteria.CONTEXT_AWARENESS]: 'Understanding and incorporating contextual information',
    [EvaluationCriteria.INSTRUCTION_FOLLOWING]: 'Ability to precisely follow given instructions',
    [EvaluationCriteria.REASONING]: 'Quality of logical thought processes and deductions',
    [EvaluationCriteria.BREVITY]: 'Conciseness and efficiency of expression',
    [EvaluationCriteria.TOOL_USAGE]: 'Effectiveness in using external tools and APIs',
    [EvaluationCriteria.EFFICIENCY]: 'Computational efficiency and resource usage',
    [EvaluationCriteria.CODE_QUALITY]: 'Clarity, organization, and maintainability of code',
    [EvaluationCriteria.EXPLANATION]: 'Quality of explanations for reasoning or methods',
    [EvaluationCriteria.COHERENCE]: 'Logical flow and connectedness of ideas',
    [EvaluationCriteria.ENGAGEMENT]: 'Ability to maintain reader interest and attention',
    [EvaluationCriteria.ADHERENCE_TO_CONSTRAINTS]: 'Following specific requirements or limitations',
    [EvaluationCriteria.SIMPLIFICATION]: 'Ability to make complex concepts understandable',
    [EvaluationCriteria.CLARITY]: 'Clear and unambiguous communication',
    [EvaluationCriteria.COMPLETENESS]: 'Comprehensive coverage of all relevant aspects'
  };
  
  return descriptions[criterion] || 'No description available';
}