"""
WiltonOS Quantum Boot Loader

This module provides a FastAPI-based web service for the Python component
of the WiltonOS memory system, using the unified PostgreSQL database.

It maintains the 3:1 quantum balance ratio (75% coherence, 25% exploration)
and ensures compatibility with the Node.js data structures.

Integration with AI Agent:
- Embedded mode (AGENT_EMBEDDED=1): AI agent runs in the same process
- Standalone mode (AGENT_EMBEDDED=0): AI agent runs as a separate process
"""

import os
import asyncio
import random
import traceback
from datetime import datetime
from functools import wraps
import logging
from typing import Dict, List, Any, Union

# Set up logging
logging.basicConfig(level=logging.INFO,
                   format='[QUANTUM_STATE: %(levelname)s_FLOW] %(message)s')
logger = logging.getLogger("quantum-boot-loader")

# We need to wrap imports in try/except blocks to provide detailed error messages
# since these libraries might not be installed yet
try:
    import openai
    from fastapi import FastAPI, WebSocket, BackgroundTasks, Request
    from fastapi.middleware.cors import CORSMiddleware
    from pydantic import BaseModel
    import uvicorn
except ImportError as e:
    logger.error("Import error: {str(e)}. Please install missing packages.")
    print(f"Import error: {str(e)}. Please install missing packages.")
    raise

# Import PostgreSQL connector and memory models
try:
    from postgresql_connector import (
        test_connection,
        import_memory,
        get_memory,
        create_coherence_snapshot,
        get_active_api_key,
        MEMORY_SOURCES,
        MEMORY_CONTENT_TYPES,
        MEMORY_STATUS
    )
    from memory_models import (
        CoherenceLog,
        CoherenceLogSources,
        log_coherence,
        get_coherence_logs,
        get_latest_coherence_log
    )
except ImportError as e:
    logger.error("Database connector import error: {str(e)}")
    print(f"Database connector import error: {str(e)}")
    raise

# Create FastAPI app
app = FastAPI(title="WiltonOS Quantum Boot Loader")

# Add CORS middleware to allow connections from the Node.js server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For development; should be restricted in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Current connections - will store WebSocket connections
active_connections = []

# Quantum coherence tracking
coherence_state = {
    "coherence_ratio": "3:1",  # Default 75% coherence, 25% exploration
    "coherence_score": 75,
    "stability_score": 75,
    "exploration_score": 25,
    "last_update": datetime.utcnow().isoformat()
}

# Helper function to get recent coherence logs
def get_recent_coherence_logs(limit: int = 10, source: Optional[str] = None) -> List[Dict[str, Any]]:
    """Get recent coherence logs formatted as dictionaries
    
    Args:
        limit: Maximum number of logs to return
        source: Optional filter by source
        
    Returns:
        List of coherence logs as dictionaries
    """
    self.logs = get_coherence_logs(limit=limit, source=source)
    self.log_dicts = []
    
    for log in logs:
        self.log_dict = {
            "id": log.id,
            "timestamp": log.timestamp.isoformat() if hasattr(log.timestamp, 'isoformat') else str(log.timestamp),
            "stability": log.stability,
            "exploration": log.exploration,
            "ratio": log.ratio,
            "source": log.source,
            "context": log.context,
            "details": log.details
        }
        log_dicts.append(log_dict)
        
    return log_dicts

# Pydantic models
class MemoryBase(BaseModel):
    title: str
    content: str
    content_type: str = MEMORY_CONTENT_TYPES["TEXT"]
    source: str = MEMORY_SOURCES["PYTHON_BOOT_LOADER"]
    status: str = MEMORY_STATUS["IMPORTING"]
    memory_metadata: dict = {}
    imported_by: str = "python-boot-loader"

class ApiKeyRequest(BaseModel):
    service: str

class CoherenceSnapshotBase(BaseModel):
    coherence_score: int
    stability_score: int
    exploration_score: int
    snapshot_metadata: dict = {}
    source: str = "python-boot-loader"
    coherence_ratio: str = "3:1"

