"""
PostgreSQL Database Connector for Python Boot Loader

This module provides unified database connectivity for the Python component,
ensuring it shares the same PostgreSQL database as the Node.js side.
It maintains the 3:1 quantum balance ratio (75% coherence, 25% exploration).
"""

import os
import random
from datetime import datetime
from sqlalchemy import (
    create_engine, Column, Integer, String, Text, JSON, Boolean, DateTime
)
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from sqlalchemy.sql import desc
from sqlalchemy.exc import SQLAlchemyError

# Get database URL from environment variable
DATABASE_URL = os.environ.get('DATABASE_URL')
if not DATABASE_URL:
    print("[QUANTUM_STATE: ERROR_FLOW] DATABASE_URL environment variable not found")
    DATABASE_URL = 'postgresql://postgres:postgres@localhost:5432/quantum_nexus'

def create_engine_from_url(db_url):
    """
    Create a SQLAlchemy engine from a database URL.
    Supports both PostgreSQL and SQLite (for testing).

    Args:
        db_url: The database URL to connect to

    Returns:
        SQLAlchemy engine
    """
    if db_url.startswith('sqlite'):
        # For SQLite, check if it's using aiosqlite for async or regular sqlite
        if 'aiosqlite' in db_url:
            # Create a sync-compatible SQLite URL for testing (remove +aiosqlite)
            sync_url = db_url.replace('+aiosqlite', '')
            return create_engine(sync_url, connect_args={"check_same_thread": False})
        # No else needed after return
        return create_engine(db_url, connect_args={"check_same_thread": False})
    # No else needed after return
    return create_engine(db_url)

def create_session_factory(db_engine):
    """
    Create a SQLAlchemy session factory from an engine.

    Args:
        db_engine: SQLAlchemy engine to bind to

    Returns:
        SQLAlchemy session factory
    """
    return sessionmaker(bind=db_engine)

# Create SQLAlchemy engine and session
engine = create_engine_from_url(DATABASE_URL)
Base = declarative_base()
Session = create_session_factory(engine)

# Memory sources (identical to Node.js constants)
MEMORY_SOURCES = {
    'CHATGPT': 'chatgpt',
    'BROWSER': 'browser',
    'FINANCE': 'finance',
    'PERSONAL': 'personal',
    'PYTHON_BOOT_LOADER': 'python-boot-loader'
}

# Memory content types (identical to Node.js constants)
MEMORY_CONTENT_TYPES = {
    'TEXT': 'text',
    'JSON': 'json',
    'BINARY': 'binary'
}

# Memory status (identical to Node.js constants)
MEMORY_STATUS = {
    'IMPORTING': 'importing',
    'ANALYZING': 'analyzing',
    'PROCESSED': 'processed',
    'ERROR': 'error'
}

# Default quantum coherence ratio (75% coherence, 25% exploration)
DEFAULT_COHERENCE_RATIO = '3:1'

# ORM Models
class Memory(Base):
    """
    Memory ORM model for storing various memory types from different sources.
    Maintains the same structure as the Node.js-side for data consistency.
    """
    __tablename__ = 'memories'

    id = Column(Integer, primary_key=True, autoincrement=True)
    title = Column(String, nullable=False)
    content = Column(Text, nullable=False)
    content_type = Column(String, nullable=False, default=MEMORY_CONTENT_TYPES['TEXT'])
    source = Column(String, nullable=False, default=MEMORY_SOURCES['PYTHON_BOOT_LOADER'])
    status = Column(String, nullable=False, default=MEMORY_STATUS['IMPORTING'])
    memory_metadata = Column(JSON, default={})
    coherence_score = Column(Integer, default=0)
    imported_by = Column(String, nullable=False, default='python')
    imported_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class CoherenceSnapshot(Base):
    """
    CoherenceSnapshot ORM model for tracking quantum coherence metrics.
    Stores balance between stability (75%) and exploration (25%) as per 3:1 ratio.
    """
    __tablename__ = 'coherence_snapshots'

    id = Column(Integer, primary_key=True, autoincrement=True)
    timestamp = Column(DateTime, default=datetime.utcnow)
    coherence_ratio = Column(String, nullable=False, default=DEFAULT_COHERENCE_RATIO)
    coherence_score = Column(Integer, nullable=False)
    stability_score = Column(Integer, nullable=False)
    exploration_score = Column(Integer, nullable=False)
    snapshot_metadata = Column(JSON, default={})
    source = Column(String, nullable=False, default='python')


