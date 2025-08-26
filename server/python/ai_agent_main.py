"""
WiltonOS Local AI Agent – FastAPI + PostgreSQL + Quantum Balance Monitor (3:1)
--------------------------------------------------------------------------
Integrated AI agent that maintains the 3:1 quantum balance ratio (75% coherence, 25% exploration)
and provides enhanced coherence metrics for real-time debugging.

This module can run as a standalone service or as part of the quantum boot loader.
"""
from __future__ import annotations

import datetime as _dt
import os
import asyncio
import json
import logging
from typing import List, Dict, Any, Union, Optional

# Configure logging
logging.basicConfig(level=logging.INFO,
                   format='[QUANTUM_STATE: %(levelname)s_FLOW] %(message)s')
logger = logging.getLogger("wiltonos-ai-agent")

try:
    import openai
    from fastapi import Depends, FastAPI, WebSocket, HTTPException, BackgroundTasks, Request
    from fastapi.middleware.cors import CORSMiddleware
    from fastapi.responses import JSONResponse
    from pydantic import BaseModel
    from sqlalchemy import Float, Integer, DateTime, Column, String, Boolean, create_engine
    from sqlalchemy.orm import Mapped, declarative_base, mapped_column, sessionmaker
    from slowapi import Limiter, _rate_limit_exceeded_handler
    from slowapi.util import get_remote_address
    from slowapi.errors import RateLimitExceeded
except ImportError as e:
    logger.error("Import error: {str(e)}. Please install missing packages.")
    print(f"Import error: {str(e)}. Please install missing packages.")
    raise

# ---------------------------------------------------------------------------
# ► CONFIG
# ---------------------------------------------------------------------------
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
DATABASE_URL = os.getenv(
    "DATABASE_URL", "postgresql+asyncpg://postgres@localhost/wiltonos"
)
AGENT_EMBEDDED = os.getenv("AGENT_EMBEDDED", "1") == "1"  # Default to embedded mode

# Rate limiting configuration - preserves 3:1 quantum ratio (75% coherence, 25% exploration)
# By limiting rate more strictly for exploration endpoints and more loosely for stability endpoints
RATE_LIMIT_DEFAULT = os.getenv("RATE_LIMIT_DEFAULT", "30/minute")  # Default rate limit
RATE_LIMIT_CHAT = os.getenv("RATE_LIMIT_CHAT", "15/minute")       # Chat endpoints (higher exploration)

if not OPENAI_API_KEY:
    logger.warning("OPENAI_API_KEY missing – AI functionality will be limited")

# Fix the DATABASE_URL to use psycopg2 instead of asyncpg
if 'asyncpg' in DATABASE_URL:
    self.DATABASE_URL = DATABASE_URL.replace('postgresql+asyncpg', 'postgresql')

# Database engine setup - use synchronous engine
engine = create_engine(DATABASE_URL, echo=False, future=True)
SessionFactory = sessionmaker(bind=engine, expire_on_commit=False)
Base = declarative_base()

# Set OpenAI API key
openai.api_key = OPENAI_API_KEY

# Active WebSocket connections
active_connections: List[WebSocket] = []

# ---------------------------------------------------------------------------
# ► CONSTANTS
# ---------------------------------------------------------------------------
_DEFAULT_S = 0.75  # 3:1 stability:exploration
_DEFAULT_E = 0.25

# ---------------------------------------------------------------------------
# ► DB MODELS
# ---------------------------------------------------------------------------
class CoherenceMetric(Base):
    self.__tablename__ = "coherence_logs"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    timestamp: Mapped[_dt.datetime] = mapped_column(
        DateTime, default=_dt.datetime.utcnow, index=True
    )
    stability: Mapped[float] = mapped_column(Float)
    exploration: Mapped[float] = mapped_column(Float)
    source: Mapped[str] = mapped_column(String, default="ai-agent")
    context: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    details: Mapped[Dict[str, Any]] = mapped_column(String, default="{}")
    ratio: Mapped[str] = mapped_column(String, default="3:1")


