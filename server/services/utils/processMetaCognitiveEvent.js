/**
 * Process Meta-Cognitive Event Utility
 *
 * This is a centralized utility for standardizing MetaCognitive event creation
 * using the MetaCognitiveEventBuilder to ensure consistency and type safety.
 *
 * BOUNDARY AWARENESS: This utility enforces a clear boundary between
 * application logic and event creation/processing, serving as the linchpin
 * in the fractal pattern 32×16×8×4×2×1×2×4×8×16×32.
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
import { v4 as uuidv4 } from 'uuid';
import { MetaCognitiveEventBuilder } from './MetaCognitiveEventBuilder.js';
import { metaCognitiveEngine } from '../qrn/meta-cognitive-analysis-engine.js';
import { ensureValidMetaCognitiveEvent } from './MetaCognitiveEventUtility.js';
import { ensureObject, ensureString } from './typeConverters.js';
/**
 * Process a meta cognitive event with standardized builder pattern
 *
 * BOUNDARY AWARENESS: This is a critical boundary point for event creation
 * across the entire system. All meta-cognitive events should flow through
 * this utility to ensure consistent property naming and validation.
 *
 * @param type - Event type
 * @param description - Event description
 * @param details - Event details object
 * @param options - Additional options (confidence, impact, etc.)
 * @returns Promise that resolves when the event is processed
 */
export function processMetaCognitiveEvent(type_1, description_1, details_1) {
    return __awaiter(this, arguments, void 0, function (type, description, details, options) {
        var id, nodeId, sourceContext, ctx, builder, event, validatedEvent, error_1;
        var _a, _b;
        if (options === void 0) { options = {}; }
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    id = uuidv4();
                    nodeId = options.nodeId || id;
                    if (options.sourceContext) {
                        ctx = ensureObject(options.sourceContext);
                        sourceContext = __assign({ source: ctx.source || 'system', operation: ctx.operation || ensureString(type, 'unknown') }, ctx);
                    }
                    else {
                        sourceContext = {
                            source: 'system',
                            operation: ensureString(type, 'unknown')
                        };
                    }
                    builder = new MetaCognitiveEventBuilder()
                        .withId(id)
                        .withNodeId(nodeId)
                        .withType(ensureString(type, 'unknown'))
                        .withCreatedAt(new Date())
                        .withDescription(ensureString(description, 'Event'))
                        .withDetails(ensureObject(details, {}))
                        .withConfidence((_a = options.confidence) !== null && _a !== void 0 ? _a : 1.0)
                        .withImpact((_b = options.impact) !== null && _b !== void 0 ? _b : 5)
                        .withRelatedEvents(options.relatedEvents || []) // Builder will format this as string
                        .withOutcome(ensureString(options.outcome || '', ''))
                        .withSourceContext(sourceContext);
                    event = builder.build();
                    validatedEvent = ensureValidMetaCognitiveEvent(event);
                    _c.label = 1;
                case 1:
                    _c.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, metaCognitiveEngine.processEvent(validatedEvent)];
                case 2:
                    _c.sent();
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _c.sent();
                    console.error('Error processing meta-cognitive event:', error_1);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
/**
 * Create an error meta cognitive event
 *
 * BOUNDARY AWARENESS: This is a specialized boundary point for error events
 * that handles the translation from error objects to meta-cognitive events.
 *
 * @param error - The error that occurred
 * @param context - Additional context about where the error occurred
 * @param options - Additional options (confidence, impact, etc.)
 * @returns Promise that resolves when the event is processed
 */
export function processErrorEvent(error_2, context_1) {
    return __awaiter(this, arguments, void 0, function (error, context, options) {
        var errorMessage, errorStack, safeData, sourceContext;
        var _a, _b, _c;
        if (options === void 0) { options = {}; }
        return __generator(this, function (_d) {
            errorMessage = error instanceof Error ? error.message : String(error);
            errorStack = error instanceof Error ? error.stack : undefined;
            safeData = context.data ?
                (typeof context.data === 'string' ?
                    context.data.substring(0, 100) + (context.data.length > 100 ? '...' : '') :
                    context.data) :
                undefined;
            sourceContext = {
                source: ensureString(context.component, 'unknown-component'),
                operation: 'error-handling',
                errorComponent: context.component,
                errorOperation: context.operation
            };
            return [2 /*return*/, processMetaCognitiveEvent('error', "Error in ".concat(context.component, ": ").concat(errorMessage), {
                    component: context.component,
                    operation: context.operation,
                    error: errorMessage,
                    stack: errorStack,
                    data: safeData
                }, {
                    nodeId: options.nodeId,
                    confidence: (_a = options.confidence) !== null && _a !== void 0 ? _a : 1.0,
                    impact: (_b = options.impact) !== null && _b !== void 0 ? _b : 8,
                    relatedEvents: (_c = options.relatedEvents) !== null && _c !== void 0 ? _c : [],
                    sourceContext: sourceContext
                })];
        });
    });
}
