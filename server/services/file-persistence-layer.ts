/**
 * File-based Persistence Layer
 * 
 * This module implements a file-based persistence layer that handles storing
 * and retrieving data from disk. It includes enhanced date serialization/deserialization
 * using the consolidated date-serialization.js utilities.
 */

import { promises as fs } from 'fs';
import * as fsSync from 'fs';
import path from 'path';
import { IPersistenceLayer } from './persistent-context-handler.js';

// Import the date serialization utilities - supporting both ESM and CommonJS
let dateUtils: any;
try {
  // Try ESM import first (TypeScript)
  dateUtils = require('./utils/date-serialization');
} catch (e) {
  try {
    // Fallback to direct import (CommonJS/JavaScript)
    dateUtils = require('./utils/date-serialization.js');
  } catch (e2) {
    console.error('Failed to import date-serialization utilities:', e2);
    // Fallback to simpler implementation if import fails
    dateUtils = {
      parseJsonWithDates: (json: string) => JSON.parse(json),
      processObjectWithDates: (obj: any) => obj,
      deepCloneWithDates: (obj: any) => JSON.parse(JSON.stringify(obj))
    };
  }
}

// Extract the utilities we need
const { parseJsonWithDates, processObjectWithDates, deepCloneWithDates } = dateUtils;

/**
 * Configuration for the file persistence layer
 */
export interface FileSystemPersistenceLayerConfig {
  /**
   * Base directory for storing files
   * Default: './data'
   */
  baseDir?: string;
}

/**
 * Implementation of a file-based persistence layer with enhanced date handling
 */
export class FileSystemPersistenceLayer implements IPersistenceLayer {
  private baseDir: string;
  
  /**
   * Create a new file-based persistence layer
   * @param config Configuration options
   */
  constructor(config?: FileSystemPersistenceLayerConfig) {
    this.baseDir = config?.baseDir || './data';
    this.ensureDirectoryExists(this.baseDir);
    console.log(`FileSystemPersistenceLayer: initialized with base directory: ${this.baseDir}`);
  }
  
  /**
   * Save data to a file with proper date handling
   * @param key Unique identifier for the data (filename)
   * @param data Data to save
   */
  async save(key: string, data: any): Promise<void> {
    console.log(`FileSystemPersistenceLayer: saving data for key: ${key}`);
    
    try {
      // Ensure the key is a valid filename
      const sanitizedKey = this.sanitizeFilename(key);
      const filePath = path.join(this.baseDir, sanitizedKey);
      
      // Create a deep clone to avoid modifying the original data
      // This also preserves Date objects correctly
      const processedData = deepCloneWithDates(data);
      
      // Stringify the processed data
      const serializedData = JSON.stringify(processedData, null, 2);
      
      // Write to file
      await fs.writeFile(filePath, serializedData, 'utf8');
      console.log(`FileSystemPersistenceLayer: data saved successfully for key: ${key}`);
    } catch (error) {
      console.error(`FileSystemPersistenceLayer: error saving data for key: ${key}`, error);
      throw error;
    }
  }
  
  /**
   * Load data from a file with proper date revival
   * @param key Unique identifier for the data (filename)
   * @returns The data if found, null otherwise
   */
  async load(key: string): Promise<any | null> {
    console.log(`FileSystemPersistenceLayer: loading data for key: ${key}`);
    
    try {
      // Ensure the key is a valid filename
      const sanitizedKey = this.sanitizeFilename(key);
      const filePath = path.join(this.baseDir, sanitizedKey);
      
      // Check if the file exists
      if (!await this.fileExists(filePath)) {
        console.log(`FileSystemPersistenceLayer: no data found for key: ${key}`);
        return null;
      }
      
      // Read from file
      const data = await fs.readFile(filePath, 'utf8');
      
      // Parse the data with enhanced date handling
      const parsedData = parseJsonWithDates(data);
      
      // Additional processing to ensure all nested date objects are properly handled
      const processedData = processObjectWithDates(parsedData);
      
      console.log(`FileSystemPersistenceLayer: data loaded successfully for key: ${key}`);
      return processedData;
    } catch (error) {
      console.error(`FileSystemPersistenceLayer: error loading data for key: ${key}`, error);
      // Return null on error instead of throwing to be more resilient
      return null;
    }
  }
  
