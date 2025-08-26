/**
 * Documentation Structure Verification Tool
 * 
 * This tool validates the structure, cross-references, and integrity
 * of the WiltonOS module documentation framework.
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

// Regular expression to find markdown links with proper format
// Captures: [display text](url#anchor)
const MARKDOWN_LINK_REGEX = /\[([^\]]+)\]\(([^)]+)\)/g;

// Regular expression to find anchor references in URLs
const ANCHOR_REGEX = /#([a-z0-9_-]+)/i;

/**
 * Verification results structure
 */
class VerificationResults {
  constructor() {
    this.fileExists = {};
    this.brokenLinks = {};
    this.missingAnchors = {};
    this.missingCrossReferences = {};
    this.contextTagging = {};
    this.summary = {
      totalFiles: 0,
      filesChecked: 0,
      totalLinks: 0,
      brokenLinks: 0,
      missingAnchors: 0,
      missingCrossReferences: 0,
      contextTaggingIssues: 0
    };
  }

  incrementLinkCount() {
    this.summary.totalLinks++;
  }

  addBrokenLink(file, link) {
    if (!this.brokenLinks[file]) {
      this.brokenLinks[file] = [];
    }
    this.brokenLinks[file].push(link);
    this.summary.brokenLinks++;
  }

  addMissingAnchor(file, link, anchor) {
    if (!this.missingAnchors[file]) {
      this.missingAnchors[file] = [];
    }
    this.missingAnchors[file].push({ link, anchor });
    this.summary.missingAnchors++;
  }

  addMissingCrossReference(file, expectedReference) {
    if (!this.missingCrossReferences[file]) {
      this.missingCrossReferences[file] = [];
    }
    this.missingCrossReferences[file].push(expectedReference);
    this.summary.missingCrossReferences++;
  }

  addContextTaggingIssue(file, issue) {
    if (!this.contextTagging[file]) {
      this.contextTagging[file] = [];
    }
    this.contextTagging[file].push(issue);
    this.summary.contextTaggingIssues++;
  }

  addFileCheck(file, exists) {
    this.fileExists[file] = exists;
    this.summary.filesChecked++;
    if (exists) {
      this.summary.totalFiles++;
    }
  }
}

/**
 * Check if a file exists
 */
async function fileExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

/**
 * Extract all markdown links from content
 */
function extractLinks(content) {
  const links = [];
  let match;
  
  while ((match = MARKDOWN_LINK_REGEX.exec(content)) !== null) {
    links.push({
      text: match[1],
      url: match[2]
    });
  }
  
  return links;
}

/**
 * Check if an anchor exists in content
 */
function anchorExists(content, anchor) {
  // Convert anchor to match various markdown heading formats
  // This is a simplified check and might need enhancement for complex documents
  const possibleHeadings = [
    `# ${anchor}`,
    `## ${anchor}`,
    `### ${anchor}`,
    `#### ${anchor}`,
    `##### ${anchor}`,
    `###### ${anchor}`
  ];
  
  // Convert kebab-case to regular text by replacing hyphens with spaces
  const anchorAsText = anchor.replace(/-/g, ' ');
  
  for (const heading of possibleHeadings) {
    if (content.includes(heading) || content.includes(heading.toLowerCase())) {
      return true;
    }
  }
  
  // Also check for heading that might match the anchor when transformed to kebab-case
  // This is a more complex check that would need to be enhanced for production use
  
  return false;
}

/**
 * Verify presence of module cross-references
 */
function verifyCrossReferences(content, file, results) {
  // For each module, there should be references to all other modules
  // in the cross-reference section
  
  // This is a simplified check and would need enhancement for production use
  for (const module of MODULES) {
    // Don't check self-references
    if (module === file) continue;
    
    // Check if the module is referenced in the content
    if (!content.includes(module)) {
      results.addMissingCrossReference(file, module);
    }
  }
  
  // Also check for supporting documents
  for (const doc of SUPPORTING_DOCS) {
    if (!content.includes(doc)) {
      results.addMissingCrossReference(file, doc);
    }
  }
}

/**
 * Verify SIMULATION/REALITY context tagging
 */
function verifyContextTagging(content, file, results) {
  // Check if the document includes proper context tagging
  if (!content.includes('[CONTEXT: SIMULATION]') && !content.includes('[CONTEXT: REALITY]')) {
    results.addContextTaggingIssue(file, 'Missing context tag ([CONTEXT: SIMULATION] or [CONTEXT: REALITY])');
  }
  
  // Check for FlowType references without context tags
  if (content.includes('FlowType') && (!content.includes('[CONTEXT: SIMULATION]') && !content.includes('[CONTEXT: REALITY]'))) {
    results.addContextTaggingIssue(file, 'Found FlowType references without context tagging');
  }
}

