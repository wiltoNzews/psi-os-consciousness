
import path from 'path';
import { promises as fs } from 'fs';
import { v4 as uuidv4 } from 'uuid';
import { ensureDirectoryExists, fileExists, getJsonFilesInDirectory } from './utils/fs-helpers.js';
import { ensureDate, parseJsonWithDates, safeStringify } from './utils/date-helpers.js';
import { IPersistentContextService } from './context-manager.js';

/**
 * Configuration for the PersistentContextHandler
 */
export interface ContextHandlerConfig {
  /**
   * Base directory for storing context files
   * Default: process.cwd()
   */
  baseDir?: string;
}

// Define interfaces for context objects
export interface StrategicPlan {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  createdAt: Date;
  updatedAt?: Date;
}

export interface ContextChunk {
  id: string;
  content: string;
  type: string;
  metadata: Record<string, any>;
  createdAt: Date;
}

export interface PersistentContext {
  id: string;
  sessionId: string;
  name: string;
  description?: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  chunks: ContextChunk[];
  strategicPlans: StrategicPlan[];
  metadata: Record<string, any>;
}

/**
 * Interface for a persistence layer to store and retrieve data
 */
export interface IPersistenceLayer {
  /**
   * Save data to the persistence layer
   * @param key Unique identifier for the data
   * @param data Data to save
   */
  save(key: string, data: any): Promise<void>;
  
  /**
   * Load data from the persistence layer
   * @param key Unique identifier for the data
   * @returns The data if found, null otherwise
   */
  load(key: string): Promise<any | null>;
  
  /**
   * Get all keys in the persistence layer
   * @param prefix Optional prefix to filter keys by
   * @returns Array of keys
   */
  getKeys(prefix?: string): Promise<string[]>;
  
  /**
   * Delete data from the persistence layer
   * @param key Unique identifier for the data
   * @returns True if data was deleted, false otherwise
   */
  delete(key: string): Promise<boolean>;
}

/**
 * File system implementation of the persistence layer
 */
export class FileSystemPersistenceLayer implements IPersistenceLayer {
  private storageDir: string;
  
  /**
   * Create a new FileSystemPersistenceLayer
   * @param storageDir Directory to store files in
   */
  constructor(storageDir: string) {
    this.storageDir = storageDir;
  }
  
  /**
   * Initialize the storage directory asynchronously
   */
  async initialize(): Promise<void> {
    await ensureDirectoryExists(this.storageDir);
  }
  
  /**
   * Save data to a file
   * @param key Unique identifier for the data
   * @param data Data to save
   */
  async save(key: string, data: any): Promise<void> {
    await this.initialize();
    const filePath = path.join(this.storageDir, `${key}.json`);
    await fs.writeFile(filePath, safeStringify(data));
  }
  
  /**
   * Load data from a file
   * @param key Unique identifier for the data
   * @returns The data if found, null otherwise
   */
  async load(key: string): Promise<any | null> {
    await this.initialize();
    const filePath = path.join(this.storageDir, `${key}.json`);
    
    try {
      const content = await fs.readFile(filePath, 'utf-8');
      return parseJsonWithDates(content);
    } catch (error: any) {
      if (error.code === 'ENOENT') {
        return null;
      }
      throw error;
    }
  }
  
  /**
   * Get all keys in the storage directory
   * @param prefix Optional prefix to filter keys by
   * @returns Array of keys
   */
  async getKeys(prefix?: string): Promise<string[]> {
    await this.initialize();
    
    try {
      const files = await fs.readdir(this.storageDir);
      return files
        .filter(file => file.endsWith('.json'))
        .map(file => file.slice(0, -5))  // Remove .json extension
        .filter(key => !prefix || key.startsWith(prefix));
    } catch (error) {
      console.error('Error getting keys:', error);
      return [];
    }
  }
  
  /**
   * Delete a file
   * @param key Unique identifier for the data
   * @returns True if file was deleted, false otherwise
   */
  async delete(key: string): Promise<boolean> {
    await this.initialize();
    const filePath = path.join(this.storageDir, `${key}.json`);
    
    try {
      await fs.unlink(filePath);
      return true;
    } catch (error: any) {
      if (error.code === 'ENOENT') {
        return false;
      }
      throw error;
    }
  }
}

