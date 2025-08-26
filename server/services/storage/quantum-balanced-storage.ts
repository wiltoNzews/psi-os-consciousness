/**
 * Quantum-Balanced Storage Service
 * 
 * This module demonstrates the implementation of the Explicit-Implicit Quantum Balance
 * principle in a storage service, using the decohere method to make explicit tactical
 * decisions while maintaining implicit strategic flexibility.
 * 
 * BOUNDARY AWARENESS: This module explicitly defines the boundary between
 * in-memory operations and persistence, ensuring clear, intentional transitions.
 * 
 * RESPONSIBILITY: This module has the single responsibility of providing a quantum-balanced
 * storage interface that can adapt to different contexts while preventing recursion loops.
 */

import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import fs from 'fs/promises';
import { quantumGlossary, StrategicContext } from '../qrn/quantum-glossary.js';
import { QuantumState } from '../../../shared/schema-minimal.js';
import { ChronosDateHandler } from '../utils/chronos-date-handler.js';
import { FileNotFoundError, InvalidDataError, StorageOperationError } from './errors/index.js';
import { formatWithSymbolicPrefix } from '../../utils/symbolic-utils.js';

/**
 * Interface for storage operations
 */
export interface IQuantumBalancedStorage {
  create(id: string, data: any): Promise<void>;
  read(id: string): Promise<any>;
  update(id: string, data: any): Promise<void>;
  delete(id: string): Promise<boolean>;
  list(): Promise<string[]>;
  exists(id: string): Promise<boolean>;
}

/**
 * Implementation of storage with Explicit-Implicit Quantum Balance
 */
export class QuantumBalancedStorage implements IQuantumBalancedStorage {
  private basePath: string;
  private memCache: Map<string, any>;
  private persistQueue: string[];
  private isWorkerRunning: boolean;
  
  /**
   * Initialize the storage service
   * 
   * @param basePath Base path for persistent storage
   */
  constructor(basePath: string) {
    this.basePath = basePath;
    this.memCache = new Map<string, any>();
    this.persistQueue = [];
    this.isWorkerRunning = false;
    
    // Ensure base directory exists
    this.ensureBaseDirectory();
  }
  
  /**
   * Create a new item in storage
   * 
   * @param id Item ID
   * @param data Item data
   */
  async create(id: string, data: any): Promise<void> {
    // Define strategic context for storage operation
    const storageContext: StrategicContext = {
      contextDescription: "Determining optimal creation strategy for data",
      possibleNextActions: [
        "Direct persistence with immediate write",
        "Cache with delayed persistence",
        "Cache-only for volatile data",
        "Chunked storage for large data"
      ],
      metadata: {
        dataSize: JSON.stringify(data).length,
        isLargeData: JSON.stringify(data).length > 10000,
        hasExistingItem: await this.exists(id),
        operationType: "create"
      }
    };
    
    // Use decohere to explicitly choose the storage strategy
    const storageStrategy = quantumGlossary.decohere(storageContext);
    console.log(`[QuantumBalancedStorage] Using creation strategy: ${storageStrategy} for item ${id}`);
    
    // Execute the chosen strategy
    if (storageStrategy === "Direct persistence with immediate write") {
      await this.directWrite(id, data);
    } 
    else if (storageStrategy === "Cache with delayed persistence") {
      this.memCache.set(id, this.prepareDataForStorage(data));
      this.schedulePersistence(id);
    }
    else if (storageStrategy === "Cache-only for volatile data") {
      this.memCache.set(id, this.prepareDataForStorage(data));
    }
    else if (storageStrategy === "Chunked storage for large data") {
      await this.chunkedWrite(id, data);
    }
    else {
      // Fallback to direct write
      await this.directWrite(id, data);
    }
    
    // Record flow metric for this operation
    quantumGlossary.recordFlowMetric(
      QuantumState.SIM_FLOW,
      'storage_create',
      100,
      { 
        itemId: id, 
        strategy: storageStrategy
      }
    );
  }
  
