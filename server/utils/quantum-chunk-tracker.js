/**
 * Quantum Chunk Tracker
 *
 * This module tracks quantum chunks as they flow through the system,
 * including their creation, state transitions, and relationships.
 * It provides methods for monitoring chunk lifecycle and performance metrics.
 *
 * [QUANTUM_STATE: SIM_FLOW]
 */
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
// Define lifecycle log symbol inline to avoid import issues
var LIFECYCLE_LOG_SYMBOL = '⚽️';
/**
 * Simple lifecycle event parser
 * @param log The log entry to parse
 */
function parseLifecycleEvent(log) {
    // Only process lifecycle logs
    if (!log.includes("[".concat(LIFECYCLE_LOG_SYMBOL, "]"))) {
        return null;
    }
    // Extract the event text after the symbol marker
    var match = log.match(/\[⚽️\]\s+([\w]+):\s+(.*)/);
    if (!match)
        return null;
    var _ = match[0], component = match[1], eventData = match[2];
    // Parse the event data based on component and format
    if (component === 'QuantumChunkTracker') {
        if (eventData.startsWith('ChunkCreated=')) {
            var id = eventData.replace('ChunkCreated=', '');
            return { type: 'creation', id: id };
        }
        if (eventData.startsWith('ChunkRouted=')) {
            var parts = eventData.replace('ChunkRouted=', '').split(', Agent=');
            return {
                type: 'routing',
                id: parts[0],
                agent: parts[1]
            };
        }
        if (eventData.startsWith('ChunksEntangled=')) {
            var ids = eventData.replace('ChunksEntangled=', '').split(',');
            return {
                type: 'entanglement',
                id1: ids[0],
                id2: ids[1]
            };
        }
        if (eventData.startsWith('ChunkCollapsed=')) {
            var parts = eventData.replace('ChunkCollapsed=', '').split(', Possibility=');
            return {
                type: 'decoherence',
                id: parts[0],
                selectedPossibility: parts[1] !== 'unspecified' ? parts[1] : undefined
            };
        }
        if (eventData.startsWith('PipelineComplete=')) {
            var parts = eventData.replace('PipelineComplete=', '').split(', FinalState=');
            var timeMatch = parts[1].match(/, Time=(\d+)ms/);
            var finalState = parts[1];
            if (timeMatch) {
                finalState = parts[1].substring(0, parts[1].indexOf(', Time='));
            }
            return {
                type: 'pipeline_complete',
                id: parts[0],
                finalState: finalState !== 'unspecified' ? finalState : undefined
            };
        }
    }
    // No recognized pattern
    return null;
}
// Define ChunkState enum for our internal tracking purposes
export var ChunkState;
(function (ChunkState) {
    ChunkState["CREATED"] = "created";
    ChunkState["PROCESSING"] = "in_progress";
    ChunkState["PROCESSED"] = "processed";
    ChunkState["ERROR"] = "error";
    ChunkState["MERGED"] = "merged";
    // Additional states for quantum processing
    ChunkState["SUPERPOSED"] = "superposed";
    ChunkState["ENTANGLED"] = "entangled";
    ChunkState["COLLAPSED"] = "collapsed";
})(ChunkState || (ChunkState = {}));
// Singleton instance
var instance = null;
/**
 * Tracks the lifecycle and processing metrics for quantum chunks
 */
