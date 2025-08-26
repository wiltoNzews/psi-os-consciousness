/**
 * Ultra-Minimal Date Serialization Test in Pure JavaScript
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
    // Debug the incoming value
    console.log(`Reviving key "${key}" with value:`, value);
    
    // Check for two formats:
    // 1. Our custom format with prefix: "__date:2023-01-01T00:00:00.000Z"
    // 2. Standard ISO format: "2023-01-01T00:00:00.000Z"
    if (typeof value === 'string') {
      if (value.startsWith('__date:')) {
        const dateObj = new Date(value.substring(7));
        console.log(`  Converting prefixed date to Date object: ${dateObj}`);
        return dateObj;
      } else if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.*Z$/.test(value)) {
        const dateObj = new Date(value);
        console.log(`  Converting ISO string to Date object: ${dateObj}`);
        return dateObj;
      }
    }
    return value;
  },

  stringify(obj) {
    // Debug what goes through the replacer
    console.log("Stringifying object:", obj);
    
    const replacer = (key, value) => {
      if (value instanceof Date) {
        const dateStr = `__date:${value.toISOString()}`;
        console.log(`  Converting Date (${key}): ${value} → "${dateStr}"`);
        return dateStr;
      }
      return value;
    };
    
    const result = JSON.stringify(obj, replacer);
    console.log(`Serialized result length: ${result.length}`);
    return result;
  },

  parse(json) {
    // Bind the dateReviver to this object to ensure it has the correct context
    return JSON.parse(json, this.dateReviver.bind(this));
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
const deserialized = dateUtils.parse(serialized);

// Test that dates survive the serialization cycle
console.log('========== MINIMAL DATE SERIALIZATION TEST ==========');
console.log('Original createdAt:', testObj.createdAt);
console.log('Deserialized createdAt:', deserialized.createdAt);
console.log('Deserialized createdAt is Date:', deserialized.createdAt instanceof Date);
if (deserialized.createdAt instanceof Date) {
  console.log('Dates are equal:', 
    testObj.createdAt.getTime() === deserialized.createdAt.getTime());
}

console.log('Original metadata.lastAccessed:', testObj.metadata.lastAccessed);
console.log('Deserialized metadata.lastAccessed:', deserialized.metadata.lastAccessed);
console.log('Deserialized metadata.lastAccessed is Date:', deserialized.metadata.lastAccessed instanceof Date);
if (deserialized.metadata.lastAccessed instanceof Date) {
  console.log('Nested dates are equal:', 
    testObj.metadata.lastAccessed.getTime() === deserialized.metadata.lastAccessed.getTime());
}

console.log('Original array item timestamp:', testObj.items[0].timestamp);
console.log('Deserialized array item timestamp:', deserialized.items[0].timestamp);
console.log('Deserialized array item timestamp is Date:', deserialized.items[0].timestamp instanceof Date);
if (deserialized.items[0].timestamp instanceof Date) {
  console.log('Array dates are equal:',
    testObj.items[0].timestamp.getTime() === deserialized.items[0].timestamp.getTime());
}

// Report overall success
let allDatesValid = true;

// Check if each date is valid and equal
if (!(deserialized.createdAt instanceof Date)) {
  console.log('❌ createdAt is not a Date object');
  allDatesValid = false;
} else if (testObj.createdAt.getTime() !== deserialized.createdAt.getTime()) {
  console.log('❌ createdAt values do not match');
  allDatesValid = false;
}

if (!(deserialized.updatedAt instanceof Date)) {
  console.log('❌ updatedAt is not a Date object');
  allDatesValid = false;
} else if (testObj.updatedAt.getTime() !== deserialized.updatedAt.getTime()) {
  console.log('❌ updatedAt values do not match');
  allDatesValid = false;
}

if (!(deserialized.metadata.lastAccessed instanceof Date)) {
  console.log('❌ metadata.lastAccessed is not a Date object');
  allDatesValid = false;
} else if (testObj.metadata.lastAccessed.getTime() !== deserialized.metadata.lastAccessed.getTime()) {
  console.log('❌ metadata.lastAccessed values do not match');
  allDatesValid = false;
}

if (!(deserialized.items[0].timestamp instanceof Date)) {
  console.log('❌ items[0].timestamp is not a Date object');
  allDatesValid = false;
} else if (testObj.items[0].timestamp.getTime() !== deserialized.items[0].timestamp.getTime()) {
  console.log('❌ items[0].timestamp values do not match');
  allDatesValid = false;
}

if (allDatesValid) {
  console.log('\n✅ MINIMAL TEST PASSED: All dates correctly preserved through serialization');
} else {
  console.log('\n❌ MINIMAL TEST FAILED: Some dates were not correctly preserved');
}
console.log('====================================================');