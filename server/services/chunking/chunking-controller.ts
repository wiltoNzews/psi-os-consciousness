/**
 * Controller for chunking operations
 * Handles API routes and file processing requests
 */

import { Request, Response } from 'express';
import * as path from 'path';
import * as fs from 'fs/promises';
import { AdvancedChunker } from './advanced-chunker';
import { ChunkOptions, ChunkingStrategy } from './chunking-types';

// Base directory for output chunks
const CHUNKS_DIR = path.join(process.cwd(), 'chunked-output');

/**
 * Initialize the chunking system
 */
export async function initChunkingSystem() {
  // Ensure the chunks directory exists
  try {
    await fs.mkdir(CHUNKS_DIR, { recursive: true });
    console.log('Chunking system initialized');
  } catch (error) {
    console.error('Failed to initialize chunking system:', error);
  }
}

/**
 * Process a file using the advanced chunking system
 * @param req Express request
 * @param res Express response
 */
export async function processFile(req: Request, res: Response) {
  try {
    const { filePath, options } = req.body;
    
    if (!filePath) {
      return res.status(400).json({ error: 'File path is required' });
    }
    
    // Ensure the file exists
    try {
      await fs.access(filePath);
    } catch (error) {
      return res.status(404).json({ error: `File not found: ${filePath}` });
    }
    
    // Configure chunker
    const chunkerOptions: ChunkOptions = {
      minChunkSize: options?.minChunkSize || 1000,
      maxChunkSize: options?.maxChunkSize || 10000,
      overlapPercentage: options?.overlapPercentage || 15,
      semanticThreshold: options?.semanticThreshold || 0.75,
      strategy: options?.strategy || ChunkingStrategy.SEMANTIC,
      outputDir: options?.outputDir || CHUNKS_DIR,
      hierarchyLevels: options?.hierarchyLevels || 3,
      metadataExtraction: options?.metadataExtraction !== false, // Default to true
      preserveFormatting: options?.preserveFormatting !== false, // Default to true
    };
    
    // Create chunker instance
    const chunker = new AdvancedChunker(chunkerOptions);
    
    // Process the file
    console.log(`Processing file: ${filePath}`);
    const result = await chunker.processFile(filePath);
    
    res.status(200).json({
      success: true,
      result: {
        chunkCount: result.chunkCount,
        totalSourceSize: result.totalSourceSize,
        totalProcessedSize: result.totalProcessedSize,
        indexPath: result.indexPath,
        // Don't send all chunks in response to avoid huge payload
        chunkSample: result.chunks.slice(0, 3).map(chunk => ({
          id: chunk.id,
          title: chunk.title,
          summary: chunk.summary
        }))
      }
    });
  } catch (error) {
    console.error('Error processing file:', error);
    res.status(500).json({ 
      error: 'Failed to process file', 
      details: error instanceof Error ? error.message : String(error)
    });
  }
}

/**
 * Get a list of all processed files
 * @param req Express request
 * @param res Express response
 */
export async function getProcessedFiles(req: Request, res: Response) {
  try {
    // Look for index files in the chunks directory
    const files = await fs.readdir(CHUNKS_DIR);
    const indexFiles = files.filter(file => file.endsWith('-index.json'));
    
    // Read the index files to extract basic information
    const fileInfos = await Promise.all(indexFiles.map(async (indexFile) => {
      try {
        const filePath = path.join(CHUNKS_DIR, indexFile);
        const content = await fs.readFile(filePath, 'utf8');
        const index = JSON.parse(content);
        
        return {
          indexFile,
          sourceFile: index.sourceFile,
          processingDate: index.processingDate,
          chunkCount: index.chunkCount,
          topConcepts: index.concepts?.slice(0, 5) || [],
          topKeywords: index.keywords?.slice(0, 5) || []
        };
      } catch (error) {
        console.error(`Error reading index file ${indexFile}:`, error);
        return {
          indexFile,
          sourceFile: 'Unknown',
          processingDate: new Date(0),
          chunkCount: 0,
          topConcepts: [],
          topKeywords: []
        };
      }
    }));
    
    res.status(200).json({
      success: true,
      files: fileInfos
    });
  } catch (error) {
    console.error('Error getting processed files:', error);
    res.status(500).json({ 
      error: 'Failed to get processed files', 
      details: error instanceof Error ? error.message : String(error)
    });
  }
}

/**
 * Get details for a specific chunk
 * @param req Express request
 * @param res Express response
 */
