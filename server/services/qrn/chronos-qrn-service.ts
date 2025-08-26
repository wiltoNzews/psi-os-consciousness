/**
 * ChronosQRNService - Quantum Root Node Integration with Chronos Time Management
 * 
 * This service provides temporal tracking for Quantum Root Nodes (QRNs)
 * and ensures they operate consistently within the system's time domain.
 * 
 * Following Void-Centered Design principles, this service explicitly acknowledges
 * the boundary between the QRN state domain and the time domain.
 */

import { chronos, ChronosTimestamp } from '../utils/chronos-handler.js';
import { FileSystemStorage } from '../../storage.js';
import { InsertQuantumRootNode, InsertTemporalInstance } from '../../../shared/schema-minimal.js';

/**
 * ChronosQRNService manages temporal aspects of Quantum Root Nodes
 */
export class ChronosQRNService {
  private storage: FileSystemStorage;
  
  // Track node last update timestamps
  private nodeLastUpdated: Map<string, Date> = new Map();
  
  // Track node temporal snapshots
  private nodeSnapshots: Map<string, number> = new Map();
  
  constructor(storage: FileSystemStorage) {
    this.storage = storage;
  }
  
  /**
   * Initialize the Chronos QRN service
   */
  initialize(): void {
    console.log('Initializing ChronosQRNService...');
    
    // Register regular snapshot task
    chronos.registerTask(
      'qrn-snapshot',
      200, // Every 200 ticks (10 seconds @ 20tps)
      timestamp => this.createPeriodicSnapshots(timestamp)
    );
    
    console.log('ChronosQRNService initialized successfully');
  }
  
  /**
   * Create a new Quantum Root Node with temporal tracking
   * @param data QRN data
   * @returns Created QRN
   */
  async createQuantumRootNode(data: InsertQuantumRootNode): Promise<any> {
    try {
      // Get current timestamp
      const timestamp = chronos.now();
      
      // Add chronos metadata to node
      const qrnData = {
        ...data,
        state: {
          ...(data.state || {}),
          _chronos: {
            createdAt: timestamp.time.toISOString(),
            createdAtTick: timestamp.tick,
            createdAtEpoch: timestamp.epoch
          }
        }
      };
      
      // Create the QRN
      const qrn = await this.storage.createQuantumRootNode(qrnData);
      
      // Track last update time
      this.nodeLastUpdated.set(qrn.id, timestamp.time);
      
      // Initialize snapshot counter
      this.nodeSnapshots.set(qrn.id, 0);
      
      // Create initial temporal instance
      await this.createTemporalInstance(qrn, timestamp);
      
      return qrn;
    } catch (error) {
      console.error('Error creating Quantum Root Node with temporal tracking:', error);
      throw error;
    }
  }
  
  /**
   * Update a Quantum Root Node with temporal tracking
   * @param id QRN ID
   * @param data Updated QRN data
   * @returns Updated QRN
   */
  async updateQuantumRootNode(id: string, data: any): Promise<any> {
    try {
      // Get the existing QRN
      const existingQRN = await this.storage.getQuantumRootNode(id);
      if (!existingQRN) {
        throw new Error(`Quantum Root Node with ID ${id} not found`);
      }
      
      // Get current timestamp
      const timestamp = chronos.now();
      
      // Merge state with chronos metadata
      const qrnData = {
        ...data,
        state: {
          ...(existingQRN.state || {}),
          ...(data.state || {}),
          _chronos: {
            ...(existingQRN.state?._chronos || {}),
            lastUpdatedAt: timestamp.time.toISOString(),
            lastUpdatedAtTick: timestamp.tick,
            lastUpdatedAtEpoch: timestamp.epoch,
            updateCount: ((existingQRN.state?._chronos?.updateCount || 0) + 1)
          }
        }
      };
      
      // Update the QRN
      const updatedQRN = await this.storage.updateQuantumRootNode(id, qrnData);
      
      // Track last update time
      this.nodeLastUpdated.set(id, timestamp.time);
      
      // Create temporal instance (snapshot of the node state)
      await this.createTemporalInstance(updatedQRN, timestamp);
      
      return updatedQRN;
    } catch (error) {
      console.error(`Error updating Quantum Root Node ${id} with temporal tracking:`, error);
      throw error;
    }
  }
  