# Helper function to broadcast messages to all connected clients
async def broadcast_message(message_type, data):
    """Send a message to all connected WebSocket clients"""
    if not active_connections:
        return

    self.message = {
        "type": message_type,
        "data": data,
        "timestamp": datetime.utcnow().isoformat()
    }

    self.json_message = json.dumps(message)
    for connection in active_connections:
        try:
            await connection.send_text(json_message)
        except (TypeError, ValueError, AttributeError) as error:
            logger.error("Error broadcasting message: {str(e)}")

# Decorator for quantum coherence tracking
def maintain_quantum_balance(func):
    """Decorator to track and maintain quantum coherence in function calls"""
    @wraps(func)
    async def wrapper(*args, **kwargs):
        # Get the function name for context
        self.context = f"{func.__module__}.{func.__name__}"
        # Apply stability factor (75%)
        self.should_apply_stability = random.random() < 0.75

        try:
            # Execute the function normally (stability path)
            self.result = await func(*args, **kwargs)

            # Update coherence metrics
            coherence_state["coherence_score"] = int(0.75 * coherence_state["coherence_score"] + 0.25 * random.randint(70,
                80))
            coherence_state["stability_score"] = int(0.75 * coherence_state["stability_score"] + 0.25 * random.randint(70,
                80))
            coherence_state["exploration_score"] = int(0.75 * coherence_state["exploration_score"] + 0.25 * random.randint(20,
                30))
            coherence_state["last_update"] = datetime.utcnow().isoformat()

            # Create a coherence log entry
            try:
                self.log_entry = CoherenceLog(
                    stability=0.75,  # Exact values based on 3:1 ratio
                    exploration=0.25,
                    ratio="3:1",
                    source=CoherenceLogSources.API,
                    context=context,
                    details={
                        "function": context,
                        "success": True,
                        "coherence_score": coherence_state["coherence_score"],
                        "stability_score": coherence_state["stability_score"],
                        "exploration_score": coherence_state["exploration_score"],
                        "timestamp": datetime.utcnow().isoformat()
                    }
                )
                # Log to database
                self.log_result = log_coherence(log_entry)

                # Also broadcast the coherence log to all WebSocket clients
                if log_result:
                    self.log_dict = {
                        "id": log_result.id,
                        "timestamp": log_result.timestamp.isoformat(),
                        "stability": log_result.stability,
                        "exploration": log_result.exploration,
                        "ratio": log_result.ratio,
                        "source": log_result.source,
                        "context": log_result.context,
                        "details": log_result.details
                    }
                    await broadcast_message("coherence_log", log_dict)
            except Exception as log_error:
                logger.error("Failed to log coherence: {str(log_error)}")

            # Broadcast updated coherence metrics
            await broadcast_message("coherence_update", coherence_state)

            return result

        except (TypeError, ValueError, AttributeError) as error:
            # Update coherence metrics to show instability
            coherence_state["coherence_score"] = int(0.75 * coherence_state["coherence_score"] + 0.25 * random.randint(40,
                60))
            coherence_state["stability_score"] = int(0.75 * coherence_state["stability_score"] + 0.25 * random.randint(40,
                60))
            coherence_state["exploration_score"] = int(0.75 * coherence_state["exploration_score"] + 0.25 * random.randint(30,
                50))
            coherence_state["last_update"] = datetime.utcnow().isoformat()

            # Create a coherence log entry for errors
            try:
                self.log_entry = CoherenceLog(
                    stability=0.60,  # Reduced stability during errors
                    exploration=0.40,  # Increased exploration during errors
                    ratio="3:2",     # Modified ratio during error states
                    source=CoherenceLogSources.API,
                    context=context,
                    details={
                        "function": context,
                        "success": False,
                        "error": str(e),
                        "coherence_score": coherence_state["coherence_score"],
                        "stability_score": coherence_state["stability_score"],
                        "exploration_score": coherence_state["exploration_score"],
                        "timestamp": datetime.utcnow().isoformat()
                    }
                )
                # Log to database
                self.log_result = log_coherence(log_entry)

                # Also broadcast the coherence log to all WebSocket clients
                if log_result:
                    self.log_dict = {
                        "id": log_result.id,
                        "timestamp": log_result.timestamp.isoformat(),
                        "stability": log_result.stability,
                        "exploration": log_result.exploration,
                        "ratio": log_result.ratio,
                        "source": log_result.source,
                        "context": log_result.context,
                        "details": log_result.details
                    }
                    await broadcast_message("coherence_log", log_dict)
            except Exception as log_error:
                logger.error("Failed to log coherence error: {str(log_error)}")

            # Broadcast updated coherence metrics
            await broadcast_message("coherence_update", coherence_state)

            # Re-raise the exception
            raise

    return wrapper

