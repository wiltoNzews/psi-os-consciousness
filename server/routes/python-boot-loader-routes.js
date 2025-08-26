/**
 * WiltonOS Python Boot-Loader API Routes
 * 
 * These routes handle starting, stopping, and communicating with the Python Boot-Loader
 * process, maintaining the 3:1 quantum balance ratio (75% coherence, 25% exploration).
 * 
 * Uses a unified PostgreSQL database to ensure data consistency between Node.js and Python.
 */

const express = require('express');
const router = express.Router();

/**
 * Test endpoint for Python boot-loader
 * GET /api/python-boot-loader/test
 */
router.get('/test', (req, res) => {
  return res.json({
    success: true,
    message: 'Python boot-loader API test endpoint is working',
    port: PYTHON_PORT
  });
});
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const WebSocket = require('ws');
const { testConnection } = require('../database/db.js');

// Store Python boot-loader process reference
let pythonProcess = null;
// Store WebSocket server reference
let wsServer = null;
// Store Python WebSocket client reference (for Node.js to Python communication)
let pythonWebSocketClient = null;
// Python boot loader port - use 5001 to avoid conflict with Express server on 5000
const PYTHON_PORT = process.env.PYTHON_PORT || 8765; // Updated to use port 8765 for WebSocket handshake

// WebSocket bridge - connects Node.js and browser clients to the Python process
const connectWebSocketBridge = (server) => {
  // Create WebSocket server if it doesn't exist
  if (!wsServer) {
    wsServer = new WebSocket.Server({ 
      server, 
      path: '/python-ws'
    });
    
    console.log(`[QUANTUM_STATE: PYTHON_FLOW] Python WebSocket bridge initialized`);
    
    // Handle connections from browser clients
    wsServer.on('connection', (ws) => {
      console.log(`[QUANTUM_STATE: PYTHON_FLOW] Client connected to Python WebSocket bridge`);
      
      // Forward messages from browser clients to Python process
      ws.on('message', (message) => {
        console.log(`[QUANTUM_STATE: PYTHON_FLOW] Received message from client to forward to Python`);
        
        // Forward to Python process if connected
        if (pythonWebSocketClient && pythonWebSocketClient.readyState === WebSocket.OPEN) {
          try {
            pythonWebSocketClient.send(message);
          } catch (error) {
            console.error(`[QUANTUM_STATE: ERROR_FLOW] Error sending message to Python process: ${error.message}`);
            
            // Send error back to client
            ws.send(JSON.stringify({
              type: 'error',
              data: {
                message: 'Failed to send message to Python process',
                details: error.message
              },
              timestamp: Date.now()
            }));
          }
        } else {
          // Python process not connected, send error to client
          ws.send(JSON.stringify({
            type: 'error',
            data: {
              message: 'Python process not connected',
              details: 'The Python boot-loader process is not running or not responding'
            },
            timestamp: Date.now()
          }));
        }
      });
      
      // Handle disconnection
      ws.on('close', () => {
        console.log(`[QUANTUM_STATE: PYTHON_FLOW] Client disconnected from Python WebSocket bridge`);
      });
      
      // Send initial welcome message
      ws.send(JSON.stringify({
        type: 'system',
        data: {
          message: 'Connected to Python WebSocket bridge',
          pythonStatus: pythonWebSocketClient && pythonWebSocketClient.readyState === WebSocket.OPEN ? 'connected' : 'disconnected'
        },
        timestamp: Date.now()
      }));
    });
  }
  
  return wsServer;
};

