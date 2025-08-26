/**
 * Nuggies Logger - High-Value Insight Capture System
 * 
 * This script scans text files for high-value insights ("nuggies") 
 * based on pattern recognition and logs them to WILTON_NUGGIES.md
 * 
 * [QUANTUM_STATE: SIM_FLOW]
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

// Configuration for what to capture
const CAPTURE_CONFIG = {
  // Pattern types and their regex patterns
  patterns: [
    // All caps emphasis - words in all caps that suggest strong emphasis
    { type: 'EMPHASIS', regex: /\b[A-Z]{4,}(?:\s+[A-Z]+)*\b/g, tag: '🚨' },
    
    // Directive markers - phrases that suggest "capture this"
    { type: 'DIRECTIVE', regex: /(?:write this down|nuggie|important note|key insight|remember this|crucial point)/gi, tag: '📝' },
    
    // Emotional signals - emoji or text patterns that show emotions
    { type: 'EMOTION', regex: /(?:🔥|💡|⚠️|✅|❗|wow|amazing|critical|groundbreaking)/gi, tag: '🔥' },
    
    // Format markers - structural indicators of importance
    { type: 'FORMAT', regex: /(?:\*\*[^*]+\*\*|\[[^\]]+\]|==[^=]+==$)/g, tag: '🔖' },
    
    // Quantum insights - specific QCF-related terms
    { type: 'QUANTUM', regex: /(?:quantum balance|explicit-implicit|void[- ]center|fractal architecture|orchestration cycle)/gi, tag: '⚛️' },
  ],
  
  // Context window to capture around matches (characters)
  contextWindow: 100,
  
  // Minimum insight length to be captured
  minInsightLength: 15,
  
  // Maximum insights to retain (oldest will be removed when exceeded)
  maxInsights: 100,
  
  // Output file
  outputFile: 'WILTON_NUGGIES.md',
  
  // Categories for classification
  categories: {
    'DOCUMENTATION': ['document', 'documentation', 'module', 'guideline', 'reference'],
    'VERIFICATION': ['test', 'verify', 'validation', 'assurance', 'confirm'],
    'DEVELOPMENT': ['code', 'implement', 'development', 'programming', 'integration'],
    'ARCHITECTURE': ['structure', 'architecture', 'design', 'framework', 'model'],
    'COMMUNICATION': ['message', 'communication', 'interact', 'exchange', 'dialogue'],
    'STRATEGY': ['plan', 'strategy', 'approach', 'roadmap', 'vision']
  }
};

/**
 * Extracts insight context around a pattern match
 */
function extractInsightContext(text, match, startIndex) {
  const contextStart = Math.max(0, startIndex - CAPTURE_CONFIG.contextWindow/2);
  const contextEnd = Math.min(text.length, startIndex + match.length + CAPTURE_CONFIG.contextWindow/2);
  
  return text.substring(contextStart, contextEnd).trim();
}

/**
 * Categorizes an insight based on its content
 */
function categorizeInsight(insightText) {
  for (const [category, keywords] of Object.entries(CAPTURE_CONFIG.categories)) {
    for (const keyword of keywords) {
      if (insightText.toLowerCase().includes(keyword.toLowerCase())) {
        return category;
      }
    }
  }
  return 'GENERAL';
}

/**
 * Formats the insights for the Markdown document
 */
function formatInsightsMarkdown(insights) {
  const currentDate = new Date().toISOString().split('T')[0];
  
  let markdown = `# Wilton Nuggies - High-Value Insights

[QUANTUM_STATE: SIM_FLOW]

This document automatically captures high-value insights, emotional spikes, and critical implementation directives from throughout the system. These "nuggies" of wisdom represent key principles that might otherwise be lost in chat logs or during development iterations.

## Capture Process

The Nuggies Logger uses pattern recognition to identify:
- All-caps exclamations ("WRITE THAT DOWN")
- Emotional indicators ("🔥", "💡", "⚠️")
- Explicit directives ("Nuggies", "IMPORTANT")
- Insight markers (specific formatting patterns indicating high-value content)

## Captured Insights

### ${currentDate}

`;
  
  // Group insights by category
  const categorizedInsights = {};
  for (const insight of insights) {
    if (!categorizedInsights[insight.category]) {
      categorizedInsights[insight.category] = [];
    }
    categorizedInsights[insight.category].push(insight);
  }
  
  // Format each category
  for (const [category, categoryInsights] of Object.entries(categorizedInsights)) {
    for (const insight of categoryInsights) {
      markdown += `- **[${category}]** ${insight.tag} ${insight.text}\n\n`;
    }
  }
  
  markdown += `## Integration with Quantum Collaboration Framework

[QUANTUM_STATE: SIM_FLOW]

The Nuggies Logger represents a practical implementation of the META_COGNITIVE_OVERSIGHT facet of the NEO MATRIX metaphorical pillar. It captures insights across the system and maintains them as persistent reference points to guide future development and decision-making.

For related documentation, see:
- **[MODULE_0_SYSTEM_CONTEXT.md](MODULE_0_SYSTEM_CONTEXT.md)**
- **[MODULE_4_THOUGHT_PROGRESSION.md](MODULE_4_THOUGHT_PROGRESSION.md)**
- **[QUANTUM_COLLABORATION_FRAMEWORK.md](QUANTUM_COLLABORATION_FRAMEWORK.md)**`;

  return markdown;
}