  /**
   * Read an item from storage
   * 
   * @param id Item ID
   * @returns Item data or undefined if not found
   */
  async read(id: string): Promise<any> {
    // Define strategic context for retrieval
    const retrievalContext: StrategicContext = {
      contextDescription: "Determining optimal retrieval strategy",
      possibleNextActions: [
        "Cache-first with fallback to file",
        "Direct file read",
        "Chunked read for large data"
      ],
      metadata: {
        inCache: this.memCache.has(id),
        operationType: "read"
      }
    };
    
    // Use decohere to explicitly choose the retrieval strategy
    const retrievalStrategy = quantumGlossary.decohere(retrievalContext);
    console.log(`[QuantumBalancedStorage] Using retrieval strategy: ${retrievalStrategy} for item ${id}`);
    
    try {
      // Execute the chosen strategy
      let result: any;
      
      if (retrievalStrategy === "Cache-first with fallback to file") {
        result = this.memCache.get(id);
        
        if (!result) {
          result = await this.directRead(id);
          
          // Add to cache if found
          if (result) {
            this.memCache.set(id, result);
          }
        }
      } 
      else if (retrievalStrategy === "Direct file read") {
        result = await this.directRead(id);
      }
      else if (retrievalStrategy === "Chunked read for large data") {
        result = await this.chunkedRead(id);
      }
      else {
        // Fallback to direct read
        result = await this.directRead(id);
      }
      
      // Record flow metric for successful retrieval
      if (result) {
        quantumGlossary.recordFlowMetric(
          QuantumState.SIM_FLOW,
          'storage_read',
          100,
          { 
            itemId: id, 
            strategy: retrievalStrategy,
            found: true
          }
        );
      } else {
        quantumGlossary.recordFlowMetric(
          QuantumState.SIM_ANTIFLOW,
          'storage_read',
          0,
          { 
            itemId: id, 
            strategy: retrievalStrategy,
            found: false
          }
        );
      }
      
      return result;
    } catch (error: any) {
      // Record flow metric for retrieval error
      quantumGlossary.recordFlowMetric(
        QuantumState.SIM_ANTIFLOW,
        'storage_read',
        0,
        { 
          itemId: id, 
          strategy: retrievalStrategy,
          error: error.message
        }
      );
      
      console.error(quantumGlossary.tagWithContext(`Error reading item ${id}: ${error.message}`));
      throw error;
    }
  }
  
  /**
   * Update an existing item in storage
   * 
   * @param id Item ID
   * @param data Updated data
   */
  async update(id: string, data: any): Promise<void> {
    // Define strategic context for update
    const updateContext: StrategicContext = {
      contextDescription: "Determining optimal update strategy",
      possibleNextActions: [
        "Direct file update",
        "Cache update with delayed persistence",
        "Delta update for existing data"
      ],
      metadata: {
        inCache: this.memCache.has(id),
        exists: await this.exists(id),
        dataSize: JSON.stringify(data).length,
        operationType: "update"
      }
    };
    
    // Use decohere to explicitly choose the update strategy
    const updateStrategy = quantumGlossary.decohere(updateContext);
    console.log(`[QuantumBalancedStorage] Using update strategy: ${updateStrategy} for item ${id}`);
    
    try {
      // Check if item exists
      const exists = await this.exists(id);
      
      if (!exists) {
        throw new Error(`Cannot update non-existent item: ${id}`);
      }
      
      // Execute the chosen strategy
      if (updateStrategy === "Direct file update") {
        await this.directWrite(id, data);
        
        // Update cache if present
        if (this.memCache.has(id)) {
          this.memCache.set(id, this.prepareDataForStorage(data));
        }
      } 
      else if (updateStrategy === "Cache update with delayed persistence") {
        this.memCache.set(id, this.prepareDataForStorage(data));
        this.schedulePersistence(id);
      }
      else if (updateStrategy === "Delta update for existing data") {
        await this.deltaUpdate(id, data);
      }
      else {
        // Fallback to direct update
        await this.directWrite(id, data);
      }
      
      // Record flow metric for update
      quantumGlossary.recordFlowMetric(
        QuantumState.SIM_FLOW,
        'storage_update',
        100,
        { 
          itemId: id, 
          strategy: updateStrategy
        }
      );
    } catch (error: any) {
      // Record flow metric for update error
      quantumGlossary.recordFlowMetric(
        QuantumState.SIM_ANTIFLOW,
        'storage_update',
        0,
        { 
          itemId: id, 
          strategy: updateStrategy,
          error: error.message
        }
      );
      
      console.error(quantumGlossary.tagWithContext(`Error updating item ${id}: ${error.message}`));
      throw error;
    }
  }
  