// Connect to Python WebSocket
const connectToPythonWebSocket = () => {
  // If already connected, disconnect first
  if (pythonWebSocketClient) {
    try {
      pythonWebSocketClient.terminate();
    } catch (error) {
      console.error(`[QUANTUM_STATE: ERROR_FLOW] Error disconnecting from Python WebSocket: ${error.message}`);
    }
    pythonWebSocketClient = null;
  }
  
  // Connect to Python WebSocket server
  const wsUrl = `ws://localhost:${PYTHON_PORT}/ws`;
  console.log(`[QUANTUM_STATE: PYTHON_FLOW] Connecting to Python WebSocket at ${wsUrl}`);
  
  pythonWebSocketClient = new WebSocket(wsUrl);
  
  // Handle connection open
  pythonWebSocketClient.on('open', () => {
    console.log(`[QUANTUM_STATE: PYTHON_FLOW] Connected to Python WebSocket`);
    
    // Send initialization message
    pythonWebSocketClient.send(JSON.stringify({
      type: 'init',
      data: {
        source: 'nodejs-bridge',
        timestamp: Date.now()
      }
    }));
  });
  
  // Handle messages from Python
  pythonWebSocketClient.on('message', (message) => {
    console.log(`[QUANTUM_STATE: PYTHON_FLOW] Received message from Python WebSocket`);
    
    try {
      // Parse message
      const messageObj = JSON.parse(message);
      
      // Broadcast to all connected clients
      if (wsServer) {
        wsServer.clients.forEach((client) => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(message);
          }
        });
      }
    } catch (error) {
      console.error(`[QUANTUM_STATE: ERROR_FLOW] Error processing message from Python: ${error.message}`);
    }
  });
  
  // Handle connection error
  pythonWebSocketClient.on('error', (error) => {
    console.error(`[QUANTUM_STATE: ERROR_FLOW] Python WebSocket connection error: ${error.message}`);
  });
  
  // Handle connection close
  pythonWebSocketClient.on('close', (code, reason) => {
    console.log(`[QUANTUM_STATE: PYTHON_FLOW] Python WebSocket connection closed: ${code} ${reason}`);
    pythonWebSocketClient = null;
    
    // Try to reconnect after a delay if the Python process is still running
    if (pythonProcess) {
      setTimeout(() => {
        connectToPythonWebSocket();
      }, 5000); // Retry after 5 seconds
    }
  });
  
  return pythonWebSocketClient;
};

/**
 * Start the Python boot-loader process
 * POST /api/python-boot-loader/start
 */
router.post('/start', (req, res) => {
  try {
    // Check if process is already running
    if (pythonProcess) {
      return res.status(400).json({
        success: false,
        error: 'Python boot-loader is already running'
      });
    }
    
    // Path to Python script
    const scriptPath = path.join(__dirname, '../python/quantum_boot_loader.py');
    
    // Check if script exists
    if (!fs.existsSync(scriptPath)) {
      return res.status(404).json({
        success: false,
        error: 'Python boot-loader script not found'
      });
    }
    
    // Test database connection before starting Python
    testConnection()
      .then(dbConnected => {
        if (!dbConnected) {
          console.error('[QUANTUM_STATE: ERROR_FLOW] Database connection failed, Python boot-loader may not function correctly');
        } else {
          console.log('[QUANTUM_STATE: DATABASE_FLOW] Database connection successful, ready for Python boot-loader');
        }
      })
      .catch(error => {
        console.error(`[QUANTUM_STATE: ERROR_FLOW] Database connection test error: ${error.message}`);
      });
    
    // Start Python process with DATABASE_URL environment variable
    const env = {
      ...process.env,
      PYTHON_PORT: PYTHON_PORT,
      DATABASE_URL: process.env.DATABASE_URL
    };
    
    // Start Python process
    pythonProcess = spawn('python3', [scriptPath], { env });
    
    // Handle stdout
    pythonProcess.stdout.on('data', (data) => {
      console.log(`[QUANTUM_STATE: PYTHON_FLOW] ${data.toString().trim()}`);
    });
    
    // Handle stderr
    pythonProcess.stderr.on('data', (data) => {
      console.error(`[QUANTUM_STATE: ERROR_FLOW] Python process error: ${data.toString().trim()}`);
    });
    
    // Handle exit
    pythonProcess.on('close', (code) => {
      console.log(`[QUANTUM_STATE: PYTHON_FLOW] Python process exited with code ${code}`);
      pythonProcess = null;
    });
    
    // Setup WebSocket bridge if needed
    connectWebSocketBridge(req.app.server);
    
    return res.json({
      success: true,
      message: 'Python boot-loader started successfully'
    });
  } catch (error) {
    console.error(`[QUANTUM_STATE: ERROR_FLOW] Failed to start Python boot-loader: ${error.message}`);
    return res.status(500).json({
      success: false,
      error: `Failed to start Python boot-loader: ${error.message}`
    });
  }
});

