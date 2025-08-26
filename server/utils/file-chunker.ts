
/**
 * File Chunking Utility
 * 
 * This module provides functionality to chunk large files into smaller, semantically
 * meaningful pieces following the principles defined in the Quantum Chunking architecture.
 * It implements the BUS ROUTES model with macro (express) and micro (local) stops.
 * 
 * [QUANTUM_STATE: UTIL_FLOW]
 */

import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { systemLogger } from './symbolic-logger';
import { formatWithSymbolicPrefix } from './symbolic-utils';
import { getQuantumChunkTracker } from './quantum-chunk-tracker';

// Domain emojis for file chunking
const ChunkEmoji = {
  FILE: '📄',
  CHUNK: '🧩',
  STORAGE: '💾',
  MACRO: '🚄', // Express stop
  MICRO: '🚌', // Local stop
  ERROR: '🚫'
};

/**
 * Interface for chunk metadata
 */
export interface ChunkMetadata {
  chunkId: string;
  originalFile: string;
  chunkIndex: number;
  totalChunks: number;
  chunkType: 'macro' | 'micro';
  semanticTitle?: string;
  startByte: number;
  endByte: number;
  parentChunkId?: string;
  childChunkIds?: string[];
}

/**
 * Interface for a chunk entity
 */
export interface FileChunk {
  id: string;
  content: string;
  metadata: ChunkMetadata;
}

/**
 * Options for chunking files
 */
export interface ChunkingOptions {
  respectParagraphs?: boolean;
  respectSections?: boolean;
  maxChunkSize?: number;
  overlap?: number;
  outputDir?: string;
  createHierarchy?: boolean;
  createMacroChunks?: boolean;
  macroSummarySize?: number;
  trackChunks?: boolean;
}

/**
 * Default chunking options
 */
const DEFAULT_OPTIONS: ChunkingOptions = {
  respectParagraphs: true,
  respectSections: true,
  maxChunkSize: 4000, // Characters
  overlap: 200,
  outputDir: 'chunked-output',
  createHierarchy: true,
  createMacroChunks: true,
  macroSummarySize: 500,
  trackChunks: true
};

/**
 * Identifies section headers in the content
 * @param content Text content to analyze
 * @returns Array of section objects with title, level, start and end positions
 */
