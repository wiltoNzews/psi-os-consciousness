/**
 * ChronosTemporalInstanceService - Temporal Instances Management with Chronos Time System
 * 
 * This service manages temporal instances (snapshots of state across time) with
 * integration to the Chronos time management system for consistent timestamps.
 * 
 * Following Void-Centered Design principles, this service explicitly acknowledges
 * the boundary between the temporal state domain and the time domain.
 */

import { chronos, ChronosTimestamp } from '../utils/chronos-handler.js';
import { FileSystemStorage } from '../../storage.js';
import { InsertTemporalInstance } from '../../../shared/schema-minimal.js';
import { v4 as uuidv4 } from 'uuid';

/**
 * Represents a temporal branch dimension
 */
interface BranchDimension {
  id: string;
  name: string;
  description?: string;
  parentId?: string;
  createdAt: Date;
  status: 'active' | 'merged' | 'abandoned';
  metadata?: Record<string, any>;
}

/**
 * ChronosTemporalInstanceService manages temporal instances with Chronos
 */
export class ChronosTemporalInstanceService {
  private storage: FileSystemStorage;
  
  // Branch dimensions (alternate timelines)
  private branchDimensions: Map<string, BranchDimension> = new Map();
  
  constructor(storage: FileSystemStorage) {
    this.storage = storage;
    
    // Initialize with primary dimension
    this.branchDimensions.set('primary', {
      id: 'primary',
      name: 'Primary Timeline',
      description: 'The main timeline of the system',
      status: 'active',
      createdAt: new Date()
    });
  }
  
  /**
   * Initialize the Chronos Temporal Instance service
   */
  initialize(): void {
    console.log('Initializing ChronosTemporalInstanceService...');
    
    // Register cleanup task
    chronos.registerTask(
      'temporal-instance-maintenance',
      1000, // Every 1000 ticks (50 seconds @ 20tps)
      timestamp => this.performMaintenanceTask(timestamp)
    );
    
    console.log('ChronosTemporalInstanceService initialized successfully');
  }
  
  /**
   * Create a new temporal instance with chronos integration
   * @param data Temporal instance data
   * @returns Created temporal instance
   */
  async createTemporalInstance(data: Partial<InsertTemporalInstance>): Promise<any> {
    try {
      // Get current timestamp
      const timestamp = chronos.now();
      
      // Ensure we have required fields
      const instanceData: InsertTemporalInstance = {
        nodeId: data.nodeId || '',
        state: data.state || '{}',
        dimensionType: data.dimensionType || 'primary',
        stabilityFactor: data.stabilityFactor || 0.5,
        metadata: {
          ...(data.metadata || {}),
          _chronos: {
            createdAt: timestamp.time.toISOString(),
            createdAtTick: timestamp.tick,
            createdAtEpoch: timestamp.epoch
          }
        }
      };
      
      // Add unique ID if not provided
      if (!instanceData.id) {
        instanceData.id = uuidv4();
      }
      
      // Set timestamp if not provided
      if (!instanceData.timestamp) {
        instanceData.timestamp = timestamp.time;
      }
      
      // Create the temporal instance
      const instance = await this.storage.createTemporalInstance(instanceData);
      
      return instance;
    } catch (error) {
      console.error('Error creating temporal instance with chronos integration:', error);
      throw error;
    }
  }
  
  /**
   * Create a new temporal branch (alternate timeline)
   * @param sourceInstanceId Source instance to branch from
   * @param branchName Name of the new branch
   * @param additionalState Additional state to add to the branch
   * @returns Created branch instance
   */
  async createTemporalBranch(
    sourceInstanceId: string,
    branchName: string,
    additionalState?: Record<string, any>
  ): Promise<any> {
    try {
      // Get the source instance
      const sourceInstance = await this.storage.getTemporalInstance(sourceInstanceId);
      if (!sourceInstance) {
        throw new Error(`Source temporal instance with ID ${sourceInstanceId} not found`);
      }
      
      // Create a new branch dimension
      const branchId = `branch-${uuidv4().substring(0, 8)}`;
      const timestamp = chronos.now();
      
      const branchDimension: BranchDimension = {
        id: branchId,
        name: branchName,
        description: `Branch from ${sourceInstance.dimensionType} at tick ${timestamp.tick}`,
        parentId: sourceInstance.dimensionType,
        createdAt: timestamp.time,
        status: 'active',
        metadata: {
          source: {
            instanceId: sourceInstanceId,
            nodeId: sourceInstance.nodeId,
            timestamp: sourceInstance.timestamp.toISOString()
          },
          chronos: {
            branchedAt: timestamp.time.toISOString(),
            branchedAtTick: timestamp.tick,
            branchedAtEpoch: timestamp.epoch
          }
        }
      };
      
      // Store the branch dimension
      this.branchDimensions.set(branchId, branchDimension);
      
      // Parse the source state
      let state = {};
      try {
        state = typeof sourceInstance.state === 'string' 
          ? JSON.parse(sourceInstance.state)
          : sourceInstance.state;
      } catch (e) {
        console.error(`Error parsing state for instance ${sourceInstanceId}:`, e);
        state = sourceInstance.state;
      }
      
      // Merge with additional state if provided
      if (additionalState) {
        state = { ...state, ...additionalState };
      }
      
      // Mark this as a branch in the state
      state._branchMetadata = {
        branchId,
        sourceDimension: sourceInstance.dimensionType,
        sourceInstanceId: sourceInstanceId,
        branchedAt: timestamp.time.toISOString()
      };
      
      // Create a new temporal instance in the branch dimension
      const branchInstance = await this.createTemporalInstance({
        nodeId: sourceInstance.nodeId,
        state: JSON.stringify(state),
        dimensionType: branchId,
        stabilityFactor: sourceInstance.stabilityFactor * 0.95, // Slightly less stable
        metadata: {
          branchName,
          sourceDimension: sourceInstance.dimensionType,
          sourceInstanceId: sourceInstanceId,
          branchPoint: timestamp.time.toISOString()
        }
      });
      
      return branchInstance;
    } catch (error) {
      console.error('Error creating temporal branch:', error);
      throw error;
    }
  }
  
