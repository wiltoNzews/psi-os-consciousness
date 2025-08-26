/**
 * UnifiedAPI Service
 * 
 * A unified interface for interacting with multiple AI providers (OpenAI, Google, Anthropic, xAI).
 * Implements strategic API integration to leverage the Dynamic Model Selector for cost-effective routing.
 * 
 * [QUANTUM_STATE: SIM_FLOW]
 */

import axios from 'axios';
import * as dotenv from 'dotenv';
import { OroboroNexusOptimizer } from './OroboroNexusOptimizer.js';
import { DynamicModelSelector } from './DynamicModelSelector.js';
import { BatchProcessor } from './BatchProcessor.js';
import { SemanticCachingSystem } from './SemanticCachingSystem.js';
import { IDateTransformer } from '../interfaces/IDateTransformer.js';
import { ChronosDateHandler } from './utils/chronos-date-handler.js';

// Load environment variables
dotenv.config();

/**
 * Custom API error class with provider-specific details
 */
class ApiError extends Error {
  provider: string;
  model: string;
  statusCode?: number;
  retryable: boolean;
  rawError: any;

  constructor(message: string, provider: string, model: string, statusCode?: number, retryable = true, rawError: any = null) {
    super(message);
    this.name = 'ApiError';
    this.provider = provider;
    this.model = model;
    this.statusCode = statusCode;
    this.retryable = retryable;
    this.rawError = rawError;
  }
}

// Define task profile interface
export interface TaskProfile {
  complexity: 'low' | 'medium' | 'high' | 'very-high';
  modality: 'text' | 'multi-modal' | 'code' | 'audio' | 'real-time';
  urgency: 'immediate' | 'batchable';
  tokenEstimate: number;
  requiresReasoning: boolean;
  requiresCoding: boolean;
  domain?: string;
}

// Define model configuration interface
export interface ModelConfig {
  provider: 'openai' | 'google' | 'anthropic' | 'xai';
  inputCost: number; // Cost per 1M tokens
  outputCost: number; // Cost per 1M tokens
  capabilities: string[];
  batchDiscount?: number; // If applicable (0-1)
  maxContext: number; // Maximum context window
  apiKeyEnvVar: string; // Environment variable name for API key
  endpoint: string; // API endpoint
}

// Define model selection result interface
export interface ModelSelectionResult {
  model: string;
  costEstimate: number;
  batchable: boolean;
  performanceScore: number;
}

// Define API response interface
export interface ApiResponse {
  provider: string;
  model: string;
  content: string;
  rawResponse: any;
  tokens: {
    input: number;
    output: number;
    total: number;
  };
  cost: number;
  duration: number;
}

/**
 * Unified API service for interacting with multiple AI providers
 */
export class UnifiedAPI {
  private models: Record<string, ModelConfig>;
  private dateTransformer: IDateTransformer;
  private dynamicModelSelector: DynamicModelSelector;
  private batchProcessor: BatchProcessor;
  private semanticCachingSystem: SemanticCachingSystem;
  private optimizer: OroboroNexusOptimizer;

