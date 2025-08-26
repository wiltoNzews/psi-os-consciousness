/**
 * Enhanced Responsibility Checker with Explicit-Implicit Quantum Balance
 * 
 * This module implements the Single Responsibility Principle verification
 * using the Explicit-Implicit Quantum Balance approach with strategic contexts
 * and the decohere pattern to prevent recursion while maintaining adaptivity.
 * 
 * The checker verifies that modules follow the Single Responsibility Principle by:
 * 1. Looking for explicit responsibility documentation
 * 2. Analyzing code structure for responsibility patterns
 * 3. Checking for common SRP violations (e.g., god objects)
 */
import * as fs from 'fs/promises';
import * as path from 'path';
import { quantumGlossary, FlowType } from '../services/qrn/quantum-glossary.js';

/**
 * Check if a module follows the Single Responsibility Principle
 * using Explicit-Implicit Quantum Balance approach.
 * 
 * @param {string} modulePath - Path to the module file to check
 * @returns {Promise<{passed: boolean, message: string, lineNumbers?: number[]}>} - Check result
 */
export async function checkResponsibility(modulePath) {
    console.log(`[ResponsibilityChecker] Checking responsibility principle in: ${modulePath}`);
    
    try {
        // Create a strategic context for responsibility verification strategy
        const strategicContext = {
            contextDescription: "Responsibility verification strategy",
            possibleNextActions: [
                "Check for explicit responsibility documentation",
                "Analyze code structure for single responsibility",
                "Combined documentation and structure analysis"
            ],
            metadata: {
                modulePath,
                moduleType: modulePath.endsWith('.ts') ? 'typescript' : 'javascript',
                verificationStage: "execution"
            }
        };

        // Use quantum glossary to decohere this context into an explicit tactical approach
        const verificationApproach = quantumGlossary.decohere(strategicContext);
        console.log(`[ResponsibilityChecker] Chosen verification approach: ${verificationApproach}`);
        
        // Get content of the module file
        const content = await fs.readFile(modulePath, 'utf-8');
        const lines = content.split('\n');
        
        let result;
        
        // Execute verification based on the chosen approach
        if (verificationApproach === "Check for explicit responsibility documentation") {
            result = await checkResponsibilityDocumentation(modulePath, content, lines);
        } 
        else if (verificationApproach === "Analyze code structure for single responsibility") {
            result = await analyzeCodeStructure(modulePath, content, lines);
        }
        else {
            // Combined approach
            result = await performCombinedAnalysis(modulePath, content, lines);
        }
        
        // Record verification metrics
        quantumGlossary.recordFlowMetric(
            result.passed ? FlowType.FLOW : FlowType.ANTIFLOW,
            'responsibility_verification',
            result.passed ? 100 : 0,
            { 
                modulePath: path.basename(modulePath),
                verificationApproach
            }
        );
        
        // Tag the result message with quantum glossary context
        const taggedMessage = quantumGlossary.tagWithContext(
            `[ResponsibilityChecker] ${result.message}`
        );
        console.log(taggedMessage);
        
        return result;
    } catch (error) {
        // Explicit error handling with quantum glossary tagging
        const errorContext = quantumGlossary.tagWithContext(
            `[ResponsibilityChecker] Error checking responsibility for ${modulePath}: ${error.message}`
        );
        console.error(errorContext);
        
        // Record error as antiflow
        quantumGlossary.recordFlowMetric(
            FlowType.ANTIFLOW, 
            'responsibility_check_error', 
            0,
            { 
                modulePath: path.basename(modulePath),
                error: error.message
            }
        );
        
        return {
            passed: false,
            message: `Error checking responsibility: ${error.message}`
        };
    }
}

/**
 * Check for explicit responsibility documentation in comments
 * 
 * @param {string} modulePath - Path to the module file
 * @param {string} content - Content of the file
 * @param {string[]} lines - Lines of the file
 * @returns {Promise<{passed: boolean, message: string, lineNumbers?: number[]}>} - Check result
 */
