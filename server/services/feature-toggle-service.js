"use strict";
/**
 * Feature Toggle Service
 *
 * This service enables safe experimentation with new features by providing
 * a centralized mechanism to enable/disable functionality at runtime.
 * It supports both global feature flags and context-specific toggles.
 *
 * BOUNDARY CONSCIOUSNESS: This module explicitly manages the boundary
 * between stable and experimental features, providing clear control points
 * for system administrators and developers.
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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.FeatureToggleService = exports.Feature = void 0;
// Define available features that can be toggled
var Feature;
(function (Feature) {
    // Time/Chronos Protocol Features
    Feature["CHRONOS_HANDLER"] = "chronos_handler";
    Feature["CHRONOS_STRICT_VALIDATION"] = "chronos_strict_validation";
    Feature["CHRONOS_TIMEZONE_AWARENESS"] = "chronos_timezone_awareness";
    Feature["CHRONOS_ADVANCED_FORMATTING"] = "chronos_advanced_formatting";
    Feature["TEMPORAL_HISTORY"] = "temporal_history";
    // Quantum Root Node Features
    Feature["QRN_ADVANCED_COHERENCE"] = "qrn_advanced_coherence";
    Feature["QRN_STATE_PREDICTION"] = "qrn_state_prediction";
    Feature["COHERENCE_ANALYSIS"] = "coherence_analysis";
    // Neural Pathway Features
    Feature["NEURAL_PATHWAY_WEIGHT_ADAPTATION"] = "neural_pathway_weight_adaptation";
    Feature["NEURAL_PATHWAY_DYNAMIC_ROUTING"] = "neural_pathway_dynamic_routing";
    // Meta-Cognitive Features
    Feature["META_COGNITIVE_SELF_REFLECTION"] = "meta_cognitive_self_reflection";
    Feature["META_COGNITIVE_PATTERN_RECOGNITION"] = "meta_cognitive_pattern_recognition";
    // System Features
    Feature["ADVANCED_CACHING"] = "advanced_caching";
    Feature["PERFORMANCE_METRICS"] = "performance_metrics";
    // API Features
    Feature["REST_API_RATE_LIMITING"] = "rest_api_rate_limiting";
    Feature["REST_API_VERSIONING"] = "rest_api_versioning";
})(Feature || (exports.Feature = Feature = {}));
// Default feature toggle state
var DEFAULT_TOGGLES = (_a = {},
    // Time/Chronos Protocol defaults
    _a[Feature.CHRONOS_HANDLER] = true, // Enable by default
    _a[Feature.CHRONOS_STRICT_VALIDATION] = false,
    _a[Feature.CHRONOS_TIMEZONE_AWARENESS] = false,
    _a[Feature.CHRONOS_ADVANCED_FORMATTING] = false,
    _a[Feature.TEMPORAL_HISTORY] = true, // Enable by default
    // QRN defaults
    _a[Feature.QRN_ADVANCED_COHERENCE] = false,
    _a[Feature.QRN_STATE_PREDICTION] = false,
    _a[Feature.COHERENCE_ANALYSIS] = true, // Enable by default
    // Neural Pathway defaults
    _a[Feature.NEURAL_PATHWAY_WEIGHT_ADAPTATION] = false,
    _a[Feature.NEURAL_PATHWAY_DYNAMIC_ROUTING] = false,
    // Meta-Cognitive defaults
    _a[Feature.META_COGNITIVE_SELF_REFLECTION] = false,
    _a[Feature.META_COGNITIVE_PATTERN_RECOGNITION] = false,
    // System defaults
    _a[Feature.ADVANCED_CACHING] = false,
    _a[Feature.PERFORMANCE_METRICS] = true, // Enable by default
    // API defaults
    _a[Feature.REST_API_RATE_LIMITING] = false,
    _a[Feature.REST_API_VERSIONING] = false,
    _a);
/**
 * FeatureToggleService - Manages feature toggles for the system
 */