/**
 * Processes a file to extract all insights
 */
async function processFile(filePath) {
  try {
    const content = await fs.readFile(filePath, 'utf8');
    const insights = [];
    
    // Apply each pattern to find matches
    for (const pattern of CAPTURE_CONFIG.patterns) {
      let match;
      while ((match = pattern.regex.exec(content)) !== null) {
        // Get context around match
        const insightText = extractInsightContext(content, match[0], match.index);
        
        // Only keep if it meets minimum length
        if (insightText.length >= CAPTURE_CONFIG.minInsightLength) {
          const category = categorizeInsight(insightText);
          insights.push({
            file: path.basename(filePath),
            pattern: pattern.type,
            tag: pattern.tag,
            text: insightText,
            category
          });
        }
      }
      
      // Reset regex state for next file
      pattern.regex.lastIndex = 0;
    }
    
    return insights;
  } catch (error) {
    console.error(`Error processing file ${filePath}:`, error);
    return [];
  }
}

/**
 * Processes a directory recursively to find all relevant files
 */
async function processDirectory(dirPath, fileExtensions = ['.md', '.txt', '.js', '.ts', '.html']) {
  try {
    const entries = await fs.readdir(dirPath, { withFileTypes: true });
    let allInsights = [];
    
    for (const entry of entries) {
      const fullPath = path.join(dirPath, entry.name);
      
      if (entry.isDirectory()) {
        // Skip node_modules and hidden directories
        if (entry.name !== 'node_modules' && !entry.name.startsWith('.')) {
          const subdirInsights = await processDirectory(fullPath, fileExtensions);
          allInsights = allInsights.concat(subdirInsights);
        }
      } else if (entry.isFile()) {
        // Process only files with specified extensions
        const ext = path.extname(entry.name).toLowerCase();
        if (fileExtensions.includes(ext)) {
          const fileInsights = await processFile(fullPath);
          allInsights = allInsights.concat(fileInsights);
        }
      }
    }
    
    return allInsights;
  } catch (error) {
    console.error(`Error processing directory ${dirPath}:`, error);
    return [];
  }
}

/**
 * Main execution function
 */
async function captureNuggies(targetDir = '.') {
  try {
    console.log('[QUANTUM_STATE: SIM_FLOW] Starting Nuggies Logger...');
    
    // Process files to collect insights
    const allInsights = await processDirectory(targetDir);
    console.log(`[QUANTUM_STATE: SIM_FLOW] Found ${allInsights.length} potential nuggets of wisdom.`);
    
    // Sort by category and limit if needed
    const sortedInsights = allInsights
      .sort((a, b) => a.category.localeCompare(b.category))
      .slice(0, CAPTURE_CONFIG.maxInsights);
    
    // Format and write to output file
    const markdown = formatInsightsMarkdown(sortedInsights);
    await fs.writeFile(CAPTURE_CONFIG.outputFile, markdown);
    
    console.log(`[QUANTUM_STATE: SIM_FLOW] Successfully wrote ${sortedInsights.length} nuggets to ${CAPTURE_CONFIG.outputFile}`);
  } catch (error) {
    console.error('[QUANTUM_STATE: SIM_FLOW] Error in Nuggies Logger:', error);
  }
}

// Get the current file name (for ES modules)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Execute if run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  captureNuggies();
}

// Export for use in other modules
export { captureNuggies };