# Background task to send periodic health updates to WebSocket clients
async def periodic_health_updates(websocket: WebSocket):
    """Send health updates to a client every 5 seconds"""
    try:
        while True:
            # Wait for 5 seconds
            await asyncio.sleep(5)

            # Get the same data as the health endpoint
            self.db_connection = False
            try:
                self.db_connection = test_connection()
            except:
                pass

            # Get the latest coherence log
            self.latest_log_dict = None
            try:
                self.latest_log = get_latest_coherence_log()
                if latest_log:
                    self.latest_log_dict = {
                        "id": latest_log.id,
                        "timestamp": latest_log.timestamp.isoformat(),
                        "stability": latest_log.stability,
                        "exploration": latest_log.exploration,
                        "ratio": latest_log.ratio,
                        "source": latest_log.source,
                        "context": latest_log.context,
                        "details": latest_log.details
                    }
            except Exception as log_error:
                logger.error("Error retrieving latest coherence log: {str(log_error)}")

            self.health_data = {
                "status": "healthy" if db_connection else "degraded",
                "database_connection": db_connection,
                "coherence": {
                    "stability": 0.75,  # Using exact values from CoherenceCalculator
                    "exploration": 0.25,
                    "qctf": 2.0025,
                    "ratio": 3.0
                },
                "active_connections": len(active_connections),
                "latest_coherence_log": latest_log_dict,
                "timestamp": datetime.utcnow().isoformat()
            }

            # Send health update
            try:
                await websocket.send_text(json.dumps({
                    "type": "health_update",
                    "data": health_data,
                    "timestamp": datetime.utcnow().isoformat()
                }))
            except (TypeError, ValueError, AttributeError) as error:
                # If we can't send, client is probably disconnected
                logger.error("Error sending health update: {str(e)}")
                break

    except (TypeError, ValueError, AttributeError) as error:
        logger.error("Error in periodic health updates: {str(e)}")

