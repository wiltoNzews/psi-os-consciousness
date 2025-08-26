import { createReadStream } from 'fs';
import { parse as csvParse } from 'csv-parse';
import * as fs from 'fs/promises';
import { storage } from '../storage.js';
import { InsertDataset, InsertDataColumn, PipelineJob } from '@shared/schema';

interface ImportOptions {
  /**
   * User ID who initiated the import
   */
  userId: number;
  
  /**
   * Original filename
   */
  filename: string;
  
  /**
   * Path where the file is stored
   */
  filePath: string;
  
  /**
   * Format of the file (csv, json, etc.)
   */
  format: string;
  
  /**
   * Whether the file has a header row (CSV only)
   */
  hasHeader?: boolean;
  
  /**
   * Delimiter for CSV files
   */
  delimiter?: string;
  
  /**
   * Dataset name
   */
  datasetName?: string;
  
  /**
   * Dataset description
   */
  datasetDescription?: string;
  
  /**
   * Column mappings for custom column names
   * Map of original column name to new column name
   */
  columnMappings?: Record<string, string>;
  
  /**
   * Column data types
   * Map of column name to data type
   */
  columnTypes?: Record<string, string>;
  
  /**
   * Whether to make the dataset public
   */
  isPublic?: boolean;
  
  /**
   * Tags for the dataset
   */
  tags?: string[];
}

interface ImportResult {
  datasetId: number;
  jobId: number;
  columnCount: number;
  rowCount: number;
  previewData: any[];
  columnNames: string[];
  columnTypes: Record<string, string>;
  executionTime: number;
}

/**
 * Import data from a file
 */
export async function importDataFromFile(
  options: ImportOptions
): Promise<ImportResult> {
  const startTime = Date.now();
  
  try {
    // Create a job to track the import process
    const job = await storage.createPipelineJob({
      name: `Import: ${options.datasetName || options.filename}`,
      description: `Importing ${options.format.toUpperCase()} data from ${options.filename}`,
      type: 'dataset_import',
      status: 'running',
      progress: 0,
      createdBy: options.userId,
    });
    
    // Log the start of the import
    await storage.createSystemLog({
      type: 'info',
      message: `Dataset Import Started: ${options.filename}`,
      details: `Starting import of ${options.format.toUpperCase()} file ${options.filename}`,
      component: 'Data Importer',
      severity: 1,
      userId: options.userId,
    });
    
    // Update job progress
    await storage.updatePipelineJobProgress(job.id, 10);
    
    // Get file stats
    const stats = await fs.stat(options.filePath);
    const fileSize = stats.size;
    
    // Import based on file format
    let result: {
      data: any[];
      columnNames: string[];
      columnTypes: Record<string, string>;
      rowCount: number;
    };
    
    if (options.format.toLowerCase() === 'csv') {
      result = await importCsv(options.filePath, options);
    } else if (options.format.toLowerCase() === 'json') {
      result = await importJson(options.filePath, options);
    } else {
      throw new Error(`Unsupported file format: ${options.format}`);
    }
    
    // Update job progress
    await storage.updatePipelineJobProgress(job.id, 50);
    
    // Create dataset
    const datasetInsert: InsertDataset = {
      name: options.datasetName || options.filename.replace(/\\.[^/.]+$/, ''),
      description: options.datasetDescription || `Imported from ${options.filename}`,
      source: 'file-import',
      format: options.format.toLowerCase(),
      status: 'active',
      size: fileSize,
      rowCount: result.rowCount,
      columnCount: result.columnNames.length,
      createdBy: options.userId,
      filePath: options.filePath,
      isPublic: options.isPublic || false,
      tags: options.tags || [],
      metadata: {
        originalFilename: options.filename,
        importDate: new Date().toISOString(),
        hasHeader: options.hasHeader,
        delimiter: options.delimiter,
      },
    };
    
    const dataset = await storage.createDataset(datasetInsert);
    
    // Update job progress
    await storage.updatePipelineJobProgress(job.id, 70);
    
    // Create columns
    let position = 0;
    for (const colName of result.columnNames) {
      const colType = result.columnTypes[colName] || 'string';
      const mappedName = options.columnMappings?.[colName] || colName;
      
      const columnInsert: InsertDataColumn = {
        datasetId: dataset.id,
        name: mappedName,
        dataType: options.columnTypes?.[colName] || colType,
        description: '',
        ordinalPosition: position++,
        isNullable: true,
        isPrimaryKey: false,
        isForeignKey: false,
        statistics: calculateColumnStatistics(result.data, colName, colType),
      };
      
      await storage.createDataColumn(columnInsert);
    }
    
    // Update job progress
    await storage.updatePipelineJobProgress(job.id, 100);
    
    // Log the completion of the import
    await storage.createSystemLog({
      type: 'success',
      message: `Dataset Import Completed: ${options.filename}`,
      details: `Successfully imported ${result.rowCount} rows and ${result.columnNames.length} columns from ${options.filename}`,
      component: 'Data Importer',
      severity: 1,
      userId: options.userId,
    });
    
    const executionTime = Date.now() - startTime;
    
    return {
      datasetId: dataset.id,
      jobId: job.id,
      columnCount: result.columnNames.length,
      rowCount: result.rowCount,
      previewData: result.data.slice(0, 10), // First 10 rows for preview
      columnNames: result.columnNames,
      columnTypes: result.columnTypes,
      executionTime,
    };
    
  } catch (error) {
    // Log the error
    await storage.createSystemLog({
      type: 'error',
      message: `Dataset Import Failed: ${options.filename}`,
      details: error instanceof Error ? error.message : String(error),
      component: 'Data Importer',
      severity: 3,
      userId: options.userId,
    });
    
    throw error;
  }
}

