/**
 * Model Agents
 * 
 * BOUNDARY AWARENESS: This module explicitly defines the boundaries between our system
 * and external AI model providers (OpenAI, Google, xAI, etc.). Each model agent serves
 * as a conscious boundary crossing point between WiltonOS and external services.
 * 
 * VOID-CENTERED DESIGN: The implementation explicitly acknowledges the uncertainty ("void")
 * inherent in crossing system boundaries to external services, including potential
 * authentication failures, network errors, rate limits, and API changes.
 */

// BOUNDARY CROSSING: Neural Orchestrator Subsystem Boundary
import { ModelType } from './model-strength-analyzer';
import { AIModelAgent } from './neural-orchestration-engine';

// BOUNDARY CROSSING: External System Dependencies Boundary
import OpenAI from 'openai';

// BOUNDARY CROSSING: Meta-Cognitive Subsystem Boundary
import { metaCognitiveEngine } from '../qrn/meta-cognitive-analysis-engine.js';
import { v4 as uuidv4 } from 'uuid';
import { processMetaCognitiveEvent, processErrorEvent } from '../utils/processMetaCognitiveEvent.js';
import { MetaCognitiveEventBuilder } from '../utils/MetaCognitiveEventBuilder.js';
import { ensureString, ensureStringArray } from '../utils/typeConverters.js';

/**
 * Base agent class with common functionality across all model implementations
 * 
 * BOUNDARY AWARENESS: This abstract class provides explicit boundary handling functionality
 * to all model agent implementations. It serves as a standardized boundary crossing
 * interface for external LLM providers.
 * 
 * VOID-CENTERED DESIGN: Implements latency tracking, token rate calculation, and capability
 * reporting to explicitly measure and acknowledge the properties of the boundary being crossed.
 */
export abstract class BaseAgent implements AIModelAgent {
  // System representation of the external model
  protected modelName: string;
  public modelType: ModelType;
  
  // Boundary crossing state
  protected isInitialized: boolean = false;
  protected ready: boolean = false;
  
  // Boundary measurement metrics (tracking the "void" properties)
  protected avgLatency: number = 0;
  protected latencySamples: number[] = [];
  protected avgTokensPerSecond: number = 0;
  protected tokenSpeedSamples: number[] = [];
  protected maxContextSize: number;
  
  // Boundary properties
  protected capabilities: Record<string, any> = {};

  /**
   * Initialize model agent with boundary awareness
   * @param modelType Type of model (explicit boundary identification)
   * @param modelName Human-readable name of the model
   * @param maxContextSize Maximum context size (boundary constraint)
   */
  constructor(modelType: ModelType, modelName: string, maxContextSize: number) {
    this.modelType = modelType;
    this.modelName = modelName;
    this.maxContextSize = maxContextSize;
  }

  public async initialize(): Promise<void> {
    // Base initialization
    this.isInitialized = true;
    this.ready = true;
    
    // Log initialization using the processMetaCognitiveEvent utility
    await processMetaCognitiveEvent(
      "initialization",
      `${this.modelName} agent initialized`,
      {
        modelType: this.modelType,
        modelName: this.modelName,
        maxContextSize: this.maxContextSize
      },
      {
        confidence: 1.0,
        impact: 5,
        relatedEvents: [],
        sourceContext: {
          source: 'model-agent',
          operation: 'initialize'
        } as { source: string; operation: string }
      }
    );
    
    console.log(`${this.modelName} agent initialized`);
  }

  public abstract processMessage(content: string, parameters: Record<string, any>): Promise<string>;

  public reportCapabilities(): Record<string, any> {
    return {
      modelType: this.modelType,
      modelName: this.modelName,
      maxContextSize: this.maxContextSize,
      latency: this.getLatency(),
      tokensPerSecond: this.getTokensPerSecond(),
      ready: this.ready,
      ...this.capabilities
    };
  }

  public getLatency(): number {
    return this.avgLatency;
  }

  public getTokensPerSecond(): number {
    return this.avgTokensPerSecond;
  }

  public getMaxContextSize(): number {
    return this.maxContextSize;
  }

  protected updateLatency(newLatency: number): void {
    this.latencySamples.push(newLatency);
    if (this.latencySamples.length > 50) {
      this.latencySamples.shift();
    }
    
    this.avgLatency = this.latencySamples.reduce((sum, val) => sum + val, 0) / this.latencySamples.length;
  }