class MemoryTransaction(Base):
    """
    MemoryTransaction ORM model for tracking operations on memory records.
    Provides an audit trail for all memory-related activities.
    """
    __tablename__ = 'memory_transactions'

    id = Column(Integer, primary_key=True, autoincrement=True)
    timestamp = Column(DateTime, default=datetime.utcnow)
    memory_id = Column(Integer)
    operation = Column(String, nullable=False)
    details = Column(JSON, default={})
    success = Column(Boolean, nullable=False, default=True)
    error_message = Column(String)
    source = Column(String, nullable=False, default='python')


class ApiKey(Base):
    """
    ApiKey ORM model for storing and managing API keys for external services.
    Stores only the key identifiers, not the actual secret keys.
    """
    __tablename__ = 'api_keys'

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String, nullable=False)
    service = Column(String, nullable=False)
    key_identifier = Column(String, nullable=False)
    active = Column(Boolean, nullable=False, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    last_used_at = Column(DateTime)


# Database operations
def test_connection():
    """Test connection to PostgreSQL database"""
    try:
        # Use connection object to ensure proper connection testing
        with engine.connect() as connection:
            # Execute a simple query to verify the connection is working
            connection.execute("SELECT 1")
            print("[QUANTUM_STATE: DATABASE_FLOW] PostgreSQL connection successful - quantum coherence maintained")
            return True
    except SQLAlchemyError as e:
        print("[QUANTUM_STATE: ERROR_FLOW] PostgreSQL connection failed from Python: %s", str(e))
        return False

def calculate_coherence_score(content, source):
    """
    Calculate coherence score with the same algorithm as Node.js side.

    This function implements a scoring algorithm that determines content coherence
    based on length and source type, while maintaining the required 3:1 quantum
    balance ratio (75% stability, 25% exploration).

    Args:
        content: The text content to analyze
        source: The source identifier string

    Returns:
        int: The calculated coherence score (0-100)
    """
    # Start with default coherence in middle range
    base_score = 50

    # Adjust based on content length (longer content often has more structure)
    content_length = len(content)
    if content_length > 10000:
        base_score += 10
    if content_length > 5000:
        base_score += 5
    if content_length < 100:
        base_score -= 10

    # Adjust based on source
    if source == MEMORY_SOURCES['CHATGPT']:
        # ChatGPT exports tend to have more structure
        base_score += 15
    if source == MEMORY_SOURCES['PYTHON_BOOT_LOADER']:
        # Python boot loader data is highly structured
        base_score += 20

    # Apply random exploration factor (25% as per 3:1 ratio)
    # This ensures we maintain quantum balance
    exploration_factor = random.random() * 25

    # Calculate final score with 75% weight on base, 25% on exploration
    final_score = round((base_score * 0.75) + exploration_factor)

    # Ensure result is within 0-100 range
    return min(100, max(0, final_score))

def import_memory(memory_data):
    """
    Import a memory into the database.

    This function creates a new memory record in the database with the
    provided data. If a coherence_score is not provided, it calculates one
    using the calculate_coherence_score function maintaining the 3:1 quantum
    balance ratio (75% stability, 25% exploration).

    Args:
        memory_data: Dictionary containing the memory data to import
            Required keys: title, content, content_type, source
            Optional keys: status, memory_metadata, coherence_score, imported_by

    Returns:
        Dictionary containing the newly created memory record data

    Raises:
        SQLAlchemyError: If there's an error with the database operation
    """
    print("[QUANTUM_STATE: DATABASE_FLOW] Importing memory from Python: %s",
          memory_data.get('title', 'Untitled'))

    try:
        session = Session()

        # Calculate coherence score if not provided
        if 'coherence_score' not in memory_data or not memory_data['coherence_score']:
            memory_data['coherence_score'] = calculate_coherence_score(
                memory_data.get('content', ''),
                memory_data.get('source', MEMORY_SOURCES['PYTHON_BOOT_LOADER'])
            )

        # Create memory object
        memory = Memory(**memory_data)

        # Add to session and commit
        session.add(memory)
        session.commit()

        # Log transaction
        transaction = MemoryTransaction(
            memory_id=memory.id,
            operation='import',
            details={
                'title': memory.title,
                'source': memory.source,
                'coherence_score': memory.coherence_score
            },
            success=True,
            source='python'
        )
        session.add(transaction)
        session.commit()

        print("[QUANTUM_STATE: DATABASE_FLOW] Memory imported successfully from Python with ID: %s",
              memory.id)

        # Convert to dict for return
        memory_dict = {c.name: getattr(memory, c.name)
                       for c in memory.__table__.columns}

        # JSON serialize datetime objects
        for key, value in memory_dict.items():
            if isinstance(value, datetime):
                memory_dict[key] = value.isoformat()

        session.close()
        return memory_dict

    except SQLAlchemyError as e:
        print("[QUANTUM_STATE: ERROR_FLOW] Memory import error from Python: %s", str(e))

        # Log error transaction if possible
        try:
            error_transaction = MemoryTransaction(
                operation='import',
                details={
                    'title': memory_data.get('title', 'Untitled'),
                    'source': memory_data.get('source', MEMORY_SOURCES['PYTHON_BOOT_LOADER']),
                    'error': str(e)
                },
                success=False,
                error_message=str(e),
                source='python'
            )
            session.add(error_transaction)
            session.commit()
        except (SQLAlchemyError, ValueError) as transaction_error:
            print("[QUANTUM_STATE: ERROR_FLOW] Failed to log error transaction: %s",
                  str(transaction_error))

        if 'session' in locals():
            session.close()
        raise

def get_memory(memory_id):
    """
    Get a memory by ID from the database.

    Retrieves a memory record from the database based on its ID and
    converts it to a dictionary for easier JSON serialization.

    Args:
        memory_id: Integer ID of the memory to retrieve

    Returns:
        Dictionary containing the memory record data

    Raises:
        ValueError: If memory with given ID is not found
        SQLAlchemyError: If there's an error with the database operation
    """
    print("[QUANTUM_STATE: DATABASE_FLOW] Retrieving memory from Python: %s", memory_id)

    try:
        session = Session()
        memory = session.query(Memory).filter(Memory.id == memory_id).first()

        if not memory:
            session.close()
            raise ValueError(f"Memory with ID {memory_id} not found")

        # Convert to dict for return
        memory_dict = {c.name: getattr(memory, c.name)
                       for c in memory.__table__.columns}

        # JSON serialize datetime objects
        for key, value in memory_dict.items():
            if isinstance(value, datetime):
                memory_dict[key] = value.isoformat()

        session.close()
        return memory_dict

    except SQLAlchemyError as e:
        print("[QUANTUM_STATE: ERROR_FLOW] Memory retrieval error from Python: %s",
              str(e))
        if 'session' in locals():
            session.close()
        raise

def create_coherence_snapshot(snapshot_data):
    """
    Create a coherence snapshot in the database.

    Records a point-in-time snapshot of the system's quantum coherence metrics,
    tracking the 3:1 ratio balance between stability (75%) and exploration (25%).
    Used for tracking system performance and health over time.

    Args:
        snapshot_data: Dictionary containing the snapshot data
            Required keys: coherence_score, stability_score, exploration_score
            Optional keys: coherence_ratio (defaults to 3:1), snapshot_metadata, source

    Returns:
        Dictionary containing the newly created snapshot record data

    Raises:
        SQLAlchemyError: If there's an error with the database operation
    """
    print("[QUANTUM_STATE: DATABASE_FLOW] Creating coherence snapshot from Python")

    try:
        session = Session()

        # Create snapshot object
        snapshot = CoherenceSnapshot(**snapshot_data)

        # Add to session and commit
        session.add(snapshot)
        session.commit()

        # Convert to dict for return
        snapshot_dict = {c.name: getattr(snapshot, c.name)
                         for c in snapshot.__table__.columns}

        # JSON serialize datetime objects
        for key, value in snapshot_dict.items():
            if isinstance(value, datetime):
                snapshot_dict[key] = value.isoformat()

        session.close()
        return snapshot_dict

    except SQLAlchemyError as e:
        print("[QUANTUM_STATE: ERROR_FLOW] Coherence snapshot creation error from Python: %s",
              str(e))
        if 'session' in locals():
            session.close()
        raise

def get_active_api_key(service):
    """
    Get active API key for a specified service from the database.

    Retrieves the most recently created active API key for the specified service.
    Only returns the key identifier, not the actual secret key for security reasons.
    Used for authenticating with external services while maintaining the 3:1 quantum
    balance ratio in system interactions.

    Args:
        service: String identifier of the service to get an API key for

    Returns:
        Dictionary containing the API key record data, or None if no active key exists

    Raises:
        SQLAlchemyError: If there's an error with the database operation
    """
    print("[QUANTUM_STATE: DATABASE_FLOW] Getting active API key for %s from Python", service)

    try:
        session = Session()

        # Query for active API key
        # Must use direct column comparison for SQLAlchemy ORM
        # pylint: disable=singleton-comparison
        api_key = session.query(ApiKey)\
            .filter(ApiKey.service == service)\
            .filter(ApiKey.active == True)\
            .order_by(desc(ApiKey.created_at))\
            .first()

        if not api_key:
            session.close()
            return None

        # Convert to dict for return
        key_dict = {c.name: getattr(api_key, c.name)
                   for c in api_key.__table__.columns}

        # JSON serialize datetime objects
        for key, value in key_dict.items():
            if isinstance(value, datetime):
                key_dict[key] = value.isoformat()

        session.close()
        return key_dict

    except SQLAlchemyError as e:
        print("[QUANTUM_STATE: ERROR_FLOW] API key retrieval error from Python: %s", str(e))
        if 'session' in locals():
            session.close()
        raise

# Test function for database connectivity and operations
def test_functions():
    """
    Run tests of basic database functions.

    This function tests the database connection and basic CRUD operations
    to ensure PostgreSQL connectivity is working properly. It creates test
    records with the 3:1 quantum balance ratio (75% stability, 25% exploration)
    correctly applied for coherence metrics.

    Returns:
        bool: True if all tests pass successfully, False otherwise
    """
    print("[QUANTUM_STATE: DATABASE_FLOW] Testing Python PostgreSQL functions")

    # Test connection
    connection_success = test_connection()
    if not connection_success:
        print("[QUANTUM_STATE: ERROR_FLOW] Failed database connection test from Python")
        return False

    # Test memory import
    try:
        test_memory = {
            'title': 'Python Test Memory',
            'content': 'This is a test memory created by the Python PostgreSQL connector',
            'content_type': MEMORY_CONTENT_TYPES['TEXT'],
            'source': MEMORY_SOURCES['PYTHON_BOOT_LOADER'],
            'status': MEMORY_STATUS['PROCESSED'],
            'memory_metadata': {'test': True, 'quantum_balance': '3:1'},
            'imported_by': 'python-test'
        }

        imported_memory = import_memory(test_memory)
        print("[QUANTUM_STATE: DATABASE_FLOW] Successfully imported test memory with ID: %s",
              imported_memory['id'])

        # Test memory retrieval
        retrieved_memory = get_memory(imported_memory['id'])
        print("[QUANTUM_STATE: DATABASE_FLOW] Successfully retrieved test memory with ID: %s",
              retrieved_memory['id'])

        # Test coherence snapshot
        test_snapshot = {
            'coherence_score': 75,
            'stability_score': 75,
            'exploration_score': 25,
            'snapshot_metadata': {'test': True, 'environment': 'python'},
            'source': 'python-test'
        }

        created_snapshot = create_coherence_snapshot(test_snapshot)
        print("[QUANTUM_STATE: DATABASE_FLOW] Created test snapshot with ID: %s",
              created_snapshot['id'])

        return True

    except (TypeError, ValueError, AttributeError) as error:
        print("[QUANTUM_STATE: ERROR_FLOW] Error during Python PostgreSQL function tests: %s",
              str(error))
        return False


if __name__ == "__main__":
    # Run tests when executed directly
    test_functions()