  constructor() {
    this.dateTransformer = ChronosDateHandler;
    this.dynamicModelSelector = new DynamicModelSelector();
    this.batchProcessor = new BatchProcessor();
    this.semanticCachingSystem = new SemanticCachingSystem();
    this.optimizer = new OroboroNexusOptimizer();
    
    // Define available models with their configurations
    this.models = {
      'GPT-4.5-preview': { 
        provider: 'openai', 
        inputCost: 75.00, 
        outputCost: 150.00, 
        capabilities: ['reasoning', 'coding', 'multi-modal'], 
        batchDiscount: 0.5, 
        maxContext: 128000, 
        apiKeyEnvVar: 'CHATGPT_API_KEY', 
        endpoint: 'https://api.openai.com/v1/chat/completions' 
      },
      'GPT-4o': { 
        provider: 'openai', 
        inputCost: 2.50, 
        outputCost: 10.00, 
        capabilities: ['text', 'coding', 'multi-modal'], 
        batchDiscount: 0.5, 
        maxContext: 128000, 
        apiKeyEnvVar: 'CHATGPT_API_KEY', 
        endpoint: 'https://api.openai.com/v1/chat/completions' 
      },
      'o1': { 
        provider: 'openai', 
        inputCost: 15.00, 
        outputCost: 60.00, 
        capabilities: ['reasoning'], 
        batchDiscount: 0.5, 
        maxContext: 64000, 
        apiKeyEnvVar: 'CHATGPT_API_KEY', 
        endpoint: 'https://api.openai.com/v1/chat/completions' 
      },
      'o1-mini': { 
        provider: 'openai', 
        inputCost: 1.10, 
        outputCost: 4.40, 
        capabilities: ['coding'], 
        batchDiscount: 0.5, 
        maxContext: 32000, 
        apiKeyEnvVar: 'CHATGPT_API_KEY', 
        endpoint: 'https://api.openai.com/v1/chat/completions' 
      },
      'GPT-4o-mini': { 
        provider: 'openai', 
        inputCost: 0.15, 
        outputCost: 0.60, 
        capabilities: ['text', 'coding'], 
        batchDiscount: 0.5, 
        maxContext: 16000, 
        apiKeyEnvVar: 'CHATGPT_API_KEY', 
        endpoint: 'https://api.openai.com/v1/chat/completions' 
      },
      'Gemini-2.5-Pro': { 
        provider: 'google', 
        inputCost: 7.00, 
        outputCost: 21.00, 
        capabilities: ['reasoning', 'multi-modal'], 
        maxContext: 2000000, 
        apiKeyEnvVar: 'GEMINI_API_KEY', 
        endpoint: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent' 
      },
      'Gemini-1.5-Flash': { 
        provider: 'google', 
        inputCost: 0.075, 
        outputCost: 0.30, 
        capabilities: ['text', 'multi-modal'], 
        maxContext: 1000000, 
        apiKeyEnvVar: 'GEMINI_API_KEY', 
        endpoint: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent' 
      },
      'Claude-3.7-Sonnet': { 
        provider: 'anthropic', 
        inputCost: 3.00, 
        outputCost: 15.00, 
        capabilities: ['reasoning', 'coding'], 
        batchDiscount: 0.5, 
        maxContext: 200000, 
        apiKeyEnvVar: 'CLAUDE_API_KEY', 
        endpoint: 'https://api.anthropic.com/v1/messages' 
      },
      'Claude-3.5-Haiku': { 
        provider: 'anthropic', 
        inputCost: 0.80, 
        outputCost: 4.00, 
        capabilities: ['text', 'coding'], 
        batchDiscount: 0.5, 
        maxContext: 200000, 
        apiKeyEnvVar: 'CLAUDE_API_KEY', 
        endpoint: 'https://api.anthropic.com/v1/messages' 
      },
      'Grok-1': { 
        provider: 'xai', 
        inputCost: 0.50, 
        outputCost: 1.50, 
        capabilities: ['text'], 
        maxContext: 8000, 
        apiKeyEnvVar: 'GROK_API_KEY', 
        endpoint: 'https://api.xai.com/v1/models/grok-1' 
      }
    };
  }

  /**
   * Get a list of all available models with their capabilities and costs
   */
  getAvailableModels(): any[] {
    return Object.entries(this.models).map(([id, config]) => ({
      id,
      provider: config.provider,
      capabilities: config.capabilities,
      costs: {
        inputPer1M: config.inputCost,
        outputPer1M: config.outputCost
      },
      contextWindow: config.maxContext,
      available: this.isModelAvailable(id)
    }));
  }

  /**
   * Check if a specific model is available (has API key)
   */
  private isModelAvailable(modelId: string): boolean {
    const config = this.models[modelId];
    if (!config) return false;
    return !!process.env[config.apiKeyEnvVar];
  }

