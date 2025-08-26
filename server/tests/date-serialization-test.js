/**
 * Test harness for date-serialization.js utilities
 * 
 * This file validates that the date serialization utilities work
 * properly in a simple JavaScript context.
 */

import {
  serializeDate,
  deserializeDate,
  stringifyWithDates,
  parseWithDates,
  serializeDatesInObject,
  deserializeDatesInObject
} from '../services/utils/date-serialization.js';

// Test data with nested dates
const testData = {
  id: 'test-123',
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

console.log('========== DATE SERIALIZATION TEST ==========');

// Test 1: Simple date serialization/deserialization
const serializedDate = serializeDate(testData.createdAt);
console.log('Serialized date:', serializedDate);
const deserializedDate = deserializeDate(serializedDate);
console.log('Deserialized date:', deserializedDate);
console.log('Is Date object?', deserializedDate instanceof Date);
console.log('Original equals deserialized?', testData.createdAt.getTime() === deserializedDate.getTime());

// Test 2: JSON serialization with dates
const jsonString = stringifyWithDates(testData);
console.log('\nJSON with dates:', jsonString);
const parsedObject = parseWithDates(jsonString);
console.log('\nParsed object:', JSON.stringify(parsedObject, null, 2));
console.log('createdAt is Date?', parsedObject.createdAt instanceof Date);
console.log('metadata.lastAccessed is Date?', parsedObject.metadata.lastAccessed instanceof Date);
console.log('items[0].timestamp is Date?', parsedObject.items[0].timestamp instanceof Date);

// Test 3: Object serialization
const serializedObject = serializeDatesInObject(testData);
console.log('\nSerialized object:', JSON.stringify(serializedObject, null, 2));
const deserializedObject = deserializeDatesInObject(JSON.parse(JSON.stringify(serializedObject)));
console.log('\nDeserialized object:', JSON.stringify(deserializedObject, null, 2));
console.log('createdAt is Date?', deserializedObject.createdAt instanceof Date);
console.log('metadata.lastAccessed is Date?', deserializedObject.metadata.lastAccessed instanceof Date);
console.log('items[0].timestamp is Date?', deserializedObject.items[0].timestamp instanceof Date);

console.log('=============================================');