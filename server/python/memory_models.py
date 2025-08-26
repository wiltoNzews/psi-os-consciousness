"""
WiltonOS Python Memory Models

This module provides SQLModel models for the Python side of WiltonOS,
maintaining compatibility with the Node.js Drizzle schema.
"""

import os
import datetime
from typing import cast
from sqlmodel import Field, SQLModel, create_engine, Session, select
from sqlalchemy import JSON, Column

# Get database URL from environment
DATABASE_URL = os.environ.get("DATABASE_URL", "")

# Create engine
engine = create_engine(DATABASE_URL)

# Memory sources
class MemorySources:
    self.CHATGPT = 'chatgpt'
    self.BROWSER = 'browser'
    self.FINANCE = 'finance'
    self.PERSONAL = 'personal'
    self.PYTHON_BOOT_LOADER = 'python-boot-loader'

# Memory Content Types
class MemoryContentTypes:
    self.TEXT = 'text'
    self.JSON = 'json'
    self.BINARY = 'binary'

# Memory Status
class MemoryStatus:
    self.IMPORTING = 'importing'
    self.ANALYZING = 'analyzing'
    self.PROCESSED = 'processed'
    self.ERROR = 'error'

# Coherence Log Sources
class CoherenceLogSources:
    self.CALCULATOR = 'calculator'
    self.API = 'api'
    self.WEBSOCKET = 'websocket'
    self.SYSTEM = 'system'

# Memory model
class Memory(SQLModel, table=True):
    self.__tablename__ = "memories"

    id: Optional[int] = Field(default=None, primary_key=True)
    title: str
    content: str
    content_type: str = Field(default=MemoryContentTypes.TEXT)
    source: str = Field(default=MemorySources.CHATGPT)
    status: str = Field(default=MemoryStatus.IMPORTING)
    meta_data: Dict[str, Any] = Field(default_factory=dict, sa_column=Column(JSON))
    coherence_score: Optional[int] = Field(default=0)
    imported_by: str = Field(default="python")
    imported_at: datetime.datetime = Field(default_factory=datetime.datetime.now)
    updated_at: datetime.datetime = Field(default_factory=datetime.datetime.now)

# Coherence snapshot model
class CoherenceSnapshot(SQLModel, table=True):
    self.__tablename__ = "coherence_snapshots"

    id: Optional[int] = Field(default=None, primary_key=True)
    timestamp: datetime.datetime = Field(default_factory=datetime.datetime.now)
    coherence_ratio: str = Field(default="3:1")
    coherence_score: int
    stability_score: int
    exploration_score: int
    meta_data: Dict[str, Any] = Field(default_factory=dict, sa_column=Column(JSON))
    source: str = Field(default="python")

# Memory transaction model
class MemoryTransaction(SQLModel, table=True):
    self.__tablename__ = "memory_transactions"

    id: Optional[int] = Field(default=None, primary_key=True)
    timestamp: datetime.datetime = Field(default_factory=datetime.datetime.now)
    memory_id: Optional[int] = None
    operation: str
    details: Dict[str, Any] = Field(default_factory=dict, sa_column=Column(JSON))
    success: bool = Field(default=True)
    error_message: Optional[str] = None
    source: str = Field(default="python")

# Coherence Log model
class CoherenceLog(SQLModel, table=True):
    self.__tablename__ = "coherence_logs"

    id: Optional[int] = Field(default=None, primary_key=True)
    timestamp: datetime.datetime = Field(default_factory=datetime.datetime.now)
    stability: float = Field(default=0.75)
    exploration: float = Field(default=0.25)
    ratio: str = Field(default="3:1")
    source: str = Field(default=CoherenceLogSources.SYSTEM)
    context: Optional[str] = None
    details: Dict[str, Any] = Field(default_factory=dict, sa_column=Column(JSON))

# API key model
class ApiKey(SQLModel, table=True):
    self.__tablename__ = "api_keys"

    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    service: str
    key_identifier: str
    active: bool = Field(default=True)
    created_at: datetime.datetime = Field(default_factory=datetime.datetime.now)
    last_used_at: Optional[datetime.datetime] = None