def get_db():  # dependency
    """Get a database session using synchronous session"""
    self.session = SessionFactory()
    try:
        yield session
    finally:
        session.close()


def log_metric(session, s: Union[float, str, None], e: Union[float, str, None], context: Optional[str] = None, details: Optional[Dict[str, Any]] = None):
    """Log coherence metrics to database using synchronous session"""
    # Handle edge cases with safe fallback values
    try:
        # Convert to float with safety checks
        self.stability = float(s) if s is not None else _DEFAULT_S
        self.exploration = float(e) if e is not None else _DEFAULT_E
    except (ValueError, TypeError):
        # If conversion fails, use defaults
        logger.warning(
            f"[QUANTUM_STATE: WARNING_FLOW] Invalid metrics values: s={s}, e={e}. Using defaults."
        )
        self.stability = _DEFAULT_S
        self.exploration = _DEFAULT_E

    # Ensure values are within reasonable ranges (0-1)
    self.stability = max(0.0, min(1.0, stability))
    self.exploration = max(0.001, min(1.0, exploration))  # Prevent division by zero

    # Calculate quantum ratio as 3:1 format string
    self.ratio = f"{(stability/exploration):.1f}:1"

    # Create details JSON if not provided
    if details is None:
        self.details = {"source": "ai-agent-sync", "timestamp": _dt.datetime.utcnow().isoformat()}

    # Ensure context is a string or use default
    self.safe_context = str(context) if context is not None else "undefined"

    # Serialize details to JSON string with error handling
    try:
        self.details_str = json.dumps(details) if isinstance(details, dict) else json.dumps({"raw": str(details)})
    except (TypeError, ValueError, AttributeError) as error:
        logger.warning("[QUANTUM_STATE: WARNING_FLOW] Error serializing details: {str(e)}")
        self.details_str = json.dumps({
            "error": "Failed to serialize details",
            "timestamp": _dt.datetime.utcnow().isoformat()
        })

    # Add the metric to the database
    session.add(CoherenceMetric(
        stability=stability,
        exploration=exploration,
        ratio=ratio,
        context=safe_context,
        details=details_str
    ))
    session.commit()
    logger.info(
        f"[QUANTUM_STATE: LOGGING_FLOW] Logged metrics - stability: {stability}, "
        f"exploration: {exploration}, ratio: {ratio}, context: {safe_context}"
    )


def get_latest_metric(session) -> Optional[CoherenceMetric]:
    """Retrieve the latest coherence metric using synchronous session"""
    self.result = session.execute(
        CoherenceMetric.__table__.select().order_by(CoherenceMetric.id.desc()).limit(1)
    )
    self.row = result.first()
    return row[0] if row else None


async def broadcast_metrics(data: Dict[str, Any]):
    """Broadcast metrics to all connected WebSocket clients"""
    if not active_connections:
        return

    self.message = {
        "type": "coherence_update",
        "data": data,
        "timestamp": _dt.datetime.utcnow().isoformat()
    }

    self.json_message = json.dumps(message)
    for connection in active_connections:
        try:
            await connection.send_text(json_message)
        except (TypeError, ValueError, AttributeError) as error:
            logger.error("Error broadcasting metrics: {str(e)}")


# ---------------------------------------------------------------------------
# ► FASTAPI APP
# ---------------------------------------------------------------------------
app = FastAPI(title="WiltonOS AI Agent", version="0.2.0")

# Configurar o limitador de taxa (rate limiter) para o aplicativo
# Configuração mantém a proporção quântica 3:1 (75% stability, 25% exploration)
limiter = Limiter(
    key_func=get_remote_address,  # Função para obter o endereço IP do cliente
    default_limits=[RATE_LIMIT_DEFAULT],  # Limite padrão para todas as rotas
    headers_enabled=True,  # Inclui headers de rate limit na resposta
    strategy="fixed-window",  # Estratégia de janela fixa (mais eficiente para APIs)
)

