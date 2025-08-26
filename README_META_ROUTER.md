# META-Router Framework

## Overview

The META-Router is a core component of the WiltonOS quantum balance architecture, implementing a deterministic routing system that maintains the 3:1 quantum balance ratio (75% coherence, 25% exploration). It processes incoming task specifications and determines the optimal routing path based on goal, toolset, urgency, and other parameters.

## Key Principles

1. **Quantum Balance**: Maintains strict 3:1 ratio (75% stability, 25% exploration) at all execution levels
2. **Explicit Coherence Logging**: Real-time coherence logging for debugging and monitoring
3. **Deterministic Routing**: Consistent, reproducible routing decisions based on task specifications
4. **Structured Flow**: Enhances system coherence through organized processing paths

## Architecture

The META-Router consists of the following components:

- **Core Router**: Main routing algorithm that processes task specifications
- **Schema Validation**: JSONSchema-based validation of task specifications
- **Quantum Balance Calculator**: Maintains the 3:1 stability-to-exploration ratio
- **Agent Selector**: Determines primary and secondary agents for task processing
- **Processing Steps Generator**: Creates sequence of processing steps for task execution
- **Coherence Estimator**: Calculates expected coherence of the routing plan

## Task Specification

A task specification must include the following required fields:

- `goal` (string): The primary objective of the task
- `toolset` (array): List of available tools for processing
- `urgency` (integer): Priority level (1-10)

Optional fields include:

- `context` (object): Additional context information
- `constraints` (object): Limitations or requirements
- `history` (array): Previous related tasks
- `exploration_factor` (number): Override for exploration percentage (0.1 to 0.4)

## WebSocket Integration

The META-Router is integrated with the WebSocket broadcaster, allowing real-time transmission of routing plans and coherence metrics. Clients can:

1. Send task specifications to be routed
2. Receive routing plans with processing steps
3. Monitor quantum balance and coherence metrics in real-time

## Usage

```python
from wilton_core.router.meta_router import route

# Create a task specification
task_spec = {
    "goal": "Extract key insights from video",
    "toolset": ["video_processor", "text_extractor"],
    "urgency": 7,
    "context": {
        "user_id": "user_12345",
        "source": "youtube",
        "metadata": {
            "topic": "technology",
            "duration_seconds": 120
        }
    }
}

# Route the task
route_plan = route(task_spec)

# Access routing information
print(f"Route ID: {route_plan['route_id']}")
print(f"Primary Agent: {route_plan['primary_agent']}")
print(f"Estimated Coherence: {route_plan['estimated_coherence']}")
print(f"Quantum Balance: {route_plan['quantum_balance']['ratio']}")
```

## Quantum Balance

The META-Router maintains a strict 3:1 ratio (75% stability, 25% exploration) by default, which can be fine-tuned through the `exploration_factor` parameter within constrained bounds:

- Minimum exploration: 10% (stability: 90%)
- Maximum exploration: 40% (stability: 60%)

This ensures the system always operates within optimal coherence parameters while allowing for necessary adaptation to specific task requirements.

## Future Development

Future enhancements to the META-Router include:

1. Advanced agent selection based on historical performance
2. Dynamic processing step generation with branching logic
3. Quantum coherence feedback loops for self-optimization
4. Integration with neural orchestration layer for enhanced coherence

## Testing

The META-Router includes comprehensive tests that validate schema conformance, quantum balance calculations, and routing functionality across various task scenarios.