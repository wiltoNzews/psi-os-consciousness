/**
 * Test script for ChronosDateHandler
 * 
 * This script directly tests the various date handling functions provided by
 * the ChronosDateHandler utility to ensure proper date serialization/deserialization
 * across system boundaries.
 * 
 * It applies the TSAR BOMBA verification approach with explicit testing
 * for each function and boundary case.
 */

import ChronosDateHandler, { 
  SERIALIZED_DATE_KEY,
  serializeDate, 
  deserializeDate,
  dateReplacer,
  dateReviver,
  stringifyWithDates,
  parseWithDates,
  isSerializedDate,
  processDatesInObject,
  ensureDatesInObject,
  datesAreEqual,
  formatDateISO
} from '../services/utils/chronos-date-handler.js';

/**
 * Run direct verification of the ChronosDateHandler
 */
async function runVerification() {
  console.log('--- ChronosDateHandler Verification ---');

  testSerializationDeserialization();
  testReplacerReviver();
  testStringifyParse();
  testIsSerializedDate();
  testProcessDatesInObject();
  testEnsureDatesInObject();
  testDatesAreEqual();
  testFormatDateISO();
  testNestedObjectsWithDates();
  testArraysWithDates();

  console.log('--- ChronosDateHandler Verification Complete ---');
}

/**
 * Test the basic serializeDate and deserializeDate functions
 */
function testSerializationDeserialization() {
  console.log('\nTesting serializeDate and deserializeDate...');
  
  const testDate = new Date('2023-05-15T12:30:45.123Z');
  const serialized = serializeDate(testDate);
  
  console.log('Original date:', testDate);
  console.log('Serialized date:', serialized);
  
  // Verify the serialized format
  if (typeof serialized !== 'object' || !serialized[SERIALIZED_DATE_KEY]) {
    console.error('FAIL: Serialized date does not have the expected format');
    return;
  }
  
  const deserialized = deserializeDate(serialized);
  console.log('Deserialized date:', deserialized);
  
  // Verify that the deserialized date matches the original
  if (testDate.getTime() !== deserialized.getTime()) {
    console.error('FAIL: Deserialized date does not match original');
    console.error('Original timestamp:', testDate.getTime());
    console.error('Deserialized timestamp:', deserialized.getTime());
    return;
  }
  
  console.log('PASS: serializeDate and deserializeDate work correctly');
}

/**
 * Test the JSON replacer and reviver functions
 */
function testReplacerReviver() {
  console.log('\nTesting dateReplacer and dateReviver...');
  
  const testDate = new Date('2023-05-15T12:30:45.123Z');
  const replaced = dateReplacer('testDate', testDate);
  
  console.log('Original date:', testDate);
  console.log('Replaced value:', replaced);
  
  // Verify the replaced format
  if (typeof replaced !== 'object' || !replaced[SERIALIZED_DATE_KEY]) {
    console.error('FAIL: Replaced date does not have the expected format');
    return;
  }
  
  const revived = dateReviver('testDate', replaced);
  console.log('Revived date:', revived);
  
  // Verify that the revived date matches the original
  if (testDate.getTime() !== revived.getTime()) {
    console.error('FAIL: Revived date does not match original');
    console.error('Original timestamp:', testDate.getTime());
    console.error('Revived timestamp:', revived.getTime());
    return;
  }
  
  console.log('PASS: dateReplacer and dateReviver work correctly');
}

/**
 * Test stringifyWithDates and parseWithDates
 */
function testStringifyParse() {
  console.log('\nTesting stringifyWithDates and parseWithDates...');
  
  const testObject = {
    id: 123,
    name: 'Test Object',
    createdAt: new Date('2023-05-15T12:30:45.123Z'),
    updatedAt: new Date('2023-05-16T09:15:30.456Z')
  };
  
  const jsonString = stringifyWithDates(testObject);
  console.log('Object with dates:', testObject);
  console.log('JSON string:', jsonString);
  
  // Verify that the JSON string contains the serialized date format
  if (!jsonString.includes(SERIALIZED_DATE_KEY)) {
    console.error('FAIL: JSON string does not contain serialized date key');
    return;
  }
  
  const parsedObject = parseWithDates(jsonString);
  console.log('Parsed object:', parsedObject);
  
  // Verify that the parsed object has Date instances
  if (!(parsedObject.createdAt instanceof Date) || !(parsedObject.updatedAt instanceof Date)) {
    console.error('FAIL: Parsed object does not contain Date instances');
    return;
  }
  
  // Verify that the dates match the original
  if (testObject.createdAt.getTime() !== parsedObject.createdAt.getTime() ||
      testObject.updatedAt.getTime() !== parsedObject.updatedAt.getTime()) {
    console.error('FAIL: Parsed dates do not match original dates');
    return;
  }
  
  console.log('PASS: stringifyWithDates and parseWithDates work correctly');
}

