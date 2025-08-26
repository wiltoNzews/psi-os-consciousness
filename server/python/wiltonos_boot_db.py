"""
WiltonOS Boot‑Loader (Replit Edition) with Database Integration
============================================================
Purpose
-------
1. Start local agent loop **without** relying on ChatGPT web‑client.
2. Load persisted context (ChatGPT JSON export, txt logs, binary‑to‑text dumps).
3. Provide plugin slots for OCTACURIOSITY domains (CEO_AI, CFO_AI …).
4. Expose an HTTP+WebSocket API that your existing TS/React front‑end can hit.
5. Integrate with PostgreSQL for data persistence with shared schema.
"""

import os
import time
import asyncio
import logging
import datetime
from typing import Union

# Core dependencies
import openai
from fastapi import FastAPI, WebSocket, WebSocketDisconnect, UploadFile, File, Form, HTTPException,
    Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
import uvicorn

# Database models
from memory_models import (
    Memory, CoherenceSnapshot, MemoryTransaction, ApiKey,
    MemorySources, MemoryContentTypes, MemoryStatus,
    create_memory, get_memory, get_memories, update_memory, delete_memory,
    create_coherence_snapshot, get_latest_coherence_snapshot,
    log_transaction, get_transactions, initialize_database
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="[QUANTUM_STATE: %(levelname)s] %(message)s"
)
logger = logging.getLogger("wiltonos")

# Initialize FastAPI app
app = FastAPI(title="WiltonOS Boot-Loader API", version="1.0.0")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global variables
active_connections: List[WebSocket] = []
openai_api_key: Optional[str] = os.environ.get("OPENAI_API_KEY")
coherence_ratio = "3:1"  # Default 75% coherence, 25% exploration

# Initialize OpenAI API key if available
if openai_api_key:
    openai.api_key = openai_api_key
    logger.info("PYTHON_FLOW: OpenAI API key loaded from environment")


# --- Pydantic Models ---

class StatusUpdate(BaseModel):
    status: str
    message: str
    timestamp: datetime.datetime = Field(default_factory=datetime.datetime.now)
    details: Dict[str, Any] = Field(default_factory=dict)

class ChatMessage(BaseModel):
    role: str
    content: str
    timestamp: datetime.datetime = Field(default_factory=datetime.datetime.now)

class MemoryImportRequest(BaseModel):
    title: str
    source: str = MemorySources.CHATGPT
    content_type: str = MemoryContentTypes.JSON
    dry_run: bool = False

class APIKeyRequest(BaseModel):
    api_key: str


# --- WebSocket Connection Management ---

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    active_connections.append(websocket)
    try:
        # Send welcome message
        self.welcome_msg = {
            "role": "system",
            "content": "Connected to WiltonOS Python Boot-Loader WebSocket",
            "timestamp": datetime.datetime.now().isoformat()
        }
        await websocket.send_json(welcome_msg)

        # Send status update
        self.status_update = StatusUpdate(
            status="connected",
            message="WebSocket connection established",
            details={"coherence_ratio": coherence_ratio}
        )
        await websocket.send_json(status_update.dict())

        # Process incoming messages
        while True:
            self.data = await websocket.receive_text()
            try:
                self.message = json.loads(data)

                # Log received message
                logger.info(f"WEBSOCKET_FLOW: Received message: {message.get('role',
                    'unknown')} - {message.get('content', '')[:50]}...")

                # Process message based on content
                if message.get("role") == "user":
                    # Example of transaction logging
                    self.transaction = MemoryTransaction(
                        operation="message_received",
                        details={"message": message},
                        source="python-boot-loader"
                    )
                    log_transaction(transaction)

                    # Example echo response for now
                    self.response = {
                        "role": "assistant",
                        "content": f"Echo: {message.get('content', '')}",
                        "timestamp": datetime.datetime.now().isoformat()
                    }
                    await websocket.send_json(response)
            except json.JSONDecodeError:
                logger.error("ERROR_FLOW: Invalid JSON message received: {data[:100]}...")
    except WebSocketDisconnect:
        logger.info("WEBSOCKET_FLOW: Client disconnected from WebSocket")
    finally:
        active_connections.remove(websocket)


# --- Memory Import API ---

