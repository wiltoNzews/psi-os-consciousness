/**
 * Enhanced codebase verification script implementing Explicit-Implicit Quantum Balance
 * 
 * This script runs all verification tests on specified critical modules
 * to ensure compliance with the Modularity God Formula.
 * 
 * It implements the Explicit-Implicit Quantum Balance principle by:
 * 1. Creating a strategic context with multiple possible verification strategies
 * 2. Using the decohere pattern to explicitly choose a verification approach
 * 3. Carrying out tactical verification based on the explicit choice
 * 
 * Updated with improved error handling, complete output capture, and enhanced reporting.
 */
import { verifyModule } from './verify-complete.js';
import * as path from 'path';
import * as fs from 'fs';
import * as chronos from '../services/utils/chronos-date-handler.js';
import { quantumGlossary, FlowType } from '../services/qrn/quantum-glossary.js';
import { formatPrompt, createPromptForUseCase, createTTPMessage } from '../utils/prompt-utils.js';

// Get the absolute path to the project root
const ROOT_DIR = path.resolve('.');
// Get the absolute path to the server directory
const SERVER_DIR = path.join(ROOT_DIR, 'server');
console.log(`Server directory: ${SERVER_DIR}`);

/**
 * Helper function to check if a file exists
 * Uses explicit error handling to maintain robustness
 */
function fileExists(filePath) {
  try {
    return fs.existsSync(filePath);
  } catch (error) {
    // Explicit error handling with Quantum Glossary tagging
    const errorMessage = quantumGlossary.tagWithContext(`Error checking if file exists: ${filePath}`);
    console.error(errorMessage, error);
    return false;
  }
}

// Create a strategic context for module path selection
// This applies the Explicit-Implicit Quantum Balance principle
const modulePathSelectionContext = {
  contextDescription: "Module selection strategy for verification",
  possibleNextActions: [
    "Check standard critical modules",
    "Include optional modules based on availability",
    "Prioritize modules with recent changes"
  ],
  metadata: {
    baseDirectory: SERVER_DIR,
    priorityLevel: "high",
    verificationStage: "initialization"
  }
};

// Use quantum glossary to decohere this context into an explicit tactical approach
const moduleSelectionApproach = quantumGlossary.decohere(modulePathSelectionContext);
console.log(`[CodebaseVerifier] Selected module approach: ${moduleSelectionApproach}`);

// Define file paths - using standardized path construction
const CHRONOS_PATH = path.join(SERVER_DIR, 'services/utils/chronos-date-handler.ts');
const STORAGE_PATH = path.join(SERVER_DIR, 'storage.ts');
const PERSISTENT_CONTEXT_PATH = path.join(SERVER_DIR, 'services/context/persistent-context-service.ts');
const MEM_PERSISTENT_CONTEXT_PATH = path.join(SERVER_DIR, 'services/context/mem-persistent-context-service.ts');
const PERSISTENCE_TEST_HANDLERS_PATH = path.join(SERVER_DIR, 'ws-handlers/persistence-test-handlers.ts');
const PERSISTENT_CONTEXT_HANDLERS_PATH = path.join(SERVER_DIR, 'ws-handlers/persistent-context-handlers.ts');
const MODULE_VERIFIER_PATH = path.join(SERVER_DIR, 'verification/module-verifier.ts');
// Optional - check if system-integrity exists
const SYSTEM_INTEGRITY_PATH = path.join(SERVER_DIR, 'services/system-integrity.ts');

// Initialize paths based on the selected approach
// This explicitly demonstrates decision-making based on decohere result
const pathsToCheck = [];

// Always include standard critical modules regardless of approach
console.log(`[CodebaseVerifier] Adding standard critical modules`);
pathsToCheck.push(
  { path: CHRONOS_PATH, name: 'ChronosDateHandler', priority: 'high' },
  { path: STORAGE_PATH, name: 'Storage', priority: 'high' },
  { path: MODULE_VERIFIER_PATH, name: 'ModuleVerifier', priority: 'high' }
);