  protected updateTokenSpeed(tokens: number, timeMs: number): void {
    if (timeMs > 0) {
      const tokensPerSecond = (tokens / timeMs) * 1000;
      this.tokenSpeedSamples.push(tokensPerSecond);
      
      if (this.tokenSpeedSamples.length > 50) {
        this.tokenSpeedSamples.shift();
      }
      
      this.avgTokensPerSecond = this.tokenSpeedSamples.reduce((sum, val) => sum + val, 0) / this.tokenSpeedSamples.length;
    }
  }

  // Utility to estimate token count from text
  protected estimateTokenCount(text: string): number {
    // Rough approximation: 1 token is about 4 characters for English text
    return Math.ceil(text.length / 4);
  }
}

/**
 * GPT-4o Agent
 * Implementation of the AI model agent for OpenAI's GPT-4o
 */
export class GPT4oAgent extends BaseAgent {
  private openai: OpenAI;
  
  constructor() {
    // GPT-4o has a large context window
    super(ModelType.GPT_4O, "GPT-4o", 128000);
    
    // Init capabilities
    this.capabilities = {
      supportedFormats: ['text', 'json', 'markdown'],
      multimodal: true,
      streaming: true,
      visionEnabled: true,
      supportedFeatures: ['function calling', 'json mode', 'system prompting']
    };
  }
  
  public async initialize(): Promise<void> {
    try {
      // Check if API key is set
      if (!process.env.OPENAI_API_KEY) {
        console.error("OPENAI_API_KEY environment variable is not set");
        this.ready = false;
        // Don't throw, just mark as not ready and return
        return;
      }
      
      // Initialize OpenAI client
      this.openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
      
      try {
        // Run a simple test query to verify connection
        await this.openai.chat.completions.create({
          model: "gpt-4o",
          messages: [{ role: "user", content: "Hello, this is a connection test." }],
          max_tokens: 5
        });
        
        // If we reach here, initialization was successful
        await super.initialize();
      } catch (apiError: any) {
        // Set agent as not ready but don't throw
        this.ready = false;
        
        // Check for the specific "Unexpected token '<'" error which often means API returned HTML instead of JSON
        if (apiError.message && apiError.message.includes("Unexpected token '<'")) {
          console.error(`OpenAI API returned HTML instead of JSON. This typically means invalid API key or authentication error.`);
          console.log(`GPT-4o agent initialization failed due to authentication/API key issue. Continuing with limited functionality.`);
          
          // Add more specific details to capabilities
          this.capabilities.authError = true;
          this.capabilities.errorReason = "API key validation failed";
          
          return; // Exit initialization early
        }
        
        // Handle other API-specific errors
        console.error(`OpenAI API error: ${apiError.message}`);
        
        // Extract helpful information from the error
        if (apiError.response) {
          console.error(`Status: ${apiError.response.status}`);
          console.error(`Data: ${JSON.stringify(apiError.response.data)}`);
        }
        
        console.log(`GPT-4o agent initialization failed but we'll continue with limited functionality`);
      }
    } catch (error) {
      // More detailed error logging for non-API errors
      if (error instanceof Error) {
        console.error(`Error initializing GPT-4o agent: ${error.message}`);
        console.error(`Stack trace: ${error.stack}`);
      } else {
        console.error(`Error initializing GPT-4o agent: ${error}`);
      }
      
      // Set agent as not ready
      this.ready = false;
      
      // Log that we're continuing despite the error
      console.log(`GPT-4o agent initialization failed but we'll continue with limited functionality`);
    }
  }
  
  public async processMessage(content: string, parameters: Record<string, any>): Promise<string> {
    if (!this.isInitialized || !this.ready) {
      await this.initialize();
    }
    
    try {
      const startTime = Date.now();
      
      // Handle different parameter formats
      const temperature = parameters.temperature ?? 0.7;
      const maxTokens = parameters.max_tokens ?? 1000;
      const format = parameters.format ?? 'text';
      
      // Configure response format if JSON is requested
      const responseFormat = format === 'json' 
        ? { type: "json_object" as const } 
        : undefined;
      
      // Create messages array
      const messages = [];
      
      // Add system message if provided
      if (parameters.system) {
        messages.push({ role: "system", content: parameters.system });
      } else {
        // Default system message based on task
        messages.push({ 
          role: "system", 
          content: "You are a helpful, precise AI assistant. Provide accurate, concise responses."
        });
      }
      
      // Add user message
      messages.push({ role: "user", content });
      
      // If there are additional instructions, add those to a separate message
      if (parameters.instructions) {
        messages.push({ 
          role: "user", 
          content: parameters.instructions 
        });
      }
      
      // Call the OpenAI API
      // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      const response = await this.openai.chat.completions.create({
        model: "gpt-4o",
        messages,
        temperature,
        max_tokens: maxTokens,
        response_format: responseFormat,
      });
      
