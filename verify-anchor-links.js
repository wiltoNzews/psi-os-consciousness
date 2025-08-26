/**
 * Anchor Link Verification Tool
 * 
 * This tool specifically focuses on validating anchor links (#section-references)
 * across all documentation modules.
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

/**
 * Extract heading anchors from markdown content
 */
function extractHeadingAnchors(content) {
  const anchors = new Set();
  const headingRegex = /^(#{1,6})\s+(.+)$/gm;
  let match;
  
  while ((match = headingRegex.exec(content)) !== null) {
    const headingText = match[2].trim();
    // Convert heading to GitHub-style anchor:
    // 1. Convert to lowercase
    // 2. Replace spaces with hyphens
    // 3. Remove any characters that aren't alphanumeric, hyphen, or underscore
    const anchor = headingText
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')  // Remove invalid chars
      .replace(/\s+/g, '-')      // Replace spaces with hyphens
      .replace(/--+/g, '-');     // Replace multiple hyphens with single hyphen
      
    anchors.add(anchor);
  }
  
  return Array.from(anchors);
}

/**
 * Extract all markdown links with anchors from content
 */
function extractAnchorLinks(content) {
  const links = [];
  const linkRegex = /\[([^\]]+)\]\(([^)]+#[^)]+)\)/g;
  let match;
  
  while ((match = linkRegex.exec(content)) !== null) {
    const [fullMatch, linkText, linkUrl] = match;
    
    // Only process links with anchors
    if (linkUrl.includes('#')) {
      const [targetFile, anchor] = linkUrl.split('#');
      links.push({
        text: linkText,
        targetFile: targetFile || null, // null means same file
        anchor: anchor
      });
    }
  }
  
  return links;
}

/**
 * Verify all anchor links in the documentation
 */
async function verifyAnchorLinks() {
  console.log('[CONTEXT: SIMULATION] Starting anchor link verification...');

  // Load all documents and extract their anchors
  const docAnchors = {};
  
  for (const doc of ALL_DOCS) {
    try {
      const content = await fs.readFile(doc, 'utf8');
      docAnchors[doc] = extractHeadingAnchors(content);
    } catch (error) {
      console.error(`[CONTEXT: SIMULATION] Error reading ${doc}:`, error.message);
      docAnchors[doc] = [];
    }
  }
  
  // Verify all links with anchors
  const results = {
    validLinks: [],
    invalidLinks: []
  };
  
  for (const doc of ALL_DOCS) {
    try {
      const content = await fs.readFile(doc, 'utf8');
      const links = extractAnchorLinks(content);
      
      for (const link of links) {
        const targetDoc = link.targetFile || doc; // If no file specified, link is to same file
        
        // Check if target document exists
        if (!targetDoc || !docAnchors[targetDoc]) {
          results.invalidLinks.push({
            sourceDoc: doc,
            linkText: link.text,
            targetDoc: targetDoc,
            anchor: link.anchor,
            reason: 'Target document does not exist'
          });
          continue;
        }
        
        // Check if anchor exists in target document
        if (!docAnchors[targetDoc].includes(link.anchor)) {
          results.invalidLinks.push({
            sourceDoc: doc,
            linkText: link.text,
            targetDoc: targetDoc,
            anchor: link.anchor,
            reason: 'Anchor does not exist in target document'
          });
        } else {
          results.validLinks.push({
            sourceDoc: doc,
            linkText: link.text,
            targetDoc: targetDoc,
            anchor: link.anchor
          });
        }
      }
    } catch (error) {
      console.error(`[CONTEXT: SIMULATION] Error processing ${doc}:`, error.message);
    }
  }
  
  // Generate report
  let report = '[CONTEXT: SIMULATION] Anchor Link Verification Results\n\n';
  
  report += '## Summary\n\n';
  report += `- Total anchor links: ${results.validLinks.length + results.invalidLinks.length}\n`;
  report += `- Valid links: ${results.validLinks.length}\n`;
  report += `- Invalid links: ${results.invalidLinks.length}\n\n`;
  
  if (results.invalidLinks.length > 0) {
    report += '## Invalid Links\n\n';
    
    // Group by source document
    const bySource = {};
    for (const link of results.invalidLinks) {
      if (!bySource[link.sourceDoc]) {
        bySource[link.sourceDoc] = [];
      }
      bySource[link.sourceDoc].push(link);
    }
    
    for (const [sourceDoc, links] of Object.entries(bySource)) {
      report += `### ${sourceDoc}\n\n`;
      
      for (const link of links) {
        report += `- [${link.linkText}](${link.targetDoc}#${link.anchor}) - ${link.reason}\n`;
      }
      
      report += '\n';
    }
  }
  
  // Generate anchor reference guide for future use
  report += '## Anchor Reference Guide\n\n';
  report += 'This section lists all valid anchors in each document for reference when creating links.\n\n';
  
  for (const [doc, anchors] of Object.entries(docAnchors)) {
    if (anchors.length > 0) {
      report += `### ${doc}\n\n`;
      
      for (const anchor of anchors) {
        report += `- #${anchor}\n`;
      }
      
      report += '\n';
    }
  }
  
  // Write report to file
  await fs.writeFile('anchor-verification-results.md', report);
  
  console.log('[CONTEXT: SIMULATION] Anchor link verification complete.');
  console.log(`[CONTEXT: SIMULATION] Found ${results.invalidLinks.length} invalid links out of ${results.validLinks.length + results.invalidLinks.length} total links.`);
  console.log('[CONTEXT: SIMULATION] Results saved to anchor-verification-results.md');
  
  return {
    validLinks: results.validLinks.length,
    invalidLinks: results.invalidLinks.length,
    total: results.validLinks.length + results.invalidLinks.length
  };
}

// Run the verification
verifyAnchorLinks().catch(error => {
  console.error('[CONTEXT: SIMULATION] Error running verification:', error);
});