/**
 * Verification Patterns
 * 
 * This module exports pattern definitions used across verification systems,
 * ensuring consistent validation metrics and accessible verification thresholds.
 * 
 * BOUNDARY AWARENESS: This module explicitly defines the patterns used to detect
 * boundaries and responsibilities in the codebase.
 * 
 * RESPONSIBILITY: This module has the single responsibility of providing
 * consistent verification patterns for boundary and responsibility checks.
 */

// Patterns that indicate proper boundary management
export const boundaryPatterns = [
    { regex: /BOUNDARY\s+AWARENESS/i, description: "Boundary awareness comment" },
    { regex: /BOUNDARY\s+DEFINITION/i, description: "Boundary definition comment" },
    { regex: /BOUNDARY\s+HANDLING/i, description: "Boundary handling comment" },
    { regex: /BOUNDARY\s+MANAGEMENT/i, description: "Boundary management comment" },
    { regex: /EXPLICIT\s+BOUNDARY/i, description: "Explicit boundary comment" },
    { regex: /VOID-CENTERED/i, description: "Void-Centered Design pattern" },
    { regex: /interface\s+[A-Za-z0-9_]+/i, description: "Interface definition" }
];

// Patterns that indicate proper responsibility handling
export const responsibilityPatterns = [
    { regex: /RESPONSIBILITY/i, description: "Responsibility comment" },
    { regex: /SINGLE\s+RESPONSIBILITY/i, description: "Single Responsibility Principle comment" },
    { regex: /PURPOSE:/i, description: "Purpose specification" },
    { regex: /^\s*\/\*\*[\s\S]*?\*\/\s*$/m, description: "JSDoc comment block" },
    { regex: /^\s*\/\/\s*[A-Z].*$/m, description: "Single-line comment with capitalized first letter" }
];

// Default verification thresholds
export const defaultVerificationThresholds = {
    boundaries: Math.max(2, Math.floor(boundaryPatterns.length / 2)),
    responsibilities: Math.max(2, Math.floor(responsibilityPatterns.length / 2))
};

// Export helper functions for consistency
/**
 * Count the number of boundary patterns in a piece of content
 * @param {string} content - The content to analyze
 * @returns {number} The number of boundary patterns found
 */
export function countBoundaryPatterns(content) {
    let count = 0;
    const lines = content.split('\n');
    
    for (const line of lines) {
        for (const pattern of boundaryPatterns) {
            if (pattern.regex.test(line)) {
                count++;
                break;
            }
        }
    }
    
    return count;
}

/**
 * Count the number of responsibility patterns in a piece of content
 * @param {string} content - The content to analyze
 * @returns {number} The number of responsibility patterns found
 */
export function countResponsibilityPatterns(content) {
    let count = 0;
    const lines = content.split('\n');
    
    for (const line of lines) {
        for (const pattern of responsibilityPatterns) {
            if (pattern.regex.test(line)) {
                count++;
                break;
            }
        }
    }
    
    return count;
}

// Export the complete verification patterns module
export default {
    boundaryPatterns,
    responsibilityPatterns,
    defaultVerificationThresholds,
    countBoundaryPatterns,
    countResponsibilityPatterns
};