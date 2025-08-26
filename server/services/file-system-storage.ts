/**
 * File System Storage Implementation
 * 
 * This module provides a file-based implementation of the storage interface for persisting
 * system metrics, stability data, and other critical system components.
 * 
 * IMPORTANT: This system uses pure file-based storage with NO Drizzle ORM dependencies.
 * (See DRIZZLE_REMOVAL_DOCUMENTATION.md for details on the complete removal of Drizzle)
 * 
 * All persistence is handled through direct file system operations for maximum reliability
 * and simplicity, following TSAR BOMBA verification principles with explicit boundary handling.
 */

import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import { v4 as uuidv4 } from 'uuid';
import { IStorage } from '../storage.js';
import ChronosDateHandler from './utils/chronos-date-handler.js';
import {
  User,
  InsertUser,
  ApiKey,
  InsertApiKey,
  SystemLog,
  InsertSystemLog,
  MediaAsset,
  InsertMediaAsset,
  PipelineJob,
  InsertPipelineJob,
  ScheduledTask,
  InsertScheduledTask,
  QuantumRootNode,
  InsertQuantumRootNode,
  NeuralPathway,
  InsertNeuralPathway,
  TemporalInstance,
  InsertTemporalInstance,
  MetaCognitiveEvent,
  InsertMetaCognitiveEvent,
  Chunk,
  InsertChunk,
  ChunkDependency,
  InsertChunkDependency,
  AdaptiveResonance,
  InsertAdaptiveResonance,
  AiModel,
  InsertAiModel,
  Dataset,
  InsertDataset,
  DataColumn,
  InsertDataColumn,
  DataColumn,
  InsertDataColumn,
  Transformation,
  InsertTransformation,
  AnalysisModel,
  InsertAnalysisModel,
  AnalysisResult,
  InsertAnalysisResult,
  Insight,
  InsertInsight,
  Report,
  InsertReport,
  chunkStatesEnum
} from '../../shared/schema-minimal';

/**
 * File System Storage
 * 
 * A file-based implementation of the storage interface that persists data to the file system
 * in JSON format. This provides reliable persistence without the complexity of an ORM or
 * database system.
 */
export class FileSystemStorage implements Partial<IStorage> {
  private baseDir: string;
  private metricsDir: string;
  private stabilityDir: string;
  private qrnMetricsDir: string;
  private systemMetricsDir: string;
  private tasksDir: string;
  private chunksDir: string;
  private chunkDependenciesDir: string;
  private usersDir: string;
  private temporalInstancesDir: string;
  private adaptiveResonancesDir: string;
  private metaCognitiveEventsDir: string;
  private neuralPathwaysDir: string;
  private datasetsDir: string;
  private transformationsDir: string;
  private analysisModelsDir: string;
  
  /**
   * Constructor
   * @param baseDir Base directory for file storage
   */
  constructor(baseDir: string) {
    this.baseDir = baseDir;
    this.metricsDir = path.join(this.baseDir, 'metrics');
    this.stabilityDir = path.join(this.baseDir, 'stability');
    this.qrnMetricsDir = path.join(this.baseDir, 'qrn_metrics');
    this.systemMetricsDir = path.join(this.baseDir, 'system_metrics');
    this.tasksDir = path.join(this.baseDir, 'tasks');
    this.chunksDir = path.join(this.baseDir, 'chunks');
    this.chunkDependenciesDir = path.join(this.baseDir, 'chunk_dependencies');
    this.usersDir = path.join(this.baseDir, 'users');
    this.temporalInstancesDir = path.join(this.baseDir, 'temporal_instances');
    this.adaptiveResonancesDir = path.join(this.baseDir, 'adaptive_resonances');
    this.metaCognitiveEventsDir = path.join(this.baseDir, 'meta_cognitive_events');
    this.neuralPathwaysDir = path.join(this.baseDir, 'neural_pathways');
    this.datasetsDir = path.join(this.baseDir, 'datasets');
    this.transformationsDir = path.join(this.baseDir, 'transformations');
    this.analysisModelsDir = path.join(this.baseDir, 'analysis_models');
  }
  
  /**
   * Ensure required directories exist
   */
  async ensureDirectories(): Promise<void> {
    await fs.mkdir(this.baseDir, { recursive: true });
    await fs.mkdir(this.metricsDir, { recursive: true });
    await fs.mkdir(this.stabilityDir, { recursive: true });
    await fs.mkdir(this.qrnMetricsDir, { recursive: true });
    await fs.mkdir(this.systemMetricsDir, { recursive: true });
    await fs.mkdir(this.tasksDir, { recursive: true });
    await fs.mkdir(this.chunksDir, { recursive: true });
    await fs.mkdir(this.chunkDependenciesDir, { recursive: true });
    await fs.mkdir(this.usersDir, { recursive: true });
    await fs.mkdir(this.temporalInstancesDir, { recursive: true });
    await fs.mkdir(this.adaptiveResonancesDir, { recursive: true });
    await fs.mkdir(this.metaCognitiveEventsDir, { recursive: true });
    await fs.mkdir(this.neuralPathwaysDir, { recursive: true });
    await fs.mkdir(this.datasetsDir, { recursive: true });
    await fs.mkdir(this.transformationsDir, { recursive: true });
    await fs.mkdir(this.analysisModelsDir, { recursive: true });
  }
  
  /**
   * Date reviver function for JSON.parse
   * Converts ISO strings to Date objects
   * 
   * Now using unified ChronosDateHandler for consistent date handling across the system
   */
  private dateReviver(key: string, value: any): any {
    return ChronosDateHandler.dateReviver(key, value);
  }
  
  /**
   * Date replacer function for JSON.stringify
   * Converts Date objects to ISO strings
   * 
   * Now using unified ChronosDateHandler for consistent date handling across the system
   */
  private dateReplacer(key: string, value: any): any {
    return ChronosDateHandler.dateReplacer(key, value);
  }
  
  /**
   * Ensure dates in an object are properly instantiated
   * 
   * @param obj Object to process
   * @returns Object with all date strings converted to Date objects
   */
  private ensureDatesInObject<T = any>(obj: T): T {
    return ChronosDateHandler.ensureDatesInObject<T>(obj);
  }
  
  /**
   * Save metrics to storage
   * @param metrics Metrics object to save
   */
  async saveMetrics(metrics: any): Promise<void> {
    await this.ensureDirectories();
    
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `metrics_${timestamp}.json`;
    const filePath = path.join(this.metricsDir, filename);
    
    await fs.writeFile(
      filePath, 
      JSON.stringify(metrics, this.dateReplacer, 2)
    );
  }
  
  /**
   * Get latest metrics from storage
   * @param limit Maximum number of metrics to retrieve
   */
  async getLatestMetrics(limit: number = 10): Promise<any[]> {
    await this.ensureDirectories();
    
    try {
      const files = await fs.readdir(this.metricsDir);
      const jsonFiles = files.filter(file => file.endsWith('.json'));
      
      // Sort files by name (which includes the timestamp)
      const sortedFiles = jsonFiles.sort().reverse().slice(0, limit);
      
      const metrics = [];
      for (const file of sortedFiles) {
        const filePath = path.join(this.metricsDir, file);
        const data = await fs.readFile(filePath, 'utf8');
        const metric = JSON.parse(data, this.dateReviver);
        metrics.push(metric);
      }
      
      return metrics;
    } catch (error: any) {
      if (error.code === 'ENOENT') {
        return []; // Directory doesn't exist yet
      }
      throw error;
    }
  }
  
  /**
   * Get metrics by time range
   * @param startTime Start of time range
   * @param endTime End of time range
   */
  async getMetricsByTimeRange(startTime: Date, endTime: Date): Promise<any[]> {
    const allMetrics = await this.getLatestMetrics(1000); // Get a large batch
    
    return allMetrics.filter(metric => {
      const metricTime = metric.timestamp instanceof Date 
        ? metric.timestamp 
        : new Date(metric.timestamp);
        
      return metricTime >= startTime && metricTime <= endTime;
    });
  }
  
  /**
   * Record system stability data
   * @param stabilityData Stability data to record
   */
  async recordSystemStability(stabilityData: any): Promise<void> {
    await this.ensureDirectories();
    
    // Add timestamp if not present
    const dataToSave = {
      ...stabilityData,
      timestamp: stabilityData.timestamp || new Date()
    };
    
    const timestamp = dataToSave.timestamp.toISOString().replace(/[:.]/g, '-');
    const filename = `stability_${timestamp}.json`;
    const filePath = path.join(this.stabilityDir, filename);
    
    await fs.writeFile(
      filePath, 
      JSON.stringify(dataToSave, this.dateReplacer, 2)
    );
  }
  
  /**
   * Get system stability history
   * @param limit Maximum number of records to retrieve
   */
  async getSystemStabilityHistory(limit: number = 10): Promise<any[]> {
    await this.ensureDirectories();
    
    try {
      const files = await fs.readdir(this.stabilityDir);
      const jsonFiles = files.filter(file => file.endsWith('.json'));
      
      // Sort files by name (which includes the timestamp)
      const sortedFiles = jsonFiles.sort().reverse().slice(0, limit);
      
      const records = [];
      for (const file of sortedFiles) {
        const filePath = path.join(this.stabilityDir, file);
        const data = await fs.readFile(filePath, 'utf8');
        const record = JSON.parse(data, this.dateReviver);
        records.push(record);
      }
      
      return records;
    } catch (error: any) {
      if (error.code === 'ENOENT') {
        return []; // Directory doesn't exist yet
      }
      throw error;
    }
  }
  
  /**
   * Save QRN metrics
   * @param metrics QRN metrics to save
   */
  async saveQRNMetrics(metrics: any): Promise<void> {
    await this.ensureDirectories();
    
    // Add timestamp if not present
    const dataToSave = {
      ...metrics,
      timestamp: metrics.timestamp || new Date()
    };
    
    const timestamp = dataToSave.timestamp.toISOString().replace(/[:.]/g, '-');
    const filename = `qrn_metrics_${timestamp}.json`;
    const filePath = path.join(this.qrnMetricsDir, filename);
    
    await fs.writeFile(
      filePath, 
      JSON.stringify(dataToSave, this.dateReplacer, 2)
    );
  }
  
  /**
   * Get latest QRN metrics
   */
  async getLatestQRNMetrics(): Promise<{ 
    stability: number | null, 
    efficiency: number | null, 
    coherence: number | null 
  } | null> {
    await this.ensureDirectories();
    
    try {
      const files = await fs.readdir(this.qrnMetricsDir);
      const jsonFiles = files.filter(file => file.endsWith('.json'));
      
      if (jsonFiles.length === 0) {
        // If no QRN metrics exist yet, return default values
        return {
          stability: 0.75,
          efficiency: 0.65,
          coherence: 0.5
        };
      }
      
      // Get the latest file
      const latestFile = jsonFiles.sort().pop();
      if (!latestFile) {
        return null;
      }
      
      const filePath = path.join(this.qrnMetricsDir, latestFile);
      const data = await fs.readFile(filePath, 'utf8');
      const metrics = JSON.parse(data, this.dateReviver);
      
      return {
        stability: typeof metrics.stability === 'number' ? metrics.stability : null,
        efficiency: typeof metrics.efficiency === 'number' ? metrics.efficiency : null,
        coherence: typeof metrics.coherence === 'number' ? metrics.coherence : null
      };
    } catch (error: any) {
      if (error.code === 'ENOENT') {
        return null; // Directory doesn't exist yet
      }
      console.error('FileSystemStorage.getLatestQRNMetrics: Error reading latest QRN metrics:', error);
      return null; // Consistent error handling
    }
  }
  
  // Dataset Methods
  async getAllDatasets(limit?: number, filter?: { createdBy?: number, isPublic?: boolean }): Promise<Dataset[]> {
    console.log('FileSystemStorage.getAllDatasets: Start', filter, limit);
    await this.ensureDirectories();
    let datasets: Dataset[] = [];
    
    try {
      const files = await fs.readdir(this.datasetsDir);
      for (const file of files) {
        if (file.startsWith('dataset_') && file.endsWith('.json')) {
          const filePath = path.join(this.datasetsDir, file);
          const data = await fs.readFile(filePath, 'utf8');
          const dataset = JSON.parse(data, this.dateReviver) as Dataset;
          datasets.push(dataset);
        }
      }
    } catch (error: any) {
      console.error('FileSystemStorage.getAllDatasets: Error reading datasets directory:', error);
      return []; // Return an empty array on error.
    }

    let filteredDatasets = datasets;

    if (filter) {
      if (filter.createdBy !== undefined) {
        filteredDatasets = filteredDatasets.filter(dataset => dataset.createdBy === filter.createdBy);
      }
      if (filter.isPublic !== undefined) {
        filteredDatasets = filteredDatasets.filter(dataset => dataset.isPublic === filter.isPublic);
      }
    }
    
    if (limit !== undefined) {
      filteredDatasets = filteredDatasets.slice(0, limit);
    }
    
    console.log('FileSystemStorage.getAllDatasets: Complete', filteredDatasets);
    return filteredDatasets;
  }
  
  async getDataset(id: number): Promise<Dataset | undefined> {
    console.log('FileSystemStorage.getDataset: Start', id);
    await this.ensureDirectories();
    const filePath = path.join(this.datasetsDir, `dataset_${id}.json`);
    
    try {
      const data = await fs.readFile(filePath, 'utf8');
      const dataset = JSON.parse(data, this.dateReviver) as Dataset;
      console.log('FileSystemStorage.getDataset: Complete', dataset);
      return dataset;
    } catch (error: any) {
      if (error.code === 'ENOENT') {
        console.log(`FileSystemStorage.getDataset: Dataset ${id} not found`);
        return undefined; // Return undefined if not found
      }
      console.error(`FileSystemStorage.getDataset: Error loading dataset ${id}:`, error);
      return undefined; // Consistent error handling
    }
  }
  
