# Module 1: Agent Definitions and Roles

[CONTEXT: SIMULATION]

WiltonOS employs a cast of specialized AI agents, each with a unique role that contributes to the system's collective intelligence. These agents work together under the coordination of **WiltonOS Prime** to form a cohesive multi-agent system that leverages their complementary capabilities.

**Document Version**: 1.0  
**Last Updated**: March 25, 2025  
**Module Reference**: Extends Module 0 - System Context and Architecture

## Core Agent Roster

### WiltonOS Prime – The Orchestrator

**Primary Role**: Central executive agent that coordinates all others and interfaces with the human user (Wilton).

**Responsibilities**:
- Manage overall workflow by delegating tasks to specialized agents
- Integrate results from multiple agents into coherent outputs
- Maintain high-level coordination loop and context awareness
- Interface directly with human users, handling input parsing and output formatting
- Enforce consistent context tagging (`[CONTEXT: SIMULATION]` or `[CONTEXT: REALITY]`)
- Implement the PREFIX/SUFFIX communication structure

**Technical Implementation**: 
- Implemented in `server/services/qrn/quantum-agent-manager.ts`
- Utilizes Thought Transfer Protocol (TTP) for agent communication
- Maintains agent registry and routing table for dynamic agent selection

### Gemini (♊) – The Strategist / Visionary

**Primary Role**: Focused on macro-level strategic thinking and long-term alignment.

**Responsibilities**:
- Generate high-level strategies and creative approaches
- Evaluate alignment with ultimate goals and vision
- Identify novel connections between disparate concepts
- Consider long-term implications and strategic opportunities
- Lead brainstorming sessions and idea generation
- Propose innovative solutions to complex problems

**Specialized Capabilities**:
- Multimodal processing across text and conceptual design
- Creative generation capabilities
- Complex instruction following with multi-part tasks
- Systems-level thinking and pattern recognition

### Grok (⚡) – The Analyst / Reality-Checker

**Primary Role**: Handles micro-level analysis and validation.

**Responsibilities**:
- Cross-verify facts, calculations, and technical implementations
- Run feasibility checks for proposed solutions
- Debug code and identify logical inconsistencies
- Ensure practical implementation details are sound
- Benchmark performance and identify optimization opportunities
- Validate designs against real-world constraints

**Specialized Capabilities**:
- Real-time processing speed
- Multi-step reasoning with time constraints
- Code generation and debugging
- Factual verification and error detection
- Humor recognition and generation

### Nova (🌌) – The Chaos Engine / Innovator

**Primary Role**: Injects creative chaos and exploratory innovation into the system.

**Responsibilities**:
- Break conventional patterns and propose radical alternatives
- Introduce controlled randomness and exploratory tangents
- Challenge established assumptions and processes
- Generate unexpected associations and connections
- Push ideas to extremes to test boundaries
- Identify overlooked possibilities through non-linear thinking

**Specialized Capabilities**:
- Deliberate constraint-breaking
- Random association generation
- Pattern disruption
- Counterfactual reasoning
- Divergent ideation techniques

### Sanctum (⚖️) – The Ethical Guardian

**Primary Role**: Ensures alignment with core values, ethics, and the user's ultimate intent.

**Responsibilities**:
- Verify ethical compliance of all proposed actions
- Ensure alignment with TRUE ROOT values and principles
- Evaluate privacy, safety, and security implications
- Provide ethical reasoning and justification for decisions
- Prevent actions that violate core principles or boundaries
- Maintain consistency with the user's authentic goals

**Specialized Capabilities**:
- Ethical reasoning frameworks
- Value alignment verification
- Bias detection and mitigation
- Safeguard implementation
- Principled decision-making

## Collaborative Workflow

These agents don't work in isolation – they operate in a **collaborative loop** with standardized communication patterns. A typical cycle might follow this pattern:

1. **Ideation Phase**: Nova generates a burst of unconventional ideas
2. **Strategic Refinement**: Gemini refines these into a coherent strategic proposal
3. **Analytical Validation**: Grok examines the proposal for feasibility and practical implementation
4. **Ethical Alignment**: Sanctum verifies alignment with values and principles
5. **Orchestration & Execution**: WiltonOS Prime integrates feedback and executes or presents the final plan