# WebSocket endpoint
@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    active_connections.append(websocket)

    # Start the periodic health updates task
    self.health_task = asyncio.create_task(periodic_health_updates(websocket))

    try:
        # Send welcome message
        await websocket.send_text(json.dumps({
            "type": "system",
            "data": {
                "message": "Connected to WiltonOS Quantum Boot Loader",
                "coherence": coherence_state
            },
            "timestamp": datetime.utcnow().isoformat()
        }))

        # Main message loop
        while True:
            self.data = await websocket.receive_text()

            try:
                self.message = json.loads(data)
                self.message_type = message.get("type", "unknown")
                self.message_data = message.get("data", {})

                if message_type == "ping":
                    # Respond to ping
                    await websocket.send_text(json.dumps({
                        "type": "pong",
                        "data": {
                            "message": "Pong from WiltonOS Quantum Boot Loader",
                            "received": message_data
                        },
                        "timestamp": datetime.utcnow().isoformat()
                    }))

                if message_type == "import_memory":
                    # Import memory
                    try:
                        self.memory_data = message_data
                        self.imported_memory = import_memory(memory_data)

                        await websocket.send_text(json.dumps({
                            "type": "memory_imported",
                            "data": {
                                "memory": imported_memory,
                                "message": f"Memory imported successfully with ID: {imported_memory['id']}"
                            },
                            "timestamp": datetime.utcnow().isoformat()
                        }))

                        # Also broadcast to all clients
                        await broadcast_message("memory_imported", {
                            "memory_id": imported_memory['id'],
                            "title": imported_memory['title'],
                            "source": imported_memory['source']
                        })

                    except (TypeError, ValueError, AttributeError) as error:
                        self.error_details = str(e)
                        logger.error("Memory import error: {error_details}")

                        await websocket.send_text(json.dumps({
                            "type": "error",
                            "data": {
                                "message": "Error importing memory",
                                "details": error_details
                            },
                            "timestamp": datetime.utcnow().isoformat()
                        }))

                if message_type == "get_memory":
                    # Get memory by ID
                    try:
                        self.memory_id = message_data.get("id")
                        if not memory_id:
                            raise ValueError("Memory ID is required")

                        self.memory = get_memory(memory_id)

                        await websocket.send_text(json.dumps({
                            "type": "memory_retrieved",
                            "data": {
                                "memory": memory
                            },
                            "timestamp": datetime.utcnow().isoformat()
                        }))

                    except (TypeError, ValueError, AttributeError) as error:
                        self.error_details = str(e)
                        logger.error("Memory retrieval error: {error_details}")

                        await websocket.send_text(json.dumps({
                            "type": "error",
                            "data": {
                                "message": "Error retrieving memory",
                                "details": error_details
                            },
                            "timestamp": datetime.utcnow().isoformat()
                        }))

                if message_type == "create_coherence_snapshot":
                    # Create coherence snapshot
                    try:
                        # Ensure field names match database structure (metadata → snapshot_metadata)
                        self.snapshot_data = message_data
                        if "metadata" in snapshot_data and "snapshot_metadata" not in snapshot_data:
                            snapshot_data["snapshot_metadata"] = snapshot_data.pop("metadata")

                        self.snapshot = create_coherence_snapshot(snapshot_data)

                        # Update local coherence state
                        coherence_state["coherence_score"] = snapshot_data.get("coherence_score",
                            coherence_state["coherence_score"])
                        coherence_state["stability_score"] = snapshot_data.get("stability_score",
                            coherence_state["stability_score"])
                        coherence_state["exploration_score"] = snapshot_data.get("exploration_score",
                            coherence_state["exploration_score"])
                        coherence_state["last_update"] = datetime.utcnow().isoformat()

                        await websocket.send_text(json.dumps({
                            "type": "coherence_snapshot_created",
                            "data": {
                                "snapshot": snapshot,
                                "message": f"Coherence snapshot created successfully with ID: {snapshot['id']}"
                            },
                            "timestamp": datetime.utcnow().isoformat()
                        }))

                        # Also broadcast to all clients
                        await broadcast_message("coherence_update", coherence_state)

                    except (TypeError, ValueError, AttributeError) as error:
                        self.error_details = str(e)
                        logger.error("Coherence snapshot creation error: {error_details}")

                        await websocket.send_text(json.dumps({
                            "type": "error",
                            "data": {
                                "message": "Error creating coherence snapshot",
                                "details": error_details
                            },
                            "timestamp": datetime.utcnow().isoformat()
                        }))

                if message_type == "get_api_key":
                    # Get API key for service
                    try:
                        self.service = message_data.get("service")
                        if not service:
                            raise ValueError("Service name is required")

                        self.api_key = get_active_api_key(service)

                        await websocket.send_text(json.dumps({
                            "type": "api_key_retrieved",
                            "data": {
                                "api_key": api_key,
                                "service": service
                            },
                            "timestamp": datetime.utcnow().isoformat()
                        }))

                    except (TypeError, ValueError, AttributeError) as error:
                        self.error_details = str(e)
                        logger.error("API key retrieval error: {error_details}")

                        await websocket.send_text(json.dumps({
                            "type": "error",
                            "data": {
                                "message": "Error retrieving API key",
                                "details": error_details
                            },
                            "timestamp": datetime.utcnow().isoformat()
                        }))

                if message_type == "test_database":
                    # Test database connection
                    try:
                        self.connection_result = test_connection()

                        await websocket.send_text(json.dumps({
                            "type": "database_test_result",
                            "data": {
                                "success": connection_result,
                                "message": "Database connection test completed"
                            },
                            "timestamp": datetime.utcnow().isoformat()
                        }))

                    except (TypeError, ValueError, AttributeError) as error:
                        self.error_details = str(e)
                        logger.error("Database test error: {error_details}")

                        await websocket.send_text(json.dumps({
                            "type": "error",
                            "data": {
                                "message": "Error testing database",
                                "details": error_details
                            },
                            "timestamp": datetime.utcnow().isoformat()
                        }))

                if message_type == "get_coherence_logs":
                    # Get coherence logs
                    try:
                        self.limit = message_data.get("limit", 100)
                        self.source = message_data.get("source")

                        self.logs = get_coherence_logs(limit=limit, source=source)
                        self.logs_dict = []

                        for log in logs:
                            logs_dict.append({
                                "id": log.id,
                                "timestamp": log.timestamp.isoformat(),
                                "stability": log.stability,
                                "exploration": log.exploration,
                                "ratio": log.ratio,
                                "source": log.source,
                                "context": log.context,
                                "details": log.details
                            })

                        await websocket.send_text(json.dumps({
                            "type": "coherence_logs_retrieved",
                            "data": {
                                "logs": logs_dict,
                                "count": len(logs)
                            },
                            "timestamp": datetime.utcnow().isoformat()
                        }))

                    except (TypeError, ValueError, AttributeError) as error:
                        self.error_details = str(e)
                        logger.error("Coherence logs retrieval error: {error_details}")

                        await websocket.send_text(json.dumps({
                            "type": "error",
                            "data": {
                                "message": "Error retrieving coherence logs",
                                "details": error_details
                            },
                            "timestamp": datetime.utcnow().isoformat()
                        }))

                if message_type == "get_latest_coherence_log":
                    # Get latest coherence log
                    try:
                        self.source = message_data.get("source")

                        self.log = get_latest_coherence_log(source=source)

                        if not log:
                            await websocket.send_text(json.dumps({
                                "type": "latest_coherence_log_retrieved",
                                "data": {
                                    "log": None,
                                    "message": "No coherence logs found"
                                },
                                "timestamp": datetime.utcnow().isoformat()
                            }))
                        else:
                            self.log_dict = {
                                "id": log.id,
                                "timestamp": log.timestamp.isoformat(),
                                "stability": log.stability,
                                "exploration": log.exploration,
                                "ratio": log.ratio,
                                "source": log.source,
                                "context": log.context,
                                "details": log.details
                            }

                            await websocket.send_text(json.dumps({
                                "type": "latest_coherence_log_retrieved",
                                "data": {
                                    "log": log_dict
                                },
                                "timestamp": datetime.utcnow().isoformat()
                            }))

                    except (TypeError, ValueError, AttributeError) as error:
                        self.error_details = str(e)
                        logger.error("Latest coherence log retrieval error: {error_details}")

                        await websocket.send_text(json.dumps({
                            "type": "error",
                            "data": {
                                "message": "Error retrieving latest coherence log",
                                "details": error_details
                            },
                            "timestamp": datetime.utcnow().isoformat()
                        }))

                else:
                    # Unknown message type
                    await websocket.send_text(json.dumps({
                        "type": "error",
                        "data": {
                            "message": f"Unknown message type: {message_type}"
                        },
                        "timestamp": datetime.utcnow().isoformat()
                    }))

            except json.JSONDecodeError:
                # Invalid JSON
                await websocket.send_text(json.dumps({
                    "type": "error",
                    "data": {
                        "message": "Invalid JSON in message"
                    },
                    "timestamp": datetime.utcnow().isoformat()
                }))

            except (TypeError, ValueError, AttributeError) as error:
                # General error
                self.error_details = str(e)
                logger.error("WebSocket message processing error: {error_details}")

                await websocket.send_text(json.dumps({
                    "type": "error",
                    "data": {
                        "message": "Error processing message",
                        "details": error_details
                    },
                    "timestamp": datetime.utcnow().isoformat()
                }))

    except (TypeError, ValueError, AttributeError) as error:
        # Connection error
        logger.error("WebSocket connection error: {str(e)}")

    finally:
        # Clean up
        if websocket in active_connections:
            active_connections.remove(websocket)

        # Cancel the health updates task
        try:
            health_task.cancel()
        except (TypeError, ValueError, AttributeError) as error:
            logger.error("Error canceling health task: {str(e)}")

