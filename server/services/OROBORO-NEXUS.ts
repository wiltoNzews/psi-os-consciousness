/**
 * OROBORO NEXUS Integration
 * 
 * A recursive meta-cognitive processing system that integrates the 
 * recursive depth of OROBORO with universal, viral-ready clarity of NEXUS,
 * crowned by the emotionally resonant "Ascend" at stage 8.
 * 
 * [QUANTUM_STATE: SIM_FLOW]
 */

import { EnhancedMockPersistenceLayer } from '../tests/mocks/enhanced-mock-persistence-layer.js';
import { DateTransformer } from './utils/DateTransformer.js';
import { MetaCognitiveEventBuilder } from './utils/MetaCognitiveEventBuilder.js';
import { unifiedAPI, TaskProfile } from './UnifiedAPI.js';
import { log } from '../vite.js';
import { openAIClientManager } from './openai-client-manager.js';
import { storage } from '../storage.js';

class OROBORO_NEXUS {
  private persistence = new EnhancedMockPersistenceLayer();
  private state: { [key: string]: any } = {};
  private timers: { [key: string]: number } = {};
  private budgets: { [key: string]: number } = {
    '0-Start': 100, 
    '1-Define': 200, 
    '2-Store': 300, 
    '3-Split': 200,
    '4-Process': 5000, 
    '5-Engage': 1000, 
    '6-Verify': 500, 
    '7-Tune': 500, 
    '8-Ascend': 1000
  };
  private isReady: boolean = false;
  
  constructor() {
    // Check API connection on startup
    this.validateApiConnection();
  }
  
  /**
   * Validate the OpenAI API connection
   */
  async validateApiConnection(): Promise<boolean> {
    try {
      const isConnected = await openAIClientManager.validateConnection();
      this.isReady = isConnected;
      if (isConnected) {
        log('OROBORO NEXUS: OpenAI API connection validated successfully', 'system');
      } else {
        log('OROBORO NEXUS: OpenAI API connection validation failed', 'error');
      }
      return isConnected;
    } catch (error) {
      log(`OROBORO NEXUS: API validation error: ${error instanceof Error ? error.message : 'Unknown error'}`, 'error');
      this.isReady = false;
      return false;
    }
  }

  /**
   * Run the OROBORO NEXUS processing pipeline
   * 
   * @param input Any input data to process
   * @returns The processed output with timing metrics
   */
  async run(input: any): Promise<any> {
    log('OROBORO NEXUS: Starting pipeline processing', 'system');
    
    if (!this.isReady) {
      try {
        await this.validateApiConnection();
      } catch (error) {
        log(`OROBORO NEXUS: Error validating API connection: ${error instanceof Error ? error.message : 'Unknown error'}`, 'error');
      }
    }
    
    this.timers['0-Start'] = Date.now();
    
    // Initialize the state
    await this.step('0-Start', () => {
      this.state = { 
        input, 
        startTime: new Date(), 
        intent: 'init',
        apiReady: this.isReady
      };
    });
    
    // Define the agents based on input
    await this.step('1-Define', () => {
      this.state.agents = this.defineAgents(input);
      return this.state.agents; // Return value will be captured
    });
    
    // Persist the state
    await this.step('2-Store', async () => {
      return await this.persistence.save('state', this.state);
    });
    
    // Split input into chunks
    await this.step('3-Split', () => {
      this.state.chunks = this.split(this.state.input);
      return this.state.chunks;
    });
    
    // Process the chunks (this is asynchronous) with reasoning or action
    await this.step('4-Process', async () => {
      return await this.process(this.state);
    });
    
    // Engage with the results
    await this.step('5-Engage', () => {
      this.state.output = this.engage(this.state.result);
      return this.state.output;
    });
    
    // Verify the output
    await this.step('6-Verify', () => {
      this.verify(this.state.output);
      return { verified: true };
    });
    
    // Tune based on results
    await this.step('7-Tune', () => {
      this.tune(this.state);
      return { tuned: true };
    });
    
    // Ascend to a higher level of insight
    await this.step('8-Ascend', () => {
      this.ascend(this.state);
      return { ascended: true };
    });
    
    this.timers['end'] = Date.now();
    const totalTime = this.timers['end'] - this.timers['0-Start'];
    
    log(`OROBORO NEXUS: Pipeline processing completed in ${totalTime}ms`, 'system');
    
    // Return the final output with timing metrics
    return { 
      ...this.state.output, 
      timings: this.timers,
      totalTime,
      apiUsed: this.isReady
    };
  }