  /**
   * Get all branch dimensions (for UI display)
   * @returns Array of branch dimensions
   */
  getBranchDimensions(): BranchDimension[] {
    return Array.from(this.branchDimensions.values());
  }
  
  /**
   * Get a specific branch dimension
   * @param branchId Branch ID
   * @returns Branch dimension or undefined if not found
   */
  getBranchDimension(branchId: string): BranchDimension | undefined {
    return this.branchDimensions.get(branchId);
  }
  
  /**
   * Merge a branch back into its parent
   * @param branchId Branch ID to merge
   * @returns The merge result instance
   */
  async mergeTemporalBranch(branchId: string): Promise<any> {
    try {
      // Get the branch dimension
      const branch = this.branchDimensions.get(branchId);
      if (!branch) {
        throw new Error(`Branch dimension ${branchId} not found`);
      }
      
      if (branch.status !== 'active') {
        throw new Error(`Branch ${branchId} is not active (status: ${branch.status})`);
      }
      
      // Get the parent dimension
      const parentId = branch.parentId || 'primary';
      
      // Get the latest instance in this branch
      const branchInstances = await this.storage.getAllTemporalInstances(10, { 
        dimensionType: branchId 
      });
      
      if (branchInstances.length === 0) {
        throw new Error(`No instances found in branch ${branchId}`);
      }
      
      // Sort by timestamp desc to get the latest
      branchInstances.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
      const latestInstance = branchInstances[0];
      
      // Parse the latest state
      let state = {};
      try {
        state = typeof latestInstance.state === 'string' 
          ? JSON.parse(latestInstance.state)
          : latestInstance.state;
      } catch (e) {
        console.error(`Error parsing state for instance ${latestInstance.id}:`, e);
        state = latestInstance.state;
      }
      
      // Mark this as a merge result in the state
      const timestamp = chronos.now();
      state._mergeMetadata = {
        sourceBranch: branchId,
        mergedAt: timestamp.time.toISOString(),
        mergedAtTick: timestamp.tick,
        mergedAtEpoch: timestamp.epoch
      };
      
      // Create a merge result instance in the parent dimension
      const mergeInstance = await this.createTemporalInstance({
        nodeId: latestInstance.nodeId,
        state: JSON.stringify(state),
        dimensionType: parentId,
        stabilityFactor: latestInstance.stabilityFactor * 1.05, // Slightly more stable after merge
        metadata: {
          mergeSource: branchId,
          sourceInstanceId: latestInstance.id,
          mergePoint: timestamp.time.toISOString()
        }
      });
      
      // Update branch status
      branch.status = 'merged';
      branch.metadata = {
        ...(branch.metadata || {}),
        mergedAt: timestamp.time.toISOString(),
        mergedAtTick: timestamp.tick,
        mergedAtEpoch: timestamp.epoch,
        mergeResultInstanceId: mergeInstance.id
      };
      
      this.branchDimensions.set(branchId, branch);
      
      return mergeInstance;
    } catch (error) {
      console.error(`Error merging temporal branch ${branchId}:`, error);
      throw error;
    }
  }
  
  /**
   * Abandon a branch (mark it as obsolete)
   * @param branchId Branch ID to abandon
   * @param reason Reason for abandonment
   * @returns True if successfully abandoned
   */
  abandonTemporalBranch(branchId: string, reason: string): boolean {
    try {
      // Get the branch dimension
      const branch = this.branchDimensions.get(branchId);
      if (!branch) {
        throw new Error(`Branch dimension ${branchId} not found`);
      }
      
      if (branch.status !== 'active') {
        throw new Error(`Branch ${branchId} is not active (status: ${branch.status})`);
      }
      
      // Update branch status
      const timestamp = chronos.now();
      branch.status = 'abandoned';
      branch.metadata = {
        ...(branch.metadata || {}),
        abandonedAt: timestamp.time.toISOString(),
        abandonedAtTick: timestamp.tick,
        abandonedAtEpoch: timestamp.epoch,
        abandonReason: reason
      };
      
      this.branchDimensions.set(branchId, branch);
      
      return true;
    } catch (error) {
      console.error(`Error abandoning temporal branch ${branchId}:`, error);
      return false;
    }
  }
  
