/**
 * Ultra-Super-Minimal Test with Persistence-like Operations
 * 
 * This test is designed to be as minimal as possible while still mimicking the core pattern
 * of the persistence layer operations but in pure JavaScript with no TypeScript transformations.
 */

class UltraMinimalStore {
  constructor() {
    this.storage = new Map();
  }

  async save(key, data) {
    console.log('Save operation started:', Date.now());
    // Convert dates to ISO strings before serializing
    const serialized = JSON.stringify(data, (k, v) => {
      if (v instanceof Date) {
        return v.toISOString();
      }
      return v;
    });
    this.storage.set(key, serialized);
    console.log('Save operation completed:', Date.now());
    return Promise.resolve();
  }

  async load(key) {
    console.log('Load operation started:', Date.now());
    const data = this.storage.get(key);
    if (!data) return null;
    
    // Parse JSON and convert ISO date strings back to Date objects
    const parsed = JSON.parse(data, this.reviveDates);
    console.log('Load operation completed:', Date.now());
    return Promise.resolve(parsed);
  }

  reviveDates(key, value) {
    // ISO date pattern
    const datePattern = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z$/;
    
    // If value is a string and matches ISO date pattern, convert to Date
    if (typeof value === 'string' && datePattern.test(value)) {
      return new Date(value);
    }
    return value;
  }
}

describe('Ultra Super Minimal Persistence Test', () => {
  it('should save and load data with dates properly', (done) => {
    console.log('Test starting timestamp:', Date.now());
    
    // Create test store
    const store = new UltraMinimalStore();
    
    // Create test data with Date objects
    const testData = {
      id: 'test-123',
      name: 'Ultra Minimal Test',
      createdAt: new Date('2025-01-01T12:00:00.000Z'),
      metadata: {
        nestedDate: new Date('2025-01-02T12:00:00.000Z')
      }
    };
    
    // Execute async operations in sequence
    console.log('Starting async operations');
    
    // Use Promise chain for clear control flow
    store.save('test-key', testData)
      .then(() => {
        console.log('After save, before load:', Date.now());
        return store.load('test-key');
      })
      .then((loadedData) => {
        console.log('Loaded data successfully:', Date.now());
        
        // Log detailed information about the loaded data
        console.log('Loaded data structure:', JSON.stringify(loadedData, null, 2));
        console.log('createdAt is Date?', loadedData.createdAt instanceof Date);
        console.log('createdAt value:', loadedData.createdAt);
        console.log('nestedDate is Date?', loadedData.metadata.nestedDate instanceof Date);
        console.log('nestedDate value:', loadedData.metadata.nestedDate);
        
        // Basic assertions
        expect(loadedData).not.toBeNull();
        expect(loadedData.id).toBe(testData.id);
        expect(loadedData.name).toBe(testData.name);
        
        // Date assertions
        expect(loadedData.createdAt).toBeInstanceOf(Date);
        expect(loadedData.createdAt.toISOString()).toBe('2025-01-01T12:00:00.000Z');
        expect(loadedData.metadata.nestedDate).toBeInstanceOf(Date);
        expect(loadedData.metadata.nestedDate.toISOString()).toBe('2025-01-02T12:00:00.000Z');
        
        console.log('Test completed:', Date.now());
        done(); // Signal test completion
      })
      .catch(error => {
        console.error('Test failed with error:', error);
        done(error); // Signal test failure
      });
  });
});