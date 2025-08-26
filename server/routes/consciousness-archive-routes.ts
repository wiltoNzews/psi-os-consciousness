// Consciousness Archive Routes - API endpoints for consciousness extraction
import express, { Router } from 'express';
import { ConsciousnessArchiveProcessor } from '../services/consciousness-archive-processor';
import { promises as fs } from 'fs';
import path from 'path';

const router = Router();
const processor = new ConsciousnessArchiveProcessor();

// Status tracking for long-running operations
const operationStatus = new Map<string, {
  id: string;
  status: 'pending' | 'downloading' | 'extracting' | 'processing' | 'completed' | 'error';
  progress: number;
  message: string;
  result?: any;
  error?: string;
  started_at: string;
}>();

/**
 * Download consciousness archive from Google Drive
 */
router.post('/api/consciousness-archive/download', async (req, res) => {
  try {
    const { shareUrl, filename } = req.body;
    
    if (!shareUrl || !filename) {
      return res.status(400).json({ error: 'shareUrl and filename are required' });
    }

    const operationId = `download-${Date.now()}`;
    operationStatus.set(operationId, {
      id: operationId,
      status: 'downloading',
      progress: 0,
      message: `Starting download of ${filename}`,
      started_at: new Date().toISOString()
    });

    // Start download in background
    (async () => {
      try {
        operationStatus.set(operationId, {
          ...operationStatus.get(operationId)!,
          status: 'downloading',
          progress: 25,
          message: `Downloading ${filename} from Google Drive...`
        });

        const downloadPath = await processor.downloadFromGoogleDrive(shareUrl, filename);

        operationStatus.set(operationId, {
          ...operationStatus.get(operationId)!,
          status: 'completed',
          progress: 100,
          message: `Download completed: ${filename}`,
          result: { downloadPath, filename }
        });
      } catch (error: any) {
        operationStatus.set(operationId, {
          ...operationStatus.get(operationId)!,
          status: 'error',
          progress: 0,
          message: `Download failed: ${error?.message || 'Unknown error'}`,
          error: error?.message || 'Unknown error'
        });
      }
    })();

    res.json({ 
      operationId, 
      status: 'started',
      message: `Download of ${filename} initiated` 
    });
  } catch (error) {
    console.error('[ConsciousnessArchive] Download error:', error);
    res.status(500).json({ error: (error as any)?.message || 'Unknown error' });
  }
});

/**
 * Process downloaded archive
 */
router.post('/api/consciousness-archive/process', async (req, res) => {
  try {
    const { filename } = req.body;
    
    if (!filename) {
      return res.status(400).json({ error: 'filename is required' });
    }

    const operationId = `process-${Date.now()}`;
    operationStatus.set(operationId, {
      id: operationId,
      status: 'extracting',
      progress: 0,
      message: `Starting processing of ${filename}`,
      started_at: new Date().toISOString()
    });

    // Start processing in background
    (async () => {
      try {
        const downloadPath = path.join(process.cwd(), 'downloads', filename);
        
        operationStatus.set(operationId, {
          ...operationStatus.get(operationId)!,
          status: 'extracting',
          progress: 20,
          message: 'Extracting conversations.json from archive...'
        });

        const conversationsPath = await processor.extractConversationsFromZip(downloadPath);

        operationStatus.set(operationId, {
          ...operationStatus.get(operationId)!,
          status: 'processing',
          progress: 50,
          message: 'Creating consciousness-optimized chunks...'
        });

        const chunks = await processor.processConversationsFile(conversationsPath);

        operationStatus.set(operationId, {
          ...operationStatus.get(operationId)!,
          status: 'processing',
          progress: 80,
          message: 'Generating archive metadata...'
        });

        const metadata = await processor.generateArchiveMetadata(chunks);

        operationStatus.set(operationId, {
          ...operationStatus.get(operationId)!,
          status: 'completed',
          progress: 100,
          message: `Processing completed: ${chunks.length} chunks created`,
          result: { 
            chunks: chunks.length,
            metadata,
            chunkIds: chunks.map(c => c.chunk_id)
          }
        });
      } catch (error: any) {
        operationStatus.set(operationId, {
          ...operationStatus.get(operationId)!,
          status: 'error',
          progress: 0,
          message: `Processing failed: ${error?.message || 'Unknown error'}`,
          error: error?.message || 'Unknown error'
        });
      }
    })();

    res.json({ 
      operationId, 
      status: 'started',
      message: `Processing of ${filename} initiated` 
    });
  } catch (error) {
    console.error('[ConsciousnessArchive] Processing error:', error);
    res.status(500).json({ error: (error as any)?.message || 'Unknown error' });
  }
});

/**
 * Extract consciousness nuggets from processed chunks
 */