function identifySections(content: string): Array<{
  level: number;
  title: string;
  start: number;
  end: number;
}> {
  // Match markdown-style headers (# Header, ## Subheader, etc.)
  const headerRegex = /^(#{1,6})\s+(.+?)(?:\n|$)/gm;
  const sections = [];
  let lastIndex = 0;
  let match;
  
  // Find all headers
  while ((match = headerRegex.exec(content)) !== null) {
    const level = match[1].length;
    const title = match[2].trim();
    const start = match.index;
    
    // If this isn't the first header, close the previous section
    if (sections.length > 0) {
      sections[sections.length - 1].end = start;
    }
    
    sections.push({
      level,
      title,
      start,
      end: content.length // Will be updated when next header is found
    });
    
    lastIndex = headerRegex.lastIndex;
  }
  
  // If no sections were found, create a default section
  if (sections.length === 0) {
    sections.push({
      level: 1,
      title: 'Content',
      start: 0,
      end: content.length
    });
  }
  
  return sections;
}

/**
 * Splits content into paragraphs
 * @param content Text content to split
 * @returns Array of paragraph objects with start and end positions
 */
function splitIntoParagraphs(content: string): Array<{
  text: string;
  start: number;
  end: number;
}> {
  const paragraphRegex = /\n\s*\n/g;
  const paragraphs = [];
  let lastIndex = 0;
  let match;
  
  // Find paragraph breaks
  while ((match = paragraphRegex.exec(content)) !== null) {
    paragraphs.push({
      text: content.substring(lastIndex, match.index).trim(),
      start: lastIndex,
      end: match.index
    });
    
    lastIndex = match.index + match[0].length;
  }
  
  // Add the final paragraph
  if (lastIndex < content.length) {
    paragraphs.push({
      text: content.substring(lastIndex).trim(),
      start: lastIndex,
      end: content.length
    });
  }
  
  return paragraphs;
}

/**
 * Create chunks based on semantic boundaries (sections and paragraphs)
 * @param content File content
 * @param options Chunking options
 * @param filePath Original file path
 * @returns Array of chunks
 */
function createSemanticChunks(
  content: string,
  options: ChunkingOptions,
  filePath: string
): FileChunk[] {
  const chunks: FileChunk[] = [];
  const fileName = path.basename(filePath);
  
  // First determine if we should use section-based chunking
  if (options.respectSections) {
    const sections = identifySections(content);
    
    // Create one chunk per section for shorter sections
    // Or break up longer sections into multiple chunks
    sections.forEach((section, sectionIndex) => {
      const sectionContent = content.substring(section.start, section.end);
      const sectionTitle = section.title;
      
      // If section is small enough, keep it as one chunk
      if (sectionContent.length <= options.maxChunkSize) {
        const chunkId = uuidv4();
        chunks.push({
          id: chunkId,
          content: sectionContent,
          metadata: {
            chunkId,
            originalFile: fileName,
            chunkIndex: chunks.length,
            totalChunks: -1, // Will update later
            chunkType: 'macro',
            semanticTitle: sectionTitle,
            startByte: section.start,
            endByte: section.end
          }
        });
      } else {
        // Section is too large, break it down by paragraphs
        const paragraphs = splitIntoParagraphs(sectionContent);
        const macroChunkId = options.createMacroChunks ? uuidv4() : undefined;
        let currentChunk = '';
        let currentChunkStart = section.start;
        const childChunkIds: string[] = [];
        
        // Process paragraphs
        for (let i = 0; i < paragraphs.length; i++) {
          const paragraph = paragraphs[i];
          const paragraphContent = paragraph.text;
          
          // If adding this paragraph would exceed max size and we already have content
          if (currentChunk.length > 0 && 
              currentChunk.length + paragraphContent.length > options.maxChunkSize) {
            // Create a chunk with current content
            const microChunkId = uuidv4();
            childChunkIds.push(microChunkId);
            
            chunks.push({
              id: microChunkId,
              content: currentChunk,
              metadata: {
                chunkId: microChunkId,
                originalFile: fileName,
                chunkIndex: chunks.length,
                totalChunks: -1, // Will update later
                chunkType: 'micro',
                semanticTitle: `${sectionTitle} (part ${childChunkIds.length})`,
                startByte: currentChunkStart,
                endByte: section.start + paragraph.start,
                parentChunkId: macroChunkId
              }
            });
            
            // Reset for next chunk
            currentChunk = paragraphContent;
            currentChunkStart = section.start + paragraph.start;
          } else {
            // Add to current chunk
            if (currentChunk.length > 0) {
              currentChunk += '\n\n';
            }
            currentChunk += paragraphContent;
          }
        }
        
        // Add the final chunk if there's content
        if (currentChunk.length > 0) {
          const microChunkId = uuidv4();
          childChunkIds.push(microChunkId);
          
          chunks.push({
            id: microChunkId,
            content: currentChunk,
            metadata: {
              chunkId: microChunkId,
              originalFile: fileName,
              chunkIndex: chunks.length,
              totalChunks: -1,
              chunkType: 'micro',
              semanticTitle: `${sectionTitle} (part ${childChunkIds.length})`,
              startByte: currentChunkStart,
              endByte: section.end,
              parentChunkId: macroChunkId
            }
          });
        }
        
        // If we're creating macro chunks, add a summary chunk for the section
        if (options.createMacroChunks && macroChunkId) {
          // Create a summary of the section for the macro chunk
          let macroContent = sectionContent;
          if (sectionContent.length > options.macroSummarySize) {
            macroContent = sectionContent.substring(0, options.macroSummarySize) + 
              `\n\n... [Content continues across ${childChunkIds.length} micro chunks] ...`;
          }
          
          chunks.push({
            id: macroChunkId,
            content: macroContent,
            metadata: {
              chunkId: macroChunkId,
              originalFile: fileName,
              chunkIndex: chunks.length,
              totalChunks: -1,
              chunkType: 'macro',
              semanticTitle: sectionTitle,
              startByte: section.start,
              endByte: section.end,
              childChunkIds
            }
          });
        }
      }
    });
  } else if (options.respectParagraphs) {
    // Simpler paragraph-based chunking without sections
    const paragraphs = splitIntoParagraphs(content);
    let currentChunk = '';
    let currentChunkStart = 0;
    
    // Process paragraphs
    for (let i = 0; i < paragraphs.length; i++) {
      const paragraph = paragraphs[i];
      const paragraphContent = paragraph.text;
      
      // If adding this paragraph would exceed max size and we already have content
      if (currentChunk.length > 0 && 
          currentChunk.length + paragraphContent.length > options.maxChunkSize) {
        // Create a chunk with current content
        const chunkId = uuidv4();
        chunks.push({
          id: chunkId,
          content: currentChunk,
          metadata: {
            chunkId,
            originalFile: fileName,
            chunkIndex: chunks.length,
            totalChunks: -1, // Will update later
            chunkType: 'micro',
            startByte: currentChunkStart,
            endByte: paragraph.start
          }
        });
        
        // Reset for next chunk
        currentChunk = paragraphContent;
        currentChunkStart = paragraph.start;
      } else {
        // Add to current chunk
        if (currentChunk.length > 0) {
          currentChunk += '\n\n';
        }
        currentChunk += paragraphContent;
      }
    }
    
    // Add the final chunk if there's content
    if (currentChunk.length > 0) {
      const chunkId = uuidv4();
      chunks.push({
        id: chunkId,
        content: currentChunk,
        metadata: {
          chunkId,
          originalFile: fileName,
          chunkIndex: chunks.length,
          totalChunks: -1,
          chunkType: 'micro',
          startByte: currentChunkStart,
          endByte: content.length
        }
      });
    }
  } else {
    // Simple fixed-size chunking if not respecting paragraphs or sections
    for (let i = 0; i < content.length; i += options.maxChunkSize) {
      const endPos = Math.min(i + options.maxChunkSize, content.length);
      const chunkContent = content.substring(i, endPos);
      const chunkId = uuidv4();
      
      chunks.push({
        id: chunkId,
        content: chunkContent,
        metadata: {
          chunkId,
          originalFile: fileName,
          chunkIndex: chunks.length,
          totalChunks: -1, // Will update later
          chunkType: 'micro',
          startByte: i,
          endByte: endPos
        }
      });
    }
  }
  
  // Update totalChunks field now that we know the total
  chunks.forEach(chunk => {
    chunk.metadata.totalChunks = chunks.length;
  });
  
  return chunks;
}

/**
 * Chunk a large file into smaller pieces
 * @param filePath Path to the file to chunk
 * @param options Chunking options
 * @returns Array of chunks
 */
export function chunkFile(filePath: string, options: ChunkingOptions = DEFAULT_OPTIONS): FileChunk[] {
  const mergedOptions = { ...DEFAULT_OPTIONS, ...options };
  
  try {
    // Read the file
    const content = fs.readFileSync(filePath, 'utf8');
    systemLogger.info(
      `Chunking file: ${filePath} (${content.length} bytes)`,
      ChunkEmoji.FILE
    );
    
    // Create chunks
    const chunks = createSemanticChunks(content, mergedOptions, filePath);
    systemLogger.info(
      `Created ${chunks.length} chunks from ${filePath}`,
      ChunkEmoji.CHUNK
    );
    
    // Track chunks if enabled
    if (mergedOptions.trackChunks) {
      const tracker = getQuantumChunkTracker();
      chunks.forEach(chunk => {
        tracker.trackChunkCreation(chunk.id, {
          type: 'file_chunk',
          fileChunk: chunk,
          originalFile: filePath
        });
      });
    }
    
    return chunks;
  } catch (error) {
    systemLogger.error(
      `Error chunking file ${filePath}: ${error.message}`,
      ChunkEmoji.ERROR
    );
    throw error;
  }
}

/**
 * Save chunks to files
 * @param chunks Array of chunks to save
 * @param outputDir Directory to save chunks to
 * @param createHierarchy Whether to create a hierarchy of directories based on chunk types
 * @returns Array of paths to saved chunk files
 */
export function saveChunks(
  chunks: FileChunk[],
  outputDir: string = DEFAULT_OPTIONS.outputDir,
  createHierarchy: boolean = DEFAULT_OPTIONS.createHierarchy
): string[] {
  const savedFiles: string[] = [];
  
  try {
    // Create output directory if it doesn't exist
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    // Create macro and micro directories if using hierarchy
    if (createHierarchy) {
      const macroDir = path.join(outputDir, 'macro');
      const microDir = path.join(outputDir, 'micro');
      
      if (!fs.existsSync(macroDir)) {
        fs.mkdirSync(macroDir, { recursive: true });
      }
      
      if (!fs.existsSync(microDir)) {
        fs.mkdirSync(microDir, { recursive: true });
      }
    }
    
    // Save each chunk
    chunks.forEach(chunk => {
      let chunkFileName = `chunk-${chunk.metadata.chunkIndex+1}-of-${chunk.metadata.totalChunks}.txt`;
      
      // If semantic title is available, use it for filename
      if (chunk.metadata.semanticTitle) {
        // Create a safe filename from the title
        const safeTitle = chunk.metadata.semanticTitle
          .replace(/[^a-z0-9\s-]/gi, '')
          .replace(/\s+/g, '-')
          .toLowerCase();
        
        chunkFileName = `${safeTitle}-${chunk.metadata.chunkIndex+1}.txt`;
      }
      
      // Determine the directory based on hierarchy option
      let saveDir = outputDir;
      if (createHierarchy) {
        saveDir = path.join(outputDir, chunk.metadata.chunkType === 'macro' ? 'macro' : 'micro');
      }
      
      const chunkFilePath = path.join(saveDir, chunkFileName);
      
      // Save the chunk content
      fs.writeFileSync(chunkFilePath, chunk.content);
      
      // Also save metadata alongside content
      const metadataFilePath = chunkFilePath.replace('.txt', '.meta.json');
      fs.writeFileSync(metadataFilePath, JSON.stringify(chunk.metadata, null, 2));
      
      savedFiles.push(chunkFilePath);
      
      systemLogger.info(
        `Saved chunk ${chunk.id} to ${chunkFilePath}`,
        ChunkEmoji.STORAGE
      );
    });
    
    // Create an index file with information about all chunks
    const indexData = {
      originalFile: chunks[0]?.metadata.originalFile || 'unknown',
      chunkCount: chunks.length,
      chunks: chunks.map(chunk => ({
        id: chunk.id,
        type: chunk.metadata.chunkType,
        title: chunk.metadata.semanticTitle,
        path: savedFiles.find(file => file.includes(chunk.id))
      }))
    };
    
    const indexFilePath = path.join(outputDir, 'chunks-index.json');
    fs.writeFileSync(indexFilePath, JSON.stringify(indexData, null, 2));
    savedFiles.push(indexFilePath);
    
    return savedFiles;
  } catch (error) {
    systemLogger.error(
      `Error saving chunks: ${error.message}`,
      ChunkEmoji.ERROR
    );
    throw error;
  }
}

/**
 * Process a file by chunking it and saving the chunks
 * @param filePath Path to the file to process
 * @param options Processing options
 * @returns Object with chunks and saved file paths
 */
export function processFile(
  filePath: string,
  options: ChunkingOptions = DEFAULT_OPTIONS
): { chunks: FileChunk[]; savedFiles: string[] } {
  const mergedOptions = { ...DEFAULT_OPTIONS, ...options };
  
  // Chunk the file
  const chunks = chunkFile(filePath, mergedOptions);
  
  // Save the chunks
  const savedFiles = saveChunks(
    chunks,
    mergedOptions.outputDir,
    mergedOptions.createHierarchy
  );
  
  systemLogger.info(
    `Completed processing file ${filePath} into ${chunks.length} chunks`,
    ChunkEmoji.FILE
  );
  
  return { chunks, savedFiles };
}