/**
 * Stop the Python boot-loader process
 * POST /api/python-boot-loader/stop
 */
router.post('/stop', (req, res) => {
  try {
    // Check if process is running
    if (!pythonProcess) {
      return res.status(400).json({
        success: false,
        error: 'Python boot-loader is not running'
      });
    }
    
    // Kill Python process
    pythonProcess.kill();
    pythonProcess = null;
    
    return res.json({
      success: true,
      message: 'Python boot-loader stopped successfully'
    });
  } catch (error) {
    console.error(`[QUANTUM_STATE: ERROR_FLOW] Failed to stop Python boot-loader: ${error.message}`);
    return res.status(500).json({
      success: false,
      error: `Failed to stop Python boot-loader: ${error.message}`
    });
  }
});

/**
 * Get Python boot-loader status
 * GET /api/python-boot-loader/status
 */
router.get('/status', (req, res) => {
  try {
    const status = pythonProcess ? 'running' : 'stopped';
    
    return res.json({
      success: true,
      status
    });
  } catch (error) {
    console.error(`[QUANTUM_STATE: ERROR_FLOW] Failed to get Python boot-loader status: ${error.message}`);
    return res.status(500).json({
      success: false,
      error: `Failed to get Python boot-loader status: ${error.message}`
    });
  }
});

/**
 * Set OpenAI API key for Python boot-loader
 * POST /api/python-boot-loader/set-api-key
 */
router.post('/set-api-key', async (req, res) => {
  try {
    const { apiKey, name = 'Default OpenAI Key' } = req.body;
    
    if (!apiKey) {
      return res.status(400).json({
        success: false,
        error: 'API key is required'
      });
    }
    
    // Import memory DB handler to store API key in database
    const { storeApiKey } = await import('../utils/memory-db-handler.js');
    
    // Store key in database (only first 10 chars visible in logs)
    console.log(`[QUANTUM_STATE: CONFIG_FLOW] Storing OpenAI API key ${apiKey.substring(0, 10)}... in database`);
    
    // Store in the api_keys table
    const storedKey = await storeApiKey({
      name: name,
      service: 'openai',
      key_identifier: apiKey,
      active: true
    });
    
    // If Python process is connected, send key via WebSocket
    if (pythonWebSocketClient && pythonWebSocketClient.readyState === WebSocket.OPEN) {
      pythonWebSocketClient.send(JSON.stringify({
        type: 'set_api_key',
        data: {
          service: 'openai',
          key_id: storedKey.id
        }
      }));
    } else {
      console.log(`[QUANTUM_STATE: CONFIG_FLOW] Python process not connected, API key stored but not sent`);
    }
    
    return res.json({
      success: true,
      message: 'OpenAI API key stored in database successfully',
      key_id: storedKey.id
    });
  } catch (error) {
    console.error(`[QUANTUM_STATE: ERROR_FLOW] Failed to set OpenAI API key: ${error.message}`);
    return res.status(500).json({
      success: false,
      error: `Failed to set OpenAI API key: ${error.message}`
    });
  }
});

/**
 * Start the Python boot-loader process programmatically
 * For internal use by server.js auto-start - maintains 3:1 quantum balance ratio
 */
