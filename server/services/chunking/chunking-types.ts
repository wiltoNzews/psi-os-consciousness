/**
 * Type definitions for the advanced chunking system
 * Handles multi-level document analysis with semantic understanding
 */

/**
 * Chunking strategies
 */
export enum ChunkingStrategy {
  /**
   * Split by semantic boundaries (paragraphs, topics)
   */
  SEMANTIC = 'semantic',
  
  /**
   * Split by fixed size chunks
   */
  FIXED_SIZE = 'fixed_size',
  
  /**
   * Split based on natural language markers (headings, section markers)
   */
  NATURAL_LANGUAGE = 'natural_language',
  
  /**
   * Split dynamically based on content complexity using 3:1 ratio principle
   */
  RATIO_ADAPTIVE = 'ratio_adaptive',
}

/**
 * Options for configuring the chunking process
 */
export interface ChunkOptions {
  /**
   * Minimum size for a chunk (in characters)
   */
  minChunkSize?: number;
  
  /**
   * Maximum size for a chunk (in characters)
   */
  maxChunkSize?: number;
  
  /**
   * Percentage of overlap between consecutive chunks
   */
  overlapPercentage?: number;
  
  /**
   * Threshold for semantic similarity to consider chunks related
   */
  semanticThreshold?: number;
  
  /**
   * Chunking strategy to use
   */
  strategy?: ChunkingStrategy;
  
  /**
   * Directory to output chunked files
   */
  outputDir?: string;
  
  /**
   * Number of hierarchical levels to create
   */
  hierarchyLevels?: number;
  
  /**
   * Whether to extract metadata from chunks
   */
  metadataExtraction?: boolean;
  
  /**
   * Whether to preserve original formatting
   */
  preserveFormatting?: boolean;
}

/**
 * Metadata for a chunk
 */
export interface ChunkMetadata {
  /**
   * Timestamp for when the chunk was created
   */
  timestamp: Date;
  
  /**
   * Number of items in the chunk
   */
  itemCount: number;
  
  /**
   * Key concepts extracted from the chunk
   */
  concepts: string[];
  
  /**
   * Named entities extracted from the chunk
   */
  namedEntities: string[];
  
  /**
   * Keywords extracted from the chunk
   */
  keywords: string[];
  
  /**
   * Sentiment score for the chunk (-1 to 1)
   */
  sentimentScore: number;
}

/**
 * Node in the semantic hierarchy
 */
export interface SemanticNode {
  /**
   * Unique identifier for the chunk
   */
  id: string;
  
  /**
   * Title or heading for the chunk
   */
  title: string;
  
  /**
   * Brief summary of the chunk's content
   */
  summary: string;
  
  /**
   * Full content of the chunk
   */
  content: string;
  
  /**
   * Extracted metadata for the chunk
   */
  metadata: ChunkMetadata;
  
  /**
   * Hierarchical level (0 = top level)
   */
  level: number;
  
  /**
   * Child nodes in the semantic hierarchy
   */
  children: SemanticNode[];
}

/**
 * Relationship between chunks
 */
export interface ChunkRelation {
  /**
   * ID of the source chunk
   */
  sourceId: string;
  
  /**
   * ID of the target chunk
   */
  targetId: string;
  
  /**
   * Strength of the relationship (0-1)
   */
  relationStrength: number;
  
  /**
   * Type or nature of the relationship
   */
  relationType: string;
}

/**
 * Result of a chunking operation
 */
export interface ChunkResult {
  /**
   * Total number of chunks created
   */
  chunkCount: number;
  
  /**
   * Total size of the source content (in characters)
   */
  totalSourceSize: number;
  
  /**
   * Total size of all processed chunks (in characters)
   */
  totalProcessedSize: number;
  
  /**
   * Array of all semantic nodes/chunks
   */
  chunks: SemanticNode[];
  
  /**
   * Array of all relationships between chunks
   */
  relations: ChunkRelation[];
  
  /**
   * Path to the created index file
   */
  indexPath: string;
}