/**
 * Handler class for managing persistent contexts
 */
export class PersistentContextHandler {
  private persistenceLayer: IPersistenceLayer;
  
  /**
   * Create a new PersistentContextHandler
   * @param persistenceLayer Persistence layer to use
   */
  constructor(persistenceLayer: IPersistenceLayer) {
    this.persistenceLayer = persistenceLayer;
  }
  
  /**
   * Create a new context
   */
  async createContext(
    sessionId: string,
    name: string,
    description?: string,
    tags: string[] = [],
    metadata: Record<string, any> = {}
  ): Promise<PersistentContext> {
    const timestamp = new Date();
    const contextId = uuidv4();
    
    const newContext: PersistentContext = {
      id: contextId,
      sessionId,
      name,
      description,
      tags,
      createdAt: timestamp,
      updatedAt: timestamp,
      chunks: [],
      strategicPlans: [],
      metadata
    };
    
    const key = `${sessionId}-${contextId}`;
    await this.persistenceLayer.save(key, newContext);
    console.log(`Created new context: ${key}`);
    
    return newContext;
  }
  
  /**
   * Get a context by ID
   */
  async getContext(contextId: string): Promise<PersistentContext | null> {
    // Get all keys from the persistence layer
    const keys = await this.persistenceLayer.getKeys();
    
    // Find the key that contains the contextId
    const key = keys.find(k => k.includes(contextId));
    if (!key) {
      return null;
    }
    
    // Load the context from the persistence layer
    return await this.persistenceLayer.load(key);
  }
  
  /**
   * Get contexts by session ID
   */
  async getContextsBySession(sessionId: string): Promise<PersistentContext[]> {
    // Get all keys from the persistence layer with the session ID prefix
    const keys = await this.persistenceLayer.getKeys(sessionId);
    const contexts: PersistentContext[] = [];
    
    // Load each context
    for (const key of keys) {
      const context = await this.persistenceLayer.load(key);
      if (context) {
        contexts.push(context);
      }
    }
    
    return contexts;
  }
  
  /**
   * Update a context
   */
  async updateContext(
    contextId: string,
    updates: Partial<Omit<PersistentContext, 'id' | 'sessionId' | 'createdAt'>>
  ): Promise<PersistentContext | null> {
    const context = await this.getContext(contextId);
    
    if (!context) {
      return null;
    }
    
    const updatedContext: PersistentContext = {
      ...context,
      ...updates,
      updatedAt: new Date(),
      // Make sure these fields don't get overwritten
      id: context.id,
      sessionId: context.sessionId,
      createdAt: context.createdAt
    };
    
    const key = `${context.sessionId}-${contextId}`;
    await this.persistenceLayer.save(key, updatedContext);
    console.log(`Updated context: ${key}`);
    
    return updatedContext;
  }
  
  /**
   * Add a chunk to a context
   */
  async addChunk(
    contextId: string,
    content: string,
    type: string,
    metadata: Record<string, any> = {}
  ): Promise<ContextChunk | null> {
    const context = await this.getContext(contextId);
    
    if (!context) {
      return null;
    }
    
    const newChunk: ContextChunk = {
      id: uuidv4(),
      content,
      type,
      metadata,
      createdAt: new Date()
    };
    
    context.chunks.push(newChunk);
    context.updatedAt = new Date();
    
    const key = `${context.sessionId}-${contextId}`;
    await this.persistenceLayer.save(key, context);
    console.log(`Added chunk to context: ${key}`);
    
    return newChunk;
  }
  