  /**
   * Delete an item from storage
   * 
   * @param id Item ID
   * @returns True if deleted, false if not found
   */
  async delete(id: string): Promise<boolean> {
    // Define strategic context for deletion
    const deletionContext: StrategicContext = {
      contextDescription: "Determining optimal deletion strategy",
      possibleNextActions: [
        "Immediate file and cache deletion",
        "Cache deletion with delayed file removal",
        "Soft delete with retention"
      ],
      metadata: {
        inCache: this.memCache.has(id),
        exists: await this.exists(id),
        operationType: "delete"
      }
    };
    
    // Use decohere to explicitly choose the deletion strategy
    const deletionStrategy = quantumGlossary.decohere(deletionContext);
    console.log(`[QuantumBalancedStorage] Using deletion strategy: ${deletionStrategy} for item ${id}`);
    
    try {
      let success = false;
      
      // Execute the chosen strategy
      if (deletionStrategy === "Immediate file and cache deletion") {
        // Remove from cache
        this.memCache.delete(id);
        
        // Remove from file system
        const filePath = this.getFilePath(id);
        try {
          await fs.unlink(filePath);
          success = true;
        } catch (error: any) {
          if (error.code !== 'ENOENT') {
            throw error;
          }
          // File didn't exist, but we still removed from cache
          success = this.memCache.has(id);
        }
        
        // Also check for chunks
        const chunksDir = path.join(this.basePath, 'chunks', id);
        try {
          const files = await fs.readdir(chunksDir);
          for (const file of files) {
            await fs.unlink(path.join(chunksDir, file));
          }
          await fs.rmdir(chunksDir);
          success = true;
        } catch (error) {
          // Chunks directory might not exist, ignore
        }
      } 
      else if (deletionStrategy === "Cache deletion with delayed file removal") {
        // Remove from cache immediately
        this.memCache.delete(id);
        
        // Add to deletion queue for background processing
        this.scheduleDeletion(id);
        success = true;
      }
      else if (deletionStrategy === "Soft delete with retention") {
        // Implement a soft delete by adding a metadata flag
        const data = await this.read(id);
        
        if (data) {
          data._deleted = true;
          data._deletedAt = ChronosDateHandler.createDate().toISOString();
          
          // Update the data but keep it
          await this.directWrite(id, data);
          success = true;
        }
      }
      else {
        // Fallback to immediate deletion
        this.memCache.delete(id);
        
        const filePath = this.getFilePath(id);
        try {
          await fs.unlink(filePath);
          success = true;
        } catch (error: any) {
          if (error.code !== 'ENOENT') {
            throw error;
          }
        }
      }
      
      // Record flow metric for deletion
      quantumGlossary.recordFlowMetric(
        QuantumState.SIM_FLOW,
        'storage_delete',
        success ? 100 : 50,
        { 
          itemId: id, 
          strategy: deletionStrategy,
          success
        }
      );
      
      return success;
    } catch (error: any) {
      // Record flow metric for deletion error
      quantumGlossary.recordFlowMetric(
        QuantumState.SIM_ANTIFLOW,
        'storage_delete',
        0,
        { 
          itemId: id, 
          strategy: deletionStrategy,
          error: error.message
        }
      );
      
      console.error(quantumGlossary.tagWithContext(`Error deleting item ${id}: ${error.message}`));
      throw error;
    }
  }
  
