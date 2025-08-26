/**
 * Routes for file upload handling
 */

import express from 'express';
import multer from 'multer';
import * as path from 'path';
import * as fs from 'fs/promises';

const router = express.Router();

// Configure multer for file uploads
const UPLOADS_DIR = path.join(process.cwd(), 'uploads');

// Ensure the uploads directory exists
(async () => {
  try {
    await fs.mkdir(UPLOADS_DIR, { recursive: true });
    console.log('Uploads directory initialized');
  } catch (error) {
    console.error('Failed to initialize uploads directory:', error);
  }
})();

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOADS_DIR);
  },
  filename: (req, file, cb) => {
    // Generate unique filename using timestamp and original name
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const fileExt = path.extname(file.originalname);
    const safeName = path.basename(file.originalname, fileExt)
      .replace(/[^a-zA-Z0-9]/g, '_') // Replace non-alphanumeric with underscore
      .substring(0, 100); // Limit base name length
    
    cb(null, safeName + '-' + uniqueSuffix + fileExt);
  }
});

// Create the multer upload instance
const upload = multer({ 
  storage,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB limit
    files: 10 // Maximum 10 files per upload
  },
  fileFilter: (req, file, cb) => {
    // Only allow certain file types
    const allowedTypes = ['.txt', '.html', '.md', '.json'];
    const ext = path.extname(file.originalname).toLowerCase();
    
    if (allowedTypes.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error(`File type not allowed. Allowed types: ${allowedTypes.join(', ')}`));
    }
  }
});

/**
 * POST /api/upload
 * Upload one or more files
 * Response: {
 *   success: boolean,
 *   files: Array<{
 *     originalName: string,
 *     filename: string,
 *     path: string,
 *     size: number
 *   }>
 * }
 */
router.post('/', upload.array('files', 10), async (req, res) => {
  try {
    if (!req.files || (Array.isArray(req.files) && req.files.length === 0)) {
      return res.status(400).json({ error: 'No files were uploaded' });
    }
    
    // Convert multer files to our response format
    const files = Array.isArray(req.files) ? req.files : [req.files];
    const fileInfos = files.map(file => ({
      originalName: file.originalname,
      filename: file.filename,
      path: file.path,
      size: file.size
    }));
    
    res.status(200).json({
      success: true,
      files: fileInfos
    });
  } catch (error) {
    console.error('Error handling file upload:', error);
    res.status(500).json({ 
      error: 'Failed to upload files', 
      details: error instanceof Error ? error.message : String(error)
    });
  }
});

/**
 * GET /api/upload/files
 * Get a list of all uploaded files
 * Response: {
 *   success: boolean,
 *   files: Array<{
 *     filename: string,
 *     path: string,
 *     size: number,
 *     uploadDate: Date
 *   }>
 * }
 */
router.get('/files', async (req, res) => {
  try {
    const files = await fs.readdir(UPLOADS_DIR);
    
    // Get file stats for each file
    const fileInfos = await Promise.all(files.map(async (filename) => {
      try {
        const filePath = path.join(UPLOADS_DIR, filename);
        const stats = await fs.stat(filePath);
        
        return {
          filename,
          path: filePath,
          size: stats.size,
          uploadDate: stats.mtime
        };
      } catch (error) {
        console.error(`Error getting stats for file ${filename}:`, error);
        return null;
      }
    }));
    
    // Filter out any files that couldn't be read
    const validFiles = fileInfos.filter(file => file !== null);
    
    res.status(200).json({
      success: true,
      files: validFiles
    });
  } catch (error) {
    console.error('Error getting uploaded files:', error);
    res.status(500).json({ 
      error: 'Failed to get uploaded files', 
      details: error instanceof Error ? error.message : String(error)
    });
  }
});

/**
 * GET /api/upload/file/:filename
 * Download a specific uploaded file
 */
router.get('/file/:filename', async (req, res) => {
  try {
    const { filename } = req.params;
    const filePath = path.join(UPLOADS_DIR, filename);
    
    // Check if file exists
    try {
      await fs.access(filePath);
    } catch (error) {
      return res.status(404).json({ error: `File not found: ${filename}` });
    }
    
    // Send the file as attachment
    res.download(filePath);
  } catch (error) {
    console.error('Error downloading file:', error);
    res.status(500).json({ 
      error: 'Failed to download file', 
      details: error instanceof Error ? error.message : String(error)
    });
  }
});

/**
 * DELETE /api/upload/file/:filename
 * Delete a specific uploaded file
 */
router.delete('/file/:filename', async (req, res) => {
  try {
    const { filename } = req.params;
    const filePath = path.join(UPLOADS_DIR, filename);
    
    // Check if file exists
    try {
      await fs.access(filePath);
    } catch (error) {
      return res.status(404).json({ error: `File not found: ${filename}` });
    }
    
    // Delete the file
    await fs.unlink(filePath);
    
    res.status(200).json({
      success: true,
      message: `File ${filename} deleted successfully`
    });
  } catch (error) {
    console.error('Error deleting file:', error);
    res.status(500).json({ 
      error: 'Failed to delete file', 
      details: error instanceof Error ? error.message : String(error)
    });
  }
});

export default router;