var FeatureToggleService = /** @class */ (function () {
    /**
     * Private constructor to enforce singleton pattern
     */
    function FeatureToggleService() {
        this.toggles = __assign({}, DEFAULT_TOGGLES);
        this.contextToggles = new Map();
        // Log initialization
        console.log('FeatureToggleService initialized with default settings');
    }
    /**
     * Get the singleton instance
     *
     * @returns FeatureToggleService instance
     */
    FeatureToggleService.getInstance = function () {
        if (!FeatureToggleService.instance) {
            FeatureToggleService.instance = new FeatureToggleService();
        }
        return FeatureToggleService.instance;
    };
    /**
     * Check if a feature is enabled
     *
     * @param feature Feature to check
     * @param context Optional context identifier
     * @returns True if the feature is enabled
     */
    FeatureToggleService.prototype.isEnabled = function (feature, context) {
        // If a context is provided, check context-specific toggle first
        if (context && this.contextToggles.has(context)) {
            var contextToggle = this.contextToggles.get(context);
            if (feature in contextToggle) {
                return contextToggle[feature];
            }
        }
        // Fall back to global toggle
        return this.toggles[feature] || false;
    };
    /**
     * Enable a feature
     *
     * @param feature Feature to enable
     * @param context Optional context identifier
     */
    FeatureToggleService.prototype.enable = function (feature, context) {
        this.setFeatureState(feature, true, context);
        console.log("Feature ".concat(feature, " enabled").concat(context ? " for context ".concat(context) : ''));
    };
    /**
     * Disable a feature
     *
     * @param feature Feature to disable
     * @param context Optional context identifier
     */
    FeatureToggleService.prototype.disable = function (feature, context) {
        this.setFeatureState(feature, false, context);
        console.log("Feature ".concat(feature, " disabled").concat(context ? " for context ".concat(context) : ''));
    };
    /**
     * Set the state of a feature
     *
     * @param feature Feature to set
     * @param state Desired state (true = enabled, false = disabled)
     * @param context Optional context identifier
     */
    FeatureToggleService.prototype.setFeatureState = function (feature, state, context) {
        if (context) {
            // Initialize context toggles if they don't exist
            if (!this.contextToggles.has(context)) {
                this.contextToggles.set(context, __assign({}, this.toggles));
            }
            // Update context-specific toggle
            var contextToggle = this.contextToggles.get(context);
            contextToggle[feature] = state;
        }
        else {
            // Update global toggle
            this.toggles[feature] = state;
        }
    };
    /**
     * Reset all toggles to default values
     *
     * @param context Optional context identifier
     */
    FeatureToggleService.prototype.resetToDefaults = function (context) {
        if (context) {
            this.contextToggles.delete(context);
            console.log("Reset toggles for context ".concat(context, " to defaults"));
        }
        else {
            this.toggles = __assign({}, DEFAULT_TOGGLES);
            console.log('Reset all toggles to defaults');
        }
    };
    /**
     * Get the current state of all toggles
     *
     * @param context Optional context identifier
     * @returns Current toggle state
     */
    FeatureToggleService.prototype.getToggleState = function (context) {
        if (context && this.contextToggles.has(context)) {
            return __assign({}, this.contextToggles.get(context));
        }
        return __assign({}, this.toggles);
    };
    /**
     * Enable multiple features at once
     *
     * @param features Features to enable
     * @param context Optional context identifier
     */
    FeatureToggleService.prototype.enableFeatures = function (features, context) {
        var _this = this;
        features.forEach(function (feature) { return _this.enable(feature, context); });
    };
    /**
     * Disable multiple features at once
     *
     * @param features Features to disable
     * @param context Optional context identifier
     */
    FeatureToggleService.prototype.disableFeatures = function (features, context) {
        var _this = this;
        features.forEach(function (feature) { return _this.disable(feature, context); });
    };
    return FeatureToggleService;
}());
exports.FeatureToggleService = FeatureToggleService;