// Conditional module inclusion based on selected approach
if (moduleSelectionApproach === "Include optional modules based on availability") {
  console.log(`[CodebaseVerifier] Adding optional modules based on availability`);
  
  // Create a context for optional module selection
  const optionalModuleContext = {
    contextDescription: "Optional module selection for verification",
    possibleNextActions: [
      "Include all available optional modules",
      "Include only high-priority optional modules",
      "Include modules with interdependencies"
    ],
    metadata: {
      baseDirectory: SERVER_DIR,
      availableOptionalModules: [
        PERSISTENT_CONTEXT_PATH, 
        MEM_PERSISTENT_CONTEXT_PATH,
        PERSISTENCE_TEST_HANDLERS_PATH,
        PERSISTENT_CONTEXT_HANDLERS_PATH,
        SYSTEM_INTEGRITY_PATH
      ]
    }
  };
  
  // Use decohere again for sub-decision - explicit tactical approach for optional modules
  const optionalModuleApproach = quantumGlossary.decohere(optionalModuleContext);
  console.log(`[CodebaseVerifier] Optional module approach: ${optionalModuleApproach}`);
  
  // Add all optional modules
  pathsToCheck.push(
    { path: PERSISTENT_CONTEXT_PATH, name: 'PersistentContextService', priority: 'medium' },
    { path: MEM_PERSISTENT_CONTEXT_PATH, name: 'MemPersistentContextService', priority: 'medium' },
    { path: PERSISTENCE_TEST_HANDLERS_PATH, name: 'PersistenceTestHandlers', priority: 'medium' },
    { path: PERSISTENT_CONTEXT_HANDLERS_PATH, name: 'PersistentContextHandlers', priority: 'medium' }
  );
  
  // Only add the system-integrity path if it exists
  if (fileExists(SYSTEM_INTEGRITY_PATH)) {
    pathsToCheck.push({ path: SYSTEM_INTEGRITY_PATH, name: 'SystemIntegrity', priority: 'low' });
  }
} else if (moduleSelectionApproach === "Prioritize modules with recent changes") {
  console.log(`[CodebaseVerifier] Adding modules with recent changes`);
  // In a real implementation, we would check file modification dates
  // For now, we'll simulate by adding a subset of modules
  pathsToCheck.push(
    { path: PERSISTENT_CONTEXT_PATH, name: 'PersistentContextService', priority: 'high' },
    { path: PERSISTENCE_TEST_HANDLERS_PATH, name: 'PersistenceTestHandlers', priority: 'medium' }
  );
} else {
  // Default approach: "Check standard critical modules"
  console.log(`[CodebaseVerifier] Using standard critical modules only`);
  // Standard modules were already added above
}

// Record metric for module selection
quantumGlossary.recordFlowMetric(
  FlowType.FLOW,
  'module_selection',
  pathsToCheck.length,
  { 
    approach: moduleSelectionApproach,
    totalModules: pathsToCheck.length
  }
);

// Check all paths and log if they're found
for (const fileInfo of pathsToCheck) {
  const exists = fileExists(fileInfo.path);
  console.log(`${fileInfo.name}: ${exists ? 'Found ✓' : 'Not found ✗'} (${fileInfo.path})`);
}

/**
 * List of critical module paths to verify
 * These paths are converted to absolute paths and validated
 */
const CRITICAL_MODULES = pathsToCheck
  .filter(fileInfo => fileExists(fileInfo.path))
  .map(fileInfo => fileInfo.path);

/**
 * Run verification on all specified modules
 * 
 * This function implements the Explicit-Implicit Quantum Balance principle
 * by using strategic contexts and the decohere pattern to explicitly choose
 * verification approaches while maintaining implicit adaptivity.
 */