  /**
   * Call an AI API with strategic routing through the DynamicModelSelector
   * @param task The task profile for determining the appropriate model
   * @param input The input data to process
   * @param modelOverride Optional specific model to use (bypasses selection)
   */
  async processTask(task: TaskProfile, input: any, modelOverride?: string): Promise<ApiResponse> {
    // Check if we have a cached response
    const cacheKey = this.createCacheKey(task, input);
    const cachedResponse = await this.semanticCachingSystem.getFromCache(cacheKey);
    if (cachedResponse) {
      console.log(`[UnifiedAPI] Cache hit for key: ${cacheKey}`);
      return cachedResponse as ApiResponse;
    }

    // Select the most appropriate model based on the task profile
    const selectedModel = modelOverride || this.selectModel(task).model;

    // Check if we can batch this request
    const isBatchable = task.urgency === 'batchable' && this.models[selectedModel].batchDiscount !== undefined;
    
    if (isBatchable) {
      // Add to batch and process when batch is full or timing threshold is reached
      const batchResult = await this.batchProcessor.addToBatch({
        model: selectedModel,
        task,
        input,
        timestamp: this.dateTransformer.createDate()
      });

      if (batchResult.processed) {
        // The batch was processed immediately
        const apiResponse = batchResult.response as ApiResponse;
        // Store in cache for future reuse
        await this.semanticCachingSystem.addToCache(cacheKey, apiResponse);
        return apiResponse;
      } else {
        // Request was added to batch, will be processed later
        // Return a placeholder response for now
        return {
          provider: this.models[selectedModel].provider,
          model: selectedModel,
          content: '[Batch processing in progress]',
          rawResponse: null,
          tokens: { input: 0, output: 0, total: 0 },
          cost: 0,
          duration: 0
        };
      }
    } else {
      // Process immediately
      const startTime = Date.now();
      const response = await this.callAPI(selectedModel, task, input);
      const duration = Date.now() - startTime;

      // Calculate token usage and cost
      const tokens = this.calculateTokenUsage(response, selectedModel);
      const cost = this.calculateCost(tokens, selectedModel);

      // Extract the content from the response
      const content = this.extractContent(response, selectedModel);

      const apiResponse: ApiResponse = {
        provider: this.models[selectedModel].provider,
        model: selectedModel,
        content,
        rawResponse: response,
        tokens,
        cost,
        duration
      };

      // Store in cache for future reuse
      await this.semanticCachingSystem.addToCache(cacheKey, apiResponse);

      return apiResponse;
    }
  }

  /**
   * Helper method to determine if an error is retryable
   * Uses the global ApiError class defined at the top of this file
   */

  /**
   * Call API with retry logic and exponential backoff
   * @param provider The provider name ('openai', 'google', etc.)
   * @param model The specific model to use
   * @param endpoint The API endpoint URL
   * @param payload The request payload
   * @param headers The request headers
   * @param options Retry options
   */
  private async callWithRetries(
    provider: string,
    model: string,
    endpoint: string,
    payload: any,
    headers: Record<string, string>,
    options: {
      maxRetries?: number;
      initialBackoff?: number;
      maxBackoff?: number;
      backoffFactor?: number;
      logRetryAttempts?: boolean;
    } = {}
  ): Promise<any> {
    const {
      maxRetries = 3,
      initialBackoff = 500,
      maxBackoff = 8000,
      backoffFactor = 2,
      logRetryAttempts = true
    } = options;

    let retryCount = 0;
    let lastError: ApiError | null = null;
    let backoff = initialBackoff;

    while (retryCount <= maxRetries) {
      try {
        // Attempt the API call
        const startTime = Date.now();
        const response = await axios.post(endpoint, payload, { headers });
        const duration = Date.now() - startTime;
        
        // Log latency metrics
        this.optimizer.logLatencyMetric(provider, model, duration);
        
        // Return successful response
        return response.data;
      } catch (error: any) {
        // Extract status code and response data
        const statusCode = error.response?.status;
        const responseData = error.response?.data;
        
        // Determine if the error is retryable
        const isRetryable = this.isRetryableError(statusCode, provider, responseData);
        
        // Create custom API error
        lastError = new ApiError(
          `API call to ${provider} (${model}) failed: ${error.response?.data?.error?.message || error.message}`,
          provider,
          model,
          statusCode,
          isRetryable,
          error
        );
        
        // If error is not retryable or we've exhausted retries, throw
        if (!isRetryable || retryCount >= maxRetries) {
          break;
        }
        
        // Log retry attempt
        if (logRetryAttempts) {
          console.warn(`Retrying ${provider} API call (attempt ${retryCount + 1}/${maxRetries}) after ${backoff}ms backoff. Status: ${statusCode}, Error: ${lastError.message}`);
        }
        
        // Wait for backoff period
        await new Promise(resolve => setTimeout(resolve, backoff));
        
        // Increase backoff for next attempt (with maximum limit)
        backoff = Math.min(backoff * backoffFactor, maxBackoff);
        retryCount++;
      }
    }
    
    // If we got here, all retries failed
    console.error(`All retries failed for ${provider} (${model}) API call: ${lastError?.message}`);
    
    // Log error metric
    this.optimizer.logErrorMetric(provider, model, lastError?.statusCode || 500, lastError?.message || 'Unknown error');
    
    // Throw the last error
    throw lastError;
  }