export async function getChunkDetails(req: Request, res: Response) {
  try {
    const { chunkId } = req.params;
    
    if (!chunkId) {
      return res.status(400).json({ error: 'Chunk ID is required' });
    }
    
    // Find the chunk file
    const chunkPath = path.join(CHUNKS_DIR, `${chunkId}.json`);
    
    try {
      const content = await fs.readFile(chunkPath, 'utf8');
      const chunk = JSON.parse(content);
      
      res.status(200).json({
        success: true,
        chunk
      });
    } catch (error) {
      return res.status(404).json({ error: `Chunk not found: ${chunkId}` });
    }
  } catch (error) {
    console.error('Error getting chunk details:', error);
    res.status(500).json({ 
      error: 'Failed to get chunk details', 
      details: error instanceof Error ? error.message : String(error)
    });
  }
}

/**
 * Get the full index for a processed file
 * @param req Express request
 * @param res Express response
 */
export async function getFileIndex(req: Request, res: Response) {
  try {
    const { indexFile } = req.params;
    
    if (!indexFile) {
      return res.status(400).json({ error: 'Index file name is required' });
    }
    
    // Ensure the index file exists
    const indexPath = path.join(CHUNKS_DIR, indexFile);
    
    try {
      const content = await fs.readFile(indexPath, 'utf8');
      const index = JSON.parse(content);
      
      res.status(200).json({
        success: true,
        index
      });
    } catch (error) {
      return res.status(404).json({ error: `Index not found: ${indexFile}` });
    }
  } catch (error) {
    console.error('Error getting file index:', error);
    res.status(500).json({ 
      error: 'Failed to get file index', 
      details: error instanceof Error ? error.message : String(error)
    });
  }
}

/**
 * Search across all chunks using a query string
 * @param req Express request
 * @param res Express response
 */
export async function searchChunks(req: Request, res: Response) {
  try {
    const { query, limit = 10 } = req.query;
    
    if (!query || typeof query !== 'string') {
      return res.status(400).json({ error: 'Search query is required' });
    }
    
    // Get all chunk files
    const files = await fs.readdir(CHUNKS_DIR);
    const chunkFiles = files.filter(file => file.match(/^chunk_\d+_[0-9a-f]+\.json$/));
    
    // Perform a simple text search
    const queryLower = query.toLowerCase();
    const searchResults = [];
    
    for (const chunkFile of chunkFiles) {
      try {
        const filePath = path.join(CHUNKS_DIR, chunkFile);
        const content = await fs.readFile(filePath, 'utf8');
        const chunk = JSON.parse(content);
        
        // Check if the query appears in the content, title, or summary
        const contentLower = chunk.content.toLowerCase();
        const titleLower = chunk.title.toLowerCase();
        const summaryLower = chunk.summary.toLowerCase();
        
        if (contentLower.includes(queryLower) || 
            titleLower.includes(queryLower) || 
            summaryLower.includes(queryLower)) {
          
          // Calculate relevance score (simple)
          const titleMatches = (titleLower.match(new RegExp(queryLower, 'g')) || []).length;
          const summaryMatches = (summaryLower.match(new RegExp(queryLower, 'g')) || []).length;
          const contentMatches = (contentLower.match(new RegExp(queryLower, 'g')) || []).length;
          
          // Weight: title matches most important, then summary, then content
          const score = (titleMatches * 10) + (summaryMatches * 5) + contentMatches;
          
          searchResults.push({
            chunkId: chunk.id,
            title: chunk.title,
            summary: chunk.summary,
            relevanceScore: score,
            // Add a snippet of text around the match
            snippet: this.generateSnippet(contentLower, queryLower, chunk.content)
          });
        }
      } catch (error) {
        console.error(`Error searching chunk ${chunkFile}:`, error);
      }
    }
    
    // Sort by relevance and limit results
    searchResults.sort((a, b) => b.relevanceScore - a.relevanceScore);
    const limitedResults = searchResults.slice(0, Number(limit));
    
    res.status(200).json({
      success: true,
      query,
      totalResults: searchResults.length,
      results: limitedResults
    });
  } catch (error) {
    console.error('Error searching chunks:', error);
    res.status(500).json({ 
      error: 'Failed to search chunks', 
      details: error instanceof Error ? error.message : String(error)
    });
  }
}

/**
 * Generate a text snippet showing the search term in context
 * @param contentLower Lowercase content
 * @param queryLower Lowercase query
 * @param originalContent Original content with original case
 * @returns Text snippet with match context
 */
function generateSnippet(contentLower: string, queryLower: string, originalContent: string): string {
  const matchIndex = contentLower.indexOf(queryLower);
  if (matchIndex === -1) return '';
  
  // Get text around the match
  const snippetStart = Math.max(0, matchIndex - 100);
  const snippetEnd = Math.min(originalContent.length, matchIndex + queryLower.length + 100);
  
  let snippet = originalContent.substring(snippetStart, snippetEnd);
  
  // Add ellipses if needed
  if (snippetStart > 0) snippet = '...' + snippet;
  if (snippetEnd < originalContent.length) snippet = snippet + '...';
  
  return snippet;
}