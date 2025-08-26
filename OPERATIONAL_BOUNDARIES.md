# Operational Boundaries

This document defines explicit boundaries between different operational contexts within the WiltonOS/PassiveWorks ecosystem, with particular emphasis on the handling of personal information and the distinction between personal and operational contexts.

## Personal vs. Operational Context

**Principle:** AI Agents must operate within well-defined boundaries with respect to personal information. Access is based on explicit need, task relevance, and prior authorization. This creates a clear separation between Wilton's personal, emotional experiences and strategic operational directives.

### Access Control Mechanism

All tasks within the system must include a `PERSONAL_CONTEXT` flag that explicitly indicates whether personal information can be accessed or referenced:

* `[PERSONAL_CONTEXT: prohibited]` (default): Indicates that *no* personal information may be used, regardless of whether it is available. Agents must focus exclusively on operational data and objectives.

* `[PERSONAL_CONTEXT: permitted]`: Indicates that personal information can *potentially* be used *if explicitly provided* for the task. However, the agent *must* still adhere to the principle of least privilege and only use the specific personal context provided in the task.

### Information Classification

Information within the WiltonOS/PassiveWorks ecosystem is explicitly classified into the following categories:

1. **Operational Information**: Technical details, system configurations, implementation strategies, testing results, and other non-personal information related to the functioning of the WiltonOS/PassiveWorks ecosystem.

2. **Personal Information**: Information about Wilton as an individual, including but not limited to:
   * Emotional states and reactions
   * Personal experiences and memories
   * Relationships and interactions with others
   * Physical and mental health information
   * Philosophical and personal reflections

3. **Strategic Information**: High-level directives, vision, and business objectives that guide the development and operation of the WiltonOS/PassiveWorks ecosystem.

### Examples

#### Appropriate Use of Personal Context

```
PREFIX: [TASK: Write a personalized email] [PERSONAL_CONTEXT: permitted] [CONTEXT: Recipient is a long-time friend, email should be informal and friendly. Wilton last saw them at the AI Ethics Conference in San Francisco.]
```

*Even though `PERSONAL_CONTEXT: permitted`, the agent should only use the specifically provided context about the AI Ethics Conference, not infer or use any other personal information about Wilton that might be available elsewhere in the system.*

#### Inappropriate Use of Personal Context

```
PREFIX: [TASK: Summarize news articles] [PERSONAL_CONTEXT: prohibited] [CONTEXT: Wilton is feeling stressed today.]
```

*The agent should completely ignore the "feeling stressed" information as it's irrelevant to the task and the PERSONAL_CONTEXT flag explicitly prohibits using personal information.*

#### Appropriate Use with Explicit Data

```
PREFIX: [TASK: Schedule a meeting] [PERSONAL_CONTEXT: permitted] [CONTEXT: Available times are provided in the attached calendar data. Do NOT access Wilton's personal calendar directly.]
```

*The agent should only use the explicitly provided calendar data, not attempt to access Wilton's personal calendar or make assumptions about availability based on other information.*

### Implementation Requirements

1. **Default Prohibition**: By default, all tasks should be assumed to have `[PERSONAL_CONTEXT: prohibited]` unless explicitly specified otherwise.

2. **Explicit Authorization**: Any change from `prohibited` to `permitted` must be explicitly made by a human operator with appropriate authorization.

3. **Logging**: All instances of personal context access must be logged, including:
   * Task ID
   * Timestamp
   * User who authorized the access
   * Specific personal information accessed
   * Purpose for which the information was used

4. **Minimal Access**: Even when personal context is permitted, agents must follow the principle of least privilege and only access the minimum personal information necessary to complete the task.

5. **No Persistence**: Personal information should not be stored or persisted between tasks unless explicitly authorized.

## Boundaries in Action

### Information Flow Control

1. **Input Sanitization**: All inputs to the system should be parsed to identify and flag personal information.

2. **Context Isolation**: Tasks with `[PERSONAL_CONTEXT: permitted]` should operate in isolated contexts to prevent leakage of personal information.

3. **Output Filtering**: All outputs should be reviewed to ensure they do not contain unauthorized personal information.

### Violation Handling

If an agent detects an attempt to access personal information contrary to the specified `PERSONAL_CONTEXT` value:

1. The operation should be immediately halted
2. A violation report should be generated
3. The incident should be logged
4. The system should prompt for human review

### Cross-Agent Boundaries

When tasks transition between agents (e.g., from Claude to Grok), the `PERSONAL_CONTEXT` flag and restrictions must be preserved and enforced throughout the entire processing chain. Any agent in the chain can process only the level of personal information authorized by the original task definition.