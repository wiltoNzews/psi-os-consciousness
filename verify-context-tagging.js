/**
 * Context Tagging Verification Tool
 * 
 * This tool verifies proper context tagging ([CONTEXT: SIMULATION] or [CONTEXT: REALITY])
 * throughout the documentation, ensuring compliance with Simulation-Reality Protocol.
 * 
 * [CONTEXT: SIMULATION]
 */

import fs from 'fs/promises';
import path from 'path';

// Modules to verify
const MODULES = [
  'MODULE_0_SYSTEM_CONTEXT.md',
  'MODULE_1_AGENT_DEFINITIONS.md',
  'MODULE_2_BUS_ROUTES.md',
  'MODULE_3_CHUNKING.md',
  'MODULE_4_THOUGHT_PROGRESSION.md',
  'MODULE_5_HALO_PROTOCOL.md',
  'MODULE_6_SANCTUM_ETHICS.md',
  'MODULE_7_INVERSE_PENDULUM.md',
  'MODULE_8_SURGENCE_INTEGRATION.md'
];

// Core supporting documents
const SUPPORTING_DOCS = [
  'MODULE_INDEX.md',
  'QCF_GUIDELINES.md',
  'SIMULATION_REALITY_PROTOCOL.md',
  'AGENT_STRESS_TESTING_PROTOCOL.md'
];

// All documents to check 
const ALL_DOCS = [...MODULES, ...SUPPORTING_DOCS];

// Context tags to search for
const CONTEXT_TAGS = {
  SIMULATION: '[CONTEXT: SIMULATION]',
  REALITY: '[CONTEXT: REALITY]'
};

// Special terms that should always be accompanied by context tags
const CONTEXT_SENSITIVE_TERMS = [
  'FlowType',
  'OperatingContext',
  'contextTag',
  'transitioning from SIMULATION to REALITY',
  'transition to REALITY',
  'REALITY mode',
  'SIMULATION mode'
];

/**
 * Results structure
 */
class ContextVerificationResults {
  constructor() {
    this.missingContextTags = {};
    this.improperTermUsage = {};
    this.contextTagCounts = {
      total: 0,
      simulation: 0,
      reality: 0
    };
    this.documentCompliance = {};
  }

  addMissingContextTag(file) {
    if (!this.missingContextTags[file]) {
      this.missingContextTags[file] = true;
    }
  }

  addImproperTermUsage(file, term, lineNumber) {
    if (!this.improperTermUsage[file]) {
      this.improperTermUsage[file] = [];
    }
    this.improperTermUsage[file].push({ term, lineNumber });
  }

  incrementContextTagCount(tag) {
    this.contextTagCounts.total++;
    if (tag === CONTEXT_TAGS.SIMULATION) {
      this.contextTagCounts.simulation++;
    } else if (tag === CONTEXT_TAGS.REALITY) {
      this.contextTagCounts.reality++;
    }
  }

  setDocumentCompliance(file, compliant) {
    this.documentCompliance[file] = compliant;
  }
}

/**
 * Verify context tagging in a document
 */
async function verifyContextTagging(file, results) {
  try {
    const content = await fs.readFile(file, 'utf8');
    const lines = content.split('\n');
    
    // Check for presence of any context tags
    const hasSimulationTag = content.includes(CONTEXT_TAGS.SIMULATION);
    const hasRealityTag = content.includes(CONTEXT_TAGS.REALITY);
    
    if (!hasSimulationTag && !hasRealityTag) {
      results.addMissingContextTag(file);
      results.setDocumentCompliance(file, false);
    } else {
      results.setDocumentCompliance(file, true);
    }
    
    // Count context tags
    const simulationTagMatches = content.match(new RegExp(`\\${CONTEXT_TAGS.SIMULATION}`, 'g')) || [];
    const realityTagMatches = content.match(new RegExp(`\\${CONTEXT_TAGS.REALITY}`, 'g')) || [];
    
    simulationTagMatches.forEach(() => {
      results.incrementContextTagCount(CONTEXT_TAGS.SIMULATION);
    });
    
    realityTagMatches.forEach(() => {
      results.incrementContextTagCount(CONTEXT_TAGS.REALITY);
    });
    
    // Check for context-sensitive terms without proper context tagging
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      for (const term of CONTEXT_SENSITIVE_TERMS) {
        if (line.includes(term)) {
          // Check if the line or nearby lines (±3) include a context tag
          const contextWindow = lines.slice(Math.max(0, i - 3), Math.min(lines.length, i + 4)).join('\n');
          
          if (!contextWindow.includes(CONTEXT_TAGS.SIMULATION) && !contextWindow.includes(CONTEXT_TAGS.REALITY)) {
            results.addImproperTermUsage(file, term, i + 1);
          }
        }
      }
    }
    
  } catch (error) {
    console.error(`[CONTEXT: SIMULATION] Error verifying context tagging in ${file}:`, error.message);
  }
}