var QuantumChunkTracker = /** @class */ (function () {
    /**
     * Create a new QuantumChunkTracker instance
     */
    function QuantumChunkTracker() {
        var _a;
        this.chunks = new Map();
        this.stateTransitions = [];
        this.lifecycleLogs = [];
        // Initialize metrics
        this.metrics = {
            totalChunks: 0,
            processedChunks: 0,
            averageProcessingTime: 0,
            totalProcessingTime: 0,
            stateDistribution: (_a = {},
                _a[ChunkState.SUPERPOSED] = 0,
                _a[ChunkState.ENTANGLED] = 0,
                _a[ChunkState.COLLAPSED] = 0,
                _a)
        };
        // Initialize periodic cleanup
        this.initializePeriodicCleanup();
        console.log("[\u03B1/S+/\uD83E\uDDE9] Quantum Chunk Tracker initialized");
        console.log("[".concat(LIFECYCLE_LOG_SYMBOL, "] QuantumChunkTracker: Initialized"));
    }
    /**
     * Get the singleton instance
     */
    QuantumChunkTracker.getInstance = function () {
        if (!instance) {
            instance = new QuantumChunkTracker();
        }
        return instance;
    };
    /**
     * Add a lifecycle log entry for analysis
     *
     * @param log The log entry to add
     */
    QuantumChunkTracker.prototype.addLog = function (log) {
        if (log.includes("[".concat(LIFECYCLE_LOG_SYMBOL, "]"))) {
            this.lifecycleLogs.push(log);
            this.processLogEntry(log);
        }
    };
    /**
     * Process a log entry to update tracker state
     *
     * @param log The log entry to process
     */
    QuantumChunkTracker.prototype.processLogEntry = function (log) {
        var event = parseLifecycleEvent(log);
        if (!event)
            return;
        switch (event.type) {
            case 'creation':
                if (event.id) {
                    this.trackChunkCreation(event.id, event.state);
                }
                break;
            case 'routing':
                if (event.id && event.agent) {
                    this.trackChunkRouting(event.id, event.agent);
                }
                break;
            case 'decoherence':
                if (event.id) {
                    this.trackStateCollapse(event.id, event.selectedPossibility);
                }
                break;
            case 'entanglement':
                if (event.id1 && event.id2) {
                    this.trackEntanglement(event.id1, event.id2);
                }
                break;
            case 'pipeline_complete':
                if (event.id) {
                    this.trackPipelineCompletion(event.id, event.finalState);
                }
                break;
        }
    };
    /**
     * Track the creation of a new quantum chunk
     *
     * @param id Chunk ID
     * @param state Initial chunk state
     */
    QuantumChunkTracker.prototype.trackChunkCreation = function (id, state) {
        if (!id)
            return;
        var chunk = {
            id: id,
            state: ChunkState.SUPERPOSED,
            createdAt: new Date(),
            lastUpdated: new Date(),
            routedTo: [],
            entangledWith: [],
            stateHistory: [{
                    state: ChunkState.SUPERPOSED,
                    timestamp: new Date()
                }]
        };
        // Add any extra state data
        if (state) {
            Object.assign(chunk, state);
        }
        this.chunks.set(id, chunk);
        // Update metrics
        this.metrics.totalChunks++;
        this.metrics.stateDistribution[ChunkState.SUPERPOSED]++;
        console.log("[".concat(LIFECYCLE_LOG_SYMBOL, "] QuantumChunkTracker: ChunkCreated=").concat(id));
    };
    /**
     * Track chunk routing to an agent
     *
     * @param id Chunk ID
     * @param agent Agent the chunk was routed to
     */
    QuantumChunkTracker.prototype.trackChunkRouting = function (id, agent) {
        if (!id || !agent)
            return;
        var chunk = this.chunks.get(id);
        if (!chunk)
            return;
        // Update chunk routing history
        chunk.routedTo.push({
            agent: agent,
            timestamp: new Date()
        });
        chunk.handlingAgent = agent;
        chunk.lastUpdated = new Date();
        this.chunks.set(id, chunk);
        console.log("[".concat(LIFECYCLE_LOG_SYMBOL, "] QuantumChunkTracker: ChunkRouted=").concat(id, ", Agent=").concat(agent));
    };
    /**
     * Track state collapse (decoherence)
     *
     * @param id Chunk ID
     * @param selectedPossibility The selected possibility
     */
    QuantumChunkTracker.prototype.trackStateCollapse = function (id, selectedPossibility) {
        if (!id)
            return;
        var chunk = this.chunks.get(id);
        if (!chunk)
            return;
        // Update state metrics
        this.metrics.stateDistribution[chunk.state]--;
        this.metrics.stateDistribution[ChunkState.COLLAPSED]++;
        // Record the state transition
        this.stateTransitions.push({
            chunkId: id,
            from: chunk.state,
            to: ChunkState.COLLAPSED,
            timestamp: new Date(),
            selectedPossibility: selectedPossibility
        });
        // Update chunk state
        chunk.state = ChunkState.COLLAPSED;
        chunk.selectedPossibility = selectedPossibility;
        chunk.lastUpdated = new Date();
        chunk.stateHistory.push({
            state: ChunkState.COLLAPSED,
            timestamp: new Date(),
            selectedPossibility: selectedPossibility
        });
        this.chunks.set(id, chunk);
        console.log("[".concat(LIFECYCLE_LOG_SYMBOL, "] QuantumChunkTracker: ChunkCollapsed=").concat(id, ", Possibility=").concat(selectedPossibility || 'unspecified'));
    };
    /**
     * Track entanglement between chunks
     *
     * @param id1 First chunk ID
     * @param id2 Second chunk ID
     */
    QuantumChunkTracker.prototype.trackEntanglement = function (id1, id2) {
        var _this = this;
        if (!id1 || !id2)
            return;
        var chunk1 = this.chunks.get(id1);
        var chunk2 = this.chunks.get(id2);
        if (!chunk1 || !chunk2)
            return;
        // Update state metrics for both chunks
        this.metrics.stateDistribution[chunk1.state]--;
        this.metrics.stateDistribution[chunk2.state]--;
        this.metrics.stateDistribution[ChunkState.ENTANGLED] += 2;
        // Record state transitions
        [
            { chunkId: id1, from: chunk1.state, to: ChunkState.ENTANGLED },
            { chunkId: id2, from: chunk2.state, to: ChunkState.ENTANGLED }
        ].forEach(function (transition) {
            _this.stateTransitions.push(__assign(__assign({}, transition), { timestamp: new Date() }));
        });
        // Update both chunks
        [
            { chunk: chunk1, partnerId: id2 },
            { chunk: chunk2, partnerId: id1 }
        ].forEach(function (_a) {
            var chunk = _a.chunk, partnerId = _a.partnerId;
            chunk.state = ChunkState.ENTANGLED;
            chunk.entangledWith.push({
                partnerId: partnerId,
                timestamp: new Date()
            });
            chunk.lastUpdated = new Date();
            chunk.stateHistory.push({
                state: ChunkState.ENTANGLED,
                timestamp: new Date(),
                partnerId: partnerId
            });
            _this.chunks.set(chunk.id, chunk);
        });
        console.log("[".concat(LIFECYCLE_LOG_SYMBOL, "] QuantumChunkTracker: ChunksEntangled=").concat(id1, ",").concat(id2));
    };
    /**
     * Track completion of quantum pipeline for a chunk
     *
     * @param id Chunk ID
     * @param finalState Final state of the chunk
     */
    QuantumChunkTracker.prototype.trackPipelineCompletion = function (id, finalState) {
        if (!id)
            return;
        var chunk = this.chunks.get(id);
        if (!chunk)
            return;
        // Calculate processing time
        var processingTime = new Date().getTime() - chunk.createdAt.getTime();
        // Update metrics
        this.metrics.processedChunks++;
        this.metrics.totalProcessingTime += processingTime;
        this.metrics.averageProcessingTime = this.metrics.totalProcessingTime / this.metrics.processedChunks;
        // Update chunk
        chunk.completed = true;
        chunk.completedAt = new Date();
        chunk.processingTime = processingTime;
        chunk.finalState = finalState;
        this.chunks.set(id, chunk);
        console.log("[".concat(LIFECYCLE_LOG_SYMBOL, "] QuantumChunkTracker: PipelineComplete=").concat(id, ", FinalState=").concat(finalState || 'unspecified', ", Time=").concat(processingTime, "ms"));
    };
    /**
     * Get a specific chunk by ID
     *
     * @param id Chunk ID
     * @returns The chunk or undefined if not found
     */
    QuantumChunkTracker.prototype.getChunk = function (id) {
        return this.chunks.get(id);
    };
    /**
     * Get all tracked chunks
     *
     * @returns Array of all tracked chunks
     */
    QuantumChunkTracker.prototype.getAllChunks = function () {
        return Array.from(this.chunks.values());
    };
    /**
     * Get recent state transitions
     *
     * @param limit Maximum number of transitions to return
     * @returns Recent state transitions
     */
    QuantumChunkTracker.prototype.getRecentTransitions = function (limit) {
        if (limit === void 0) { limit = 10; }
        return this.stateTransitions
            .sort(function (a, b) { return b.timestamp.getTime() - a.timestamp.getTime(); })
            .slice(0, limit);
    };
    /**
     * Get chunk throughput (chunks processed per minute)
     *
     * @returns Chunks per minute
     */
    QuantumChunkTracker.prototype.getThroughput = function () {
        // Calculate throughput based on completed chunks
        var completedChunks = Array.from(this.chunks.values()).filter(function (c) { return c.completed; });
        if (completedChunks.length < 2)
            return 0;
        // Sort by completion time
        completedChunks.sort(function (a, b) {
            if (!a.completedAt || !b.completedAt)
                return 0;
            return a.completedAt.getTime() - b.completedAt.getTime();
        });
        // Get first and last completion time (with null checks)
        var firstChunk = completedChunks[0];
        var lastChunk = completedChunks[completedChunks.length - 1];
        if (!firstChunk.completedAt || !lastChunk.completedAt)
            return 0;
        var firstCompletion = firstChunk.completedAt.getTime();
        var lastCompletion = lastChunk.completedAt.getTime();
        // Calculate time span in minutes
        var timeSpanMinutes = (lastCompletion - firstCompletion) / (1000 * 60);
        // Return chunks per minute
        return timeSpanMinutes > 0 ? Number((completedChunks.length / timeSpanMinutes).toFixed(2)) : 0;
    };
    /**
     * Get current backlog size (uncompleted chunks)
     *
     * @returns Number of uncompleted chunks
     */
    QuantumChunkTracker.prototype.getBacklogSize = function () {
        return Array.from(this.chunks.values()).filter(function (c) { return !c.completed; }).length;
    };
    /**
     * Get average processing time for completed chunks
     *
     * @returns Average processing time in milliseconds
     */
    QuantumChunkTracker.prototype.getAverageProcessingTime = function () {
        return this.metrics.averageProcessingTime;
    };
    /**
     * Get distribution of chunks across different states
     *
     * @returns Count of chunks in each state
     */
    QuantumChunkTracker.prototype.getStateDistribution = function () {
        return __assign({}, this.metrics.stateDistribution);
    };
    /**
     * Initialize periodic cleanup of old data to prevent memory leaks
     */
    QuantumChunkTracker.prototype.initializePeriodicCleanup = function () {
        var _this = this;
        // Run cleanup every hour
        setInterval(function () { return _this.cleanupOldData(); }, 60 * 60 * 1000);
    };
    /**
     * Clean up old data (chunks and transitions)
     */
    QuantumChunkTracker.prototype.cleanupOldData = function () {
        var now = new Date();
        var oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        // Clean up old transitions
        this.stateTransitions = this.stateTransitions.filter(function (t) { return t.timestamp > oneDayAgo; });
        // Clean up old chunks that have been processed and are older than 24 hours
        for (var _i = 0, _a = this.chunks.entries(); _i < _a.length; _i++) {
            var _b = _a[_i], id = _b[0], chunk = _b[1];
            if ((chunk.state === ChunkState.COLLAPSED) &&
                chunk.lastUpdated < oneDayAgo &&
                chunk.completed) {
                this.chunks.delete(id);
            }
        }
        // Limit the size of the logs array
        if (this.lifecycleLogs.length > 1000) {
            this.lifecycleLogs = this.lifecycleLogs.slice(-1000);
        }
        console.log("[".concat(LIFECYCLE_LOG_SYMBOL, "] QuantumChunkTracker: CleanupComplete, Remaining=").concat(this.chunks.size));
    };
    /**
     * Clear all tracking data (for testing)
     */
    QuantumChunkTracker.prototype.clear = function () {
        var _a;
        this.chunks.clear();
        this.stateTransitions = [];
        this.lifecycleLogs = [];
        this.metrics = {
            totalChunks: 0,
            processedChunks: 0,
            averageProcessingTime: 0,
            totalProcessingTime: 0,
            stateDistribution: (_a = {},
                _a[ChunkState.SUPERPOSED] = 0,
                _a[ChunkState.ENTANGLED] = 0,
                _a[ChunkState.COLLAPSED] = 0,
                _a)
        };
        console.log("[".concat(LIFECYCLE_LOG_SYMBOL, "] QuantumChunkTracker: Cleared"));
    };
    return QuantumChunkTracker;
}());
export { QuantumChunkTracker };
/**
 * Get the singleton instance of QuantumChunkTracker
 *
 * @returns The tracker instance
 */
export function getQuantumChunkTracker() {
    return QuantumChunkTracker.getInstance();
}
