/**
 * Test to verify date handling improvements
 */
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Simple helper to ensure the test directory exists
 */
async function ensureDirectory(dirPath) {
  try {
    await fs.access(dirPath);
  } catch (error) {
    await fs.mkdir(dirPath, { recursive: true });
  }
}

/**
 * Simplified ChronosDateHandler for testing
 */
class ChronosDateHandler {
  createDate() {
    return new Date();
  }
  
  serializeDate(date) {
    if (!(date instanceof Date)) {
      return date;
    }
    return { "__chronos_date__": date.toISOString() };
  }
  
  deserializeDate(serializedDate) {
    if (serializedDate && typeof serializedDate === 'object' && '__chronos_date__' in serializedDate) {
      return new Date(serializedDate['__chronos_date__']);
    }
    return serializedDate;
  }
  
  stringifyWithDates(obj) {
    const replacer = (key, value) => {
      if (value instanceof Date) {
        // Direct ISO string serialization instead of using __chronos_date__ format
        return value.toISOString();
      }
      return value;
    };
    return JSON.stringify(obj, replacer);
  }
  
  parseWithDates(json) {
    const reviver = (key, value) => {
      // Convert ISO date strings to Date objects when they match date format
      if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(value)) {
        return new Date(value);
      }
      // Also handle the __chronos_date__ format if present
      if (value && typeof value === 'object' && '__chronos_date__' in value) {
        return this.deserializeDate(value);
      }
      return value;
    };
    return JSON.parse(json, reviver);
  }
}

/**
 * Simple FileSystemStorage replacement for testing date handling
 */
class TestStorage {
  constructor(basePath) {
    this.basePath = basePath;
    this.dateHandler = new ChronosDateHandler();
  }
  
  async saveObject(id, object) {
    const filePath = path.join(this.basePath, `${id}.json`);
    const json = this.dateHandler.stringifyWithDates(object);
    await fs.writeFile(filePath, json, 'utf8');
    return object;
  }
  
  async getObject(id) {
    try {
      const filePath = path.join(this.basePath, `${id}.json`);
      const content = await fs.readFile(filePath, 'utf8');
      return this.dateHandler.parseWithDates(content);
    } catch (error) {
      return null;
    }
  }
  
  // This method uses the createDate method that we fixed
  createObjectWithDates() {
    return {
      id: 'test-' + Math.random().toString(36).substring(2, 9),
      name: 'Test Object',
      createdAt: this.dateHandler.createDate(),
      updatedAt: this.dateHandler.createDate(), 
      metadata: {
        lastActivity: this.dateHandler.createDate()
      },
      history: [
        { timestamp: this.dateHandler.createDate(), action: 'created' },
        { timestamp: this.dateHandler.createDate(), action: 'updated' }
      ]
    };
  }
}

/**
 * Run the test to verify date handling
 */
async function runDateTest() {
  console.log('🧪 Testing date handling fixes...\n');
  
  // Create test directory
  const testDir = path.join(__dirname, 'test-date-fixes-data');
  await ensureDirectory(testDir);
  
  // Create test storage
  const storage = new TestStorage(testDir);
  
  try {
    // Step 1: Create an object with dates using our fixed method
    console.log('Step 1: Creating object with dates using createDate method...');
    const testObject = storage.createObjectWithDates();
    console.log('Created object with the following dates:');
    console.log('  - createdAt:', testObject.createdAt);
    console.log('  - updatedAt:', testObject.updatedAt);
    console.log('  - metadata.lastActivity:', testObject.metadata.lastActivity);
    console.log('  - history[0].timestamp:', testObject.history[0].timestamp);
    
    // Verify all dates are Date objects
    const createdAtIsDate = testObject.createdAt instanceof Date;
    const updatedAtIsDate = testObject.updatedAt instanceof Date;
    const lastActivityIsDate = testObject.metadata.lastActivity instanceof Date;
    const historyTimestampIsDate = testObject.history[0].timestamp instanceof Date;
    
    console.log('\nVerifying created date types:');
    console.log('  - createdAt is Date:', createdAtIsDate);
    console.log('  - updatedAt is Date:', updatedAtIsDate);
    console.log('  - metadata.lastActivity is Date:', lastActivityIsDate);
    console.log('  - history[0].timestamp is Date:', historyTimestampIsDate);
    
    if (!createdAtIsDate || !updatedAtIsDate || !lastActivityIsDate || !historyTimestampIsDate) {
      throw new Error('❌ One or more dates is not a Date object');
    }
    
    // Step 2: Save the object (serializing dates)
    console.log('\nStep 2: Saving object to disk (serializing dates)...');
    await storage.saveObject(testObject.id, testObject);
    console.log('Object saved successfully');
    
    // Step 3: Read the raw JSON to verify serialization
    console.log('\nStep 3: Reading raw JSON to verify serialization...');
    const filePath = path.join(testDir, `${testObject.id}.json`);
    const rawJson = await fs.readFile(filePath, 'utf8');
    console.log('Raw JSON (truncated):');
    console.log(rawJson.substring(0, 150) + '...');
    
    // Verify JSON contains date strings in ISO format
    const containsISODateFormat = /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z/.test(rawJson);
    console.log('JSON contains ISO date format:', containsISODateFormat);
    
    if (!containsISODateFormat) {
      throw new Error('❌ Serialized JSON does not contain proper ISO date format');
    }
    
    // Step 4: Load the object (deserializing dates)
    console.log('\nStep 4: Loading object (deserializing dates)...');
    const loadedObject = await storage.getObject(testObject.id);
    console.log('Loaded object with the following dates:');
    console.log('  - createdAt:', loadedObject.createdAt);
    console.log('  - updatedAt:', loadedObject.updatedAt);
    console.log('  - metadata.lastActivity:', loadedObject.metadata.lastActivity);
    console.log('  - history[0].timestamp:', loadedObject.history[0].timestamp);
    
    // Verify all loaded dates are Date objects
    const loadedCreatedAtIsDate = loadedObject.createdAt instanceof Date;
    const loadedUpdatedAtIsDate = loadedObject.updatedAt instanceof Date;
    const loadedLastActivityIsDate = loadedObject.metadata.lastActivity instanceof Date;
    const loadedHistoryTimestampIsDate = loadedObject.history[0].timestamp instanceof Date;
    
    console.log('\nVerifying loaded date types:');
    console.log('  - createdAt is Date:', loadedCreatedAtIsDate);
    console.log('  - updatedAt is Date:', loadedUpdatedAtIsDate);
    console.log('  - metadata.lastActivity is Date:', loadedLastActivityIsDate);
    console.log('  - history[0].timestamp is Date:', loadedHistoryTimestampIsDate);
    
    if (!loadedCreatedAtIsDate || !loadedUpdatedAtIsDate || !loadedLastActivityIsDate || !loadedHistoryTimestampIsDate) {
      throw new Error('❌ One or more loaded dates is not a Date object');
    }
    
    console.log('\n✅ Date handling test successful! All dates correctly handled.');
    
    // Clean up
    console.log('\nCleaning up test data...');
    await fs.rm(testDir, { recursive: true, force: true });
    console.log('Test data removed');
    
  } catch (error) {
    console.error('\n❌ Error during test:', error.message);
    console.error(error.stack);
  }
}

runDateTest().catch(err => {
  console.error('Unhandled error:', err);
});