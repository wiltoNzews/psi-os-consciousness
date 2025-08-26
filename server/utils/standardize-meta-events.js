/**
 * Meta-Cognitive Event Standardization Script
 * 
 * This utility script automates the process of standardizing meta-cognitive events
 * across the codebase, ensuring consistency and proper date handling according to
 * the Explicit-Implicit Quantum Balance principle.
 * 
 * [QUANTUM_STATE: SIM_FLOW]
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Define patterns to search for in the codebase
const PATTERNS = {
  // Look for eventType → type conversion
  EVENT_TYPE_PATTERN: /(\w+)\.eventType(\s*=\s*['"].*?['"])/g,
  TYPE_PATTERN_FIX: '$1.type$2',
  
  // Look for timestamp → createdAt conversion
  TIMESTAMP_PATTERN: /(\w+)\.timestamp(\s*=\s*.*?[;,\n])/g,
  TIMESTAMP_PATTERN_FIX: '$1.createdAt$2',
  
  // Look for confidenceLevel → confidence conversion
  CONFIDENCE_LEVEL_PATTERN: /(\w+)\.confidenceLevel(\s*=\s*.*?[;,\n])/g,
  CONFIDENCE_LEVEL_PATTERN_FIX: '$1.confidence$2',
  
  // Look for direct new Date() calls that should use DateTransformer
  DATE_CREATION_PATTERN: /new Date\(\)/g,
  DATE_CREATION_FIX: 'DateTransformer.createDate()',
  
  // Look for JSON.stringify calls that should use DateTransformer
  JSON_STRINGIFY_PATTERN: /JSON\.stringify\(([^,)]+)(?:,\s*([^,)]+))?\)/g,
  JSON_STRINGIFY_FIX: 'DateTransformer.stringifyWithDates($1)',
  
  // Look for JSON.parse calls that should use DateTransformer
  JSON_PARSE_PATTERN: /JSON\.parse\(([^)]+)\)/g,
  JSON_PARSE_FIX: 'DateTransformer.parseWithDates($1)',
  
  // Look for manual relatedEvents array conversions
  RELATED_EVENTS_PATTERN: /if\s*\(\s*typeof\s+(\w+)\.relatedEvents\s*===\s*['"]string['"]\s*\)\s*{\s*(\w+)\.relatedEvents\s*=\s*\w+\.relatedEvents\.split\(['"],['"]\)/g,
  RELATED_EVENTS_FIX: '// Standardized via MetaCognitiveEventUtility.normalizeEvent',
  
  // Look for legacy meta-cognitive event creation calls
  LEGACY_EVENT_CREATION: /{\s*id\s*:\s*[^,]+,\s*eventType\s*:/g,
  LEGACY_EVENT_CREATION_FIX: '{ id: uuidv4(), type:'
};

// Define directories to exclude
const EXCLUDE_DIRS = [
  'node_modules',
  '.git',
  'dist',
  'build',
  'coverage'
];

// Define file extensions to process
const FILE_EXTENSIONS = [
  '.ts',
  '.js'
];

/**
 * Process a single file to standardize meta-cognitive events
 * @param {string} filePath Path to the file to process
 * @returns {boolean} True if changes were made, false otherwise
 */
function processFile(filePath) {
  // Read the file content
  let content = fs.readFileSync(filePath, 'utf8');
  const originalContent = content;
  
  // Check for imports
  const needsDateTransformer = content.includes('new Date()') && 
    !content.includes('import { DateTransformer }');
  
  const needsMetaCognitiveEventUtility = 
    (content.includes('eventType') || content.includes('timestamp') || content.includes('confidenceLevel')) && 
    !content.includes('import { MetaCognitiveEventUtility }');
  
  const needsMetaCognitiveEventBuilder = 
    (content.includes('MetaCognitiveEvent') || content.match(/{\s*id\s*:/)) && 
    !content.includes('import { MetaCognitiveEventBuilder }');
  
  // Apply standardization patterns
  for (const [pattern, replacement] of Object.entries(PATTERNS)) {
    if (pattern.endsWith('_PATTERN')) {
      const regex = PATTERNS[pattern];
      const fix = PATTERNS[pattern.replace('_PATTERN', '_FIX')];
      content = content.replace(regex, fix);
    }
  }
  
  // Add necessary imports
  if (needsDateTransformer || needsMetaCognitiveEventUtility || needsMetaCognitiveEventBuilder) {
    const importStatements = [];
    
    if (needsDateTransformer) {
      importStatements.push("import { DateTransformer } from '../services/utils/DateTransformer.js';");
    }
    
    if (needsMetaCognitiveEventUtility) {
      importStatements.push("import { MetaCognitiveEventUtility } from '../services/utils/MetaCognitiveEventUtility.js';");
    }
    
    if (needsMetaCognitiveEventBuilder) {
      importStatements.push("import { MetaCognitiveEventBuilder } from '../services/utils/MetaCognitiveEventBuilder.js';");
    }
    
    // Add imports after other imports
    const lastImportIndex = content.lastIndexOf('import ');
    if (lastImportIndex !== -1) {
      let endOfImports = content.indexOf('\n', lastImportIndex);
      endOfImports = content.indexOf('\n', endOfImports + 1);
      
      content = 
        content.substring(0, endOfImports + 1) + 
        importStatements.join('\n') + 
        '\n' + 
        content.substring(endOfImports + 1);
    } else {
      // Add at the top if no imports found
      content = importStatements.join('\n') + '\n\n' + content;
    }
  }
  
  // Check if changes were made
  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    return true;
  }
  
  return false;
}

/**
 * Process all files in a directory (recursively)
 * @param {string} dirPath Directory to process
 * @returns {Array} Array of files that were modified
 */
function processDirectory(dirPath) {
  const modifiedFiles = [];
  
  const items = fs.readdirSync(dirPath);
  
  for (const item of items) {
    const itemPath = path.join(dirPath, item);
    const stat = fs.statSync(itemPath);
    
    if (stat.isDirectory()) {
      // Skip excluded directories
      if (EXCLUDE_DIRS.includes(item)) {
        continue;
      }
      
      // Process subdirectory
      const subDirModified = processDirectory(itemPath);
      modifiedFiles.push(...subDirModified);
    } else if (stat.isFile()) {
      // Check file extension
      const ext = path.extname(itemPath);
      if (FILE_EXTENSIONS.includes(ext)) {
        // Process file
        const modified = processFile(itemPath);
        if (modified) {
          modifiedFiles.push(itemPath);
        }
      }
    }
  }
  
  return modifiedFiles;
}

/**
 * Entry point: standardize meta-cognitive events across the codebase
 */
function standardizeMetaCognitiveEvents() {
  console.log('[QUANTUM_STATE: SIM_FLOW] Starting meta-cognitive event standardization...');
  
  try {
    // Update server directory
    const serverDir = path.join(__dirname, '..');
    const modifiedFiles = processDirectory(serverDir);
    
    console.log(`[QUANTUM_STATE: SIM_FLOW] Standardization complete. Modified ${modifiedFiles.length} files.`);
    
    if (modifiedFiles.length > 0) {
      console.log('\nModified files:');
      modifiedFiles.forEach(file => {
        console.log(` - ${path.relative(process.cwd(), file)}`);
      });
    } else {
      console.log('\nNo files needed modification.');
    }
  } catch (error) {
    console.error('[QUANTUM_STATE: SIM_FLOW] Error during standardization:', error);
  }
}

// Run the standardization
standardizeMetaCognitiveEvents();