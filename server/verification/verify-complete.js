/**
 * Enhanced comprehensive verification script with Explicit-Implicit Quantum Balance
 * 
 * This script runs all verification tests to ensure compliance with the
 * Modularity God Formula.
 * 
 * It implements the Explicit-Implicit Quantum Balance principle by:
 * 1. Creating a strategic context with multiple possible verification strategies
 * 2. Using the decohere pattern to explicitly choose a verification approach
 * 3. Carrying out tactical verification based on the explicit choice
 */
import * as fs from 'fs/promises';
import * as path from 'path';
import { quantumGlossary, FlowType } from '../services/qrn/quantum-glossary.js';

/**
 * Check Chronos usage in a module
 */
async function checkChronosUsage(modulePath) {
    console.log(`Checking Chronos usage in: ${modulePath}`);
    
    try {
        const content = await fs.readFile(modulePath, 'utf-8');
        const lines = content.split('\n');
        
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
        
        // Special exception for the ChronosDateHandler itself
        if (modulePath.endsWith('chronos-date-handler.ts')) {
            return {
                passed: true,
                message: "ChronosDateHandler is exempt from Chronos usage checks (would cause circular reference)."
            };
        } else if (newDateMatches.length > 0) {
            return {
                passed: false,
                message: "Inconsistent use of ChronosDateHandler. new Date() found.",
                lineNumbers: newDateMatches
            };
        } else {
            return { 
                passed: true, 
                message: "ChronosDateHandler used consistently." 
            };
        }
        
    } catch (error) {
        return {
            passed: false,
            message: `Error reading file: ${error.message}`
        };
    }
}

/**
 * Check storage interface implementation
 */
async function checkStorageImplementation(storagePath) {
    console.log(`Checking storage implementation in: ${storagePath}`);
    
    try {
        const content = await fs.readFile(storagePath, 'utf-8');
        const lines = content.split('\n');
        
        // Find all methods in the IStorage interface
        console.log('Extracting IStorage interface methods...');
        const interfaceMethods = [];
        let insideInterface = false;
        let bracketCount = 0;
        
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();
            
            // Check if we've found the interface
            if (line.includes('interface IStorage')) {
                insideInterface = true;
                bracketCount = 0;
                continue;
            }
            
            if (insideInterface) {
                // Count brackets to know when we're out of the interface
                if (line.includes('{')) bracketCount++;
                if (line.includes('}')) bracketCount--;
                
                // If bracketCount reaches 0, we're out of the interface
                if (bracketCount < 0) {
                    insideInterface = false;
                    continue;
                }
                
                // Look for method definitions
                const methodMatch = line.match(/^\s*(\w+)\s*\(/);
                if (methodMatch) {
                    interfaceMethods.push(methodMatch[1]);
                }
            }
        }
        
        console.log(`Found ${interfaceMethods.length} methods in IStorage interface`);
        if (interfaceMethods.length > 0) {
            console.log('Sample methods:', interfaceMethods.slice(0, 5));
        }
        
        // Find all implemented methods in the MemStorage class
        console.log('Extracting MemStorage implemented methods...');
        const implementedMethods = [];
        let insideClass = false;
        
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();
            
            // Check if we've found the class
            if (line.includes('class MemStorage') && line.includes('implements IStorage')) {
                insideClass = true;
                continue;
            }
            
            if (insideClass) {
                // Look for method implementations
                const methodMatch = line.match(/^\s*async\s+(\w+)\s*\(/);
                if (methodMatch) {
                    implementedMethods.push(methodMatch[1]);
                }
            }
        }
        
        console.log(`Found ${implementedMethods.length} implemented methods in MemStorage class`);
        if (implementedMethods.length > 0) {
            console.log('Sample implementations:', implementedMethods.slice(0, 5));
        }
        
        // Find missing methods
        const missingMethods = interfaceMethods.filter(
            method => !implementedMethods.includes(method)
        );
        
        if (missingMethods.length > 0) {
            console.log(`Missing ${missingMethods.length} methods:`, missingMethods);
            return {
                passed: false,
                message: `MemStorage is missing implementations for methods: ${missingMethods.join(', ')}`,
                missingMethods
            };
        }
        
        return { 
            passed: true, 
            message: "MemStorage fully implements the IStorage interface" 
        };
        
    } catch (error) {
        return {
            passed: false,
            message: `Error reading file: ${error.message}`
        };
    }
}