  /**
   * Search for contexts with specific terms in their content or metadata
   */
  async searchContexts(term: string): Promise<PersistentContext[]> {
    const keys = await this.persistenceLayer.getKeys();
    const matchingContexts: PersistentContext[] = [];
    
    const lowercaseTerm = term.toLowerCase();
    
    for (const key of keys) {
      const context = await this.persistenceLayer.load(key);
      if (!context) continue;
      
      // Check context name, description, and tags
      if (
        context.name.toLowerCase().includes(lowercaseTerm) ||
        (context.description && context.description.toLowerCase().includes(lowercaseTerm)) ||
        context.tags.some((tag: string) => tag.toLowerCase().includes(lowercaseTerm))
      ) {
        matchingContexts.push(context);
        continue;
      }
      
      // Check chunks content
      const hasMatchingChunk = context.chunks.some((chunk: ContextChunk) => 
        chunk.content.toLowerCase().includes(lowercaseTerm) ||
        chunk.type.toLowerCase().includes(lowercaseTerm) ||
        Object.entries(chunk.metadata).some(([key, value]) => 
          key.toLowerCase().includes(lowercaseTerm) || 
          String(value).toLowerCase().includes(lowercaseTerm)
        )
      );
      
      if (hasMatchingChunk) {
        matchingContexts.push(context);
        continue;
      }
      
      // Check context metadata
      const hasMatchingMetadata = Object.entries(context.metadata).some(([key, value]) => 
        key.toLowerCase().includes(lowercaseTerm) || 
        String(value).toLowerCase().includes(lowercaseTerm)
      );
      
      if (hasMatchingMetadata) {
        matchingContexts.push(context);
      }
    }
    
    return matchingContexts;
  }
  
  /**
   * Add a strategic plan to a context
   */
  async addStrategicPlan(
    contextId: string,
    title: string,
    description: string,
    status: StrategicPlan['status'] = 'pending'
  ): Promise<StrategicPlan | null> {
    const context = await this.getContext(contextId);
    
    if (!context) {
      return null;
    }
    
    const timestamp = new Date();
    const newPlan: StrategicPlan = {
      id: uuidv4(),
      title,
      description,
      status,
      createdAt: timestamp,
      updatedAt: timestamp
    };
    
    context.strategicPlans.push(newPlan);
    context.updatedAt = timestamp;
    
    const key = `${context.sessionId}-${contextId}`;
    await this.persistenceLayer.save(key, context);
    console.log(`Added strategic plan to context: ${key}`);
    
    return newPlan;
  }
  
  /**
   * Update a strategic plan status
   */
  async updateStrategicPlan(
    contextId: string,
    planId: string,
    updates: Partial<Omit<StrategicPlan, 'id' | 'createdAt'>>
  ): Promise<StrategicPlan | null> {
    const context = await this.getContext(contextId);
    
    if (!context) {
      return null;
    }
    
    const planIndex = context.strategicPlans.findIndex(plan => plan.id === planId);
    
    if (planIndex === -1) {
      return null;
    }
    
    const plan = context.strategicPlans[planIndex];
    const updatedPlan: StrategicPlan = {
      ...plan,
      ...updates,
      updatedAt: new Date(),
      // Make sure these fields don't get overwritten
      id: plan.id,
      createdAt: plan.createdAt
    };
    
    context.strategicPlans[planIndex] = updatedPlan;
    context.updatedAt = new Date();
    
    const key = `${context.sessionId}-${contextId}`;
    await this.persistenceLayer.save(key, context);
    console.log(`Updated strategic plan in context: ${key}`);
    
    return updatedPlan;
  }
  
  /**
   * Delete a context by ID
   */
  async deleteContext(contextId: string): Promise<boolean> {
    const context = await this.getContext(contextId);
    
    if (!context) {
      return false;
    }
    
    const key = `${context.sessionId}-${contextId}`;
    const result = await this.persistenceLayer.delete(key);
    
    if (result) {
      console.log(`Deleted context: ${key}`);
    }
    
    return result;
  }
}

/**
 * Create a new persistent context handler
 * @param config Configuration options
 * @returns A new instance of PersistentContextHandler
 */
export function createContextHandler(config: ContextHandlerConfig = {}): PersistentContextHandler {
  const baseDir = config.baseDir || process.cwd();
  const storageDir = path.join(baseDir, 'contexts');
  const persistenceLayer = new FileSystemPersistenceLayer(storageDir);
  return new PersistentContextHandler(persistenceLayer);
}

// For backward compatibility, export a default instance
// In a proper DI system, this would be configured at application startup
export const persistentContextHandler = createContextHandler();
