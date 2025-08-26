/**
 * Test script for date handling in arrays
 * 
 * This script directly verifies that the ChronosDateHandler properly handles dates
 * within arrays and nested objects for complete date handling across system boundaries.
 * 
 * It applies the TSAR BOMBA verification approach with explicit testing for arrays.
 */

import { ChronosDateHandler } from './server/services/utils/chronos-date-handler.js';

// Helper function to safely check if object is a Date
function isValidDate(value) {
  return value instanceof Date && !isNaN(value.getTime());
}

// Helper function to safely get ISO string
function safeISOString(value) {
  if (isValidDate(value)) {
    return value.toISOString();
  }
  return String(value);
}

// Test object with dates in various forms and structures
const testObject = {
  standardDate: new Date('2023-01-01T12:00:00.000Z'),
  dateInArray: [new Date('2023-02-01T12:00:00.000Z'), new Date('2023-03-01T12:00:00.000Z')],
  mixedArray: [
    'string value',
    new Date('2023-04-01T12:00:00.000Z'),
    42,
    { nestedDate: new Date('2023-05-01T12:00:00.000Z') }
  ],
  nestedObject: {
    deepDate: new Date('2023-06-01T12:00:00.000Z'),
    deepArray: [new Date('2023-07-01T12:00:00.000Z'), new Date('2023-08-01T12:00:00.000Z')]
  }
};

console.log('===== TSAR BOMBA DATE HANDLING TEST =====');
console.log('Testing full serialization and deserialization cycle with dates in arrays');

try {
  // Step 1: Serialize the test object to a JSON string
  const serialized = ChronosDateHandler.stringifyWithDates(testObject);
  console.log('\nSerialized Object:');
  console.log(serialized);

  // Step 2: Deserialize back to JavaScript object
  const deserialized = ChronosDateHandler.parseWithDates(serialized);
  console.log('\nDeserialized Object:');
  console.dir(deserialized, { depth: null, colors: true });

  // Step 3: Verify all dates are properly revived as Date objects
  console.log('\nType Verification:');
  console.log('Standard date is Date object:', isValidDate(deserialized.standardDate));
  
  // Check array elements with proper error handling
  console.log('First date in array is Date object:', 
    Array.isArray(deserialized.dateInArray) && isValidDate(deserialized.dateInArray[0]));
  console.log('Second date in array is Date object:', 
    Array.isArray(deserialized.dateInArray) && isValidDate(deserialized.dateInArray[1]));
  
  // Check mixed array elements safely
  console.log('Date in mixed array is Date object:', 
    Array.isArray(deserialized.mixedArray) && isValidDate(deserialized.mixedArray[1]));
  console.log('Nested date in mixed array is Date object:', 
    Array.isArray(deserialized.mixedArray) && 
    deserialized.mixedArray[3] && 
    isValidDate(deserialized.mixedArray[3].nestedDate));
  
  // Check nested objects
  console.log('Deep date is Date object:', 
    deserialized.nestedObject && isValidDate(deserialized.nestedObject.deepDate));
  console.log('First deep array date is Date object:', 
    deserialized.nestedObject && 
    Array.isArray(deserialized.nestedObject.deepArray) && 
    isValidDate(deserialized.nestedObject.deepArray[0]));
  console.log('Second deep array date is Date object:', 
    deserialized.nestedObject && 
    Array.isArray(deserialized.nestedObject.deepArray) && 
    isValidDate(deserialized.nestedObject.deepArray[1]));

  // Step 4: Verify date values match the original (with proper error handling)
  console.log('\nValue Verification:');
  
  // Check standard date
  if (isValidDate(deserialized.standardDate)) {
    console.log('Standard date value matches:', 
      testObject.standardDate.toISOString() === deserialized.standardDate.toISOString());
  } else {
    console.log('Standard date value NOT verified (not a valid Date)');
  }
  
  // Check array dates
  if (Array.isArray(deserialized.dateInArray)) {
    if (isValidDate(deserialized.dateInArray[0])) {
      console.log('First date in array matches:', 
        testObject.dateInArray[0].toISOString() === deserialized.dateInArray[0].toISOString());
    } else {
      console.log('First date in array NOT verified (not a valid Date)');
    }
    
    if (isValidDate(deserialized.dateInArray[1])) {
      console.log('Second date in array matches:', 
        testObject.dateInArray[1].toISOString() === deserialized.dateInArray[1].toISOString());
    } else {
      console.log('Second date in array NOT verified (not a valid Date)');
    }
  } else {
    console.log('Array dates NOT verified (dateInArray is not an array)');
  }
  
  // Check mixed array dates
  if (Array.isArray(deserialized.mixedArray)) {
    if (isValidDate(deserialized.mixedArray[1])) {
      console.log('Date in mixed array matches:', 
        testObject.mixedArray[1].toISOString() === deserialized.mixedArray[1].toISOString());
    } else {
      console.log('Date in mixed array NOT verified (not a valid Date)');
    }
    
    if (deserialized.mixedArray[3] && isValidDate(deserialized.mixedArray[3].nestedDate)) {
      console.log('Nested date in mixed array matches:', 
        testObject.mixedArray[3].nestedDate.toISOString() === deserialized.mixedArray[3].nestedDate.toISOString());
    } else {
      console.log('Nested date in mixed array NOT verified (not a valid Date)');
    }
  } else {
    console.log('Mixed array dates NOT verified (mixedArray is not an array)');
  }
  
  // Check nested object dates
  if (deserialized.nestedObject) {
    if (isValidDate(deserialized.nestedObject.deepDate)) {
      console.log('Deep date matches:', 
        testObject.nestedObject.deepDate.toISOString() === deserialized.nestedObject.deepDate.toISOString());
    } else {
      console.log('Deep date NOT verified (not a valid Date)');
    }
    
    if (Array.isArray(deserialized.nestedObject.deepArray)) {
      if (isValidDate(deserialized.nestedObject.deepArray[0])) {
        console.log('First deep array date matches:', 
          testObject.nestedObject.deepArray[0].toISOString() === deserialized.nestedObject.deepArray[0].toISOString());
      } else {
        console.log('First deep array date NOT verified (not a valid Date)');
      }
      
      if (isValidDate(deserialized.nestedObject.deepArray[1])) {
        console.log('Second deep array date matches:', 
          testObject.nestedObject.deepArray[1].toISOString() === deserialized.nestedObject.deepArray[1].toISOString());
      } else {
        console.log('Second deep array date NOT verified (not a valid Date)');
      }
    } else {
      console.log('Deep array dates NOT verified (deepArray is not an array)');
    }
  } else {
    console.log('Nested object dates NOT verified (nestedObject is missing)');
  }

  console.log('\n===== TEST COMPLETE =====');
} catch (error) {
  console.error('ERROR DURING TEST:', error);
}