  /**
   * Get temporal history for a QRN
   * @param nodeId QRN ID
   * @param limit Maximum number of history entries
   * @returns Array of temporal instances
   */
  async getTemporalHistory(nodeId: string, limit: number = 10): Promise<any[]> {
    try {
      // Get temporal instances for this node
      const instances = await this.storage.getAllTemporalInstances(limit, { nodeId });
      
      // Sort by timestamp descending (newest first)
      return instances.sort((a, b) => {
        const aTime = a.timestamp.getTime();
        const bTime = b.timestamp.getTime();
        return bTime - aTime;
      });
    } catch (error) {
      console.error(`Error getting temporal history for QRN ${nodeId}:`, error);
      return [];
    }
  }
  
  /**
   * Create regular snapshots of active nodes
   * @param timestamp Current Chronos timestamp
   */
  private async createPeriodicSnapshots(timestamp: ChronosTimestamp): Promise<void> {
    try {
      // Get all QRNs
      const qrns = await this.storage.getAllQuantumRootNodes(20);
      
      // Process each QRN
      for (const qrn of qrns) {
        // Get last update time
        const lastUpdated = this.nodeLastUpdated.get(qrn.id) || qrn.createdAt;
        
        // Calculate time since last update
        const timeSinceUpdate = timestamp.time.getTime() - lastUpdated.getTime();
        
        // Create snapshots based on activity level
        if (timeSinceUpdate < 60000) {
          // Active node: snapshot every 10-15 seconds
          const snapshotCount = this.nodeSnapshots.get(qrn.id) || 0;
          
          // Create snapshot if it's been at least 5 ticks since the last update
          // and we haven't created too many snapshots already
          if (snapshotCount < 10 && timestamp.tick % 5 === 0) {
            await this.createTemporalInstance(qrn, timestamp);
            this.nodeSnapshots.set(qrn.id, snapshotCount + 1);
          }
        } else if (timeSinceUpdate < 3600000) {
          // Semi-active node: snapshot every few minutes
          if (timestamp.tick % 120 === 0) { // Every ~6 seconds @ 20tps
            await this.createTemporalInstance(qrn, timestamp);
          }
        } else {
          // Inactive node: snapshot infrequently
          if (timestamp.tick % 600 === 0) { // Every ~30 seconds @ 20tps
            await this.createTemporalInstance(qrn, timestamp);
          }
        }
      }
    } catch (error) {
      console.error('Error creating periodic QRN snapshots:', error);
    }
  }
  
  /**
   * Create a temporal instance for a QRN
   * @param qrn Quantum Root Node
   * @param timestamp Chronos timestamp
   */
  private async createTemporalInstance(qrn: any, timestamp: ChronosTimestamp): Promise<any> {
    try {
      // Create data for temporal instance
      const instanceData: InsertTemporalInstance = {
        nodeId: qrn.id,
        timestamp: timestamp.time,
        state: JSON.stringify(qrn.state),
        dimensionType: 'primary',
        stabilityFactor: qrn.coherenceScore || 0.5,
        metadata: {
          nodeName: qrn.name,
          chronosTick: timestamp.tick,
          chronosEpoch: timestamp.epoch,
          createdAt: chronos.toISO(timestamp.time)
        }
      };
      
      // Create the temporal instance
      return await this.storage.createTemporalInstance(instanceData);
    } catch (error) {
      console.error(`Error creating temporal instance for QRN ${qrn.id}:`, error);
      return null;
    }
  }
  
