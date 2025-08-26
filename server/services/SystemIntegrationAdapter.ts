/**
 * System Integration Adapter
 * 
 * This module serves as the central hub for coordinating communication between
 * all components of the Neural-Symbiotic Orchestration Platform. It ensures that
 * the Meta-Cognitive Analysis Engine, QRN Context Manager, Neural Orchestration Engine,
 * and Adaptive Resonance Service all operate as a single unified system.
 */

import { metaCognitiveEngine, PatternType, InsightSeverity } from './qrn/index.js';
import { neuralOrchestrationEngine } from './neural-orchestrator/neural-orchestration-engine.js';
import { qrnContextManager } from './qrn/qrn-context-manager.js';
import { adaptiveResonanceService } from './qrn/adaptive-resonance-service.js';
import { modelStrengthAnalyzer, ModelType } from './neural-orchestrator/model-strength-analyzer.js';
import { createModelAgent } from './neural-orchestrator/model-agents.js';
import * as openaiService from './openai.js';
import { log } from '../vite.js';
import { v4 as uuidv4 } from 'uuid';

// Event bus for internal communication
type EventCallback = (data: any) => void;
const eventBus = new Map<string, Set<EventCallback>>();

class SystemIntegrationAdapter {
  private static instance: SystemIntegrationAdapter;
  private activeQrnId: string | null = null;
  private systemState: Record<string, any> = {
    status: 'initialized',
    components: {
      metaCognitiveEngine: 'ready',
      neuralOrchestrationEngine: 'ready',
      qrnContextManager: 'ready',
      adaptiveResonanceService: 'ready'
    },
    activeModels: [],
    metrics: {
      resonanceScore: 0,
      stabilityScore: 0,
      coherenceIndex: 0,
      adaptiveEfficency: 0
    },
    lastUpdated: new Date()
  };

  private constructor() {
    // Initialize component connections
    this.initializeComponentConnections();
  }

  public static getInstance(): SystemIntegrationAdapter {
    if (!SystemIntegrationAdapter.instance) {
      SystemIntegrationAdapter.instance = new SystemIntegrationAdapter();
    }
    return SystemIntegrationAdapter.instance;
  }

  /**
   * Initialize connections between all system components
   */
  private initializeComponentConnections(): void {
    // Subscribe to meta-cognitive events
    this.subscribe('meta-cognitive-event', (event) => {
      // Update system state with the latest meta-cognitive event
      this.systemState.lastMetaCognitiveEvent = event;
      this.systemState.lastUpdated = new Date();
      
      // Propagate the event to neural orchestration engine for potential actions
      this.emit('neural-orchestration-update', {
        type: 'meta-cognitive-event',
        data: event
      });
    });
    
    // Subscribe to neural pathway updates
    this.subscribe('neural-pathway-update', (pathway) => {
      // Update system state with the latest neural pathway information
      if (!this.systemState.activePaths) {
        this.systemState.activePaths = [];
      }
      
      const existingIndex = this.systemState.activePaths.findIndex(
        (p: any) => p.id === pathway.id
      );
      
      if (existingIndex >= 0) {
        this.systemState.activePaths[existingIndex] = pathway;
      } else {
        this.systemState.activePaths.push(pathway);
      }
      
      this.systemState.lastUpdated = new Date();
      
      // Notify meta-cognitive engine about the neural pathway update
      this.emit('meta-cognitive-update', {
        type: 'neural-pathway-change',
        data: pathway
      });
    });
    
    // Subscribe to QRN updates
    this.subscribe('qrn-update', (node) => {
      // Update system state with the latest QRN information
      this.systemState.activeQrn = node;
      this.activeQrnId = node.id;
      this.systemState.lastUpdated = new Date();
      
      // Propagate QRN update to both engines
      this.emit('meta-cognitive-update', {
        type: 'qrn-change',
        data: node
      });
      
      this.emit('neural-orchestration-update', {
        type: 'qrn-change',
        data: node
      });
    });
    
    // Subscribe to system status updates to broadcast to all clients
    this.subscribe('system-status-updated', async (data) => {
      // Import the broadcast function from events module
      try {
        const { broadcastSystemStatus } = await import('./events.js');
        
        // Call the broadcast function to update all UI clients
        broadcastSystemStatus();
        
        log(`Broadcasting system status update to all clients (${data.type})`, 'SystemIntegrationAdapter');
      } catch (error) {
        console.error('Error broadcasting system status:', error);
      }
    });
    
    // Log initialization success
    log('System Integration Adapter initialized and components connected', 'SystemIntegrationAdapter');
  }