  /**
   * Calculate stability for a node across all dimensions
   * @param nodeId Node ID
   * @returns Stability score (0-1)
   */
  async calculateNodeStabilityAcrossDimensions(nodeId: string): Promise<number> {
    try {
      // Get all instances for this node
      const instances = await this.storage.getAllTemporalInstances(100, { nodeId });
      
      if (instances.length === 0) {
        return 0.5; // Default stability
      }
      
      // Group by dimension
      const dimensionInstances: Record<string, any[]> = {};
      
      for (const instance of instances) {
        const dim = instance.dimensionType;
        if (!dimensionInstances[dim]) {
          dimensionInstances[dim] = [];
        }
        dimensionInstances[dim].push(instance);
      }
      
      // Calculate average stability per dimension
      const dimensionStabilities: Record<string, number> = {};
      
      for (const [dim, dimInstances] of Object.entries(dimensionInstances)) {
        // Sort by timestamp
        dimInstances.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
        
        // Calculate average stability
        const avgStability = dimInstances.reduce((sum, instance) => {
          return sum + (instance.stabilityFactor || 0.5);
        }, 0) / dimInstances.length;
        
        dimensionStabilities[dim] = avgStability;
      }
      
      // Calculate overall stability
      // Primary dimension has more weight
      let weightedSum = 0;
      let weightSum = 0;
      
      for (const [dim, stability] of Object.entries(dimensionStabilities)) {
        const weight = dim === 'primary' ? 2.0 : 1.0;
        weightedSum += stability * weight;
        weightSum += weight;
      }
      
      return weightedSum / weightSum;
    } catch (error) {
      console.error(`Error calculating node stability across dimensions for ${nodeId}:`, error);
      return 0.5; // Default stability on error
    }
  }
  
  /**
   * Perform maintenance tasks on temporal instances
   * @param timestamp Current Chronos timestamp
   */
  private async performMaintenanceTask(timestamp: ChronosTimestamp): Promise<void> {
    try {
      console.log(`[Chronos] Performing temporal instance maintenance at epoch ${timestamp.epoch}, tick ${timestamp.tick}`);
      
      // Get all instances
      const instances = await this.storage.getAllTemporalInstances(100);
      
      // Group by node and dimension
      const nodeCount: Record<string, number> = {};
      
      for (const instance of instances) {
        const key = `${instance.nodeId}_${instance.dimensionType}`;
        nodeCount[key] = (nodeCount[key] || 0) + 1;
      }
      
      // Find nodes with too many instances in a dimension
      const nodesToTrim = Object.entries(nodeCount)
        .filter(([_, count]) => count > 20) // Keep max 20 instances per node+dimension
        .map(([key, _]) => key);
      
      // Trim excess instances
      for (const nodeKey of nodesToTrim) {
        const [nodeId, dimensionType] = nodeKey.split('_');
        
        // Get instances for this node and dimension
        const nodeInstances = instances.filter(
          instance => instance.nodeId === nodeId && instance.dimensionType === dimensionType
        );
        
        // Sort by timestamp (oldest first)
        nodeInstances.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
        
        // Trim oldest instances, but keep at least 20
        if (nodeInstances.length > 20) {
          const toTrim = nodeInstances.slice(0, nodeInstances.length - 20);
          console.log(`[Chronos] Trimming ${toTrim.length} old temporal instances for node ${nodeId} in dimension ${dimensionType}`);
          
          // Delete instances
          for (const instance of toTrim) {
            await this.storage.deleteTemporalInstance(instance.id);
          }
        }
      }
      
      // Clean up abandoned branches older than 7 days
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      
      for (const [branchId, branch] of this.branchDimensions.entries()) {
        if (branch.status === 'abandoned' && branch.createdAt < sevenDaysAgo) {
          console.log(`[Chronos] Removing old abandoned branch ${branchId} (${branch.name})`);
          this.branchDimensions.delete(branchId);
        }
      }
      
      console.log(`[Chronos] Temporal instance maintenance completed`);
    } catch (error) {
      console.error('Error performing temporal instance maintenance:', error);
    }
  }
}

// Singleton instance
let instance: ChronosTemporalInstanceService | null = null;

/**
 * Initialize the ChronosTemporalInstanceService with dependencies
 */
export function initializeChronosTemporalInstanceService(
  storage: FileSystemStorage
): ChronosTemporalInstanceService {
  if (!instance) {
    instance = new ChronosTemporalInstanceService(storage);
    instance.initialize();
  }
  return instance;
}

/**
 * Get the ChronosTemporalInstanceService instance
 */
export function getChronosTemporalInstanceService(): ChronosTemporalInstanceService {
  if (!instance) {
    throw new Error('ChronosTemporalInstanceService not initialized');
  }
  return instance;
}