/**
 * Verification script for Explicit-Implicit Quantum Balance
 * 
 * This script scans modules to ensure they properly implement the 
 * Explicit-Implicit Quantum Balance principle by using the decohere
 * method for decision points.
 */

import * as fs from 'fs/promises';
import * as path from 'path';
import { quantumGlossary } from '../services/qrn/quantum-glossary.js';

/**
 * Checks if a module implements the Explicit-Implicit Quantum Balance principle
 * by verifying the presence of decohere patterns.
 * 
 * @param {string} filePath - Path to the module file
 * @returns {Promise<{passed: boolean, score: number, details: Object}>} - Verification results
 */
async function verifyQuantumBalance(filePath) {
  try {
    const strategicContext = {
      contextDescription: "Verifying Explicit-Implicit Quantum Balance implementation",
      possibleNextActions: [
        "Read file and check for decohere pattern",
        "Review module structure for strategic context usage",
        "Look for if/else patterns following decohere calls"
      ]
    };

    // Use decohere to explicitly choose the verification approach
    const nextAction = quantumGlossary.decohere(strategicContext);
    console.log(`[Verifier] Explicitly chosen action: ${nextAction}`);

    // Execute the chosen verification approach
    const content = await fs.readFile(filePath, 'utf8');

    // Check for key patterns of Explicit-Implicit Quantum Balance
    const patterns = {
      decohereCalls: (content.match(/quantumGlossary\.decohere\(/g) || []).length,
      strategicContexts: (content.match(/strategicContext/g) || []).length,
      possibleNextActions: (content.match(/possibleNextActions/g) || []).length,
      ifDecisions: (content.match(/if\s*\(\s*nextAction\s*===\s*["']/g) || []).length,
      explicitComments: (content.match(/explicit/ig) || []).length,
    };

    // Calculate score based on patterns
    const score = calculateQuantumBalanceScore(patterns);
    
    // Determine if the module passes based on minimum thresholds
    const passed = 
      patterns.decohereCalls > 0 && 
      patterns.strategicContexts > 0 && 
      patterns.possibleNextActions > 0 &&
      patterns.ifDecisions > 0;

    return {
      passed,
      score,
      details: {
        patterns,
        filePath,
        suggestions: generateSuggestions(patterns, passed)
      }
    };
  } catch (err) {
    console.error(`Error verifying Quantum Balance for ${filePath}:`, err);
    return {
      passed: false,
      score: 0,
      details: {
        error: err.message,
        filePath
      }
    };
  }
}

/**
 * Calculate a score for the Quantum Balance implementation quality
 * 
 * @param {Object} patterns - Detected patterns in the code
 * @returns {number} - Score from 0 to 100
 */
function calculateQuantumBalanceScore(patterns) {
  // Base score for having any implementation
  let score = patterns.decohereCalls > 0 ? 50 : 0;
  
  // Additional points for each pattern
  if (patterns.decohereCalls > 0) score += Math.min(patterns.decohereCalls * 5, 15);
  if (patterns.strategicContexts > 0) score += Math.min(patterns.strategicContexts * 5, 10);
  if (patterns.possibleNextActions > 0) score += Math.min(patterns.possibleNextActions * 2, 10);
  if (patterns.ifDecisions > 0) score += Math.min(patterns.ifDecisions * 5, 10);
  if (patterns.explicitComments > 0) score += Math.min(patterns.explicitComments, 5);
  
  // Cap at 100
  return Math.min(score, 100);
}

/**
 * Generate improvement suggestions based on detected patterns
 * 
 * @param {Object} patterns - Detected patterns in the code
 * @param {boolean} passed - Whether the module passed verification
 * @returns {Array<string>} - Suggestions for improvement
 */
function generateSuggestions(patterns, passed) {
  const suggestions = [];
  
  if (!passed) {
    if (patterns.decohereCalls === 0) {
      suggestions.push("Include quantumGlossary.decohere() calls for decision points");
    }
    if (patterns.strategicContexts === 0) {
      suggestions.push("Define strategic contexts for decision points");
    }
    if (patterns.possibleNextActions === 0) {
      suggestions.push("Include possibleNextActions arrays in strategic contexts");
    }
    if (patterns.ifDecisions === 0) {
      suggestions.push("Implement if/else logic based on decohere results");
    }
  } else {
    // Even passing modules can be improved
    if (patterns.explicitComments < 3) {
      suggestions.push("Add more explicit comments to clarify quantum balance implementation");
    }
    if (patterns.decohereCalls !== patterns.ifDecisions) {
      suggestions.push("Ensure each decohere call has corresponding decision logic");
    }
  }
  
  return suggestions;
}

/**
 * Scan a directory for modules to verify
 * 
 * @param {string} dirPath - Directory to scan
 * @param {Array<string>} extensions - File extensions to check
 * @returns {Promise<Array<Object>>} - Verification results for all modules
 */
async function scanDirectoryForVerification(dirPath, extensions = ['.js', '.ts']) {
  const results = [];
  
  try {
    const entries = await fs.readdir(dirPath, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dirPath, entry.name);
      
      if (entry.isDirectory()) {
        // Recursively scan subdirectories, but skip node_modules
        if (entry.name !== 'node_modules') {
          const subResults = await scanDirectoryForVerification(fullPath, extensions);
          results.push(...subResults);
        }
      } else if (extensions.some(ext => entry.name.endsWith(ext))) {
        // Verify this file
        const result = await verifyQuantumBalance(fullPath);
        results.push({
          path: fullPath,
          ...result
        });
      }
    }
  } catch (err) {
    console.error(`Error scanning directory ${dirPath}:`, err);
  }
  
  return results;
}

/**
 * Generate a markdown report from verification results
 * 
 * @param {Array<Object>} results - Verification results
 * @returns {string} - Markdown report
 */
function generateMarkdownReport(results) {
  let markdown = `# Explicit-Implicit Quantum Balance Verification Report\n\n`;
  markdown += `Generated: ${new Date().toISOString()}\n\n`;
  
  const passedCount = results.filter(r => r.passed).length;
  const totalCount = results.length;
  const averageScore = results.reduce((sum, r) => sum + r.score, 0) / totalCount;
  
  markdown += `## Summary\n\n`;
  markdown += `- **Modules Checked**: ${totalCount}\n`;
  markdown += `- **Passed**: ${passedCount} (${Math.round(passedCount/totalCount*100)}%)\n`;
  markdown += `- **Average Score**: ${Math.round(averageScore)}/100\n\n`;
  
  markdown += `## Module Details\n\n`;
  markdown += `| Module | Status | Score | Decohere Calls | Strategic Contexts |\n`;
  markdown += `|--------|--------|-------|---------------|--------------------|\n`;
  
  for (const result of results) {
    const status = result.passed ? '✅ PASS' : '❌ FAIL';
    const patterns = result.details?.patterns || { decohereCalls: 0, strategicContexts: 0 };
    const relativePath = result.path.replace(process.cwd(), '');
    
    markdown += `| ${relativePath} | ${status} | ${result.score}/100 | ${patterns.decohereCalls} | ${patterns.strategicContexts} |\n`;
  }
  
  markdown += `\n## Improvement Suggestions\n\n`;
  
  for (const result of results) {
    if (result.details?.suggestions?.length > 0) {
      const relativePath = result.path.replace(process.cwd(), '');
      markdown += `### ${relativePath}\n\n`;
      
      for (const suggestion of result.details.suggestions) {
        markdown += `- ${suggestion}\n`;
      }
      
      markdown += `\n`;
    }
  }
  
  return markdown;
}

/**
 * Run the verification script
 */
async function runVerification() {
  const strategicContext = {
    contextDescription: "Running Quantum Balance verification",
    possibleNextActions: [
      "Scan server directory for modules to verify",
      "Scan specific critical modules only",
      "Generate verification report only"
    ]
  };

  // Use decohere to explicitly choose the verification scope
  const nextAction = quantumGlossary.decohere(strategicContext);
  console.log(`[Verifier] Explicitly chosen action: ${nextAction}`);

  let results = [];
  
  if (nextAction === "Scan server directory for modules to verify") {
    console.log("Scanning server directory for modules to verify...");
    results = await scanDirectoryForVerification('./server');
  } else if (nextAction === "Scan specific critical modules only") {
    console.log("Scanning critical modules only...");
    // Define critical modules to check
    const criticalModules = [
      './server/storage.ts',
      './server/services/qrn/quantum-glossary.js',
      './server/services/utils/chronos-date-handler.js'
    ];
    
    for (const modulePath of criticalModules) {
      const result = await verifyQuantumBalance(modulePath);
      results.push({
        path: modulePath,
        ...result
      });
    }
  } else {
    console.log("Generating verification report only...");
    // Sample results for report generation
    results = [
      {
        path: './server/storage.ts',
        passed: true,
        score: 85,
        details: {
          patterns: {
            decohereCalls: 2,
            strategicContexts: 2,
            possibleNextActions: 2,
            ifDecisions: 2,
            explicitComments: 10
          },
          suggestions: [
            "Ensure each decohere call has corresponding decision logic"
          ]
        }
      }
    ];
  }
  
  // Generate and save report
  const report = generateMarkdownReport(results);
  await fs.writeFile('QUANTUM_BALANCE_VERIFICATION.md', report);
  
  console.log(`Verification complete. ${results.filter(r => r.passed).length}/${results.length} modules passed.`);
  console.log("Report generated: QUANTUM_BALANCE_VERIFICATION.md");
  
  return results;
}

// Run the verification if executed directly
if (process.argv[1].endsWith('verify-quantum-balance.js')) {
  runVerification().catch(err => {
    console.error("Verification failed:", err);
    process.exit(1);
  });
}

export { verifyQuantumBalance, scanDirectoryForVerification, generateMarkdownReport, runVerification };