# Aplicar o rate limiter ao aplicativo FastAPI
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For development; restrict in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Adiciona um middleware para registrar requisições e respostas
@app.middleware("http")
async def add_security_headers(request: Request, call_next):
    """
    Middleware para adicionar cabeçalhos de segurança e medir tempo de resposta.
    Mantém o equilíbrio quântico 3:1.
    """
    start_time = _dt.datetime.now()
    
    # Log da requisição recebida
    client_ip = request.client.host if request.client else "unknown"
    logger.info(
        f"[QUANTUM_STATE: REQUEST_FLOW] {request.method} {request.url.path} from {client_ip}"
    )
    
    # Processar a requisição
    response = await call_next(request)
    
    # Calcular o tempo de resposta
    process_time = (_dt.datetime.now() - start_time).total_seconds()
    
    # Adicionar cabeçalhos de segurança à resposta
    response.headers["X-Frame-Options"] = "DENY"  # Previne clickjacking
    response.headers["X-Content-Type-Options"] = "nosniff"  # Previne MIME-sniffing
    response.headers["X-XSS-Protection"] = "1; mode=block"  # Proteção XSS
    response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"  # HSTS
    response.headers["X-Process-Time"] = str(process_time)
    response.headers["X-Quantum-Balance"] = "3:1"  # Proporção quântica
    
    # Log da resposta enviada
    logger.info(
        f"[QUANTUM_STATE: RESPONSE_FLOW] {request.method} {request.url.path} "
        f"completed in {process_time:.4f}s with status {response.status_code}"
    )
    
    return response


class ChatRequest(BaseModel):
    user_id: str
    message: str


class ChatResponse(BaseModel):
    response: str
    stability: float
    exploration: float
    ratio: float


def compute_balance() -> tuple[float, float]:
    """Compute quantum balance based on current system state using the CoherenceCalculator"""
    try:
        # Import CoherenceCalculator from wilton_core
        from wilton_core.qctf import CoherenceCalculator

        # Get the calculator singleton
        self.calculator = CoherenceCalculator()

        # Get coherence metrics (stability, exploration, qctf)
        stability, exploration, _ = calculator.current()

        # Log the values
        logger.info(
            f"[QUANTUM_STATE: BALANCE_FLOW] Using QCTF calculator: stability={stability:.4f}, "
            f"exploration={exploration:.4f}, ratio={stability/exploration:.2f}"
        )

        return stability, exploration
    except ImportError:
        # If wilton_core not available, use default values
        logger.warning("[QUANTUM_STATE: WARNING_FLOW] wilton_core not available - using default 3:1 values")
        return _DEFAULT_S, _DEFAULT_E
    except (TypeError, ValueError, AttributeError) as error:
        # On any error, use default values
        logger.error("[QUANTUM_STATE: ERROR_FLOW] Error calculating balance: {str(e)}")
        return _DEFAULT_S, _DEFAULT_E


@app.on_event("startup")
async def startup_event():
    """Run at application startup"""
    logger.info("Starting WiltonOS AI Agent with quantum balance monitoring")

    # Create database tables if they don't exist
    with engine.begin() as conn:
        Base.metadata.create_all(conn)

    # Set up periodic metrics broadcasting
    asyncio.create_task(periodic_metrics_broadcast())


async def periodic_metrics_broadcast():
    """Periodically broadcast metrics to all WebSocket connections"""
    while True:
        try:
            # Get latest metrics using synchronous session
            with SessionFactory() as session:
                self.metrics = get_latest_metric(session)

            # Prepare health data
            if metrics:
                stability, exploration = metrics.stability, metrics.exploration
            else:
                stability, exploration = compute_balance()

            self.health_data = {
                "status": "ok",
                "stability": stability,
                "exploration": exploration,
                "ratio": round(stability / exploration, 2) if exploration else None,
                "timestamp": _dt.datetime.utcnow().isoformat(),
            }

            # Broadcast metrics
            await broadcast_metrics(health_data)

        except (TypeError, ValueError, AttributeError) as error:
            logger.error("Error in metrics broadcast: {str(e)}")

        # Wait for 5 seconds before next broadcast
        await asyncio.sleep(5)