/**
 * Import data from a CSV file
 */
async function importCsv(
  filePath: string,
  options: ImportOptions
): Promise<{
  data: any[];
  columnNames: string[];
  columnTypes: Record<string, string>;
  rowCount: number;
}> {
  return new Promise((resolve, reject) => {
    const data: any[] = [];
    let columnNames: string[] = [];
    let rowCount = 0;
    
    const parser = csvParse({
      delimiter: options.delimiter || ',',
      columns: options.hasHeader !== false, // Default to true
      skip_empty_lines: true,
      trim: true,
    });
    
    createReadStream(filePath)
      .pipe(parser)
      .on('readable', function() {
        let record;
        while ((record = parser.read()) !== null) {
          data.push(record);
          rowCount++;
        }
      })
      .on('error', (err) => {
        reject(err);
      })
      .on('end', () => {
        if (data.length === 0) {
          return reject(new Error('CSV file is empty or could not be parsed'));
        }
        
        // Get column names
        columnNames = Object.keys(data[0]);
        
        // Detect column types
        const columnTypes = inferColumnTypes(data);
        
        resolve({
          data,
          columnNames,
          columnTypes,
          rowCount,
        });
      });
  });
}

/**
 * Import data from a JSON file
 */
async function importJson(
  filePath: string,
  options: ImportOptions
): Promise<{
  data: any[];
  columnNames: string[];
  columnTypes: Record<string, string>;
  rowCount: number;
}> {
  try {
    const content = await fs.readFile(filePath, 'utf-8');
    const parsed = JSON.parse(content);
    
    // Handle both array of objects and object with array property
    let data: any[];
    if (Array.isArray(parsed)) {
      data = parsed;
    } else {
      // Find the first array property in the object
      const arrayProp = Object.keys(parsed).find(key => Array.isArray(parsed[key]));
      if (!arrayProp) {
        throw new Error('JSON file does not contain an array of data');
      }
      data = parsed[arrayProp];
    }
    
    if (data.length === 0) {
      throw new Error('JSON data is empty');
    }
    
    // Get column names
    const columnNames = Object.keys(data[0]);
    
    // Detect column types
    const columnTypes = inferColumnTypes(data);
    
    return {
      data,
      columnNames,
      columnTypes,
      rowCount: data.length,
    };
    
  } catch (error) {
    throw new Error(`Failed to parse JSON file: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Infer column types from data
 */
function inferColumnTypes(data: any[]): Record<string, string> {
  if (data.length === 0) return {};
  
  const columnNames = Object.keys(data[0]);
  const columnTypes: Record<string, string> = {};
  const sampleSize = Math.min(data.length, 100); // Use up to 100 rows for type inference
  
  for (const column of columnNames) {
    // Check first non-null value
    let type = 'string';
    
    for (let i = 0; i < sampleSize; i++) {
      const value = data[i][column];
      if (value === null || value === undefined || value === '') continue;
      
      if (typeof value === 'number') {
        type = Number.isInteger(value) ? 'integer' : 'number';
      } else if (typeof value === 'boolean') {
        type = 'boolean';
      } else if (typeof value === 'string') {
        // Try to parse as date
        if (/^\d{4}-\d{2}-\d{2}/.test(value) || /^\d{2}\/\d{2}\/\d{4}/.test(value)) {
          const date = new Date(value);
          if (!isNaN(date.getTime())) {
            type = 'date';
            break;
          }
        }
        
        // Try to parse as number
        if (/^-?\d+(\.\d+)?$/.test(value)) {
          type = value.includes('.') ? 'number' : 'integer';
          break;
        }
        
        type = 'string';
      } else if (Array.isArray(value)) {
        type = 'array';
      } else if (typeof value === 'object') {
        type = 'object';
      }
      
      break;
    }
    
    columnTypes[column] = type;
  }
  
  return columnTypes;
}

/**
 * Calculate statistics for a column
 */
function calculateColumnStatistics(
  data: any[],
  columnName: string,
  columnType: string
): Record<string, any> {
  const stats: Record<string, any> = {};
  
  // Count null values
  const values = data.map(row => row[columnName]);
  const nullCount = values.filter(val => val === null || val === undefined || val === '').length;
  stats.nullCount = nullCount;
  stats.nullPercentage = parseFloat(((nullCount / data.length) * 100).toFixed(2));
  
  // Only calculate numeric statistics for number/integer columns
  if (columnType === 'number' || columnType === 'integer') {
    const numericValues = values
      .filter(val => val !== null && val !== undefined && val !== '')
      .map(val => typeof val === 'string' ? parseFloat(val) : val);
    
    if (numericValues.length > 0) {
      stats.min = Math.min(...numericValues);
      stats.max = Math.max(...numericValues);
      stats.sum = numericValues.reduce((sum, val) => sum + val, 0);
      stats.avg = stats.sum / numericValues.length;
      stats.median = calculateMedian(numericValues);
    }
  }
  
  // Calculate distinct values for categorical data
  if (columnType === 'string' || columnType === 'boolean') {
    const distinctValues = new Set(values.filter(val => val !== null && val !== undefined && val !== ''));
    stats.distinctCount = distinctValues.size;
    
    // Get frequency distribution for top values
    const valueFrequency: Record<string, number> = {};
    for (const val of values) {
      if (val === null || val === undefined || val === '') continue;
      const strVal = String(val);
      valueFrequency[strVal] = (valueFrequency[strVal] || 0) + 1;
    }
    
    // Get top 10 most frequent values
    stats.topValues = Object.entries(valueFrequency)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([value, count]) => ({ value, count, percentage: parseFloat(((count / data.length) * 100).toFixed(2)) }));
  }
  
  // Calculate date statistics
  if (columnType === 'date') {
    const dateValues = values
      .filter(val => val !== null && val !== undefined && val !== '')
      .map(val => new Date(val));
    
    if (dateValues.length > 0) {
      stats.minDate = new Date(Math.min(...dateValues.map(d => d.getTime()))).toISOString();
      stats.maxDate = new Date(Math.max(...dateValues.map(d => d.getTime()))).toISOString();
      stats.dateRange = Math.ceil((new Date(stats.maxDate).getTime() - new Date(stats.minDate).getTime()) / (1000 * 60 * 60 * 24)); // in days
    }
  }
  
  return stats;
}

/**
 * Calculate median of an array of numbers
 */
function calculateMedian(values: number[]): number {
  if (values.length === 0) return 0;
  
  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  
  if (sorted.length % 2 === 0) {
    return (sorted[middle - 1] + sorted[middle]) / 2;
  } else {
    return sorted[middle];
  }
}