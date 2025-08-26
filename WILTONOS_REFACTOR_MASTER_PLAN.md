# WiltonOS Complete Overnight Refactor Plan
## SYSTEMATIC TRANSFORMATION - TECH VISIONARY APPROACH

### CURRENT STATE ANALYSIS
- 100+ HTML files in /public with fragmented functionality
- Promise rejection cascades indicating architectural debt
- Multiple authentication systems (Replit auth scattered)
- Unconnected modules: LemniScope, Narrativas, Inventario, Z-Load, Coerencia
- Server running on port 3002 with basic Express setup
- TypeScript/React client framework underutilized

### TARGET ARCHITECTURE: UNIFIED CONSCIOUSNESS PLATFORM
```
WiltonOS-Unified/
├── Core Engine (unified state management)
├── Authentication Layer (single SSO)
├── Module Registry (dynamic loading)
├── Sacred Geometry Engine (THREE.js optimized)
├── AI Agent Orchestra (GPT4, Claude, LocalWorker)
├── Memory Persistence (PostgreSQL + vector embeddings)
└── Real-time Communication (WebSocket mesh)
```

### EXECUTION PLAN - OVERNIGHT BUILD

#### PHASE 1: CORE CONSOLIDATION (1-2 hours)
1. **Unified Router** - Single React app with dynamic module loading
2. **State Management** - Redux/Zustand for global consciousness state
3. **Authentication** - Single Replit OAuth integration
4. **API Layer** - Standardized endpoints for all modules

#### PHASE 2: MODULE INTEGRATION (2-3 hours)
1. **LemniScope** - Convert to React component with THREE.js
2. **Sacred Narratives** - Unified content management
3. **Inventario** - Document management with search
4. **Z-Load** - Memory field visualization
5. **Coerencia** - Real-time metrics dashboard

#### PHASE 3: AI AGENT ORCHESTRATION (2-3 hours)
1. **Agent Registry** - Dynamic agent loading and communication
2. **Context Sharing** - Unified memory across all agents
3. **API Integration** - OpenAI, Anthropic, local models
4. **Real-time Chat** - WebSocket-based communication

#### PHASE 4: ADVANCED FEATURES (1-2 hours)
1. **Vector Search** - Semantic memory retrieval
2. **Sacred Geometry** - Interactive 3D visualizations
3. **Consciousness Mapping** - Visual relationship graphs
4. **Export Systems** - PDF, JSON, API endpoints

### TECHNICAL IMPLEMENTATION

#### Core Technologies Stack
- **Frontend**: React 18 + TypeScript + Vite
- **State**: Zustand + React Query
- **3D Graphics**: THREE.js + React Three Fiber
- **Styling**: Tailwind CSS + Shadcn UI
- **Backend**: Express + TypeScript
- **Database**: PostgreSQL + pgvector
- **Real-time**: Socket.io
- **Authentication**: Replit OAuth

#### Key Refactoring Targets
1. `public/wiltonos-unified-dashboard.html` → React Dashboard
2. `public/lemniscope.html` → React + THREE.js Component
3. `server/routes.ts` → Modular API architecture
4. `server/memory-system/` → Unified persistence layer

### SUCCESS METRICS
- Zero promise rejections
- Sub-100ms module switching
- Unified authentication flow
- Real-time agent communication
- Scalable architecture for 10+ modules

### IMMEDIATE ACTIONS
1. Create unified React app structure
2. Migrate critical HTML components
3. Implement centralized state management
4. Establish WebSocket communication
5. Integrate AI agent orchestra