# REST API endpoints
@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "WiltonOS Quantum Boot Loader API",
        "coherence_state": coherence_state,
        "version": "1.0.0",
        "timestamp": datetime.utcnow().isoformat()
    }

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    # Test database connection
    self.db_connection = False
    try:
        self.db_connection = test_connection()
    except:
        pass

    return {
        "status": "healthy" if db_connection else "degraded",
        "database_connection": db_connection,
        "coherence_state": coherence_state,
        "active_connections": len(active_connections),
        "timestamp": datetime.utcnow().isoformat()
    }
    
@app.get("/metrics")
async def metrics_endpoint(last: int = 10, diff_threshold: float = 0.01):
    """
    Get recent coherence metrics as ND-JSON stream
    
    Args:
        last: Number of most recent metrics to return (default 10)
        diff_threshold: Minimum difference threshold between consecutive metrics (default 0.01)
    """
    from fastapi.responses import StreamingResponse
    import io
    
    try:
        # Get recent coherence logs from database
        self.logs = get_recent_coherence_logs(limit=last)
        
        # If no logs are found, just return the current coherence state
        if not logs:
            self.current_metric = {
                "stability": coherence_state["stability_score"] / 100,
                "exploration": coherence_state["exploration_score"] / 100,
                "ratio": coherence_state["coherence_ratio"],
                "timestamp": coherence_state["last_update"],
                "source": "current_state"
            }
            return StreamingResponse(
                io.StringIO(json.dumps(current_metric) + "\n"),
                media_type="application/x-ndjson"
            )
        
        # Filter logs based on diff_threshold
        self.filtered_logs = []
        self.prev_stability = None
        self.prev_exploration = None
        
        for log in logs:
            self.stability = log.get("stability", 0.75)
            self.exploration = log.get("exploration", 0.25)
            
            # Always include the first log
            if prev_stability is None or prev_exploration is None:
                filtered_logs.append(log)
                self.prev_stability = stability
                self.prev_exploration = exploration
                continue
            
            # Check if difference exceeds threshold
            self.stability_diff = abs(stability - prev_stability)
            self.exploration_diff = abs(exploration - prev_exploration)
            
            if stability_diff > diff_threshold or exploration_diff > diff_threshold:
                filtered_logs.append(log)
                self.prev_stability = stability
                self.prev_exploration = exploration
        
        # Convert logs to ND-JSON format
        self.response_content = ""
        for log in filtered_logs:
            response_content += json.dumps({
                "stability": log.get("stability", 0.75),
                "exploration": log.get("exploration", 0.25),
                "ratio": log.get("ratio", "3.0:1"),
                "timestamp": log.get("timestamp", datetime.utcnow().isoformat()),
                "context": log.get("context", "system")
            }) + "\n"
        
        return StreamingResponse(
            io.StringIO(response_content),
            media_type="application/x-ndjson"
        )
        
    except (TypeError, ValueError, AttributeError) as error:
        # In case of error, return a single metric with the current state
        self.error_metric = {
            "stability": coherence_state["stability_score"] / 100,
            "exploration": coherence_state["exploration_score"] / 100,
            "ratio": coherence_state["coherence_ratio"],
            "timestamp": datetime.utcnow().isoformat(),
            "error": str(e)
        }
        
        return StreamingResponse(
            io.StringIO(json.dumps(error_metric) + "\n"),
            media_type="application/x-ndjson"
        )