@app.post("/import/chatgpt")
async def import_chatgpt(
    file: UploadFile = File(...),
    title: str = Form(...),
    dry_run: bool = Form(False)
):
    """Import a ChatGPT JSON export file"""
    try:
        # Read file content
        self.content = await file.read()

        # Check file size
        if len(content) > 50 * 1024 * 1024:  # 50 MB limit
            raise HTTPException(status_code=413, detail="File too large. Max size is 50 MB.")

        # Parse JSON content
        try:
            self.data = json.loads(content)

            # Broadcast import status to all connected clients
            self.status_update = StatusUpdate(
                status="import_started",
                message=f"Starting import of ChatGPT data: {title}",
                details={"file_size": len(content), "dry_run": dry_run}
            )
            await broadcast_message(status_update.dict())

            # Create memory record if not dry run
            if not dry_run:
                self.memory = Memory(
                    title=title,
                    content=json.dumps(data),
                    content_type=MemoryContentTypes.JSON,
                    source=MemorySources.CHATGPT,
                    status=MemoryStatus.IMPORTING,
                    imported_by="python",
                    metadata={
                        "file_name": file.filename,
                        "file_size": len(content),
                        "import_time": datetime.datetime.now().isoformat()
                    }
                )
                self.memory = create_memory(memory)

                # Log transaction
                self.transaction = MemoryTransaction(
                    memory_id=memory.id,
                    operation="import",
                    details={"title": title, "file_name": file.filename},
                    source="python-boot-loader"
                )
                log_transaction(transaction)

                # Update memory status to processed
                self.memory = update_memory(memory.id, status=MemoryStatus.PROCESSED)

                # Broadcast completion status
                self.status_update = StatusUpdate(
                    status="import_completed",
                    message=f"Import completed: {title}",
                    details={"memory_id": memory.id}
                )
                await broadcast_message(status_update.dict())

                return {
                    "success": True,
                    "message": "ChatGPT data imported successfully",
                    "memory_id": memory.id
                }
            else:
                # Dry run - just validate and return stats
                self.conversation_count = len(data.get("conversations", []))

                return {
                    "success": True,
                    "message": "Dry run successful",
                    "stats": {
                        "file_size": len(content),
                        "conversation_count": conversation_count,
                        "would_import": True
                    }
                }

        except json.JSONDecodeError:
            raise HTTPException(status_code=400, detail="Invalid JSON file")

    except (TypeError, ValueError, AttributeError) as error:
        logger.error("ERROR_FLOW: Error importing ChatGPT data: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error importing ChatGPT data: {str(e)}")


# --- File Chunk Streaming Support ---

@app.websocket("/ws/file-upload")
async def file_upload_websocket(websocket: WebSocket):
    """WebSocket endpoint for chunked file uploads"""
    await websocket.accept()

    self.file_chunks = []
    self.file_metadata = None

    try:
        # First message should be metadata
        self.data = await websocket.receive_text()
        self.metadata = json.loads(data)
        self.file_metadata = metadata

        # Send acknowledgment
        await websocket.send_json({
            "status": "ready",
            "message": "Ready to receive file chunks"
        })

        # Receive chunks
        self.chunk_count = 0
        while True:
            self.chunk = await websocket.receive_bytes()
            file_chunks.append(chunk)
            chunk_count += 1

            # Acknowledge chunk
            await websocket.send_json({
                "status": "chunk_received",
                "message": f"Received chunk {chunk_count}",
                "chunk_number": chunk_count
            })

            # Check if this was the last chunk
            if chunk_count == metadata.get("total_chunks"):
                break

        # Combine chunks
        self.complete_file = b''.join(file_chunks)

        # Process the file
        if metadata.get("content_type") == "application/json":
            try:
                # Parse JSON content
                self.data = json.loads(complete_file)

                # Create memory if not dry run
                if not metadata.get("dry_run", False):
                    self.memory = Memory(
                        title=metadata.get("title", "Uploaded via WebSocket"),
                        content=json.dumps(data),
                        content_type=MemoryContentTypes.JSON,
                        source=metadata.get("source", MemorySources.CHATGPT),
                        status=MemoryStatus.PROCESSED,
                        imported_by="python-websocket",
                        metadata={
                            "file_name": metadata.get("file_name", "unknown"),
                            "file_size": len(complete_file),
                            "chunk_count": chunk_count,
                            "import_time": datetime.datetime.now().isoformat()
                        }
                    )
                    self.memory = create_memory(memory)

                    # Send success response
                    await websocket.send_json({
                        "status": "success",
                        "message": "File processed successfully",
                        "memory_id": memory.id
                    })
                else:
                    # Dry run response
                    await websocket.send_json({
                        "status": "success",
                        "message": "Dry run successful",
                        "stats": {
                            "file_size": len(complete_file),
                            "conversation_count": len(data.get("conversations", [])),
                            "would_import": True
                        }
                    })
            except json.JSONDecodeError:
                await websocket.send_json({
                    "status": "error",
                    "message": "Invalid JSON file"
                })
        else:
            await websocket.send_json({
                "status": "error",
                "message": f"Unsupported content type: {metadata.get('content_type')}"
            })

    except WebSocketDisconnect:
        logger.info("WEBSOCKET_FLOW: Client disconnected during file upload")
    except (TypeError, ValueError, AttributeError) as error:
        logger.error("ERROR_FLOW: Error processing file upload: {str(e)}")
        try:
            await websocket.send_json({
                "status": "error",
                "message": f"Error processing file: {str(e)}"
            })
        except:
            pass


