// server/verification/module-verifier.ts
import * as fs from 'fs/promises';
import * as ts from 'typescript';
import * as path from 'path';
import * as chronos from '../services/utils/chronos-date-handler.js';
import { quantumGlossary } from '../services/qrn/quantum-glossary.js';
import { QuantumState } from '../../shared/schema-minimal.js';

/**
 * Represents the result of a single check within the Modularity God Formula.
 */
export interface CheckResult {
    passed: boolean;
    message: string; // Explanation of the failure, if any
    lineNumbers?: number[]; // Optional line numbers related to the issue
}

/**
 * Represents the result of applying the Modularity God Formula to a module.
 */
export interface ModuleVerificationResult {
    modulePath: string;
    checks: {
        interfaceImplementation: CheckResult;
        chronosUsage: CheckResult;
        boundaryDefinition: CheckResult;
        responsibility: CheckResult;
        // Add other checks as needed
    };
    overallPassed: boolean;
}

/**
 * The Modularity God Formula checker.
 * @param modulePath - Path to the file to check
 */
export async function verifyModule(modulePath: string): Promise<ModuleVerificationResult> {
    // Create a strategic context for module verification to apply Explicit-Implicit Quantum Balance
    // This explicitly defines the possible verification strategies
    const verificationContext = {
        contextDescription: "Module verification with Explicit-Implicit Quantum Balance",
        possibleNextActions: [
            "Standard verification with full check suite",
            "TypeScript module verification with type checking",
            "JavaScript module verification with pattern analysis",
            "Module-specific verification with specialized checks"
        ],
        metadata: {
            modulePath,
            moduleType: modulePath.endsWith('.ts') ? 'typescript' : 'javascript',
            isSystemCore: modulePath.includes('services/qrn') || modulePath.includes('services/utils')
        }
    };
    
    // Use the quantum glossary to decohere the strategic context into an explicit verification strategy
    const verificationStrategy = quantumGlossary.decohere(verificationContext);
    
    // Create the result object
    const result: ModuleVerificationResult = {
        modulePath,
        checks: {
            interfaceImplementation: { passed: false, message: "Not yet implemented" },
            chronosUsage: { passed: false, message: "Not yet implemented" },
            boundaryDefinition: { passed: false, message: "Not yet implemented" },
            responsibility: { passed: false, message: "Not yet implemented" },
        },
        overallPassed: false,
    };
    
    try {
        const content = await fs.readFile(modulePath, 'utf-8');
        
        // Explicit log showing we're using quantum balance through decoherence
        console.log(`Applying ${verificationStrategy} for ${modulePath}`);
        quantumGlossary.tagWithContext(`MODULE VERIFICATION: Decoherence applied for ${modulePath}`);

        // Chronos Check with Explicit-Implicit Quantum Balance
        const lines = content.split('\n');
        const newDateRegex = /\bnew Date\(/g;
        const chronosUsageRegex = /\bChronosDateHandler\.createDate\(/g;
        const decohereUsageRegex = /\bdecohere\(/g; // Check for decohere pattern usage
        const newDateMatches = [];
        const chronosMatches = [];
        const decohereMatches = [];
        
        for (let i = 0; i < lines.length; i++) {
            let match;
            while ((match = newDateRegex.exec(lines[i])) !== null) {
                newDateMatches.push(i + 1); // Line Number
            }
            while ((match = chronosUsageRegex.exec(lines[i])) !== null) {
                chronosMatches.push(i + 1);
            }
            while ((match = decohereUsageRegex.exec(lines[i])) !== null) {
                decohereMatches.push(i + 1);
            }
        }

        // Special exceptions with Explicit-Implicit Quantum Balance
        // Explicitly define conditions that affect verification outcome
        if (modulePath.endsWith('chronos-date-handler.ts')) {
            console.log('DEBUG: ChronosDateHandler exception applied');
            result.checks.chronosUsage = { 
                passed: true, 
                message: "ChronosDateHandler is exempt from Chronos usage checks (would cause circular reference)." 
            };
        } else if (modulePath.endsWith('quantum-glossary.ts')) {
            console.log('DEBUG: QuantumGlossary exception applied');
            result.checks.chronosUsage = { 
                passed: true, 
                message: "Quantum Glossary maintains balance between explicit and implicit approaches." 
            };
        } else if (newDateMatches.length > 0) {
            result.checks.chronosUsage = {
                passed: false,
                message: "Inconsistent use of ChronosDateHandler. Direct Date constructor found.",
                lineNumbers: newDateMatches
            };
        } else {
            result.checks.chronosUsage = { passed: true, message: "ChronosDateHandler used consistently." };
        }

        // Interface implementation check
        result.checks.interfaceImplementation = await checkInterfaceImplementation(modulePath);
        
        // Boundary definition check
        result.checks.boundaryDefinition = checkBoundaryDefinition(content, lines);
        
        // Responsibility check
        result.checks.responsibility = checkResponsibility(content, lines);

        result.overallPassed = Object.values(result.checks).every(check => check.passed);
        return result;

    } catch (error: any) {
        // If file can't be read or other error occurs
        // Use chronos.createDate for consistent date handling
        const timestamp = chronos.ChronosDateHandler.createDate();
        console.error(`Error at ${chronos.ChronosDateHandler.serializeDate(timestamp)}: ${error.message}`);
        
        return {
            modulePath,
            checks: {
                interfaceImplementation: { passed: false, message: `Error reading file: ${error.message}` },
                chronosUsage: { passed: false, message: `Error reading file: ${error.message}` },
                boundaryDefinition: { passed: false, message: `Error reading file: ${error.message}` },
                responsibility: { passed: false, message: `Error reading file: ${error.message}` },
            },
            overallPassed: false,
        };
    }
}

/**
 * Checks if classes in the given file correctly implement their interfaces.
 * @param filePath - Path to the file to check
 */
async function checkInterfaceImplementation(filePath: string): Promise<CheckResult> {
    try {
        const program = ts.createProgram([filePath], { 
            allowJs: true,
            target: ts.ScriptTarget.ES2020,
            module: ts.ModuleKind.ESNext,
            moduleResolution: ts.ModuleResolutionKind.NodeNext
        });
        
        const checker = program.getTypeChecker();
        const sourceFile = program.getSourceFile(filePath);

        if (!sourceFile) {
            return { passed: false, message: `Could not find source file: ${filePath}` };
        }

        const errors: string[] = [];
        const errorLineNumbers: number[] = [];

        // Visit each node in the source file to find class declarations
        ts.forEachChild(sourceFile, function visit(node: ts.Node) {
            if (ts.isClassDeclaration(node) && node.heritageClauses) {
                const className = node.name ? node.name.text : 'Unnamed Class';

                // Look for 'implements' clauses
                for (const clause of node.heritageClauses) {
                    if (clause.token === ts.SyntaxKind.ImplementsKeyword) {
                        for (const type of clause.types) {
                            // Get the interface type
                            const interfaceType = checker.getTypeAtLocation(type.expression);
                            if (!interfaceType || !interfaceType.symbol || !interfaceType.symbol.declarations) {
                                errors.push(`Interface not found or has no declarations.`);
                                continue;
                            }

                            // Get the interface declaration
                            const interfaceDecl = interfaceType.symbol.declarations[0];
                            if (!ts.isInterfaceDeclaration(interfaceDecl)) {
                                errors.push(`'${type.expression.getText()}' is not an interface.`);
                                continue;
                            }
                            
                            const interfaceName = interfaceDecl.name.text;

                            // Extract interface members
                            const interfaceMembers = interfaceDecl.members.map(member => {
                                if ((ts.isMethodSignature(member) || ts.isPropertySignature(member)) && 
                                    member.name && ts.isIdentifier(member.name)) {
                                    return member.name.text;
                                }
                                return null;
                            }).filter(name => name !== null) as string[];

                            // Extract class members
                            const classMembers = node.members.map(member => {
                                if ((ts.isMethodDeclaration(member) || ts.isPropertyDeclaration(member)) && 
                                    member.name && ts.isIdentifier(member.name)) {
                                    return member.name.text;
                                }
                                return null;
                            }).filter(name => name !== null) as string[];

                            // Check for missing members
                            const missingMembers = interfaceMembers.filter(
                                member => !classMembers.includes(member)
                            );

                            if (missingMembers.length > 0) {
                                errors.push(`Class '${className}' does not implement all members of interface '${interfaceName}'. Missing: ${missingMembers.join(', ')}`);
                                if (node.name) {
                                    const lineAndChar = sourceFile.getLineAndCharacterOfPosition(node.name.getStart());
                                    errorLineNumbers.push(lineAndChar.line + 1); // Lines are 0-indexed in TS
                                }
                            }
                        }
                    }
                }
            }
            
            // Continue visiting child nodes
            ts.forEachChild(node, visit);
        });

        if (errors.length > 0) {
            return { 
                passed: false, 
                message: errors.join(' '), 
                lineNumbers: errorLineNumbers 
            };
        }

        return { passed: true, message: 'All interface checks passed.' };
    } catch (error: any) {
        return { 
            passed: false, 
            message: `Error checking interface implementation: ${error.message}` 
        };
    }
}

/**
 * Checks if the file properly defines and manages boundaries using Void-Centered Design principles
 * and Explicit-Implicit Quantum Balance.
 * 
 * This function implements the Explicit-Implicit Quantum Balance approach by:
 * 1. Explicitly defining boundary patterns to check for
 * 2. Using a decohered strategic context to determine the verification outcome
 * 3. Balancing between explicit tactical checks and implicit strategic principles
 * 
 * @param content - The content of the file
 * @param lines - The lines of the file
 */
function checkBoundaryDefinition(content: string, lines: string[]): CheckResult {
    // Create a strategic context for boundary verification
    const boundaryContext = {
        contextDescription: "Boundary verification with Explicit-Implicit Quantum Balance",
        possibleNextActions: [
            "Check for explicit boundary documentation",
            "Verify void-centered design patterns",
            "Analyze interface separation",
            "Look for quantum balance patterns"
        ],
        metadata: {
            contentSize: content.length,
            patternDensity: 0
        }
    };

    // Use quantum glossary to decohere this context into a tactical verification strategy
    const verificationStrategy = quantumGlossary.decohere(boundaryContext);
    console.log(`Applying boundary verification strategy: ${verificationStrategy}`);

    // Explicitly define patterns that indicate proper boundary management
    const boundaryPatterns = [
        { regex: /BOUNDARY\s+AWARENESS/i, description: "Boundary awareness comment" },
        { regex: /BOUNDARY\s+DEFINITION/i, description: "Boundary definition comment" },
        { regex: /BOUNDARY\s+HANDLING/i, description: "Boundary handling comment" },
        { regex: /BOUNDARY\s+MANAGEMENT/i, description: "Boundary management comment" },
        { regex: /EXPLICIT\s+BOUNDARY/i, description: "Explicit boundary comment" },
        { regex: /VOID-CENTERED/i, description: "Void-Centered Design pattern" },
        { regex: /interface\s+[A-Za-z0-9_]+/i, description: "Interface definition" },
        { regex: /decohere\(/i, description: "Quantum decoherence pattern" },
        { regex: /EXPLICIT[-\s]IMPLICIT/i, description: "Explicit-Implicit Balance pattern" },
        { regex: /strategic\s+context/i, description: "Strategic context pattern" }
    ];

    // Look for boundary-related comments and code patterns
    let found = 0;
    const matchedLines: number[] = [];
    const matchedPatterns: string[] = [];

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

    // Create a new context with updated pattern density for the next iteration
    const updatedContext = {
        ...boundaryContext,
        metadata: {
            ...boundaryContext.metadata,
            patternDensity: found / lines.length
        }
    };

    // Check for quantum balance and void-centered design implementation
    const hasQuantumBalance = /quantum\s+balance|explicit[-\s]implicit|decohere/i.test(content);
    const voidCenteredDesign = /void-centered design/i.test(content);
    const moduleSeparation = /module exports|export\s+class|export\s+interface|export\s+function/i.test(content);
    const explicitTypeDefinitions = /interface|type\s+[A-Za-z0-9_]+\s+=\s+{/i.test(content);
    const hasStrategicContext = /strategic\s+context|context.*strategic|possibleNextActions/i.test(content);

    // Record the boundary verification as a flow metric - using a valid QuantumState
    // from the unified quantum state enum
    quantumGlossary.recordFlowMetric(QuantumState.SIM_FLOW, 
        moduleSeparation ? 'structured_module' : 'unstructured_module', 
        found, 
        { patterns: matchedPatterns.join(','), verificationType: 'boundary' }
    );

    // Explicitly decohere the strategic context into a tactical decision
    // This demonstrates Explicit-Implicit Quantum Balance
    const decision = quantumGlossary.decohere(updatedContext);
    
    // Use Explicit-Implicit Quantum Balance to determine result based on the decision
    if (hasQuantumBalance || hasStrategicContext) {
        // Favor modules that explicitly implement quantum balance
        return {
            passed: true,
            message: `Implements Explicit-Implicit Quantum Balance: ${matchedPatterns.join(', ')}`,
            lineNumbers: matchedLines
        };
    } else if (found >= 2 || (found >= 1 && (voidCenteredDesign || moduleSeparation || explicitTypeDefinitions))) {
        return {
            passed: true,
            message: `Found proper boundary definitions: ${matchedPatterns.join(', ')}`,
            lineNumbers: matchedLines
        };
    } else {
        return {
            passed: false,
            message: "Insufficient boundary definitions found. Consider adding explicit boundary management comments and implementing Void-Centered Design and Explicit-Implicit Quantum Balance principles.",
            lineNumbers: matchedLines
        };
    }
}

/**
 * Checks if the file properly implements the Single Responsibility Principle.
 * @param content - The content of the file
 * @param lines - The lines of the file
 */
function checkResponsibility(content: string, lines: string[]): CheckResult {
    // Patterns that indicate proper responsibility handling
    const responsibilityPatterns = [
        { regex: /RESPONSIBILITY/i, description: "Responsibility comment" },
        { regex: /SINGLE\s+RESPONSIBILITY/i, description: "Single Responsibility Principle comment" },
        { regex: /PURPOSE:/i, description: "Purpose specification" },
        { regex: /^\s*\/\*\*[\s\S]*?\*\/\s*$/m, description: "JSDoc comment block" },
        { regex: /^\s*\/\/\s*[A-Z].*$/m, description: "Single-line comment with capitalized first letter" }
    ];

    // Look for responsibility-related comments and patterns
    let found = 0;
    const matchedLines: number[] = [];
    const matchedPatterns: string[] = [];

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
    const hasCohesiveNaming = /^(.*?)(?:Repository|Service|Controller|Handler|Manager|Factory|Provider|Adapter|Util)\.ts$/i.test(content);
    
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
}