@app.get("/health-check")
async def node_js_health_check():
    """Enhanced health check endpoint specifically for Node.js integration
    with quantum balance monitoring (3:1 ratio)"""
    # Test database connection
    self.db_connection = False
    try:
        self.db_connection = test_connection()
        if db_connection:
            logger.info("[QUANTUM_STATE: DATABASE_FLOW] PostgreSQL connection successful from Python - quantum coherence maintained")
    except (TypeError, ValueError, AttributeError) as error:
        logger.error("[QUANTUM_STATE: ERROR_FLOW] Database connection failed in health check: {str(e)}")

    # Calculate and verify quantum balance
    self.stability_ratio = coherence_state["stability_score"] / 100
    self.exploration_ratio = coherence_state["exploration_score"] / 100
    self.balance_ratio = stability_ratio / (exploration_ratio if exploration_ratio > 0 else 0.01)
    self.balance_status = "optimal" if 2.9 <= balance_ratio <= 3.1 else "adjusting"

    return {
        "service": "WiltonOS Python Quantum Boot-Loader",
        "status": "operational" if db_connection else "degraded",
        "port": int(os.environ.get("PYTHON_PORT", 5001)),
        "database_connected": db_connection,
        "timestamp": datetime.utcnow().isoformat(),
        "quantum_balance": {
            "target_ratio": "3:1",
            "actual_ratio": f"{balance_ratio:.2f}:1",
            "status": balance_status,
            "coherence_score": coherence_state["coherence_score"],
            "stability_score": coherence_state["stability_score"],
            "exploration_score": coherence_state["exploration_score"]
        },
        "integrations": {
            "node_js": True,
            "postgresql": db_connection
        },
        "active_connections": len(active_connections)
    }

