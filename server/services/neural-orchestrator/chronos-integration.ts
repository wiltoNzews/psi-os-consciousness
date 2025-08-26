/**
 * ChronosNeuralIntegration - Neural Orchestration Integration with Chronos Time Management
 * 
 * This service integrates the Neural Orchestration Engine with the Chronos time management system,
 * ensuring synchronized temporal processing across the neural network simulation.
 * 
 * Following Void-Centered Design principles, this service explicitly acknowledges
 * the boundary between the neural processing domain and the time domain.
 */

import { chronos, ChronosTimestamp } from '../utils/chronos-handler.js';
import { fileStorage } from '../../db.js';
import { 
  initializeChronosQRNService, 
  getChronosQRNService 
} from '../qrn/chronos-qrn-service.js';
import { 
  initializeChronosTemporalInstanceService,
  getChronosTemporalInstanceService 
} from '../temporal/chronos-temporal-instance.js';

/**
 * ChronosNeuralIntegration manages the integration between the neural orchestration
 * engine and the Chronos time management system
 */
export class ChronosNeuralIntegration {
  private storage: any; // Using any temporarily to bypass type checking during refactoring
  private activeTasks: Map<string, {
    startTime: Date;
    startTick: number;
    startEpoch: number;
    scheduledCompletionEpoch?: number;
  }> = new Map();
  
  // System stability metrics
  private systemStability: number = 0.5;
  private nodeEfficiency: number = 0.5;
  private adaptiveCoherence: number = 0.5;
  private temporalConsistency: number = 0.5;
  
  // History of system metrics for trend analysis
  private metricsHistory: Array<{
    timestamp: Date;
    systemStability: number;
    nodeEfficiency: number;
    adaptiveCoherence: number;
    temporalConsistency: number;
  }> = [];
  
  constructor(storage: any) {
    this.storage = storage;
  }
  
  /**
   * Initialize the Chronos Neural Integration service
   */
  async initialize(): Promise<void> {
    console.log('Initializing ChronosNeuralIntegration...');
    
    // Initialize dependent Chronos services if not already initialized
    initializeChronosQRNService(this.storage);
    initializeChronosTemporalInstanceService(this.storage);
    
    // Register periodic system stability calculation
    chronos.registerTask(
      'neural-system-stability',
      100, // Every 100 ticks (5 seconds @ 20tps)
      timestamp => this.calculateSystemStability(timestamp)
    );
    
    // Register task cleanup
    chronos.registerTask(
      'neural-task-cleanup',
      200, // Every 200 ticks (10 seconds @ 20tps)
      timestamp => this.cleanupExpiredTasks(timestamp)
    );
    
    // Initial stability calculation
    await this.calculateInitialStability();
    
    console.log('ChronosNeuralIntegration initialized successfully');
  }
  
  /**
   * Register a neural orchestration task with Chronos
   * @param taskId Task ID to register
   * @param estimatedDuration Estimated duration in milliseconds (optional)
   * @returns True if successfully registered
   */
  registerTask(taskId: string, estimatedDuration?: number): boolean {
    try {
      const timestamp = chronos.now();
      
      // Calculate scheduled completion epoch if duration provided
      let scheduledCompletionEpoch: number | undefined = undefined;
      if (estimatedDuration) {
        const expectedTicks = Math.ceil(estimatedDuration / chronos.getTickInterval());
        const expectedEpochs = Math.floor(expectedTicks / chronos.getEpochDuration());
        scheduledCompletionEpoch = timestamp.epoch + expectedEpochs;
      }
      
      // Register the task
      this.activeTasks.set(taskId, {
        startTime: timestamp.time,
        startTick: timestamp.tick,
        startEpoch: timestamp.epoch,
        scheduledCompletionEpoch
      });
      
      console.log(`[Chronos] Registered neural task ${taskId} at epoch ${timestamp.epoch}, tick ${timestamp.tick}`);
      
      return true;
    } catch (error) {
      console.error(`Error registering neural task ${taskId}:`, error);
      return false;
    }
  }
  
  /**
   * Complete a neural orchestration task with Chronos
   * @param taskId Task ID to complete
   * @returns True if successfully completed
   */
  completeTask(taskId: string): boolean {
    try {
      // Get task data
      const taskData = this.activeTasks.get(taskId);
      if (!taskData) {
        console.warn(`[Chronos] Attempt to complete unknown task ${taskId}`);
        return false;
      }
      
      const timestamp = chronos.now();
      
      // Remove from active tasks
      this.activeTasks.delete(taskId);
      
      // Calculate task metrics
      const ticksElapsed = timestamp.tick - taskData.startTick;
      const timeElapsed = timestamp.time.getTime() - taskData.startTime.getTime();
      
      console.log(`[Chronos] Completed neural task ${taskId} at epoch ${timestamp.epoch}, tick ${timestamp.tick}`);
      console.log(`[Chronos] Task took ${ticksElapsed} ticks (${timeElapsed}ms)`);
      
      if (taskData.scheduledCompletionEpoch) {
        const onTime = timestamp.epoch <= taskData.scheduledCompletionEpoch;
        console.log(`[Chronos] Task completed ${onTime ? 'on time' : 'late'}`);
        
        // Adjust temporal consistency based on timeliness
        this.temporalConsistency = Math.max(0.1, Math.min(0.9, 
          this.temporalConsistency + (onTime ? 0.01 : -0.02)
        ));
      }
      
      return true;
    } catch (error) {
      console.error(`Error completing neural task ${taskId}:`, error);
      return false;
    }
  }
  
