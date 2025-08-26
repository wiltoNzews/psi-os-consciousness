/**
 * Script to check critical modules for the Modularity God Formula compliance
 * 
 * This script checks the key modules for compliance with all aspects of the Modularity God Formula:
 * - Chronos usage for consistent date handling
 * - Interface implementation completeness
 * - Clear boundary definitions
 * - Single responsibility principle adherence
 */

import * as fs from 'fs/promises';
import * as path from 'path';

// Critical modules to check
const CRITICAL_MODULES = [
  './server/services/utils/chronos-date-handler.ts',
  './server/services/context/persistent-context-service.ts',
  './server/services/context/mem-persistent-context-service.ts',
  './server/storage.ts'
];

// Check Chronos usage
async function checkChronosUsage(filePath) {
  console.log(`Checking Chronos usage in ${filePath}...`);
  
  try {
    const content = await fs.readFile(filePath, 'utf-8');
    
    // Special case for ChronosDateHandler itself
    if (filePath.endsWith('chronos-date-handler.ts')) {
      console.log('✅ ChronosDateHandler is exempt from Chronos usage checks (would cause circular reference).');
      return true;
    }
    
    // Look for new Date() calls
    const newDateMatches = content.match(/\bnew Date\(/g);
    if (newDateMatches) {
      console.log(`❌ Found ${newDateMatches.length} direct 'new Date()' calls in ${filePath}`);
      return false;
    }
    
    // Look for ChronosDateHandler.createDate() calls
    const chronosMatches = content.match(/\bChronosDateHandler\.createDate\(/g);
    if (!chronosMatches || chronosMatches.length === 0) {
      console.log(`⚠️ No ChronosDateHandler.createDate() calls found in ${filePath}`);
    }
    
    console.log('✅ No direct new Date() calls found.');
    return true;
  } catch (error) {
    console.error(`❌ Error checking Chronos usage in ${filePath}:`, error);
    return false;
  }
}

// Check boundary definitions
async function checkBoundaryDefinitions(filePath) {
  console.log(`Checking boundary definitions in ${filePath}...`);
  
  try {
    const content = await fs.readFile(filePath, 'utf-8');
    
    // Check for boundary comments
    const boundaryCommentMatches = content.match(/BOUNDARY\s+(AWARENESS|DEFINITION|HANDLING|MANAGEMENT)/g);
    
    if (boundaryCommentMatches && boundaryCommentMatches.length > 0) {
      console.log(`✅ Found ${boundaryCommentMatches.length} boundary definition comments`);
      return true;
    }
    
    // Check for Void-Centered Design
    const voidCenteredMatches = content.match(/Void-Centered\s+Design/gi);
    if (voidCenteredMatches && voidCenteredMatches.length > 0) {
      console.log(`✅ Found ${voidCenteredMatches.length} references to Void-Centered Design`);
      return true;
    }
    
    console.log('❌ No explicit boundary definitions found.');
    return false;
  } catch (error) {
    console.error(`❌ Error checking boundary definitions in ${filePath}:`, error);
    return false;
  }
}

// Check responsibility definitions
async function checkResponsibilityDefinitions(filePath) {
  console.log(`Checking responsibility definitions in ${filePath}...`);
  
  try {
    const content = await fs.readFile(filePath, 'utf-8');
    
    // Check for responsibility comments
    const responsibilityMatches = content.match(/RESPONSIBILITY/g);
    
    if (responsibilityMatches && responsibilityMatches.length > 0) {
      console.log(`✅ Found ${responsibilityMatches.length} responsibility definition comments`);
      return true;
    }
    
    console.log('❌ No explicit responsibility definitions found.');
    return false;
  } catch (error) {
    console.error(`❌ Error checking responsibility definitions in ${filePath}:`, error);
    return false;
  }
}

// Check storage interface implementation (only for storage.ts)
async function checkStorageImplementation(filePath) {
  if (!filePath.endsWith('storage.ts')) {
    return true; // Not a storage module
  }
  
  console.log(`Checking storage interface implementation in ${filePath}...`);
  
  try {
    const content = await fs.readFile(filePath, 'utf-8');
    
    // Extract interface methods
    console.log('Extracting IStorage interface methods...');
    const interfaceMethods = [];
    let insideInterface = false;
    let bracketCount = 0;
    
    const lines = content.split('\n');
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      // Check if we've found the interface
      if (line.includes('interface IStorage')) {
        insideInterface = true;
        bracketCount = 0;
        continue;
      }
      
      if (insideInterface) {
        // Count brackets to know when we're out of the interface
        if (line.includes('{')) bracketCount++;
        if (line.includes('}')) bracketCount--;
        
        // If bracketCount reaches 0, we're out of the interface
        if (bracketCount < 0) {
          insideInterface = false;
          continue;
        }
        
        // Look for method definitions
        const methodMatch = line.match(/^\s*(\w+)\s*\(/);
        if (methodMatch) {
          interfaceMethods.push(methodMatch[1]);
        }
      }
    }
    
    console.log(`Found ${interfaceMethods.length} methods in IStorage interface`);
    
    // Extract implemented methods
    console.log('Extracting MemStorage implemented methods...');
    const implementedMethods = [];
    let insideClass = false;
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      // Check if we've found the class
      if (line.includes('class MemStorage') && line.includes('implements IStorage')) {
        insideClass = true;
        continue;
      }
      
      if (insideClass) {
        // Look for method implementations
        const methodMatch = line.match(/^\s*async\s+(\w+)\s*\(/);
        if (methodMatch) {
          implementedMethods.push(methodMatch[1]);
        }
      }
    }
    
    console.log(`Found ${implementedMethods.length} implemented methods in MemStorage class`);
    
    // Find missing methods
    const missingMethods = interfaceMethods.filter(method => !implementedMethods.includes(method));
    
    if (missingMethods.length > 0) {
      console.log(`❌ MemStorage is missing implementations for ${missingMethods.length} methods: ${missingMethods.join(', ')}`);
      return false;
    }
    
    console.log('✅ MemStorage fully implements the IStorage interface');
    return true;
  } catch (error) {
    console.error(`❌ Error checking storage implementation in ${filePath}:`, error);
    return false;
  }
}

// Run all checks for a file
async function checkFile(filePath) {
  console.log(`\n=== Checking ${filePath} ===\n`);
  
  const absolutePath = path.resolve(process.cwd(), filePath);
  
  const chronosResult = await checkChronosUsage(absolutePath);
  const boundaryResult = await checkBoundaryDefinitions(absolutePath);
  const responsibilityResult = await checkResponsibilityDefinitions(absolutePath);
  const storageResult = await checkStorageImplementation(absolutePath);
  
  const passed = chronosResult && boundaryResult && responsibilityResult && storageResult;
  
  console.log(`\n${passed ? '✅ PASSED' : '❌ FAILED'}: ${filePath}\n`);
  
  return passed;
}

// Main function
async function main() {
  console.log('=== Checking Critical Modules for Modularity God Formula Compliance ===\n');
  
  let failures = 0;
  
  for (const module of CRITICAL_MODULES) {
    const passed = await checkFile(module);
    if (!passed) failures++;
  }
  
  if (failures === 0) {
    console.log('\n✅ ALL CRITICAL MODULES PASSED VERIFICATION');
  } else {
    console.log(`\n❌ ${failures} MODULES FAILED VERIFICATION`);
  }
}

// Run the main function
main().catch(error => {
  console.error('Error during verification:', error);
  process.exit(1);
});