async function checkResponsibilityDocumentation(modulePath, content, lines) {
    console.log(`[ResponsibilityChecker] Checking for explicit responsibility documentation in ${modulePath}`);
    
    // Create a strategic context for documentation analysis
    const documentationContext = {
        contextDescription: "Responsibility documentation analysis strategy",
        possibleNextActions: [
            "Focus on explicit responsibility keywords",
            "Analyze JSDoc and comment patterns",
            "Consider all documentation types equally"
        ],
        metadata: {
            modulePath,
            commentDensity: content.split('//').length / lines.length,
            verificationStage: "documentation_analysis"
        }
    };

    // Use quantum glossary to decohere this context into an explicit tactical approach
    const documentationApproach = quantumGlossary.decohere(documentationContext);
    console.log(`[ResponsibilityChecker] Chosen documentation approach: ${documentationApproach}`);
    
    // Patterns that indicate proper responsibility handling
    const responsibilityPatterns = [
        { regex: /RESPONSIBILITY/i, description: "Responsibility comment", weight: documentationApproach === "Focus on explicit responsibility keywords" ? 2.0 : 1.0 },
        { regex: /SINGLE\s+RESPONSIBILITY/i, description: "Single Responsibility Principle comment", weight: documentationApproach === "Focus on explicit responsibility keywords" ? 2.0 : 1.0 },
        { regex: /PURPOSE:/i, description: "Purpose specification", weight: 1.0 },
        { regex: /\/\*\*[\s\S]*?\*\//m, description: "JSDoc comment block", weight: documentationApproach === "Analyze JSDoc and comment patterns" ? 1.5 : 0.5 },
        { regex: /\/\/\s*[A-Z].*$/m, description: "Single-line comment with capitalized first letter", weight: documentationApproach === "Analyze JSDoc and comment patterns" ? 1.0 : 0.5 }
    ];

    // Look for responsibility-related comments and patterns
    let weightedFound = 0;
    const matchedLines = [];
    const matchedPatterns = [];

    // Analyze documentation patterns
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        for (const pattern of responsibilityPatterns) {
            if (pattern.regex.test(line)) {
                weightedFound += pattern.weight;
                matchedLines.push(i + 1); // Convert to 1-based line numbers
                matchedPatterns.push(pattern.description);
                break;
            }
        }
    }

    // Determine if documentation is sufficient based on the weighted score
    const threshold = 2.0; // Require equivalent of at least 2 standard patterns or 1 high-weight pattern
    const passed = weightedFound >= threshold;
    
    return {
        passed,
        message: passed 
            ? `Well-documented responsibility: ${matchedPatterns.join(', ')}` 
            : "Insufficient responsibility documentation",
        lineNumbers: matchedLines
    };
}

/**
 * Analyze code structure for single responsibility
 * 
 * @param {string} modulePath - Path to the module file
 * @param {string} content - Content of the file
 * @param {string[]} lines - Lines of the file
 * @returns {Promise<{passed: boolean, message: string, lineNumbers?: number[]}>} - Check result
 */
async function analyzeCodeStructure(modulePath, content, lines) {
    console.log(`[ResponsibilityChecker] Analyzing code structure for single responsibility in ${modulePath}`);
    
    // Create a strategic context for structure analysis
    const structureContext = {
        contextDescription: "Code structure analysis strategy",
        possibleNextActions: [
            "Focus on class and method counts",
            "Prioritize cohesive naming patterns",
            "Look for god object patterns"
        ],
        metadata: {
            modulePath,
            fileSize: content.length,
            verificationStage: "structure_analysis"
        }
    };

    // Use quantum glossary to decohere this context into an explicit tactical approach
    const structureApproach = quantumGlossary.decohere(structureContext);
    console.log(`[ResponsibilityChecker] Chosen structure approach: ${structureApproach}`);
    
    // Analyze code structure for single responsibility principle
    const classCount = (content.match(/class\s+[A-Za-z0-9_]+/g) || []).length;
    const interfaceCount = (content.match(/interface\s+[A-Za-z0-9_]+/g) || []).length;
    const methodCount = (content.match(/function\s+[A-Za-z0-9_]+|[A-Za-z0-9_]+\s*\([^)]*\)\s*{/g) || []).length;
    
    // Check if the file follows cohesion patterns
    const hasCohesiveNaming = /^(.*?)(?:Repository|Service|Controller|Handler|Manager|Factory|Provider|Adapter|Util)\.ts$/i.test(modulePath);
    
    // Check for common SRP violations
    const godObjectPattern = /(class|interface)\s+[A-Za-z0-9_]+[\s\S]{1000,}/; // Large class/interface (>1000 chars)
    const hasPotentialGodObject = godObjectPattern.test(content) && methodCount > 15;
    
    // Determine if responsibility principle is followed based on the chosen approach
    let isSingleResponsibility = false;
    let srMessage = "";
    
    if (structureApproach === "Focus on class and method counts") {
        if (classCount <= 2 && methodCount < 15) {
            isSingleResponsibility = true;
            srMessage = `Follows Single Responsibility Principle: contains ${classCount} classes and ${methodCount} methods`;
        } else {
            isSingleResponsibility = false;
            srMessage = `Potential violation of Single Responsibility Principle: contains ${classCount} classes and ${methodCount} methods`;
        }
    } 
    else if (structureApproach === "Prioritize cohesive naming patterns") {
        if (hasCohesiveNaming) {
            isSingleResponsibility = true;
            srMessage = "Follows Single Responsibility Principle through cohesive naming pattern";
        } else {
            isSingleResponsibility = false;
            srMessage = "Potential violation of Single Responsibility Principle: lacks cohesive naming pattern";
        }
    }
    else {
        // Look for god object patterns
        if (hasPotentialGodObject) {
            isSingleResponsibility = false;
            srMessage = "Potential violation of Single Responsibility Principle: file contains large classes with many methods";
        } else {
            isSingleResponsibility = true;
            srMessage = "Follows Single Responsibility Principle: no god object patterns detected";
        }
    }
    
    return {
        passed: isSingleResponsibility,
        message: srMessage
    };
}

