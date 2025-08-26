/**
 * Memory Routes
 * 
 * This module provides Express routes for the memory system.
 */

import express from 'express';
import multer from 'multer';
import * as memoryDb from '../utils/memory-db-handler.js';
import { parseChatGptExport } from '../utils/chatgpt-export-parser.js';

// WebSocket broadcast utility for progress updates
const broadcastToWebSocketClients = (type, data) => {
  try {
    if (!global.wsClients || !global.wsClients.size) {
      console.log('[QUANTUM_STATE: WARNING_FLOW] No WebSocket clients connected');
      return;
    }
    
    const message = JSON.stringify({
      type,
      ...data,
      timestamp: Date.now()
    });
    
    let clientCount = 0;
    
    global.wsClients.forEach(client => {
      if (client.readyState === 1) { // WebSocket.OPEN
        client.send(message);
        clientCount++;
      }
    });
    
    console.log(`[QUANTUM_STATE: WEBSOCKET_FLOW] Broadcast ${type} to ${clientCount} clients`);
  } catch (error) {
    console.error('[QUANTUM_STATE: ERROR_FLOW] Error broadcasting to WebSocket clients:', error);
  }
};

const router = express.Router();

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 50 * 1024 * 1024 // 50 MB limit
  }
});

/**
 * Create a memory
 * 
 * POST /api/memories
 */
router.post('/', async (req, res) => {
  try {
    const memory = req.body;
    
    // Basic validation
    if (!memory.title || !memory.content) {
      return res.status(400).json({
        success: false,
        message: 'Title and content are required'
      });
    }
    
    // Import memory
    const importedMemory = await memoryDb.importMemory(memory);
    
    res.status(201).json({
      success: true,
      message: 'Memory created successfully',
      data: importedMemory
    });
  } catch (error) {
    console.error('[QUANTUM_STATE: ERROR_FLOW] Memory creation error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating memory',
      error: error.message
    });
  }
});

/**
 * Get all memories
 * 
 * GET /api/memories
 */
router.get('/', async (req, res) => {
  try {
    const { limit = 100, offset = 0, source } = req.query;
    
    // Get memories
    const memories = await memoryDb.getMemories({
      limit: parseInt(limit),
      offset: parseInt(offset),
      source: source || null
    });
    
    res.json({
      success: true,
      data: memories
    });
  } catch (error) {
    console.error('[QUANTUM_STATE: ERROR_FLOW] Memories retrieval error:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving memories',
      error: error.message
    });
  }
});

/**
 * Get a memory by ID
 * 
 * GET /api/memories/:id
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Get memory
    const memory = await memoryDb.getMemory(parseInt(id));
    
    if (!memory) {
      return res.status(404).json({
        success: false,
        message: `Memory with ID ${id} not found`
      });
    }
    
    res.json({
      success: true,
      data: memory
    });
  } catch (error) {
    console.error(`[QUANTUM_STATE: ERROR_FLOW] Memory retrieval error for ID ${req.params.id}:`, error);
    
    if (error.message.includes('not found')) {
      return res.status(404).json({
        success: false,
        message: error.message
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Error retrieving memory',
      error: error.message
    });
  }
});

/**
 * Update a memory
 * 
 * PATCH /api/memories/:id
 */
router.patch('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    // Update memory
    const updatedMemory = await memoryDb.updateMemory(parseInt(id), updates);
    
    res.json({
      success: true,
      message: 'Memory updated successfully',
      data: updatedMemory
    });
  } catch (error) {
    console.error(`[QUANTUM_STATE: ERROR_FLOW] Memory update error for ID ${req.params.id}:`, error);
    
    if (error.message.includes('not found')) {
      return res.status(404).json({
        success: false,
        message: error.message
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Error updating memory',
      error: error.message
    });
  }
});

