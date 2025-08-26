/**
 * Enhanced verification script for Chronos usage in a module
 * 
 * This script implements the Explicit-Implicit Quantum Balance principle by:
 * 1. Creating a strategic context with multiple possible verification strategies
 * 2. Using the decohere pattern to explicitly choose a verification approach
 * 3. Carrying out tactical verification based on the explicit choice
 * 
 * The script checks if a file uses 'new Date()' directly or properly uses
 * 'ChronosDateHandler.createDate()' for all date creation.
 */
import * as fs from 'fs/promises';
import * as path from 'path';
import { quantumGlossary, FlowType } from '../services/qrn/quantum-glossary.ts';

/**
 * Check if a module properly uses ChronosDateHandler for date handling
 * 
 * This function implements the Explicit-Implicit Quantum Balance principle
 * by using a strategic context with the decohere pattern to explicitly
 * choose verification strategies while maintaining implicit adaptivity.
 * 
 * @param {string} modulePath - Path to the module file to verify
 * @returns {Promise<Object>} - Verification result
 */
async function checkChronosUsage(modulePath) {
    console.log(`Checking Chronos usage in: ${modulePath}`);
    
    // Create a strategic context for verification with multiple possible approaches
    // This demonstrates the Explicit-Implicit Quantum Balance principle
    const strategicContext = {
        contextDescription: "Chronos date handler verification strategy",
        possibleNextActions: [
            "Check for direct new Date() calls",
            "Verify proper ChronosDateHandler.createDate() usage",
            "Look for date serialization patterns",
            "Examine date-related boundary handling"
        ],
        metadata: {
            modulePath,
            moduleType: modulePath.endsWith('.ts') ? 'typescript' : 'javascript',
            isChronosModule: modulePath.endsWith('chronos-date-handler.ts')
        }
    };
    
    // Use quantum glossary to decohere this context into an explicit tactical approach
    // This explicitly demonstrates the Explicit-Implicit Quantum Balance
    const verificationApproach = quantumGlossary.decohere(strategicContext);
    console.log(`[ChronosVerifier] Chosen verification approach: ${verificationApproach}`);
    
    try {
        const content = await fs.readFile(modulePath, 'utf-8');
        const lines = content.split('\n');
        
        // Perform explicit tactical verification based on the chosen approach
        const newDateRegex = /\bnew Date\(/g;
        const chronosUsageRegex = /\bChronosDateHandler\.createDate\(/g;
        
        const newDateMatches = [];
        const chronosMatches = [];
        
        for (let i = 0; i < lines.length; i++) {
            let match;
            while ((match = newDateRegex.exec(lines[i])) !== null) {
                newDateMatches.push(i + 1); // Line Number
            }
            while ((match = chronosUsageRegex.exec(lines[i])) !== null) {
                chronosMatches.push(i + 1);
            }
        }
        
        // Update the strategic context with verification findings
        const updatedContext = {
            ...strategicContext,
            metadata: {
                ...strategicContext.metadata,
                newDateCount: newDateMatches.length,
                chronosUsageCount: chronosMatches.length,
                verificationComplete: true
            }
        };
        
        // Record verification as a flow metric
        quantumGlossary.recordFlowMetric(FlowType.FLOW, 
            'chronos_verification', 
            chronosMatches.length, 
            { newDateCount: newDateMatches.length, verificationType: 'chronos' }
        );
        
        // Explicitly decohere again to determine the verification result
        // This applies Explicit-Implicit Quantum Balance to the decision process
        const verificationDecision = quantumGlossary.decohere(updatedContext);
        console.log(`[ChronosVerifier] Verification decision: ${verificationDecision}`);
        
        // Special exception for the ChronosDateHandler itself using explicit conditions
        if (modulePath.endsWith('chronos-date-handler.ts')) {
            console.log('[ChronosVerifier] ChronosDateHandler exception explicitly applied');
            return {
                passed: true,
                message: "ChronosDateHandler is exempt from Chronos usage checks (would cause circular reference)."
            };
        } else if (newDateMatches.length > 0) {
            // Explicitly decide to fail the verification due to new Date() usage
            return {
                passed: false,
                message: "Inconsistent use of ChronosDateHandler. Direct new Date() calls found.",
                lineNumbers: newDateMatches,
                details: {
                    newDateCount: newDateMatches.length,
                    chronosUsageCount: chronosMatches.length,
                    verificationApproach,
                    verificationDecision
                }
            };
        } else {
            // Explicitly decide to pass the verification
            return { 
                passed: true, 
                message: "ChronosDateHandler used consistently for all date creation.",
                details: {
                    newDateCount: newDateMatches.length,
                    chronosUsageCount: chronosMatches.length,
                    verificationApproach,
                    verificationDecision
                }
            };
        }
        
    } catch (error) {
        // Explicit error handling with quantum glossary tagging
        const errorContext = quantumGlossary.tagWithContext(`[ChronosVerifier] Error verifying ${modulePath}: ${error.message}`);
        console.error(errorContext);
        
        return {
            passed: false,
            message: `Error reading file: ${error.message}`,
            details: {
                error: error.message,
                errorType: error.name,
                verificationApproach: strategicContext.possibleNextActions[0] // Default to first approach on error
            }
        };
    }
}

// Main execution
const modulePath = process.argv[2];

if (!modulePath) {
    console.error("Usage: node verify-chronos.js <modulePath>");
    process.exit(1);
}

// Resolve the module path relative to the current directory
const absoluteModulePath = path.resolve(process.cwd(), modulePath);

// Run the verification
checkChronosUsage(absoluteModulePath)
    .then(result => {
        console.log(JSON.stringify(result, null, 2));
        process.exit(result.passed ? 0 : 1);
    })
    .catch(error => {
        console.error("Verification failed:", error);
        process.exit(1);
    });