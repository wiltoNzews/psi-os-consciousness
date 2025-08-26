/**
 * QRN Context Manager
 * 
 * This service is responsible for ensuring that all operations within the
 * Neural-Symbiotic Orchestration Platform maintain proper context references
 * to Quantum Root Nodes (QRNs). It provides a central point for managing QRN
 * associations across the platform's components.
 * 
 * Core capabilities:
 * - Tracking active QRN contexts
 * - Ensuring consistent QRN references across operations
 * - Providing context-aware operations for tasks, events, and pathways
 * - Supporting context persistence and transitions
 */

import { v4 as uuidv4 } from 'uuid';
import { QuantumRootNodeService } from './quantum-root-node-service.js';
import { storage } from '../../storage.js';

export class QRNContextManager {
  // Singleton instance
  private static instance: QRNContextManager;
  
  // Active contexts by session/user
  private activeContexts: Map<string, string> = new Map(); // sessionId -> qrnId
  
  // Default QRN for operations without explicit context
  private defaultQRN: string | null = null;
  
  // Reference to QRN service
  private qrnService: QuantumRootNodeService;
  
  /**
   * Get the singleton instance
   */
  public static getInstance(): QRNContextManager {
    if (!QRNContextManager.instance) {
      QRNContextManager.instance = new QRNContextManager();
    }
    return QRNContextManager.instance;
  }
  
  /**
   * Private constructor for singleton
   */
  private constructor() {
    this.qrnService = new QuantumRootNodeService();
    console.log('QRN Context Manager initialized');
    this.initializeDefaultQRN();
  }
  
  /**
   * Initialize the default QRN if needed
   */
  private async initializeDefaultQRN(): Promise<void> {
    try {
      // Check if we already have a system QRN
      const systemQRNs = await storage.getAllQuantumRootNodes(1, { 
        type: 'system' 
      });
      
      if (systemQRNs && systemQRNs.length > 0) {
        this.defaultQRN = systemQRNs[0].id;
        console.log(`Using existing system QRN as default: ${this.defaultQRN}`);
      } else {
        // Create a new system QRN
        const systemQRN = await this.qrnService.createNode({
          name: 'System Default QRN',
          description: 'Default Quantum Root Node for operations without explicit context',
          type: 'system',
          initialCapabilities: ['core', 'system', 'default']
        });
        
        this.defaultQRN = systemQRN.id;
        console.log(`Created new system QRN as default: ${this.defaultQRN}`);
      }
    } catch (error) {
      console.error('Error initializing default QRN:', error);
    }
  }
  
  /**
   * Get the active QRN for a session/user
   * If no active QRN exists, create one and associate it with the session
   */
  public async getOrCreateActiveQRN(sessionId: string, options: {
    name?: string;
    description?: string;
    type?: string;
    userId?: number;
  } = {}): Promise<string> {
    // Check if we already have an active QRN for this session
    const existingQRN = this.activeContexts.get(sessionId);
    if (existingQRN) {
      return existingQRN;
    }
    
    try {
      // Create a new QRN for this session
      const qrn = await this.qrnService.createNode({
        name: options.name || `Session QRN: ${sessionId}`,
        description: options.description || `Quantum Root Node for session ${sessionId}`,
        type: options.type || 'session',
        userId: options.userId,
        initialCapabilities: ['core', 'session', 'temporal-awareness']
      });
      
      // Store the association
      this.activeContexts.set(sessionId, qrn.id);
      
      return qrn.id;
    } catch (error) {
      console.error(`Error creating QRN for session ${sessionId}:`, error);
      // Fall back to default QRN
      return this.getDefaultQRN();
    }
  }
  
  /**
   * Set the active QRN for a session/user
   */
  public setActiveQRN(sessionId: string, qrnId: string): void {
    this.activeContexts.set(sessionId, qrnId);
  }
  
  /**
   * Get the default QRN (for operations without explicit context)
   */
  public getDefaultQRN(): string {
    if (!this.defaultQRN) {
      throw new Error('Default QRN not initialized');
    }
    return this.defaultQRN;
  }
  
  /**
   * Resolve a QRN ID based on context information
   * This is used to ensure all operations have a valid QRN reference
   */
  public resolveQRN(options: {
    qrnId?: string;
    sessionId?: string;
    userId?: number;
  }): string {
    // If explicit QRN ID provided, use it
    if (options.qrnId) {
      return options.qrnId;
    }
    
    // If session ID provided, use the active QRN for that session
    if (options.sessionId) {
      const sessionQRN = this.activeContexts.get(options.sessionId);
      if (sessionQRN) {
        return sessionQRN;
      }
    }
    
    // Fall back to default QRN
    return this.getDefaultQRN();
  }
}

// Export the singleton instance
export const qrnContextManager = QRNContextManager.getInstance();