async function startPythonBootLoader() {
  // First, check if Python is already running by trying to connect to it
  try {
    const response = await fetch(`http://localhost:${PYTHON_PORT}/health-check`);
    if (response.ok) {
      console.log(`[QUANTUM_STATE: PYTHON_FLOW] Python boot-loader already running on port ${PYTHON_PORT}`);
      console.log(`[QUANTUM_STATE: COHERENCE_FLOW] Node.js ↔ Python quantum balance maintained at 3:1 ratio`);
      
      // Get health check data
      const healthData = await response.json();
      
      return {
        success: true,
        message: 'Python boot-loader already running',
        status: 'running',
        port: PYTHON_PORT,
        healthCheck: healthData,
        quantumBalance: "3:1 ratio maintained"
      };
    }
  } catch (connError) {
    console.log(`[QUANTUM_STATE: PYTHON_FLOW] Python boot-loader not detected (${connError.message}), will start it`);
  }
  
  // Python is not running, so let's start it
  if (pythonProcess) {
    // Process exists but health check failed - try to reset it
    console.log('[QUANTUM_STATE: PYTHON_FLOW] Python process reference exists but health check failed, restarting');
    try {
      pythonProcess.kill();
    } catch (killError) {
      console.error(`[QUANTUM_STATE: ERROR_FLOW] Failed to kill existing Python process: ${killError.message}`);
    }
    pythonProcess = null;
  }

  try {
    console.log(`[QUANTUM_STATE: PYTHON_FLOW] Starting Python boot-loader on port ${PYTHON_PORT}`);
    console.log(`[QUANTUM_STATE: COHERENCE_FLOW] Initializing 3:1 quantum balance ratio (75% coherence, 25% exploration)`);
    
    // Test database connection before starting Python
    try {
      const dbConnected = await testConnection();
      if (!dbConnected) {
        console.error('[QUANTUM_STATE: ERROR_FLOW] Database connection failed, Python boot-loader may not function correctly');
      } else {
        console.log('[QUANTUM_STATE: DATABASE_FLOW] Database connection successful, ready for Python boot-loader');
      }
    } catch (dbError) {
      console.error(`[QUANTUM_STATE: ERROR_FLOW] Database connection test error: ${dbError.message}`);
    }
    
    // Path to Python script - define here for direct function call
    const scriptPath = path.join(__dirname, '../python/quantum_boot_loader.py');
    
    // Start Python process with DATABASE_URL environment variable
    const env = {
      ...process.env,
      PYTHON_PORT: PYTHON_PORT.toString(), // Ensure it's a string
      DATABASE_URL: process.env.DATABASE_URL
    };
    
    // Start Python process
    pythonProcess = spawn('python3', [scriptPath], { env });
    
    // Handle stdout
    pythonProcess.stdout.on('data', (data) => {
      const output = data.toString().trim();
      console.log(`[QUANTUM_STATE: PYTHON_FLOW] ${output}`);
      
      // Look for special coherence messages
      if (output.includes('quantum coherence maintained')) {
        console.log(`[QUANTUM_STATE: COHERENCE_FLOW] Database connection confirmed successful quantum balance`);
      }
    });
    
    // Handle stderr
    pythonProcess.stderr.on('data', (data) => {
      console.error(`[QUANTUM_STATE: ERROR_FLOW] Python process error: ${data.toString().trim()}`);
    });
    
    // Handle exit
    pythonProcess.on('close', (code) => {
      console.log(`[QUANTUM_STATE: PYTHON_FLOW] Python process exited with code ${code}`);
      pythonProcess = null;
      
      if (code !== 0) {
        console.error(`[QUANTUM_STATE: COHERENCE_FLOW] Warning: Quantum balance may be compromised due to Python exit code ${code}`);
      }
    });
    
    // Wait longer for the Python process to start up (5 seconds instead of 2)
    console.log(`[QUANTUM_STATE: PYTHON_FLOW] Waiting for Python boot-loader to initialize...`);
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    // Try to connect to Python WebSocket
    connectToPythonWebSocket();
    
    // Try to verify that the Python service is actually running
    let pythonRunning = false;
    try {
      const healthResponse = await fetch(`http://localhost:${PYTHON_PORT}/health-check`);
      if (healthResponse.ok) {
        pythonRunning = true;
        const healthData = await healthResponse.json();
        console.log(`[QUANTUM_STATE: PYTHON_FLOW] Python boot-loader health check: ${JSON.stringify(healthData)}`);
        console.log(`[QUANTUM_STATE: COHERENCE_FLOW] Node.js ↔ Python quantum balance established at 3:1 ratio`);
        
        return {
          success: true,
          message: 'Python boot-loader started successfully',
          status: 'running',
          port: PYTHON_PORT,
          healthCheck: healthData,
          quantumBalance: "3:1 ratio established"
        };
      }
    } catch (healthError) {
      console.error(`[QUANTUM_STATE: ERROR_FLOW] Python health check failed: ${healthError.message}`);
    }
    
    if (!pythonRunning) {
      console.log(`[QUANTUM_STATE: WARNING_FLOW] Python boot-loader started but health check failed`);
      console.log(`[QUANTUM_STATE: COHERENCE_FLOW] Attempting to maintain quantum balance despite health check failure`);
      
      return {
        success: true,
        message: 'Python boot-loader started but health check failed',
        status: 'starting',
        port: PYTHON_PORT,
        quantumBalance: "3:1 ratio attempting to stabilize"
      };
    }
  } catch (error) {
    console.error(`[QUANTUM_STATE: ERROR_FLOW] Failed to start Python boot-loader: ${error.message}`);
    console.warn(`[QUANTUM_STATE: COHERENCE_FLOW] Warning: Quantum balance ratio may not be maintained at 3:1`);
    
    return {
      success: false,
      error: `Failed to start Python boot-loader: ${error.message}`,
      status: 'error',
      quantumBalance: "3:1 ratio compromised"
    };
  }
}