  /**
   * Subscribe to an event
   */
  public subscribe(event: string, callback: EventCallback): void {
    if (!eventBus.has(event)) {
      eventBus.set(event, new Set());
    }
    eventBus.get(event)?.add(callback);
  }

  /**
   * Unsubscribe from an event
   */
  public unsubscribe(event: string, callback: EventCallback): void {
    if (eventBus.has(event)) {
      eventBus.get(event)?.delete(callback);
    }
  }

  /**
   * Emit an event
   */
  public emit(event: string, data: any): void {
    if (eventBus.has(event)) {
      eventBus.get(event)?.forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Error in ${event} event handler:`, error);
        }
      });
    }
  }

  /**
   * Process a task using appropriate engines based on task type
   */
  public async processTask(task: any): Promise<any> {
    try {
      // Generate task ID if not provided
      if (!task.id) {
        task.id = uuidv4();
      }
      
      // Determine which components need to process this task
      const requiresMetaCognitive = ['analyze', 'pattern_detection', 'insight'].includes(task.type);
      const requiresNeuralOrchestration = ['chunking', 'processing', 'recomposition'].includes(task.type);
      const requiresResonance = task.type === 'resonance_calculation';
      const requiresOpenAI = task.type === 'ai_interaction';
      
      // Create a unified task context with current system state
      const taskContext = {
        systemState: this.systemState,
        activeQrnId: this.activeQrnId,
        timestamp: new Date()
      };
      
      // Process the task through required components
      let result: any = { success: false };
      
      if (requiresMetaCognitive) {
        const metaResult = await this.processMetaCognitiveTask(task, taskContext);
        result = { ...result, ...metaResult, metaCognitiveProcessed: true };
      }
      
      if (requiresNeuralOrchestration) {
        const neuralResult = await this.processNeuralOrchestrationTask(task, taskContext);
        result = { ...result, ...neuralResult, neuralOrchestrationProcessed: true };
      }
      
      if (requiresResonance) {
        const resonanceResult = await this.processResonanceTask(task, taskContext);
        result = { ...result, ...resonanceResult, resonanceProcessed: true };
      }
      
      if (requiresOpenAI) {
        const aiResult = await this.processAITask(task, taskContext);
        result = { ...result, ...aiResult, aiProcessed: true };
      }
      
      // Mark task as successful if at least one component processed it
      result.success = result.metaCognitiveProcessed || 
                      result.neuralOrchestrationProcessed || 
                      result.resonanceProcessed ||
                      result.aiProcessed;
      
      // Update system state with task result
      this.updateSystemState({
        lastTaskProcessed: {
          id: task.id,
          type: task.type,
          timestamp: new Date(),
          success: result.success
        }
      });
      
      return result;
    } catch (error) {
      console.error('Error processing task in System Integration Adapter:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error in task processing'
      };
    }
  }

  /**
   * Process a task through the Meta-Cognitive Engine
   */
  private async processMetaCognitiveTask(task: any, context: any): Promise<any> {
    switch (task.type) {
      case 'analyze':
        // Process an analysis task through meta-cognitive engine
        return await metaCognitiveEngine.analyzeEvents(task.data);
      case 'pattern_detection':
        // Detect patterns in cognitive events
        return await metaCognitiveEngine.detectPatterns(task.data);
      case 'insight':
        // Generate insights from patterns
        return await metaCognitiveEngine.generateInsights(task.data);
      default:
        return { metaCognitiveProcessed: false };
    }
  }

  /**
   * Process a task through the Neural Orchestration Engine
   */
  private async processNeuralOrchestrationTask(task: any, context: any): Promise<any> {
    switch (task.type) {
      case 'chunking':
        // Process a chunking task
        return await neuralOrchestrationEngine.createChunks(task.data);
      case 'processing':
        // Process chunks
        return await neuralOrchestrationEngine.processChunks(task.data);
      case 'recomposition':
        // Recompose processed chunks
        return await neuralOrchestrationEngine.recomposeChunks(task.data);
      default:
        return { neuralOrchestrationProcessed: false };
    }
  }

  /**
   * Process a resonance calculation task
   */
  private async processResonanceTask(task: any, context: any): Promise<any> {
    if (task.type === 'resonance_calculation') {
      return await adaptiveResonanceService.calculateNodeResonance(
        task.data.sourceId,
        task.data.targetId
      );
    }
    return { resonanceProcessed: false };
  }

  /**
   * Process an AI interaction task using OpenAI
   */
  /**
   * Process an AI task using OpenAI integration
   * Enhanced with HTML token handling and error prevention
   * @param task The AI task to process
   * @param context Task context
   * @returns Processed AI result
   */
  private async processAITask(task: any, context: any): Promise<any> {
    try {
      // Pre-process inputs to ensure safe handling of HTML content
      let preprocessedTask = this.preprocessAITaskInputs(task);
      
      // Track metadata for better debugging
      const startTime = Date.now();
      const taskId = preprocessedTask.id || 'unknown-task';
      
      // Log the start of AI processing
      log(`Starting AI processing for task ${taskId} (type: ${preprocessedTask.data?.interaction})`, 'ai');
      
      // Process based on interaction type
      let result: any;
      switch (preprocessedTask.data.interaction) {
        case 'text_analysis':
          result = await openaiService.analyzeText(preprocessedTask.data.text);
          break;
        case 'image_analysis':
          result = await openaiService.analyzeImage(preprocessedTask.data.image);
          break;
        case 'augmentation_recommendations':
          result = await openaiService.generateAugmentationRecommendations(
            preprocessedTask.data.domain,
            preprocessedTask.data.humanContext
          );
          break;
        case 'symbiotic_response':
          result = await openaiService.generateSymbioticResponse(
            preprocessedTask.data.humanInput,
            preprocessedTask.data.domain
          );
          break;
        case 'concept_mapping':
          result = await openaiService.mapConceptualConnections(
            preprocessedTask.data.domain,
            preprocessedTask.data.concepts
          );
          break;
        default:
          return { 
            aiProcessed: false,
            error: 'Unknown AI interaction type',
            taskId
          };
      }
      
      // Calculate processing duration for system metrics
      const duration = Date.now() - startTime;
      
      // Log successful completion
      log(`AI processing completed for task ${taskId} in ${duration}ms`, 'ai');
      
      // Return enhanced result with metadata
      return {
        ...result,
        aiProcessed: true,
        taskId,
        processingTime: duration,
        timestamp: new Date()
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error in AI processing';
      console.error('Error in AI task processing:', error);
      
      // Log the error with additional context for debugging
      log(`AI processing error: ${errorMessage}`, 'error');
      
      // Emit event for error handling systems
      this.emit('ai-processing-error', {
        task: task.id || 'unknown',
        error: errorMessage,
        timestamp: new Date()
      });
      
      return {
        aiProcessed: false,
        error: errorMessage,
        errorDetails: error instanceof Error ? error.stack : undefined,
        taskId: task.id || 'unknown-task',
        timestamp: new Date()
      };
    }
  }
  
  /**
   * Preprocess AI task inputs to handle HTML tokens and prevent errors
   * @param task The original task
   * @returns Preprocessed task
   */
  private preprocessAITaskInputs(task: any): any {
    const processedTask = { ...task };
    
    // Create data object if it doesn't exist
    if (!processedTask.data) {
      processedTask.data = {};
    }
    
    // Handle HTML content in text fields
    if (processedTask.data.text) {
      processedTask.data.text = this.sanitizeHtmlContent(processedTask.data.text);
    }
    
    if (processedTask.data.humanContext) {
      processedTask.data.humanContext = this.sanitizeHtmlContent(processedTask.data.humanContext);
    }
    
    if (processedTask.data.humanInput) {
      processedTask.data.humanInput = this.sanitizeHtmlContent(processedTask.data.humanInput);
    }
    
    // Ensure concepts is always an array
    if (processedTask.data.concepts && !Array.isArray(processedTask.data.concepts)) {
      processedTask.data.concepts = [processedTask.data.concepts];
    }
    
    // Set defaults for domain if missing
    if (processedTask.data.domain && 
        !['finance', 'crypto', 'sports', 'general'].includes(processedTask.data.domain)) {
      processedTask.data.domain = 'general';
    }
    
    return processedTask;
  }
  
  /**
   * Sanitize HTML content to prevent token errors with OpenAI
   * @param content The content to sanitize
   * @returns Sanitized content
   */
  private sanitizeHtmlContent(content: string): string {
    if (!content) return '';
    
    // Replace problematic HTML token sequences that cause errors with OpenAI
    return content
      // Replace HTML entities with their character equivalents
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&apos;/g, "'")
      .replace(/&amp;/g, '&')
      // Replace script tags (potential security issue)
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '[script content removed]')
      // Replace other problematic HTML sequences
      .replace(/<!\[CDATA\[.*?\]\]>/g, '')
      .replace(/<!--.*?-->/g, '')
      // Limit content length to prevent token limit errors
      .substring(0, 32000);
  }

  /**
   * Initialize an AI model with comprehensive error handling
   * @param modelType The type of model to initialize (GPT_4O, GEMINI_PRO, etc.)
   * @param apiKey Optional API key (for models requiring external API access)
   * @param systemMetrics Optional system metrics for meta-cognitive enhancements
   * @returns Result of the initialization
   */
  public async initializeModel(
    modelType: ModelType, 
    apiKey?: string,
    systemMetrics?: {
      systemStability?: number;
      nodeSynergy?: number;
      globalCoherence?: number;
    }
  ): Promise<any> {
    log(`Initializing model: ${modelType}`, 'system');
    
    // Log meta-cognitive data if provided
    if (systemMetrics) {
      log(`With meta-cognitive metrics - Stability: ${systemMetrics.systemStability?.toFixed(2) || 'N/A'}, Synergy: ${systemMetrics.nodeSynergy?.toFixed(2) || 'N/A'}, Coherence: ${systemMetrics.globalCoherence?.toFixed(2) || 'N/A'}`, 'system');
    }
    
    try {
      // Special handling for OpenAI models to ensure proper API connectivity
      if (modelType === ModelType.GPT_4O) {
        // Use provided API key or fallback to environment variable
        const effectiveApiKey = apiKey || process.env.OPENAI_API_KEY;
        
        // Validate OpenAI API key presence
        if (!effectiveApiKey) {
          return {
            success: false,
            error: 'OpenAI API Key is required for GPT-4o initialization',
            requiresApiKey: true
          };
        }
        
        // Temporarily set the API key for validation if provided
        const originalApiKey = process.env.OPENAI_API_KEY;
        if (apiKey) {
          process.env.OPENAI_API_KEY = apiKey;
        }
        
        // Perform a simple test call to validate the OpenAI connection
        try {
          log(`Testing OpenAI connection for ${modelType}...`, 'system');
          
          // Use the openaiService to perform a simple validation
          await openaiService.validateApiConnection();
          
          log(`OpenAI API connection validated for ${modelType}`, 'system');
        } catch (openaiError) {
          // Restore original API key if needed
          if (apiKey && originalApiKey) {
            process.env.OPENAI_API_KEY = originalApiKey;
          }
          
          // Specific error handling for OpenAI connectivity issues
          console.error('OpenAI API error during model initialization:', openaiError);
          
          return {
            success: false,
            error: openaiError instanceof Error 
              ? `OpenAI API error: ${openaiError.message}` 
              : 'Unknown OpenAI API error',
            details: 'The system could not establish a valid connection to OpenAI API',
            requiresApiKey: true
          };
        }
      }
      
      // Create model agent using the imported createModelAgent function 
      const agent = createModelAgent(modelType, apiKey);
      
      if (!agent) {
        throw new Error(`Failed to create agent for model type: ${modelType}`);
      }
      
      // Handle any model-specific initialization
      await agent.initialize();
      
      // Register the model with the orchestration engine
      neuralOrchestrationEngine.registerAgent(agent);
      
      // Update system state with new model
      const existingModelIndex = this.systemState.activeModels.findIndex(
        (m: any) => m.type === modelType
      );
      
      if (existingModelIndex >= 0) {
        this.systemState.activeModels[existingModelIndex] = {
          type: modelType,
          status: 'ready',
          initialized: new Date()
        };
      } else {
        this.systemState.activeModels.push({
          type: modelType,
          status: 'ready',
          initialized: new Date()
        });
      }
      
      // Update the timestamp for tracking
      this.systemState.lastUpdated = new Date();
      
      // Notify other components about the new model
      this.emit('model-initialized', {
        modelType,
        timestamp: new Date()
      });
      
      // Add broadcast event for UI update
      this.emit('system-status-updated', {
        type: 'model_initialization',
        modelType,
        timestamp: new Date()
      });
      
      log(`Model ${modelType} successfully initialized`, 'system');
      
      return {
        success: true,
        model: {
          type: modelType,
          status: 'ready',
          initialized: new Date(),
          capabilities: agent.reportCapabilities ? agent.reportCapabilities() : null
        }
      };
    } catch (error) {
      console.error('Error initializing model:', error);
      
      // Log the error for monitoring
      log(`Model initialization failed for ${modelType}: ${error instanceof Error ? error.message : 'Unknown error'}`, 'error');
      
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error initializing model',
        details: error instanceof Error && error.stack ? error.stack : undefined
      };
    }
  }

  /**
   * Get the current system state
   */
  public getSystemState(): Record<string, any> {
    return { ...this.systemState, timestamp: new Date() };
  }

  /**
   * Update the system state
   */
  private updateSystemState(update: Record<string, any>): void {
    this.systemState = {
      ...this.systemState,
      ...update,
      lastUpdated: new Date()
    };
  }
}

// Export singleton instance
export const systemIntegrationAdapter = SystemIntegrationAdapter.getInstance();