  /**
   * List all items in storage
   * 
   * @returns Array of item IDs
   */
  async list(): Promise<string[]> {
    // Define strategic context for listing
    const listingContext: StrategicContext = {
      contextDescription: "Determining optimal listing strategy",
      possibleNextActions: [
        "Combined cache and file listing",
        "File-only listing",
        "Cache-only listing"
      ],
      metadata: {
        cacheSize: this.memCache.size,
        operationType: "list"
      }
    };
    
    // Use decohere to explicitly choose the listing strategy
    const listingStrategy = quantumGlossary.decohere(listingContext);
    console.log(`[QuantumBalancedStorage] Using listing strategy: ${listingStrategy}`);
    
    try {
      let results: string[] = [];
      
      // Execute the chosen strategy
      if (listingStrategy === "Combined cache and file listing") {
        // Get IDs from cache
        const cacheIds = Array.from(this.memCache.keys());
        
        // Get IDs from files
        let fileIds: string[] = [];
        try {
          const files = await fs.readdir(this.basePath);
          fileIds = files
            .filter(file => file.endsWith('.json'))
            .map(file => file.replace('.json', ''));
        } catch (error: any) {
          if (error.code !== 'ENOENT') {
            throw error;
          }
          // Directory doesn't exist, use empty array
        }
        
        // Combine and deduplicate
        results = [...new Set([...cacheIds, ...fileIds])];
      } 
      else if (listingStrategy === "File-only listing") {
        try {
          const files = await fs.readdir(this.basePath);
          results = files
            .filter(file => file.endsWith('.json'))
            .map(file => file.replace('.json', ''));
        } catch (error: any) {
          if (error.code === 'ENOENT') {
            // Directory doesn't exist, return empty array
            results = [];
          } else {
            throw error;
          }
        }
      }
      else if (listingStrategy === "Cache-only listing") {
        results = Array.from(this.memCache.keys());
      }
      else {
        // Fallback to file-only listing
        try {
          const files = await fs.readdir(this.basePath);
          results = files
            .filter(file => file.endsWith('.json'))
            .map(file => file.replace('.json', ''));
        } catch (error: any) {
          if (error.code === 'ENOENT') {
            results = [];
          } else {
            throw error;
          }
        }
      }
      
      // Record flow metric for listing
      quantumGlossary.recordFlowMetric(
        QuantumState.SIM_FLOW,
        'storage_list',
        100,
        { 
          strategy: listingStrategy,
          count: results.length
        }
      );
      
      return results;
    } catch (error: any) {
      // Record flow metric for listing error
      quantumGlossary.recordFlowMetric(
        QuantumState.SIM_ANTIFLOW,
        'storage_list',
        0,
        { 
          strategy: listingStrategy,
          error: error.message
        }
      );
      
      console.error(quantumGlossary.tagWithContext(`Error listing items: ${error.message}`));
      throw error;
    }
  }
  
  /**
   * Check if an item exists in storage
   * 
   * @param id Item ID
   * @returns True if exists, false otherwise
   */
  async exists(id: string): Promise<boolean> {
    // Define strategic context for existence check
    const existsContext: StrategicContext = {
      contextDescription: "Determining optimal existence check strategy",
      possibleNextActions: [
        "Cache-first with fallback to file",
        "File-only check",
        "Combined check (either cache or file)"
      ],
      metadata: {
        inCache: this.memCache.has(id),
        operationType: "exists"
      }
    };
    
    // Use decohere to explicitly choose the check strategy
    const checkStrategy = quantumGlossary.decohere(existsContext);
    console.log(`[QuantumBalancedStorage] Using existence check strategy: ${checkStrategy} for item ${id}`);
    
    try {
      let exists = false;
      
      // Execute the chosen strategy
      if (checkStrategy === "Cache-first with fallback to file") {
        exists = this.memCache.has(id);
        
        if (!exists) {
          exists = await this.fileExists(id);
        }
      } 
      else if (checkStrategy === "File-only check") {
        exists = await this.fileExists(id);
      }
      else if (checkStrategy === "Combined check (either cache or file)") {
        exists = this.memCache.has(id) || await this.fileExists(id);
      }
      else {
        // Fallback to combined check
        exists = this.memCache.has(id) || await this.fileExists(id);
      }
      
      // Record flow metric for existence check
      quantumGlossary.recordFlowMetric(
        QuantumState.SIM_FLOW,
        'storage_exists',
        100,
        { 
          itemId: id, 
          strategy: checkStrategy,
          exists
        }
      );
      
      return exists;
    } catch (error: any) {
      // Record flow metric for check error
      quantumGlossary.recordFlowMetric(
        QuantumState.SIM_ANTIFLOW,
        'storage_exists',
        0,
        { 
          itemId: id, 
          strategy: checkStrategy,
          error: error.message
        }
      );
      
      console.error(quantumGlossary.tagWithContext(`Error checking existence of item ${id}: ${error.message}`));
      throw error;
    }
  }
  