  /**
   * Get active task count
   * @returns Number of active tasks
   */
  getActiveTaskCount(): number {
    return this.activeTasks.size;
  }
  
  /**
   * Get current system metrics
   * @returns System metrics
   */
  async getSystemMetrics(): Promise<{
    systemStability: number;
    nodeEfficiency: number;
    adaptiveCoherence: number;
    temporalConsistency: number;
    activeTaskCount: number;
    metricsHistory: Array<any>;
  }> {
    return {
      systemStability: this.systemStability,
      nodeEfficiency: this.nodeEfficiency,
      adaptiveCoherence: this.adaptiveCoherence,
      temporalConsistency: this.temporalConsistency,
      activeTaskCount: this.activeTasks.size,
      metricsHistory: this.metricsHistory.slice(-10) // Last 10 entries
    };
  }
  
  /**
   * Calculate initial system stability
   */
  private async calculateInitialStability(): Promise<void> {
    try {
      // Get QRN service
      const qrnService = getChronosQRNService();
      
      // Get temporal service
      const temporalService = getChronosTemporalInstanceService();
      
      // Get all quantum root nodes
      const quantumRootNodes = await this.storage.getAllQuantumRootNodes(20);
      
      if (quantumRootNodes.length === 0) {
        // No nodes yet, use default values
        this.systemStability = 0.5;
        this.nodeEfficiency = 0.5;
        this.adaptiveCoherence = 0.5;
        return;
      }
      
      // Calculate node efficiency based on coherence scores
      let totalCoherence = 0;
      for (const node of quantumRootNodes) {
        totalCoherence += node.coherenceScore || 0.5;
      }
      this.nodeEfficiency = totalCoherence / quantumRootNodes.length;
      
      // Check for temporal instances
      const temporalInstances = await this.storage.getAllTemporalInstances(50);
      
      if (temporalInstances.length > 0) {
        // Calculate temporal consistency based on distribution of instances
        const dimensionCounts: Record<string, number> = {};
        for (const instance of temporalInstances) {
          dimensionCounts[instance.dimensionType] = 
            (dimensionCounts[instance.dimensionType] || 0) + 1;
        }
        
        // More instances in primary dimension leads to higher consistency
        const primaryCount = dimensionCounts['primary'] || 0;
        const totalCount = temporalInstances.length;
        this.temporalConsistency = 0.4 + (0.6 * (primaryCount / totalCount));
      }
      
      // Calculate adaptive coherence based on meta-cognitive events
      const events = await this.storage.getAllMetaCognitiveEvents(50);
      if (events.length > 0) {
        let totalImpact = 0;
        let weightedConfidence = 0;
        
        for (const event of events) {
          const impact = event.impact || 5;
          const confidence = event.confidence || 0.5;
          totalImpact += impact;
          weightedConfidence += impact * confidence;
        }
        
        this.adaptiveCoherence = totalImpact > 0 
          ? (weightedConfidence / totalImpact)
          : 0.5;
      }
      
      // Calculate overall system stability
      this.systemStability = (
        this.nodeEfficiency * 0.4 + 
        this.adaptiveCoherence * 0.3 + 
        this.temporalConsistency * 0.3
      );
      
      // Record initial metrics
      const timestamp = chronos.now();
      this.metricsHistory.push({
        timestamp: timestamp.time,
        systemStability: this.systemStability,
        nodeEfficiency: this.nodeEfficiency,
        adaptiveCoherence: this.adaptiveCoherence,
        temporalConsistency: this.temporalConsistency
      });
      
      // Record in storage
      await this.storage.recordSystemStability({
        timestamp: timestamp.time,
        systemStability: this.systemStability,
        nodeEfficiency: this.nodeEfficiency,
        adaptiveCoherence: this.adaptiveCoherence,
        temporalConsistency: this.temporalConsistency,
        activeTaskCount: this.activeTasks.size,
        chronosEpoch: timestamp.epoch,
        chronosTick: timestamp.tick
      });
      
      console.log(`[Chronos] Initial system stability: ${this.systemStability.toFixed(4)}`);
    } catch (error) {
      console.error('Error calculating initial system stability:', error);
    }
  }
  