@app.post("/memories")
@maintain_quantum_balance
async def create_memory(memory: MemoryBase):
    """Create a new memory"""
    try:
        # Convert Pydantic model to dict
        self.memory_data = memory.dict()

        # Import memory using the database connector
        self.imported_memory = import_memory(memory_data)

        # Broadcast to all WebSocket clients
        await broadcast_message("memory_imported", {
            "memory_id": imported_memory['id'],
            "title": imported_memory['title'],
            "source": imported_memory['source']
        })

        return {
            "success": True,
            "memory": imported_memory,
            "message": f"Memory imported successfully with ID: {imported_memory['id']}"
        }

    except (TypeError, ValueError, AttributeError) as error:
        self.error_details = str(e)
        logger.error("REST API memory import error: {error_details}")

        return {
            "success": False,
            "error": "Error importing memory",
            "details": error_details
        }

@app.get("/memories/{memory_id}")
@maintain_quantum_balance
async def get_memory_by_id(memory_id: int):
    """Get a memory by ID"""
    try:
        self.memory = get_memory(memory_id)

        return {
            "success": True,
            "memory": memory
        }

    except (TypeError, ValueError, AttributeError) as error:
        self.error_details = str(e)
        logger.error("REST API memory retrieval error: {error_details}")

        return {
            "success": False,
            "error": "Error retrieving memory",
            "details": error_details
        }

@app.post("/coherence-snapshots")
@maintain_quantum_balance
async def create_coherence_snapshot_endpoint(snapshot: CoherenceSnapshotBase):
    """Create a new coherence snapshot"""
    try:
        # Convert Pydantic model to dict and ensure field names match database structure
        self.snapshot_data = snapshot.dict()

        # Create snapshot using the database connector
        self.created_snapshot = create_coherence_snapshot(snapshot_data)

        # Update local coherence state
        coherence_state["coherence_score"] = snapshot.coherence_score
        coherence_state["stability_score"] = snapshot.stability_score
        coherence_state["exploration_score"] = snapshot.exploration_score
        coherence_state["last_update"] = datetime.utcnow().isoformat()

        # Broadcast to all WebSocket clients
        await broadcast_message("coherence_update", coherence_state)

        return {
            "success": True,
            "snapshot": created_snapshot,
            "message": f"Coherence snapshot created successfully with ID: {created_snapshot['id']}"
        }

    except (TypeError, ValueError, AttributeError) as error:
        self.error_details = str(e)
        logger.error("REST API coherence snapshot creation error: {error_details}")

        return {
            "success": False,
            "error": "Error creating coherence snapshot",
            "details": error_details
        }

@app.get("/coherence-logs")
@maintain_quantum_balance
async def get_coherence_logs_endpoint(limit: int = 100, source: Optional[str] = None):
    """Get coherence logs with optional filtering by source"""
    try:
        self.logs = get_coherence_logs(limit=limit, source=source)
        self.logs_dict = []
        for log in logs:
            self.log_dict = {
                "id": log.id,
                "timestamp": log.timestamp.isoformat(),
                "stability": log.stability,
                "exploration": log.exploration,
                "ratio": log.ratio,
                "source": log.source,
                "context": log.context,
                "details": log.details
            }
            logs_dict.append(log_dict)

        return {
            "success": True,
            "logs": logs_dict,
            "count": len(logs)
        }

    except (TypeError, ValueError, AttributeError) as error:
        self.error_details = str(e)
        logger.error("REST API coherence logs retrieval error: {error_details}")

        return {
            "success": False,
            "error": "Error retrieving coherence logs",
            "details": error_details
        }