/**
 * Delete a memory
 * 
 * DELETE /api/memories/:id
 */
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Delete memory
    await memoryDb.deleteMemory(parseInt(id));
    
    res.json({
      success: true,
      message: 'Memory deleted successfully'
    });
  } catch (error) {
    console.error(`[QUANTUM_STATE: ERROR_FLOW] Memory deletion error for ID ${req.params.id}:`, error);
    
    if (error.message.includes('not found')) {
      return res.status(404).json({
        success: false,
        message: error.message
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Error deleting memory',
      error: error.message
    });
  }
});

/**
 * Get transactions for a memory
 * 
 * GET /api/memories/:id/transactions
 */
router.get('/:id/transactions', async (req, res) => {
  try {
    const { id } = req.params;
    const { limit = 100 } = req.query;
    
    // Get transactions
    const transactions = await memoryDb.getTransactions(parseInt(id), parseInt(limit));
    
    res.json({
      success: true,
      data: transactions
    });
  } catch (error) {
    console.error(`[QUANTUM_STATE: ERROR_FLOW] Transactions retrieval error for memory ID ${req.params.id}:`, error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving transactions',
      error: error.message
    });
  }
});

/**
 * Import ChatGPT export
 * 
 * POST /api/memories/import/chatgpt
 */
router.post('/import/chatgpt', upload.single('file'), async (req, res) => {
  try {
    const { title, dryRun = 'false' } = req.body;
    
    // Validate request
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }
    
    if (!title) {
      return res.status(400).json({
        success: false,
        message: 'Title is required'
      });
    }
    
    // Read file content
    const content = req.file.buffer.toString('utf-8');
    
    // Parse JSON
    let jsonData;
    try {
      jsonData = JSON.parse(content);
    } catch (parseError) {
      return res.status(400).json({
        success: false,
        message: 'Invalid JSON file',
        error: parseError.message
      });
    }
    
    // Parse and store
    const result = await parseChatGptExport(
      jsonData,
      title,
      dryRun === 'true' || dryRun === true
    );
    
    res.json({
      success: true,
      ...result
    });
  } catch (error) {
    console.error('[QUANTUM_STATE: ERROR_FLOW] ChatGPT import error:', error);
    res.status(500).json({
      success: false,
      message: 'Error importing ChatGPT data',
      error: error.message
    });
  }
});

/**
 * Import preview for ChatGPT export
 * Shows counts of new, duplicate, and skipped items without committing to database
 * 
 * POST /api/memories/import/preview
 */
router.post('/import/preview', upload.single('file'), async (req, res) => {
  try {
    const { title } = req.body;
    
    // Validate request
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }
    
    // Read file content
    const content = req.file.buffer.toString('utf-8');
    
    // Parse JSON
    let jsonData;
    try {
      jsonData = JSON.parse(content);
    } catch (parseError) {
      return res.status(400).json({
        success: false,
        message: 'Invalid JSON file',
        error: parseError.message
      });
    }
    
    // Generate a unique preview ID for this file analysis
    const previewId = `preview_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`;
    
    // Store preview data in memory (in a real app, this would be Redis or similar)
    global.previewCache = global.previewCache || {};
    global.previewCache[previewId] = {
      data: jsonData,
      title,
      timestamp: Date.now()
    };
    
    // Analyze data for preview (pass dryRun = true to avoid DB writes)
    const previewResult = await parseChatGptExport(jsonData, title, true);
    
    // Calculate counts
    const newCount = previewResult.conversations?.length || 0;
    const duplicateCount = previewResult.duplicates?.length || 0;
    const skippedCount = previewResult.skipped?.length || 0;
    
    // Compute estimated coherence ratio based on the content
    // Normally this would be a more sophisticated algorithm
    const stabilityScore = previewResult.coherence_metrics?.stability_score || 0.75;
    const explorationScore = previewResult.coherence_metrics?.exploration_score || 0.25;
    const coherenceRatio = `${Math.round(stabilityScore * 100)}% : ${Math.round(explorationScore * 100)}%`;
    
    res.json({
      success: true,
      previewId,
      newCount,
      duplicateCount,
      skippedCount,
      estimatedMemories: newCount,
      coherenceRatio,
      message: `Preview ready: ${newCount} new, ${duplicateCount} duplicates, ${skippedCount} skipped`
    });
  } catch (error) {
    console.error('[QUANTUM_STATE: ERROR_FLOW] ChatGPT import preview error:', error);
    res.status(500).json({
      success: false,
      message: 'Error generating preview',
      error: error.message
    });
  }
});