  /**
   * Get all keys (filenames) in the storage
   * @param prefix Optional prefix to filter keys by
   * @returns Array of keys
   */
  async getKeys(prefix?: string): Promise<string[]> {
    console.log(`FileSystemPersistenceLayer: getting keys${prefix ? ` with prefix: ${prefix}` : ''}`);
    
    try {
      // Get all files in the directory
      const files = await fs.readdir(this.baseDir);
      
      // Filter by prefix if provided
      let keys = files;
      if (prefix) {
        keys = files.filter(file => file.startsWith(prefix));
      }
      
      console.log(`FileSystemPersistenceLayer: found ${keys.length} keys`);
      return keys;
    } catch (error) {
      console.error('FileSystemPersistenceLayer: error getting keys', error);
      // Return empty array on error instead of throwing
      return [];
    }
  }
  
  /**
   * Delete a file
   * @param key Unique identifier for the data (filename)
   * @returns True if the file was deleted, false otherwise
   */
  async delete(key: string): Promise<boolean> {
    console.log(`FileSystemPersistenceLayer: deleting data for key: ${key}`);
    
    try {
      // Ensure the key is a valid filename
      const sanitizedKey = this.sanitizeFilename(key);
      const filePath = path.join(this.baseDir, sanitizedKey);
      
      // Check if the file exists
      if (!await this.fileExists(filePath)) {
        console.log(`FileSystemPersistenceLayer: no data found to delete for key: ${key}`);
        return false;
      }
      
      // Delete the file
      await fs.unlink(filePath);
      
      console.log(`FileSystemPersistenceLayer: data deleted successfully for key: ${key}`);
      return true;
    } catch (error) {
      console.error(`FileSystemPersistenceLayer: error deleting data for key: ${key}`, error);
      return false;
    }
  }
  
  /**
   * Ensure a directory exists, creating it if necessary
   * @param dirPath Path to directory
   */
  private ensureDirectoryExists(dirPath: string): void {
    try {
      if (!fsSync.existsSync(dirPath)) {
        fsSync.mkdirSync(dirPath, { recursive: true });
        console.log(`FileSystemPersistenceLayer: created directory: ${dirPath}`);
      }
    } catch (error) {
      console.error(`FileSystemPersistenceLayer: error creating directory: ${dirPath}`, error);
      throw error;
    }
  }
  
  /**
   * Check if a file exists
   * @param filePath Path to file
   * @returns True if the file exists, false otherwise
   */
  private async fileExists(filePath: string): Promise<boolean> {
    try {
      await fs.access(filePath);
      return true;
    } catch {
      return false;
    }
  }
  
  /**
   * Sanitize a filename to prevent directory traversal attacks and invalid characters
   * @param filename Filename to sanitize
   * @returns Sanitized filename
   */
  private sanitizeFilename(filename: string): string {
    // Remove any directory components or special characters
    return filename.replace(/[\/\\?%*:|"<>]/g, '-');
  }
}

/**
 * Factory function to create a FileSystemPersistenceLayer
 * @param config Configuration options
 * @returns A new FileSystemPersistenceLayer instance
 */
export function createFileSystemPersistenceLayer(
  config?: FileSystemPersistenceLayerConfig
): IPersistenceLayer {
  return new FileSystemPersistenceLayer(config);
}

// CommonJS compatibility for Jest tests
// eslint-disable-next-line @typescript-eslint/no-explicit-any
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    FileSystemPersistenceLayer,
    createFileSystemPersistenceLayer
  };
}