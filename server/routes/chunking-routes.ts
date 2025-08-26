/**
 * Routes for the chunking system
 */

import express from 'express';
import * as chunkingController from '../services/chunking/chunking-controller';

const router = express.Router();

// Initialize the chunking system
chunkingController.initChunkingSystem();

/**
 * POST /api/chunking/process
 * Process a file using the advanced chunking system
 * Body: {
 *   filePath: string,
 *   options?: ChunkOptions
 * }
 */
router.post('/process', chunkingController.processFile);

/**
 * GET /api/chunking/files
 * Get a list of all processed files
 */
router.get('/files', chunkingController.getProcessedFiles);

/**
 * GET /api/chunking/chunk/:chunkId
 * Get details for a specific chunk
 */
router.get('/chunk/:chunkId', chunkingController.getChunkDetails);

/**
 * GET /api/chunking/index/:indexFile
 * Get the full index for a processed file
 */
router.get('/index/:indexFile', chunkingController.getFileIndex);

/**
 * GET /api/chunking/search
 * Search across all chunks using a query string
 * Query parameters:
 *   query: string
 *   limit?: number (default: 10)
 */
router.get('/search', chunkingController.searchChunks);

export default router;