  /**
   * Ensure the base directory exists
   */
  private async ensureBaseDirectory(): Promise<void> {
    try {
      await fs.mkdir(this.basePath, { recursive: true });
      await fs.mkdir(path.join(this.basePath, 'chunks'), { recursive: true });
    } catch (error: any) {
      console.error(quantumGlossary.tagWithContext(`Error creating storage directories: ${error.message}`));
    }
  }
  
  /**
   * Get the file path for an item
   * 
   * @param id Item ID
   * @returns Full file path
   */
  private getFilePath(id: string): string {
    return path.join(this.basePath, `${id}.json`);
  }
  
  /**
   * Check if a file exists
   * 
   * @param id Item ID
   * @returns True if exists, false otherwise
   */
  private async fileExists(id: string): Promise<boolean> {
    const filePath = this.getFilePath(id);
    try {
      await fs.access(filePath);
      return true;
    } catch {
      return false;
    }
  }
  
  /**
   * Directly write data to a file
   * 
   * @param id Item ID
   * @param data Item data
   */
  private async directWrite(id: string, data: any): Promise<void> {
    const filePath = this.getFilePath(id);
    const preparedData = this.prepareDataForStorage(data);
    
    try {
      // Ensure JSON data is valid before writing
      const jsonData = JSON.stringify(preparedData, null, 2);
      
      // Make sure directory exists
      await fs.mkdir(path.dirname(filePath), { recursive: true });
      
      // Write the file
      await fs.writeFile(filePath, jsonData);
    } catch (error: any) {
      // Convert standard errors to our custom error types
      if (error.code === 'EACCES') {
        throw new StorageOperationError(
          `Permission denied writing file ${id}`, 
          'write',
          error
        );
      } else if (error instanceof TypeError && error.message.includes('circular structure')) {
        throw new InvalidDataError(
          `Cannot serialize circular reference in data for ${id}`,
          ['circular_reference']
        );
      } else {
        // For other filesystem errors
        throw new StorageOperationError(
          `Error writing file ${id}: ${error.message}`,
          'write',
          error
        );
      }
    }
  }
  
  /**
   * Directly read data from a file
   * 
   * @param id Item ID
   * @returns Item data or undefined if not found
   */
  private async directRead(id: string): Promise<any> {
    const filePath = this.getFilePath(id);
    try {
      const data = await fs.readFile(filePath, 'utf8');
      try {
        return JSON.parse(data, this.dateReviver);
      } catch (parseError: any) {
        throw new InvalidDataError(`Invalid JSON format in file ${id}: ${parseError.message}`);
      }
    } catch (error: any) {
      if (error.code === 'ENOENT') {
        // File not found is not an error for read operations, just return undefined
        return undefined;
      }
      
      // Convert standard errors to our custom error types
      if (error.code === 'EACCES') {
        throw new StorageOperationError(
          `Permission denied accessing file ${id}`, 
          'read',
          error
        );
      }
      
      // For other filesystem errors
      throw new StorageOperationError(
        `Error reading file ${id}: ${error.message}`,
        'read',
        error
      );
    }
  }
  