  /**
   * Calculate system stability periodically
   * @param timestamp Current Chronos timestamp
   */
  private async calculateSystemStability(timestamp: ChronosTimestamp): Promise<void> {
    try {
      // Get all quantum root nodes
      const quantumRootNodes = await this.storage.getAllQuantumRootNodes(20);
      
      if (quantumRootNodes.length === 0) {
        return; // No nodes, skip calculation
      }
      
      // Calculate node efficiency based on coherence scores
      let totalCoherence = 0;
      for (const node of quantumRootNodes) {
        totalCoherence += node.coherenceScore || 0.5;
      }
      const newNodeEfficiency = totalCoherence / quantumRootNodes.length;
      
      // Apply smoothing to node efficiency
      this.nodeEfficiency = this.nodeEfficiency * 0.7 + newNodeEfficiency * 0.3;
      
      // Task load factor (more active tasks = more strain on system)
      const taskLoadFactor = Math.max(0, Math.min(1, 1 - (this.activeTasks.size * 0.05)));
      
      // Calculate new system stability
      const newSystemStability = (
        this.nodeEfficiency * 0.4 + 
        this.adaptiveCoherence * 0.3 + 
        this.temporalConsistency * 0.3
      ) * taskLoadFactor;
      
      // Apply smoothing to system stability
      this.systemStability = this.systemStability * 0.8 + newSystemStability * 0.2;
      
      // Clamp values
      this.systemStability = Math.max(0.1, Math.min(0.99, this.systemStability));
      this.nodeEfficiency = Math.max(0.1, Math.min(0.99, this.nodeEfficiency));
      this.adaptiveCoherence = Math.max(0.1, Math.min(0.99, this.adaptiveCoherence));
      this.temporalConsistency = Math.max(0.1, Math.min(0.99, this.temporalConsistency));
      
      // Add to history
      this.metricsHistory.push({
        timestamp: timestamp.time,
        systemStability: this.systemStability,
        nodeEfficiency: this.nodeEfficiency,
        adaptiveCoherence: this.adaptiveCoherence,
        temporalConsistency: this.temporalConsistency
      });
      
      // Keep history limited
      if (this.metricsHistory.length > 100) {
        this.metricsHistory.shift();
      }
      
      // Record in storage every 10 calculations (to avoid excessive storage writes)
      if (timestamp.tick % 1000 === 0) {
        await this.storage.recordSystemStability({
          timestamp: timestamp.time,
          systemStability: this.systemStability,
          nodeEfficiency: this.nodeEfficiency,
          adaptiveCoherence: this.adaptiveCoherence,
          temporalConsistency: this.temporalConsistency,
          activeTaskCount: this.activeTasks.size,
          chronosEpoch: timestamp.epoch,
          chronosTick: timestamp.tick
        });
      }
    } catch (error) {
      console.error('Error calculating system stability:', error);
    }
  }
  
  /**
   * Clean up expired tasks
   * @param timestamp Current Chronos timestamp
   */
  private cleanupExpiredTasks(timestamp: ChronosTimestamp): void {
    try {
      const expiredTaskIds: string[] = [];
      
      // Find expired tasks (running for more than 5 epochs)
      for (const [taskId, taskData] of this.activeTasks.entries()) {
        const epochsElapsed = timestamp.epoch - taskData.startEpoch;
        if (epochsElapsed > 5) {
          expiredTaskIds.push(taskId);
        }
      }
      
      // Remove expired tasks
      for (const taskId of expiredTaskIds) {
        console.log(`[Chronos] Cleaning up expired task ${taskId}`);
        this.activeTasks.delete(taskId);
        
        // Reduce temporal consistency (expired tasks are bad)
        this.temporalConsistency = Math.max(0.1, this.temporalConsistency - 0.01);
      }
      
      if (expiredTaskIds.length > 0) {
        console.log(`[Chronos] Cleaned up ${expiredTaskIds.length} expired tasks`);
      }
    } catch (error) {
      console.error('Error cleaning up expired tasks:', error);
    }
  }
}

// Singleton instance
let instance: ChronosNeuralIntegration | null = null;

/**
 * Initialize the ChronosNeuralIntegration with dependencies
 */
export async function initializeChronosNeuralIntegration(
  storage: any
): Promise<ChronosNeuralIntegration> {
  if (!instance) {
    instance = new ChronosNeuralIntegration(storage);
    await instance.initialize();
  }
  return instance;
}

/**
 * Get the ChronosNeuralIntegration instance
 */
export function getChronosNeuralIntegration(): ChronosNeuralIntegration {
  if (!instance) {
    throw new Error('ChronosNeuralIntegration not initialized');
  }
  return instance;
}