/**
 * Test isSerializedDate function
 */
function testIsSerializedDate() {
  console.log('\nTesting isSerializedDate...');
  
  const testDate = new Date('2023-05-15T12:30:45.123Z');
  const serialized = serializeDate(testDate);
  const nonSerializedObject = { foo: 'bar' };
  const primitiveValue = 123;
  
  // Test with a serialized date
  if (!isSerializedDate(serialized)) {
    console.error('FAIL: isSerializedDate did not recognize a serialized date');
    return;
  }
  
  // Test with a non-serialized object
  if (isSerializedDate(nonSerializedObject)) {
    console.error('FAIL: isSerializedDate incorrectly identified a non-serialized object as a serialized date');
    return;
  }
  
  // Test with a primitive value
  if (isSerializedDate(primitiveValue)) {
    console.error('FAIL: isSerializedDate incorrectly identified a primitive value as a serialized date');
    return;
  }
  
  console.log('PASS: isSerializedDate works correctly');
}

/**
 * Test processDatesInObject function
 */
function testProcessDatesInObject() {
  console.log('\nTesting processDatesInObject...');
  
  const testDate = new Date('2023-05-15T12:30:45.123Z');
  const serialized = serializeDate(testDate);
  
  const testObject = {
    id: 123,
    name: 'Test Object',
    createdAt: serialized,
    metadata: {
      lastChecked: serialized
    },
    tags: ['test', 'dates']
  };
  
  const processed = processDatesInObject(testObject);
  console.log('Original object:', JSON.stringify(testObject, null, 2));
  console.log('Processed object:', processed);
  
  // Verify that the serialized dates have been converted to Date instances
  if (!(processed.createdAt instanceof Date) || !(processed.metadata.lastChecked instanceof Date)) {
    console.error('FAIL: processDatesInObject did not convert serialized dates to Date instances');
    return;
  }
  
  // Verify that the dates match the original
  if (testDate.getTime() !== processed.createdAt.getTime() ||
      testDate.getTime() !== processed.metadata.lastChecked.getTime()) {
    console.error('FAIL: Processed dates do not match original dates');
    return;
  }
  
  console.log('PASS: processDatesInObject works correctly');
}

/**
 * Test ensureDatesInObject function
 */
function testEnsureDatesInObject() {
  console.log('\nTesting ensureDatesInObject...');
  
  const testObject = {
    id: 123,
    name: 'Test Object',
    createdAt: '2023-05-15T12:30:45.123Z',
    metadata: {
      lastChecked: '2023-05-16T09:15:30.456Z'
    },
    tags: ['test', 'dates']
  };
  
  const processed = ensureDatesInObject(testObject);
  console.log('Original object:', JSON.stringify(testObject, null, 2));
  console.log('Processed object:', processed);
  
  // Verify that the ISO strings have been converted to Date instances
  if (!(processed.createdAt instanceof Date) || !(processed.metadata.lastChecked instanceof Date)) {
    console.error('FAIL: ensureDatesInObject did not convert ISO strings to Date instances');
    return;
  }
  
  // Verify that the dates match the original strings
  if (new Date(testObject.createdAt).getTime() !== processed.createdAt.getTime() ||
      new Date(testObject.metadata.lastChecked).getTime() !== processed.metadata.lastChecked.getTime()) {
    console.error('FAIL: Processed dates do not match original date strings');
    return;
  }
  
  console.log('PASS: ensureDatesInObject works correctly');
}

/**
 * Test datesAreEqual function
 */