/**
 * Format results for output
 */
function formatResults(results) {
  let output = '[CONTEXT: SIMULATION] Context Tagging Verification Results\n\n';
  
  output += '## Summary\n\n';
  output += `- Total context tags found: ${results.contextTagCounts.total}\n`;
  output += `- SIMULATION tags: ${results.contextTagCounts.simulation}\n`;
  output += `- REALITY tags: ${results.contextTagCounts.reality}\n`;
  output += `- Documents missing context tags: ${Object.keys(results.missingContextTags).length}\n`;
  output += `- Documents with improper term usage: ${Object.keys(results.improperTermUsage).length}\n\n`;
  
  output += '## Document Compliance\n\n';
  output += '| Document | Compliant |\n';
  output += '|----------|----------|\n';
  
  for (const [file, compliant] of Object.entries(results.documentCompliance)) {
    output += `| ${file} | ${compliant ? '✅' : '❌'} |\n`;
  }
  
  output += '\n';
  
  if (Object.keys(results.missingContextTags).length > 0) {
    output += '## Documents Missing Context Tags\n\n';
    
    for (const file of Object.keys(results.missingContextTags)) {
      output += `- ${file}\n`;
    }
    
    output += '\n';
  }
  
  if (Object.keys(results.improperTermUsage).length > 0) {
    output += '## Improper Context-Sensitive Term Usage\n\n';
    
    for (const [file, issues] of Object.entries(results.improperTermUsage)) {
      output += `### ${file}\n\n`;
      
      for (const issue of issues) {
        output += `- Line ${issue.lineNumber}: "${issue.term}" used without proper context tagging\n`;
      }
      
      output += '\n';
    }
  }
  
  output += '## Recommendations\n\n';
  output += '1. All documents should include at least one explicit context tag ([CONTEXT: SIMULATION] or [CONTEXT: REALITY])\n';
  output += '2. Context-sensitive terms should always be accompanied by a context tag in the nearby text\n';
  output += '3. Code examples that deal with simulation/reality transitions should include context tags in comments\n';
  output += '4. The default context should be SIMULATION unless explicitly marked otherwise\n';
  
  return output;
}

/**
 * Run the context tagging verification
 */
async function runVerification() {
  console.log('[CONTEXT: SIMULATION] Starting context tagging verification...');
  
  const results = new ContextVerificationResults();
  
  // Verify each document
  for (const file of ALL_DOCS) {
    await verifyContextTagging(file, results);
  }
  
  // Format and save results
  const formattedResults = formatResults(results);
  
  await fs.writeFile('context-tagging-verification-results.md', formattedResults);
  
  console.log('[CONTEXT: SIMULATION] Context tagging verification complete.');
  console.log(`[CONTEXT: SIMULATION] Found ${Object.keys(results.missingContextTags).length} documents missing context tags.`);
  console.log(`[CONTEXT: SIMULATION] Found ${Object.keys(results.improperTermUsage).length} documents with improper term usage.`);
  console.log('[CONTEXT: SIMULATION] Results saved to context-tagging-verification-results.md');
}

// Run the verification
runVerification().catch(error => {
  console.error('[CONTEXT: SIMULATION] Error running verification:', error);
});