/**
 * Check if the file properly defines and manages boundaries using Void-Centered Design principles.
 */
async function checkBoundaryDefinition(modulePath) {
    console.log(`Checking boundary definition in: ${modulePath}`);
    
    try {
        const content = await fs.readFile(modulePath, 'utf-8');
        const lines = content.split('\n');
        
        // Patterns that indicate proper boundary management
        const boundaryPatterns = [
            { regex: /BOUNDARY\s+AWARENESS/i, description: "Boundary awareness comment" },
            { regex: /BOUNDARY\s+DEFINITION/i, description: "Boundary definition comment" },
            { regex: /BOUNDARY\s+HANDLING/i, description: "Boundary handling comment" },
            { regex: /BOUNDARY\s+MANAGEMENT/i, description: "Boundary management comment" },
            { regex: /EXPLICIT\s+BOUNDARY/i, description: "Explicit boundary comment" },
            { regex: /VOID-CENTERED/i, description: "Void-Centered Design pattern" },
            { regex: /interface\s+[A-Za-z0-9_]+/i, description: "Interface definition" }
        ];

        // Look for boundary-related comments and code patterns
        let found = 0;
        const matchedLines = [];
        const matchedPatterns = [];

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            for (const pattern of boundaryPatterns) {
                if (pattern.regex.test(line)) {
                    found++;
                    matchedLines.push(i + 1); // Convert to 1-based line numbers
                    matchedPatterns.push(pattern.description);
                    break;
                }
            }
        }

        // Check for void-centered design implementation
        const voidCenteredDesign = /void-centered design/i.test(content);
        const moduleSeparation = /module exports|export\s+class|export\s+interface|export\s+function/i.test(content);
        const explicitTypeDefinitions = /interface|type\s+[A-Za-z0-9_]+\s+=\s+{/i.test(content);

        if (found >= 2 || (found >= 1 && (voidCenteredDesign || moduleSeparation || explicitTypeDefinitions))) {
            return {
                passed: true,
                message: `Found proper boundary definitions: ${matchedPatterns.join(', ')}`,
                lineNumbers: matchedLines
            };
        } else {
            return {
                passed: false,
                message: "Insufficient boundary definitions found. Consider adding explicit boundary management comments and implementing Void-Centered Design principles.",
                lineNumbers: matchedLines
            };
        }
        
    } catch (error) {
        return {
            passed: false,
            message: `Error reading file: ${error.message}`
        };
    }
}

/**
 * Check if the file properly implements the Single Responsibility Principle.
 */