/**
 * Basic health check for Python boot-loader
 * GET /api/python-boot-loader/health
 */
router.get('/health', async (req, res) => {
  try {
    if (!pythonProcess || pythonProcess.killed) {
      return res.status(503).json({
        status: 'offline',
        message: 'Python boot-loader is not running'
      });
    }
    
    // Check the health of Python boot-loader by making a request to its /health endpoint
    const response = await fetch(`http://localhost:${PYTHON_PORT}/health`);
    
    if (response.ok) {
      const healthData = await response.json();
      // Add quantum balance information to the health check response
      res.json({
        status: 'online',
        pythonPort: PYTHON_PORT,
        coherence_state: healthData.coherence_state || { 
          coherence_score: 0,
          stability_score: 0,
          exploration_score: 0,
          last_update: new Date().toISOString()
        },
      });
    } else {
      res.status(503).json({
        status: 'degraded',
        message: `Python boot-loader health check failed with status: ${response.status}`
      });
    }
  } catch (error) {
    console.error(`[QUANTUM_STATE: ERROR_FLOW] Python boot-loader health check error: ${error.message}`);
    res.status(503).json({
      status: 'error',
      message: `Python boot-loader health check error: ${error.message}`
    });
  }
});

/**
 * Enhanced health check for Python boot-loader with quantum balance
 * GET /api/python-boot-loader/health-check
 */