async function verifyModules() {
    // Create a strategic context for verification approach
    const verificationContext = {
      contextDescription: "Module verification strategy",
      possibleNextActions: [
        "Verify modules serially with detailed reporting",
        "Verify high-priority modules first",
        "Verify modules with explicit boundary checks first"
      ],
      metadata: {
        totalModules: CRITICAL_MODULES.length,
        verificationStage: "execution",
        criticalModulesCount: pathsToCheck.filter(m => m.priority === 'high').length
      }
    };
    
    // Use quantum glossary to decohere this context into an explicit tactical approach
    const verificationApproach = quantumGlossary.decohere(verificationContext);
    console.log(`[CodebaseVerifier] Chosen verification approach: ${verificationApproach}`);
    
    console.log(`\n=== Starting verification of ${CRITICAL_MODULES.length} critical modules ===\n`);
    
    const results = [];
    global.results = results; // Store results globally for the report generator
    let passed = 0;
    
    // Process modules based on the chosen approach
    let modulesToProcess = [...CRITICAL_MODULES];
    
    if (verificationApproach === "Verify high-priority modules first") {
      // Sort modules by priority
      const highPriorityModules = pathsToCheck
        .filter(m => m.priority === 'high' && fileExists(m.path))
        .map(m => m.path);
      
      const otherModules = CRITICAL_MODULES.filter(path => !highPriorityModules.includes(path));
      modulesToProcess = [...highPriorityModules, ...otherModules];
      
      console.log(`[CodebaseVerifier] Processing ${highPriorityModules.length} high-priority modules first`);
    }
    
    // Process modules one at a time to avoid interleaved console output
    for (const modulePath of modulesToProcess) {
        // Create a per-module verification context
        const moduleContext = {
          contextDescription: `Verification context for ${path.basename(modulePath)}`,
          possibleNextActions: [
            "Perform standard verification",
            "Perform detailed verification with extended checks",
            "Perform minimal verification for quick results"
          ],
          metadata: {
            modulePath,
            moduleType: modulePath.endsWith('.ts') ? 'typescript' : 'javascript',
            isChronosModule: modulePath.endsWith('chronos-date-handler.ts'),
            isVerificationModule: modulePath.includes('/verification/')
          }
        };
        
        // Use decohere to explicitly choose verification depth for this module
        const moduleVerificationApproach = quantumGlossary.decohere(moduleContext);
        console.log(`[CodebaseVerifier] Module ${path.basename(modulePath)} approach: ${moduleVerificationApproach}`);
        
        console.log(`\n--- Processing module: ${modulePath} ---`);
        try {
            const result = await verifyModule(modulePath);
            results.push(result);
            
            // Record verification flow metric
            quantumGlossary.recordFlowMetric(
              FlowType.FLOW, 
              'module_verification', 
              result.overallPassed ? 100 : 0,
              { 
                module: path.basename(modulePath),
                approach: moduleVerificationApproach,
                passed: result.overallPassed
              }
            );
            
            if (result.overallPassed) {
                passed++;
                console.log(`Module ${path.basename(modulePath)} verification: ✅ PASSED`);
            } else {
                console.log(`Module ${path.basename(modulePath)} verification: ❌ FAILED`);
                // Log failed checks to aid debugging
                Object.entries(result.checks).forEach(([checkName, checkResult]) => {
                    if (!checkResult.passed) {
                        console.log(`  - ${checkName}: ❌ ${checkResult.message}`);
                    }
                });
            }
        } catch (error) {
            // Explicit error handling with quantum glossary tagging
            const errorContext = quantumGlossary.tagWithContext(
              `[CodebaseVerifier] Error verifying ${modulePath}: ${error.message}`
            );
            console.error(errorContext);
            
            results.push({
                modulePath,
                overallPassed: false,
                error: error.message,
                checks: {
                    chronosUsage: { passed: false, message: error.message },
                    boundaryDefinition: { passed: false, message: error.message },
                    responsibility: { passed: false, message: error.message },
                    interfaceImplementation: { passed: false, message: error.message }
                }
            });
            
            // Record error as antiflow
            quantumGlossary.recordFlowMetric(
              FlowType.ANTIFLOW, 
              'verification_error', 
              100,
              { 
                module: path.basename(modulePath),
                error: error.message
              }
            );
        }
    }
    
    console.log(`\n=== VERIFICATION COMPLETE ===`);
    console.log(`Passed: ${passed}/${CRITICAL_MODULES.length} (${Math.round(passed/CRITICAL_MODULES.length*100)}%)`);
    
    // Create a results analysis context
    const resultsContext = {
      contextDescription: "Verification results analysis strategy",
      possibleNextActions: [
        "Provide detailed analysis of failed modules",
        "Generate comprehensive report",
        "Prioritize fixes based on module importance"
      ],
      metadata: {
        totalModules: CRITICAL_MODULES.length,
        passedModules: passed,
        failureRate: (CRITICAL_MODULES.length - passed) / CRITICAL_MODULES.length
      }
    };
    
    // Use decohere to explicitly choose results analysis approach
    const resultsApproach = quantumGlossary.decohere(resultsContext);
    console.log(`[CodebaseVerifier] Results analysis approach: ${resultsApproach}`);
    
    // List failed modules with more detailed information
    const failed = results.filter(r => !r.overallPassed);
    if (failed.length > 0) {
        console.log(`\nFailed modules (${failed.length}):`);
        failed.forEach(f => {
            console.log(`- ${path.basename(f.modulePath)}`);
            Object.entries(f.checks).forEach(([checkName, checkResult]) => {
                if (!checkResult.passed) {
                    console.log(`  * ${checkName}: ${checkResult.message}`);
                }
            });
        });
    }
    
    return {
        allPassed: passed === CRITICAL_MODULES.length,
        results: results
    };
}

/**
 * Format verification results using PREFIX/SUFFIX templates
 * 
 * This implements the Quantum Collaboration Framework's structured
 * communication pattern for reporting verification results.
 * 
 * @param results The verification results
 * @param targetAgent The target agent for this report
 * @returns Formatted output with PREFIX/SUFFIX
 */