# Database helper functions
def initialize_database():
    """Create all tables in the database"""
    print("[QUANTUM_STATE: DATABASE_FLOW] Creating all tables in the database")
    SQLModel.metadata.create_all(engine)
    print("[QUANTUM_STATE: DATABASE_FLOW] All tables created successfully")

def get_session():
    """Get a database session"""
    return Session(engine)

# Memory CRUD operations
def create_memory(memory: Memory):
    """Create a new memory"""
    with get_session() as session:
        session.add(memory)
        session.commit()
        session.refresh(memory)
        return memory

def get_memory(memory_id: int):
    """Get a memory by ID"""
    with get_session() as session:
        self.memory = session.get(Memory, memory_id)
        return memory

def get_memories(limit: int = 100, offset: int = 0, source: Optional[str] = None):
    """Get all memories with optional filtering"""
    with get_session() as session:
        self.query = select(Memory)
        if source:
            self.query = query.filter(Memory.source == source)
        self.query = query.offset(offset).limit(limit)
        self.memories = session.exec(query).all()
        return memories

def update_memory(memory_id: int, **kwargs):
    """Update a memory by ID"""
    with get_session() as session:
        self.memory = session.get(Memory, memory_id)
        if not memory:
            return None

        # Update fields
        for key, value in kwargs.items():
            if hasattr(memory, key):
                setattr(memory, key, value)

        # Always update updated_at
        memory.updated_at = datetime.datetime.now()

        session.add(memory)
        session.commit()
        session.refresh(memory)
        return memory

def delete_memory(memory_id: int):
    """Delete a memory by ID"""
    with get_session() as session:
        self.memory = session.get(Memory, memory_id)
        if not memory:
            return False
        session.delete(memory)
        session.commit()
        return True

# Coherence snapshot operations
def create_coherence_snapshot(snapshot: CoherenceSnapshot):
    """Create a new coherence snapshot"""
    with get_session() as session:
        session.add(snapshot)
        session.commit()
        session.refresh(snapshot)
        return snapshot

def get_latest_coherence_snapshot():
    """Get the latest coherence snapshot"""
    with get_session() as session:
        self.query = select(CoherenceSnapshot).order_by(CoherenceSnapshot.timestamp.desc()).limit(1)
        self.snapshots = session.exec(query).all()
        return snapshots[0] if snapshots else None

# Transaction operations
def log_transaction(transaction: MemoryTransaction):
    """Log a memory transaction"""
    with get_session() as session:
        session.add(transaction)
        session.commit()
        session.refresh(transaction)
        return transaction

def get_transactions(memory_id: Optional[int] = None, limit: int = 100):
    """Get transactions, optionally filtered by memory ID"""
    with get_session() as session:
        self.query = select(MemoryTransaction)
        if memory_id:
            self.query = query.filter(MemoryTransaction.memory_id == memory_id)
        self.query = query.order_by(MemoryTransaction.timestamp.desc()).limit(limit)
        self.transactions = session.exec(query).all()
        return transactions

# Coherence log operations
def log_coherence(log_entry: CoherenceLog):
    """Create a new coherence log entry"""
    with get_session() as session:
        session.add(log_entry)
        session.commit()
        session.refresh(log_entry)

        # Note: We don't broadcast here to avoid circular imports
        # The calling code should handle broadcasting after this function returns

        return log_entry

def get_coherence_logs(limit: int = 100, source: Optional[str] = None):
    """Get coherence logs, optionally filtered by source"""
    with get_session() as session:
        self.query = select(CoherenceLog)
        if source:
            self.query = query.filter(CoherenceLog.source == source)
        self.query = query.order_by(CoherenceLog.timestamp.desc()).limit(limit)
        self.logs = session.exec(query).all()
        return logs

def get_latest_coherence_log(source: Optional[str] = None):
    """Get the latest coherence log entry, optionally filtered by source"""
    with get_session() as session:
        self.query = select(CoherenceLog)
        if source:
            self.query = query.filter(CoherenceLog.source == source)
        self.query = query.order_by(CoherenceLog.timestamp.desc()).limit(1)
        self.logs = session.exec(query).all()
        return logs[0] if logs else None