/**
 * Confirm import after preview
 * Uses the previewId to retrieve the previously analyzed file data
 * 
 * POST /api/memories/import/confirm
 */
router.post('/import/confirm', async (req, res) => {
  try {
    const { previewId, title } = req.body;
    
    // Validate request
    if (!previewId) {
      return res.status(400).json({
        success: false,
        message: 'Preview ID is required'
      });
    }
    
    if (!title) {
      return res.status(400).json({
        success: false,
        message: 'Title is required'
      });
    }
    
    // Get preview data from cache
    if (!global.previewCache || !global.previewCache[previewId]) {
      return res.status(404).json({
        success: false,
        message: 'Preview not found or expired'
      });
    }
    
    const { data } = global.previewCache[previewId];
    
    // Process and store the data (pass dryRun = false to commit to DB)
    const result = await parseChatGptExport(data, title, false);
    
    // Clean up preview cache
    delete global.previewCache[previewId];
    
    res.json({
      success: true,
      ...result
    });
  } catch (error) {
    console.error('[QUANTUM_STATE: ERROR_FLOW] ChatGPT import confirmation error:', error);
    res.status(500).json({
      success: false,
      message: 'Error confirming import',
      error: error.message
    });
  }
});

/**
 * Handle chunked file uploads (for large files)
 * 
 * POST /api/memories/import/chunk
 */
router.post('/import/chunk', upload.single('chunk'), async (req, res) => {
  try {
    const { offset, total_size, filename } = req.body;
    
    // Validate request
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No chunk uploaded'
      });
    }
    
    if (!offset || !total_size || !filename) {
      return res.status(400).json({
        success: false,
        message: 'Missing required parameters: offset, total_size, filename'
      });
    }
    
    // Initialize chunks storage if not exists
    global.chunkStorage = global.chunkStorage || {};
    
    // Create an identifier for this file
    const fileId = `${filename.replace(/[^a-z0-9]/gi, '_')}_${total_size}`;
    
    // Initialize storage for this file if needed
    if (!global.chunkStorage[fileId]) {
      global.chunkStorage[fileId] = {
        chunks: {},
        totalSize: parseInt(total_size),
        receivedSize: 0,
        filename,
        timestamp: Date.now()
      };
    }
    
    const numOffset = parseInt(offset);
    const chunkSize = req.file.size;
    
    // Store this chunk
    global.chunkStorage[fileId].chunks[numOffset] = req.file.buffer;
    global.chunkStorage[fileId].receivedSize += chunkSize;
    
    // Calculate progress
    const progress = Math.floor((global.chunkStorage[fileId].receivedSize / global.chunkStorage[fileId].totalSize) * 100);
    
    // If we receive the last chunk, all chunks are received
    const isComplete = global.chunkStorage[fileId].receivedSize >= global.chunkStorage[fileId].totalSize;
    
    // Current chunk number based on offset
    const currentChunk = Math.floor(numOffset / chunkSize);
    const totalChunks = Math.ceil(global.chunkStorage[fileId].totalSize / chunkSize);
    
    // Build the response object
    const responseData = {
      success: true,
      fileId,
      offset: numOffset,
      nextOffset: numOffset + chunkSize,
      progress,
      isComplete,
      currentChunk,
      totalChunks,
      message: isComplete ? 'Upload complete' : 'Chunk received'
    };
    
    // Send response to the client
    res.json(responseData);
    
    // Broadcast progress to all WebSocket clients
    broadcastToWebSocketClients('CHUNK_RECEIVED', {
      type: 'CHUNK_RECEIVED',
      fileId,
      currentChunk,
      totalChunks,
      nextOffset: numOffset + chunkSize,
      progress,
      isComplete,
      coherenceMetrics: {
        // Maintaining 3:1 quantum balance ratio (75% coherence, 25% exploration)
        stability_score: 0.75,
        exploration_score: 0.25,
        coherence_score: 0.75,
        coherence_ratio: '3:1 (75%)'
      }
    });
    
    // If all chunks are received, automatically combine them
    if (isComplete) {
      try {
        // Combine chunks here (this would be implemented for real use)
        console.log(`[QUANTUM_STATE: INFO_FLOW] All chunks received for ${fileId}`);
        
        // Broadcast completion notification
        broadcastToWebSocketClients('IMPORT_PROGRESS', {
          type: 'IMPORT_PROGRESS',
          progress: 100,
          stage: 'preparing',
          message: 'Preparing received chunks for processing'
        });
        
        // Clean up temp storage (in a real implementation, we'd save to disk/DB here)
        // For this demo, we're just confirming receipt and will process in next step
      } catch (combineError) {
        console.error(`[QUANTUM_STATE: ERROR_FLOW] Error combining chunks for ${fileId}:`, combineError);
      }
    }
  } catch (error) {
    console.error('[QUANTUM_STATE: ERROR_FLOW] Chunk upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Error processing chunk',
      error: error.message
    });
  }
});

