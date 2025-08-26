# META-Router Framework

The META-Router is a core component of the WiltonOS Quantum Computational Platform, responsible for intelligent task routing while maintaining the 3:1 quantum balance ratio (75% coherence, 25% exploration).

## Overview

The META-Router analyzes incoming task specifications and determines the optimal processing path based on:
- Task goal and purpose
- Available tools and capabilities
- Urgency and priority level
- Context and constraints
- System quantum balance state

## Features

- **3:1 Quantum Balance**: Maintains the critical 75% stability, 25% exploration ratio
- **Explicit Coherence Logging**: Real-time debugging through quantum-aware logging
- **Schema Validation**: JSON Schema validation of all task specifications
- **Deterministic Routing**: Consistent routing decisions for identical inputs
- **WebSocket Broadcasting**: Real-time routing plan updates to connected clients

## Usage

### Basic Example

```python
from wilton_core.router import route

# Define a task specification
task_spec = {
    "goal": "Analyze sentiment in customer feedback",
    "toolset": ["text_analyzer", "sentiment_classifier", "summarizer"],
    "urgency": 7,
    "context": {
        "user_id": "user_12345",
        "source": "customer_support",
        "metadata": {
            "language": "en",
            "product": "WiltonOS Pro"
        }
    }
}

# Route the task
route_plan = route(task_spec)

# Process the routing plan
print(f"Route ID: {route_plan['route_id']}")
print(f"Primary Agent: {route_plan['primary_agent']}")
print(f"Estimated Coherence: {route_plan['estimated_coherence']:.2f}")
print(f"Quantum Balance: {route_plan['quantum_balance']['ratio']}")
```

### Advanced Example with WebSocket Integration

```python
import json
from wilton_core.router import route
from wilton_core.websocket.broadcaster import broadcast_message

def process_incoming_task(task_json):
    # Parse the incoming task
    task_spec = json.loads(task_json)
    
    # Route the task
    route_plan = route(task_spec)
    
    # Broadcast the routing plan to all connected clients
    broadcast_message({
        "type": "route_plan",
        "data": route_plan,
        "timestamp": datetime.utcnow().isoformat()
    })
    
    # Continue with task processing
    return route_plan
```

## Schema

The META-Router validates task specifications against a JSON schema with these required fields:

- `goal`: The primary objective of the task (string)
- `toolset`: List of available tools for processing (array of strings)
- `urgency`: Priority level from 1-10 (integer)

Optional fields include:

- `context`: Additional contextual information (object)
- `constraints`: Limitations or requirements (object)
- `history`: Previous related tasks (array)
- `exploration_factor`: Override for exploration percentage (number, default 0.25)
- `quantum_parameters`: Advanced configuration (object)

For the complete schema, see `wilton_core/router/meta_router_schema.json`.

## Quantum Balance

The META-Router maintains a 3:1 quantum balance ratio:
- 75% stability (coherence)
- 25% exploration (innovation)

This ratio is essential for optimal system performance and can be fine-tuned using the `exploration_factor` parameter.

## Integration with WebSocket Dashboard

The META-Router integrates with the WebSocket broadcaster to emit `route_plan` messages whenever a new task is routed. These messages can be visualized in real-time on the META-Routing Dashboard.

## Development Guidelines

When extending the META-Router:

1. Maintain the 3:1 quantum balance ratio at all times
2. Use explicit quantum state logging via `[QUANTUM_STATE: X_FLOW]` format
3. Ensure all new parameters are documented in the schema
4. Add comprehensive tests for any new routing logic
5. Update this documentation with examples of new features

## Testing

Run the test suite with:

```bash
# Run basic tests
pytest tests/test_meta_router.py

# Check test coverage
pytest --cov=wilton_core/router tests/test_meta_router.py
```