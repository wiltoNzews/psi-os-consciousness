# Symbolic Communication Protocol

The Symbolic Communication Protocol provides a standardized way to format and parse messages with symbolic prefixes, ensuring clear contextual information for all system logs, messages, and communications.

## Overview

The protocol uses a consistent prefix format of `[Timeline/State/Domain]` to provide contextual information about messages:

```
[Timeline/State/Domain] Message
```

For example:
```
[α/S+/💻] Code deployed successfully ✅
```

- **Timeline**: Alpha (`α`), Beta (`β`), etc. (e.g., `2025α`)
- **State**: Combines context (Simulation, Reality, Transition) with flow (Success, Failure, Partial)
- **Domain**: Emoji to indicate the specific component or area (e.g., 💻 for code, 🧪 for testing)
- **Suffix** (optional): Extra indicator like ✅ (success), ⚠️ (warning), etc.

## Core Components

### Core Utilities

The implementation consists of two main modules:

1. **symbolic-utils.js/ts**: Provides utilities for formatting messages with symbolic prefixes and parsing them
2. **symbolic-to-quantumstate.js/ts**: Provides utilities for converting between symbolic states and QuantumState enum values

These modules are implemented in both JavaScript and TypeScript to ensure maximum compatibility across the codebase.

### Key Functions

#### From symbolic-utils.js/ts

- `formatWithSymbolicPrefix(state, message, domain?, timeline?)`: Formats a message with the appropriate symbolic prefix
- `parseSymbolicPrefix(formattedMessage)`: Parses a message with symbolic prefix into its components
- `convertLegacyToSymbolic(legacyMessage)`: Converts from legacy format to symbolic format
- `addSymbolicSuffix(message, suffix)`: Adds a symbolic suffix to a message
- `createSymbolicReference(referenceType, reference)`: Creates a symbolic domain reference for inline use

#### From symbolic-to-quantumstate.js/ts

- `symbolToQuantumState(symbolicState)`: Converts a symbolic state representation to a QuantumState enum value
- `parseSymbolicPrefixToState(formattedMessage)`: Parses a message and converts the state to a QuantumState enum value
- `extractStateFromMessage(formattedMessage)`: Extracts the QuantumState from a formatted message
- `legacyMessageToState(legacyMessage)`: Converts a legacy formatted message directly to a QuantumState enum value
- `getQuantumStateDescription(state)`: Maps a QuantumState enum value to its human-readable description (TypeScript only)

## Example Usage

### Basic Formatting

```javascript
import { QuantumState } from '../../shared/schema-minimal.js';
import { formatWithSymbolicPrefix } from '../utils/symbolic-utils.js';

// Basic usage
console.log(formatWithSymbolicPrefix(
  QuantumState.SIM_FLOW, 
  "Task completed successfully"
));
// Output: [α/S+] Task completed successfully

// With domain
console.log(formatWithSymbolicPrefix(
  QuantumState.REAL_FLOW, 
  "Deployment successful", 
  "🚀"
));
// Output: [α/R+/🚀] Deployment successful

// With domain and timeline
console.log(formatWithSymbolicPrefix(
  QuantumState.TRANSITION_TO_REAL, 
  "Transitioning to production", 
  "🚀", 
  "2025α"
));
// Output: [2025α/T>R/🚀] Transitioning to production
```

### Parsing Messages

```javascript
import { parseSymbolicPrefix } from '../utils/symbolic-utils.js';

const message = "[α/S+/💻] Task completed successfully";
const parsed = parseSymbolicPrefix(message);
console.log(parsed);
// Output: { 
//   timeline: "α", 
//   state: "S+", 
//   domain: "💻", 
//   message: "Task completed successfully" 
// }
```

### Converting Symbolic States to QuantumState

```javascript
import { symbolToQuantumState } from '../utils/symbolic-to-quantumstate.js';

const state = symbolToQuantumState('S+');
console.log(state); // Output: "SIM_FLOW"
```

### Full Integration Example

For complete examples demonstrating the full capabilities of the Symbolic Communication Protocol, see:

- `server/examples/symbolic-integration-example.js`: Demonstrates a full integration cycle
- `server/examples/symbolic-logging-example.js`: Demonstrates a practical logging system using the protocol

## Mapping Tables

### State Mappings

| Symbolic State | QuantumState Enum       | Description                  |
|----------------|-------------------------|------------------------------|
| `S+`           | `SIM_FLOW`             | Simulation Success           |
| `S-`           | `SIM_ANTIFLOW`         | Simulation Failure           |
| `S~`           | `SIM_PARTIAL`          | Simulation Partial Success   |
| `R+`           | `REAL_FLOW`            | Reality Success              |
| `R-`           | `REAL_ANTIFLOW`        | Reality Failure              |
| `R~`           | `REAL_PARTIAL`         | Reality Partial Success      |
| `T>R`          | `TRANSITION_TO_REAL`   | Transitioning to Reality     |
| `T>S`          | `TRANSITION_TO_SIM`    | Transitioning to Simulation  |

### Common Domain Emojis

| Emoji | Domain                 | Example                            |
|-------|------------------------|-----------------------------------|
| `💻`  | Code/Development       | `[α/S+/💻] Code refactored.`       |
| `🧪`  | Testing                | `[α/S+/🧪] Tests passed.`          |
| `🚀`  | Deployment/Performance | `[α/R+/🚀] Deployment successful.` |
| `📊`  | Data/Analytics         | `[α/S+/📊] Data processed.`        |
| `🔒`  | Security               | `[α/R+/🔒] Security audit passed.` |
| `🔌`  | Networking/Connections | `[α/R-/🔌] Connection lost.`       |
| `💾`  | Database/Storage       | `[α/S+/💾] Data saved.`            |
| `⚙️`  | System/Configuration   | `[α/S+/⚙️] System configured.`     |

## Migration from Legacy Format

The system supports automatic conversion from the legacy format to the new symbolic format:

```javascript
import { convertLegacyToSymbolic } from '../utils/symbolic-utils.js';

const legacyMessage = "[QUANTUM_STATE: SIM_FLOW] Operation successful";
const symbolicMessage = convertLegacyToSymbolic(legacyMessage);
console.log(symbolicMessage);
// Output: [α/S+] Operation successful
```

## Implementation Notes

- Both JavaScript and TypeScript versions are provided for maximum compatibility
- The JavaScript version includes a self-contained implementation to avoid module import issues
- The TypeScript version provides enhanced type safety and additional features