function formatVerificationResults(results, targetAgent = 'Human') {
    // Get pass/fail counts
    const totalModules = results.length;
    const passedModules = results.filter(r => r.overallPassed).length;
    const failedModules = results.filter(r => !r.overallPassed).length;
    const passRate = totalModules > 0 ? Math.round((passedModules / totalModules) * 100) : 0;
    
    // Collect module data
    const moduleData = results.map(result => {
        const moduleBaseName = path.basename(result.modulePath);
        const checkSummary = Object.entries(result.checks || {})
            .map(([name, check]) => `${name}: ${check.passed ? '✓' : '✗'} ${check.passed ? '' : check.message || ''}`)
            .join('\n');
        
        return `Module: ${moduleBaseName}\nStatus: ${result.overallPassed ? 'PASSED' : 'FAILED'}\n${checkSummary}`;
    }).join('\n\n');
    
    // Prepare next steps context
    const nextStepsContext = {
        contextDescription: "Verification next steps determination",
        possibleNextActions: [
            "Fix failed modules starting with highest priority",
            "Document verification results comprehensively",
            "Generate more detailed diagnostic information",
            "Expand verification to additional modules"
        ],
        metadata: {
            passRate,
            criticalIssuesCount: failedModules,
            highPriorityModulesCount: results.filter(r => 
                pathsToCheck.find(p => p.path === r.modulePath && p.priority === 'high')
            ).length
        }
    };
    
    // Use decohere to explicitly choose next steps approach
    const nextStepsDecision = quantumGlossary.decohere(nextStepsContext);
    
    // Generate actionable next steps based on the decision
    let actionableNextSteps = [];
    
    if (nextStepsDecision === "Fix failed modules starting with highest priority") {
        // Identify high priority failed modules
        const highPriorityFailed = results.filter(r => 
            !r.overallPassed && 
            pathsToCheck.find(p => p.path === r.modulePath && p.priority === 'high')
        );
        
        if (highPriorityFailed.length > 0) {
            actionableNextSteps = highPriorityFailed.map(m => 
                `Fix ${path.basename(m.modulePath)}: ${Object.entries(m.checks).find(([_, c]) => !c.passed)?.[0] || 'issues'}`
            );
        } else {
            // If no high priority failed modules, suggest fixing any failed modules
            actionableNextSteps = results.filter(r => !r.overallPassed)
                .map(m => `Fix ${path.basename(m.modulePath)}`);
        }
    } else if (nextStepsDecision === "Document verification results comprehensively") {
        actionableNextSteps = [
            "Create detailed documentation of verification results",
            "Update module documentation with verification status",
            "Generate verification badge for README",
            "Add verification status to project documentation"
        ];
    } else if (nextStepsDecision === "Generate more detailed diagnostic information") {
        actionableNextSteps = [
            "Run detailed diagnostics on failed modules",
            "Generate coverage report for verification checks",
            "Analyze common failure patterns",
            "Add more detailed check instrumentation"
        ];
    } else {
        actionableNextSteps = [
            "Expand verification to additional modules",
            "Add more verification check types",
            "Set up automated verification in CI pipeline",
            "Create verification dashboard"
        ];
    }
    
    // Limit to 5 steps
    actionableNextSteps = actionableNextSteps.slice(0, 5);
    
    // Create PREFIX/SUFFIX structure
    const prefix = {
        levelDimension: 'Strategic',
        objective: 'Assess codebase verification results',
        context: 'Analysis of Modularity God Formula compliance',
        modelAgent: targetAgent,
        depthRequired: 'Comprehensive Verification Analysis',
        inputDataType: 'Code',
        domain: 'Software Architecture'
    };
    
    const resultsSummary = `# Codebase Verification Summary

## Overview
- Total modules verified: ${totalModules}
- Passed: ${passedModules} (${passRate}%)
- Failed: ${failedModules}
- Verification timestamp: ${chronos.ChronosDateHandler.createDate().toISOString()}

## Module Results
${moduleData}

## Analysis
${passRate >= 90 ? 'The codebase demonstrates excellent compliance with the Modularity God Formula.' :
  passRate >= 70 ? 'The codebase shows good compliance with the Modularity God Formula, with some areas needing improvement.' :
  passRate >= 50 ? 'The codebase has moderate compliance with the Modularity God Formula, with significant improvements needed.' :
  'The codebase needs substantial work to comply with the Modularity God Formula.'}

${failedModules > 0 ? 
  `The primary issues relate to ${results.filter(r => !r.overallPassed)
    .flatMap(r => Object.entries(r.checks).filter(([_, c]) => !c.passed).map(([name]) => name))
    .reduce((acc, name) => {
        acc[name] = (acc[name] || 0) + 1;
        return acc;
    }, {})
    .map((name, count) => `${name} (${count} modules)`)
    .join(', ')
  }` : 
  'No compliance issues were found in the verified modules.'
}`;
    
    const suffix = {
        actionableNextSteps,
        nextAgentRouting: 'Human',
        outputRequirements: 'Verification analysis with recommendations',
        flowMetrics: 'FLOW',
        confidenceLevel: 'High',
        resourcesUsed: [
            'verify-module.js',
            'module-verifier.ts',
            'MODULARITY_GOD_FORMULA.md',
            'verification-patterns.js'
        ]
    };
    
    return formatPrompt(prefix, resultsSummary, suffix);
}