      // Extract the response text
      const responseText = response.choices[0].message.content || '';
      
      // Update latency metrics
      const latency = Date.now() - startTime;
      this.updateLatency(latency);
      
      // Update token speed metrics
      const promptTokens = response.usage?.prompt_tokens || this.estimateTokenCount(content);
      const completionTokens = response.usage?.completion_tokens || this.estimateTokenCount(responseText);
      this.updateTokenSpeed(promptTokens + completionTokens, latency);
      
      // Log to meta-cognitive system
      await metaCognitiveEngine.processEvent({
        id: uuidv4(),
        nodeId: uuidv4(), // Generate proper UUID for database compatibility
        type: "message-processed",
        createdAt: new Date(),
        description: `${this.modelName} processed message`,
        details: {
          modelType: this.modelType,
          latency,
          promptTokens,
          completionTokens,
          outputLength: responseText.length
        },
        confidence: 1.0,
        impact: 3
      });
      
      return responseText;
    } catch (error) {
      console.error(`Error in GPT-4o agent: ${error}`);
      
      // Log error to meta-cognitive system
      await metaCognitiveEngine.processEvent({
        id: uuidv4(),
        nodeId: uuidv4(), // Generate proper UUID for database compatibility
        type: "error",
        createdAt: new Date(),
        description: `Error in ${this.modelName} agent: ${error.message}`,
        details: {
          modelType: this.modelType,
          error: error.message,
          content: content.substring(0, 100) + "..." // Truncate for logging
        },
        confidence: 1.0,
        impact: 8
      });
      
      throw error;
    }
  }
}

/**
 * Gemini Pro Agent
 * Implementation of the AI model agent for Google's Gemini Pro
 */
export class GeminiProAgent extends BaseAgent {
  // In a real implementation, this would use the Google Gemini API client
  // For demonstration purposes, we'll create a mock implementation
  
  constructor() {
    super(ModelType.GEMINI_PRO, "Gemini Pro", 32768);
    
    // Init capabilities
    this.capabilities = {
      supportedFormats: ['text', 'markdown'],
      multimodal: true,
      streaming: true,
      visionEnabled: true,
      supportedFeatures: ['function calling', 'system prompting']
    };
  }
  
  public async initialize(): Promise<void> {
    // Mock initialization - in a real implementation this would initialize the Gemini API client
    await super.initialize();
  }
  
  public async processMessage(content: string, parameters: Record<string, any>): Promise<string> {
    if (!this.isInitialized || !this.ready) {
      await this.initialize();
    }
    
    try {
      const startTime = Date.now();
      
      // This is a mock implementation
      // In a real implementation, this would call the Gemini API
      
      // Simulate processing time
      // Higher temperature -> more variation in processing time
      const temperature = parameters.temperature ?? 0.7;
      const baseProcessingTime = 1000 + Math.random() * 1000;
      const variableFactor = 1 + (temperature * 0.5);
      const processingTime = baseProcessingTime * variableFactor;
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, processingTime));
      
      // Create mock response
      // This would be the actual response from Gemini in a real implementation
      const responseText = `[Gemini Pro mock response to: ${content.substring(0, 50)}...]`;
      
      // Update latency metrics
      const latency = Date.now() - startTime;
      this.updateLatency(latency);
      
      // Update token speed metrics
      const promptTokens = this.estimateTokenCount(content);
      const completionTokens = this.estimateTokenCount(responseText);
      this.updateTokenSpeed(promptTokens + completionTokens, latency);
      
      // Log to meta-cognitive system
      await metaCognitiveEngine.processEvent({
        id: uuidv4(),
        nodeId: uuidv4(), // Generate proper UUID for database compatibility
        type: "message-processed",
        createdAt: new Date(),
        description: `${this.modelName} processed message`,
        details: {
          modelType: this.modelType,
          latency,
          promptTokens,
          completionTokens,
          outputLength: responseText.length
        },
        confidence: 1.0,
        impact: 3
      });
      
