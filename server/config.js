/**
 * System Configuration
 *
 * This file contains system-wide configuration settings for the WiltonOS project.
 * It follows Void-Centered Design principles with explicit boundary definitions
 * between the core system and configurable parameters.
 *
 * BOUNDARY DEFINITION: Configuration values represent the boundary between the
 * internal system behavior and external constraints or preferences.
 *
 * RESPONSIBILITY: Centralizing all configurable system parameters in one location.
 */
import { getDefaultQuantumState } from '../shared/quantum-state-utils.js';
// Current environment (development, test, production)
export var NODE_ENV = process.env.NODE_ENV || 'development';
// Define the system's quantum state (unified context and flow type)
// This replaces the separate REALITY_MODE boolean with a more comprehensive state
export var SYSTEM_QUANTUM_STATE = getDefaultQuantumState(NODE_ENV);
// For backward compatibility - export REALITY_MODE as a computed boolean
// This ensures existing code continues to work during the transition
export var REALITY_MODE = SYSTEM_QUANTUM_STATE.toString().startsWith('REAL_');
// Log level (higher = more verbose)
// 0 = No logging
// 1 = Error only
// 2 = Warn and Error
// 3 = Info, Warn, and Error
// 4 = Debug, Info, Warn, and Error
// 5 = Trace, Debug, Info, Warn, and Error
export var LOG_LEVEL = process.env.LOG_LEVEL ? parseInt(process.env.LOG_LEVEL) : 3;
// Agent concurrency limits to prevent system overload
export var AGENT_CONCURRENCY_LIMITS = {
    // Maximum number of agents that can be active simultaneously
    MAX_CONCURRENT_AGENTS: 8,
    // Maximum number of concurrent tasks per agent
    MAX_TASKS_PER_AGENT: 4,
    // Default timeout for task execution (milliseconds)
    DEFAULT_TASK_TIMEOUT: 30000,
    // Maximum memory usage per agent process (bytes)
    MAX_AGENT_MEMORY: 512 * 1024 * 1024, // 512MB
};
// API endpoint configurations
export var API_ENDPOINTS = {
    // Base URL for API calls
    BASE_URL: process.env.API_BASE_URL || 'http://localhost:5000',
    // Authentication endpoints
    AUTH: {
        LOGIN: '/api/auth/login',
        LOGOUT: '/api/auth/logout',
        REFRESH: '/api/auth/refresh',
    },
    // Task management endpoints
    TASKS: {
        BASE: '/api/tasks',
        CREATE: '/api/tasks/create',
        STATUS: '/api/tasks/status',
        COMPLETE: '/api/tasks/complete',
    },
    // Meta-cognitive system endpoints
    META: {
        EVENTS: '/api/meta/events',
        INSIGHTS: '/api/meta/insights',
        PATTERNS: '/api/meta/patterns',
    },
    // QRN (Quantum Root Node) endpoints
    QRN: {
        BASE: '/api/qrn',
        NODES: '/api/qrn/nodes',
        PATHWAYS: '/api/qrn/pathways',
        RESONANCES: '/api/qrn/resonances',
    },
};
// Simulation-Reality settings
export var SIMULATION_REALITY_CONFIG = {
    // Time between reality mode status checks (milliseconds)
    REALITY_CHECK_INTERVAL: 60000, // 1 minute
    // Number of confirmations required for mode transition
    CONFIRMATIONS_REQUIRED: 2,
    // Cooldown period between transition attempts (milliseconds)
    TRANSITION_COOLDOWN: 3600000, // 1 hour
};
// LLM integration settings
export var LLM_CONFIG = {
    // Default model to use
    DEFAULT_MODEL: 'gpt-4',
    // Temperature setting for generation
    DEFAULT_TEMPERATURE: 0.7,
    // Maximum number of tokens per request
    MAX_TOKENS: 4096,
    // Context window size
    CONTEXT_WINDOW: 16384,
    // Timeout for LLM API calls (milliseconds)
    API_TIMEOUT: 60000, // 1 minute
};
// Persistence settings
export var PERSISTENCE_CONFIG = {
    // Base directory for file system storage
    BASE_DIR: './data',
    // Maximum cache size for in-memory data
    MAX_CACHE_SIZE: 1024, // Items
    // Cache TTL (milliseconds)
    CACHE_TTL: 300000, // 5 minutes
};
// Dynamic agent selection thresholds
export var AGENT_SELECTION_CONFIG = {
    // Complexity thresholds for task classification
    COMPLEXITY_THRESHOLDS: {
        LOW: 0.3,
        MEDIUM: 0.6,
        HIGH: 0.9,
    },
    // Priority levels for task scheduling
    PRIORITY_LEVELS: {
        LOW: 1,
        MEDIUM: 5,
        HIGH: 10,
    },
};