async function checkResponsibility(modulePath) {
    console.log(`Checking responsibility principle in: ${modulePath}`);
    
    try {
        const content = await fs.readFile(modulePath, 'utf-8');
        const lines = content.split('\n');
        
        // Patterns that indicate proper responsibility handling
        const responsibilityPatterns = [
            { regex: /RESPONSIBILITY/i, description: "Responsibility comment" },
            { regex: /SINGLE\s+RESPONSIBILITY/i, description: "Single Responsibility Principle comment" },
            { regex: /PURPOSE:/i, description: "Purpose specification" },
            { regex: /\/\*\*[\s\S]*?\*\//m, description: "JSDoc comment block" },
            { regex: /\/\/\s*[A-Z].*$/m, description: "Single-line comment with capitalized first letter" }
        ];

        // Look for responsibility-related comments and patterns
        let found = 0;
        const matchedLines = [];
        const matchedPatterns = [];

        // First check for explicit responsibility documentation
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            for (const pattern of responsibilityPatterns) {
                if (pattern.regex.test(line)) {
                    found++;
                    matchedLines.push(i + 1); // Convert to 1-based line numbers
                    matchedPatterns.push(pattern.description);
                    break;
                }
            }
        }

        // Analyze code structure for single responsibility principle
        const classCount = (content.match(/class\s+[A-Za-z0-9_]+/g) || []).length;
        const interfaceCount = (content.match(/interface\s+[A-Za-z0-9_]+/g) || []).length;
        const methodCount = (content.match(/function\s+[A-Za-z0-9_]+|[A-Za-z0-9_]+\s*\([^)]*\)\s*{/g) || []).length;
        
        // Check if the file follows cohesion patterns
        const hasCohesiveNaming = /^(.*?)(?:Repository|Service|Controller|Handler|Manager|Factory|Provider|Adapter|Util)\.ts$/i.test(modulePath);
        
        // Check for common SRP violations
        const godObjectPattern = /(class|interface)\s+[A-Za-z0-9_]+[\s\S]{1000,}/; // Large class/interface (>1000 chars)
        const hasPotentialGodObject = godObjectPattern.test(content) && methodCount > 15;
        
        // Determine if responsibility principle is followed
        let isSingleResponsibility = false;
        let srMessage = "";
        
        if (found >= 2) {
            // Explicit documentation about responsibility
            isSingleResponsibility = true;
            srMessage = `Well-documented responsibility: ${matchedPatterns.join(', ')}`;
        } else if (hasCohesiveNaming && !hasPotentialGodObject && (classCount <= 2 && methodCount < 15)) {
            // Cohesive naming and reasonable size
            isSingleResponsibility = true;
            srMessage = "Follows Single Responsibility Principle through cohesive naming and reasonable size";
        } else if (hasPotentialGodObject) {
            isSingleResponsibility = false;
            srMessage = "Potential violation of Single Responsibility Principle: file contains large classes with many methods";
        } else if (classCount > 3) {
            isSingleResponsibility = false;
            srMessage = "Potential violation of Single Responsibility Principle: file contains multiple classes (>3)";
        } else if (methodCount > 15 && found < 2) {
            isSingleResponsibility = false;
            srMessage = "Potential violation of Single Responsibility Principle: file contains many methods (>15) without explicit responsibility documentation";
        } else {
            // Default case - if we can't determine clearly, we pass but with a warning
            isSingleResponsibility = true;
            srMessage = "Follows Single Responsibility Principle, but could benefit from more explicit documentation";
        }

        return {
            passed: isSingleResponsibility,
            message: srMessage,
            lineNumbers: matchedLines
        };
        
    } catch (error) {
        return {
            passed: false,
            message: `Error reading file: ${error.message}`
        };
    }
}

/**
 * Helper function to check if a file exists
 */
async function fileExists(filePath) {
    try {
        await fs.access(filePath);
        return true;
    } catch (error) {
        return false;
    }
}

/**
 * Run all checks for a module with Explicit-Implicit Quantum Balance
 * 
 * This function implements the Explicit-Implicit Quantum Balance principle
 * by using strategic contexts and the decohere pattern to explicitly choose
 * verification approaches while maintaining implicit adaptivity.
 * 
 * @param {string} modulePath - Path to the module to verify
 * @returns {Promise<Object>} - Verification result object
 */