  /**
   * Execute a single step in the OROBORO NEXUS pipeline with timing and logging
   * 
   * @param name The name of the step
   * @param action The action to perform
   */
  private async step(name: string, action: () => Promise<any> | void): Promise<void> {
    this.timers[name] = Date.now();
    try {
      // Execute the action, handling both synchronous and asynchronous actions
      const result = action();
      if (result instanceof Promise) {
        this.state.result = await result;
      }
      
      const duration = Date.now() - this.timers[name];
      const event = new MetaCognitiveEventBuilder()
        .withSourceAgent('OROBORO_NEXUS')
        .withTargetAgent(name)
        .withObjective(`Execute ${name}`)
        .withContent(JSON.stringify(this.state))
        .withMetadata({ intent: this.state.intent || 'process', duration })
        .build();
      
      await this.persistence.save(`event-${name}-${event.id}`, event);
      
      if (duration > this.budgets[name]) {
        console.warn(`🚨 ${name} exceeded budget: ${duration}ms > ${this.budgets[name]}ms`);
      }
    } catch (e) {
      await this.handleError(name, e as Error);
    }
  }

  /**
   * Define agents based on the input data characteristics
   */
  private defineAgents(input: any): any { 
    return { 
      zews: { 
        role: input.stats?.reach > 400000 ? 'reason' : 'act' 
      } 
    }; 
  }
  
  /**
   * Split input data into manageable chunks
   */
  private split(data: any): any[] { 
    return Object.keys(data).map(key => ({ [key]: data[key] })); 
  }
  
  /**
   * Process the data using either reasoning or action approach
   */
  private async process(state: any): Promise<any> {
    state.intent = state.agents.zews.role === 'reason' ? 'reasoned' : 'acted';
    
    try {
      // Adding system log about API usage
      log(`OROBORO NEXUS: Processing with ${state.agents.zews.role} approach using OpenAI API`, 'system');
      
      if (state.agents.zews.role === 'reason') {
        // Use chain of thought reasoning for detailed analysis
        return await this.chainOfThought(state.chunks);
      } else {
        // Use chain of action for action-focused processing
        return await this.chainOfAction(state.chunks);
      }
    } catch (error) {
      log(`OROBORO NEXUS: Error in processing: ${error instanceof Error ? error.message : 'Unknown error'}`, 'error');
      
      // Fallback to non-API processing if error occurs
      if (state.agents.zews.role === 'reason') {
        return state.chunks.map(c => ({ 
          reasoning: `Fallback analysis of ${JSON.stringify(c).substring(0, 100)}...`, 
          result: c,
          error: true
        }));
      } else {
        return { 
          actionPlan: `Fallback action plan generation`, 
          result: state.chunks,
          error: true
        };
      }
    }
  }
  
  /**
   * Apply chain-of-thought reasoning to each chunk using OpenAI API
   */
  private async chainOfThought(chunks: any[]): Promise<any> {
    if (!this.isReady) {
      log('OROBORO NEXUS: OpenAI API not ready, using fallback processing', 'warning');
      return chunks.map(c => ({ 
        reasoning: `Analyzed ${JSON.stringify(c)}`, 
        result: c 
      }));
    }
    
    try {
      // Map chunks to promises that process each chunk
      const processedChunksPromises = chunks.map(async (chunk) => {
        const taskProfile: TaskProfile = {
          complexity: 'high',
          modality: 'text',
          urgency: 'immediate',
          tokenEstimate: 1000,
          requiresReasoning: true,
          requiresCoding: false,
          domain: 'analysis'
        };
        
        const input = `Analyze the following data with chain-of-thought reasoning:\n${JSON.stringify(chunk, null, 2)}\n\nProvide detailed reasoning and insights.`;
        
        try {
          const response = await unifiedAPI.processTask(taskProfile, input);
          return {
            reasoning: response.content,
            result: chunk,
            modelUsed: response.model,
            cost: response.cost,
            tokens: response.tokens
          };
        } catch (error) {
          log(`Error processing chunk with OpenAI: ${error instanceof Error ? error.message : 'Unknown error'}`, 'error');
          return {
            reasoning: `Error analyzing: ${error instanceof Error ? error.message : 'Unknown error'}`,
            result: chunk,
            error: true
          };
        }
      });
      
      // Wait for all chunks to be processed
      const processedChunks = await Promise.all(processedChunksPromises);
      return processedChunks;
    } catch (error) {
      log(`Error in chainOfThought: ${error instanceof Error ? error.message : 'Unknown error'}`, 'error');
      return chunks.map(c => ({ 
        reasoning: `Fallback analysis due to error: ${error instanceof Error ? error.message : 'Unknown error'}`, 
        result: c,
        error: true
      }));
    }
  }
  