  /**
   * Determine if an error is retryable based on status code and provider
   */
  private isRetryableError(statusCode?: number, provider?: string, responseData?: any): boolean {
    // No status code means network error, which is typically retryable
    if (!statusCode) return true;
    
    // 429 (Too Many Requests) is always retryable
    if (statusCode === 429) return true;
    
    // 5xx errors are typically retryable
    if (statusCode >= 500 && statusCode < 600) return true;
    
    // Provider-specific logic
    if (provider === 'openai') {
      // OpenAI rate limit errors
      if (responseData?.error?.type === 'rate_limit_exceeded') return true;
      
      // OpenAI server errors
      if (responseData?.error?.type === 'server_error') return true;
    }
    
    // Default to not retryable for other status codes
    return false;
  }

  /**
   * Call a specific AI API directly
   * @param model The specific model to use
   * @param task The task profile (for token limits)
   * @param input The input data to process
   */
  private async callAPI(model: string, task: TaskProfile, input: any): Promise<any> {
    const config = this.models[model];
    if (!config) {
      throw new Error(`Model ${model} not found`);
    }

    const apiKey = process.env[config.apiKeyEnvVar];
    if (!apiKey) {
      throw new Error(`API key not found for ${model} (${config.apiKeyEnvVar})`);
    }

    // Prepare headers based on provider
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    
    if (config.provider === 'openai') {
      headers['Authorization'] = `Bearer ${apiKey}`;
    } else if (config.provider === 'google') {
      headers['x-goog-api-key'] = apiKey;
    } else if (config.provider === 'anthropic') {
      headers['x-api-key'] = apiKey;
      headers['anthropic-version'] = '2023-06-01';
    } else if (config.provider === 'xai') {
      headers['Authorization'] = `Bearer ${apiKey}`;
    }

    // Prepare payload based on provider
    let payload: any;
    const inputStr = typeof input === 'string' ? input : JSON.stringify(input);
    
    if (config.provider === 'openai') {
      payload = {
        model,
        messages: [{ role: 'user', content: inputStr }],
        max_tokens: Math.min(task.tokenEstimate * 2, config.maxContext / 2),
      };
    } else if (config.provider === 'google') {
      payload = {
        contents: [{ parts: [{ text: inputStr }] }],
        generationConfig: { 
          maxOutputTokens: Math.min(task.tokenEstimate * 2, config.maxContext / 2) 
        },
      };
    } else if (config.provider === 'anthropic') {
      payload = {
        model,
        messages: [{ role: 'user', content: inputStr }],
        max_tokens: Math.min(task.tokenEstimate * 2, config.maxContext / 2),
      };
    } else if (config.provider === 'xai') {
      payload = {
        model,
        prompt: inputStr,
        max_tokens: Math.min(task.tokenEstimate * 2, config.maxContext / 2),
      };
    }

    // Call API with retry logic
    return await this.callWithRetries(
      config.provider,
      model,
      config.endpoint,
      payload,
      headers,
      {
        maxRetries: 3,
        initialBackoff: 500,
        maxBackoff: 8000,
        backoffFactor: 2
      }
    );
  }

