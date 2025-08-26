/**
 * Simple test for storage environment switch
 * 
 * This script verifies that the storage switch in db.ts correctly selects
 * the appropriate storage implementation based on the NODE_ENV environment variable.
 */

async function verifyStorageSwitch() {
  console.log("=== STORAGE SWITCH VERIFICATION ===");

  try {
    // Import just the db module that contains our storage switch
    console.log("Importing storage instance from db.ts...");
    const { storage } = await import('./server/db.ts');
    
    // Get the current NODE_ENV
    const currentEnv = process.env.NODE_ENV || 'development';
    
    // Determine which storage implementation should be used
    const expectedType = currentEnv === 'production'
      ? 'FileSystemStorage'
      : 'MemStorage';
    
    // Log information about environment and storage type
    console.log(`Current NODE_ENV: ${currentEnv}`);
    console.log(`Expected storage type: ${expectedType}`);
    console.log(`Actual storage constructor: ${storage.constructor.name}`);
    
    // Verify the switch is working correctly
    if (storage.constructor.name.includes(expectedType)) {
      console.log(`✅ Storage switch working correctly! Using ${expectedType} in ${currentEnv} environment.`);
    } else {
      throw new Error(`Storage switch incorrect: expected ${expectedType}, got ${storage.constructor.name}`);
    }
    
  } catch (error) {
    console.error("❌ STORAGE SWITCH VERIFICATION FAILED");
    console.error(`Error: ${error.message}`);
    if (error.stack) {
      console.error(error.stack);
    }
  }
}

// Run the verification
verifyStorageSwitch();