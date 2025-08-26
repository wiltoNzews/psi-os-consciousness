/**
 * Manual Test for Date Serialization Utilities
 * 
 * This is a simple JavaScript test that directly tests the date serialization
 * utilities without using Jest's test runner, which can sometimes have issues
 * with module imports in the project environment.
 */

// Import the date serialization utilities using ES module syntax
import * as dateUtils from '../services/utils/date-serialization.js';

console.log('Starting Date Serialization Manual Test...');

// Test dateReviver
console.log('\n1. Testing dateReviver:');
const dateString = '2023-05-20T14:30:00.000Z';
const revivedDate = dateUtils.dateReviver('someKey', dateString);
console.log(`  - ISO String "${dateString}" is converted to Date:`, revivedDate instanceof Date);
console.log(`  - Revived date ISO string:`, revivedDate.toISOString());

// Test processObjectWithDates
console.log('\n2. Testing processObjectWithDates:');
const now = new Date();
const isoString = now.toISOString();
const testObj = {
  date: isoString,
  nested: {
    anotherDate: isoString
  },
  array: [isoString, 'not a date', 42]
};

console.log('  - Original object:', JSON.stringify(testObj));
const processedObj = dateUtils.processObjectWithDates(testObj);
console.log('  - processObjectWithDates results:');
console.log(`    * Top-level date is Date object:`, processedObj.date instanceof Date);
console.log(`    * Nested date is Date object:`, processedObj.nested.anotherDate instanceof Date);
console.log(`    * Array date is Date object:`, processedObj.array[0] instanceof Date);
console.log(`    * Non-date values preserved:`, 
  processedObj.array[1] === 'not a date' && 
  processedObj.array[2] === 42);

// Test deepCloneWithDates
console.log('\n3. Testing deepCloneWithDates:');
const originalWithDates = {
  date: new Date(),
  nested: {
    anotherDate: new Date(),
    data: 'test'
  },
  array: [new Date(), 'string', 42]
};

console.log('  - Original object with Date instances');
const clone = dateUtils.deepCloneWithDates(originalWithDates);
console.log('  - deepCloneWithDates results:');
console.log(`    * Is a new object (not same reference):`, clone !== originalWithDates);
console.log(`    * Top-level date is Date object:`, clone.date instanceof Date);
console.log(`    * Nested date is Date object:`, clone.nested.anotherDate instanceof Date);
console.log(`    * Array date is Date object:`, clone.array[0] instanceof Date);
console.log(`    * Date values preserved:`, 
  clone.date.getTime() === originalWithDates.date.getTime() &&
  clone.nested.anotherDate.getTime() === originalWithDates.nested.anotherDate.getTime() &&
  clone.array[0].getTime() === originalWithDates.array[0].getTime());

// Test with circular references
console.log('\n4. Testing handling of circular references:');
const circular = { prop: 'value' };
circular.self = circular;
console.log('  - Object with circular reference:');
try {
  const circularClone = dateUtils.deepCloneWithDates(circular);
  console.log(`    * Successfully handled circular reference:`, circularClone.prop === 'value');
  console.log(`    * Circular reference replaced with:`, circularClone.self);
} catch (err) {
  console.error(`    * Failed to handle circular reference:`, err);
}

// Test full serialization cycle
console.log('\n5. Testing complete serialization cycle:');
const complexObj = {
  id: 'test-1',
  created: new Date(),
  metadata: {
    updated: new Date(Date.now() + 3600000), // 1 hour later
    history: [
      { timestamp: new Date(), event: 'created' },
      { timestamp: new Date(Date.now() + 1800000), event: 'updated' } // 30 minutes later
    ]
  }
};

console.log('  - Original complex object with nested dates');
// Serialize to JSON string
const serialized = JSON.stringify(complexObj);
console.log('  - Serialized to JSON string');

// Parse with date revival
const deserialized = dateUtils.parseJsonWithDates(serialized);
console.log('  - Deserialized with date revival:');
console.log(`    * Top-level date is Date object:`, deserialized.created instanceof Date);
console.log(`    * Nested date is Date object:`, deserialized.metadata.updated instanceof Date);
console.log(`    * Array date objects:`, 
  deserialized.metadata.history[0].timestamp instanceof Date &&
  deserialized.metadata.history[1].timestamp instanceof Date);

// Serialize again
const serializedAgain = JSON.stringify(deserialized);
// Deserialize again
const deserializedAgain = dateUtils.parseJsonWithDates(serializedAgain);
console.log('  - Second round of serialization/deserialization:');
console.log(`    * Dates still preserved after multiple cycles:`,
  deserializedAgain.created instanceof Date &&
  deserializedAgain.metadata.updated instanceof Date &&
  deserializedAgain.metadata.history[0].timestamp instanceof Date &&
  deserializedAgain.metadata.history[1].timestamp instanceof Date);

console.log('\nDate Serialization Manual Test Complete!');