# OROBORO NEXUS API Contract

This document defines the contract between the frontend (client) and backend (server) for the OROBORO NEXUS system, enabling both to be developed concurrently with a shared understanding.

## Core Principles

1. **RESTful Endpoints**: Standard HTTP methods for CRUD operations
2. **WebSocket Real-time Updates**: For streaming updates through the 0-8 Flow
3. **JSON Payload Format**: All requests and responses use JSON
4. **Authentication**: API keys for external services, session-based auth for users
5. **Error Handling**: Consistent error response format

## API Endpoints

### 1. Process Execution

#### `POST /api/nexus/process`

Initiates the OROBORO NEXUS processing pipeline.

**Request:**
```json
{
  "input": {
    // Any JSON object to be processed
    "stats": {
      "reach": 478000,
      "views": 1600000,
      "engagement": "1.08%"
    },
    "intent": "reasoned"
  },
  "options": {
    "profile": "balanced", // "maximum_savings", "balanced", "maximum_performance"
    "batchable": true,
    "priority": "normal" // "low", "normal", "high", "critical"
  }
}
```

**Response:**
```json
{
  "jobId": "job-123456",
  "status": "processing", // "processing", "completed", "failed"
  "message": "Processing started",
  "estimatedCompletion": "2025-03-26T15:30:00Z"
}
```

### 2. Job Status

#### `GET /api/nexus/jobs/:jobId`

Retrieves the status of a processing job.

**Response:**
```json
{
  "jobId": "job-123456",
  "status": "completed", // "processing", "completed", "failed"
  "progress": {
    "currentStage": "4-Process", // "0-Start", "1-Define", etc.
    "completedStages": ["0-Start", "1-Define", "2-Store", "3-Split"],
    "percentage": 50
  },
  "result": {
    // If completed, contains the result data
  },
  "error": null, // Error message if failed
  "metrics": {
    "startTime": "2025-03-26T15:25:00Z",
    "endTime": "2025-03-26T15:30:00Z",
    "duration": 300000, // milliseconds
    "cost": 0.000225, // USD
    "modelUsed": "GPT-4o-mini",
    "tokensUsed": {
      "input": 150,
      "output": 300,
      "total": 450
    }
  }
}
```

### 3. Model Selection

#### `GET /api/nexus/models`

Retrieves available AI models and their configurations.

**Response:**
```json
{
  "models": [
    {
      "id": "GPT-4o-mini",
      "provider": "openai",
      "capabilities": ["general", "coding"],
      "costs": {
        "inputPer1M": 0.15,
        "outputPer1M": 0.60
      },
      "contextWindow": 16000,
      "available": true
    },
    // Additional models...
  ],
  "defaultModel": "GPT-4o-mini",
  "recommendedModels": {
    "costEffective": "Gemini-1.5-Flash",
    "balanced": "Claude-3.5-Haiku",
    "highPerformance": "GPT-4o"
  }
}
```

### 4. System Status

#### `GET /api/nexus/status`

Retrieves the current system status and metrics.

**Response:**
```json
{
  "status": "active", // "active", "maintenance", "degraded"
  "statistics": {
    "uptime": 1234567, // milliseconds
    "jobsProcessed": 156,
    "costToDate": 0.1456, // USD
    "savingsToDate": 0.3678, // USD compared to using highest-tier models
    "systemStability": 0.95, // 0-1 scale
    "batchSize": 12 // current batch size
  },
  "components": {
    "dynamicModelSelector": "operational",
    "batchProcessor": "operational",
    "semanticCachingSystem": "operational",
    "adaptiveBudgetForecaster": "operational"
  },
  "alerts": [] // Any system alerts or warnings
}
```

### 5. Semantic Cache

#### `GET /api/nexus/cache/stats`

Retrieves statistics about the semantic cache.

**Response:**
```json
{
  "cacheSize": 248, // Number of entries
  "hitRate": 0.76, // Percentage of requests served from cache
  "savingsToDate": 0.1234, // USD saved by cache hits
  "averageSimilarityThreshold": 0.92,
  "mostCachedQueries": [
    {"pattern": "content analysis", "hits": 34},
    {"pattern": "engagement metrics", "hits": 28}
  ]
}
```

## WebSocket Interface

### Connection

Connect to WebSocket endpoint at `/ws/nexus`

### Message Types

1. **Job Updates**

**Server → Client:**
```json
{
  "type": "job_update",
  "jobId": "job-123456",
  "stage": "4-Process",
  "status": "processing",
  "progress": 0.5,
  "timestamp": "2025-03-26T15:28:30Z",
  "metrics": {
    "currentCost": 0.000125,
    "estimatedRemainingCost": 0.000100
  }
}
```

2. **System Metrics**

**Server → Client:**
```json
{
  "type": "system_metrics",
  "timestamp": "2025-03-26T15:28:30Z",
  "metrics": {
    "systemStability": 0.95,
    "nodeSynergy": 0.88,
    "globalCoherence": 0.76,
    "activeJobs": 3,
    "batchSize": 12
  }
}
```

3. **Subscribe to Updates**

**Client → Server:**
```json
{
  "type": "subscribe",
  "topics": ["job_updates", "system_metrics"],
  "jobId": "job-123456" // Optional, for specific job updates
}
```

## Error Format

All error responses follow this format:

```json
{
  "error": {
    "code": "resource_not_found",
    "message": "The requested job could not be found",
    "details": {
      "jobId": "job-123456"
    }
  }
}
```

Common error codes:
- `invalid_request`: Malformed request
- `resource_not_found`: Requested resource doesn't exist
- `authentication_error`: Authentication failure
- `authorization_error`: Permission denied
- `rate_limit_exceeded`: Too many requests
- `service_unavailable`: Service temporarily unavailable
- `internal_error`: Unexpected server error

---

This API contract will serve as the foundation for both frontend and backend development, ensuring consistent communication between the two components.