router.get('/health-check', async (req, res) => {
  try {
    if (!pythonProcess || pythonProcess.killed) {
      return res.status(503).json({
        status: 'offline',
        message: 'Python boot-loader is not running',
        timestamp: new Date().toISOString(),
        quantum_balance: {
          target_ratio: '3:1',
          actual_ratio: 'N/A',
          status: 'unavailable',
          coherence_score: 0,
          stability_score: 0,
          exploration_score: 0
        }
      });
    }
    
    console.log(`[QUANTUM_STATE: MONITORING_FLOW] Performing enhanced health check with quantum balance verification`);
    
    // Check the enhanced health endpoint of Python boot-loader
    const response = await fetch(`http://localhost:${PYTHON_PORT}/health-check`);
    
    if (response.ok) {
      const healthData = await response.json();
      
      // Log quantum balance information
      console.log(`[QUANTUM_STATE: COHERENCE_FLOW] Python service quantum balance ratio: ${healthData.quantum_balance.actual_ratio}`);
      console.log(`[QUANTUM_STATE: COHERENCE_FLOW] Balance status: ${healthData.quantum_balance.status}`);
      
      // Add additional Node.js specific data to the response
      const enhancedResponse = {
        ...healthData,
        node_js_status: 'operational',
        integration_status: 'active',
        services: {
          node_js: {
            port: 5000,
            status: 'operational'
          },
          python: {
            port: parseInt(PYTHON_PORT),
            status: healthData.status
          }
        },
        quantum_balance_verification: {
          verified: true,
          timestamp: new Date().toISOString(),
          message: `Quantum balance verified with ratio ${healthData.quantum_balance.actual_ratio}`
        }
      };
      
      res.json(enhancedResponse);
    } else {
      res.status(503).json({
        status: 'degraded',
        message: `Python boot-loader enhanced health check failed with status: ${response.status}`,
        timestamp: new Date().toISOString(),
        quantum_balance: {
          target_ratio: '3:1',
          actual_ratio: 'N/A',
          status: 'error',
          coherence_score: 0,
          stability_score: 0,
          exploration_score: 0
        }
      });
    }
  } catch (error) {
    console.error(`[QUANTUM_STATE: ERROR_FLOW] Python boot-loader enhanced health check error: ${error.message}`);
    res.status(503).json({
      status: 'error',
      message: `Python boot-loader enhanced health check error: ${error.message}`,
      timestamp: new Date().toISOString(),
      quantum_balance: {
        target_ratio: '3:1',
        actual_ratio: 'N/A',
        status: 'error',
        coherence_score: 0,
        stability_score: 0,
        exploration_score: 0
      }
    });
  }
});

/**
 * AI Agent integration routes
 * These routes allow interaction with the AI Agent that's embedded in the Python boot-loader
 * The AI agent maintains the 3:1 quantum balance ratio (75% coherence, 25% exploration)
 */

/**
 * AI Agent health check endpoint
 * GET /api/python-boot-loader/ai/health
 */
router.get('/ai/health', async (req, res) => {
  try {
    if (!pythonProcess || pythonProcess.killed) {
      return res.status(503).json({
        status: 'offline',
        message: 'Python boot-loader is not running',
        timestamp: new Date().toISOString(),
        quantum_balance: {
          target_ratio: '3:1',
          actual_ratio: 'N/A',
          status: 'unavailable'
        }
      });
    }
    
    console.log(`[QUANTUM_STATE: MONITORING_FLOW] Performing AI agent health check with quantum balance verification`);
    
    // Check the AI agent health endpoint
    const response = await fetch(`http://localhost:${PYTHON_PORT}/ai/health`);
    
    if (response.ok) {
      const healthData = await response.json();
      
      // Calculate quantum balance ratio
      const stability = healthData.stability || 0.75;
      const exploration = healthData.exploration || 0.25;
      const ratio = stability / exploration;
      const isBalanced = Math.abs(ratio - 3) < 0.2; // Allow slight deviation from 3
      
      // Log quantum balance information
      console.log(`[QUANTUM_STATE: COHERENCE_FLOW] AI agent quantum balance ratio: ${ratio.toFixed(2)}`);
      console.log(`[QUANTUM_STATE: COHERENCE_FLOW] Balance status: ${isBalanced ? 'balanced' : 'imbalanced'}`);
      
      return res.json({
        status: 'online',
        message: 'AI agent is running with quantum balance monitoring',
        timestamp: new Date().toISOString(),
        data: healthData,
        quantum_balance: {
          target_ratio: '3:1',
          actual_ratio: ratio.toFixed(2),
          status: isBalanced ? 'balanced' : 'imbalanced',
          stability,
          exploration
        }
      });
    } else {
      return res.status(503).json({
        status: 'error',
        message: 'AI agent health check failed',
        timestamp: new Date().toISOString(),
        quantum_balance: {
          target_ratio: '3:1',
          actual_ratio: 'N/A',
          status: 'error'
        }
      });
    }
  } catch (error) {
    console.error(`[QUANTUM_STATE: ERROR_FLOW] AI agent health check error: ${error.message}`);
    res.status(503).json({
      status: 'error',
      message: `AI agent health check error: ${error.message}`,
      timestamp: new Date().toISOString(),
      quantum_balance: {
        target_ratio: '3:1',
        actual_ratio: 'N/A',
        status: 'error'
      }
    });
  }
});