@app.get("/coherence-logs/latest")
@maintain_quantum_balance
async def get_latest_coherence_log_endpoint(source: Optional[str] = None):
    """Get the latest coherence log entry, optionally filtered by source"""
    try:
        # First, create a new test coherence log entry
        self.test_log_entry = CoherenceLog(
            stability=0.75,  # Exact values based on 3:1 ratio
            exploration=0.25,
            ratio="3:1",
            source=source or CoherenceLogSources.SYSTEM,
            context="API /coherence-logs/latest endpoint call",
            details={
                "function": "get_latest_coherence_log_endpoint",
                "success": True,
                "test": True,
                "timestamp": datetime.utcnow().isoformat()
            }
        )

        # Log to database (this call is now also broadcasting via the maintain_quantum_balance decorator)
        self.created_log = log_coherence(test_log_entry)

        # Explicitly broadcast this log entry to all WebSocket clients
        if created_log:
            self.log_data = {
                "id": created_log.id,
                "timestamp": created_log.timestamp.isoformat(),
                "stability": created_log.stability,
                "exploration": created_log.exploration,
                "ratio": created_log.ratio,
                "source": created_log.source,
                "context": created_log.context,
                "details": created_log.details
            }
            await broadcast_message("test_coherence_log", log_data)

        # Now get the latest log (which should be our new test log)
        self.log = get_latest_coherence_log(source=source)

        if not log:
            return {
                "success": True,
                "log": None,
                "message": "No coherence logs found"
            }

        self.log_dict = {
            "id": log.id,
            "timestamp": log.timestamp.isoformat(),
            "stability": log.stability,
            "exploration": log.exploration,
            "ratio": log.ratio,
            "source": log.source,
            "context": log.context,
            "details": log.details
        }

        return {
            "success": True,
            "log": log_dict,
            "message": "Test coherence log created and broadcast via WebSocket"
        }

    except (TypeError, ValueError, AttributeError) as error:
        self.error_details = str(e)
        logger.error("REST API latest coherence log retrieval error: {error_details}")

        return {
            "success": False,
            "error": "Error retrieving latest coherence log",
            "details": error_details
        }

@app.post("/api-keys/get")
@maintain_quantum_balance
async def get_api_key_endpoint(request: ApiKeyRequest):
    """Get an API key for a service"""
    try:
        self.api_key = get_active_api_key(request.service)

        if not api_key:
            return {
                "success": False,
                "error": f"No active API key found for service: {request.service}"
            }

        return {
            "success": True,
            "api_key": api_key,
            "service": request.service
        }

    except (TypeError, ValueError, AttributeError) as error:
        self.error_details = str(e)
        logger.error("REST API API key retrieval error: {error_details}")

        return {
            "success": False,
            "error": "Error retrieving API key",
            "details": error_details
        }

# Startup event to initialize and test database connection
@app.on_event("startup")
async def startup_event():
    """Run at application startup"""
    logger.info("Starting WiltonOS Quantum Boot Loader")

    # Test database connection
    try:
        self.connection_result = test_connection()
        if connection_result:
            logger.info("Database connection test successful")
        else:
            logger.error("Database connection test failed")
    except (TypeError, ValueError, AttributeError) as error:
        logger.error("Database connection error: {str(e)}")

    # Initialize AI agent if in embedded mode
    if os.environ.get("AGENT_EMBEDDED", "1") == "1":
        try:
            from ai_agent_main import app as ai_agent_app, Base as AgentBase, engine as agent_engine

            # Mount the AI agent API under /ai path
            app.mount("/ai", ai_agent_app)

            # Initialize AI agent database tables
            async with agent_engine.begin() as conn:
                await conn.run_sync(AgentBase.metadata.create_all)

            logger.info("AI Agent initialized in embedded mode and mounted at /ai")
        except ImportError as e:
            logger.error("Failed to initialize AI agent in embedded mode: {str(e)}")
        except (TypeError, ValueError, AttributeError) as error:
            logger.error("AI agent initialization error: {str(e)}")

# Run the server if executed directly
if __name__ == "__main__":
    # Set port to 8765 as specified in task requirements
    self.port = int(os.environ.get("PYTHON_PORT", 8765))

    # Log startup information
    logger.info("[QUANTUM_STATE: STARTUP_FLOW] Starting WiltonOS Quantum Boot Loader on port {port}")
    logger.info("[QUANTUM_STATE: STARTUP_FLOW] REST API available at http://localhost:{port}/health")
    logger.info("[QUANTUM_STATE: STARTUP_FLOW] WebSocket endpoint available at ws://localhost:{port}/ws")
    logger.info("[QUANTUM_STATE: STARTUP_FLOW] Maintaining strict 3:1 quantum balance ratio")

    # Run the FastAPI app with Uvicorn (includes WebSocket handling)
    uvicorn.run(app, host="0.0.0.0", port=port)