/**
 * Perform combined analysis of documentation and structure
 * 
 * @param {string} modulePath - Path to the module file
 * @param {string} content - Content of the file
 * @param {string[]} lines - Lines of the file
 * @returns {Promise<{passed: boolean, message: string, lineNumbers?: number[]}>} - Check result
 */
async function performCombinedAnalysis(modulePath, content, lines) {
    console.log(`[ResponsibilityChecker] Performing combined analysis for ${modulePath}`);
    
    // Run both analysis methods
    const documentationResult = await checkResponsibilityDocumentation(modulePath, content, lines);
    const structureResult = await analyzeCodeStructure(modulePath, content, lines);
    
    // Create a strategic context for results combination
    const combinationContext = {
        contextDescription: "Results combination strategy",
        possibleNextActions: [
            "Pass if either documentation or structure passes",
            "Pass only if both documentation and structure pass",
            "Weighted combination of documentation and structure results"
        ],
        metadata: {
            modulePath,
            documentationPassed: documentationResult.passed,
            structurePassed: structureResult.passed,
            verificationStage: "results_combination"
        }
    };

    // Use quantum glossary to decohere this context into an explicit tactical approach
    const combinationApproach = quantumGlossary.decohere(combinationContext);
    console.log(`[ResponsibilityChecker] Chosen combination approach: ${combinationApproach}`);
    
    let passed = false;
    let message = "";
    
    if (combinationApproach === "Pass if either documentation or structure passes") {
        passed = documentationResult.passed || structureResult.passed;
        message = passed 
            ? `Follows Single Responsibility Principle: ${documentationResult.passed ? 'has good documentation' : 'has good structure'}`
            : "Violation of Single Responsibility Principle: both documentation and structure checks failed";
    } 
    else if (combinationApproach === "Pass only if both documentation and structure pass") {
        passed = documentationResult.passed && structureResult.passed;
        message = passed 
            ? "Follows Single Responsibility Principle: both documentation and structure are good"
            : `Potential violation of Single Responsibility Principle: ${!documentationResult.passed ? 'documentation is inadequate' : 'structure is problematic'}`;
    }
    else {
        // Weighted combination (60% structure, 40% documentation)
        const weightedScore = (structureResult.passed ? 0.6 : 0) + (documentationResult.passed ? 0.4 : 0);
        passed = weightedScore >= 0.6; // Pass if weighted score is at least 0.6
        message = passed 
            ? `Follows Single Responsibility Principle with weighted score ${(weightedScore * 100).toFixed(0)}%`
            : `Potential violation of Single Responsibility Principle with score ${(weightedScore * 100).toFixed(0)}%`;
    }
    
    return {
        passed,
        message,
        lineNumbers: documentationResult.lineNumbers
    };
}

// Export the main function for use in other modules
export default checkResponsibility;