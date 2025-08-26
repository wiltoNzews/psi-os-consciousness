/**
 * Script to fix all property name inconsistencies in meta-cognitive-analysis-engine.ts
 * 
 * This script replaces:
 * 1. All 'confidenceLevel' with 'confidence' in CognitivePattern and CognitiveInsight objects
 * 2. All 'timestamp' with 'createdAt' in CognitiveInsight objects
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const filePath = path.join(__dirname, 'server', 'services', 'qrn', 'meta-cognitive-analysis-engine.ts');

// Read the file
fs.readFile(filePath, 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading file:', err);
    return;
  }

  // First, replace in object creation (definitions)
  let updatedContent = data.replace(
    /confidenceLevel: (0\.\d+)/g,
    'confidence: $1'
  );
  
  // Replace property references (get/set)
  updatedContent = updatedContent.replace(
    /pattern\.confidenceLevel/g,
    'pattern.confidence'
  );
  
  updatedContent = updatedContent.replace(
    /newPattern\.confidenceLevel/g,
    'newPattern.confidence'
  );
  
  updatedContent = updatedContent.replace(
    /newInsight\.confidenceLevel/g,
    'newInsight.confidence'
  );
  
  updatedContent = updatedContent.replace(
    /p\.confidenceLevel/g,
    'p.confidence'
  );
  
  updatedContent = updatedContent.replace(
    /insight\.confidenceLevel/g,
    'insight.confidence'
  );
  
  updatedContent = updatedContent.replace(
    /event\.confidenceLevel/g,
    'event.confidence'
  );
  
  // Replace timestamp in object creation
  updatedContent = updatedContent.replace(
    /timestamp: new Date\(\)/g,
    'createdAt: new Date()'
  );
  
  // Replace timestamp property references
  updatedContent = updatedContent.replace(
    /insight\.timestamp/g,
    'insight.createdAt'
  );
  
  updatedContent = updatedContent.replace(
    /a\.timestamp\.getTime\(\)/g,
    'a.createdAt.getTime()'
  );
  
  updatedContent = updatedContent.replace(
    /b\.timestamp\.getTime\(\)/g,
    'b.createdAt.getTime()'
  );

  // Write the updated content back to the file
  fs.writeFile(filePath, updatedContent, 'utf8', (err) => {
    if (err) {
      console.error('Error writing file:', err);
      return;
    }
    console.log('Successfully updated property names in meta-cognitive-analysis-engine.ts');
  });
});