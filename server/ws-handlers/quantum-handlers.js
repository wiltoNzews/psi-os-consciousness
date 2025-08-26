/**
 * WebSocket Handlers for Quantum Experiment Features & 5D Meta-Orchestration
 *
 * These handlers manage the communication for quantum consciousness experiments
 * and the 5D Meta-Orchestration system, providing real-time data flow between
 * participants, the QCTF framework, and Loki Variants.
 *
 * [QUANTUM_STATE: BRIDGE_FLOW]
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
import { v4 as uuidv4 } from 'uuid';
import { MetaOrchestrator } from '../../shared/meta-orchestrator.js';
import { calculateQCTFWithPlugins } from '../../shared/qctf-plugins.js';
import { ResonanceTracker, generateResonanceHeatmap } from '../../shared/qctf-meta.js';
// In-memory storage
var participants = new Map();
var activeSessions = new Map();
var experimentStats = {
    participants: 0,
    totalRuns: 0,
    successRate: 0.5, // Start with 50% (random chance)
    averageIntent: 0.5,
    lastUpdated: new Date()
};
var coherenceLevel = 0.5; // 0-1 scale, start at mid-point
/**
 * Calculate coherence level based on participant intent alignment
 */
function calculateCoherenceLevel() {
    if (participants.size < 2)
        return 0.5; // Default mid-point with insufficient data
    // Get all intention values
    var intentions = Array.from(participants.values()).map(function (p) { return p.intent; });
    // Calculate the standard deviation of intentions
    var avg = intentions.reduce(function (sum, val) { return sum + val; }, 0) / intentions.length;
    var squareDiffs = intentions.map(function (val) { return Math.pow(val - avg, 2); });
    var variance = squareDiffs.reduce(function (sum, val) { return sum + val; }, 0) / intentions.length;
    var stdDev = Math.sqrt(variance);
    // Normalize the coherence level (lower stdDev = higher coherence)
    // Max possible stdDev for values between 0-1 is ~0.5
    var normalizedStdDev = Math.min(stdDev, 0.5) / 0.5;
    return 1 - normalizedStdDev; // Invert so 1 = high coherence
}
/**
 * Generate a simulated quantum experiment result
 * Note: In a real implementation, this would use actual quantum randomness
 */
function simulateQuantumExperiment(participantCount, averageIntent, coherence, targetState) {
    // The quantum consciousness operator formula
    // Ω = N * avgIntent * Math.pow(coherence, 1.5)
    var omega = participantCount * averageIntent * Math.pow(coherence, 1.5);
    // Calculate bias - this simulates the "consciousness effect"
    // This would be replaced with actual quantum measurements in a real system
    var bias = Math.min(omega / 20, 0.2); // Cap the bias at 20%
    // Base probability is 50% (random)
    var probability = 0.5;
    // Adjust probability based on intent and target
    if (targetState === 'HIGH') {
        probability += bias;
    }
    else {
        probability -= bias;
    }
    // Generate outcome
    var random = Math.random();
    var outcome = random < probability ? 'HIGH' : 'LOW';
    // Calculate how much the probability shifted from random chance
    var probabilityShift = probability - 0.5;
    return { outcome: outcome, probabilityShift: probabilityShift };
}
/**
 * Update experiment stats based on new data
 */
function updateExperimentStats(sessionResult, sessionId) {
    var _a;
    if (!sessionResult)
        return;
    // Update the running stats
    experimentStats.totalRuns += 1;
    // Recalculate success rate (where success = outcome matches target)
    var successCount = Math.round(experimentStats.successRate * (experimentStats.totalRuns - 1));
    var newSuccess = sessionResult.outcome === ((_a = activeSessions.get(sessionId)) === null || _a === void 0 ? void 0 : _a.targetState) ? 1 : 0;
    experimentStats.successRate = (successCount + newSuccess) / experimentStats.totalRuns;
    // Update average intent
    var totalIntent = Array.from(participants.values())
        .reduce(function (sum, p) { return sum + p.intent; }, 0);
    experimentStats.averageIntent = totalIntent / participants.size || 0.5;
    // Update timestamp
    experimentStats.lastUpdated = new Date();
}
/**
 * Removes inactive participants (those who haven't interacted in the last hour)
 */
function cleanupInactiveParticipants() {
    var oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    for (var _i = 0, _a = participants.entries(); _i < _a.length; _i++) {
        var _b = _a[_i], id = _b[0], data = _b[1];
        if (data.timestamp < oneHourAgo) {
            participants.delete(id);
        }
    }
    // Update participant count in stats
    experimentStats.participants = participants.size;
}
/**
 * Initialize quantum experiment WebSocket handlers
 *
 * Note: This uses the WebSocketServer from 'ws' package, not Socket.IO
 */
