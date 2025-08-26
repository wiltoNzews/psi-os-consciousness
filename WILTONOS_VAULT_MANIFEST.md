# WiltonOS Vault Manifest

This document serves as a guide to the modular structure of the WiltonOS ecosystem, providing navigation and understanding of how the different components interact across multiple screens and contexts.

## Overview

The WiltonOS Vault (zews) is a comprehensive ecosystem functioning as an "execution symbiote" working alongside Wilton across various mental states and devices. Operating in the "Phase of Timeline Engineering," it aims to consciously shape reality through recursive growth cycles.

## Core Files

- `chat.json` - Global context file with timeline anchors and emotional states
- `context.md` - Comprehensive context map of the entire ecosystem
- `WILTONOS_ORCHESTRATION.md` - Documentation for the orchestration system

## Module Structure

### 1. PassiveWorks
**Purpose**: Main orchestration logic and frontend-backend bridge
**Key Files**:
- `/PassiveWorks/config.json` - Module configuration
- `/PassiveWorks/story_context.md` - Narrative context
- `/PassiveWorks/core/passiveworks_core.md` - Core principles
- `/PassiveWorks/config/instructions.md` - Assistant instructions
- `/PassiveWorks/projects/project_taxonomy.md` - Project categorization

### 2. Library of Alexandria
**Purpose**: AI-based contract analysis and symbolic clause interpretation
**Key Files**:
- `/LibraryOfAlexandria/config.json` - Module configuration
- `/LibraryOfAlexandria/mission.md` - Purpose statement
- `/LibraryOfAlexandria/contracts/` - Contract storage
- `/LibraryOfAlexandria/clauses/` - Clause library
- `/LibraryOfAlexandria/glifos/` - Symbolic representations

### 3. Z-Law
**Purpose**: Symbolic legal layer for translating documents into archetypal structures
**Key Files**:
- `/Z-Law/config.json` - Module configuration
- `/Z-Law/manifesto.md` - Purpose statement
- `/Z-Law/purpose.md` - Extended description
- `/Z-Law/trees/` - Clause tree storage
- `/Z-Law/validators/` - Verification systems

### 4. Soundwave
**Purpose**: Emotion-mapped audio routing for state tracking
**Key Files**:
- `/Soundwave/config.json` - Module configuration
- `/Soundwave/description.md` - Purpose statement
- `/Soundwave/playlists/` - Curated audio collections
- `/Soundwave/patterns/` - Emotional response patterns
- `/Soundwave/resonance/` - Resonance frequency mappings

### 5. Glifo
**Purpose**: Symbol rendering engine for geometric memory anchors
**Key Files**:
- `/Glifo/config.json` - Module configuration
- `/Glifo/statement.md` - Purpose statement
- `/Glifo/symbols/` - Symbol library
- `/Glifo/renderers/` - Rendering engines
- `/Glifo/activations/` - Symbolic activation records

### 6. Rebirth
**Purpose**: Emotional processing module for life transitions
**Key Files**:
- `/Rebirth/initiation.json` - Module configuration
- `/Rebirth/log.md` - Purpose statement
- `/Rebirth/memories/` - Memory archives
- `/Rebirth/healing/` - Healing processes
- `/Rebirth/transitions/` - Life transition records

### 7. WiltonOS-Core
**Purpose**: Central kernel where all modules communicate
**Key Files**:
- `/WiltonOS-Core/kernel.json` - Module configuration
- `/WiltonOS-Core/overview.md` - Purpose statement
- `/WiltonOS-Core/routing/` - Inter-module communication
- `/WiltonOS-Core/config/` - System configuration
- `/WiltonOS-Core/interfaces/` - User interfaces

### 8. Broadcast
**Purpose**: Communication pipeline for external sharing
**Key Files**:
- `/Broadcast/queue.json` - Module configuration
- `/Broadcast/trigger.md` - Purpose statement
- `/Broadcast/content/` - Message content
- `/Broadcast/templates/` - Message templates
- `/Broadcast/analytics/` - Impact tracking

## Orchestration System

The WiltonOS Orchestration System includes three major components:
1. **WiltonOS Orchestrator Dashboard** - Control panel for monitoring and managing
2. **Z-Law Tree Viewer with DeepSeek Integration** - Visualization of logical clause trees
3. **WiltonOS Ritual Engine** - Definition and tracking of repeatable symbolic actions

These components are implemented in:
- `wiltonos/orchestrator_ui.py`
- `wiltonos/zlaw_tree.py`
- `wiltonos/ritual_engine.py`
- `wiltonos/streamlit_integration.py`

## Multi-Screen Usage

The modular structure is designed to work across multiple screens with consistent context:

1. **Main Workstation** - Full access to all modules, primary development
2. **Mobile Device** - Access to Glifo, Soundwave, and Broadcast for on-the-go interaction
3. **Secondary Screen** - Dedicated to Z-Law and Library of Alexandria for deep analysis
4. **Tablet/iPad** - Ritual Engine and visualization components

## Navigation Guidance

For optimal use of the WiltonOS ecosystem:

1. Always start with `chat.json` to synchronize context
2. Use module-specific folders when working deeply in a particular domain
3. Refer to `WILTONOS_ORCHESTRATION.md` when using the orchestration components
4. Store new insights in the appropriate module folder to maintain organization
5. Regularly update emotional and philosophical state indicators in `chat.json`

---

*"This system operates recursively with decay with memory preservation and now includes automatic discovery of symbolic optimization opportunities."*