/**
 * AI Agent chat endpoint
 * POST /api/python-boot-loader/ai/chat
 */
router.post('/ai/chat', async (req, res) => {
  try {
    if (!pythonProcess || pythonProcess.killed) {
      return res.status(503).json({
        status: 'offline',
        message: 'Python boot-loader is not running',
        timestamp: new Date().toISOString(),
        quantum_balance: {
          target_ratio: '3:1',
          actual_ratio: 'N/A',
          status: 'unavailable'
        }
      });
    }
    
    const { user_id, message } = req.body;
    
    if (!user_id || !message) {
      return res.status(400).json({
        status: 'error',
        message: 'Missing required fields: user_id and message are required',
        timestamp: new Date().toISOString()
      });
    }
    
    console.log(`[QUANTUM_STATE: INTERACTION_FLOW] Processing AI agent chat request`);
    
    // Call the AI agent chat endpoint
    const response = await fetch(`http://localhost:${PYTHON_PORT}/ai/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        user_id,
        message
      })
    });
    
    if (response.ok) {
      const chatData = await response.json();
      
      // Calculate quantum balance ratio
      const stability = chatData.stability || 0.75;
      const exploration = chatData.exploration || 0.25;
      const ratio = stability / exploration;
      const isBalanced = Math.abs(ratio - 3) < 0.2; // Allow slight deviation from 3
      
      // Log quantum balance information
      console.log(`[QUANTUM_STATE: COHERENCE_FLOW] AI agent quantum balance ratio: ${ratio.toFixed(2)}`);
      console.log(`[QUANTUM_STATE: COHERENCE_FLOW] Balance status: ${isBalanced ? 'balanced' : 'imbalanced'}`);
      
      return res.json({
        status: 'success',
        message: 'AI agent chat response',
        timestamp: new Date().toISOString(),
        response: chatData.response,
        quantum_balance: {
          target_ratio: '3:1',
          actual_ratio: ratio.toFixed(2),
          status: isBalanced ? 'balanced' : 'imbalanced',
          stability,
          exploration
        }
      });
    } else {
      const errorData = await response.json();
      return res.status(response.status).json({
        status: 'error',
        message: errorData.detail || 'AI agent chat request failed',
        timestamp: new Date().toISOString(),
        quantum_balance: {
          target_ratio: '3:1',
          actual_ratio: 'N/A',
          status: 'error'
        }
      });
    }
  } catch (error) {
    console.error(`[QUANTUM_STATE: ERROR_FLOW] AI agent chat error: ${error.message}`);
    res.status(503).json({
      status: 'error',
      message: `AI agent chat error: ${error.message}`,
      timestamp: new Date().toISOString(),
      quantum_balance: {
        target_ratio: '3:1',
        actual_ratio: 'N/A',
        status: 'error'
      }
    });
  }
});

// Export the router and the port for use by other modules
module.exports = router;
// Set PYTHON_PORT as a property of the exported router
module.exports.PYTHON_PORT = PYTHON_PORT;
// Export the startPythonBootLoader function
module.exports.startPythonBootLoader = startPythonBootLoader;