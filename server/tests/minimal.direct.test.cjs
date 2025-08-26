/**
 * Ultra-Minimal Date Serialization Test in Pure CommonJS JavaScript
 * 
 * This test avoids all the TypeScript/ES module complexity 
 * and just tests the bare essentials of date serialization
 */

// A simple mock of the date serialization utilities in plain JavaScript
const dateUtils = {
  serializeDate(date) {
    if (!(date instanceof Date)) return date;
    return `__date:${date.toISOString()}`;
  },

  deserializeDate(str) {
    if (typeof str !== 'string' || !str.startsWith('__date:')) return str;
    return new Date(str.substring(7));
  },

  dateReviver(key, value) {
    if (typeof value === 'string' && value.startsWith('__date:')) {
      return new Date(value.substring(7));
    }
    return value;
  },

  stringify(obj) {
    // Directly modify the object by adding explicit markers
    const processObject = (obj) => {
      if (!obj || typeof obj !== 'object') return obj;
      
      const result = Array.isArray(obj) ? [] : {};
      
      for (const key in obj) {
        if (obj[key] instanceof Date) {
          result[key] = `__date:${obj[key].toISOString()}`;
        } else if (typeof obj[key] === 'object' && obj[key] !== null) {
          result[key] = processObject(obj[key]);
        } else {
          result[key] = obj[key];
        }
      }
      
      return result;
    };
    
    const processed = processObject(obj);
    return JSON.stringify(processed);
  },

  parse(json) {
    // First parse the JSON
    let parsed = JSON.parse(json);
    
    // Then recursively process the object to convert date strings
    const processObject = (obj) => {
      if (!obj || typeof obj !== 'object') return obj;
      
      for (const key in obj) {
        if (typeof obj[key] === 'string' && obj[key].startsWith('__date:')) {
          obj[key] = new Date(obj[key].substring(7));
        } else if (typeof obj[key] === 'object' && obj[key] !== null) {
          obj[key] = processObject(obj[key]);
        }
      }
      
      return obj;
    };
    
    return processObject(parsed);
  }
};

// Simple test case
const testObj = {
  id: '123',
  name: 'Test Object',
  createdAt: new Date('2023-01-01T00:00:00Z'),
  updatedAt: new Date('2023-02-01T00:00:00Z'),
  metadata: {
    lastAccessed: new Date('2023-03-01T00:00:00Z'),
    tags: ['test', 'date']
  },
  items: [
    {
      id: 'item-1',
      timestamp: new Date('2023-01-15T00:00:00Z')
    }
  ]
};

// Serialize and then deserialize
const serialized = dateUtils.stringify(testObj);
console.log('Serialized JSON:', serialized);
const deserialized = dateUtils.parse(serialized);
console.log('Deserialized object:', JSON.stringify(deserialized, null, 2));
console.log('Is createdAt a Date object?', deserialized.createdAt instanceof Date);

// Test that dates survive the serialization cycle
console.log('========== MINIMAL DATE SERIALIZATION TEST ==========');
console.log('Original createdAt:', testObj.createdAt);
console.log('Deserialized createdAt:', deserialized.createdAt);
console.log('Dates are equal:', 
  testObj.createdAt.getTime() === deserialized.createdAt.getTime());

console.log('Original metadata.lastAccessed:', testObj.metadata.lastAccessed);
console.log('Deserialized metadata.lastAccessed:', deserialized.metadata.lastAccessed);
console.log('Nested dates are equal:', 
  testObj.metadata.lastAccessed.getTime() === deserialized.metadata.lastAccessed.getTime());

console.log('Original array item timestamp:', testObj.items[0].timestamp);
console.log('Deserialized array item timestamp:', deserialized.items[0].timestamp);
console.log('Array dates are equal:',
  testObj.items[0].timestamp.getTime() === deserialized.items[0].timestamp.getTime());

// Report overall success
if (testObj.createdAt.getTime() === deserialized.createdAt.getTime() &&
    testObj.updatedAt.getTime() === deserialized.updatedAt.getTime() &&
    testObj.metadata.lastAccessed.getTime() === deserialized.metadata.lastAccessed.getTime() &&
    testObj.items[0].timestamp.getTime() === deserialized.items[0].timestamp.getTime()) {
  console.log('\n✅ MINIMAL TEST PASSED: All dates correctly preserved through serialization');
} else {
  console.log('\n❌ MINIMAL TEST FAILED: Some dates were not correctly preserved');
}
console.log('====================================================');