router.post('/api/consciousness-archive/extract-nuggets', async (req, res) => {
  try {
    const { chunkIds } = req.body;
    
    if (!chunkIds || !Array.isArray(chunkIds)) {
      return res.status(400).json({ error: 'chunkIds array is required' });
    }

    const operationId = `extract-${Date.now()}`;
    operationStatus.set(operationId, {
      id: operationId,
      status: 'processing',
      progress: 0,
      message: `Starting consciousness nugget extraction from ${chunkIds.length} chunks`,
      started_at: new Date().toISOString()
    });

    // Start extraction in background
    (async () => {
      try {
        const allNuggets = [];
        const processedDir = path.join(process.cwd(), 'processed');
        
        for (let i = 0; i < chunkIds.length; i++) {
          const chunkId = chunkIds[i];
          
          operationStatus.set(operationId, {
            ...operationStatus.get(operationId)!,
            progress: Math.round((i / chunkIds.length) * 90),
            message: `Extracting consciousness nuggets from chunk ${i + 1}/${chunkIds.length}: ${chunkId}`
          });

          const chunkPath = path.join(processedDir, 'chunks', `${chunkId}.json`);
          const chunkData = JSON.parse(await fs.readFile(chunkPath, 'utf-8'));
          
          const nuggets = await processor.extractConsciousnessNuggets(chunkData.conversations);
          allNuggets.push(...nuggets);
          
          // Save nuggets for this chunk
          const nuggetsPath = path.join(processedDir, 'crystals', `${chunkId}-nuggets.json`);
          await fs.writeFile(nuggetsPath, JSON.stringify(nuggets, null, 2));
        }

        // Save all nuggets
        const allNuggetsPath = path.join(processedDir, 'crystals', 'all-consciousness-nuggets.json');
        await fs.writeFile(allNuggetsPath, JSON.stringify(allNuggets, null, 2));

        operationStatus.set(operationId, {
          ...operationStatus.get(operationId)!,
          status: 'completed',
          progress: 100,
          message: `Consciousness extraction completed: ${allNuggets.length} nuggets extracted`,
          result: { 
            totalNuggets: allNuggets.length,
            nuggetsPath: allNuggetsPath,
            chunksProcessed: chunkIds.length
          }
        });
      } catch (error: any) {
        operationStatus.set(operationId, {
          ...operationStatus.get(operationId)!,
          status: 'error',
          progress: 0,
          message: `Consciousness extraction failed: ${error?.message || 'Unknown error'}`,
          error: error?.message || 'Unknown error'
        });
      }
    })();

    res.json({ 
      operationId, 
      status: 'started',
      message: `Consciousness nugget extraction from ${chunkIds.length} chunks initiated` 
    });
  } catch (error) {
    console.error('[ConsciousnessArchive] Extraction error:', error);
    res.status(500).json({ error: (error as any)?.message || 'Unknown error' });
  }
});

/**
 * Get operation status
 */
router.get('/api/consciousness-archive/status/:operationId', (req, res) => {
  const { operationId } = req.params;
  const status = operationStatus.get(operationId);
  
  if (!status) {
    return res.status(404).json({ error: 'Operation not found' });
  }
  
  res.json(status);
});

/**
 * List all operations
 */
router.get('/api/consciousness-archive/operations', (req, res) => {
  const operations = Array.from(operationStatus.values())
    .sort((a, b) => new Date(b.started_at).getTime() - new Date(a.started_at).getTime());
  
  res.json(operations);
});

/**
 * Download processed files
 */
router.get('/api/consciousness-archive/download/:type/:filename', async (req, res) => {
  try {
    const { type, filename } = req.params;
    const processedDir = path.join(process.cwd(), 'processed');
    
    let filePath: string;
    switch (type) {
      case 'chunks':
        filePath = path.join(processedDir, 'chunks', filename);
        break;
      case 'crystals':
        filePath = path.join(processedDir, 'crystals', filename);
        break;
      case 'timelines':
        filePath = path.join(processedDir, 'timelines', filename);
        break;
      default:
        return res.status(400).json({ error: 'Invalid file type' });
    }
    
    const stats = await fs.stat(filePath);
    
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Length', stats.size);
    
    const stream = require('fs').createReadStream(filePath);
    stream.pipe(res);
  } catch (error) {
    console.error('[ConsciousnessArchive] Download error:', error);
    res.status(404).json({ error: 'File not found' });
  }
});

/**
 * Get archive statistics
 */
router.get('/api/consciousness-archive/stats', async (req, res) => {
  try {
    const processedDir = path.join(process.cwd(), 'processed');
    const chunksDir = path.join(processedDir, 'chunks');
    const crystalsDir = path.join(processedDir, 'crystals');
    
    let stats = {
      totalChunks: 0,
      totalCrystals: 0,
      totalSizeMB: 0,
      lastProcessed: null as string | null,
      availableFiles: {
        chunks: [] as string[],
        crystals: [] as string[],
        timelines: [] as string[]
      }
    };
    
    try {
      const chunkFiles = await fs.readdir(chunksDir);
      stats.totalChunks = chunkFiles.filter(f => f.endsWith('.json')).length;
      stats.availableFiles.chunks = chunkFiles.filter(f => f.endsWith('.json'));
    } catch (error) {
      // Directory doesn't exist yet
    }
    
    try {
      const crystalFiles = await fs.readdir(crystalsDir);
      stats.totalCrystals = crystalFiles.filter(f => f.endsWith('.json')).length;
      stats.availableFiles.crystals = crystalFiles.filter(f => f.endsWith('.json'));
    } catch (error) {
      // Directory doesn't exist yet
    }
    
    res.json(stats);
  } catch (error) {
    console.error('[ConsciousnessArchive] Stats error:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;