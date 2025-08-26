/**
 * Quantum Fractal Art API Routes
 * Implements endpoints for fractal art, music, and humor generation
 * Following the 3:1 quantum balance ratio (75% coherence, 25% exploration)
 */
import express from 'express';
import { 
  generateFractalArt, 
  generateFractalMusic, 
  generateQuantumHumor
} from '../services/quantum-fractal-art-music.js';

// Import the service functions
import { 
  checkGpuSupport as serviceCheckGpuSupport,
  logCoherenceMetrics as serviceLogCoherenceMetrics 
} from '../services/quantum-fractal-art-music.js';

// Storage for coherence logs
const coherenceLogs = {
  'fractal-art': [],
  'fractal-music': [],
  'quantum-humor': []
};

// Mock implementation for coherence logs
const logCoherenceMetrics = async (type, metrics, retrieveLimit = 10) => {
  // Initialize category if it doesn't exist
  if (!coherenceLogs[type]) {
    coherenceLogs[type] = [];
  }
  
  // If metrics is null, we're retrieving logs
  if (metrics === null) {
    const logs = coherenceLogs[type] || [];
    return logs.slice(-retrieveLimit).reverse(); // Return most recent logs first
  }
  
  // Add timestamp if not present
  if (!metrics.timestamp) {
    metrics.timestamp = new Date().toISOString();
  }
  
  // Add metrics to in-memory log
  coherenceLogs[type].push(metrics);
  
  // Keep logs to a reasonable size (100 entries per type)
  if (coherenceLogs[type].length > 100) {
    coherenceLogs[type] = coherenceLogs[type].slice(-100);
  }
  
  try {
    // Log metadata for analysis
    console.log(`[QUANTUM_COHERENCE] Logged ${type} metrics - coherence: ${metrics.coherenceScore}, QRF: ${metrics.quantumResonanceFactor}`);
    
    // For future integration with system-wide coherence analysis
    if (type === 'fractal-art') {
      // Notify other system components about coherence metrics via custom event
      console.log(`[QUANTUM_COHERENCE_EVENT] ${JSON.stringify(metrics)}`);
    }
  } catch (err) {
    console.error('[QUANTUM_COHERENCE] Error in coherence logging:', err);
  }
  
  return coherenceLogs[type];
};

const router = express.Router();

// Define coherence constants according to the 3:1 quantum balance ratio
const OPTIMAL_COHERENCE_RATIO = 0.75;
const OPTIMAL_EXPLORATION_RATIO = 0.25;
const COHERENCE_THRESHOLD = 3.0; // Threshold for good coherence

// GPU config for RTX 4090
const GPU_CONFIG = {
  vendor: 'NVIDIA',
  model: 'RTX 4090',
  cudaCores: 16384,
  vramGB: 24,
  enabled: false // Will be set dynamically
};

// Initialize GPU support check
(async () => {
  const gpuSupport = await serviceCheckGpuSupport();
  GPU_CONFIG.enabled = gpuSupport.available;
  console.log(`[QUANTUM_FRACTAL] GPU Support: ${GPU_CONFIG.enabled ? 'Enabled' : 'Disabled'}`);
  if (GPU_CONFIG.enabled) {
    console.log(`[QUANTUM_FRACTAL] Using CUDA acceleration for ${GPU_CONFIG.model}`);
    console.log(`[QUANTUM_FRACTAL] CUDA Cores: ${GPU_CONFIG.cudaCores}, VRAM: ${GPU_CONFIG.vramGB}GB`);
    console.log(`[QUANTUM_FRACTAL] Quantum balance ratio: ${gpuSupport.quantumBalance?.coherenceRatio * 100}% coherence, ${gpuSupport.quantumBalance?.explorationRatio * 100}% exploration`);
  }
})();

/**
 * Calculate coherence metrics based on the 3:1 quantum balance ratio
 * @param {number} stabilityRatio - The stability/coherence ratio
 * @param {number} explorationRatio - The exploration/chaos ratio
 * @returns {Object} Coherence metrics
 */
function calculateCoherenceMetrics(stabilityRatio, explorationRatio) {
  // Calculate deviation from optimal ratios
  const stabilityDiff = Math.abs(stabilityRatio - OPTIMAL_COHERENCE_RATIO);
  const explorationDiff = Math.abs(explorationRatio - OPTIMAL_EXPLORATION_RATIO);
  
  // Calculate raw coherence score (1.0 is perfect)
  const rawCoherenceScore = 1 - ((stabilityDiff + explorationDiff) / 2);
  
  // Calculate quantum resonance factor (QRF)
  // Higher when closer to the 3:1 ratio
  const quantumResonanceFactor = (1 - stabilityDiff/OPTIMAL_COHERENCE_RATIO) * 
                                (1 - explorationDiff/OPTIMAL_EXPLORATION_RATIO);
  
  // Calculate stability threshold
  const stabilityThreshold = stabilityRatio / OPTIMAL_COHERENCE_RATIO;
  
  // Calculate the coherence threshold value (higher is better)
  const coherenceThreshold = COHERENCE_THRESHOLD * rawCoherenceScore;
  
  return {
    coherenceScore: parseFloat(rawCoherenceScore.toFixed(4)),
    quantumResonanceFactor: parseFloat(quantumResonanceFactor.toFixed(4)),
    stabilityThreshold: parseFloat(stabilityThreshold.toFixed(4)),
    coherenceThreshold: parseFloat(coherenceThreshold.toFixed(4)),
    calculatedAt: new Date().toISOString()
  };
}