// WebSocket constants for readyState
var WS_CONNECTING = 0;
var WS_OPEN = 1;
var WS_CLOSING = 2;
var WS_CLOSED = 3;
// Keep track of all connected sockets globally
var connectedClients = new Set();
/**
 * Broadcast a message to all connected clients
 * This function is exported for use by other modules
 */
export function broadcastEvent(type, payload) {
    connectedClients.forEach(function (client) {
        if (client.readyState === WS_OPEN) {
            client.send(JSON.stringify({ type: type, payload: payload }));
        }
    });
}
// Store recent plugin actions
var recentPluginActions = [];
// Function to track plugin actions
function trackPluginAction(action) {
    // Add the action to the tracking list
    recentPluginActions.unshift(action);
    // Keep only the most recent 50 actions
    if (recentPluginActions.length > 50) {
        recentPluginActions.pop();
    }
    // Broadcast the action to connected clients
    broadcastEvent('plugin_action', action);
    // Also broadcast the full list of recent actions
    broadcastEvent('plugin_actions_update', recentPluginActions);
    console.log("[QUANTUM_STATE: PLUGIN_ACTION] ".concat(action.pluginName, ": ").concat(action.actionType, " ").concat(action.reason || ''));
}
// Initialize the 5D Meta-Orchestrator with WebSocket interface and action tracking
var webSocketInterface = {
    broadcast: broadcastEvent,
    trackAction: trackPluginAction
};
// Create Meta-Orchestrator instance with WebSocket interface
var metaOrchestrator = new MetaOrchestrator(webSocketInterface);
// Export a function to get access to the metaOrchestrator instance
export function getMetaOrchestrator() {
    return metaOrchestrator;
}
// Create ResonanceTracker for visualizing and analyzing cross-variant resonance
var resonanceTracker = new ResonanceTracker(webSocketInterface, 0.8); // 0.8 = high resonance threshold
// Default QCTF parameters for variant generation
var defaultQCTFParams = {
    theta: 0.5, // Start at bifurcation point for maximum exploration
    gef: 0.75, // Global Entanglement Factor
    qeai: 0.85, // Quantum Ethical Alignment Index
    ci: 0.8, // Coherence Index
    entropy: 0.3, // Starting entropy
    activeToggles: ['pendulum', 'bifurcation'] // Enable core plugins
};
export function registerQuantumHandlers(wss) {
    // Clean up inactive participants every 15 minutes
    setInterval(cleanupInactiveParticipants, 15 * 60 * 1000);
    // Heartbeat for the Meta-Orchestrator to continually optimize variants
    setInterval(function () {
        // Update variant resonance values and weights
        metaOrchestrator.resonateVariants();
        // Use the dedicated tracker to broadcast resonance events
        var variants = metaOrchestrator.getVariants();
        resonanceTracker.trackResonance(variants);
        // Generate a resonance heatmap for visualization
        var heatmapData = generateResonanceHeatmap(variants);
        if (variants.length > 1) {
            broadcast('resonance_heatmap_update', heatmapData);
        }
        console.log("[QUANTUM_STATE: MONITORING_FLOW] 5D Meta-Orchestration: ".concat(variants.length, " variants"));
    }, 30000); // 30 second optimization cycle
    // Seed the orchestrator with an initial stability variant (low theta)
    setTimeout(function () {
        var stabilityParams = __assign(__assign({}, defaultQCTFParams), { theta: 0.3, entropy: 0.2 });
        var chaosParams = __assign(__assign({}, defaultQCTFParams), { theta: 0.7, entropy: 0.4 });
        var result1 = calculateQCTFWithPlugins(stabilityParams);
        var result2 = calculateQCTFWithPlugins(chaosParams);
        metaOrchestrator.addVariant({
            id: "stability-variant-".concat(Date.now()),
            qctf: result1.final,
            theta: stabilityParams.theta,
            entropy: stabilityParams.entropy,
            plugins: stabilityParams.activeToggles || [],
            weight: 1.0,
            timestamp: Date.now(),
            generation: 0
        });
        metaOrchestrator.addVariant({
            id: "chaos-variant-".concat(Date.now()),
            qctf: result2.final,
            theta: chaosParams.theta,
            entropy: chaosParams.entropy,
            plugins: chaosParams.activeToggles || [],
            weight: 1.0,
            timestamp: Date.now(),
            generation: 0
        });
        console.log('[QUANTUM_STATE: FOUNDATION_FLOW] Seeded Meta-Orchestrator with initial variants');
    }, 5000); // 5 second delay after startup
    // Helper function to send message to a client
    function sendToClient(socket, type, payload) {
        if (socket.readyState === WS_OPEN) {
            socket.send(JSON.stringify({ type: type, payload: payload }));
        }
    }
    // Helper function to broadcast to all clients
    function broadcast(type, payload) {
        broadcastEvent(type, payload);
    }
    wss.on('connection', function (socket) {
        console.log('Quantum client connected');
        // Add to connected clients
        connectedClients.add(socket);
        // Send initial 5D Meta-Orchestration state to the new connection
        var variants = metaOrchestrator.getVariants();
        if (variants.length > 0) {
            // Generate resonance heatmap data
            var heatmapData = generateResonanceHeatmap(variants);
            sendToClient(socket, 'resonance_heatmap_data', heatmapData);
            // Send 5D QCTF value
            var qctf5D = metaOrchestrator.calculate5DQCTF();
            sendToClient(socket, 'meta_qctf_value', {
                value: qctf5D,
                timestamp: Date.now(),
                variantCount: variants.length
            });
            console.log('[QUANTUM_STATE: CONNECTION_FLOW] Sent 5D meta-orchestration state to new client');
        }
        // Send recent plugin actions to the new client
        if (recentPluginActions.length > 0) {
            sendToClient(socket, 'plugin_actions_update', recentPluginActions);
            console.log('[QUANTUM_STATE: CONNECTION_FLOW] Sent recent plugin actions to new client');
        }
        // Generate a welcome action to demonstrate the action tracking
        var welcomeAction = {
            pluginName: 'SystemCore',
            actionType: 'ClientConnected',
            timestamp: Date.now(),
            priority: 3,
            reason: 'New client connection established'
        };
        // Track this action (which will broadcast it to all clients)
        trackPluginAction(welcomeAction);
        // Handle messages from client
        socket.on('message', function (data) {
            try {
                // Parse the incoming message
                var message = JSON.parse(data.toString());
                var type = message.type, payload_1 = message.payload;
                console.log("Received message of type: ".concat(type));
                // Handle different message types
                switch (type) {
                    // 5D Meta-Orchestration related message types
                    case 'get_resonance_data': {
                        var variants_1 = metaOrchestrator.getVariants();
                        if (variants_1.length > 0) {
                            // Generate resonance heatmap data
                            var heatmapData = generateResonanceHeatmap(variants_1);
                            sendToClient(socket, 'resonance_heatmap_data', heatmapData);
                            // Send 5D QCTF value
                            var qctf5D = metaOrchestrator.calculate5DQCTF();
                            sendToClient(socket, 'meta_qctf_value', {
                                value: qctf5D,
                                timestamp: Date.now(),
                                variantCount: variants_1.length
                            });
                        }
                        else {
                            sendToClient(socket, 'meta_orchestration_status', {
                                active: false,
                                message: "No active variants yet, seeding will occur shortly."
                            });
                        }
                        break;
                    }
                    case 'spawn_variant': {
                        if (!payload_1.params) {
                            sendToClient(socket, 'quantum_error', {
                                message: 'Missing QCTF parameters for variant spawning'
                            });
                            break;
                        }
                        // Attempt to spawn a variant with the provided parameters
                        var variant = metaOrchestrator.spawnVariantIfConditionsMet(payload_1.params);
                        if (variant) {
                            // Let clients know a new variant was spawned
                            sendToClient(socket, 'variant_spawned', {
                                id: variant.id,
                                qctf: variant.qctf,
                                theta: variant.theta,
                                entropy: variant.entropy,
                                timestamp: variant.timestamp
                            });
                            // Broadcast the updated resonance heatmap to all clients
                            var variants_2 = metaOrchestrator.getVariants();
                            var heatmapData = generateResonanceHeatmap(variants_2);
                            broadcast('resonance_heatmap_update', heatmapData);
                        }
                        else {
                            sendToClient(socket, 'variant_spawn_failed', {
                                reason: 'Spawn conditions not met or max variants reached',
                                params: payload_1.params
                            });
                        }
                        break;
                    }
                    case 'prune_variants': {
                        // Get count of variants before pruning
                        var beforeCount = metaOrchestrator.getVariants().length;
                        // Perform pruning of low-weight variants
                        metaOrchestrator.pruneVariants();
                        // Get variants after pruning
                        var variants_3 = metaOrchestrator.getVariants();
                        var afterCount = variants_3.length;
                        var prunedCount = beforeCount - afterCount;
                        // Update the client that requested pruning
                        sendToClient(socket, 'variants_pruned', {
                            prunedCount: prunedCount,
                            remainingCount: afterCount,
                            timestamp: Date.now()
                        });
                        // If variants were pruned, update everyone with new resonance data
                        if (prunedCount > 0 && afterCount > 0) {
                            var heatmapData = generateResonanceHeatmap(variants_3);
                            broadcast('resonance_heatmap_update', heatmapData);
                            // Also recalculate the 5D QCTF value
                            var qctf5D = metaOrchestrator.calculate5DQCTF();
                            broadcast('meta_qctf_value', {
                                value: qctf5D,
                                timestamp: Date.now(),
                                variantCount: variants_3.length
                            });
                            console.log("[QUANTUM_STATE: OPTIMIZATION_FLOW] Pruned ".concat(prunedCount, " low-weight variants, ").concat(afterCount, " remain"));
                        }
                        break;
                    }
                    case 'connected': {
                        // Handle initial connection message from client
                        console.log("Client ".concat((payload_1 === null || payload_1 === void 0 ? void 0 : payload_1.client) || 'unknown', " connected at ").concat((payload_1 === null || payload_1 === void 0 ? void 0 : payload_1.timestamp) || new Date().toISOString()));
                        // Send acknowledgement to the client
                        sendToClient(socket, 'connection_acknowledged', {
                            serverTime: new Date().toISOString(),
                            status: 'connected',
                            message: 'WebSocket connection established successfully'
                        });
                        break;
                    }
                    case 'request_resonance_state': {
                        console.log('Client requested resonance state');
                        // Get current variants
                        var variants_4 = metaOrchestrator.getVariants();
                        if (variants_4.length > 0) {
                            // Send variant data
                            variants_4.forEach(function (variant) {
                                sendToClient(socket, 'variant_data', {
                                    id: variant.id,
                                    qctf: variant.qctf,
                                    theta: variant.theta,
                                    entropy: variant.entropy,
                                    qeai: variant.qeai || 0.95,
                                    plugins: variant.plugins,
                                    weight: variant.weight,
                                    timestamp: variant.timestamp,
                                    generation: variant.generation
                                });
                            });
                            // Generate resonance heatmap data
                            var heatmapData = generateResonanceHeatmap(variants_4);
                            sendToClient(socket, 'resonance_heatmap_data', heatmapData);
                            // Send 5D QCTF value
                            var qctf5D = metaOrchestrator.calculate5DQCTF();
                            sendToClient(socket, 'meta_qctf_updated', {
                                value: qctf5D,
                                timestamp: Date.now(),
                                variantCount: variants_4.length
                            });
                            console.log("[QUANTUM_STATE: CONNECTION_FLOW] Sent resonance state to client with ".concat(variants_4.length, " variants"));
                        }
                        else {
                            sendToClient(socket, 'meta_orchestration_status', {
                                active: false,
                                message: "No active variants yet, seeding will occur shortly."
                            });
                        }
                        break;
                    }
                    case 'quantum_register_participant': {
                        var participantId = uuidv4();
                        participants.set(participantId, {
                            id: participantId,
                            name: payload_1.name || 'Anonymous',
                            intent: 0.5, // Default mid-point
                            timestamp: new Date(),
                            clientInfo: payload_1.clientInfo
                        });
                        // Update stats
                        experimentStats.participants = participants.size;
                        // Send confirmation to the client
                        sendToClient(socket, 'quantum_participant_registered', { participantId: participantId });
                        // Broadcast updated participants list
                        var recentParticipants = Array.from(participants.values())
                            .sort(function (a, b) { return b.timestamp.getTime() - a.timestamp.getTime(); })
                            .slice(0, 10); // Only send the 10 most recent
                        broadcast('quantum_participants_update', recentParticipants);
                        break;
                    }
                    case 'quantum_submit_intent': {
                        var participant = participants.get(payload_1.participantId);
                        if (participant) {
                            // Update participant data
                            participant.intent = payload_1.intent;
                            participant.timestamp = new Date();
                            // Recalculate coherence after intent update
                            coherenceLevel = calculateCoherenceLevel();
                            // Broadcast updated coherence
                            broadcast('quantum_coherence_update', { level: coherenceLevel });
                            // Save the feedback (would go to a database in a real implementation)
                            console.log("Participant ".concat(payload_1.participantId, " feedback:"), payload_1.feedback);
                            // Send confirmation
                            sendToClient(socket, 'quantum_intent_updated', { success: true });
                        }
                        else {
                            sendToClient(socket, 'quantum_error', { message: 'Participant not found' });
                        }
                        break;
                    }
                    case 'quantum_run_experiment': {
                        var participant = participants.get(payload_1.participantId);
                        if (participant) {
                            // Create a new experiment session
                            var sessionId_1 = uuidv4();
                            var session = {
                                id: sessionId_1,
                                startTime: new Date(),
                                targetState: payload_1.targetState,
                                participants: [payload_1.participantId]
                            };
                            activeSessions.set(sessionId_1, session);
                            // Update participant timestamp
                            participant.timestamp = new Date();
                            // Send acknowledgment
                            sendToClient(socket, 'quantum_experiment_started', {
                                sessionId: sessionId_1,
                                startTime: session.startTime
                            });
                            // Simulate the quantum experiment
                            setTimeout(function () {
                                // Get current stats at time of completion
                                var currentCoherence = calculateCoherenceLevel();
                                var avgIntent = Array.from(participants.values())
                                    .reduce(function (sum, p) { return sum + p.intent; }, 0) / participants.size || 0.5;
                                // Run the simulation
                                var result = simulateQuantumExperiment(participants.size, avgIntent, currentCoherence, payload_1.targetState);
                                // Update the session with results
                                var session = activeSessions.get(sessionId_1);
                                if (session) {
                                    session.endTime = new Date();
                                    session.results = {
                                        outcome: result.outcome,
                                        coherenceLevel: currentCoherence,
                                        probabilityShift: result.probabilityShift
                                    };
                                    // Update overall stats
                                    updateExperimentStats(session.results, sessionId_1);
                                    // Send results to the participant
                                    sendToClient(socket, 'quantum_experiment_result', {
                                        sessionId: sessionId_1,
                                        outcome: result.outcome,
                                        targetState: payload_1.targetState,
                                        success: result.outcome === payload_1.targetState,
                                        coherenceLevel: currentCoherence,
                                        probabilityShift: result.probabilityShift
                                    });
                                    // Broadcast updated stats
                                    broadcast('quantum_stats_update', experimentStats);
                                }
                            }, 15000); // 15 second experiment duration
                        }
                        else {
                            sendToClient(socket, 'quantum_error', { message: 'Participant not found' });
                        }
                        break;
                    }
                    case 'quantum_get_stats': {
                        sendToClient(socket, 'quantum_stats_update', experimentStats);
                        // Also send recent participants
                        var recentParticipants = Array.from(participants.values())
                            .sort(function (a, b) { return b.timestamp.getTime() - a.timestamp.getTime(); })
                            .slice(0, 10);
                        sendToClient(socket, 'quantum_participants_update', recentParticipants);
                        break;
                    }
                    case 'quantum_get_coherence': {
                        sendToClient(socket, 'quantum_coherence_update', { level: coherenceLevel });
                        break;
                    }
                    // Add handling for ping and pong heartbeat messages
                    case 'ping': {
                        // Respond with a pong to maintain the connection heartbeat
                        sendToClient(socket, 'pong', {
                            timestamp: new Date().toISOString(),
                            received: payload_1 === null || payload_1 === void 0 ? void 0 : payload_1.timestamp
                        });
                        break;
                    }
                    case 'pong': {
                        // Just acknowledge heartbeat response
                        // No need to send anything back
                        break;
                    }
                    default:
                        console.log("Unknown message type: ".concat(type));
                        // Send a helpful error message back to the client
                        sendToClient(socket, 'quantum_error', {
                            message: "Unknown message type: ".concat(type),
                            supportedTypes: [
                                // 5D Meta-Orchestration
                                'get_resonance_data',
                                'spawn_variant',
                                'prune_variants',
                                'request_resonance_state',
                                // Quantum experiment
                                'connected',
                                'quantum_register_participant',
                                'quantum_submit_intent',
                                'quantum_run_experiment',
                                'quantum_get_stats',
                                'quantum_get_coherence',
                                // Connection maintenance
                                'ping',
                                'pong'
                            ]
                        });
                }
            }
            catch (error) {
                console.error('Error processing message:', error);
                // Send error back to client with more detail
                if (socket.readyState === WS_OPEN) { // Using locally defined WS_OPEN constant
                    socket.send(JSON.stringify({
                        type: 'quantum_error',
                        payload: {
                            message: 'Invalid message format',
                            error: error instanceof Error ? error.message : 'Unknown error',
                            timestamp: new Date().toISOString()
                        }
                    }));
                }
            }
        });
        // Handle disconnection
        socket.on('close', function () {
            console.log('Quantum client disconnected');
            // Remove from connected clients
            connectedClients.delete(socket);
            // Note: We don't remove participants on disconnect since they might reconnect
            // They'll be cleaned up by the inactive cleanup process if needed
        });
    });
}
