/**
 * Script to fix property name inconsistencies in meta-cognitive-analysis-engine.ts
 * 
 * This script replaces:
 * 1. 'confidenceLevel' with 'confidence' in CognitivePattern and CognitiveInsight
 * 2. 'timestamp' with 'createdAt' in CognitiveInsight
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

  // Replace 'confidenceLevel' in CognitivePattern instances
  let updatedContent = data.replace(
    /confidenceLevel: (0\.\d+)/g,
    'confidence: $1'
  );

  // Replace 'pattern.confidenceLevel' with 'pattern.confidence'
  updatedContent = updatedContent.replace(
    /pattern\.confidenceLevel/g,
    'pattern.confidence'
  );

  // Replace 'confidenceLevel' in CognitiveInsight instances
  updatedContent = updatedContent.replace(
    /confidenceLevel: ([^,\n]+)/g,
    'confidence: $1'
  );

  // Replace 'newPattern.confidenceLevel' with 'newPattern.confidence'
  updatedContent = updatedContent.replace(
    /newPattern\.confidenceLevel/g,
    'newPattern.confidence'
  );

  // Replace 'newInsight.confidenceLevel' with 'newInsight.confidence'
  updatedContent = updatedContent.replace(
    /newInsight\.confidenceLevel/g,
    'newInsight.confidence'
  );

  // Replace 'timestamp: new Date()' with 'createdAt: new Date()'
  updatedContent = updatedContent.replace(
    /timestamp: new Date\(\)/g,
    'createdAt: new Date()'
  );
  
  // Replace 'insight.timestamp' with 'insight.createdAt'
  updatedContent = updatedContent.replace(
    /insight\.timestamp/g,
    'insight.createdAt'
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