function testDatesAreEqual() {
  console.log('\nTesting datesAreEqual...');
  
  const date1 = new Date('2023-05-15T12:30:45.123Z');
  const date2 = new Date('2023-05-15T12:30:45.123Z');
  const date3 = new Date('2023-05-16T09:15:30.456Z');
  
  // Test with equal dates
  if (!datesAreEqual(date1, date2)) {
    console.error('FAIL: datesAreEqual did not recognize equal dates');
    return;
  }
  
  // Test with different dates
  if (datesAreEqual(date1, date3)) {
    console.error('FAIL: datesAreEqual incorrectly identified different dates as equal');
    return;
  }
  
  console.log('PASS: datesAreEqual works correctly');
}

/**
 * Test formatDateISO function
 */
function testFormatDateISO() {
  console.log('\nTesting formatDateISO...');
  
  const testDate = new Date('2023-05-15T12:30:45.123Z');
  const formatted = formatDateISO(testDate);
  
  console.log('Original date:', testDate);
  console.log('Formatted date:', formatted);
  
  // Verify that the formatted string is correct
  if (formatted !== testDate.toISOString()) {
    console.error('FAIL: formatDateISO did not produce the expected ISO string');
    return;
  }
  
  console.log('PASS: formatDateISO works correctly');
}

/**
 * Test handling of nested objects with dates
 */
function testNestedObjectsWithDates() {
  console.log('\nTesting nested objects with dates...');
  
  const testObject = {
    id: 123,
    name: 'Test Object',
    createdAt: new Date('2023-05-15T12:30:45.123Z'),
    metadata: {
      lastChecked: new Date('2023-05-16T09:15:30.456Z'),
      history: {
        firstSeen: new Date('2023-05-10T08:00:00.000Z'),
        lastModified: new Date('2023-05-17T14:25:10.789Z')
      }
    },
    tags: ['test', 'dates']
  };
  
  const jsonString = stringifyWithDates(testObject);
  const parsedObject = parseWithDates(jsonString);
  
  console.log('Original nested object:', testObject);
  console.log('Parsed nested object:', parsedObject);
  
  // Verify that all nested dates are properly restored
  if (!(parsedObject.createdAt instanceof Date) ||
      !(parsedObject.metadata.lastChecked instanceof Date) ||
      !(parsedObject.metadata.history.firstSeen instanceof Date) ||
      !(parsedObject.metadata.history.lastModified instanceof Date)) {
    console.error('FAIL: Not all nested dates were properly restored');
    return;
  }
  
  // Verify that all dates match the original
  if (testObject.createdAt.getTime() !== parsedObject.createdAt.getTime() ||
      testObject.metadata.lastChecked.getTime() !== parsedObject.metadata.lastChecked.getTime() ||
      testObject.metadata.history.firstSeen.getTime() !== parsedObject.metadata.history.firstSeen.getTime() ||
      testObject.metadata.history.lastModified.getTime() !== parsedObject.metadata.history.lastModified.getTime()) {
    console.error('FAIL: Not all parsed dates match the original dates');
    return;
  }
  
  console.log('PASS: Nested objects with dates are correctly processed');
}

/**
 * Test handling of arrays with dates
 */
function testArraysWithDates() {
  console.log('\nTesting arrays with dates...');
  
  const testArray = [
    {
      id: 1,
      date: new Date('2023-05-15T12:30:45.123Z')
    },
    {
      id: 2,
      date: new Date('2023-05-16T09:15:30.456Z')
    },
    {
      id: 3,
      date: new Date('2023-05-17T14:25:10.789Z')
    }
  ];
  
  const jsonString = stringifyWithDates(testArray);
  const parsedArray = parseWithDates(jsonString);
  
  console.log('Original array:', testArray);
  console.log('Parsed array:', parsedArray);
  
  // Verify that all array elements have their dates properly restored
  for (let i = 0; i < testArray.length; i++) {
    if (!(parsedArray[i].date instanceof Date)) {
      console.error(`FAIL: Date in array element ${i} was not properly restored`);
      return;
    }
    
    if (testArray[i].date.getTime() !== parsedArray[i].date.getTime()) {
      console.error(`FAIL: Date in array element ${i} does not match the original`);
      return;
    }
  }
  
  console.log('PASS: Arrays with dates are correctly processed');
}

// Run verification
runVerification().catch(console.error);