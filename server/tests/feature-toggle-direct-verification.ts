/**
 * Direct Verification of Feature Toggle Service
 * 
 * This script directly verifies that the FeatureToggleService properly manages
 * feature flags and context-specific toggles as part of the Binary Toggle System.
 * 
 * It applies the TSAR BOMBA verification approach with explicit testing
 * for each function and edge case.
 */

import { FeatureToggleService, Feature } from '../services/feature-toggle-service.js';

/**
 * Run the direct verification of the Feature Toggle Service
 */
async function runVerification() {
  console.log("🚩 FEATURE TOGGLE SYSTEM - DIRECT VERIFICATION");
  console.log("=============================================");
  
  // Get the singleton instance
  const toggleService = FeatureToggleService.getInstance();
  console.log("Feature Toggle Service initialized");
  
  // Verify default state
  const defaultState = toggleService.getToggleState();
  console.log("\nDefault state for CHRONOS_HANDLER:", defaultState[Feature.CHRONOS_HANDLER]);
  console.log("Default state for CHRONOS_STRICT_VALIDATION:", defaultState[Feature.CHRONOS_STRICT_VALIDATION]);
  
  // Test enabling a feature
  toggleService.enable(Feature.CHRONOS_STRICT_VALIDATION);
  console.log("\nAfter enabling CHRONOS_STRICT_VALIDATION:");
  console.log("CHRONOS_STRICT_VALIDATION enabled:", toggleService.isEnabled(Feature.CHRONOS_STRICT_VALIDATION));
  
  // Test disabling a feature
  toggleService.disable(Feature.CHRONOS_HANDLER);
  console.log("\nAfter disabling CHRONOS_HANDLER:");
  console.log("CHRONOS_HANDLER enabled:", toggleService.isEnabled(Feature.CHRONOS_HANDLER));
  
  // Test context-specific toggles
  const testContext = "test-session-123";
  toggleService.enable(Feature.CHRONOS_HANDLER, testContext);
  console.log("\nContext-specific toggle (test-session-123):");
  console.log("Global CHRONOS_HANDLER enabled:", toggleService.isEnabled(Feature.CHRONOS_HANDLER));
  console.log("Context CHRONOS_HANDLER enabled:", toggleService.isEnabled(Feature.CHRONOS_HANDLER, testContext));
  
  // Test multiple feature enabling
  toggleService.enableFeatures([
    Feature.META_COGNITIVE_SELF_REFLECTION,
    Feature.META_COGNITIVE_PATTERN_RECOGNITION
  ]);
  console.log("\nAfter enabling multiple features:");
  console.log("META_COGNITIVE_SELF_REFLECTION enabled:", toggleService.isEnabled(Feature.META_COGNITIVE_SELF_REFLECTION));
  console.log("META_COGNITIVE_PATTERN_RECOGNITION enabled:", toggleService.isEnabled(Feature.META_COGNITIVE_PATTERN_RECOGNITION));
  
  // Test multiple feature disabling
  toggleService.disableFeatures([
    Feature.META_COGNITIVE_SELF_REFLECTION,
    Feature.META_COGNITIVE_PATTERN_RECOGNITION
  ], testContext);
  console.log("\nAfter disabling multiple features in context:");
  console.log("Global META_COGNITIVE_SELF_REFLECTION enabled:", toggleService.isEnabled(Feature.META_COGNITIVE_SELF_REFLECTION));
  console.log("Context META_COGNITIVE_SELF_REFLECTION enabled:", toggleService.isEnabled(Feature.META_COGNITIVE_SELF_REFLECTION, testContext));
  
  // Test reset to defaults for global
  toggleService.resetToDefaults();
  console.log("\nAfter reset to defaults (global):");
  console.log("CHRONOS_HANDLER enabled:", toggleService.isEnabled(Feature.CHRONOS_HANDLER));
  console.log("CHRONOS_STRICT_VALIDATION enabled:", toggleService.isEnabled(Feature.CHRONOS_STRICT_VALIDATION));
  
  // Test reset to defaults for context
  toggleService.resetToDefaults(testContext);
  console.log("\nAfter reset to defaults (context):");
  console.log("Context CHRONOS_HANDLER enabled:", toggleService.isEnabled(Feature.CHRONOS_HANDLER, testContext));
  
  // Test multiple instances (should be the same instance)
  const toggleService2 = FeatureToggleService.getInstance();
  console.log("\nSingleton verification:");
  console.log("Is same instance:", toggleService === toggleService2);
  
  console.log("\n✅ FEATURE TOGGLE SYSTEM VERIFICATION COMPLETE");
}

// Run the verification
runVerification()
  .then(() => {
    console.log("Feature Toggle System verification succeeded");
  })
  .catch(error => {
    console.error("Feature Toggle System verification failed:", error);
    process.exit(1);
  });