/**
 * Verify a single document
 */
async function verifyDocument(file, allFiles, results) {
  const exists = await fileExists(file);
  results.addFileCheck(file, exists);
  
  if (!exists) {
    console.log(`[CONTEXT: SIMULATION] File not found: ${file}`);
    return;
  }
  
  try {
    const content = await fs.readFile(file, 'utf8');
    
    // Extract and verify links
    const links = extractLinks(content);
    
    for (const link of links) {
      results.incrementLinkCount();
      
      // Check if link points to another document
      if (link.url.endsWith('.md') || link.url.includes('.md#')) {
        const targetFile = link.url.split('#')[0];
        
        // Check if target file exists
        if (!allFiles.includes(targetFile)) {
          results.addBrokenLink(file, link);
          continue;
        }
        
        // Check if link has an anchor
        const anchorMatch = link.url.match(ANCHOR_REGEX);
        if (anchorMatch) {
          const anchor = anchorMatch[1];
          
          // Read target file to check if anchor exists
          const targetContent = await fs.readFile(targetFile, 'utf8');
          
          if (!anchorExists(targetContent, anchor)) {
            results.addMissingAnchor(file, link, anchor);
          }
        }
      }
    }
    
    // Verify cross-references
    verifyCrossReferences(content, file, results);
    
    // Verify context tagging
    verifyContextTagging(content, file, results);
    
  } catch (error) {
    console.error(`[CONTEXT: SIMULATION] Error verifying ${file}:`, error);
  }
}

/**
 * Format verification results for display
 */
function formatResults(results) {
  let output = '[CONTEXT: SIMULATION] Documentation Structure Verification Results\n\n';
  
  output += '## Summary\n\n';
  output += `- Total files: ${results.summary.totalFiles}\n`;
  output += `- Total links checked: ${results.summary.totalLinks}\n`;
  output += `- Broken links: ${results.summary.brokenLinks}\n`;
  output += `- Missing anchors: ${results.summary.missingAnchors}\n`;
  output += `- Missing cross-references: ${results.summary.missingCrossReferences}\n`;
  output += `- Context tagging issues: ${results.summary.contextTaggingIssues}\n\n`;
  
  if (results.summary.brokenLinks > 0) {
    output += '## Broken Links\n\n';
    
    for (const [file, links] of Object.entries(results.brokenLinks)) {
      output += `### ${file}\n\n`;
      
      for (const link of links) {
        output += `- [${link.text}](${link.url})\n`;
      }
      
      output += '\n';
    }
  }
  
  if (results.summary.missingAnchors > 0) {
    output += '## Missing Anchors\n\n';
    
    for (const [file, anchors] of Object.entries(results.missingAnchors)) {
      output += `### ${file}\n\n`;
      
      for (const { link, anchor } of anchors) {
        output += `- [${link.text}](${link.url}) - Missing anchor: "${anchor}"\n`;
      }
      
      output += '\n';
    }
  }
  
  if (results.summary.missingCrossReferences > 0) {
    output += '## Missing Cross-References\n\n';
    
    for (const [file, references] of Object.entries(results.missingCrossReferences)) {
      output += `### ${file}\n\n`;
      
      for (const reference of references) {
        output += `- Missing reference to ${reference}\n`;
      }
      
      output += '\n';
    }
  }
  
  if (results.summary.contextTaggingIssues > 0) {
    output += '## Context Tagging Issues\n\n';
    
    for (const [file, issues] of Object.entries(results.contextTagging)) {
      output += `### ${file}\n\n`;
      
      for (const issue of issues) {
        output += `- ${issue}\n`;
      }
      
      output += '\n';
    }
  }
  
  return output;
}

/**
 * Run the verification on all documents
 */
async function runVerification() {
  console.log('[CONTEXT: SIMULATION] Starting documentation structure verification...');
  
  const results = new VerificationResults();
  
  // Verify each document
  for (const file of ALL_DOCS) {
    await verifyDocument(file, ALL_DOCS, results);
  }
  
  // Format and display results
  const formattedResults = formatResults(results);
  console.log(formattedResults);
  
  // Write results to a file
  await fs.writeFile('doc-verification-results.md', formattedResults);
  
  console.log('[CONTEXT: SIMULATION] Verification complete. Results saved to doc-verification-results.md');
}

// Run the verification
runVerification().catch(error => {
  console.error('[CONTEXT: SIMULATION] Error running verification:', error);
});