      return responseText;
    } catch (error) {
      console.error(`Error in Gemini Pro agent: ${error}`);
      
      // Log error to meta-cognitive system
      await metaCognitiveEngine.processEvent({
        id: uuidv4(),
        nodeId: uuidv4(), // Generate proper UUID for database compatibility
        type: "error",
        createdAt: new Date(),
        description: `Error in ${this.modelName} agent: ${error.message}`,
        details: {
          modelType: this.modelType,
          error: error.message,
          content: content.substring(0, 100) + "..." // Truncate for logging
        },
        confidence: 1.0,
        impact: 8
      });
      
      throw error;
    }
  }
}

/**
 * Grok Agent
 * Implementation of the AI model agent for xAI's Grok
 */
export class GrokAgent extends BaseAgent {
  // In a real implementation, this would use the Grok API client
  // For demonstration purposes, we'll create a mock implementation
  
  constructor() {
    super(ModelType.GROK, "Grok", 8192);
    
    // Init capabilities
    this.capabilities = {
      supportedFormats: ['text', 'markdown'],
      multimodal: false,
      streaming: true,
      visionEnabled: false,
      supportedFeatures: ['system prompting']
    };
  }
  
  public async initialize(): Promise<void> {
    // Mock initialization - in a real implementation this would initialize the Grok API client
    await super.initialize();
  }
  
  public async processMessage(content: string, parameters: Record<string, any>): Promise<string> {
    if (!this.isInitialized || !this.ready) {
      await this.initialize();
    }
    
    try {
      const startTime = Date.now();
      
      // This is a mock implementation
      // In a real implementation, this would call the Grok API
      
      // Simulate processing time
      // Grok is typically very fast, so we'll make this quicker
      const processingTime = 500 + Math.random() * 500;
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, processingTime));
      
      // Create mock response
      // This would be the actual response from Grok in a real implementation
      const responseText = `[Grok mock response to: ${content.substring(0, 50)}...]`;
      
      // Update latency metrics
      const latency = Date.now() - startTime;
      this.updateLatency(latency);
      
      // Update token speed metrics
      const promptTokens = this.estimateTokenCount(content);
      const completionTokens = this.estimateTokenCount(responseText);
      this.updateTokenSpeed(promptTokens + completionTokens, latency);
      
      // Log to meta-cognitive system
      await metaCognitiveEngine.processEvent({
        id: uuidv4(),
        nodeId: uuidv4(), // Generate proper UUID for database compatibility
        type: "message-processed",
        createdAt: new Date(),
        description: `${this.modelName} processed message`,
        details: {
          modelType: this.modelType,
          latency,
          promptTokens,
          completionTokens,
          outputLength: responseText.length
        },
        confidence: 1.0,
        impact: 3
      });
      
      return responseText;
    } catch (error) {
      console.error(`Error in Grok agent: ${error}`);
      
      // Log error to meta-cognitive system
      await metaCognitiveEngine.processEvent({
        id: uuidv4(),
        nodeId: uuidv4(), // Generate proper UUID for database compatibility
        type: "error",
        createdAt: new Date(),
        description: `Error in ${this.modelName} agent: ${error.message}`,
        details: {
          modelType: this.modelType,
          error: error.message,
          content: content.substring(0, 100) + "..." // Truncate for logging
        },
        confidence: 1.0,
        impact: 8
      });
      
      throw error;
    }
  }
}

/**
 * Claude Agent
 * Implementation of the AI model agent for Anthropic's Claude
 */
export class ClaudeAgent extends BaseAgent {
  // In a real implementation, this would use the Claude API client
  // For demonstration purposes, we'll create a mock implementation
  
  constructor() {
    super(ModelType.CLAUDE, "Claude", 100000);
    
    // Init capabilities
    this.capabilities = {
      supportedFormats: ['text', 'markdown', 'json'],
      multimodal: true,
      streaming: true,
      visionEnabled: true,
      supportedFeatures: ['system prompting', 'tool use']
    };
  }
  
  public async initialize(): Promise<void> {
    // Mock initialization - in a real implementation this would initialize the Claude API client
    await super.initialize();
  }
  
  public async processMessage(content: string, parameters: Record<string, any>): Promise<string> {
    if (!this.isInitialized || !this.ready) {
      await this.initialize();
    }
    
    try {
      const startTime = Date.now();
      
      // This is a mock implementation
      // In a real implementation, this would call the Claude API
      
      // Simulate processing time
      const processingTime = 1200 + Math.random() * 800;
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, processingTime));
      