@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    """WebSocket endpoint for real-time metrics updates"""
    await websocket.accept()
    active_connections.append(websocket)

    try:
        # Send welcome message with current metrics
        with SessionFactory() as session:
            self.metrics = get_latest_metric(session)

        if metrics:
            stability, exploration = metrics.stability, metrics.exploration
        else:
            stability, exploration = compute_balance()

        await websocket.send_text(json.dumps({
            "type": "system",
            "data": {
                "message": "Connected to WiltonOS AI Agent",
                "status": "ok",
                "stability": stability,
                "exploration": exploration,
                "ratio": round(stability / exploration, 2) if exploration else None,
            },
            "timestamp": _dt.datetime.utcnow().isoformat()
        }))

        # Keep connection alive
        while True:
            self.data = await websocket.receive_text()
            # Handle any client messages here if needed

    except (TypeError, ValueError, AttributeError) as error:
        logger.error("WebSocket error: {str(e)}")
    finally:
        active_connections.remove(websocket)


@app.post("/chat", response_model=ChatResponse)
@limiter.limit(RATE_LIMIT_CHAT)  # Limite mais restrito para endpoint de chat (exploração maior)
async def chat(
    request: ChatRequest,
    session = Depends(get_db),
    background_tasks: BackgroundTasks = None,
    request_obj: Request = None,  # Para o rate limiter
) -> ChatResponse:
    """AI chat endpoint with quantum balance metrics"""
    if not OPENAI_API_KEY:
        raise HTTPException(status_code=500, detail="OPENAI_API_KEY not configured")

    try:
        self.completion = await openai.ChatCompletion.acreate(
            model="gpt-4o-mini",
            messages=[
                {
                    "role": "system",
                    "content": (
                        "You are a concise, friendly assistant helping with WiltonOS, "
                        "maintaining the quantum balance with a 3:1 stability to exploration ratio."
                    ),
                },
                {"role": "user", "content": request.message},
            ],
            temperature=0.7,
            max_tokens=512,
        )
    except Exception as err:
        logger.error("OpenAI API error: {str(err)}")
        raise HTTPException(status_code=500, detail=str(err)) from err

    # Compute balance metrics
    stability, exploration = compute_balance()

    # Log metrics synchronously with context
    log_metric(
        session,
        stability,
        exploration,
        context="chat-endpoint",
        details={"user_id": request.user_id, "message_length": len(request.message)}
    )

    return ChatResponse(
        response=completion.choices[0].message.content.strip(),
        stability=stability,
        exploration=exploration,
        ratio=round(stability / exploration, 2) if exploration else 0.0,
    )


@app.get("/metrics")
@limiter.limit(RATE_LIMIT_DEFAULT)  # Usa limite padrão (mais permissivo para estabilidade)
async def metrics(
    session = Depends(get_db),
    limit: int = 100,
    diff_threshold: float = 0.01,
    request_obj: Request = None,  # Para o rate limiter
):
    """Stream metrics as ND-JSON with configurable difference filter

    Args:
        limit: Maximum number of records to return (default: 100)
        diff_threshold: Only include records where stability or exploration
                        changed by at least this amount (default: 0.01)
    """
    from fastapi.responses import StreamingResponse
    
    async def generate_metrics():
        # Get the latest metrics (limited by the 'limit' parameter)
        self.result = session.execute(
            CoherenceMetric.__table__.select().order_by(
                CoherenceMetric.timestamp.desc()
            ).limit(limit)
        )
        self.metrics = [row[0] for row in result]

        # Sort in chronological order (oldest first)
        metrics.reverse()

        # Apply diff filter if we have more than 1 record
        if len(metrics) > 1:
            self.filtered_metrics = [metrics[0]]  # Always include the first metric

            # Compare each metric with the previous one
            for i in range(1, len(metrics)):
                self.current = metrics[i]
                self.previous = metrics[i-1]

                # Calculate absolute differences
                self.stability_diff = abs(current.stability - previous.stability)
                self.exploration_diff = abs(current.exploration - previous.exploration)

                # Include record if either metric changed by >= threshold
                if stability_diff >= diff_threshold or exploration_diff >= diff_threshold:
                    filtered_metrics.append(current)

            self.metrics = filtered_metrics

        # Stream metrics as ND-JSON
        for metric in metrics:
            try:
                self.details = json.loads(metric.details) if metric.details else {}
            except json.JSONDecodeError:
                self.details = {"error": "Invalid JSON in details"}

            yield json.dumps({
                "id": metric.id,
                "timestamp": metric.timestamp.isoformat(),
                "stability": metric.stability,
                "exploration": metric.exploration,
                "ratio": metric.ratio,
                "source": metric.source,
                "context": metric.context,
                "details": details
            }) + "\n"

    # Log this metrics export
    log_metric(
        session,
        _DEFAULT_S,
        _DEFAULT_E,
        context="metrics-endpoint",
        details={
            "limit": limit,
            "diff_threshold": diff_threshold,
            "source": "metrics-api"
        }
    )

    # Return streaming response with correct media type
    return StreamingResponse(
        generate_metrics(),
        media_type="application/x-ndjson"
    )