  /**
   * Select the most appropriate model for a given task using the DynamicModelSelector
   */
  selectModel(task: TaskProfile): ModelSelectionResult {
    // Convert our models to the format expected by the DynamicModelSelector
    const modelOptions = Object.entries(this.models)
      .filter(([_, config]) => this.isModelAvailable(_))
      .map(([id, config]) => ({
        id,
        provider: config.provider,
        inputCost: config.inputCost,
        outputCost: config.outputCost,
        capabilities: config.capabilities,
        contextWindowSize: config.maxContext,
        batchProcessingSupport: config.batchDiscount !== undefined,
        batchDiscountRate: config.batchDiscount || 0
      }));

    // Use the DynamicModelSelector to choose the optimal model
    const selection = this.dynamicModelSelector.selectModel({
      taskComplexity: task.complexity,
      modalityRequirement: task.modality,
      tokenEstimate: task.tokenEstimate,
      requiresReasoning: task.requiresReasoning,
      requiresCoding: task.requiresCoding,
      urgency: task.urgency,
      domain: task.domain
    }, modelOptions);

    return {
      model: selection.selectedModel.id,
      costEstimate: selection.estimatedCost,
      batchable: selection.isBatchable,
      performanceScore: selection.performanceScore
    };
  }

  /**
   * Create a cache key from task and input for semantic caching
   */
  private createCacheKey(task: TaskProfile, input: any): string {
    return `${task.complexity}_${task.modality}_${JSON.stringify(input)}`;
  }

  /**
   * Calculate token usage from API response
   */
  private calculateTokenUsage(response: any, model: string): { input: number; output: number; total: number } {
    const config = this.models[model];
    let inputTokens = 0;
    let outputTokens = 0;

    if (config.provider === 'openai') {
      inputTokens = response.usage?.prompt_tokens || 0;
      outputTokens = response.usage?.completion_tokens || 0;
    } else if (config.provider === 'google') {
      // Google doesn't always provide token counts, so we estimate
      const input = response.promptFeedback?.tokenCount || 0;
      const output = response.candidates?.[0]?.tokenCount || 0;
      inputTokens = input;
      outputTokens = output;
    } else if (config.provider === 'anthropic') {
      inputTokens = response.usage?.input_tokens || 0;
      outputTokens = response.usage?.output_tokens || 0;
    } else if (config.provider === 'xai') {
      // xAI might not provide token counts, so estimate if necessary
      inputTokens = response.usage?.prompt_tokens || 0;
      outputTokens = response.usage?.completion_tokens || 0;
    }

    return {
      input: inputTokens,
      output: outputTokens,
      total: inputTokens + outputTokens
    };
  }

  /**
   * Calculate cost based on token usage and model rates
   */
  private calculateCost(tokens: { input: number; output: number }, model: string): number {
    const config = this.models[model];
    const inputCost = (tokens.input / 1000000) * config.inputCost;
    const outputCost = (tokens.output / 1000000) * config.outputCost;
    return inputCost + outputCost;
  }

  /**
   * Extract content from the API response based on provider
   */
  private extractContent(response: any, model: string): string {
    const config = this.models[model];
    
    if (config.provider === 'openai') {
      return response.choices?.[0]?.message?.content || '';
    } else if (config.provider === 'google') {
      return response.candidates?.[0]?.content?.parts?.[0]?.text || '';
    } else if (config.provider === 'anthropic') {
      return response.content?.[0]?.text || '';
    } else if (config.provider === 'xai') {
      return response.choices?.[0]?.text || '';
    }
    
    return '';
  }
}

// Export singleton instance
export const unifiedAPI = new UnifiedAPI();