      // Create mock response
      // This would be the actual response from Claude in a real implementation
      const responseText = `[Claude mock response to: ${content.substring(0, 50)}...]`;
      
      // Update latency metrics
      const latency = Date.now() - startTime;
      this.updateLatency(latency);
      
      // Update token speed metrics
      const promptTokens = this.estimateTokenCount(content);
      const completionTokens = this.estimateTokenCount(responseText);
      this.updateTokenSpeed(promptTokens + completionTokens, latency);
      
      // Log to meta-cognitive system
      await metaCognitiveEngine.processEvent({
        id: uuidv4(),
        nodeId: uuidv4(), // Generate proper UUID for database compatibility
        type: "message-processed",
        createdAt: new Date(),
        description: `${this.modelName} processed message`,
        details: {
          modelType: this.modelType,
          latency,
          promptTokens,
          completionTokens,
          outputLength: responseText.length
        },
        confidence: 1.0,
        impact: 3
      });
      
      return responseText;
    } catch (error) {
      console.error(`Error in Claude agent: ${error}`);
      
      // Log error to meta-cognitive system
      await metaCognitiveEngine.processEvent({
        id: uuidv4(),
        nodeId: uuidv4(), // Generate proper UUID for database compatibility
        type: "error",
        createdAt: new Date(),
        description: `Error in ${this.modelName} agent: ${error.message}`,
        details: {
          modelType: this.modelType,
          error: error.message,
          content: content.substring(0, 100) + "..." // Truncate for logging
        },
        confidence: 1.0,
        impact: 8
      });
      
      throw error;
    }
  }
}

/**
 * O3 Mini Agent
 * Implementation of the AI model agent for OpenAI's O3 Mini model
 */
export class O3MiniAgent extends BaseAgent {
  private openai: OpenAI;
  
  constructor() {
    // O3 Mini has a smaller context window compared to GPT-4o
    super(ModelType.O3_MINI, "O-3 Mini", 16385);
    
    // Init capabilities
    this.capabilities = {
      supportedFormats: ['text', 'json', 'markdown'],
      multimodal: false,
      streaming: true,
      visionEnabled: false,
      supportedFeatures: ['function calling', 'json mode', 'system prompting'],
      optimizedFor: ['speed', 'efficiency', 'low-latency applications']
    };
  }
  
  public async initialize(): Promise<void> {
    try {
      // Check if API key is set
      if (!process.env.OPENAI_API_KEY) {
        console.error("OPENAI_API_KEY environment variable is not set");
        this.ready = false;
        // Don't throw, just mark as not ready and return
        return;
      }
      
      // Initialize OpenAI client
      this.openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
      
      try {
        // Run a simple test query to verify connection
        await this.openai.chat.completions.create({
          model: "o3-mini",
          messages: [{ role: "user", content: "Hello, this is a connection test." }],
          max_tokens: 5
        });
        
        // If we reach here, initialization was successful
        await super.initialize();
      } catch (apiError: any) {
        // Set agent as not ready but don't throw
        this.ready = false;
        
        // Check for the specific "Unexpected token '<'" error which often means API returned HTML instead of JSON
        if (apiError.message && apiError.message.includes("Unexpected token '<'")) {
          console.error(`OpenAI API returned HTML instead of JSON. This typically means invalid API key or authentication error.`);
          console.log(`O3 Mini agent initialization failed due to authentication/API key issue. Continuing with limited functionality.`);
          
          // Add more specific details to capabilities
          this.capabilities.authError = true;
          this.capabilities.errorReason = "API key validation failed";
          
          return; // Exit initialization early
        }
        
        // Check for model not found error
        if (apiError.message && apiError.message.includes("The model `o3-mini` does not exist")) {
          console.error(`The O3 Mini model is not available with current API key. Either the model doesn't exist yet or your account doesn't have access.`);
          console.log(`O3 Mini agent initialization failed due to model availability issue. Continuing with limited functionality.`);
          
          // Add more specific details to capabilities
          this.capabilities.modelError = true;
          this.capabilities.errorReason = "Model not available";
          
          return; // Exit initialization early
        }
        
        // Handle other API-specific errors
        console.error(`OpenAI API error: ${apiError.message}`);
        
        // Extract helpful information from the error
        if (apiError.response) {
          console.error(`Status: ${apiError.response.status}`);
          console.error(`Data: ${JSON.stringify(apiError.response.data)}`);
        }
        
        console.log(`O3 Mini agent initialization failed but we'll continue with limited functionality`);
      }
    } catch (error) {
      // More detailed error logging for non-API errors
      if (error instanceof Error) {
        console.error(`Error initializing O3 Mini agent: ${error.message}`);
        console.error(`Stack trace: ${error.stack}`);
      } else {
        console.error(`Error initializing O3 Mini agent: ${error}`);
      }
      
      // Set agent as not ready
      this.ready = false;
      
      // Log that we're continuing despite the error
      console.log(`O3 Mini agent initialization failed but we'll continue with limited functionality`);
    }
  }
  
