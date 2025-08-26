/**
 * WiltonOS Python Boot Loader Test Script
 * 
 * This script tests the Python boot-loader capabilities without
 * the interference of the frontend application.
 */

import http from 'http';
import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current file directory with ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Python boot loader port - use 5001 to avoid conflict with Express server on 5000
const PYTHON_PORT = process.env.PYTHON_PORT || 5001;

console.log(`[TEST] Python boot-loader port: ${PYTHON_PORT}`);

// Check if Python script exists
const scriptPath = path.join(__dirname, 'server/python/quantum_boot_loader.py');
console.log(`[TEST] Looking for Python script at: ${scriptPath}`);

if (!fs.existsSync(scriptPath)) {
  console.error(`[TEST ERROR] Python boot-loader script not found at ${scriptPath}`);
  process.exit(1);
}

console.log(`[TEST] Python boot-loader script found at ${scriptPath}`);

// Start Python process with DATABASE_URL environment variable
const env = {
  ...process.env,
  PYTHON_PORT: PYTHON_PORT,
  DATABASE_URL: process.env.DATABASE_URL
};

console.log(`[TEST] Starting Python process with database URL: ${process.env.DATABASE_URL ? 'Available' : 'Not available'}`);
console.log(`[TEST] Starting Python process with port: ${PYTHON_PORT}`);

// Start Python process
const pythonProcess = spawn('python3', [scriptPath], { env });

// Handle stdout
pythonProcess.stdout.on('data', (data) => {
  console.log(`[PYTHON] ${data.toString().trim()}`);
});

// Handle stderr
pythonProcess.stderr.on('data', (data) => {
  console.error(`[PYTHON ERROR] ${data.toString().trim()}`);
});

// Handle exit
pythonProcess.on('close', (code) => {
  console.log(`[TEST] Python process exited with code ${code}`);
  process.exit(code);
});

// Wait for a while to let Python start up
setTimeout(() => {
  console.log(`[TEST] Waiting for Python boot-loader to start up...`);
  
  // Test connection to Python boot-loader
  const testConnection = () => {
    console.log(`[TEST] Testing connection to Python boot-loader at http://localhost:${PYTHON_PORT}`);
    
    http.get(`http://localhost:${PYTHON_PORT}`, (res) => {
      let data = '';
      
      // A chunk of data has been received
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      // The whole response has been received
      res.on('end', () => {
        console.log(`[TEST] Python boot-loader responded with status code: ${res.statusCode}`);
        console.log(`[TEST] Response data: ${data}`);
        console.log(`[TEST] Connection test successful!`);
      });
      
    }).on('error', (err) => {
      console.error(`[TEST ERROR] Failed to connect to Python boot-loader: ${err.message}`);
      console.log(`[TEST] Will retry in 5 seconds...`);
      
      setTimeout(testConnection, 5000);
    });
  };
  
  // Start testing the connection
  testConnection();
  
}, 3000);

// Handle Ctrl+C to kill Python process
process.on('SIGINT', () => {
  console.log(`[TEST] Received SIGINT, killing Python process...`);
  pythonProcess.kill();
  process.exit(0);
});

console.log(`[TEST] Test script running, waiting for Python boot-loader to start...`);