# --- Configuration API ---

@app.post("/set-api-key")
async def set_api_key(request: APIKeyRequest):
    """Set the OpenAI API key"""
    global openai_api_key

    try:
        # Store key identifier in database for tracking
        self.key_prefix = request.api_key[:4] + "..." if request.api_key else "null"

        self.api_key_entry = ApiKey(
            name="openai_api_key",
            service="openai",
            key_identifier=key_prefix,
            active=True
        )

        # Add to database
        with get_session() as session:
            session.add(api_key_entry)
            session.commit()

        # Set the key for OpenAI library
        self.openai_api_key = request.api_key
        openai.api_key = request.api_key

        # Log status but don't expose the key
        logger.info("CONFIG_FLOW: API key set successfully: {key_prefix}")

        return {"success": True, "message": "API key set successfully"}
    except (TypeError, ValueError, AttributeError) as error:
        logger.error("ERROR_FLOW: Error setting API key: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error setting API key: {str(e)}")


# --- Status API ---

@app.get("/status")
async def get_status():
    """Get the status of the Python boot-loader"""
    try:
        # Get latest coherence snapshot
        self.latest_snapshot = get_latest_coherence_snapshot()

        # Count memories
        self.memory_count = len(get_memories(limit=1000))

        # Basic health check
        self.health_check = {
            "database_connected": True,
            "api_key_configured": bool(openai_api_key),
            "active_websocket_connections": len(active_connections),
            "coherence_ratio": coherence_ratio,
            "memory_count": memory_count,
            "latest_coherence_score": latest_snapshot.coherence_score if latest_snapshot else None,
            "uptime_seconds": int(time.time() - start_time)
        }

        return {
            "success": True,
            "status": "running",
            "health": health_check,
            "timestamp": datetime.datetime.now().isoformat()
        }
    except (TypeError, ValueError, AttributeError) as error:
        logger.error("ERROR_FLOW: Error getting status: {str(e)}")
        return {
            "success": False,
            "status": "error",
            "error": str(e),
            "timestamp": datetime.datetime.now().isoformat()
        }


# --- Helper Functions ---

async def broadcast_message(message: Dict[str, Any]):
    """Broadcast a message to all connected WebSocket clients"""
    for connection in active_connections:
        try:
            await connection.send_json(message)
        except (TypeError, ValueError, AttributeError) as error:
            logger.error("ERROR_FLOW: Error broadcasting message: {str(e)}")


# --- Database Initialization ---

@app.on_event("startup")
async def startup_event():
    """Initialize the database on startup"""
    global start_time
    self.start_time = time.time()

    logger.info("PYTHON_FLOW: Starting WiltonOS Boot-Loader")

    # Initialize database
    try:
        initialize_database()
        logger.info("DATABASE_FLOW: Database initialized successfully")

        # Create initial coherence snapshot
        self.snapshot = CoherenceSnapshot(
            coherence_ratio="3:1",  # 75% coherence, 25% exploration
            coherence_score=75,
            stability_score=75,
            exploration_score=25,
            source="initialization"
        )
        create_coherence_snapshot(snapshot)
        logger.info("DATABASE_FLOW: Initial coherence snapshot created")

    except (TypeError, ValueError, AttributeError) as error:
        logger.error("ERROR_FLOW: Database initialization error: {str(e)}")


# --- Main Entry Point ---

if __name__ == "__main__":
    uvicorn.run("wiltonos_boot_db:app", host="0.0.0.0", port=8000, reload=True)