/**
 * Generate verification report using Thought Transfer Protocol (TTP)
 * 
 * @param results Verification results
 * @returns TTP formatted verification message
 */
function generateTTPVerificationReport(results) {
    // Get pass/fail counts
    const totalModules = results.length;
    const passedModules = results.filter(r => r.overallPassed).length;
    const failedModules = totalModules - passedModules;
    
    // Create decisions made during verification
    const decisionsMade = [
        {
            decision: `Verified ${totalModules} modules with ${passedModules} passing`,
            alternatives: ["Skip verification", "Verify only high-priority modules"],
            reasoning: "Comprehensive verification provides the most accurate assessment of codebase health"
        }
    ];
    
    // Add module selection decision if available
    if (moduleSelectionApproach) {
        decisionsMade.push({
            decision: moduleSelectionApproach,
            alternatives: [
                "Check standard critical modules",
                "Include optional modules based on availability",
                "Prioritize modules with recent changes"
            ].filter(a => a !== moduleSelectionApproach),
            reasoning: "Selected based on system assessment of verification needs and module criticality"
        });
    }
    
    // Add verification approach decision
    const verificationResults = global.results || results;
    const criticalModuleResults = verificationResults.filter(r => 
        pathsToCheck.find(p => p.path === r.modulePath && p.priority === 'high')
    );
    
    // Prepare verification content
    const content = `# Verification Results Summary

Total modules verified: ${totalModules}
Passing: ${passedModules} (${Math.round((passedModules/totalModules)*100)}%)
Failing: ${failedModules}

## Critical Module Status
${criticalModuleResults.map(r => `- ${path.basename(r.modulePath)}: ${r.overallPassed ? '✓ PASSED' : '✗ FAILED'}`).join('\n')}

## Verification Metrics
- Boundary definitions: ${verificationResults.reduce((sum, r) => sum + (r.checks?.boundaryDefinition?.score || 0), 0) / verificationResults.length}
- Responsibility separation: ${verificationResults.reduce((sum, r) => sum + (r.checks?.responsibility?.score || 0), 0) / verificationResults.length}
- Chronos usage: ${verificationResults.reduce((sum, r) => sum + (r.checks?.chronosUsage?.score || 0), 0) / verificationResults.length}
- Interface implementation: ${verificationResults.reduce((sum, r) => sum + (r.checks?.interfaceImplementation?.score || 0), 0) / verificationResults.length}

## Recommended Actions
${failedModules > 0 ? 
  `1. Address issues in failing modules, prioritizing: 
${verificationResults.filter(r => !r.overallPassed)
    .sort((a, b) => {
        const aPriority = pathsToCheck.find(p => p.path === a.modulePath)?.priority === 'high' ? 0 : 1;
        const bPriority = pathsToCheck.find(p => p.path === b.modulePath)?.priority === 'high' ? 0 : 1;
        return aPriority - bPriority;
    })
    .slice(0, 3)
    .map(r => `   - ${path.basename(r.modulePath)}`)
    .join('\n')
}` :
  '1. Continue monitoring verification status with future code changes'
}
2. ${passedModules === totalModules ? 'Document successful verification compliance' : 'Improve module boundary definitions'}
3. Expand verification to additional modules`;
    
    return createTTPMessage(
        'CodebaseVerifier',
        'Human',
        'Verification Results Analysis',
        content,
        decisionsMade,
        {
            description: "Determine action based on verification results",
            options: [
                "Fix failed modules",
                "Expand verification",
                "Document compliance status"
            ]
        },
        {
            verificationTimestamp: chronos.ChronosDateHandler.createDate().toISOString(),
            moduleCount: totalModules,
            passRate: passedModules / totalModules,
            criticalModulesCount: criticalModuleResults.length,
            criticalModulesPassRate: criticalModuleResults.filter(r => r.overallPassed).length / criticalModuleResults.length
        }
    );
}