  /**
   * Write large data in chunks
   * 
   * @param id Item ID
   * @param data Item data
   */
  private async chunkedWrite(id: string, data: any): Promise<void> {
    const chunksDir = path.join(this.basePath, 'chunks', id);
    await fs.mkdir(chunksDir, { recursive: true });
    
    // Write metadata
    const preparedData = this.prepareDataForStorage(data);
    const dataStr = JSON.stringify(preparedData);
    const metadata = {
      id,
      chunked: true,
      totalSize: dataStr.length,
      chunkCount: 0,
      createdAt: ChronosDateHandler.createDate().toISOString(),
      updatedAt: ChronosDateHandler.createDate().toISOString()
    };
    
    await fs.writeFile(
      path.join(this.basePath, `${id}.json`), 
      JSON.stringify(metadata, null, 2)
    );
    
    // Write data chunks
    const chunkSize = 1024 * 100; // 100 KB chunks
    const chunkCount = Math.ceil(dataStr.length / chunkSize);
    
    for (let i = 0; i < chunkCount; i++) {
      const start = i * chunkSize;
      const end = Math.min(start + chunkSize, dataStr.length);
      const chunk = dataStr.substring(start, end);
      
      await fs.writeFile(
        path.join(chunksDir, `chunk_${i}.json`), 
        chunk
      );
    }
    
    // Update metadata with chunk count
    metadata.chunkCount = chunkCount;
    await fs.writeFile(
      path.join(this.basePath, `${id}.json`), 
      JSON.stringify(metadata, null, 2)
    );
  }
  
  /**
   * Read large data from chunks
   * 
   * @param id Item ID
   * @returns Item data or undefined if not found
   */
  private async chunkedRead(id: string): Promise<any> {
    try {
      // Read metadata
      const metadataPath = path.join(this.basePath, `${id}.json`);
      
      try {
        const metadataStr = await fs.readFile(metadataPath, 'utf8');
        
        try {
          const metadata = JSON.parse(metadataStr);
          
          if (!metadata.chunked) {
            // Not chunked, read directly
            return JSON.parse(metadataStr, this.dateReviver);
          }
          
          // Read chunks
          const chunksDir = path.join(this.basePath, 'chunks', id);
          let fullData = '';
          
          for (let i = 0; i < metadata.chunkCount; i++) {
            const chunkPath = path.join(chunksDir, `chunk_${i}.json`);
            try {
              const chunk = await fs.readFile(chunkPath, 'utf8');
              fullData += chunk;
            } catch (chunkError: any) {
              if (chunkError.code === 'ENOENT') {
                throw new FileNotFoundError(
                  `Chunk ${i} of ${id} not found at ${chunkPath}`,
                  chunkPath
                );
              } else {
                throw new StorageOperationError(
                  `Error reading chunk ${i} of ${id}: ${chunkError.message}`,
                  'read',
                  chunkError
                );
              }
            }
          }
          
          // Parse the full data
          try {
            return JSON.parse(fullData, this.dateReviver);
          } catch (parseError: any) {
            throw new InvalidDataError(
              `Invalid JSON format in reassembled chunks for ${id}: ${parseError.message}`
            );
          }
        } catch (parseError: any) {
          if (parseError instanceof InvalidDataError) {
            throw parseError;
          }
          throw new InvalidDataError(
            `Invalid JSON format in metadata file for ${id}: ${parseError.message}`
          );
        }
      } catch (readError: any) {
        if (readError.code === 'ENOENT') {
          return undefined;  // File not found is not an error, just return undefined
        }
        if (readError instanceof FileNotFoundError || 
            readError instanceof InvalidDataError ||
            readError instanceof StorageOperationError) {
          throw readError;  // Re-throw custom errors
        }
        throw new StorageOperationError(
          `Error reading metadata for ${id}: ${readError.message}`,
          'read',
          readError
        );
      }
    } catch (error: any) {
      // Only log non-ENOENT errors here for centralized logging
      if (!(error instanceof FileNotFoundError && error.message.includes('not found'))) {
        console.error(formatWithSymbolicPrefix(QuantumState.SIM_PARTIAL, 
          `Error in chunkedRead for ${id}: ${error.message}`));
      }
      throw error;
    }
  }
  
