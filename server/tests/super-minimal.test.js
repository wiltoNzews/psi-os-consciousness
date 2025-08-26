/**
 * Super-Minimal Date Serialization Test
 * 
 * This is the simplest possible test to demonstrate date serialization.
 * It avoids all complex dependencies and TypeScript transformations.
 */

describe('Super-Minimal Date Serialization Test', () => {
  // Date reviver function for JSON parsing
  function dateReviver(key, value) {
    // ISO date pattern
    const datePattern = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z$/;
    
    // If value is a string and matches ISO date pattern, convert to Date
    if (typeof value === 'string' && datePattern.test(value)) {
      return new Date(value);
    }
    return value;
  }
  
  it('should preserve Date objects through serialization and deserialization', () => {
    console.log('Starting date serialization test at:', new Date().toISOString());
    
    // Test data with nested date objects
    const originalData = {
      id: 'test-1',
      name: 'Test Object',
      createdAt: new Date('2025-01-01T00:00:00.000Z'),
      metadata: {
        lastUpdated: new Date('2025-01-02T00:00:00.000Z'),
        revisions: [
          {
            timestamp: new Date('2025-01-03T00:00:00.000Z'),
            changes: ['Added field x', 'Modified field y']
          }
        ]
      }
    };
    
    // Serialize to JSON string
    const serialized = JSON.stringify(originalData);
    console.log('Data serialized');
    
    // Deserialize back to object with date revival
    const deserialized = JSON.parse(serialized, dateReviver);
    console.log('Data deserialized');
    
    // Top-level date check
    expect(deserialized.createdAt instanceof Date).toBeTruthy();
    expect(deserialized.createdAt.toISOString()).toBe('2025-01-01T00:00:00.000Z');
    
    // Nested date check
    expect(deserialized.metadata.lastUpdated instanceof Date).toBeTruthy();
    expect(deserialized.metadata.lastUpdated.toISOString()).toBe('2025-01-02T00:00:00.000Z');
    
    // Deeply nested date in array check
    expect(deserialized.metadata.revisions[0].timestamp instanceof Date).toBeTruthy();
    expect(deserialized.metadata.revisions[0].timestamp.toISOString()).toBe('2025-01-03T00:00:00.000Z');
    
    console.log('All date assertions passed');
  });
  
  it('should handle complex objects with multiple dates and arrays', () => {
    console.log('Starting complex object test at:', new Date().toISOString());
    
    // More complex test object with arrays of dates
    const complexObject = {
      session: 'test-session',
      timeline: [
        new Date('2025-01-01T10:00:00.000Z'),
        new Date('2025-01-01T11:00:00.000Z'),
        new Date('2025-01-01T12:00:00.000Z')
      ],
      events: [
        { id: 'e1', timestamp: new Date('2025-01-01T10:30:00.000Z'), type: 'start' },
        { id: 'e2', timestamp: new Date('2025-01-01T11:30:00.000Z'), type: 'progress' },
        { id: 'e3', timestamp: new Date('2025-01-01T12:30:00.000Z'), type: 'complete' }
      ],
      nestedArrays: [
        [
          { date: new Date('2025-01-02T00:00:00.000Z') },
          { date: new Date('2025-01-03T00:00:00.000Z') }
        ],
        [
          { date: new Date('2025-01-04T00:00:00.000Z') },
          { date: new Date('2025-01-05T00:00:00.000Z') }
        ]
      ]
    };
    
    // Perform serialization cycle
    const serialized = JSON.stringify(complexObject);
    const deserialized = JSON.parse(serialized, dateReviver);
    
    // Check array of dates
    expect(deserialized.timeline.length).toBe(3);
    deserialized.timeline.forEach((date, index) => {
      expect(date instanceof Date).toBeTruthy();
    });
    
    // Check array of objects with dates
    expect(deserialized.events.length).toBe(3);
    deserialized.events.forEach(event => {
      expect(event.timestamp instanceof Date).toBeTruthy();
    });
    
    // Check nested arrays with dates
    expect(deserialized.nestedArrays[0][0].date instanceof Date).toBeTruthy();
    expect(deserialized.nestedArrays[0][1].date instanceof Date).toBeTruthy();
    expect(deserialized.nestedArrays[1][0].date instanceof Date).toBeTruthy();
    expect(deserialized.nestedArrays[1][1].date instanceof Date).toBeTruthy();
    
    console.log('All complex object assertions passed');
  });
});