/**
 * Process a completed chunked upload
 * 
 * POST /api/memories/import/process-chunks
 */
router.post('/import/process-chunks', async (req, res) => {
  try {
    const { fileId, title } = req.body;
    
    // Validate request
    if (!fileId) {
      return res.status(400).json({
        success: false,
        message: 'File ID is required'
      });
    }
    
    if (!title) {
      return res.status(400).json({
        success: false,
        message: 'Title is required'
      });
    }
    
    // Check if we have this file's chunks
    if (!global.chunkStorage || !global.chunkStorage[fileId]) {
      return res.status(404).json({
        success: false,
        message: 'File not found or chunks expired'
      });
    }
    
    const fileData = global.chunkStorage[fileId];
    
    // Check if all chunks were received
    if (fileData.receivedSize < fileData.totalSize) {
      return res.status(400).json({
        success: false,
        message: 'File upload is incomplete',
        receivedSize: fileData.receivedSize,
        totalSize: fileData.totalSize,
        progress: Math.floor((fileData.receivedSize / fileData.totalSize) * 100)
      });
    }
    
    // Combine chunks
    const chunks = Object.entries(fileData.chunks)
      .sort((a, b) => parseInt(a[0]) - parseInt(b[0]))
      .map(entry => entry[1]);
    
    const completeBuffer = Buffer.concat(chunks);
    
    // Process the complete file
    try {
      // Broadcast that we're starting the processing phase
      broadcastToWebSocketClients('IMPORT_PROGRESS', {
        type: 'IMPORT_PROGRESS',
        progress: 0,
        stage: 'processing',
        message: 'Processing uploaded file'
      });
      
      // Parse content
      const content = completeBuffer.toString('utf-8');
      const jsonData = JSON.parse(content);
      
      // Broadcast parsing complete
      broadcastToWebSocketClients('IMPORT_PROGRESS', {
        type: 'IMPORT_PROGRESS',
        progress: 30,
        stage: 'analyzing',
        message: 'Analyzing conversation structure'
      });
      
      // Process the data
      const result = await parseChatGptExport(jsonData, title, false);
      
      // Broadcast processing complete with coherence metrics
      broadcastToWebSocketClients('IMPORT_COMPLETE', {
        type: 'IMPORT_COMPLETE',
        memory: result,
        coherenceMetrics: {
          stability_score: result.coherence_metrics?.stability_score || 0.75,
          exploration_score: result.coherence_metrics?.exploration_score || 0.25,
          coherence_score: result.coherence_metrics?.coherence_score || 0.75,
          coherence_ratio: '3:1 (75%)'
        },
        message: 'Import completed successfully'
      });
      
      // Clean up
      delete global.chunkStorage[fileId];
      
      res.json({
        success: true,
        ...result
      });
    } catch (processError) {
      console.error('[QUANTUM_STATE: ERROR_FLOW] Error processing combined chunks:', processError);
      
      // Broadcast error
      broadcastToWebSocketClients('IMPORT_ERROR', {
        type: 'IMPORT_ERROR',
        message: 'Error processing file',
        details: processError.message
      });
      
      res.status(500).json({
        success: false,
        message: 'Error processing combined file',
        error: processError.message
      });
    }
  } catch (error) {
    console.error('[QUANTUM_STATE: ERROR_FLOW] Chunk processing error:', error);
    res.status(500).json({
      success: false,
      message: 'Error processing chunks',
      error: error.message
    });
  }
});