  /**
   * Update only changed fields in a file
   * 
   * @param id Item ID
   * @param newData New data
   */
  private async deltaUpdate(id: string, newData: any): Promise<void> {
    // Read existing data
    try {
      const existingData = await this.read(id);
      
      if (!existingData) {
        throw new FileNotFoundError(
          `Cannot perform delta update on non-existent item: ${id}`,
          this.getFilePath(id)
        );
      }
      
      // Validate new data
      if (!newData || typeof newData !== 'object') {
        throw new InvalidDataError(
          `Cannot update with invalid data for item ${id}`,
          ['invalid_update_data']
        );
      }
      
      // Merge data
      const mergedData = {
        ...existingData,
        ...newData,
        _updatedAt: ChronosDateHandler.createDate().toISOString()
      };
      
      // Write back
      await this.directWrite(id, mergedData);
      
      // Update cache if present
      if (this.memCache.has(id)) {
        this.memCache.set(id, this.prepareDataForStorage(mergedData));
      }
    } catch (error: any) {
      // Use our custom error format for Quantum Symbolic Prefix logging
      console.error(formatWithSymbolicPrefix(QuantumState.SIM_PARTIAL, 
        `Delta update failed for ${id}: ${error.message}`));
        
      // Rethrow to let caller handle
      if (error instanceof FileNotFoundError || 
          error instanceof InvalidDataError ||
          error instanceof StorageOperationError) {
        throw error;
      } else {
        throw new StorageOperationError(
          `Error during delta update of ${id}: ${error.message}`,
          'update',
          error
        );
      }
    }
  }
  
  /**
   * Prepare data for storage by handling dates
   * 
   * @param data Data to prepare
   * @returns Prepared data
   */
  private prepareDataForStorage(data: any): any {
    if (!data) return data;
    
    // Clone the data
    const prepared = JSON.parse(JSON.stringify(data, this.dateReplacer));
    
    // Add metadata if not present
    if (typeof prepared === 'object' && prepared !== null) {
      if (!prepared._createdAt) {
        prepared._createdAt = ChronosDateHandler.createDate().toISOString();
      }
      prepared._updatedAt = ChronosDateHandler.createDate().toISOString();
    }
    
    return prepared;
  }
  
  /**
   * Schedule persistence for an item
   * 
   * @param id Item ID
   */
  private schedulePersistence(id: string): void {
    if (!this.persistQueue.includes(id)) {
      this.persistQueue.push(id);
    }
    
    this.startPersistenceWorker();
  }
  
  /**
   * Start the persistence worker if not already running
   */
  private startPersistenceWorker(): void {
    if (this.isWorkerRunning) return;
    
    this.isWorkerRunning = true;
    this.processPersistenceQueue().catch(error => {
      console.error(quantumGlossary.tagWithContext(`Error in persistence worker: ${error.message}`));
      this.isWorkerRunning = false;
    });
  }
  
  /**
   * Process the persistence queue
   */
  private async processPersistenceQueue(): Promise<void> {
    while (this.persistQueue.length > 0) {
      const id = this.persistQueue.shift()!;
      const data = this.memCache.get(id);
      
      if (data) {
        try {
          await this.directWrite(id, data);
        } catch (error: any) {
          // Use Symbolic Communication Protocol for error logging
          console.error(formatWithSymbolicPrefix(QuantumState.SIM_ANTIFLOW, 
            `Error persisting item ${id}: ${error.message}`));
          
          // Record the error in metrics
          quantumGlossary.recordFlowMetric(
            QuantumState.SIM_ANTIFLOW, // Using SIM_ANTIFLOW for failed operations
            'persistence_worker',
            0, // 0 indicates failure
            {
              itemId: id,
              errorType: error.name || 'Unknown',
              errorMessage: error.message
            }
          );
          
          // Retry later
          this.persistQueue.push(id);
        }
      }
      
      // Avoid blocking
      await new Promise(resolve => setTimeout(resolve, 0));
    }
    
    this.isWorkerRunning = false;
  }
  
