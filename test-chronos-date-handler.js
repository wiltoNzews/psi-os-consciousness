/**
 * Simple test script for the Chronos Date Handler
 * This script tests the date serialization/deserialization functions
 */
import { 
  serializeDate, 
  deserializeDate, 
  dateReplacer,
  dateReviver,
  stringifyWithDates,
  parseWithDates,
  isSerializedDate,
  ensureDatesInObject,
  processDatesInObject,
  datesAreEqual,
  formatDateISO
} from './server/services/utils/chronos-date-handler.js';

// Test data
const testDate = new Date('2023-05-15T10:30:00.000Z');
const testObj = {
  id: '123',
  name: 'Test Object',
  createdAt: testDate,
  updatedAt: new Date('2023-06-20T14:45:00.000Z'),
  metadata: {
    importantDate: new Date('2023-07-10T08:15:00.000Z'),
    tags: ['tag1', 'tag2'],
    nested: {
      nestedDate: new Date('2023-08-05T16:20:00.000Z')
    }
  },
  dates: [
    new Date('2023-01-01T00:00:00.000Z'),
    new Date('2023-02-01T00:00:00.000Z'),
    new Date('2023-03-01T00:00:00.000Z')
  ]
};

console.log('🧪 Testing Chronos Date Handler:');

// Test serializeDate and deserializeDate
console.log('\n1️⃣ Testing serializeDate and deserializeDate:');
const serializedDate = serializeDate(testDate);
console.log('Serialized date:', serializedDate);
const deserializedDate = deserializeDate(serializedDate);
console.log('Deserialized date:', deserializedDate);
console.log('Original equals deserialized:', datesAreEqual(testDate, deserializedDate));

// Test stringifyWithDates and parseWithDates
console.log('\n2️⃣ Testing stringifyWithDates and parseWithDates:');
const jsonString = stringifyWithDates(testObj);
console.log('JSON string (truncated):', jsonString.substring(0, 100) + '...');
const parsedObj = parseWithDates(jsonString);
console.log('First-level date correctness:', parsedObj.createdAt instanceof Date);
console.log('Nested date correctness:', parsedObj.metadata.nested.nestedDate instanceof Date);
console.log('Array date correctness:', parsedObj.dates[0] instanceof Date);

// Test date integrity
console.log('\n3️⃣ Testing date integrity:');
console.log('Original createdAt:', testObj.createdAt.toISOString());
console.log('Parsed createdAt:', parsedObj.createdAt.toISOString());
console.log('Original nested date:', testObj.metadata.nested.nestedDate.toISOString());
console.log('Parsed nested date:', parsedObj.metadata.nested.nestedDate.toISOString());
console.log('Original array date:', testObj.dates[0].toISOString());
console.log('Parsed array date type:', typeof parsedObj.dates[0]);
console.log('Parsed array date value:', parsedObj.dates[0]);

// Test isSerializedDate
console.log('\n4️⃣ Testing isSerializedDate:');
console.log('Valid serialized date:', isSerializedDate(serializedDate));
console.log('Invalid object:', isSerializedDate({ foo: 'bar' }));
console.log('Plain date:', isSerializedDate(new Date()));

// Run all tests
console.log('\n✅ All tests completed');