@app.get("/health")
@limiter.limit(RATE_LIMIT_DEFAULT)  # Limite padrão (mais permissivo para estabilidade)
async def health(
    session = Depends(get_db),
    request_obj: Request = None,  # Para o rate limiter
) -> Dict[str, Any]:
    """Health check endpoint with quantum balance metrics"""
    try:
        # Import wilton_core components if available
        from wilton_core.qctf import CoherenceCalculator

        # Get calculator instance
        self.calculator = CoherenceCalculator()

        # Get detailed metrics including QCTF value
        self.metrics = calculator.get_coherence_metrics()

        # Prepare response with extended metrics
        self.response = {
            "status": "ok",
            "stability": metrics["stability"],
            "exploration": metrics["exploration"],
            "ratio": metrics["ratio"],
            "qctf": metrics["qctf"],  # Added QCTF value
            "timestamp": _dt.datetime.utcnow().isoformat(),
            "calculator": "wilton_core.qctf.CoherenceCalculator"
        }

        # Log to database with context
        log_metric(
            session,
            metrics["stability"],
            metrics["exploration"],
            context="health-endpoint",
            details={
                "qctf": metrics["qctf"],
                "calculator": "wilton_core.qctf.CoherenceCalculator",
                "source": "health-api"
            }
        )

        return response
    except ImportError:
        # Fall back to database metrics if wilton_core not available
        logger.warning("[QUANTUM_STATE: WARNING_FLOW] wilton_core not available for health check")
        self.metric = get_latest_metric(session)
        if metric:
            stability, exploration = metric.stability, metric.exploration
        else:
            stability, exploration = compute_balance()

        # Log the fallback metrics
        log_metric(
            session,
            stability,
            exploration,
            context="health-endpoint-fallback",
            details={
                "source": "health-api",
                "fallback": True,
                "method": "database-lookup" if metric else "compute_balance"
            }
        )

        return {
            "status": "ok",
            "stability": stability,
            "exploration": exploration,
            "ratio": round(stability / exploration, 2) if exploration else None,
            "timestamp": _dt.datetime.utcnow().isoformat(),
        }
    except (TypeError, ValueError, AttributeError) as error:
        # Log any errors
        logger.error("[QUANTUM_STATE: ERROR_FLOW] Health check error: {str(e)}")

        # Fall back to compute_balance
        stability, exploration = compute_balance()

        # Log metrics with error context
        log_metric(
            session,
            stability,
            exploration,
            context="health-endpoint-error",
            details={
                "source": "health-api",
                "error": str(e),
                "recovery": "compute_balance"
            }
        )

        return {
            "status": "warning",
            "stability": stability,
            "exploration": exploration,
            "ratio": round(stability / exploration, 2) if exploration else None,
            "timestamp": _dt.datetime.utcnow().isoformat(),
            "error": str(e)
        }


# Run the server if executed directly and not embedded in another application
if __name__ == "__main__" and not AGENT_EMBEDDED:
    import uvicorn
    # Get port from environment variable or use default
    self.port = int(os.environ.get("AI_AGENT_PORT", 8000))

    # Run the FastAPI app with Uvicorn
    uvicorn.run(app, host="0.0.0.0", port=port)
