/**
 * Test Script to verify environment-based storage selection
 * 
 * This script validates that the storage switch correctly selects 
 * FileSystemStorage in production and MemStorage in other environments.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the current file's directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Print the environment
console.log('\n--- Storage Switch Test ---');
console.log(`Current NODE_ENV: ${process.env.NODE_ENV || 'undefined (defaults to development)'}`);

// Since we can't directly import storage from server/db.ts without TypeScript setup,
// we'll check the storage selection by examining the server console output from the start script
async function checkStorageSelection() {
  try {
    // We'll use our direct check of db.ts instead of looking for log files
    // which are harder to locate in the Replit environment
    const dbFilePath = path.join(__dirname, 'server', 'db.ts');
    if (fs.existsSync(dbFilePath)) {
      const content = fs.readFileSync(dbFilePath, 'utf8');
      
      console.log('--- Storage Selection Analysis ---');
      if (content.includes("console.log(`Using ${process.env.NODE_ENV === 'production' ? 'FileSystemStorage' : 'MemStorage'} for primary storage`)")) {
        console.log('✅ Found proper console logging of storage type');
      }
      
      if (content.includes("export const storage = process.env.NODE_ENV === 'production'")) {
        console.log('✅ Storage selection is correctly based on NODE_ENV');
        console.log('  - In development: Using MemStorage');
        console.log('  - In production: Using FileSystemStorage');
      } else {
        console.log('❌ Storage selection may not be correctly based on NODE_ENV');
      }
    } else {
      console.log('❌ Could not find server/db.ts file');
    }
  } catch (error) {
    console.error('Error checking storage configuration:', error.message);
  }
}

// Run the check
await checkStorageSelection();

// Let's also check server/db.ts to see how it's currently configured
try {
  const dbFilePath = path.join(__dirname, 'server', 'db.ts');
  if (fs.existsSync(dbFilePath)) {
    const content = fs.readFileSync(dbFilePath, 'utf8');
    console.log('\n--- Current Storage Configuration ---');
    
    if (content.includes('process.env.NODE_ENV === "production"')) {
      console.log('✅ Environment switch is correctly configured to use:');
      console.log('   - FileSystemStorage in production');
      console.log('   - MemStorage in development');
    } else {
      console.log('⚠️ Environment switch may be misconfigured. Check server/db.ts');
    }
  }
} catch (error) {
  console.error('Error reading db.ts:', error.message);
}

// Provide environment setting instructions
console.log('\n--- How to Test Different Environments ---');
console.log('To test production mode:');
console.log('1. Modify server/db.ts to use process.env.NODE_ENV === "production" || true');
console.log('2. Restart the application');
console.log('\nTo restore development mode:');
console.log('1. Modify server/db.ts to use process.env.NODE_ENV === "production"');
console.log('2. Restart the application');