  /**
   * Schedule deletion for an item
   * 
   * @param id Item ID
   */
  private scheduleDeletion(id: string): void {
    // This would normally add to a deletion queue and process in the background
    // For this example, we'll do it immediately
    setTimeout(async () => {
      try {
        const filePath = this.getFilePath(id);
        try {
          await fs.unlink(filePath);
          
          // Record successful deletion in metrics
          quantumGlossary.recordFlowMetric(
            QuantumState.SIM_FLOW, // Using SIM_FLOW for successful operations
            'deletion_worker',
            1, // 1 indicates success
            {
              itemId: id,
              operation: 'delete_file'
            }
          );
        } catch (fileError: any) {
          // Silently ignore file deletion errors, but track them in metrics
          if (fileError.code !== 'ENOENT') {
            quantumGlossary.recordFlowMetric(
              QuantumState.SIM_PARTIAL, // Using SIM_PARTIAL for partially successful operations
              'deletion_worker',
              0.5, // 0.5 indicates partial success (chunks might still be deleted)
              {
                itemId: id,
                errorType: fileError.name || 'Unknown',
                errorMessage: fileError.message,
                operation: 'delete_file'
              }
            );
          }
        }
        
        // Also check for chunks
        const chunksDir = path.join(this.basePath, 'chunks', id);
        try {
          const files = await fs.readdir(chunksDir);
          let deletedCount = 0;
          
          for (const file of files) {
            try {
              await fs.unlink(path.join(chunksDir, file));
              deletedCount++;
            } catch (chunkError: any) {
              // Log chunk deletion failures but continue
              console.error(formatWithSymbolicPrefix(QuantumState.SIM_PARTIAL, 
                `Failed to delete chunk ${file} for ${id}: ${chunkError.message}`));
            }
          }
          
          // Try to remove the directory
          try {
            await fs.rmdir(chunksDir);
          } catch (rmError: any) {
            console.error(formatWithSymbolicPrefix(QuantumState.SIM_PARTIAL, 
              `Failed to remove chunks directory for ${id}: ${rmError.message}`));
          }
          
          // Record chunk deletion metrics
          if (deletedCount === files.length) {
            quantumGlossary.recordFlowMetric(
              QuantumState.SIM_FLOW, // Using SIM_FLOW for successful operations
              'deletion_worker',
              1, // 1 indicates success
              {
                itemId: id,
                operation: 'delete_chunks',
                chunkCount: files.length
              }
            );
          } else {
            quantumGlossary.recordFlowMetric(
              QuantumState.SIM_PARTIAL, // Using SIM_PARTIAL for partially successful operations
              'deletion_worker',
              deletedCount / files.length, // Partial success ratio
              {
                itemId: id,
                operation: 'delete_chunks',
                chunkCount: files.length,
                deletedCount
              }
            );
          }
        } catch (dirError: any) {
          // Only log if not file not found error
          if (dirError.code !== 'ENOENT') {
            console.error(formatWithSymbolicPrefix(QuantumState.SIM_PARTIAL, 
              `Error accessing chunks directory for ${id}: ${dirError.message}`));
          }
        }
      } catch (error: any) {
        // Log using Symbolic Communication Protocol
        console.error(formatWithSymbolicPrefix(QuantumState.SIM_ANTIFLOW, 
          `Error in delayed deletion of ${id}: ${error.message}`));
          
        // Record the error in metrics
        quantumGlossary.recordFlowMetric(
          QuantumState.SIM_ANTIFLOW, // Using SIM_ANTIFLOW for failed operations
          'deletion_worker',
          0, // 0 indicates failure
          {
            itemId: id,
            errorType: error.name || 'Unknown',
            errorMessage: error.message
          }
        );
      }
    }, 100);
  }
  
  /**
   * Replacer function for JSON.stringify to handle Date objects
   */
  private dateReplacer(key: string, value: any): any {
    if (value instanceof Date) {
      return { 
        __type: 'date', 
        value: value.toISOString() 
      };
    }
    return value;
  }
  
  /**
   * Reviver function for JSON.parse to handle Date objects
   */
  private dateReviver(key: string, value: any): any {
    if (value && typeof value === 'object' && value.__type === 'date') {
      return new Date(value.value);
    }
    return value;
  }
}