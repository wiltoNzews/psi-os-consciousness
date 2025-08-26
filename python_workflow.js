/**
 * WiltonOS Quantum Python Boot-Loader Workflow Configuration
 * 
 * This file sets up a workflow to run the Python boot-loader as a separate process,
 * maintaining the 3:1 quantum balance ratio between Node.js and Python components.
 */

import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import fetch from 'node-fetch';

// Get the directory name using ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const PYTHON_PORT = 5001;
const scriptPath = path.join(__dirname, 'server', 'python', 'quantum_boot_loader.py');

console.log(`[QUANTUM_WORKFLOW: PYTHON_FLOW] Starting Python boot-loader workflow on port ${PYTHON_PORT}`);
console.log(`[QUANTUM_WORKFLOW: PYTHON_FLOW] Script path: ${scriptPath}`);
console.log(`[QUANTUM_WORKFLOW: COHERENCE_FLOW] Initializing with 3:1 quantum balance targeting 75% coherence`);

// Environment variables with DATABASE_URL for PostgreSQL connection
const env = {
  ...process.env,
  PYTHON_PORT: PYTHON_PORT.toString(),
  // Use the DATABASE_URL from the environment for seamless database integration
  DATABASE_URL: process.env.DATABASE_URL
};

// Start Python process with environment variables
const pythonProcess = spawn('python3', [scriptPath], { 
  env,
  stdio: 'inherit' // Pipe all output directly to this process's stdout/stderr
});

// Health check function to verify Python service is running with proper quantum balance
async function performHealthCheck() {
  try {
    console.log(`[QUANTUM_WORKFLOW: MONITORING_FLOW] Performing Python boot-loader health check...`);
    const response = await fetch(`http://localhost:${PYTHON_PORT}/health-check`);
    
    if (response.ok) {
      const healthData = await response.json();
      console.log(`[QUANTUM_WORKFLOW: STATUS_FLOW] Python boot-loader running successfully on port ${PYTHON_PORT}`);
      console.log(`[QUANTUM_WORKFLOW: COHERENCE_FLOW] Quantum balance: ${healthData.quantum_balance.actual_ratio}, status: ${healthData.quantum_balance.status}`);
      
      // Log warning if quantum balance is not optimal
      if (healthData.quantum_balance.status !== "optimal") {
        console.warn(`[QUANTUM_WORKFLOW: WARNING_FLOW] Quantum balance not optimal, current ratio: ${healthData.quantum_balance.actual_ratio}`);
        console.warn(`[QUANTUM_WORKFLOW: COHERENCE_FLOW] Target ratio is 3:1 (75% coherence, 25% exploration)`);
      }
      
      // Check database connection
      if (!healthData.database_connected) {
        console.error(`[QUANTUM_WORKFLOW: ERROR_FLOW] Python service cannot connect to PostgreSQL database`);
        console.error(`[QUANTUM_WORKFLOW: DATABASE_FLOW] Verify DATABASE_URL environment variable is correct`);
      }
      
      return true;
    } else {
      console.error(`[QUANTUM_WORKFLOW: ERROR_FLOW] Health check failed with status: ${response.status}`);
      return false;
    }
  } catch (error) {
    console.error(`[QUANTUM_WORKFLOW: ERROR_FLOW] Health check error: ${error.message}`);
    console.warn(`[QUANTUM_WORKFLOW: COHERENCE_FLOW] Python service may still be starting up, will retry...`);
    return false;
  }
}

// Schedule periodic health checks
let healthCheckAttempts = 0;
const maxHealthCheckAttempts = 10;

// Initial delay before first health check (5 seconds)
setTimeout(async () => {
  const initialCheck = await performHealthCheck();
  
  if (!initialCheck) {
    console.log(`[QUANTUM_WORKFLOW: MONITORING_FLOW] Scheduling follow-up health checks...`);
    
    // Set up recurring health checks if initial check failed
    const healthCheckInterval = setInterval(async () => {
      healthCheckAttempts++;
      
      const success = await performHealthCheck();
      
      if (success) {
        console.log(`[QUANTUM_WORKFLOW: MONITORING_FLOW] Python service verified healthy after ${healthCheckAttempts} attempts`);
        clearInterval(healthCheckInterval);
      } else if (healthCheckAttempts >= maxHealthCheckAttempts) {
        console.error(`[QUANTUM_WORKFLOW: ERROR_FLOW] Max health check attempts (${maxHealthCheckAttempts}) reached without success`);
        console.error(`[QUANTUM_WORKFLOW: COHERENCE_FLOW] Warning: Quantum balance monitoring may not be active`);
        clearInterval(healthCheckInterval);
      }
    }, 5000); // Check every 5 seconds
  }
}, 5000);

// Handle process exit
pythonProcess.on('close', (code) => {
  if (code === 0) {
    console.log(`[QUANTUM_WORKFLOW: PYTHON_FLOW] Python boot-loader exited successfully with code ${code}`);
  } else {
    console.error(`[QUANTUM_WORKFLOW: ERROR_FLOW] Python boot-loader exited with code ${code}`);
    console.error(`[QUANTUM_WORKFLOW: ERROR_FLOW] Quantum balance may have been compromised`);
  }
});

// Handle process error
pythonProcess.on('error', (err) => {
  console.error(`[QUANTUM_WORKFLOW: ERROR_FLOW] Python boot-loader process error: ${err.message}`);
  console.error(`[QUANTUM_WORKFLOW: COHERENCE_FLOW] Warning: Quantum balance ratio may not be maintained at 3:1`);
});

// Log message indicating successful start
console.log('[QUANTUM_WORKFLOW: PYTHON_FLOW] Python boot-loader workflow running');
console.log('[QUANTUM_WORKFLOW: COHERENCE_FLOW] Quantum balance monitoring active');
console.log('[QUANTUM_WORKFLOW: INFO_FLOW] Press Ctrl+C to stop the Python process');