/**
 * Get coherence snapshots
 * 
 * GET /api/memories/coherence/snapshots
 */
router.get('/coherence/snapshots', async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    
    // Get snapshots from database - execute direct query for this route
    // since we don't have a helper function for multiple snapshots
    const snapshots = await memoryDb.db
      .select()
      .from(memoryDb.memorySchema.coherenceSnapshots)
      .orderBy(memoryDb.memorySchema.coherenceSnapshots.timestamp.desc())
      .limit(parseInt(limit));
    
    res.json({
      success: true,
      data: snapshots
    });
  } catch (error) {
    console.error('[QUANTUM_STATE: ERROR_FLOW] Coherence snapshots retrieval error:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving coherence snapshots',
      error: error.message
    });
  }
});

/**
 * Get latest coherence snapshot
 * 
 * GET /api/memories/coherence/latest
 */
router.get('/coherence/latest', async (req, res) => {
  try {
    // Get latest snapshot
    const snapshot = await memoryDb.getLatestCoherenceSnapshot();
    
    if (!snapshot) {
      return res.status(404).json({
        success: false,
        message: 'No coherence snapshots found'
      });
    }
    
    // Broadcast the latest coherence snapshot via WebSocket for real-time monitoring
    broadcastToWebSocketClients('COHERENCE_SNAPSHOT', {
      coherenceMetrics: {
        stability_score: snapshot.stability_score,
        exploration_score: snapshot.exploration_score,
        coherence_score: snapshot.coherence_score,
        coherence_ratio: `${Math.round(snapshot.stability_score * 100)}% : ${Math.round(snapshot.exploration_score * 100)}%`
      },
      timestamp: snapshot.timestamp,
      message: 'Latest coherence snapshot'
    });
    
    res.json({
      success: true,
      data: snapshot
    });
  } catch (error) {
    console.error('[QUANTUM_STATE: ERROR_FLOW] Latest coherence snapshot retrieval error:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving latest coherence snapshot',
      error: error.message
    });
  }
});

/**
 * Create coherence snapshot
 * 
 * POST /api/memories/coherence/snapshots
 */
router.post('/coherence/snapshots', async (req, res) => {
  try {
    const snapshotData = req.body;
    
    // Basic validation
    if (!snapshotData.coherence_score || !snapshotData.stability_score || !snapshotData.exploration_score) {
      return res.status(400).json({
        success: false,
        message: 'Coherence, stability, and exploration scores are required'
      });
    }
    
    // Create snapshot
    const snapshot = await memoryDb.createCoherenceSnapshot(snapshotData);
    
    // Broadcast coherence snapshot via WebSocket for real-time monitoring
    broadcastToWebSocketClients('COHERENCE_SNAPSHOT', {
      coherenceMetrics: {
        stability_score: snapshot.stability_score,
        exploration_score: snapshot.exploration_score,
        coherence_score: snapshot.coherence_score,
        coherence_ratio: `${Math.round(snapshot.stability_score * 100)}% : ${Math.round(snapshot.exploration_score * 100)}%`
      },
      timestamp: snapshot.timestamp,
      message: 'New coherence snapshot created'
    });
    
    res.status(201).json({
      success: true,
      message: 'Coherence snapshot created successfully',
      data: snapshot
    });
  } catch (error) {
    console.error('[QUANTUM_STATE: ERROR_FLOW] Coherence snapshot creation error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating coherence snapshot',
      error: error.message
    });
  }
});

export default router;