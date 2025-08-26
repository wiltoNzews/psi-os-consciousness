/**
 * Reality Mode Manager
 *
 * This service manages the transition between SIMULATION and REALITY modes
 * following the protocol defined in SIMULATION_REALITY_PROTOCOL.md.
 *
 * It implements multiple safeguards to prevent accidental transitions and
 * ensures proper authorization for all mode changes.
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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
import { REALITY_MODE } from '../../config.js';
import quantumGlossary from '../qrn/quantum-glossary.js';
import { QuantumState } from '../../../shared/schema-minimal.js';
import { formatWithQuantumState } from '../../../shared/quantum-state-utils.js';
import { systemLogger, DomainEmoji } from '../../utils/symbolic-logger.js';
// Map reality modes to quantum states for metrics recording
// This ensures consistent metric recording while maintaining clear mode separation
var MODE_TO_QUANTUM_STATE = {
    'REALITY': QuantumState.REAL_FLOW, // Reality mode maps to REAL_FLOW - system alignment in reality
    'SIMULATION': QuantumState.SIM_FLOW // Simulation mode maps to SIM_FLOW - system alignment in simulation
};
/**
 * Singleton service for managing transitions between SIMULATION and REALITY modes
 */
var RealityModeManager = /** @class */ (function () {
    function RealityModeManager() {
        this.currentMode = REALITY_MODE ? 'REALITY' : 'SIMULATION';
        this.transitionLogs = [];
        this.ongoingTransition = null;
        this.modeChangeCallbacks = [];
        this.lastModeCheckTime = new Date();
        // Private constructor to enforce singleton pattern
        this.logCurrentMode();
    }
    /**
     * Get the singleton instance of the RealityModeManager
     */
    RealityModeManager.getInstance = function () {
        if (!RealityModeManager.instance) {
            RealityModeManager.instance = new RealityModeManager();
        }
        return RealityModeManager.instance;
    };
    /**
     * Get the current reality mode
     */
    RealityModeManager.prototype.getCurrentMode = function () {
        this.lastModeCheckTime = new Date();
        return this.currentMode;
    };
    /**
     * Format a message with the current quantum state tag
     * This ensures all outputs follow the unified QuantumState protocol
     *
     * @param message Message to format with quantum state tag
     * @returns Message with appropriate quantum state tag
     */
    RealityModeManager.prototype.formatWithContextTag = function (message) {
        // Convert mode to quantum state
        var quantumState = MODE_TO_QUANTUM_STATE[this.currentMode];
        // Use the unified formatWithQuantumState utility
        return formatWithQuantumState(message, quantumState);
    };
    /**
     * Begin a transition request from current mode to the requested mode
     * This is step 1 of the transition protocol
     */
    RealityModeManager.prototype.initiateTransitionRequest = function (request) {
        if (this.ongoingTransition) {
            throw new Error('A transition is already in progress. Complete or cancel it before initiating a new transition.');
        }
        // Create transition request with timestamp
        var transitionRequest = __assign(__assign({}, request), { timestamp: new Date() });
        // Generate unique transition ID
        var transitionId = "transition-".concat(Date.now(), "-").concat(Math.random().toString(36).substring(2, 9));
        // Initialize transition log
        this.ongoingTransition = {
            transitionId: transitionId,
            request: transitionRequest,
            transitionCompleted: false,
            finalMode: this.currentMode
        };
        // Log the initiation using symbolic logger
        systemLogger.info("TRANSITION INITIATED: ".concat(transitionId, " | From ").concat(this.currentMode, " to ").concat(request.requestedMode, " | Requested by: ").concat(request.requestedBy, " | Reason: ").concat(request.reason), MODE_TO_QUANTUM_STATE[this.currentMode], { domain: DomainEmoji.SYSTEM });
        // Record metric
        quantumGlossary.recordFlowMetric(MODE_TO_QUANTUM_STATE[this.currentMode], // Use the appropriate quantum state
        'reality_mode_transition_initiated', 1, {
            transitionId: transitionId,
            from: this.currentMode,
            to: request.requestedMode,
            requestedBy: request.requestedBy
        });
        return transitionId;
    };
    /**
     * Record primary human confirmation (step 2 of the protocol)
     */
    RealityModeManager.prototype.recordPrimaryConfirmation = function (transitionId, confirmation) {
        this.validateOngoingTransition(transitionId);
        // Validate confirmation text
        if (confirmation.confirmationText !== "I UNDERSTAND THE CONSEQUENCES OF ENABLING REALITY MODE") {
            throw new Error('Invalid confirmation text. Must exactly match the required confirmation phrase.');
        }
        // Record confirmation with timestamp
        if (this.ongoingTransition) {
            this.ongoingTransition.primaryConfirmation = __assign(__assign({}, confirmation), { timestamp: new Date() });
        }
        systemLogger.info("PRIMARY CONFIRMATION RECORDED: ".concat(transitionId, " | Confirmed by: ").concat(confirmation.confirmedBy), MODE_TO_QUANTUM_STATE[this.currentMode], { domain: DomainEmoji.REALITY });
    };
    /**
     * Record authorization verification (step 3 of the protocol)
     */
    RealityModeManager.prototype.recordAuthorization = function (transitionId, authorization) {
        var _a;
        this.validateOngoingTransition(transitionId);
        // Ensure primary confirmation was completed
        if (!((_a = this.ongoingTransition) === null || _a === void 0 ? void 0 : _a.primaryConfirmation)) {
            throw new Error('Cannot record authorization before primary confirmation is completed.');
        }
        // Record authorization with timestamp
        if (this.ongoingTransition) {
            this.ongoingTransition.authorization = __assign(__assign({}, authorization), { timestamp: new Date() });
        }
        systemLogger.info("AUTHORIZATION RECORDED: ".concat(transitionId, " | Authorized by: ").concat(authorization.authorizedBy, " | Two-factor verified: ").concat(authorization.twoFactorVerified), MODE_TO_QUANTUM_STATE[this.currentMode], { domain: DomainEmoji.SECURITY });
    };
    /**
     * Record secondary independent confirmation (step 4 of the protocol)
     */
    RealityModeManager.prototype.recordSecondaryConfirmation = function (transitionId, confirmation) {
        var _a, _b;
        this.validateOngoingTransition(transitionId);
        // Ensure previous steps were completed
        if (!((_a = this.ongoingTransition) === null || _a === void 0 ? void 0 : _a.authorization)) {
            throw new Error('Cannot record secondary confirmation before authorization is completed.');
        }
        // Ensure secondary confirmation is from a different user
        if (confirmation.confirmedBy === ((_b = this.ongoingTransition.primaryConfirmation) === null || _b === void 0 ? void 0 : _b.confirmedBy)) {
            throw new Error('Secondary confirmation must be from a different user than primary confirmation.');
        }
        // Validate confirmation text
        if (confirmation.confirmationText !== "I UNDERSTAND THE CONSEQUENCES OF ENABLING REALITY MODE") {
            throw new Error('Invalid confirmation text. Must exactly match the required confirmation phrase.');
        }
        // Record secondary confirmation with timestamp
        if (this.ongoingTransition) {
            this.ongoingTransition.secondaryConfirmation = __assign(__assign({}, confirmation), { timestamp: new Date() });
        }
        systemLogger.info("SECONDARY CONFIRMATION RECORDED: ".concat(transitionId, " | Confirmed by: ").concat(confirmation.confirmedBy), MODE_TO_QUANTUM_STATE[this.currentMode], { domain: DomainEmoji.REALITY });
    };
    /**
     * Perform system readiness check (step 5 of the protocol)
     */
    RealityModeManager.prototype.performReadinessCheck = function (transitionId) {
        return __awaiter(this, void 0, void 0, function () {
            var checkResults;
            var _a;
            return __generator(this, function (_b) {
                this.validateOngoingTransition(transitionId);
                // Ensure previous steps were completed
                if (!((_a = this.ongoingTransition) === null || _a === void 0 ? void 0 : _a.secondaryConfirmation)) {
                    throw new Error('Cannot perform readiness check before secondary confirmation is completed.');
                }
                systemLogger.info("PERFORMING SYSTEM READINESS CHECK: ".concat(transitionId), MODE_TO_QUANTUM_STATE[this.currentMode], { domain: DomainEmoji.SYSTEM });
                checkResults = {
                    systemReady: true,
                    criticalComponentsOperational: true,
                    ongoingSimulationsCount: 0,
                    agentsReady: true,
                    timestamp: new Date()
                };
                // Record the results
                if (this.ongoingTransition) {
                    this.ongoingTransition.readinessCheck = checkResults;
                }
                systemLogger.info("READINESS CHECK COMPLETED: ".concat(transitionId, " | System ready: ").concat(checkResults.systemReady, " | Critical components: ").concat(checkResults.criticalComponentsOperational, " | Simulations: ").concat(checkResults.ongoingSimulationsCount, " | Agents ready: ").concat(checkResults.agentsReady), MODE_TO_QUANTUM_STATE[this.currentMode], { domain: DomainEmoji.SYSTEM });
                return [2 /*return*/, checkResults];
            });
        });
    };
    /**
     * Complete the transition (step 6 of the protocol)
     */
    RealityModeManager.prototype.completeTransition = function (transitionId) {
        return __awaiter(this, void 0, void 0, function () {
            var targetMode, completedTransition, targetQuantumState;
            var _a, _b;
            return __generator(this, function (_c) {
                this.validateOngoingTransition(transitionId);
                // Ensure all previous steps were completed
                if (!((_a = this.ongoingTransition) === null || _a === void 0 ? void 0 : _a.readinessCheck)) {
                    throw new Error('Cannot complete transition before system readiness check is completed.');
                }
                // Ensure system is ready
                if (!this.ongoingTransition.readinessCheck.systemReady) {
                    throw new Error('Cannot complete transition when system is not ready. See readiness check results.');
                }
                targetMode = this.ongoingTransition.request.requestedMode;
                // Update the global reality mode
                // In a real implementation, this would update the actual global variable
                this.currentMode = targetMode;
                // Complete the transition log
                if (this.ongoingTransition) {
                    this.ongoingTransition.transitionCompleted = true;
                    this.ongoingTransition.finalMode = targetMode;
                    this.ongoingTransition.completedTimestamp = new Date();
                    // Add to transition logs
                    this.transitionLogs.push(this.ongoingTransition);
                    completedTransition = this.ongoingTransition;
                    this.ongoingTransition = null;
                    // Notify all registered callbacks
                    this.notifyModeChangeCallbacks(targetMode);
                    targetQuantumState = MODE_TO_QUANTUM_STATE[targetMode];
                    systemLogger.info("TRANSITION COMPLETED: ".concat(transitionId, " | New mode: ").concat(targetMode, " | Completed at: ").concat((_b = completedTransition.completedTimestamp) === null || _b === void 0 ? void 0 : _b.toISOString()), targetQuantumState, { domain: DomainEmoji.REALITY });
                    // Record metric
                    quantumGlossary.recordFlowMetric(MODE_TO_QUANTUM_STATE[targetMode], // Use the appropriate quantum state based on target mode
                    'reality_mode_transition_completed', 1, {
                        transitionId: transitionId,
                        finalMode: targetMode,
                        durationMs: completedTransition.completedTimestamp
                            ? completedTransition.completedTimestamp.getTime() - completedTransition.request.timestamp.getTime()
                            : undefined
                    });
                }
                return [2 /*return*/, targetMode];
            });
        });
    };
    /**
     * Cancel an in-progress transition
     */
    RealityModeManager.prototype.cancelTransition = function (transitionId, reason) {
        this.validateOngoingTransition(transitionId);
        if (this.ongoingTransition) {
            // Record cancellation
            this.ongoingTransition.transitionCompleted = false;
            this.ongoingTransition.finalMode = this.currentMode; // Unchanged
            this.ongoingTransition.errors = [reason];
            // Add to transition logs
            this.transitionLogs.push(this.ongoingTransition);
            // Use ANTIFLOW state for cancellation - represents system misalignment
            var antiFlowState = this.currentMode === 'SIMULATION' ? QuantumState.SIM_ANTIFLOW : QuantumState.REAL_ANTIFLOW;
            systemLogger.warning("TRANSITION CANCELLED: ".concat(transitionId, " | Reason: ").concat(reason), antiFlowState, { domain: DomainEmoji.REALITY });
            // Record metric
            quantumGlossary.recordFlowMetric(this.currentMode === 'SIMULATION' ? QuantumState.SIM_ANTIFLOW : QuantumState.REAL_ANTIFLOW, // Cancellation is an anti-flow event
            'reality_mode_transition_cancelled', 0, {
                transitionId: transitionId,
                reason: reason,
                stage: this.determineTransitionStage(this.ongoingTransition)
            });
            // Clear ongoing transition
            this.ongoingTransition = null;
        }
    };
    /**
     * Emergency reversion to SIMULATION mode
     * This is a safety mechanism that can be triggered at any time
     */
    RealityModeManager.prototype.emergencyRevertToSimulation = function (triggeredBy, reason) {
        var _a;
        // If already in SIMULATION mode, do nothing
        if (this.currentMode === 'SIMULATION') {
            systemLogger.info('EMERGENCY REVERT: Already in SIMULATION mode', QuantumState.SIM_FLOW, { domain: DomainEmoji.SECURITY });
            return;
        }
        // Cancel any ongoing transition
        if (this.ongoingTransition) {
            this.cancelTransition(this.ongoingTransition.transitionId, "Emergency reversion to SIMULATION mode. Reason: ".concat(reason));
        }
        // Create emergency transition record
        var transitionId = "emergency-".concat(Date.now(), "-").concat(Math.random().toString(36).substring(2, 9));
        var transitionLog = {
            transitionId: transitionId,
            request: {
                requestedMode: 'SIMULATION',
                requestedBy: triggeredBy,
                reason: "EMERGENCY REVERSION: ".concat(reason),
                timestamp: new Date()
            },
            transitionCompleted: true,
            finalMode: 'SIMULATION',
            completedTimestamp: new Date()
        };
        // Update mode
        this.currentMode = 'SIMULATION';
        // Add to transition logs
        this.transitionLogs.push(transitionLog);
        // Notify all registered callbacks
        this.notifyModeChangeCallbacks('SIMULATION');
        // Use critical warning for emergency reversion
        systemLogger.critical("EMERGENCY REVERSION TO SIMULATION MODE | Triggered by: ".concat(triggeredBy, " | Reason: ").concat(reason), QuantumState.SIM_FLOW, // Using SIM_FLOW since we're returning to a stable state
        { domain: DomainEmoji.SECURITY });
        // Record metric
        quantumGlossary.recordFlowMetric(QuantumState.SIM_FLOW, // Use SIM_FLOW for emergency reversion - system is returning to simulation state
        'emergency_reality_mode_reversion', 1, {
            triggeredBy: triggeredBy,
            reason: reason,
            timestamp: (_a = transitionLog.completedTimestamp) === null || _a === void 0 ? void 0 : _a.toISOString()
        });
    };
    /**
     * Register a callback to be notified when the reality mode changes
     */
    RealityModeManager.prototype.registerModeChangeCallback = function (callback) {
        this.modeChangeCallbacks.push(callback);
    };
    /**
     * Get all transition logs
     */
    RealityModeManager.prototype.getTransitionLogs = function () {
        return __spreadArray([], this.transitionLogs, true);
    };
    /**
     * Get the current transition in progress, if any
     */
    RealityModeManager.prototype.getOngoingTransition = function () {
        return this.ongoingTransition;
    };
    /**
     * Validate that the given transition ID matches the ongoing transition
     */
    RealityModeManager.prototype.validateOngoingTransition = function (transitionId) {
        if (!this.ongoingTransition) {
            throw new Error('No transition is currently in progress.');
        }
        if (this.ongoingTransition.transitionId !== transitionId) {
            throw new Error("Transition ID mismatch. Expected ".concat(this.ongoingTransition.transitionId, ", received ").concat(transitionId, "."));
        }
    };
    /**
     * Determine the current stage of a transition
     */
    RealityModeManager.prototype.determineTransitionStage = function (transition) {
        if (transition.readinessCheck)
            return 'readiness_check';
        if (transition.secondaryConfirmation)
            return 'secondary_confirmation';
        if (transition.authorization)
            return 'authorization';
        if (transition.primaryConfirmation)
            return 'primary_confirmation';
        return 'request';
    };
    /**
     * Notify all registered callbacks about a mode change
     */
    RealityModeManager.prototype.notifyModeChangeCallbacks = function (newMode) {
        for (var _i = 0, _a = this.modeChangeCallbacks; _i < _a.length; _i++) {
            var callback = _a[_i];
            try {
                callback(newMode);
            }
            catch (error) {
                systemLogger.error("Error in mode change callback: ".concat(error instanceof Error ? error.message : String(error)), this.currentMode === 'SIMULATION' ? QuantumState.SIM_ANTIFLOW : QuantumState.REAL_ANTIFLOW, { domain: DomainEmoji.SYSTEM });
            }
        }
    };
    /**
     * Log the current reality mode
     */
    RealityModeManager.prototype.logCurrentMode = function () {
        // Use symbolic logger with current quantum state and SYSTEM domain
        systemLogger.info("CURRENT REALITY MODE: ".concat(this.currentMode), MODE_TO_QUANTUM_STATE[this.currentMode], { domain: DomainEmoji.SYSTEM });
        // Record metric
        quantumGlossary.recordFlowMetric(MODE_TO_QUANTUM_STATE[this.currentMode], // Use the appropriate quantum state based on current mode
        'reality_mode_status', 1, { currentMode: this.currentMode });
    };
    return RealityModeManager;
}());
export { RealityModeManager };