  /**
   * Apply chain-of-action processing to chunks using OpenAI API
   */
  private async chainOfAction(chunks: any[]): Promise<any> {
    if (!this.isReady) {
      log('OROBORO NEXUS: OpenAI API not ready, using fallback processing', 'warning');
      return { result: chunks };
    }
    
    try {
      // For action mode, process all chunks as a single batch
      const taskProfile: TaskProfile = {
        complexity: 'medium',
        modality: 'text',
        urgency: 'immediate',
        tokenEstimate: 800,
        requiresReasoning: false,
        requiresCoding: false,
        domain: 'action'
      };
      
      const input = `Process the following data and determine optimal actions:\n${JSON.stringify(chunks, null, 2)}\n\nProvide a concise action plan.`;
      
      try {
        const response = await unifiedAPI.processTask(taskProfile, input);
        return {
          actionPlan: response.content,
          result: chunks,
          modelUsed: response.model,
          cost: response.cost,
          tokens: response.tokens
        };
      } catch (error) {
        log(`Error processing chunks with OpenAI: ${error instanceof Error ? error.message : 'Unknown error'}`, 'error');
        return {
          actionPlan: `Error generating action plan: ${error instanceof Error ? error.message : 'Unknown error'}`,
          result: chunks,
          error: true
        };
      }
    } catch (error) {
      log(`Error in chainOfAction: ${error instanceof Error ? error.message : 'Unknown error'}`, 'error');
      return { 
        actionPlan: `Fallback action plan due to error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        result: chunks,
        error: true
      };
    }
  }
  
  /**
   * Engage with the processed results to create output
   */
  private engage(result: any): any { 
    return { 
      response: result, 
      timestamp: new Date() 
    }; 
  }
  
  /**
   * Verify the output is valid
   */
  private verify(output: any): void { 
    if (!output.response) throw new Error('Invalid output'); 
  }
  
  /**
   * Tune the state based on results
   */
  private tune(state: any): void { 
    state.tuned = true; 
  }
  
  /**
   * Ascend the output to a higher level of insight
   */
  private ascend(state: any): void {
    state.output = {
      ...state.output,
      enhanced: `${state.output.response[0]?.result?.stats?.reach || 'Done'} viewers + Ascended: Zews' Major Legacy`
    };
  }
  
  /**
   * Handle errors in the pipeline
   */
  private async handleError(step: string, error: Error): Promise<void> {
    const event = new MetaCognitiveEventBuilder()
      .withType('system:error')
      .withSourceAgent('OROBORO_NEXUS')
      .withTargetAgent(step)
      .withObjective(`Error in ${step}`)
      .withContent(error.message)
      .withMetadata({ intent: 'error', duration: Date.now() - this.timers[step] })
      .build();
    
    await this.persistence.save(`error-${step}-${event.id}`, event);
    
    if (step !== '7-Tune') {
      await this.step('7-Tune', () => this.tune(this.state));
    } else {
      throw error;
    }
  }
  
  /**
   * Process a job from storage by ID
   * 
   * @param jobId The ID of the job to process
   * @returns The processed job result
   */
  async processJob(jobId: string): Promise<any> {
    try {
      log(`OROBORO NEXUS: Starting job processing for job ID: ${jobId}`, 'system');
      
      // Retrieve the job from storage
      const job = await storage.getNexusJob(jobId);
      
      if (!job) {
        throw new Error(`Job with ID ${jobId} not found`);
      }
      
      // Update job status to in_progress
      await storage.updateNexusJob(jobId, { 
        status: 'in_progress',
        updatedAt: new Date()
      });
      
      // Initialize job progress
      await storage.updateNexusJobProgress(jobId, '0-Start', 0);
      
      // Process the job input through the OROBORO NEXUS pipeline
      const result = await this.run(job.input);
      
      // Update job with results
      await storage.updateNexusJob(jobId, {
        status: 'completed',
        output: result,
        updatedAt: new Date()
      });
      
      // Final progress update
      await storage.updateNexusJobProgress(jobId, '8-Ascend', 100);
      
      log(`OROBORO NEXUS: Completed job processing for job ID: ${jobId}`, 'system');
      return result;
    } catch (error) {
      log(`OROBORO NEXUS: Error processing job ${jobId}: ${error instanceof Error ? error.message : 'Unknown error'}`, 'error');
      
      // Update job status to failed
      await storage.updateNexusJob(jobId, {
        status: 'failed',
        error: error instanceof Error ? error.message : 'Unknown error',
        updatedAt: new Date()
      });
      
      throw error;
    }
  }
}

export const oroboroNexus = new OROBORO_NEXUS();