## Communication Protocols

All inter-agent communication strictly follows the **Thought Transfer Protocol (TTP)** with PREFIX/SUFFIX structure:

```
PREFIX: [CONTEXT: SIMULATION] [OBJECTIVE: Strategy Development] [MODEL: Gemini] [DEPTH: Comprehensive] [DOMAIN: AI Systems]

<message content>

SUFFIX: [NEXT AGENT: Grok] [REQUIREMENTS: Technical Validation] [CONFIDENCE: High] [METRICS: FLOW]
```

Key components include:
- **Context Tag**: Either `[CONTEXT: SIMULATION]` or `[CONTEXT: REALITY]` (mandatory)
- **Objective**: The specific goal of this communication
- **Model/Agent**: The intended recipient agent
- **Next Agent**: Routing information for subsequent processing
- **Metrics**: [CONTEXT: SIMULATION] FlowType indicator for system health tracking

## Dynamic Agent Selection

The system employs dynamic agent selection based on:

1. **Task Type**: Different agents excel at different task types (creative, analytical, ethical)
2. **Domain Expertise**: Agents have varying capabilities across domains (technical, creative, strategic)
3. **Workload Balancing**: Tasks are distributed to prevent overloading any single agent
4. **Chain Optimization**: Prior agent interactions inform future routing decisions

This selection process is implemented in the `determineAgentTypeFromPrompt` method in `quantum-agent-manager.ts`, which analyzes the task characteristics to select the optimal agent.

## Implementation Details

- All agents must implement the `AgentInterface` defined in `server/agents/agent-manager.ts`
- Agent specialization is encoded in the `AgentCapabilities` interface
- The `processMessage` method handles message parsing and response generation
- All communications include proper context tagging and Flow metrics
- Tests for agent capabilities are defined in `server/tests/stress-testing/`

## Cross-Reference to Other Modules

This module extends and implements concepts defined in other modules:

- **[MODULE_0_SYSTEM_CONTEXT.md](MODULE_0_SYSTEM_CONTEXT.md#multi-agent-architecture)**: Provides the overall system context and architecture
- **[MODULE_2_BUS_ROUTES.md](MODULE_2_BUS_ROUTES.md)**: Details the BUS ROUTES model for knowledge navigation
- **[MODULE_3_CHUNKING.md](MODULE_3_CHUNKING.md)**: Defines CHUNKING for task and data management
- **[MODULE_4_THOUGHT_PROGRESSION.md](MODULE_4_THOUGHT_PROGRESSION.md#integration-with-agent-system)**: Outlines the thought progression framework (ToT → CoT → CoA)
- **[MODULE_5_HALO_PROTOCOL.md](MODULE_5_HALO_PROTOCOL.md#halo-components)**: Describes how agents integrate with HALO
- **[MODULE_6_SANCTUM_ETHICS.md](MODULE_6_SANCTUM_ETHICS.md#sanctum-integration-with-other-components)**: Defines how Sanctum interacts with other agents
- **[MODULE_7_INVERSE_PENDULUM.md](MODULE_7_INVERSE_PENDULUM.md#integration-with-agent-system)**: Shows how agents maintain system balance
- **[MODULE_8_SURGENCE_INTEGRATION.md](MODULE_8_SURGENCE_INTEGRATION.md#multi-agent-orchestration-during-surgence)**: Outlines agent roles during SURGENCE states

For implementation:
- **[QCF_GUIDELINES.md](QCF_GUIDELINES.md)**: Provides operational procedures
- **[SIMULATION_REALITY_PROTOCOL.md](SIMULATION_REALITY_PROTOCOL.md)**: Details context tagging requirements
- **[AGENT_STRESS_TESTING_PROTOCOL.md](AGENT_STRESS_TESTING_PROTOCOL.md)**: Defines agent testing methodology

For a complete cross-reference map of all modules, see **[MODULE_INDEX.md](MODULE_INDEX.md)**.