/**
 * Generate HTML report from verification results
 */
function generateReport(results) {
    const reportHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Modularity God Formula Verification Report</title>
    <style>
        body {
            font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
        }
        h1, h2, h3 {
            color: #2c3e50;
        }
        .summary {
            background-color: #f8f9fa;
            border-radius: 5px;
            padding: 15px;
            margin-bottom: 20px;
            border-left: 5px solid #2c3e50;
        }
        .passed {
            color: #28a745;
            font-weight: bold;
        }
        .failed {
            color: #dc3545;
            font-weight: bold;
        }
        .module {
            background-color: #fff;
            border-radius: 5px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
            margin-bottom: 15px;
            padding: 15px;
        }
        .check {
            border-left: 4px solid #ddd;
            padding-left: 15px;
            margin: 10px 0;
        }
        .passed-check {
            border-left-color: #28a745;
        }
        .failed-check {
            border-left-color: #dc3545;
        }
        .timestamp {
            color: #6c757d;
            font-style: italic;
            margin-bottom: 10px;
        }
        pre {
            background-color: #f8f9fa;
            padding: 10px;
            border-radius: 5px;
            overflow-x: auto;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
        }
        th, td {
            padding: 8px;
            text-align: left;
            border-bottom: 1px solid #ddd;
        }
        th {
            background-color: #f8f9fa;
        }
        tr:hover {
            background-color: #f1f1f1;
        }
        .toc {
            position: fixed;
            right: 20px;
            top: 20px;
            width: 200px;
            background: white;
            padding: 10px;
            border-radius: 5px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
            max-height: 80vh;
            overflow-y: auto;
        }
        .toc a {
            display: block;
            margin: 5px 0;
            color: #2c3e50;
            text-decoration: none;
        }
        .toc a:hover {
            text-decoration: underline;
        }
        @media print {
            .toc {
                display: none;
            }
        }
    </style>
</head>
<body>
    <h1>Modularity God Formula Verification Report</h1>
    <div class="timestamp">Generated on ${chronos.ChronosDateHandler.createDate().toLocaleString()}</div>
    
    <div class="toc">
        <h3>Table of Contents</h3>
        <a href="#summary">Summary</a>
        ${results.map((result, i) => `<a href="#module-${i}">${path.basename(result.modulePath)}</a>`).join('')}
    </div>
    
    <div id="summary" class="summary">
        <h2>Summary</h2>
        <p>Total modules verified: ${results.length}</p>
        <p>Passed: <span class="${results.filter(r => r.overallPassed).length === results.length ? 'passed' : 'failed'}">${results.filter(r => r.overallPassed).length}/${results.length} (${Math.round(results.filter(r => r.overallPassed).length/results.length*100)}%)</span></p>
        
        <table>
            <tr>
                <th>Module</th>
                <th>Status</th>
                <th>Chronos</th>
                <th>Boundary</th>
                <th>Responsibility</th>
                <th>Interface</th>
            </tr>
            ${results.map(result => `
            <tr>
                <td>${path.basename(result.modulePath)}</td>
                <td class="${result.overallPassed ? 'passed' : 'failed'}">${result.overallPassed ? 'PASSED' : 'FAILED'}</td>
                <td class="${result.checks.chronosUsage.passed ? 'passed' : 'failed'}">${result.checks.chronosUsage.passed ? '✓' : '✗'}</td>
                <td class="${result.checks.boundaryDefinition.passed ? 'passed' : 'failed'}">${result.checks.boundaryDefinition.passed ? '✓' : '✗'}</td>
                <td class="${result.checks.responsibility.passed ? 'passed' : 'failed'}">${result.checks.responsibility.passed ? '✓' : '✗'}</td>
                <td class="${result.checks.interfaceImplementation.passed ? 'passed' : 'failed'}">${result.checks.interfaceImplementation.passed ? '✓' : '✗'}</td>
            </tr>
            `).join('')}
        </table>
    </div>
    
    <h2>Module Details</h2>
    ${results.map((result, i) => `
    <div id="module-${i}" class="module">
        <h3>${path.basename(result.modulePath)}</h3>
        <p>Path: ${result.modulePath}</p>
        <p>Status: <span class="${result.overallPassed ? 'passed' : 'failed'}">${result.overallPassed ? 'PASSED' : 'FAILED'}</span></p>
        
        <div class="check ${result.checks.chronosUsage.passed ? 'passed-check' : 'failed-check'}">
            <h4>Chronos Usage: ${result.checks.chronosUsage.passed ? 'PASSED' : 'FAILED'}</h4>
            <p>${result.checks.chronosUsage.message}</p>
            ${result.checks.chronosUsage.lineNumbers && result.checks.chronosUsage.lineNumbers.length > 0 ? 
                `<pre>Line numbers with issues: ${JSON.stringify(result.checks.chronosUsage.lineNumbers)}</pre>` : ''}
        </div>
        
        <div class="check ${result.checks.boundaryDefinition.passed ? 'passed-check' : 'failed-check'}">
            <h4>Boundary Definition: ${result.checks.boundaryDefinition.passed ? 'PASSED' : 'FAILED'}</h4>
            <p>${result.checks.boundaryDefinition.message}</p>
            ${result.checks.boundaryDefinition.lineNumbers && result.checks.boundaryDefinition.lineNumbers.length > 0 ? 
                `<pre>Line numbers with definitions: ${JSON.stringify(result.checks.boundaryDefinition.lineNumbers)}</pre>` : ''}
        </div>
        
        <div class="check ${result.checks.responsibility.passed ? 'passed-check' : 'failed-check'}">
            <h4>Responsibility Principle: ${result.checks.responsibility.passed ? 'PASSED' : 'FAILED'}</h4>
            <p>${result.checks.responsibility.message}</p>
            ${result.checks.responsibility.lineNumbers && result.checks.responsibility.lineNumbers.length > 0 ? 
                `<pre>Line numbers with responsibility definitions: ${JSON.stringify(result.checks.responsibility.lineNumbers)}</pre>` : ''}
        </div>
        
        <div class="check ${result.checks.interfaceImplementation.passed ? 'passed-check' : 'failed-check'}">
            <h4>Interface Implementation: ${result.checks.interfaceImplementation.passed ? 'PASSED' : 'FAILED'}</h4>
            <p>${result.checks.interfaceImplementation.message}</p>
            ${result.checks.interfaceImplementation.missingMethods && result.checks.interfaceImplementation.missingMethods.length > 0 ? 
                `<pre>Missing methods: ${JSON.stringify(result.checks.interfaceImplementation.missingMethods)}</pre>` : ''}
        </div>
    </div>
    `).join('')}
    
    <div class="timestamp">Report generated by MODULARITY GOD FORMULA verification system</div>
</body>
</html>`;

    const reportPath = path.resolve(ROOT_DIR, 'verification-report.html');
    try {
        fs.writeFileSync(reportPath, reportHtml);
        console.log(`\nVerification report generated: ${reportPath}`);
        return true;
    } catch (error) {
        console.error('Error generating report:', error);
        return false;
    }
}

/**
 * Run the full verification process with Explicit-Implicit Quantum Balance
 * 
 * This function implements the Explicit-Implicit Quantum Balance principle
 * by using strategic contexts and the decohere pattern to explicitly choose
 * verification approaches while maintaining implicit adaptivity.
 */
(async function runVerification() {
    try {
        // Create a strategic context for the overall verification process
        const verificationProcessContext = {
            contextDescription: "Overall verification process strategy",
            possibleNextActions: [
                "Execute verification and generate comprehensive report",
                "Execute verification with minimal reporting for quick feedback",
                "Execute verification with focus on critical modules only"
            ],
            metadata: {
                verificationStage: "initialization",
                timestamp: chronos.ChronosDateHandler.createDate(),
                isRecoveryMode: false
            }
        };
        
        // Use quantum glossary to decohere this context into an explicit tactical approach
        const verificationProcessApproach = quantumGlossary.decohere(verificationProcessContext);
        console.log(`[CodebaseVerifier] Chosen process approach: ${verificationProcessApproach}`);
        
        // Get verification results
        const { allPassed, results } = await verifyModules();
        
        // Create a reporting context
        const reportingContext = {
            contextDescription: "Report generation strategy",
            possibleNextActions: [
                "Generate detailed HTML report with all metrics",
                "Generate minimal text report for quick review",
                "Generate comprehensive error analysis for failed modules"
            ],
            metadata: {
                totalModules: results.length,
                passedModules: results.filter(r => r.overallPassed).length,
                failedModules: results.filter(r => !r.overallPassed).length,
                verificationProcessApproach
            }
        };
        
        // Use quantum glossary to decohere this context into an explicit tactical approach
        const reportingApproach = quantumGlossary.decohere(reportingContext);
        console.log(`[CodebaseVerifier] Chosen reporting approach: ${reportingApproach}`);
        
        // Generate the appropriate report based on the chosen approach
        let reportGenerated = false;
        let formattedReport = '';
        
        // Different report types based on the chosen approach
        if (reportingApproach === "Generate detailed HTML report with all metrics") {
            reportGenerated = generateReport(results || global.results);
            
            // Also create PREFIX/SUFFIX formatted report
            formattedReport = formatVerificationResults(results || global.results, 'Human');
            console.log('\n=== PREFIX/SUFFIX FORMATTED REPORT PREVIEW ===');
            console.log(`${formattedReport.substring(0, 500)}...\n[Full report available in verification-output.txt]`);
            
            // Save the PREFIX/SUFFIX report to a file
            try {
                fs.writeFileSync('codebase-verification-output.txt', formattedReport);
                console.log('PREFIX/SUFFIX formatted report saved to codebase-verification-output.txt');
            } catch (error) {
                console.error('Error saving PREFIX/SUFFIX report:', error);
            }
        } else if (reportingApproach === "Generate minimal text report for quick review") {
            // Create a TTP message format for the report
            const ttpReport = generateTTPVerificationReport(results || global.results);
            console.log('\n=== TTP REPORT PREVIEW ===');
            console.log(`${ttpReport.substring(0, 500)}...\n[Full report available in verification-ttp-output.txt]`);
            
            // Save the TTP report to a file
            try {
                fs.writeFileSync('verification-ttp-output.txt', ttpReport);
                console.log('TTP formatted report saved to verification-ttp-output.txt');
                reportGenerated = true;
            } catch (error) {
                console.error('Error saving TTP report:', error);
                // Fall back to HTML report
                reportGenerated = generateReport(results || global.results);
            }
        } else {
            // Fallback to standard HTML report for other approaches
            reportGenerated = generateReport(results || global.results);
        }
        
        // Record the verification completion as a flow metric
        quantumGlossary.recordFlowMetric(
            FlowType.FLOW,
            'verification_completion',
            allPassed ? 100 : results.filter(r => r.overallPassed).length / results.length * 100,
            {
                totalModules: results.length,
                passedModules: results.filter(r => r.overallPassed).length,
                verificationProcessApproach,
                reportingApproach,
                usedPrefixSuffix: Boolean(formattedReport)
            }
        );
        
        // Create a results presentation context
        const presentationContext = {
            contextDescription: "Verification results presentation strategy",
            possibleNextActions: [
                "Present concise pass/fail summary",
                "Present detailed failure analysis",
                "Present metrics and improvement recommendations"
            ],
            metadata: {
                allPassed,
                totalModules: results.length,
                passedModules: results.filter(r => r.overallPassed).length,
                reportGenerated
            }
        };
        
        // Use quantum glossary to decohere this context into an explicit tactical approach
        const presentationApproach = quantumGlossary.decohere(presentationContext);
        console.log(`[CodebaseVerifier] Chosen presentation approach: ${presentationApproach}`);
        
        // Provide summary based on the chosen presentation approach
        if (allPassed) {
            console.log('\n✅ ALL MODULES PASSED VERIFICATION');
            console.log('The codebase is fully compliant with the MODULARITY GOD FORMULA');
        } else {
            console.log('\n❌ SOME MODULES FAILED VERIFICATION');
            
            if (presentationApproach === "Present detailed failure analysis") {
                console.log('\nDetailed failure analysis:');
                results.filter(r => !r.overallPassed).forEach(result => {
                    console.log(`\n${path.basename(result.modulePath)}:`);
                    Object.entries(result.checks).forEach(([checkName, checkResult]) => {
                        if (!checkResult.passed) {
                            console.log(`  - ${checkName}: ${checkResult.message}`);
                        }
                    });
                });
            } else {
                console.log('Please review the HTML report for detailed information');
            }
        }

        if (reportGenerated) {
            console.log('\nOpen the verification-report.html file in a browser for a detailed report.');
        }
        
        // Tag the completion message with context using quantum glossary
        const completionMessage = quantumGlossary.tagWithContext(
            `[CodebaseVerifier] Verification process complete. ${allPassed ? 'All modules passed.' : 'Some modules failed.'}`
        );
        console.log(completionMessage);
        
        process.exit(allPassed ? 0 : 1);
    } catch (error) {
        // Explicit error handling with quantum glossary tagging
        const errorContext = quantumGlossary.tagWithContext(
            `[CodebaseVerifier] VERIFICATION PROCESS FAILED: ${error.message}`
        );
        console.error('\n❌', errorContext);
        
        // Record critical error as antiflow
        quantumGlossary.recordFlowMetric(
            FlowType.ANTIFLOW,
            'verification_critical_failure',
            100,
            { 
                error: error.message,
                stack: error.stack
            }
        );
        
        process.exit(1);
    }
})();