  public async processMessage(content: string, parameters: Record<string, any>): Promise<string> {
    if (!this.isInitialized || !this.ready) {
      await this.initialize();
    }
    
    try {
      const startTime = Date.now();
      
      // Handle different parameter formats
      const temperature = parameters.temperature ?? 0.7;
      const maxTokens = parameters.max_tokens ?? 1000;
      const format = parameters.format ?? 'text';
      
      // Configure response format if JSON is requested
      const responseFormat = format === 'json' 
        ? { type: "json_object" as const } 
        : undefined;
      
      // Create messages array
      const messages = [];
      
      // Add system message if provided
      if (parameters.system) {
        messages.push({ role: "system", content: parameters.system });
      } else {
        // Default system message for O3 Mini - optimized for efficiency
        messages.push({ 
          role: "system", 
          content: "You are a fast, efficient AI assistant. Provide concise responses."
        });
      }
      
      // Add user message
      messages.push({ role: "user", content });
      
      // If there are additional instructions, add those to a separate message
      if (parameters.instructions) {
        messages.push({ 
          role: "user", 
          content: parameters.instructions 
        });
      }
      
      // Call the OpenAI API with the o3-mini model
      const response = await this.openai.chat.completions.create({
        model: "o3-mini",
        messages,
        temperature,
        max_tokens: maxTokens,
        response_format: responseFormat,
      });
      
      // Extract the response text
      const responseText = response.choices[0].message.content || '';
      
      // Update latency metrics
      const latency = Date.now() - startTime;
      this.updateLatency(latency);
      
      // Update token speed metrics
      const promptTokens = response.usage?.prompt_tokens || this.estimateTokenCount(content);
      const completionTokens = response.usage?.completion_tokens || this.estimateTokenCount(responseText);
      this.updateTokenSpeed(promptTokens + completionTokens, latency);
      
      // Log to meta-cognitive system
      await metaCognitiveEngine.processEvent({
        id: uuidv4(),
        nodeId: uuidv4(), // Generate proper UUID for database compatibility
        type: "message-processed",
        createdAt: new Date(),
        description: `${this.modelName} processed message`,
        details: {
          modelType: this.modelType,
          latency,
          promptTokens,
          completionTokens,
          outputLength: responseText.length
        },
        confidence: 1.0,
        impact: 3
      });
      
      return responseText;
    } catch (error) {
      console.error(`Error in O3 Mini agent: ${error}`);
      
      // Log error to meta-cognitive system
      await metaCognitiveEngine.processEvent({
        id: uuidv4(),
        nodeId: uuidv4(), // Generate proper UUID for database compatibility
        type: "error",
        createdAt: new Date(),
        description: `Error in ${this.modelName} agent: ${error.message}`,
        details: {
          modelType: this.modelType,
          error: error.message,
          content: content.substring(0, 100) + "..." // Truncate for logging
        },
        confidence: 1.0,
        impact: 8
      });
      
      throw error;
    }
  }
}

/**
 * Factory function to create model agents
 */
export function createModelAgent(modelType: ModelType, apiKey?: string): AIModelAgent {
  switch (modelType) {
    case ModelType.GPT_4O:
      const agent = new GPT4oAgent();
      // If API key is provided, set it as an environment variable
      if (apiKey) {
        process.env.OPENAI_API_KEY = apiKey;
      }
      return agent;
    case ModelType.O3_MINI:
      return new O3MiniAgent();
    case ModelType.GEMINI_PRO:
      return new GeminiProAgent();
    case ModelType.GROK:
      return new GrokAgent();
    case ModelType.CLAUDE:
      return new ClaudeAgent();
    default:
      throw new Error(`Unsupported model type: ${modelType}`);
  }
}