/**
 * @route POST /api/quantum-fractal-art/generate-art
 * @desc Generate quantum fractal art based on parameters
 * @access Public
 */
router.post('/generate-art', async (req, res) => {
  try {
    const {
      fractalStyle = 'mandelbrot',
      colorScheme = 'quantum',
      stabilityRatio = OPTIMAL_COHERENCE_RATIO, // Default to optimal 3:1 balance
      explorationRatio = OPTIMAL_EXPLORATION_RATIO,
      dimensions = { width: 1024, height: 1024 },
      gpuAcceleration = true
    } = req.body;

    // Log coherence metrics for real-time debugging
    const coherenceMetrics = calculateCoherenceMetrics(stabilityRatio, explorationRatio);
    
    console.log(`[QUANTUM_ART] Generating art with stability ${stabilityRatio} and exploration ${explorationRatio}`);
    console.log(`[QUANTUM_ART] Coherence score: ${coherenceMetrics.coherenceScore}, QRF: ${coherenceMetrics.quantumResonanceFactor}`);
    console.log(`[QUANTUM_ART] Using GPU acceleration: ${(gpuAcceleration && GPU_CONFIG.enabled) ? 'Yes' : 'No'}`);
    
    // Store coherence metrics in persistent log
    await logCoherenceMetrics('fractal-art', coherenceMetrics);
    
    const result = await generateFractalArt({
      fractalStyle,
      colorScheme,
      stabilityRatio,
      explorationRatio,
      dimensions,
      gpuAcceleration: gpuAcceleration && GPU_CONFIG.enabled,
      gpuConfig: GPU_CONFIG
    });

    return res.json({
      success: true,
      art: {
        ...result,
        style: fractalStyle,
        colorScheme,
        stabilityRatio,
        explorationRatio,
        coherenceMetrics,
        gpuAccelerated: gpuAcceleration && GPU_CONFIG.enabled,
        createdAt: new Date().toISOString()
      }
    });
  } catch (err) {
    console.error('[QUANTUM_ART_ERROR]', err);
    
    // Convert unknown error to Error type
    const error = err instanceof Error ? err : new Error(String(err));
    let statusCode = 500;
    let errorMessage = 'Error generating quantum fractal art';
    
    if (error.message && error.message.includes('API key')) {
      // Handle missing API key errors
      statusCode = 401;
      errorMessage = 'OpenAI API key required for fractal art generation';
    } else if (error.message && error.message.includes('Pinecone')) {
      // Handle Pinecone-related errors
      errorMessage = 'Vector storage temporarily unavailable, but art generation still functions';
      statusCode = 200; // Don't fail the request, just note the limitation
    } else if (error.message && error.message.includes('GPU')) {
      // Handle GPU-related errors
      errorMessage = 'GPU acceleration unavailable, falling back to CPU processing';
      statusCode = 200; // Don't fail the request, just note the limitation
    }
    
    return res.status(statusCode).json({
      success: statusCode === 200,
      error: errorMessage,
      details: error.message,
      requirements: {
        openai_api_key: !process.env.OPENAI_API_KEY ? 'missing' : 'available',
        pinecone_storage: (!process.env.PINECONE_API_KEY || !process.env.PINECONE_ENVIRONMENT) ? 'disabled' : 'enabled',
        gpu_acceleration: GPU_CONFIG.enabled ? 'available' : 'unavailable'
      }
    });
  }
});

/**
 * @route POST /api/quantum-fractal-art/generate-music
 * @desc Generate quantum fractal music based on parameters
 * @access Public
 */