  /**
   * Get QRN state at a specific point in time
   * @param nodeId QRN ID
   * @param targetTime Target timestamp
   * @returns QRN state at the specified time or null if not found
   */
  async getStateAtTime(nodeId: string, targetTime: Date): Promise<any | null> {
    try {
      // Get all temporal instances for this node
      const instances = await this.storage.getAllTemporalInstances(100, { nodeId });
      
      if (instances.length === 0) {
        return null;
      }
      
      // Find the instance closest to but not after the target time
      let closestInstance = null;
      let closestTimeDiff = Number.MAX_SAFE_INTEGER;
      
      for (const instance of instances) {
        const instanceTime = instance.timestamp.getTime();
        const targetTimeMs = targetTime.getTime();
        
        // Only consider instances before or at the target time
        if (instanceTime <= targetTimeMs) {
          const timeDiff = targetTimeMs - instanceTime;
          if (timeDiff < closestTimeDiff) {
            closestTimeDiff = timeDiff;
            closestInstance = instance;
          }
        }
      }
      
      // If we found a closest instance, parse and return its state
      if (closestInstance) {
        try {
          return typeof closestInstance.state === 'string' 
            ? JSON.parse(closestInstance.state)
            : closestInstance.state;
        } catch (e) {
          console.error(`Error parsing state for instance ${closestInstance.id}:`, e);
          return closestInstance.state;
        }
      }
      
      return null;
    } catch (error) {
      console.error(`Error getting state at time for QRN ${nodeId}:`, error);
      return null;
    }
  }
  
  /**
   * Create a snapshot for a specific QRN
   * @param nodeId QRN ID
   * @returns Created temporal instance or null if failed
   */
  async createSnapshot(nodeId: string): Promise<any> {
    try {
      // Get the QRN
      const qrn = await this.storage.getQuantumRootNode(nodeId);
      if (!qrn) {
        throw new Error(`Quantum Root Node with ID ${nodeId} not found`);
      }
      
      // Get current timestamp
      const timestamp = chronos.now();
      
      // Create temporal instance
      return await this.createTemporalInstance(qrn, timestamp);
    } catch (error) {
      console.error(`Error creating snapshot for QRN ${nodeId}:`, error);
      return null;
    }
  }
  
  /**
   * Compare QRN states across two points in time
   * @param nodeId QRN ID
   * @param time1 First timestamp
   * @param time2 Second timestamp
   * @returns Object containing both states and differences
   */
  async compareStatesAcrossTime(
    nodeId: string,
    time1: Date,
    time2: Date
  ): Promise<{ state1: any, state2: any, differences: any } | null> {
    try {
      // Get states at both times
      const state1 = await this.getStateAtTime(nodeId, time1);
      const state2 = await this.getStateAtTime(nodeId, time2);
      
      if (!state1 || !state2) {
        return null;
      }
      
      // Compute differences (simplified)
      const differences = {
        addedKeys: [],
        removedKeys: [],
        changedValues: []
      };
      
      // Find added and changed keys
      for (const key in state2) {
        if (!(key in state1)) {
          differences.addedKeys.push(key);
        } else if (JSON.stringify(state1[key]) !== JSON.stringify(state2[key])) {
          differences.changedValues.push({
            key,
            oldValue: state1[key],
            newValue: state2[key]
          });
        }
      }
      
      // Find removed keys
      for (const key in state1) {
        if (!(key in state2)) {
          differences.removedKeys.push(key);
        }
      }
      
      return { state1, state2, differences };
    } catch (error) {
      console.error(`Error comparing states across time for QRN ${nodeId}:`, error);
      return null;
    }
  }
}

// Singleton instance
let instance: ChronosQRNService | null = null;

/**
 * Initialize the ChronosQRNService with dependencies
 */
export function initializeChronosQRNService(
  storage: FileSystemStorage
): ChronosQRNService {
  if (!instance) {
    instance = new ChronosQRNService(storage);
    instance.initialize();
  }
  return instance;
}

/**
 * Get the ChronosQRNService instance
 */
export function getChronosQRNService(): ChronosQRNService {
  if (!instance) {
    throw new Error('ChronosQRNService not initialized');
  }
  return instance;
}