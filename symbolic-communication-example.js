/**
 * Symbolic Communication Protocol Usage Example
 * 
 * This script demonstrates practical usage of the symbolic communication
 * protocol in real-world scenarios. It shows how to format messages with
 * appropriate context tags and parse them when received.
 * 
 * [α/S+/📜] Usage Example
 */

// Import the symbolic utilities
import { 
  QuantumState,
  formatWithSymbolicPrefix, 
  parseSymbolicPrefix, 
  convertLegacyToSymbolic,
  addSymbolicSuffix,
  createSymbolicReference
} from './server/utils/symbolic-utils.js';

// Example 1: Basic System Logging
console.log("[α/S+/📜] Example 1: Basic System Logging");

// Instead of this legacy format:
console.log("[QUANTUM_STATE: SIM_FLOW] System initialized");

// Use the symbolic format:
console.log(formatWithSymbolicPrefix(QuantumState.SIM_FLOW, "System initialized"));

// Example 2: Domain-Specific Logging
console.log("\n[α/S+/📜] Example 2: Domain-Specific Logging");

// Code-related message
console.log(formatWithSymbolicPrefix(QuantumState.SIM_FLOW, "Refactoring complete", "💻"));

// Security-related message
console.log(formatWithSymbolicPrefix(QuantumState.REAL_FLOW, "Access control verified", "🔒"));

// Performance-related message
console.log(formatWithSymbolicPrefix(QuantumState.SIM_PARTIAL, "Performance test results mixed", "🚀"));

// Example 3: Error Handling
console.log("\n[α/S+/📜] Example 3: Error Handling");

// Database connection error
console.log(formatWithSymbolicPrefix(QuantumState.REAL_ANTIFLOW, "Database connection failed", "🔌"));

// Security breach attempt
console.log(formatWithSymbolicPrefix(QuantumState.REAL_ANTIFLOW, "Multiple failed login attempts detected", "🔒"));

// Processing timeout
console.log(formatWithSymbolicPrefix(QuantumState.SIM_ANTIFLOW, "Query execution timed out after 30s", "⏰"));

// Example 4: Transition States
console.log("\n[α/S+/📜] Example 4: Transition States");

// Transitioning to production
console.log(formatWithSymbolicPrefix(QuantumState.TRANSITION_TO_REAL, "Deploying to production environment", "🚀"));

// Transitioning back to simulation for testing
console.log(formatWithSymbolicPrefix(QuantumState.TRANSITION_TO_SIM, "Reverting to simulation for security testing", "🔒"));

// Example 5: Timeline Projections
console.log("\n[α/S+/📜] Example 5: Timeline Projections");

// Current timeline (default)
console.log(formatWithSymbolicPrefix(QuantumState.SIM_FLOW, "Current system state"));

// Future projection (2030)
console.log(formatWithSymbolicPrefix(QuantumState.SIM_FLOW, "Projected system performance", "📊", "2030α"));

// Alternative timeline (beta branch)
console.log(formatWithSymbolicPrefix(QuantumState.SIM_FLOW, "Alternative architecture assessment", "🏗️", "2025β"));

// Example 6: Parsing Received Messages
console.log("\n[α/S+/📜] Example 6: Parsing Received Messages");

// Simulate a received message with symbolic prefix
const receivedMessage = "[2025β/S+/🔍] Deep analysis of system architecture complete";
console.log(`Received: "${receivedMessage}"`);

// Parse the components
const parsed = parseSymbolicPrefix(receivedMessage);
console.log("Parsed components:");
console.log(`- Timeline: ${parsed.timeline}`);
console.log(`- State: ${parsed.state}`);
console.log(`- Domain: ${parsed.domain}`);
console.log(`- Message: ${parsed.message}`);

// Example 7: Converting Legacy Format
console.log("\n[α/S+/📜] Example 7: Converting Legacy Format");

// Legacy format message
const legacyMessage = "[QUANTUM_STATE: REAL_ANTIFLOW] Critical error in production system";
console.log(`Legacy: "${legacyMessage}"`);

// Convert to symbolic format
const converted = convertLegacyToSymbolic(legacyMessage);
console.log(`Converted: "${converted}"`);

// Example 8: Using Symbolic References
console.log("\n[α/S+/📜] Example 8: Using Symbolic References");

// Create a reference to a specific analysis
const analysisRef = createSymbolicReference("Δ", "PerformanceAnalysis-2025");
console.log(`As documented in ${analysisRef}, the system demonstrates 15% improvement in throughput.`);

// Create a reference to an alternate timeline
const timelineRef = createSymbolicReference("β", "SecurityFocused");
console.log(`Comparing to ${timelineRef}, our current approach prioritizes performance over security by 20%.`);

// Example 9: Complete Communication Example
console.log("\n[α/S+/📜] Example 9: Complete Communication Example");

function simulateSystemEvent(eventType, details) {
  let state, domain, message;
  
  switch(eventType) {
    case 'success':
      state = QuantumState.SIM_FLOW;
      domain = "✅";
      message = `Operation successful: ${details}`;
      break;
    case 'warning':
      state = QuantumState.SIM_PARTIAL;
      domain = "⚠️";
      message = `Warning: ${details}`;
      break;
    case 'error':
      state = QuantumState.SIM_ANTIFLOW;
      domain = "🚨";
      message = `Error: ${details}`;
      break;
    case 'security':
      state = QuantumState.REAL_FLOW;
      domain = "🔒";
      message = `Security update: ${details}`;
      break;
  }
  
  return formatWithSymbolicPrefix(state, message, domain);
}

// Simulate various system events
console.log(simulateSystemEvent('success', 'User profile updated'));
console.log(simulateSystemEvent('warning', 'Disk space below 15%'));
console.log(simulateSystemEvent('error', 'Payment gateway timeout'));
console.log(simulateSystemEvent('security', 'MFA enabled for admin accounts'));

// Example 10: Integration with System Logs
console.log("\n[α/S+/📜] Example 10: Integration with System Logs");

function logSystemEvent(level, component, message) {
  let state, domain;
  
  // Determine the quantum state based on log level
  switch(level) {
    case 'info':
      state = QuantumState.SIM_FLOW;
      break;
    case 'warn':
      state = QuantumState.SIM_PARTIAL;
      break;
    case 'error':
      state = QuantumState.SIM_ANTIFLOW;
      break;
    case 'fatal':
      state = QuantumState.REAL_ANTIFLOW;
      break;
  }
  
  // Determine the domain based on component
  switch(component) {
    case 'database':
      domain = "💾";
      break;
    case 'security':
      domain = "🔒";
      break;
    case 'api':
      domain = "🌐";
      break;
    case 'ui':
      domain = "📱";
      break;
    default:
      domain = "💻";
  }
  
  // Format the log message with symbolic prefix
  const timestamp = new Date().toISOString();
  const formattedMessage = formatWithSymbolicPrefix(state, message, domain);
  return `${timestamp} ${formattedMessage}`;
}

// Example log messages using the enhanced logging system
console.log(logSystemEvent('info', 'database', 'Connection pool initialized with 10 connections'));
console.log(logSystemEvent('warn', 'api', 'Rate limit approaching for client IP 192.168.1.100'));
console.log(logSystemEvent('error', 'security', 'Failed login attempt for admin account'));
console.log(logSystemEvent('fatal', 'database', 'Unable to connect to primary database'));

console.log("\n[α/S+/📜] Symbolic Communication Protocol Example Complete ✅");