export async function verifyModule(modulePath) {
    console.log(`\n=== Verifying module: ${modulePath} ===\n`);
    
    // Create a strategic context for module validation
    const validationContext = {
        contextDescription: "Module validation strategy",
        possibleNextActions: [
            "Validate module existence and proceed to verification",
            "Skip validation and assume module exists",
            "Perform detailed validation including file format checks"
        ],
        metadata: {
            modulePath,
            moduleType: modulePath.endsWith('.ts') ? 'typescript' : 'javascript',
            verificationStage: "initialization"
        }
    };
    
    // Use quantum glossary to decohere this context into an explicit tactical approach
    const validationApproach = quantumGlossary.decohere(validationContext);
    console.log(`[CompleteVerifier] Chosen validation approach: ${validationApproach}`);
    
    // Validate the module path based on chosen approach
    let exists = true;
    if (validationApproach === "Validate module existence and proceed to verification" || 
        validationApproach === "Perform detailed validation including file format checks") {
        exists = await fileExists(modulePath);
    }
    
    if (!exists) {
        // Explicit error handling with quantum glossary tagging
        const errorContext = quantumGlossary.tagWithContext(
            `[CompleteVerifier] Module file does not exist: ${modulePath}`
        );
        console.error(errorContext);
        
        // Record error as antiflow
        quantumGlossary.recordFlowMetric(
            FlowType.ANTIFLOW, 
            'module_not_found', 
            100,
            { modulePath }
        );
        
        return {
            modulePath,
            checks: {
                chronosUsage: { passed: false, message: "File not found" },
                boundaryDefinition: { passed: false, message: "File not found" },
                responsibility: { passed: false, message: "File not found" },
                interfaceImplementation: { passed: false, message: "File not found" }
            },
            overallPassed: false,
            error: "File not found"
        };
    }
    
    // Create a strategic context for verification execution
    const verificationContext = {
        contextDescription: "Module verification execution strategy",
        possibleNextActions: [
            "Run all checks in parallel for efficiency",
            "Run checks sequentially with dependency awareness",
            "Run critical checks first, then optional checks"
        ],
        metadata: {
            modulePath,
            moduleType: modulePath.endsWith('.ts') ? 'typescript' : 'javascript',
            isStorageModule: modulePath.endsWith('storage.ts'),
            isChronosModule: modulePath.endsWith('chronos-date-handler.ts'),
            verificationStage: "execution"
        }
    };
    
    // Use quantum glossary to decohere this context into an explicit tactical approach
    const verificationApproach = quantumGlossary.decohere(verificationContext);
    console.log(`[CompleteVerifier] Chosen verification approach: ${verificationApproach}`);
    
    let chronosResult, boundaryResult, responsibilityResult, storageResult;
    
    // Execute verification based on the chosen approach
    if (verificationApproach === "Run all checks in parallel for efficiency") {
        // Parallel execution of checks
        [chronosResult, boundaryResult, responsibilityResult] = await Promise.all([
            checkChronosUsage(modulePath),
            checkBoundaryDefinition(modulePath),
            checkResponsibility(modulePath)
        ]);
        
        // Special checks for storage.ts (still needs to be sequential due to dependencies)
        storageResult = { passed: true, message: "Not a storage module" };
        if (modulePath.endsWith('storage.ts')) {
            storageResult = await checkStorageImplementation(modulePath);
        }
    } 
    else if (verificationApproach === "Run critical checks first, then optional checks") {
        // Critical checks first
        chronosResult = await checkChronosUsage(modulePath);
        
        // If critical checks fail, skip optional ones
        if (!chronosResult.passed) {
            boundaryResult = { passed: false, message: "Skipped due to critical check failure" };
            responsibilityResult = { passed: false, message: "Skipped due to critical check failure" };
            storageResult = { passed: false, message: "Skipped due to critical check failure" };
        } else {
            // Run optional checks
            boundaryResult = await checkBoundaryDefinition(modulePath);
            responsibilityResult = await checkResponsibility(modulePath);
            
            // Special checks for storage.ts
            storageResult = { passed: true, message: "Not a storage module" };
            if (modulePath.endsWith('storage.ts')) {
                storageResult = await checkStorageImplementation(modulePath);
            }
        }
    }
    else {
        // Default: Run checks sequentially with dependency awareness
        chronosResult = await checkChronosUsage(modulePath);
        boundaryResult = await checkBoundaryDefinition(modulePath);
        responsibilityResult = await checkResponsibility(modulePath);
        
        // Special checks for storage.ts
        storageResult = { passed: true, message: "Not a storage module" };
        if (modulePath.endsWith('storage.ts')) {
            storageResult = await checkStorageImplementation(modulePath);
        }
    }
    
    // Record verification metrics
    quantumGlossary.recordFlowMetric(
        chronosResult.passed ? FlowType.FLOW : FlowType.ANTIFLOW,
        'chronos_verification',
        chronosResult.passed ? 100 : 0,
        { 
            modulePath: path.basename(modulePath),
            verificationApproach
        }
    );
    
    quantumGlossary.recordFlowMetric(
        boundaryResult.passed ? FlowType.FLOW : FlowType.ANTIFLOW,
        'boundary_verification',
        boundaryResult.passed ? 100 : 0,
        { 
            modulePath: path.basename(modulePath),
            verificationApproach
        }
    );
    
    quantumGlossary.recordFlowMetric(
        responsibilityResult.passed ? FlowType.FLOW : FlowType.ANTIFLOW,
        'responsibility_verification',
        responsibilityResult.passed ? 100 : 0,
        { 
            modulePath: path.basename(modulePath),
            verificationApproach
        }
    );
    
    // Create a strategic context for results compilation
    const resultsContext = {
        contextDescription: "Results compilation strategy",
        possibleNextActions: [
            "Compile standard results with strict pass/fail criteria",
            "Compile results with weighted importance for each check",
            "Compile detailed results with extended diagnostics"
        ],
        metadata: {
            modulePath,
            chronosPassed: chronosResult.passed,
            boundaryPassed: boundaryResult.passed,
            responsibilityPassed: responsibilityResult.passed,
            storagePassed: storageResult.passed,
            verificationStage: "completion"
        }
    };
    
    // Use quantum glossary to decohere this context into an explicit tactical approach
    const compilationApproach = quantumGlossary.decohere(resultsContext);
    console.log(`[CompleteVerifier] Chosen compilation approach: ${compilationApproach}`);
    
    // Compile results based on the chosen approach
    let result;
    
    if (compilationApproach === "Compile results with weighted importance for each check") {
        // Weighted importance approach
        const weights = {
            chronosUsage: 0.4,        // Critical
            boundaryDefinition: 0.3,  // Important
            responsibility: 0.2,      // Standard
            interfaceImplementation: 0.1  // Only relevant for some modules
        };
        
        const weightedScore = 
            (chronosResult.passed ? weights.chronosUsage : 0) +
            (boundaryResult.passed ? weights.boundaryDefinition : 0) +
            (responsibilityResult.passed ? weights.responsibility : 0) +
            (storageResult.passed ? weights.interfaceImplementation : 0);
        
        const overallPassed = weightedScore >= 0.7;  // 70% weighted pass threshold
        
        result = {
            modulePath,
            checks: {
                chronosUsage: chronosResult,
                boundaryDefinition: boundaryResult,
                responsibility: responsibilityResult,
                interfaceImplementation: storageResult
            },
            weightedScore,
            overallPassed
        };
    } 
    else if (compilationApproach === "Compile detailed results with extended diagnostics") {
        // Enhanced diagnostics
        result = {
            modulePath,
            checks: {
                chronosUsage: {
                    ...chronosResult,
                    importance: "Critical",
                    rationale: "Date handling consistency is essential for system integrity"
                },
                boundaryDefinition: {
                    ...boundaryResult,
                    importance: "High",
                    rationale: "Clear boundaries prevent cascade failures across system"
                },
                responsibility: {
                    ...responsibilityResult,
                    importance: "Medium",
                    rationale: "Single responsibility promotes maintainability and correct behavior"
                },
                interfaceImplementation: {
                    ...storageResult,
                    importance: storageResult.passed ? "High" : "Low",
                    rationale: "Complete interface implementation ensures contract adherence"
                }
            },
            overallPassed: chronosResult.passed && 
                        boundaryResult.passed && 
                        responsibilityResult.passed &&
                        storageResult.passed,
            verificationApproach,
            compilationApproach
        };
    }
    else {
        // Default standard compilation
        result = {
            modulePath,
            checks: {
                chronosUsage: chronosResult,
                boundaryDefinition: boundaryResult,
                responsibility: responsibilityResult,
                interfaceImplementation: storageResult
            },
            overallPassed: chronosResult.passed && 
                        boundaryResult.passed && 
                        responsibilityResult.passed &&
                        storageResult.passed
        };
    }
    
    // Create a strategic context for result presentation
    const presentationContext = {
        contextDescription: "Results presentation strategy",
        possibleNextActions: [
            "Present standard results summary",
            "Present detailed diagnostic information",
            "Present minimal pass/fail indicator only"
        ],
        metadata: {
            modulePath,
            overallPassed: result.overallPassed,
            compilationApproach,
            verificationStage: "presentation"
        }
    };
    
    // Use quantum glossary to decohere this context into an explicit tactical approach
    const presentationApproach = quantumGlossary.decohere(presentationContext);
    console.log(`[CompleteVerifier] Chosen presentation approach: ${presentationApproach}`);
    
    try {
        // Present results based on the chosen approach
        if (presentationApproach === "Present minimal pass/fail indicator only") {
            console.log(`\n${path.basename(modulePath)}: ${result.overallPassed ? '✅ PASSED' : '❌ FAILED'}`);
        }
        else if (presentationApproach === "Present detailed diagnostic information") {
            console.log(`\n=== Detailed Verification Results for ${modulePath} ===`);
            
            // Include importance ratings if available
            Object.entries(result.checks).forEach(([checkName, checkResult]) => {
                const importance = checkResult.importance ? ` [${checkResult.importance}]` : '';
                console.log(`${checkName}${importance}: ${checkResult.passed ? '✅ PASSED' : '❌ FAILED'}`);
                console.log(`  ${checkResult.message}`);
                if (checkResult.rationale) {
                    console.log(`  Rationale: ${checkResult.rationale}`);
                }
                if (checkResult.lineNumbers && checkResult.lineNumbers.length > 0) {
                    console.log(`  Found on lines: ${checkResult.lineNumbers.join(', ')}`);
                }
            });
            
            if (result.weightedScore !== undefined) {
                console.log(`Weighted Score: ${(result.weightedScore * 100).toFixed(1)}%`);
            }
            
            console.log(`Overall: ${result.overallPassed ? '✅ PASSED' : '❌ FAILED'}`);
            console.log(`Verification Approach: ${verificationApproach}`);
            console.log(`Compilation Approach: ${compilationApproach}`);
        }
        else {
            // Default standard presentation
            console.log(`\n=== Verification Results for ${modulePath} ===`);
            console.log(`Chronos Usage: ${result.checks.chronosUsage.passed ? '✅ PASSED' : '❌ FAILED'}`);
            console.log(`  ${result.checks.chronosUsage.message}`);
            
            console.log(`Boundary Definition: ${result.checks.boundaryDefinition.passed ? '✅ PASSED' : '❌ FAILED'}`);
            console.log(`  ${result.checks.boundaryDefinition.message}`);
            
            console.log(`Responsibility: ${result.checks.responsibility.passed ? '✅ PASSED' : '❌ FAILED'}`);
            console.log(`  ${result.checks.responsibility.message}`);
            
            console.log(`Interface Implementation: ${result.checks.interfaceImplementation.passed ? '✅ PASSED' : '❌ FAILED'}`);
            console.log(`  ${result.checks.interfaceImplementation.message}`);
            
            console.log(`Overall: ${result.overallPassed ? '✅ PASSED' : '❌ FAILED'}`);
        }
        
        // Tag completion message with quantum glossary context
        const completionMessage = quantumGlossary.tagWithContext(
            `[CompleteVerifier] Verification of ${path.basename(modulePath)} completed ${result.overallPassed ? 'successfully' : 'with issues'}`
        );
        console.log(completionMessage);
        
    } catch (error) {
        // Explicit error handling with quantum glossary tagging
        const errorContext = quantumGlossary.tagWithContext(
            `[CompleteVerifier] Error displaying results for ${modulePath}: ${error.message}`
        );
        console.error(errorContext);
        
        // Record error as antiflow
        quantumGlossary.recordFlowMetric(
            FlowType.ANTIFLOW, 
            'results_display_error', 
            100,
            { 
                modulePath: path.basename(modulePath),
                error: error.message
            }
        );
    }
    
    return result;
}

// Main execution - only run if this script is executed directly
if (import.meta && import.meta.url === `file://${process.argv[1]}`) {
    const modulePaths = process.argv.slice(2);

    if (modulePaths.length === 0) {
        console.error("Usage: node verify-complete.js <modulePath1> [modulePath2] ...");
        process.exit(1);
    }

    // Run verification for all modules
    Promise.all(modulePaths.map(modulePath => {
        const absoluteModulePath = path.resolve(process.cwd(), modulePath);
        return verifyModule(absoluteModulePath);
    }))
    .then(results => {
        const allPassed = results.every(r => r.overallPassed);
        console.log(`\n=== FINAL RESULT: ${allPassed ? 'ALL PASSED' : 'SOME FAILED'} ===`);
        process.exit(allPassed ? 0 : 1);
    })
    .catch(error => {
        console.error("Verification failed:", error);
        process.exit(1);
    });
}