  async createDataset(dataset: InsertDataset): Promise<Dataset> {
    console.log('FileSystemStorage.createDataset: Start', dataset);
    await this.ensureDirectories();
    const newDataset: Dataset = {
      ...dataset,
      id: Date.now(), // Use timestamp as ID
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const filePath = path.join(this.datasetsDir, `dataset_${newDataset.id}.json`);
    
    try {
      await fs.writeFile(filePath, JSON.stringify(newDataset, this.dateReplacer, 2), 'utf8');
      console.log('FileSystemStorage.createDataset: Complete', newDataset);
      return newDataset;
    } catch (error: any) {
      console.error('FileSystemStorage.createDataset: Error creating dataset:', error);
      throw error; // Re-throw for caller handling
    }
  }

  async updateDataset(id: number, dataset: Partial<Dataset>): Promise<Dataset | undefined> {
    console.log('FileSystemStorage.updateDataset: Start', id, dataset);
    await this.ensureDirectories();
    const filePath = path.join(this.datasetsDir, `dataset_${id}.json`);
    
    try {
      const data = await fs.readFile(filePath, 'utf8');
      const existingDataset = JSON.parse(data, this.dateReviver) as Dataset;

      const updatedDataset: Dataset = {
        ...existingDataset,
        ...dataset,
        updatedAt: new Date() // Always update updatedAt
      };

      await fs.writeFile(filePath, JSON.stringify(updatedDataset, this.dateReplacer, 2), 'utf8');
      console.log('FileSystemStorage.updateDataset: Complete', updatedDataset);
      return updatedDataset;
    } catch (error: any) {
      if (error.code === 'ENOENT') {
        console.log(`FileSystemStorage.updateDataset: Dataset ${id} not found`);
        return undefined; // Not found
      }
      console.error(`FileSystemStorage.updateDataset: Error updating dataset ${id}:`, error);
      return undefined; // Consistent error handling
    }
  }
  
  async deleteDataset(id: number): Promise<boolean> {
    console.log('FileSystemStorage.deleteDataset: Start', id);
    await this.ensureDirectories();
    const filePath = path.join(this.datasetsDir, `dataset_${id}.json`);
    
    try {
      await fs.access(filePath); // Check if file exists
      await fs.unlink(filePath); // Delete the file
      console.log(`FileSystemStorage.deleteDataset: Dataset ${id} deleted successfully`);
      return true;
    } catch (error: any) {
      if (error.code === 'ENOENT') {
        console.log(`FileSystemStorage.deleteDataset: Dataset ${id} not found for deletion`);
        return false; // File not found, return false
      }
      console.error(`FileSystemStorage.deleteDataset: Error deleting dataset ${id}:`, error);
      return false; // Error occurred, return false
    }
  }
  
  async getDatasetColumns(datasetId: number): Promise<DataColumn[]> {
    console.log('FileSystemStorage.getDatasetColumns: Start', datasetId);
    await this.ensureDirectories();
    const columnsDir = path.join(this.datasetsDir, `columns_${datasetId}`);
    
    try {
      await fs.mkdir(columnsDir, { recursive: true });
      const files = await fs.readdir(columnsDir);
      const columns: DataColumn[] = [];
      
      for (const file of files) {
        if (file.endsWith('.json')) {
          const filePath = path.join(columnsDir, file);
          const data = await fs.readFile(filePath, 'utf8');
          const column = JSON.parse(data, this.dateReviver) as DataColumn;
          columns.push(column);
        }
      }
      
      console.log('FileSystemStorage.getDatasetColumns: Complete', columns);
      return columns;
    } catch (error: any) {
      console.error(`FileSystemStorage.getDatasetColumns: Error getting columns for dataset ${datasetId}:`, error);
      return []; // Return empty array on error
    }
  }
  
  async createDataColumn(column: InsertDataColumn): Promise<DataColumn> {
    console.log('FileSystemStorage.createDataColumn: Start', column);
    await this.ensureDirectories();
    const columnsDir = path.join(this.datasetsDir, `columns_${column.datasetId}`);
    
    try {
      await fs.mkdir(columnsDir, { recursive: true });
      
      const newColumn: DataColumn = {
        ...column,
        id: Date.now(), // Use timestamp as ID
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      const filePath = path.join(columnsDir, `column_${newColumn.id}.json`);
      await fs.writeFile(filePath, JSON.stringify(newColumn, this.dateReplacer, 2), 'utf8');
      
      console.log('FileSystemStorage.createDataColumn: Complete', newColumn);
      return newColumn;
    } catch (error: any) {
      console.error('FileSystemStorage.createDataColumn: Error creating column:', error);
      throw error;
    }
  }
  
  async updateDataColumn(id: number, column: Partial<DataColumn>): Promise<DataColumn | undefined> {
    console.log('FileSystemStorage.updateDataColumn: Start', id, column);
    await this.ensureDirectories();
    
    // We need to find which dataset this column belongs to
    // For simplicity, let's assume the column object contains the datasetId
    if (!column.datasetId) {
      console.error('FileSystemStorage.updateDataColumn: DatasetId is required to update a column');
      return undefined;
    }
    
    const columnsDir = path.join(this.datasetsDir, `columns_${column.datasetId}`);
    const filePath = path.join(columnsDir, `column_${id}.json`);
    
    try {
      const data = await fs.readFile(filePath, 'utf8');
      const existingColumn = JSON.parse(data, this.dateReviver) as DataColumn;
      
      const updatedColumn: DataColumn = {
        ...existingColumn,
        ...column,
        updatedAt: new Date()
      };
      
      await fs.writeFile(filePath, JSON.stringify(updatedColumn, this.dateReplacer, 2), 'utf8');
      console.log('FileSystemStorage.updateDataColumn: Complete', updatedColumn);
      return updatedColumn;
    } catch (error: any) {
      console.error(`FileSystemStorage.updateDataColumn: Error updating column ${id}:`, error);
      return undefined;
    }
  }
  
  async deleteDataColumn(id: number): Promise<boolean> {
    console.log('FileSystemStorage.deleteDataColumn: Start', id);
    
    // Without knowing which dataset this column belongs to, we'd need to search all datasets
    // This is a simplified implementation assuming we know the datasetId
    try {
      // This is a placeholder - in a real implementation, we would search for the column
      // across all datasets or require a datasetId parameter
      console.error('FileSystemStorage.deleteDataColumn: Cannot delete column without knowing datasetId');
      return false;
    } catch (error: any) {
      console.error(`FileSystemStorage.deleteDataColumn: Error deleting column ${id}:`, error);
      return false;
    }
  }
  
  async getDataColumnById(id: number): Promise<DataColumn | undefined> {
    console.log('FileSystemStorage.getDataColumnById: Start', id);
    
    // Similar to deleteDataColumn, without knowing which dataset this column belongs to, 
    // we'd need to search all datasets
    try {
      // This is a placeholder - in a real implementation, we would search for the column
      // across all datasets or require a datasetId parameter
      console.error('FileSystemStorage.getDataColumnById: Cannot get column without knowing datasetId');
      return undefined;
    } catch (error: any) {
      console.error(`FileSystemStorage.getDataColumnById: Error getting column ${id}:`, error);
      return undefined;
    }
  }
  
  // Transformation Methods
  async getAllTransformations(limit?: number, filter?: { datasetId?: number }): Promise<Transformation[]> {
    console.log('FileSystemStorage.getAllTransformations: Start', filter, limit);
    await this.ensureDirectories();
    let transformations: Transformation[] = [];
    
    try {
      const files = await fs.readdir(this.transformationsDir);
      for (const file of files) {
        if (file.startsWith('transformation_') && file.endsWith('.json')) {
          const filePath = path.join(this.transformationsDir, file);
          const data = await fs.readFile(filePath, 'utf8');
          const transformation = JSON.parse(data, this.dateReviver) as Transformation;
          transformations.push(transformation);
        }
      }
    } catch (error: any) {
      console.error('FileSystemStorage.getAllTransformations: Error reading transformations directory:', error);
      return [];
    }
    
    let filteredTransformations = transformations;

    if (filter) {
      if (filter.datasetId !== undefined) {
        filteredTransformations = filteredTransformations.filter(t => t.datasetId === filter.datasetId);
      }
    }
    
    if (limit !== undefined) {
      filteredTransformations = filteredTransformations.slice(0, limit);
    }
    
    console.log('FileSystemStorage.getAllTransformations: Complete', filteredTransformations);
    return filteredTransformations;
  }
  
  async getTransformation(id: number): Promise<Transformation | undefined> {
    console.log('FileSystemStorage.getTransformation: Start', id);
    await this.ensureDirectories();
    const filePath = path.join(this.transformationsDir, `transformation_${id}.json`);
    
    try {
      const data = await fs.readFile(filePath, 'utf8');
      const transformation = JSON.parse(data, this.dateReviver) as Transformation;
      console.log('FileSystemStorage.getTransformation: Complete', transformation);
      return transformation;
    } catch (error: any) {
      if (error.code === 'ENOENT') {
        console.log(`FileSystemStorage.getTransformation: Transformation ${id} not found`);
        return undefined; // Transformation not found
      }
      console.error(`FileSystemStorage.getTransformation: Error loading transformation ${id}:`, error);
      return undefined; // Consistent error handling
    }
  }

  async createTransformation(transformation: InsertTransformation): Promise<Transformation> {
    console.log('FileSystemStorage.createTransformation: Start', transformation);
    await this.ensureDirectories();
    
    const newTransformation: Transformation = {
      ...transformation,
      id: Date.now(), // Use timestamp as ID
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const filePath = path.join(this.transformationsDir, `transformation_${newTransformation.id}.json`);
    
    try {
      await fs.writeFile(filePath, JSON.stringify(newTransformation, this.dateReplacer, 2), 'utf8');
      console.log('FileSystemStorage.createTransformation: Complete', newTransformation);
      return newTransformation;
    } catch (error: any) {
      console.error('FileSystemStorage.createTransformation: Error creating transformation:', error);
      throw error; // Re-throw for caller handling
    }
  }

  async updateTransformation(id: number, transformation: Partial<Transformation>): Promise<Transformation | undefined> {
    console.log('FileSystemStorage.updateTransformation: Start', id, transformation);
    await this.ensureDirectories();
    const filePath = path.join(this.transformationsDir, `transformation_${id}.json`);
    
    try {
      const data = await fs.readFile(filePath, 'utf8');
      const existingTransformation = JSON.parse(data, this.dateReviver) as Transformation;

      const updatedTransformation: Transformation = {
        ...existingTransformation,
        ...transformation,
        updatedAt: new Date() // Always update updatedAt
      };

      await fs.writeFile(filePath, JSON.stringify(updatedTransformation, this.dateReplacer, 2), 'utf8');
      console.log('FileSystemStorage.updateTransformation: Complete', updatedTransformation);
      return updatedTransformation;
    } catch (error: any) {
      if (error.code === 'ENOENT') {
        console.log(`FileSystemStorage.updateTransformation: Transformation ${id} not found`);
        return undefined; // Not found
      }
      console.error(`FileSystemStorage.updateTransformation: Error updating transformation ${id}:`, error);
      return undefined; // Consistent error handling
    }
  }
  
  async deleteTransformation(id: number): Promise<boolean> {
    console.log('FileSystemStorage.deleteTransformation: Start', id);
    await this.ensureDirectories();
    const filePath = path.join(this.transformationsDir, `transformation_${id}.json`);
    
    try {
      await fs.access(filePath); // Check if file exists
      await fs.unlink(filePath); // Delete the file
      console.log(`FileSystemStorage.deleteTransformation: Transformation ${id} deleted successfully`);
      return true;
    } catch (error: any) {
      if (error.code === 'ENOENT') {
        console.log(`FileSystemStorage.deleteTransformation: Transformation ${id} not found for deletion`);
        return false; // File not found, return false
      }
      console.error(`FileSystemStorage.deleteTransformation: Error deleting transformation ${id}:`, error);
      return false; // Error occurred, return false
    }
  }
  
  // Analysis Model Methods
  async getAllAnalysisModels(limit?: number, filter?: { createdBy?: number, isPublic?: boolean }): Promise<AnalysisModel[]> {
    console.log('FileSystemStorage.getAllAnalysisModels: Start', filter, limit);
    await this.ensureDirectories();
    let models: AnalysisModel[] = [];
    
    try {
      const files = await fs.readdir(this.analysisModelsDir);
      for (const file of files) {
        if (file.startsWith('analysis_model_') && file.endsWith('.json')) {
          const filePath = path.join(this.analysisModelsDir, file);
          const data = await fs.readFile(filePath, 'utf8');
          const model = JSON.parse(data, this.dateReviver) as AnalysisModel;
          models.push(model);
        }
      }
    } catch (error: any) {
      console.error('FileSystemStorage.getAllAnalysisModels: Error reading analysis models directory:', error);
      return []; // Return empty array on error
    }
    
    let filteredModels = models;
    
    if (filter) {
      if (filter.createdBy !== undefined) {
        filteredModels = filteredModels.filter(model => model.createdBy === filter.createdBy);
      }
      if (filter.isPublic !== undefined) {
        filteredModels = filteredModels.filter(model => model.isPublic === filter.isPublic);
      }
    }
    
    if (limit !== undefined) {
      filteredModels = filteredModels.slice(0, limit);
    }
    
    console.log('FileSystemStorage.getAllAnalysisModels: Complete', filteredModels);
    return filteredModels;
  }
  
  async getAnalysisModel(id: number): Promise<AnalysisModel | undefined> {
    console.log('FileSystemStorage.getAnalysisModel: Start', id);
    await this.ensureDirectories();
    const filePath = path.join(this.analysisModelsDir, `analysis_model_${id}.json`);
    
    try {
      const data = await fs.readFile(filePath, 'utf8');
      const model = JSON.parse(data, this.dateReviver) as AnalysisModel;
      console.log('FileSystemStorage.getAnalysisModel: Complete', model);
      return model;
    } catch (error: any) {
      if (error.code === 'ENOENT') {
        console.log(`FileSystemStorage.getAnalysisModel: Analysis model ${id} not found`);
        return undefined; // Model not found
      }
      console.error(`FileSystemStorage.getAnalysisModel: Error loading analysis model ${id}:`, error);
      return undefined; // Consistent error handling
    }
  }
  
  async createAnalysisModel(model: InsertAnalysisModel): Promise<AnalysisModel> {
    console.log('FileSystemStorage.createAnalysisModel: Start', model);
    await this.ensureDirectories();
    
    const newModel: AnalysisModel = {
      ...model,
      id: Date.now(), // Use timestamp as ID
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const filePath = path.join(this.analysisModelsDir, `analysis_model_${newModel.id}.json`);
    
    try {
      await fs.writeFile(filePath, JSON.stringify(newModel, this.dateReplacer, 2), 'utf8');
      console.log('FileSystemStorage.createAnalysisModel: Complete', newModel);
      return newModel;
    } catch (error: any) {
      console.error('FileSystemStorage.createAnalysisModel: Error creating analysis model:', error);
      throw error; // Re-throw for caller handling
    }
  }
  
  async updateAnalysisModel(id: number, model: Partial<AnalysisModel>): Promise<AnalysisModel | undefined> {
    console.log('FileSystemStorage.updateAnalysisModel: Start', id, model);
    await this.ensureDirectories();
    const filePath = path.join(this.analysisModelsDir, `analysis_model_${id}.json`);
    
    try {
      const data = await fs.readFile(filePath, 'utf8');
      const existingModel = JSON.parse(data, this.dateReviver) as AnalysisModel;

      const updatedModel: AnalysisModel = {
        ...existingModel,
        ...model,
        updatedAt: new Date() // Always update updatedAt
      };

      await fs.writeFile(filePath, JSON.stringify(updatedModel, this.dateReplacer, 2), 'utf8');
      console.log('FileSystemStorage.updateAnalysisModel: Complete', updatedModel);
      return updatedModel;
    } catch (error: any) {
      if (error.code === 'ENOENT') {
        console.log(`FileSystemStorage.updateAnalysisModel: Analysis model ${id} not found`);
        return undefined; // Not found
      }
      console.error(`FileSystemStorage.updateAnalysisModel: Error updating analysis model ${id}:`, error);
      return undefined; // Consistent error handling
    }
  }
  
  async deleteAnalysisModel(id: number): Promise<boolean> {
    console.log('FileSystemStorage.deleteAnalysisModel: Start', id);
    await this.ensureDirectories();
    const filePath = path.join(this.analysisModelsDir, `analysis_model_${id}.json`);
    
    try {
      await fs.access(filePath); // Check if file exists
      await fs.unlink(filePath); // Delete the file
      console.log(`FileSystemStorage.deleteAnalysisModel: Analysis model ${id} deleted successfully`);
      return true;
    } catch (error: any) {
      if (error.code === 'ENOENT') {
        console.log(`FileSystemStorage.deleteAnalysisModel: Analysis model ${id} not found for deletion`);
        return false; // File not found, return false
      }
      console.error(`FileSystemStorage.deleteAnalysisModel: Error deleting analysis model ${id}:`, error);
      return false; // Error occurred, return false
    }
  }
  
  // The following methods would be implemented in a full implementation
  // but are left as stubs here to demonstrate what's needed
  
  /**
   * Save a task to file storage
   * @param task Task to save
   * @returns Promise that resolves when the task is saved
   */
  async saveTask(task: InsertTask): Promise<void> {
    // Make sure we're getting and preserving the incoming ID exactly
    const originalId = task.id;
    console.log(`FileSystemStorage: Saving task with name: ${task.name}, original ID: ${originalId}`);
    await this.ensureDirectories();
    
    // CRITICAL: Always use the original ID as provided. Default to UUID only if totally missing
    const taskId = originalId || uuidv4();
    console.log(`FileSystemStorage: Using taskId: ${taskId} for the file WITHOUT ANY MODIFICATION`); 
    
    // Create the full task object with metadata
    // IMPORTANT: We're creating a new object and explicitly setting the id to the original value
    // to prevent any accidental overwriting from the spread operator
    const fullTask: Task = {
      ...task,
      // CRITICAL FIX: Make absolutely sure we keep the original ID
      id: taskId,
      createdAt: ChronosDateHandler.createDate(),
      updatedAt: ChronosDateHandler.createDate()
    };
    
    // Create the file path using the EXACT ID without any modifications
    const filePath = path.join(this.tasksDir, `${taskId}.json`);
    
    try {
      // Save the task to the file system
      await fs.writeFile(
        filePath,
        JSON.stringify(fullTask, this.dateReplacer, 2)
      );
      console.log(`FileSystemStorage: Task ${taskId} saved successfully`);
    } catch (error: any) {
      console.error(`FileSystemStorage: Error saving task ${taskId}:`, error.message);
      throw error;
    }
  }
  
  /**
   * Load a task from storage by its ID
   * @param taskId The ID of the task to load
   * @returns The task object if found, null otherwise
   */
  async loadTask(taskId: string): Promise<Task | null> {
    console.log(`FileSystemStorage: Loading task with ID: ${taskId}`);
    await this.ensureDirectories();
    
    // First try to load the task directly using the ID as the filename
    const directFilePath = path.join(this.tasksDir, `${taskId}.json`);
    console.log(`FileSystemStorage: First attempting direct path: ${directFilePath}`);
    
    try {
      const data = await fs.readFile(directFilePath, 'utf8');
      const task = JSON.parse(data, this.dateReviver) as Task;
      console.log(`FileSystemStorage: Task ${taskId} loaded successfully via direct path`);
      return this.ensureDatesInObject<Task>(task);
    } catch (directError: any) {
      if (directError.code === 'ENOENT') {
        console.log(`FileSystemStorage: Task not found at direct path, will scan directory`);
        
        // If direct lookup fails, scan all files to find task with matching ID
        try {
          const files = await fs.readdir(this.tasksDir);
          console.log(`FileSystemStorage: Found ${files.length} files in tasks directory`);
          
          // Loop through each file and check if it contains our task
          for (const file of files) {
            if (!file.endsWith('.json') || file.startsWith('subtasks_') || file.startsWith('chunk_')) {
              continue; // Skip non-task files
            }
            
            try {
              const filePath = path.join(this.tasksDir, file);
              const fileData = await fs.readFile(filePath, 'utf8');
              const possibleTask = JSON.parse(fileData, this.dateReviver) as Task;
              
              // Check if this file contains our task
              if (possibleTask.id === taskId) {
                console.log(`FileSystemStorage: Found task ${taskId} in file ${file}`);
                return this.ensureDatesInObject<Task>(possibleTask);
              }
            } catch (fileReadError) {
              console.error(`FileSystemStorage: Error reading file ${file}:`, fileReadError);
              // Continue to next file
            }
          }
          
          // If we get here, we couldn't find the task in any file
          console.log(`FileSystemStorage: Task ${taskId} not found in any file`);
          return null;
        } catch (dirReadError) {
          console.error(`FileSystemStorage: Error reading tasks directory:`, dirReadError);
          throw dirReadError;
        }
      } else {
        console.error(`FileSystemStorage: Error loading task ${taskId}:`, directError.message);
        throw directError;
      }
    }
  }
  
  /**
   * Get a task by ID
   * @param taskId ID of the task to get
   * @returns Promise that resolves with the task or null if not found
   */
  async getTask(taskId: string): Promise<Task | null> {
    console.log(`FileSystemStorage: Getting task with ID: ${taskId}`);
    
    // This is just a wrapper for loadTask to maintain interface consistency
    return this.loadTask(taskId);
  }
  
  /**
   * Save subtasks for a task
   * @param taskId Parent task ID
   * @param subTasks Subtasks to save
   * @returns Promise that resolves when subtasks are saved
   */
  async saveSubTasks(taskId: string, subTasks: InsertSubTask[]): Promise<void> {
    console.log(`FileSystemStorage: Saving ${subTasks.length} subtasks for task ${taskId}`);
    await this.ensureDirectories();
    
    // Process subtasks to ensure they have all required fields
    const processedSubTasks: SubTask[] = subTasks.map(subTask => ({
      ...subTask,
      id: subTask.id || uuidv4(),
      taskId: taskId,
      createdAt: new Date(),
      updatedAt: new Date()
    }));
    
    // Create the file path using the defined naming convention
    const filePath = path.join(this.tasksDir, `subtasks_${taskId}.json`);
    
    try {
      // Save the subtasks to the file system
      await fs.writeFile(
        filePath,
        JSON.stringify(processedSubTasks, this.dateReplacer, 2)
      );
      console.log(`FileSystemStorage: Subtasks for task ${taskId} saved successfully`);
    } catch (error: any) {
      console.error(`FileSystemStorage: Error saving subtasks for task ${taskId}:`, error.message);
      throw error;
    }
  }
  
  /**
   * Get subtasks for a task
   * @param taskId Parent task ID
   * @returns Promise that resolves with the subtasks or an empty array if none found
   */
  async getSubTasks(taskId: string): Promise<SubTask[]> {
    console.log(`FileSystemStorage: Getting subtasks for task ${taskId}`);
    await this.ensureDirectories();
    
    const filePath = path.join(this.tasksDir, `subtasks_${taskId}.json`);
    
    try {
      const data = await fs.readFile(filePath, 'utf8');
      const subTasks = JSON.parse(data, this.dateReviver) as SubTask[];
      console.log(`FileSystemStorage: Retrieved ${subTasks.length} subtasks for task ${taskId}`);
      return subTasks;
    } catch (error: any) {
      if (error.code === 'ENOENT') {
        console.log(`FileSystemStorage: No subtasks found for task ${taskId}`);
        return []; // File not found, return empty array
      }
      console.error(`FileSystemStorage: Error getting subtasks for task ${taskId}:`, error.message);
      throw error;
    }
  }
  
  /**
   * Delete a task and its subtasks
   * @param taskId ID of the task to delete
   * @returns Promise that resolves with true if the task was deleted, false if it wasn't found
   */
  async deleteTask(taskId: string): Promise<boolean> {
    console.log(`FileSystemStorage: Deleting task ${taskId}`);
    await this.ensureDirectories();
    
    const taskFilePath = path.join(this.tasksDir, `${taskId}.json`);
    const subTasksFilePath = path.join(this.tasksDir, `subtasks_${taskId}.json`);
    
    try {
      // Check if task exists
      await fs.access(taskFilePath);
      
      // Delete the task file
      await fs.unlink(taskFilePath);
      console.log(`FileSystemStorage: Task ${taskId} deleted successfully`);
      
      // Try to delete the subtasks file if it exists
      try {
        await fs.access(subTasksFilePath);
        await fs.unlink(subTasksFilePath);
        console.log(`FileSystemStorage: Subtasks for task ${taskId} deleted successfully`);
      } catch (subTasksError: any) {
        if (subTasksError.code !== 'ENOENT') {
          console.error(`FileSystemStorage: Error deleting subtasks for task ${taskId}:`, subTasksError.message);
        }
        // If the subtasks file doesn't exist, that's fine, just continue
      }
      
      return true;
    } catch (error: any) {
      if (error.code === 'ENOENT') {
        console.log(`FileSystemStorage: Task ${taskId} not found for deletion`);
        return false; // File not found, return false
      }
      console.error(`FileSystemStorage: Error deleting task ${taskId}:`, error.message);
      throw error;
    }
  }

  /**
   * Get all tasks
   * @param limit Maximum number of tasks to return
   * @returns Promise that resolves with an array of tasks
   */
  async getAllTasks(limit?: number): Promise<Task[]> {
    console.log(`FileSystemStorage: Getting all tasks${limit ? ` (limit: ${limit})` : ''}`);
    await this.ensureDirectories();
    
    try {
      // Read all files in the tasks directory
      const files = await fs.readdir(this.tasksDir);
      
      // Filter for task files (not subtask files)
      // Use the standard .json extension and exclude files that start with 'subtasks_'
      const taskFiles = files.filter(file => 
        file.endsWith('.json') && 
        !file.startsWith('subtasks_') && 
        !file.startsWith('chunk_'));
      
      // Read and parse each task file
      const tasks: Task[] = [];
      for (const file of taskFiles) {
        try {
          const filePath = path.join(this.tasksDir, file);
          const data = await fs.readFile(filePath, 'utf8');
          const task = JSON.parse(data, this.dateReviver) as Task;
          tasks.push(task);
        } catch (fileError: any) {
          console.error(`FileSystemStorage: Error reading task file ${file}:`, fileError.message);
          // Continue with other files even if one fails
        }
      }
      
      // Sort tasks by creation date (newest first)
      tasks.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
      
      // Apply limit if provided
      const limitedTasks = limit ? tasks.slice(0, limit) : tasks;
      
      console.log(`FileSystemStorage: Retrieved ${limitedTasks.length} tasks`);
      return limitedTasks;
    } catch (error: any) {
      if (error.code === 'ENOENT') {
        console.log(`FileSystemStorage: Tasks directory not found, returning empty array`);
        return []; // Directory doesn't exist yet, return empty array
      }
      console.error(`FileSystemStorage: Error getting all tasks:`, error.message);
      throw error;
    }
  }
  
  /**
   * Create a new chunk
   * @param chunk Chunk data to save
   * @returns Promise that resolves with the created Chunk object
   */
  async createChunk(chunk: InsertChunk): Promise<Chunk> {
    console.log(`FileSystemStorage: Creating chunk with index: ${chunk.chunkIndex}`);
    await this.ensureDirectories();
    
    // Generate a unique ID if not provided
    const chunkId = chunk.id || uuidv4();
    
    // Create the full chunk object with metadata
    const fullChunk: Chunk = {
      ...chunk,
      id: chunkId,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    // Create the file path using the defined naming convention
    const filePath = path.join(this.chunksDir, `chunk_${chunkId}.json`);
    
    try {
      // Save the chunk to the file system
      await fs.writeFile(
        filePath,
        JSON.stringify(fullChunk, this.dateReplacer, 2)
      );
      console.log(`FileSystemStorage: Chunk ${chunkId} created successfully`);
      return fullChunk;
    } catch (error: any) {
      console.error(`FileSystemStorage: Error creating chunk ${chunkId}:`, error.message);
      throw error;
    }
  }

  /**
   * Get a chunk by ID
   * @param id ID of the chunk to retrieve
   * @returns Promise that resolves with the chunk or null if not found
   */
  async getChunk(id: string): Promise<Chunk | null> {
    console.log(`FileSystemStorage: Getting chunk with ID: ${id}`);
    await this.ensureDirectories();
    
    const filePath = path.join(this.chunksDir, `chunk_${id}.json`);
    
    try {
      const data = await fs.readFile(filePath, 'utf8');
      const chunk = JSON.parse(data, this.dateReviver) as Chunk;
      console.log(`FileSystemStorage: Chunk ${id} retrieved successfully`);
      return chunk;
    } catch (error: any) {
      if (error.code === 'ENOENT') {
        console.log(`FileSystemStorage: Chunk ${id} not found`);
        return null; // File not found, return null (not undefined) to match interface
      }
      console.error(`FileSystemStorage: Error getting chunk ${id}:`, error.message);
      throw error;
    }
  }

  /**
   * Get all chunks based on filter criteria
   * @param limit Maximum number of chunks to return
   * @param filter Optional filter criteria
   * @returns Promise that resolves with an array of chunks
   */
  async getAllChunks(limit?: number, filter?: { taskId?: string, parentId?: string, state?: string, qrnId?: string }): Promise<Chunk[]> {
    console.log(`FileSystemStorage: Getting chunks with filter: ${filter ? JSON.stringify(filter) : 'none'}`);
    await this.ensureDirectories();
    
    try {
      // Read all files in the chunks directory
      const files = await fs.readdir(this.chunksDir);
      
      // Filter for chunk files
      const chunkFiles = files.filter(file => file.startsWith('chunk_') && file.endsWith('.json'));
      
      // Read and parse each chunk file
      const chunks: Chunk[] = [];
      for (const file of chunkFiles) {
        try {
          const filePath = path.join(this.chunksDir, file);
          const data = await fs.readFile(filePath, 'utf8');
          const chunk = JSON.parse(data, this.dateReviver) as Chunk;
          
          // Apply filter if provided
          if (filter) {
            let include = true;
            
            // Filter by taskId if provided
            if (filter.taskId && chunk.parentTaskId !== filter.taskId) {
              include = false;
            }
            
            // Filter by parentId if provided
            if (include && filter.parentId && chunk.parentChunkId !== filter.parentId) {
              include = false;
            }
            
            // Filter by state if provided (support both state and chunkState properties)
            if (include && (filter.state || filter.chunkState)) {
              const stateFilter = filter.chunkState || filter.state;
              if (chunk.chunkState !== stateFilter) {
                include = false;
              }
            }
            
            // Filter by qrnId if provided
            if (include && filter.qrnId && chunk.qrnId !== filter.qrnId) {
              include = false;
            }
            
            if (!include) continue;
          }
          
          chunks.push(chunk);
        } catch (fileError: any) {
          console.error(`FileSystemStorage: Error reading chunk file ${file}:`, fileError.message);
          // Continue with other files even if one fails
        }
      }
      
      // Sort chunks by creation date (newest first)
      chunks.sort((a, b) => {
        // Handle both Date objects and ISO strings by ensuring both are converted to numbers
        const dateA = a.createdAt instanceof Date ? a.createdAt.getTime() : new Date(a.createdAt).getTime();
        const dateB = b.createdAt instanceof Date ? b.createdAt.getTime() : new Date(b.createdAt).getTime();
        return dateB - dateA;
      });
      
      // Apply limit if specified
      const limitedChunks = limit ? chunks.slice(0, limit) : chunks;
      
      console.log(`FileSystemStorage: Retrieved ${limitedChunks.length} chunks`);
      return limitedChunks;
    } catch (error: any) {
      if (error.code === 'ENOENT') {
        console.log(`FileSystemStorage: Chunks directory not found, returning empty array`);
        return []; // Directory doesn't exist yet, return empty array
      }
      console.error(`FileSystemStorage: Error getting chunks:`, error.message);
      throw error;
    }
  }
  
  /**
   * For backward compatibility - redirects to getAllChunks
   * @deprecated Use getAllChunks instead
   */
  async getChunks(filter?: any, limit?: number): Promise<Chunk[]> {
    return this.getAllChunks(limit, filter);
  }

  /**
   * Update a chunk
   * @param id ID of the chunk to update
   * @param updates Partial chunk data to update
   * @returns Promise that resolves with the updated chunk or null if not found
   */
  async updateChunk(id: string, updates: Partial<Chunk>): Promise<Chunk | null> {
    console.log(`FileSystemStorage: Updating chunk with ID: ${id}`);
    await this.ensureDirectories();
    
    const filePath = path.join(this.chunksDir, `chunk_${id}.json`);
    
    try {
      // Read the existing chunk
      const data = await fs.readFile(filePath, 'utf8');
      const existingChunk = JSON.parse(data, this.dateReviver) as Chunk;
      
      // Apply updates
      const updatedChunk: Chunk = {
        ...existingChunk,
        ...updates,
        id, // Ensure ID stays the same
        updatedAt: new Date() // Update modification time
      };
      
      // Save the updated chunk
      await fs.writeFile(
        filePath,
        JSON.stringify(updatedChunk, this.dateReplacer, 2)
      );
      
      console.log(`FileSystemStorage: Chunk ${id} updated successfully`);
      return updatedChunk;
    } catch (error: any) {
      if (error.code === 'ENOENT') {
        console.log(`FileSystemStorage: Chunk ${id} not found for update`);
        return null; // File not found, return null
      }
      console.error(`FileSystemStorage: Error updating chunk ${id}:`, error.message);
      throw error;
    }
  }

  /**
   * Delete a chunk
   * @param id ID of the chunk to delete
   * @returns Promise that resolves with true if the chunk was deleted, false if it wasn't found
   */
  async deleteChunk(id: string): Promise<boolean> {
    console.log(`FileSystemStorage: Deleting chunk ${id}`);
    await this.ensureDirectories();
    
    const filePath = path.join(this.chunksDir, `chunk_${id}.json`);
    
    try {
      // Check if chunk exists
      await fs.access(filePath);
      
      // Delete the chunk file
      await fs.unlink(filePath);
      console.log(`FileSystemStorage: Chunk ${id} deleted successfully`);
      return true;
    } catch (error: any) {
      if (error.code === 'ENOENT') {
        console.log(`FileSystemStorage: Chunk ${id} not found for deletion`);
        return false; // File not found, return false
      }
      console.error(`FileSystemStorage: Error deleting chunk ${id}:`, error.message);
      throw error;
    }
  }
  
  /**
   * Update the state of a chunk
   * @param id ID of the chunk to update
   * @param state New state for the chunk
   * @returns Promise that resolves with the updated chunk or undefined if not found
   */
  async updateChunkState(id: string, state: typeof chunkStatesEnum.enumValues[number]): Promise<Chunk | null> {
    console.log(`FileSystemStorage: Updating chunk ${id} state to ${state}`);
    await this.ensureDirectories();
    
    const filePath = path.join(this.chunksDir, `chunk_${id}.json`);
    
    try {
      // Read the existing chunk
      const data = await fs.readFile(filePath, 'utf8');
      const existingChunk = JSON.parse(data, this.dateReviver) as Chunk;
      
      // Update the state
      const updatedChunk: Chunk = {
        ...existingChunk,
        chunkState: state,
        updatedAt: new Date() // Update modification time
      };
      
      // Save the updated chunk
      await fs.writeFile(
        filePath,
        JSON.stringify(updatedChunk, this.dateReplacer, 2)
      );
      
      console.log(`FileSystemStorage: Chunk ${id} state updated to ${state} successfully`);
      return updatedChunk;
    } catch (error: any) {
      if (error.code === 'ENOENT') {
        console.log(`FileSystemStorage: Chunk ${id} not found for state update`);
        return null; // File not found, return null to match interface expectations
      }
      console.error(`FileSystemStorage: Error updating chunk ${id} state:`, error.message);
      throw error;
    }
  }

  /**
   * Get a user by ID
   * @param id User ID
   * @returns Promise that resolves with the user or undefined if not found
   */
  async getUser(id: number): Promise<User | undefined> {
    console.log(`FileSystemStorage: Getting user with ID: ${id}`);
    await this.ensureDirectories();
    
    const filePath = path.join(this.usersDir, `user_${id}.json`);
    
    try {
      const data = await fs.readFile(filePath, 'utf8');
      const user = JSON.parse(data, this.dateReviver) as User;
      console.log(`FileSystemStorage: User ${id} retrieved successfully`);
      return user;
    } catch (error: any) {
      if (error.code === 'ENOENT') {
        console.log(`FileSystemStorage: User ${id} not found`);
        return undefined; // File not found, return undefined
      }
      console.error(`FileSystemStorage: Error getting user ${id}:`, error.message);
      throw error;
    }
  }
  
  /**
   * Get a user by username
   * @param username Username to search for
   * @returns Promise that resolves with the user or undefined if not found
   */
  async getUserByUsername(username: string): Promise<User | undefined> {
    console.log(`FileSystemStorage: Getting user with username: ${username}`);
    await this.ensureDirectories();
    
    try {
      // Read all files in the users directory
      const files = await fs.readdir(this.usersDir);
      
      // Filter for user files
      const userFiles = files.filter(file => file.startsWith('user_') && file.endsWith('.json'));
      
      // Read and parse each user file to find one with matching username
      for (const file of userFiles) {
        try {
          const filePath = path.join(this.usersDir, file);
          const data = await fs.readFile(filePath, 'utf8');
          const user = JSON.parse(data, this.dateReviver) as User;
          
          if (user.username === username) {
            console.log(`FileSystemStorage: User with username ${username} found with ID ${user.id}`);
            return user;
          }
        } catch (fileError: any) {
          console.error(`FileSystemStorage: Error reading user file ${file}:`, fileError.message);
          // Continue with other files even if one fails
        }
      }
      
      console.log(`FileSystemStorage: User with username ${username} not found`);
      return undefined; // No matching user found
    } catch (error: any) {
      if (error.code === 'ENOENT') {
        console.log(`FileSystemStorage: Users directory not found, returning undefined`);
        return undefined; // Directory doesn't exist yet, return undefined
      }
      console.error(`FileSystemStorage: Error finding user by username ${username}:`, error.message);
      throw error;
    }
  }
  
  /**
   * Create a new user
   * @param user User data to save
   * @returns Promise that resolves with the created User object
   */
  async createUser(user: InsertUser): Promise<User> {
    console.log(`FileSystemStorage: Creating user with username: ${user.username}`);
    await this.ensureDirectories();
    
    // Check if a user with this username already exists
    const existingUser = await this.getUserByUsername(user.username);
    if (existingUser) {
      throw new Error(`User with username ${user.username} already exists`);
    }
    
    // Find the highest user ID
    let nextId = 1;
    try {
      const files = await fs.readdir(this.usersDir);
      const userFiles = files.filter(file => file.startsWith('user_') && file.endsWith('.json'));
      
      for (const file of userFiles) {
        const match = file.match(/user_(\d+)\.json/);
        if (match) {
          const id = parseInt(match[1], 10);
          if (id >= nextId) {
            nextId = id + 1;
          }
        }
      }
    } catch (error: any) {
      if (error.code !== 'ENOENT') {
        throw error;
      }
      // If directory doesn't exist, just use ID 1
    }
    
    // Create the full user object with metadata
    const fullUser: User = {
      ...user,
      id: nextId,
      role: user.role || 'user',
      createdAt: new Date()
    };
    
    // Create the file path using the defined naming convention
    const filePath = path.join(this.usersDir, `user_${nextId}.json`);
    
    try {
      // Save the user to the file system
      await fs.writeFile(
        filePath,
        JSON.stringify(fullUser, this.dateReplacer, 2)
      );
      console.log(`FileSystemStorage: User ${nextId} created successfully`);
      return fullUser;
    } catch (error: any) {
      console.error(`FileSystemStorage: Error creating user:`, error.message);
      throw error;
    }
  }
  
  /**
   * Update a user
   * @param id User ID
   * @param user Partial user data to update
   * @returns Promise that resolves with the updated user or undefined if not found
   */
  async updateUser(id: number, user: Partial<User>): Promise<User | undefined> {
    console.log(`FileSystemStorage: Updating user with ID: ${id}`);
    await this.ensureDirectories();
    
    const filePath = path.join(this.usersDir, `user_${id}.json`);
    
    try {
      // Read the existing user
      const data = await fs.readFile(filePath, 'utf8');
      const existingUser = JSON.parse(data, this.dateReviver) as User;
      
      // Check if trying to update username and if it's already taken
      if (user.username && user.username !== existingUser.username) {
        const userWithSameUsername = await this.getUserByUsername(user.username);
        if (userWithSameUsername && userWithSameUsername.id !== id) {
          throw new Error(`User with username ${user.username} already exists`);
        }
      }
      
      // Apply updates
      const updatedUser: User = {
        ...existingUser,
        ...user,
        id // Ensure ID stays the same
      };
      
      // Save the updated user
      await fs.writeFile(
        filePath,
        JSON.stringify(updatedUser, this.dateReplacer, 2)
      );
      
      console.log(`FileSystemStorage: User ${id} updated successfully`);
      return updatedUser;
    } catch (error: any) {
      if (error.code === 'ENOENT') {
        console.log(`FileSystemStorage: User ${id} not found for update`);
        return undefined; // File not found, return undefined
      }
      console.error(`FileSystemStorage: Error updating user ${id}:`, error.message);
      throw error;
    }
  }
  
  /**
   * Get all users
   * @param limit Maximum number of users to return
   * @returns Promise that resolves with an array of users
   */
  async getAllUsers(limit?: number): Promise<User[]> {
    console.log(`FileSystemStorage: Getting all users${limit ? ` (limit: ${limit})` : ''}`);
    await this.ensureDirectories();
    
    try {
      // Read all files in the users directory
      const files = await fs.readdir(this.usersDir);
      
      // Filter for user files
      const userFiles = files.filter(file => file.startsWith('user_') && file.endsWith('.json'));
      
      // Read and parse each user file
      const users: User[] = [];
      for (const file of userFiles) {
        try {
          const filePath = path.join(this.usersDir, file);
          const data = await fs.readFile(filePath, 'utf8');
          const user = JSON.parse(data, this.dateReviver) as User;
          users.push(user);
        } catch (fileError: any) {
          console.error(`FileSystemStorage: Error reading user file ${file}:`, fileError.message);
          // Continue with other files even if one fails
        }
      }
      
      // Sort users by ID
      users.sort((a, b) => a.id - b.id);
      
      // Apply limit if provided
      const limitedUsers = limit ? users.slice(0, limit) : users;
      
      console.log(`FileSystemStorage: Retrieved ${limitedUsers.length} users`);
      return limitedUsers;
    } catch (error: any) {
      if (error.code === 'ENOENT') {
        console.log(`FileSystemStorage: Users directory not found, returning empty array`);
        return []; // Directory doesn't exist yet, return empty array
      }
      console.error(`FileSystemStorage: Error getting all users:`, error.message);
      throw error;
    }
  }
  
  /**
   * Get all API keys
   * @returns Promise that resolves with an array of API keys
   */
  async getAllApiKeys(): Promise<ApiKey[]> {
    console.log('FileSystemStorage: Getting all API keys');
    await this.ensureDirectories();
    
    // Create API keys directory if it doesn't exist
    const apiKeysDir = path.join(this.baseDir, 'apikeys');
    await fs.mkdir(apiKeysDir, { recursive: true });
    
    try {
      // Read all files in the API keys directory
      const files = await fs.readdir(apiKeysDir);
      
      // Filter for API key files
      const apiKeyFiles = files.filter(file => file.startsWith('apikey_') && file.endsWith('.json'));
      
      // Read and parse each API key file
      const apiKeys: ApiKey[] = [];
      for (const file of apiKeyFiles) {
        try {
          const filePath = path.join(apiKeysDir, file);
          const data = await fs.readFile(filePath, 'utf8');
          const apiKey = JSON.parse(data, this.dateReviver) as ApiKey;
          apiKeys.push(apiKey);
        } catch (fileError: any) {
          console.error(`FileSystemStorage: Error reading API key file ${file}:`, fileError.message);
          // Continue with other files even if one fails
        }
      }
      
      // Sort API keys by ID
      apiKeys.sort((a, b) => a.id - b.id);
      
      console.log(`FileSystemStorage: Retrieved ${apiKeys.length} API keys`);
      return apiKeys;
    } catch (error: any) {
      if (error.code === 'ENOENT') {
        console.log('FileSystemStorage: API keys directory not found, returning empty array');
        return []; // Directory doesn't exist yet, return empty array
      }
      console.error('FileSystemStorage: Error getting all API keys:', error.message);
      throw error;
    }
  }
  
  /**
   * Get an API key by ID
   * @param id API key ID
   * @returns Promise that resolves with the API key or undefined if not found
   */
  async getApiKey(id: number): Promise<ApiKey | undefined> {
    console.log(`FileSystemStorage: Getting API key with ID: ${id}`);
    await this.ensureDirectories();
    
    // Create API keys directory if it doesn't exist
    const apiKeysDir = path.join(this.baseDir, 'apikeys');
    await fs.mkdir(apiKeysDir, { recursive: true });
    
    const filePath = path.join(apiKeysDir, `apikey_${id}.json`);
    
    try {
      const data = await fs.readFile(filePath, 'utf8');
      const apiKey = JSON.parse(data, this.dateReviver) as ApiKey;
      console.log(`FileSystemStorage: API key ${id} retrieved successfully`);
      return apiKey;
    } catch (error: any) {
      if (error.code === 'ENOENT') {
        console.log(`FileSystemStorage: API key ${id} not found`);
        return undefined; // File not found, return undefined
      }
      console.error(`FileSystemStorage: Error getting API key ${id}:`, error.message);
      throw error;
    }
  }
  
  /**
   * Create a new API key
   * @param apiKey API key data to save
   * @returns Promise that resolves with the created API key
   */
  async createApiKey(apiKey: InsertApiKey): Promise<ApiKey> {
    console.log(`FileSystemStorage: Creating API key with label: ${apiKey.label}`);
    await this.ensureDirectories();
    
    // Create API keys directory if it doesn't exist
    const apiKeysDir = path.join(this.baseDir, 'apikeys');
    await fs.mkdir(apiKeysDir, { recursive: true });
    
    // Find the highest API key ID
    let nextId = 1;
    try {
      const files = await fs.readdir(apiKeysDir);
      const apiKeyFiles = files.filter(file => file.startsWith('apikey_') && file.endsWith('.json'));
      
      for (const file of apiKeyFiles) {
        const match = file.match(/apikey_(\d+)\.json/);
        if (match) {
          const id = parseInt(match[1], 10);
          if (id >= nextId) {
            nextId = id + 1;
          }
        }
      }
    } catch (error: any) {
      if (error.code !== 'ENOENT') {
        throw error;
      }
      // If directory doesn't exist, just use ID 1
    }
    
    // Create the full API key object with metadata
    const fullApiKey: ApiKey = {
      ...apiKey,
      id: nextId,
      status: apiKey.status || 'active',
      usage: apiKey.usage || 0,
      usageLimit: apiKey.usageLimit || 1000,
      createdAt: new Date(),
      expiresAt: apiKey.expiresAt || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) // Default expiry: 1 year
    };
    
    // Create the file path using the defined naming convention
    const filePath = path.join(apiKeysDir, `apikey_${nextId}.json`);
    
    try {
      // Save the API key to the file system
      await fs.writeFile(
        filePath,
        JSON.stringify(fullApiKey, this.dateReplacer, 2)
      );
      console.log(`FileSystemStorage: API key ${nextId} created successfully`);
      return fullApiKey;
    } catch (error: any) {
      console.error('FileSystemStorage: Error creating API key:', error.message);
      throw error;
    }
  }
  
  /**
   * Update an API key
   * @param id API key ID
   * @param apiKey Partial API key data to update
   * @returns Promise that resolves with the updated API key or undefined if not found
   */
  async updateApiKey(id: number, apiKey: Partial<ApiKey>): Promise<ApiKey | undefined> {
    console.log(`FileSystemStorage: Updating API key with ID: ${id}`);
    await this.ensureDirectories();
    
    // Create API keys directory if it doesn't existst
    const apiKeysDir = path.join(this.baseDir, 'apikeys');
    await fs.mkdir(apiKeysDir, { recursive: true });
    
    const filePath = path.join(apiKeysDir, `apikey_${id}.json`);
    
    try {
      // Read the existing API key
      const data = await fs.readFile(filePath, 'utf8');
      const existingApiKey = JSON.parse(data, this.dateReviver) as ApiKey;
      
      // Apply updates
      const updatedApiKey: ApiKey = {
        ...existingApiKey,
        ...apiKey,
        id // Ensure ID stays the same
      };
      
      // Save the updated API key
      await fs.writeFile(
        filePath,
        JSON.stringify(updatedApiKey, this.dateReplacer, 2)
      );
      
      console.log(`FileSystemStorage: API key ${id} updated successfully`);
      return updatedApiKey;
    } catch (error: any) {
      if (error.code === 'ENOENT') {
        console.log(`FileSystemStorage: API key ${id} not found for update`);
        return undefined; // File not found, return undefined
      }
      console.error(`FileSystemStorage: Error updating API key ${id}:`, error.message);
      throw error;
    }
  }
  
  /**
   * Delete an API key
   * @param id ID of the API key to delete
   * @returns Promise that resolves with true if the API key was deleted, false if it wasn't found
   */
  async deleteApiKey(id: number): Promise<boolean> {
    console.log(`FileSystemStorage: Deleting API key ${id}`);
    await this.ensureDirectories();
    
    // Create API keys directory if it doesn't exist
    const apiKeysDir = path.join(this.baseDir, 'apikeys');
    await fs.mkdir(apiKeysDir, { recursive: true });
    
    const filePath = path.join(apiKeysDir, `apikey_${id}.json`);
    
    try {
      // Check if API key exists
      await fs.access(filePath);
      
      // Delete the API key file
      await fs.unlink(filePath);
      console.log(`FileSystemStorage: API key ${id} deleted successfully`);
      return true;
    } catch (error: any) {
      if (error.code === 'ENOENT') {
        console.log(`FileSystemStorage: API key ${id} not found for deletion`);
        return false; // File not found, return false
      }
      console.error(`FileSystemStorage: Error deleting API key ${id}:`, error.message);
      throw error;
    }
  }
  
  // System Log operations (stubs)
  async getAllSystemLogs(limit?: number): Promise<SystemLog[]> {
    throw new Error('Not implemented');
  }
  
  async createSystemLog(log: InsertSystemLog): Promise<SystemLog> {
    throw new Error('Not implemented');
  }
  
  // Media Asset operations (stubs)
  async getAllMediaAssets(limit?: number): Promise<MediaAsset[]> {
    throw new Error('Not implemented');
  }
  
  async getMediaAsset(id: number): Promise<MediaAsset | undefined> {
    throw new Error('Not implemented');
  }
  
  async createMediaAsset(asset: InsertMediaAsset): Promise<MediaAsset> {
    throw new Error('Not implemented');
  }
  
  async deleteMediaAsset(id: number): Promise<boolean> {
    throw new Error('Not implemented');
  }
  
  // Pipeline Job operations (stubs)
  async getAllPipelineJobs(limit?: number): Promise<PipelineJob[]> {
    throw new Error('Not implemented');
  }
  
  async getPipelineJob(id: number): Promise<PipelineJob | undefined> {
    throw new Error('Not implemented');
  }
  
  async createPipelineJob(job: InsertPipelineJob): Promise<PipelineJob> {
    throw new Error('Not implemented');
  }
  
  async updatePipelineJobProgress(id: number, progress: number): Promise<PipelineJob | undefined> {
    throw new Error('Not implemented');
  }
  
  async updatePipelineJobStatus(id: number, status: string): Promise<PipelineJob | undefined> {
    throw new Error('Not implemented');
  }

  /**
   * Get all chunk dependencies with optional filtering
   * @param filter Optional filter criteria
   * @returns Promise that resolves with an array of chunk dependencies
   */
  async getAllChunkDependencies(
    filter?: { sourceId?: string, targetId?: string }
  ): Promise<ChunkDependency[]> {
    console.log('FileSystemStorage: Getting all chunk dependencies with filter:', filter);
    await this.ensureDirectories();

    try {
      const files = await fs.readdir(this.chunkDependenciesDir);
      const dependencyPromises = files
        .filter(file => file.startsWith('dependency_') && file.endsWith('.json'))
        .map(async file => {
          const filePath = path.join(this.chunkDependenciesDir, file);
          const data = await fs.readFile(filePath, 'utf8');
          return JSON.parse(data, this.dateReviver) as ChunkDependency;
        });

      const dependencies = await Promise.all(dependencyPromises);
      
      // Apply filters if provided
      let filteredDependencies = dependencies;
      if (filter) {
        if (filter.sourceId) {
          filteredDependencies = filteredDependencies.filter(
            dependency => dependency.sourceChunkId === filter.sourceId
          );
        }
        if (filter.targetId) {
          filteredDependencies = filteredDependencies.filter(
            dependency => dependency.targetChunkId === filter.targetId
          );
        }
      }

      console.log(`FileSystemStorage: Found ${filteredDependencies.length} chunk dependencies`);
      return filteredDependencies;
    } catch (error: any) {
      if (error.code === 'ENOENT') {
        console.log('FileSystemStorage: Chunk dependencies directory not found');
        return [];
      }
      console.error('FileSystemStorage: Error getting chunk dependencies:', error.message);
      throw error;
    }
  }

  /**
   * Get a chunk dependency by ID
   * @param id Chunk dependency ID
   * @returns Promise that resolves with the chunk dependency or undefined if not found
   */
  async getChunkDependency(id: string): Promise<ChunkDependency | undefined> {
    console.log(`FileSystemStorage: Getting chunk dependency ${id}`);
    await this.ensureDirectories();
    
    const filePath = path.join(this.chunkDependenciesDir, `dependency_${id}.json`);
    
    try {
      const data = await fs.readFile(filePath, 'utf8');
      const dependency = JSON.parse(data, this.dateReviver) as ChunkDependency;
      return dependency;
    } catch (error: any) {
      if (error.code === 'ENOENT') {
        console.log(`FileSystemStorage: Chunk dependency ${id} not found`);
        return undefined;
      }
      console.error(`FileSystemStorage: Error getting chunk dependency ${id}:`, error.message);
      throw error;
    }
  }

  /**
   * Create a new chunk dependency
   * @param insertDependency Chunk dependency data to insert
   * @returns Promise that resolves with the created chunk dependency
   */
  async createChunkDependency(insertDependency: InsertChunkDependency): Promise<ChunkDependency> {
    console.log(`FileSystemStorage: Creating chunk dependency between ${insertDependency.sourceChunkId} and ${insertDependency.targetChunkId}`);
    await this.ensureDirectories();
    
    const id = insertDependency.id || uuidv4();
    const now = new Date();
    
    const dependency: ChunkDependency = {
      id,
      sourceChunkId: insertDependency.sourceChunkId,
      targetChunkId: insertDependency.targetChunkId,
      type: insertDependency.type,
      strength: insertDependency.strength,
      metadata: insertDependency.metadata || {},
      createdAt: now,
      updatedAt: now
    };
    
    const filePath = path.join(this.chunkDependenciesDir, `dependency_${id}.json`);
    
    try {
      await fs.writeFile(
        filePath,
        JSON.stringify(dependency, this.dateReplacer, 2)
      );
      
      console.log(`FileSystemStorage: Chunk dependency ${id} created successfully`);
      return dependency;
    } catch (error: any) {
      console.error(`FileSystemStorage: Error creating chunk dependency:`, error.message);
      throw error;
    }
  }

  /**
   * Update a chunk dependency
   * @param id Chunk dependency ID
   * @param dependencyUpdate Partial chunk dependency data for update
   * @returns Promise that resolves with the updated chunk dependency or undefined if not found
   */
  async updateChunkDependency(id: string, dependencyUpdate: Partial<ChunkDependency>): Promise<ChunkDependency | undefined> {
    console.log(`FileSystemStorage: Updating chunk dependency ${id}`);
    await this.ensureDirectories();
    
    const filePath = path.join(this.chunkDependenciesDir, `dependency_${id}.json`);
    
    try {
      // Read the existing dependency
      const data = await fs.readFile(filePath, 'utf8');
      const existingDependency = JSON.parse(data, this.dateReviver) as ChunkDependency;
      
      // Update the dependency
      const updatedDependency: ChunkDependency = {
        ...existingDependency,
        ...dependencyUpdate,
        id, // Ensure ID doesn't change
        updatedAt: new Date() // Update modification time
      };
      
      // Save the updated dependency
      await fs.writeFile(
        filePath,
        JSON.stringify(updatedDependency, this.dateReplacer, 2)
      );
      
      console.log(`FileSystemStorage: Chunk dependency ${id} updated successfully`);
      return updatedDependency;
    } catch (error: any) {
      if (error.code === 'ENOENT') {
        console.log(`FileSystemStorage: Chunk dependency ${id} not found for update`);
        return undefined;
      }
      console.error(`FileSystemStorage: Error updating chunk dependency ${id}:`, error.message);
      throw error;
    }
  }

  /**
   * Delete a chunk dependency
   * @param id Chunk dependency ID
   * @returns Promise that resolves with true if dependency was deleted, false if not found
   */
  async deleteChunkDependency(id: string): Promise<boolean> {
    console.log(`FileSystemStorage: Deleting chunk dependency ${id}`);
    await this.ensureDirectories();
    
    const filePath = path.join(this.chunkDependenciesDir, `dependency_${id}.json`);
    
    try {
      await fs.unlink(filePath);
      console.log(`FileSystemStorage: Chunk dependency ${id} deleted successfully`);
      return true;
    } catch (error: any) {
      if (error.code === 'ENOENT') {
        console.log(`FileSystemStorage: Chunk dependency ${id} not found for deletion`);
        return false;
      }
      console.error(`FileSystemStorage: Error deleting chunk dependency ${id}:`, error.message);
      throw error;
    }
  }
  
  /**
   * Get all temporal instances with optional filtering
   * @param limit Maximum number of instances to return
   * @param filter Filter criteria for instances
   * @returns Promise that resolves with an array of TemporalInstance objects
   */
  async getAllTemporalInstances(
    limit?: number,
    filter?: { nodeId?: string, dimensionType?: string }
  ): Promise<TemporalInstance[]> {
    console.log(`FileSystemStorage: Getting all temporal instances${limit ? ` (limit: ${limit})` : ''}${filter ? ` with filter` : ''}`);
    await this.ensureDirectories();
    
    try {
      // Read all files in the temporal instances directory
      const files = await fs.readdir(this.temporalInstancesDir);
      
      // Filter for temporal instance files
      const instanceFiles = files.filter(file => file.startsWith('temporal_') && file.endsWith('.json'));
      
      // Read and parse each instance file
      const instances: TemporalInstance[] = [];
      for (const file of instanceFiles) {
        try {
          const filePath = path.join(this.temporalInstancesDir, file);
          const data = await fs.readFile(filePath, 'utf8');
          const instance = JSON.parse(data, this.dateReviver) as TemporalInstance;
          instances.push(instance);
        } catch (fileError: any) {
          console.error(`FileSystemStorage: Error reading temporal instance file ${file}:`, fileError.message);
          // Continue with other files even if one fails
        }
      }
      
      // Apply filters if provided
      let filteredInstances = instances;
      if (filter) {
        if (filter.nodeId !== undefined) {
          filteredInstances = filteredInstances.filter(instance => instance.nodeId === filter.nodeId);
        }
        if (filter.dimensionType !== undefined) {
          filteredInstances = filteredInstances.filter(instance => instance.dimensionType === filter.dimensionType);
        }
      }
      
      // Sort instances by timestamp (newest first)
      filteredInstances.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
      
      // Apply limit if provided
      const limitedInstances = limit ? filteredInstances.slice(0, limit) : filteredInstances;
      
      console.log(`FileSystemStorage: Retrieved ${limitedInstances.length} temporal instances`);
      return limitedInstances;
    } catch (error: any) {
      if (error.code === 'ENOENT') {
        console.log(`FileSystemStorage: Temporal instances directory not found, returning empty array`);
        return []; // Directory doesn't exist yet, return empty array
      }
      console.error(`FileSystemStorage: Error getting all temporal instances:`, error.message);
      throw error;
    }
  }
  
  /**
   * Get a temporal instance by ID
   * @param id ID of the temporal instance to retrieve
   * @returns Promise that resolves with the TemporalInstance or undefined if not found
   */
  async getTemporalInstance(id: string): Promise<TemporalInstance | undefined> {
    console.log(`FileSystemStorage: Getting temporal instance ${id}`);
    await this.ensureDirectories();
    
    const filePath = path.join(this.temporalInstancesDir, `temporal_${id}.json`);
    
    try {
      const data = await fs.readFile(filePath, 'utf8');
      const instance = JSON.parse(data, this.dateReviver) as TemporalInstance;
      console.log(`FileSystemStorage: Temporal instance ${id} retrieved successfully`);
      return instance;
    } catch (error: any) {
      if (error.code === 'ENOENT') {
        console.log(`FileSystemStorage: Temporal instance ${id} not found`);
        return undefined; // File not found, return undefined
      }
      console.error(`FileSystemStorage: Error getting temporal instance ${id}:`, error.message);
      throw error;
    }
  }
  
  // Original implementation of updateTemporalInstance, accessTemporalInstance, and deleteTemporalInstance removed 
  // to avoid duplication with the implementation below
  
  /**
   * Create a new temporal instance
   * @param instance Temporal instance data to save
   * @returns Promise that resolves with the created TemporalInstance
   */
  async createTemporalInstance(instance: InsertTemporalInstance): Promise<TemporalInstance> {
    console.log(`FileSystemStorage: Creating temporal instance for node ${instance.nodeId}`);
    await this.ensureDirectories();
    
    // Generate a unique ID if not provided
    const instanceId = instance.id || uuidv4();
    
    // Create the full temporal instance object with metadata
    const now = new Date();
    const fullInstance: TemporalInstance = {
      ...instance,
      id: instanceId,
      timestamp: instance.timestamp || now,
      createdAt: now,
      updatedAt: now
    };
    
    // Create the file path using the defined naming convention
    const filePath = path.join(this.temporalInstancesDir, `temporal_${instanceId}.json`);
    
    try {
      // Save the temporal instance to the file system
      await fs.writeFile(
        filePath,
        JSON.stringify(fullInstance, this.dateReplacer, 2)
      );
      console.log(`FileSystemStorage: Temporal instance ${instanceId} created successfully`);
      return fullInstance;
    } catch (error: any) {
      console.error(`FileSystemStorage: Error creating temporal instance ${instanceId}:`, error.message);
      throw error;
    }
  }
  
  /**
   * Update a temporal instance
   * @param id ID of the temporal instance to update
   * @param instanceUpdate Partial instance data to update
   * @returns Promise that resolves with the updated TemporalInstance or undefined if not found
   */
  async updateTemporalInstance(id: string, instanceUpdate: Partial<TemporalInstance>): Promise<TemporalInstance | undefined> {
    console.log(`FileSystemStorage: Updating temporal instance ${id}`);
    await this.ensureDirectories();
    
    const filePath = path.join(this.temporalInstancesDir, `temporal_${id}.json`);
    
    try {
      // Read the existing instance
      const data = await fs.readFile(filePath, 'utf8');
      const existingInstance = JSON.parse(data, this.dateReviver) as TemporalInstance;
      
      // Update the instance
      const updatedInstance: TemporalInstance = {
        ...existingInstance,
        ...instanceUpdate,
        id, // Ensure ID doesn't change
        updatedAt: new Date() // Always update the updatedAt timestamp
      };
      
      // Save the updated instance
      await fs.writeFile(
        filePath,
        JSON.stringify(updatedInstance, this.dateReplacer, 2)
      );
      
      console.log(`FileSystemStorage: Temporal instance ${id} updated successfully`);
      return updatedInstance;
    } catch (error: any) {
      if (error.code === 'ENOENT') {
        console.log(`FileSystemStorage: Temporal instance ${id} not found for update`);
        return undefined; // File not found, return undefined
      }
      console.error(`FileSystemStorage: Error updating temporal instance ${id}:`, error.message);
      throw error;
    }
  }
  
  /**
   * Delete a temporal instance
   * @param id ID of the temporal instance to delete
   * @returns Promise that resolves with true if the instance was deleted, false if it wasn't found
   */
  async deleteTemporalInstance(id: string): Promise<boolean> {
    console.log(`FileSystemStorage: Deleting temporal instance ${id}`);
    await this.ensureDirectories();
    
    const filePath = path.join(this.temporalInstancesDir, `temporal_${id}.json`);
    
    try {
      await fs.unlink(filePath);
      console.log(`FileSystemStorage: Temporal instance ${id} deleted successfully`);
      return true;
    } catch (error: any) {
      if (error.code === 'ENOENT') {
        console.log(`FileSystemStorage: Temporal instance ${id} not found for deletion`);
        return false; // File not found, return false
      }
      console.error(`FileSystemStorage: Error deleting temporal instance ${id}:`, error.message);
      throw error;
    }
  }
  
  /**
   * Access a temporal instance (records the access)
   * @param id ID of the temporal instance to access
   * @returns Promise that resolves with the accessed TemporalInstance or undefined if not found
   */
  async accessTemporalInstance(id: string): Promise<TemporalInstance | undefined> {
    console.log(`FileSystemStorage: Accessing temporal instance ${id}`);
    await this.ensureDirectories();
    
    const filePath = path.join(this.temporalInstancesDir, `temporal_${id}.json`);
    
    try {
      // Read the existing instance
      const data = await fs.readFile(filePath, 'utf8');
      const existingInstance = JSON.parse(data, this.dateReviver) as TemporalInstance;
      
      // Update access metadata
      const accessedInstance: TemporalInstance = {
        ...existingInstance,
        updatedAt: new Date() // Update the updatedAt timestamp
      };
      
      // Save the updated instance with access information
      await fs.writeFile(
        filePath,
        JSON.stringify(accessedInstance, this.dateReplacer, 2)
      );
      
      console.log(`FileSystemStorage: Temporal instance ${id} accessed successfully`);
      return accessedInstance;
    } catch (error: any) {
      if (error.code === 'ENOENT') {
        console.log(`FileSystemStorage: Temporal instance ${id} not found for access`);
        return undefined; // File not found, return undefined
      }
      console.error(`FileSystemStorage: Error accessing temporal instance ${id}:`, error.message);
      throw error;
    }
  }
  
  /**
   * Get all adaptive resonances with optional filtering
   * @param limit Maximum number of adaptive resonances to return
   * @param filter Filter criteria for adaptive resonances
   * @returns Promise that resolves with an array of AdaptiveResonance objects
   */
  async getAllAdaptiveResonances(
    limit?: number,
    filter?: { chunkId?: string, modelType?: string }
  ): Promise<AdaptiveResonance[]> {
    console.log(`FileSystemStorage: Getting all adaptive resonances${limit ? ` (limit: ${limit})` : ''}${filter ? ` with filter` : ''}`);
    await this.ensureDirectories();
    
    // Ensure adaptive resonances directory exists
    const adaptiveResonancesDir = path.join(this.baseDir, 'adaptive_resonances');
    await fs.mkdir(adaptiveResonancesDir, { recursive: true });
    
    try {
      // Read all files in the adaptive resonances directory
      const files = await fs.readdir(adaptiveResonancesDir);
      
      // Filter for adaptive resonance files
      const resonanceFiles = files.filter(file => file.startsWith('resonance_') && file.endsWith('.json'));
      
      // Read and parse each resonance file
      const resonances: AdaptiveResonance[] = [];
      for (const file of resonanceFiles) {
        try {
          const filePath = path.join(adaptiveResonancesDir, file);
          const data = await fs.readFile(filePath, 'utf8');
          const resonance = JSON.parse(data, this.dateReviver) as AdaptiveResonance;
          resonances.push(resonance);
        } catch (fileError: any) {
          console.error(`FileSystemStorage: Error reading adaptive resonance file ${file}:`, fileError.message);
          // Continue with other files even if one fails
        }
      }
      
      // Apply filters if provided
      let filteredResonances = resonances;
      if (filter) {
        if (filter.chunkId !== undefined) {
          filteredResonances = filteredResonances.filter(resonance => resonance.chunkId === filter.chunkId);
        }
        if (filter.modelType !== undefined) {
          filteredResonances = filteredResonances.filter(resonance => resonance.modelType === filter.modelType);
        }
      }
      
      // Sort resonances by strength (highest first)
      filteredResonances.sort((a, b) => b.strength - a.strength);
      
      // Apply limit if provided
      const limitedResonances = limit ? filteredResonances.slice(0, limit) : filteredResonances;
      
      console.log(`FileSystemStorage: Retrieved ${limitedResonances.length} adaptive resonances`);
      return limitedResonances;
    } catch (error: any) {
      if (error.code === 'ENOENT') {
        console.log(`FileSystemStorage: Adaptive resonances directory not found, returning empty array`);
        return []; // Directory doesn't exist yet, return empty array
      }
      console.error(`FileSystemStorage: Error getting all adaptive resonances:`, error.message);
      throw error;
    }
  }
  
  /**
   * Get an adaptive resonance by ID
   * @param id ID of the adaptive resonance to retrieve
   * @returns Promise that resolves with the AdaptiveResonance or undefined if not found
   */
  async getAdaptiveResonance(id: string): Promise<AdaptiveResonance | undefined> {
    console.log(`FileSystemStorage: Getting adaptive resonance ${id}`);
    await this.ensureDirectories();
    
    // Ensure adaptive resonances directory exists
    const adaptiveResonancesDir = path.join(this.baseDir, 'adaptive_resonances');
    await fs.mkdir(adaptiveResonancesDir, { recursive: true });
    
    const filePath = path.join(adaptiveResonancesDir, `resonance_${id}.json`);
    
    try {
      const data = await fs.readFile(filePath, 'utf8');
      const resonance = JSON.parse(data, this.dateReviver) as AdaptiveResonance;
      console.log(`FileSystemStorage: Adaptive resonance ${id} retrieved successfully`);
      return resonance;
    } catch (error: any) {
      if (error.code === 'ENOENT') {
        console.log(`FileSystemStorage: Adaptive resonance ${id} not found`);
        return undefined; // File not found, return undefined
      }
      console.error(`FileSystemStorage: Error getting adaptive resonance ${id}:`, error.message);
      throw error;
    }
  }
  
  /**
   * Create a new adaptive resonance
   * @param resonance Adaptive resonance data to save
   * @returns Promise that resolves with the created AdaptiveResonance
   */
  async createAdaptiveResonance(resonance: InsertAdaptiveResonance): Promise<AdaptiveResonance> {
    console.log(`FileSystemStorage: Creating adaptive resonance for chunk ${resonance.chunkId} and model type ${resonance.modelType}`);
    await this.ensureDirectories();
    
    // Ensure adaptive resonances directory exists
    const adaptiveResonancesDir = path.join(this.baseDir, 'adaptive_resonances');
    await fs.mkdir(adaptiveResonancesDir, { recursive: true });
    
    // Generate a unique ID if not provided
    const resonanceId = resonance.id || uuidv4();
    
    // Create the full adaptive resonance object with metadata
    const now = new Date();
    const fullResonance: AdaptiveResonance = {
      ...resonance,
      id: resonanceId,
      createdAt: now,
      updatedAt: now
    };
    
    // Create the file path using the defined naming convention
    const filePath = path.join(adaptiveResonancesDir, `resonance_${resonanceId}.json`);
    
    try {
      // Save the adaptive resonance to the file system
      await fs.writeFile(
        filePath,
        JSON.stringify(fullResonance, this.dateReplacer, 2)
      );
      console.log(`FileSystemStorage: Adaptive resonance ${resonanceId} created successfully`);
      return fullResonance;
    } catch (error: any) {
      console.error(`FileSystemStorage: Error creating adaptive resonance ${resonanceId}:`, error.message);
      throw error;
    }
  }
  
  /**
   * Update an adaptive resonance
   * @param id ID of the adaptive resonance to update
   * @param resonanceUpdate Partial resonance data to update
   * @returns Promise that resolves with the updated AdaptiveResonance or undefined if not found
   */
  async updateAdaptiveResonance(id: string, resonanceUpdate: Partial<AdaptiveResonance>): Promise<AdaptiveResonance | undefined> {
    console.log(`FileSystemStorage: Updating adaptive resonance ${id}`);
    await this.ensureDirectories();
    
    // Ensure adaptive resonances directory exists
    const adaptiveResonancesDir = path.join(this.baseDir, 'adaptive_resonances');
    await fs.mkdir(adaptiveResonancesDir, { recursive: true });
    
    const filePath = path.join(adaptiveResonancesDir, `resonance_${id}.json`);
    
    try {
      // Read the existing resonance
      const data = await fs.readFile(filePath, 'utf8');
      const existingResonance = JSON.parse(data, this.dateReviver) as AdaptiveResonance;
      
      // Update the resonance
      const updatedResonance: AdaptiveResonance = {
        ...existingResonance,
        ...resonanceUpdate,
        id, // Ensure ID doesn't change
        updatedAt: new Date() // Always update the updatedAt timestamp
      };
      
      // Save the updated resonance
      await fs.writeFile(
        filePath,
        JSON.stringify(updatedResonance, this.dateReplacer, 2)
      );
      
      console.log(`FileSystemStorage: Adaptive resonance ${id} updated successfully`);
      return updatedResonance;
    } catch (error: any) {
      if (error.code === 'ENOENT') {
        console.log(`FileSystemStorage: Adaptive resonance ${id} not found for update`);
        return undefined; // File not found, return undefined
      }
      console.error(`FileSystemStorage: Error updating adaptive resonance ${id}:`, error.message);
      throw error;
    }
  }
  
  /**
   * Delete an adaptive resonance
   * @param id ID of the adaptive resonance to delete
   * @returns Promise that resolves with true if the resonance was deleted, false if it wasn't found
   */
  async deleteAdaptiveResonance(id: string): Promise<boolean> {
    console.log(`FileSystemStorage: Deleting adaptive resonance ${id}`);
    await this.ensureDirectories();
    
    // Ensure adaptive resonances directory exists
    const adaptiveResonancesDir = path.join(this.baseDir, 'adaptive_resonances');
    await fs.mkdir(adaptiveResonancesDir, { recursive: true });
    
    const filePath = path.join(adaptiveResonancesDir, `resonance_${id}.json`);
    
    try {
      await fs.unlink(filePath);
      console.log(`FileSystemStorage: Adaptive resonance ${id} deleted successfully`);
      return true;
    } catch (error: any) {
      if (error.code === 'ENOENT') {
        console.log(`FileSystemStorage: Adaptive resonance ${id} not found for deletion`);
        return false; // File not found, return false
      }
      console.error(`FileSystemStorage: Error deleting adaptive resonance ${id}:`, error.message);
      throw error;
    }
  }

  /**
   * Create a new meta-cognitive event
   * @param event Event data to create
   * @returns The created event
   */
  async createMetaCognitiveEvent(event: InsertMetaCognitiveEvent): Promise<MetaCognitiveEvent> {
    console.log(`FileSystemStorage: Creating meta-cognitive event with type: ${event.type}`);
    await this.ensureDirectories();
    
    // Generate a unique ID if not provided
    const eventId = event.id || uuidv4();
    
    // Create the full event object with metadata
    const fullEvent: MetaCognitiveEvent = {
      ...event,
      id: eventId,
      createdAt: new Date()
    };
    
    // Create the file path using the defined naming convention
    const filePath = path.join(this.metaCognitiveEventsDir, `event_${eventId}.json`);
    
    try {
      // Save the event to the file system
      await fs.writeFile(
        filePath,
        JSON.stringify(fullEvent, this.dateReplacer, 2)
      );
      console.log(`FileSystemStorage: Meta-cognitive event ${eventId} created successfully`);
      return fullEvent;
    } catch (error: any) {
      console.error(`FileSystemStorage: Error creating meta-cognitive event ${eventId}:`, error.message);
      throw error;
    }
  }
  
  /**
   * Get a meta-cognitive event by ID
   * @param eventId ID of the event to get
   * @returns The event or undefined if not found
   */
  async getMetaCognitiveEvent(eventId: string): Promise<MetaCognitiveEvent | undefined> {
    console.log(`FileSystemStorage: Getting meta-cognitive event with ID: ${eventId}`);
    await this.ensureDirectories();
    
    const filePath = path.join(this.metaCognitiveEventsDir, `event_${eventId}.json`);
    
    try {
      const data = await fs.readFile(filePath, 'utf8');
      const event = JSON.parse(data, this.dateReviver) as MetaCognitiveEvent;
      console.log(`FileSystemStorage: Meta-cognitive event ${eventId} retrieved successfully`);
      return event;
    } catch (error: any) {
      if (error.code === 'ENOENT') {
        console.log(`FileSystemStorage: Meta-cognitive event ${eventId} not found`);
        return undefined;
      }
      console.error(`FileSystemStorage: Error getting meta-cognitive event ${eventId}:`, error.message);
      throw error;
    }
  }
  
  /**
   * Update a meta-cognitive event
   * @param eventId ID of the event to update
   * @param eventData Updated event data
   * @returns The updated event or undefined if not found
   */
  async updateMetaCognitiveEvent(eventId: string, eventData: Partial<MetaCognitiveEvent>): Promise<MetaCognitiveEvent | undefined> {
    console.log(`FileSystemStorage: Updating meta-cognitive event ${eventId}`);
    await this.ensureDirectories();
    
    const filePath = path.join(this.metaCognitiveEventsDir, `event_${eventId}.json`);
    
    try {
      // Read the existing event
      const data = await fs.readFile(filePath, 'utf8');
      const existingEvent = JSON.parse(data, this.dateReviver) as MetaCognitiveEvent;
      
      // Update the event with new data, preserving the ID and creation date
      const updatedEvent: MetaCognitiveEvent = {
        ...existingEvent,
        ...eventData,
        id: eventId,                   // Ensure ID remains the same
        createdAt: existingEvent.createdAt  // Preserve original creation date
      };
      
      // Save the updated event
      await fs.writeFile(
        filePath,
        JSON.stringify(updatedEvent, this.dateReplacer, 2)
      );
      
      console.log(`FileSystemStorage: Meta-cognitive event ${eventId} updated successfully`);
      return updatedEvent;
    } catch (error: any) {
      if (error.code === 'ENOENT') {
        console.log(`FileSystemStorage: Meta-cognitive event ${eventId} not found for update`);
        return undefined;
      }
      console.error(`FileSystemStorage: Error updating meta-cognitive event ${eventId}:`, error.message);
      throw error;
    }
  }
  
  /**
   * Delete a meta-cognitive event
   * @param eventId ID of the event to delete
   * @returns true if deleted, false if not found
   */
  async deleteMetaCognitiveEvent(eventId: string): Promise<boolean> {
    console.log(`FileSystemStorage: Deleting meta-cognitive event ${eventId}`);
    await this.ensureDirectories();
    
    const filePath = path.join(this.metaCognitiveEventsDir, `event_${eventId}.json`);
    
    try {
      // Check if the file exists
      await fs.access(filePath);
      
      // Delete the file
      await fs.unlink(filePath);
      console.log(`FileSystemStorage: Meta-cognitive event ${eventId} deleted successfully`);
      return true;
    } catch (error: any) {
      if (error.code === 'ENOENT') {
        console.log(`FileSystemStorage: Meta-cognitive event ${eventId} not found for deletion`);
        return false;
      }
      console.error(`FileSystemStorage: Error deleting meta-cognitive event ${eventId}:`, error.message);
      throw error;
    }
  }
  
  /**
   * Get all meta-cognitive events matching filter criteria
   * @param filter Optional filter criteria
   * @param limit Maximum number of events to return
   * @returns Array of meta-cognitive events
   */
  async getAllMetaCognitiveEvents(filter?: { nodeId?: string, type?: string }, limit?: number): Promise<MetaCognitiveEvent[]> {
    console.log(`FileSystemStorage: Getting all meta-cognitive events${limit ? ` (limit: ${limit})` : ''}`);
    await this.ensureDirectories();
    
    try {
      const files = await fs.readdir(this.metaCognitiveEventsDir);
      const jsonFiles = files.filter(file => file.endsWith('.json'));
      
      // Read and parse each file
      const events: MetaCognitiveEvent[] = [];
      for (const file of jsonFiles) {
        try {
          const filePath = path.join(this.metaCognitiveEventsDir, file);
          const data = await fs.readFile(filePath, 'utf8');
          const event = JSON.parse(data, this.dateReviver) as MetaCognitiveEvent;
          
          // Apply filters if provided
          if (filter) {
            const matchesNodeId = !filter.nodeId || event.nodeId === filter.nodeId;
            const matchesType = !filter.type || event.type === filter.type;
            
            // Skip this event if it doesn't match ANY of the filter conditions
            if (!matchesNodeId || !matchesType) {
              continue;
            }
          }
          
          events.push(event);
        } catch (fileError: any) {
          console.error(`FileSystemStorage: Error reading meta-cognitive event file ${file}:`, fileError.message);
          // Continue with other files even if one fails
        }
      }
      
      // Sort events by creation date (newest first)
      events.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
      
      // Apply limit if provided
      const limitedEvents = limit ? events.slice(0, limit) : events;
      
      console.log(`FileSystemStorage: Retrieved ${limitedEvents.length} meta-cognitive events`);
      return limitedEvents;
    } catch (error: any) {
      if (error.code === 'ENOENT') {
        console.log(`FileSystemStorage: Meta-cognitive events directory not found, returning empty array`);
        return []; // Directory doesn't exist yet, return empty array
      }
      console.error(`FileSystemStorage: Error getting meta-cognitive events:`, error.message);
      throw error;
    }
  }

  /**
   * Create a new quantum root node
   * @param node Node data to create
   * @returns The created quantum root node
   */
  async createQuantumRootNode(node: InsertQuantumRootNode): Promise<QuantumRootNode> {
    console.log(`FileSystemStorage: Creating quantum root node with name: ${node.name}`);
    await this.ensureDirectories();
    
    // Generate a unique ID if not provided
    const nodeId = node.id || uuidv4();
    
    // Create the full node object with metadata
    const fullNode: QuantumRootNode = {
      ...node,
      id: nodeId,
      createdAt: new Date(),
      updatedAt: new Date(),
      state: node.state || {},
      capabilities: node.capabilities || [],
      connections: node.connections || {},
      coherenceScore: node.coherenceScore || 0.5
    };
    
    // Create the file path using the defined naming convention
    const filePath = path.join(this.qrnMetricsDir, `node_${nodeId}.json`);
    
    try {
      // Save the node to the file system
      await fs.writeFile(
        filePath,
        JSON.stringify(fullNode, this.dateReplacer, 2)
      );
      console.log(`FileSystemStorage: Quantum root node ${nodeId} created successfully`);
      return fullNode;
    } catch (error: any) {
      console.error(`FileSystemStorage: Error creating quantum root node ${nodeId}:`, error.message);
      throw error;
    }
  }
  
  /**
   * Get a quantum root node by ID
   * @param nodeId ID of the node to get
   * @returns The node or undefined if not found
   */
  async getQuantumRootNode(nodeId: string): Promise<QuantumRootNode | undefined> {
    console.log(`FileSystemStorage: Getting quantum root node with ID: ${nodeId}`);
    await this.ensureDirectories();
    
    const filePath = path.join(this.qrnMetricsDir, `node_${nodeId}.json`);
    
    try {
      const data = await fs.readFile(filePath, 'utf8');
      const node = JSON.parse(data, this.dateReviver) as QuantumRootNode;
      console.log(`FileSystemStorage: Quantum root node ${nodeId} retrieved successfully`);
      return node;
    } catch (error: any) {
      if (error.code === 'ENOENT') {
        console.log(`FileSystemStorage: Quantum root node ${nodeId} not found`);
        return undefined;
      }
      console.error(`FileSystemStorage: Error getting quantum root node ${nodeId}:`, error.message);
      throw error;
    }
  }
  
  /**
   * Update a quantum root node
   * @param nodeId ID of the node to update
   * @param nodeData Updated node data
   * @returns The updated node or undefined if not found
   */
  async updateQuantumRootNode(nodeId: string, nodeData: Partial<QuantumRootNode>): Promise<QuantumRootNode | undefined> {
    console.log(`FileSystemStorage: Updating quantum root node ${nodeId}`);
    await this.ensureDirectories();
    
    const filePath = path.join(this.qrnMetricsDir, `node_${nodeId}.json`);
    
    try {
      // Read the existing node
      const data = await fs.readFile(filePath, 'utf8');
      const existingNode = JSON.parse(data, this.dateReviver) as QuantumRootNode;
      
      // Update the node with new data, preserving the ID and creation date
      const updatedNode: QuantumRootNode = {
        ...existingNode,
        ...nodeData,
        id: nodeId,                   // Ensure ID remains the same
        createdAt: existingNode.createdAt,  // Preserve original creation date
        updatedAt: new Date()         // Update the modification date
      };
      
      // Save the updated node
      await fs.writeFile(
        filePath,
        JSON.stringify(updatedNode, this.dateReplacer, 2)
      );
      
      console.log(`FileSystemStorage: Quantum root node ${nodeId} updated successfully`);
      return updatedNode;
    } catch (error: any) {
      if (error.code === 'ENOENT') {
        console.log(`FileSystemStorage: Quantum root node ${nodeId} not found for update`);
        return undefined;
      }
      console.error(`FileSystemStorage: Error updating quantum root node ${nodeId}:`, error.message);
      throw error;
    }
  }
  
  /**
   * Update a quantum root node's state
   * @param nodeId ID of the node to update
   * @param state New state data
   * @returns The updated node or undefined if not found
   */
  async updateQuantumRootNodeState(nodeId: string, state: any): Promise<QuantumRootNode | undefined> {
    console.log(`FileSystemStorage: Updating quantum root node ${nodeId} state`);
    await this.ensureDirectories();
    
    const filePath = path.join(this.qrnMetricsDir, `node_${nodeId}.json`);
    
    try {
      // Read the existing node
      const data = await fs.readFile(filePath, 'utf8');
      const existingNode = JSON.parse(data, this.dateReviver) as QuantumRootNode;
      
      // Merge the existing state with the new state
      const mergedState = {
        ...existingNode.state,
        ...state
      };
      
      // Update the node with the new state
      const updatedNode: QuantumRootNode = {
        ...existingNode,
        state: mergedState,
        updatedAt: new Date(),
        lastActivity: new Date()
      };
      
      // Save the updated node
      await fs.writeFile(
        filePath,
        JSON.stringify(updatedNode, this.dateReplacer, 2)
      );
      
      console.log(`FileSystemStorage: Quantum root node ${nodeId} state updated successfully`);
      return updatedNode;
    } catch (error: any) {
      if (error.code === 'ENOENT') {
        console.log(`FileSystemStorage: Quantum root node ${nodeId} not found for state update`);
        return undefined;
      }
      console.error(`FileSystemStorage: Error updating quantum root node ${nodeId} state:`, error.message);
      throw error;
    }
  }
  
  /**
   * Delete a quantum root node
   * @param nodeId ID of the node to delete
   * @returns true if deleted, false if not found
   */
  async deleteQuantumRootNode(nodeId: string): Promise<boolean> {
    console.log(`FileSystemStorage: Deleting quantum root node ${nodeId}`);
    await this.ensureDirectories();
    
    const filePath = path.join(this.qrnMetricsDir, `node_${nodeId}.json`);
    
    try {
      // Check if the file exists
      await fs.access(filePath);
      
      // Delete the file
      await fs.unlink(filePath);
      console.log(`FileSystemStorage: Quantum root node ${nodeId} deleted successfully`);
      return true;
    } catch (error: any) {
      if (error.code === 'ENOENT') {
        console.log(`FileSystemStorage: Quantum root node ${nodeId} not found for deletion`);
        return false;
      }
      console.error(`FileSystemStorage: Error deleting quantum root node ${nodeId}:`, error.message);
      throw error;
    }
  }
  
  /**
   * Get all quantum root nodes matching filter criteria
   * @param filter Optional filter criteria
   * @param limit Maximum number of nodes to return
   * @returns Array of quantum root nodes
   */
  async getAllQuantumRootNodes(limit?: number, filter?: { userId?: number, type?: string, status?: string }): Promise<QuantumRootNode[]> {
    console.log(`FileSystemStorage: Getting all quantum root nodes${limit ? ` (limit: ${limit})` : ''}`);
    await this.ensureDirectories();
    
    try {
      const files = await fs.readdir(this.qrnMetricsDir);
      const jsonFiles = files.filter(file => file.endsWith('.json'));
      
      // Read and parse each file
      const nodes: QuantumRootNode[] = [];
      for (const file of jsonFiles) {
        try {
          const filePath = path.join(this.qrnMetricsDir, file);
          const data = await fs.readFile(filePath, 'utf8');
          const node = JSON.parse(data, this.dateReviver) as QuantumRootNode;
          
          // Apply filters if provided - note that userId, type, and status fields
          // are not defined in the core schema but might be implemented in extended versions
          if (filter) {
            // Skip adding to results if any filter doesn't match
            // Use type-safe hasOwnProperty checks for potentially undefined fields
            if (filter.userId !== undefined && (!node.hasOwnProperty('userId') || (node as any).userId !== filter.userId)) {
              continue;
            }
            if (filter.type !== undefined && (!node.hasOwnProperty('type') || (node as any).type !== filter.type)) {
              continue;
            }
            if (filter.status !== undefined && (!node.hasOwnProperty('status') || (node as any).status !== filter.status)) {
              continue;
            }
          }
          
          nodes.push(node);
        } catch (fileError: any) {
          console.error(`FileSystemStorage: Error reading quantum root node file ${file}:`, fileError.message);
          // Continue with other files even if one fails
        }
      }
      
      // Sort nodes by creation date (newest first)
      nodes.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
      
      // Apply limit if provided
      const limitedNodes = limit ? nodes.slice(0, limit) : nodes;
      
      console.log(`FileSystemStorage: Retrieved ${limitedNodes.length} quantum root nodes`);
      return limitedNodes;
    } catch (error: any) {
      if (error.code === 'ENOENT') {
        console.log(`FileSystemStorage: Quantum root nodes directory not found, returning empty array`);
        return []; // Directory doesn't exist yet, return empty array
      }
      console.error(`FileSystemStorage: Error getting quantum root nodes:`, error.message);
      throw error;
    }
  }

  /**
   * Create a new neural pathway
   * @param pathway Pathway data to create
   * @returns The created neural pathway
   */
  async createNeuralPathway(pathway: InsertNeuralPathway): Promise<NeuralPathway> {
    console.log(`FileSystemStorage: Creating neural pathway from ${pathway.sourceId} to ${pathway.targetId}`);
    await this.ensureDirectories();
    
    // Generate a unique ID if not provided
    const pathwayId = pathway.id || uuidv4();
    
    // Create the full pathway object with metadata
    const fullPathway: NeuralPathway = {
      ...pathway,
      id: pathwayId,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    // Create the file path using the defined naming convention
    const filePath = path.join(this.neuralPathwaysDir, `pathway_${pathwayId}.json`);
    
    try {
      // Save the pathway to the file system
      await fs.writeFile(
        filePath,
        JSON.stringify(fullPathway, this.dateReplacer, 2)
      );
      console.log(`FileSystemStorage: Neural pathway ${pathwayId} created successfully`);
      return fullPathway;
    } catch (error: any) {
      console.error(`FileSystemStorage: Error creating neural pathway ${pathwayId}:`, error.message);
      throw error;
    }
  }
  
  /**
   * Get a neural pathway by ID
   * @param pathwayId ID of the pathway to get
   * @returns The pathway or undefined if not found
   */
  async getNeuralPathway(pathwayId: string): Promise<NeuralPathway | undefined> {
    console.log(`FileSystemStorage: Getting neural pathway with ID: ${pathwayId}`);
    await this.ensureDirectories();
    
    const filePath = path.join(this.neuralPathwaysDir, `pathway_${pathwayId}.json`);
    
    try {
      const data = await fs.readFile(filePath, 'utf8');
      const pathway = JSON.parse(data, this.dateReviver) as NeuralPathway;
      console.log(`FileSystemStorage: Neural pathway ${pathwayId} retrieved successfully`);
      return pathway;
    } catch (error: any) {
      if (error.code === 'ENOENT') {
        console.log(`FileSystemStorage: Neural pathway ${pathwayId} not found`);
        return undefined;
      }
      console.error(`FileSystemStorage: Error getting neural pathway ${pathwayId}:`, error.message);
      throw error;
    }
  }
  
  /**
   * Update a neural pathway
   * @param pathwayId ID of the pathway to update
   * @param pathwayData Updated pathway data
   * @returns The updated pathway or undefined if not found
   */
  async updateNeuralPathway(pathwayId: string, pathwayData: Partial<NeuralPathway>): Promise<NeuralPathway | undefined> {
    console.log(`FileSystemStorage: Updating neural pathway ${pathwayId}`);
    await this.ensureDirectories();
    
    const filePath = path.join(this.neuralPathwaysDir, `pathway_${pathwayId}.json`);
    
    try {
      // Read the existing pathway
      const data = await fs.readFile(filePath, 'utf8');
      const existingPathway = JSON.parse(data, this.dateReviver) as NeuralPathway;
      
      // Update the pathway with new data, preserving the ID and creation date
      const updatedPathway: NeuralPathway = {
        ...existingPathway,
        ...pathwayData,
        id: pathwayId,                   // Ensure ID remains the same
        createdAt: existingPathway.createdAt,  // Preserve original creation date
        updatedAt: new Date()         // Update the modification date
      };
      
      // Save the updated pathway
      await fs.writeFile(
        filePath,
        JSON.stringify(updatedPathway, this.dateReplacer, 2)
      );
      
      console.log(`FileSystemStorage: Neural pathway ${pathwayId} updated successfully`);
      return updatedPathway;
    } catch (error: any) {
      if (error.code === 'ENOENT') {
        console.log(`FileSystemStorage: Neural pathway ${pathwayId} not found for update`);
        return undefined;
      }
      console.error(`FileSystemStorage: Error updating neural pathway ${pathwayId}:`, error.message);
      throw error;
    }
  }
  
  /**
   * Delete a neural pathway
   * @param pathwayId ID of the pathway to delete
   * @returns true if deleted, false if not found
   */
  async deleteNeuralPathway(pathwayId: string): Promise<boolean> {
    console.log(`FileSystemStorage: Deleting neural pathway ${pathwayId}`);
    await this.ensureDirectories();
    
    const filePath = path.join(this.neuralPathwaysDir, `pathway_${pathwayId}.json`);
    
    try {
      // Check if the file exists
      await fs.access(filePath);
      
      // Delete the file
      await fs.unlink(filePath);
      console.log(`FileSystemStorage: Neural pathway ${pathwayId} deleted successfully`);
      return true;
    } catch (error: any) {
      if (error.code === 'ENOENT') {
        console.log(`FileSystemStorage: Neural pathway ${pathwayId} not found for deletion`);
        return false;
      }
      console.error(`FileSystemStorage: Error deleting neural pathway ${pathwayId}:`, error.message);
      throw error;
    }
  }
  
  /**
   * Get all neural pathways matching filter criteria
   * @param filter Optional filter criteria
   * @param limit Maximum number of pathways to return
   * @returns Array of neural pathways
   */
  async getAllNeuralPathways(limit?: number, filter?: { sourceId?: string, targetId?: string, pathType?: string }): Promise<NeuralPathway[]> {
    console.log(`FileSystemStorage: Getting all neural pathways${limit ? ` (limit: ${limit})` : ''}`);
    await this.ensureDirectories();
    
    try {
      const files = await fs.readdir(this.neuralPathwaysDir);
      const jsonFiles = files.filter(file => file.endsWith('.json'));
      
      // Read and parse each file
      const pathways: NeuralPathway[] = [];
      for (const file of jsonFiles) {
        try {
          const filePath = path.join(this.neuralPathwaysDir, file);
          const data = await fs.readFile(filePath, 'utf8');
          const pathway = JSON.parse(data, this.dateReviver) as NeuralPathway;
          
          // Apply filters if provided
          if (filter) {
            const matchesSourceId = !filter.sourceId || pathway.sourceId === filter.sourceId;
            const matchesTargetId = !filter.targetId || pathway.targetId === filter.targetId;
            const matchesPathType = !filter.pathType || pathway.pathType === filter.pathType;
            
            if (!matchesSourceId || !matchesTargetId || !matchesPathType) {
              continue; // Skip this pathway if it doesn't match the filter
            }
          }
          
          pathways.push(pathway);
        } catch (fileError: any) {
          console.error(`FileSystemStorage: Error reading neural pathway file ${file}:`, fileError.message);
          // Continue with other files even if one fails
        }
      }
      
      // Sort pathways by creation date (newest first)
      pathways.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
      
      // Apply limit if provided
      const limitedPathways = limit ? pathways.slice(0, limit) : pathways;
      
      console.log(`FileSystemStorage: Retrieved ${limitedPathways.length} neural pathways`);
      return limitedPathways;
    } catch (error: any) {
      if (error.code === 'ENOENT') {
        console.log(`FileSystemStorage: Neural pathways directory not found, returning empty array`);
        return []; // Directory doesn't exist yet, return empty array
      }
      console.error(`FileSystemStorage: Error getting neural pathways:`, error.message);
      throw error;
    }
  }
  
  /**
   * Record a transmission along a neural pathway
   * @param pathwayId ID of the pathway
   * @param data Optional data transmitted
   * @returns The updated pathway or undefined if not found
   */
  /**
   * Update an existing neural pathway
   * @param id ID of the pathway to update
   * @param pathway Partial pathway data to update
   * @returns The updated pathway or undefined if not found
   */
  async updateNeuralPathway(id: string, pathway: Partial<NeuralPathway>): Promise<NeuralPathway | undefined> {
    console.log(`FileSystemStorage: Updating neural pathway ${id}`);
    await this.ensureDirectories();
    
    const filePath = path.join(this.neuralPathwaysDir, `pathway_${id}.json`);
    
    try {
      // Read the existing pathway
      const fileData = await fs.readFile(filePath, 'utf8');
      const existingPathway = JSON.parse(fileData, this.dateReviver) as NeuralPathway;
      
      // Create updated pathway
      const updatedPathway: NeuralPathway = {
        ...existingPathway,
        ...pathway,
        id: existingPathway.id, // Ensure ID doesn't change
        updatedAt: new Date() // Always update the timestamp
      };
      
      // Save the updated pathway
      await fs.writeFile(
        filePath,
        JSON.stringify(updatedPathway, this.dateReplacer, 2)
      );
      
      console.log(`FileSystemStorage: Neural pathway ${id} updated successfully`);
      return updatedPathway;
    } catch (error: any) {
      if (error.code === 'ENOENT') {
        console.log(`FileSystemStorage: Neural pathway ${id} not found for update`);
        return undefined;
      }
      console.error(`FileSystemStorage: Error updating neural pathway ${id}:`, error.message);
      throw error;
    }
  }
  
  /**
   * Delete a neural pathway
   * @param id ID of the pathway to delete
   * @returns true if deleted, false if not found
   */
  async deleteNeuralPathway(id: string): Promise<boolean> {
    console.log(`FileSystemStorage: Deleting neural pathway ${id}`);
    await this.ensureDirectories();
    
    const filePath = path.join(this.neuralPathwaysDir, `pathway_${id}.json`);
    
    try {
      // Check if file exists before attempting to delete
      await fs.access(filePath);
      
      // Delete the file
      await fs.unlink(filePath);
      
      console.log(`FileSystemStorage: Neural pathway ${id} deleted successfully`);
      return true;
    } catch (error: any) {
      if (error.code === 'ENOENT') {
        console.log(`FileSystemStorage: Neural pathway ${id} not found for deletion`);
        return false; // Not found, return false
      }
      console.error(`FileSystemStorage: Error deleting neural pathway ${id}:`, error.message);
      throw error;
    }
  }

  async recordTransmission(pathwayId: string, data?: any): Promise<NeuralPathway | undefined> {
    console.log(`FileSystemStorage: Recording transmission for neural pathway ${pathwayId}`);
    await this.ensureDirectories();
    
    const filePath = path.join(this.neuralPathwaysDir, `pathway_${pathwayId}.json`);
    
    try {
      // Read the existing pathway
      const fileData = await fs.readFile(filePath, 'utf8');
      const existingPathway = JSON.parse(fileData, this.dateReviver) as NeuralPathway;
      
      // Create updated pathway with transmission data
      const transmissionTimestamp = new Date();
      
      // Get the current metadata or initialize an empty object
      const currentMetadata = existingPathway.metadata || {};
      
      // Initialize transmissions array if it doesn't exist
      if (!currentMetadata.transmissions) {
        currentMetadata.transmissions = [];
      }
      
      // Add the new transmission
      currentMetadata.transmissions.push({
        timestamp: transmissionTimestamp,
        data: data || {}
      });
      
      // Keep only the most recent 100 transmissions to avoid unbounded growth
      if (currentMetadata.transmissions.length > 100) {
        currentMetadata.transmissions = currentMetadata.transmissions.slice(-100);
      }
      
      // Update transmission statistics
      currentMetadata.transmissionCount = (currentMetadata.transmissionCount || 0) + 1;
      currentMetadata.lastTransmissionTime = transmissionTimestamp;
      
      // Update the pathway
      const updatedPathway: NeuralPathway = {
        ...existingPathway,
        metadata: currentMetadata,
        updatedAt: transmissionTimestamp
      };
      
      // Save the updated pathway
      await fs.writeFile(
        filePath,
        JSON.stringify(updatedPathway, this.dateReplacer, 2)
      );
      
      console.log(`FileSystemStorage: Transmission recorded for neural pathway ${pathwayId}`);
      return updatedPathway;
    } catch (error: any) {
      if (error.code === 'ENOENT') {
        console.log(`FileSystemStorage: Neural pathway ${pathwayId} not found for recording transmission`);
        return undefined;
      }
      console.error(`FileSystemStorage: Error recording transmission for neural pathway ${pathwayId}:`, error.message);
      throw error;
    }
  }
}