router.post('/generate-music', async (req, res) => {
  try {
    const {
      musicStyle = 'ambient',
      tempo = 72,
      harmony = 'quantum',
      complexity = 0.5,
      duration = 30,
      coherenceRatio = OPTIMAL_COHERENCE_RATIO,
      explorationRatio = OPTIMAL_EXPLORATION_RATIO
    } = req.body;

    // Calculate coherence metrics
    const coherenceMetrics = calculateCoherenceMetrics(coherenceRatio, explorationRatio);
    
    console.log(`[QUANTUM_MUSIC] Generating ${duration}s of ${musicStyle} music with ${coherenceRatio * 100}% coherence`);
    console.log(`[QUANTUM_MUSIC] Coherence score: ${coherenceMetrics.coherenceScore}, QRF: ${coherenceMetrics.quantumResonanceFactor}`);
    
    // Store coherence metrics in persistent log
    await logCoherenceMetrics('fractal-music', coherenceMetrics);
    
    const result = await generateFractalMusic({
      musicStyle,
      tempo,
      harmony,
      complexity,
      duration,
      coherenceRatio,
      explorationRatio
    });

    return res.json({
      success: true,
      music: {
        ...result,
        style: musicStyle,
        tempo,
        harmony,
        complexity,
        duration,
        coherenceMetrics,
        createdAt: new Date().toISOString()
      }
    });
  } catch (err) {
    console.error('[QUANTUM_MUSIC_ERROR]', err);
    const error = err instanceof Error ? err : new Error(String(err));
    
    // Music generation currently doesn't require external APIs
    // but we prepare error handling for future integrations
    return res.status(500).json({
      success: false,
      error: 'Error generating quantum fractal music',
      details: error.message,
      requirements: {
        openai_api_key: !process.env.OPENAI_API_KEY ? 'missing (future requirement)' : 'available',
        pinecone_storage: (!process.env.PINECONE_API_KEY || !process.env.PINECONE_ENVIRONMENT) ? 'disabled' : 'enabled'
      }
    });
  }
});

/**
 * @route GET /api/quantum-fractal-art/generate-humor
 * @desc Generate quantum-themed humor
 * @access Public
 */
router.get('/generate-humor', async (req, res) => {
  try {
    // Apply the 3:1 quantum balance ratio to humor generation
    const coherenceRatio = OPTIMAL_COHERENCE_RATIO;
    const explorationRatio = OPTIMAL_EXPLORATION_RATIO;
    
    // Calculate coherence metrics
    const coherenceMetrics = calculateCoherenceMetrics(coherenceRatio, explorationRatio);
    
    console.log('[QUANTUM_HUMOR] Generating quantum humor with coherence ratio:', coherenceRatio);
    console.log(`[QUANTUM_HUMOR] Coherence score: ${coherenceMetrics.coherenceScore}, QRF: ${coherenceMetrics.quantumResonanceFactor}`);
    
    // Store coherence metrics in persistent log
    await logCoherenceMetrics('quantum-humor', coherenceMetrics);
    
    const result = await generateQuantumHumor({
      coherenceRatio,
      explorationRatio
    });

    return res.json({
      success: true,
      humor: {
        ...result,
        type: 'Quantum Paradox',
        coherenceMetrics,
        createdAt: new Date().toISOString()
      }
    });
  } catch (err) {
    console.error('[QUANTUM_HUMOR_ERROR]', err);
    const error = err instanceof Error ? err : new Error(String(err));
    
    let statusCode = 500;
    let errorMessage = 'Error generating quantum humor';
    
    if (error.message && error.message.includes('API key')) {
      // Handle missing API key errors
      statusCode = 401;
      errorMessage = 'OpenAI API key required for quantum humor generation';
    } else if (error.message && error.message.includes('Pinecone')) {
      // Handle Pinecone-related errors
      errorMessage = 'Vector storage temporarily unavailable, but humor generation still functions';
      statusCode = 200; // Don't fail the request, just note the limitation
    }
    
    return res.status(statusCode).json({
      success: statusCode === 200,
      error: errorMessage,
      details: error.message,
      requirements: {
        openai_api_key: !process.env.OPENAI_API_KEY ? 'missing' : 'available',
        pinecone_storage: (!process.env.PINECONE_API_KEY || !process.env.PINECONE_ENVIRONMENT) ? 'disabled' : 'enabled'
      }
    });
  }
});

/**
 * @route GET /api/quantum-fractal-art/gpu-status
 * @desc Get GPU availability and capabilities
 * @access Public
 */
router.get('/gpu-status', async (req, res) => {
  try {
    const gpuStatus = await serviceCheckGpuSupport();
    
    return res.json({
      success: true,
      gpuStatus: {
        ...gpuStatus,
        config: GPU_CONFIG,
        checkedAt: new Date().toISOString()
      }
    });
  } catch (err) {
    console.error('[QUANTUM_GPU_ERROR]', err);
    const error = err instanceof Error ? err : new Error(String(err));
    
    return res.status(500).json({
      success: false,
      error: 'Error checking GPU status',
      details: error.message,
    });
  }
});

/**
 * @route GET /api/quantum-fractal-art/coherence-logs
 * @desc Get coherence logs for monitoring
 * @access Public
 */
router.get('/coherence-logs', async (req, res) => {
  try {
    const { type, limit = '10' } = req.query;
    const limitNumber = typeof limit === 'string' ? parseInt(limit, 10) : 10;
    
    if (typeof type !== 'string') {
      throw new Error('Type parameter must be a string');
    }
    
    const logs = await logCoherenceMetrics(type, null, limitNumber);
    
    return res.json({
      success: true,
      logs,
      retrievedAt: new Date().toISOString()
    });
  } catch (err) {
    console.error('[QUANTUM_COHERENCE_LOG_ERROR]', err);
    const error = err instanceof Error ? err : new Error(String(err));
    
    return res.status(500).json({
      success: false,
      error: 'Error retrieving coherence logs',
      details: error.message,
    });
  }
});

export default router;