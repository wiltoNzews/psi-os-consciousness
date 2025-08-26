/**
 * Date Serialization Utilities Test
 * 
 * Tests the utility functions in date-serialization.js to ensure
 * they correctly handle date serialization and deserialization.
 */

// Import utilities from date-serialization.js
const {
  ISO_DATE_PATTERN,
  dateReviver,
  processObjectWithDates,
  parseJsonWithDates,
  deepCloneWithDates
} = require('../services/utils/date-serialization');

describe('Date Serialization Utilities', () => {
  // Test specific date pattern recognition
  it('should correctly identify ISO date strings', () => {
    // Valid ISO date strings should match the pattern
    expect(ISO_DATE_PATTERN.test('2023-01-01T12:00:00.000Z')).toBe(true);
    expect(ISO_DATE_PATTERN.test('2025-12-31T23:59:59.999Z')).toBe(true);
    
    // Invalid date strings should not match
    expect(ISO_DATE_PATTERN.test('2023-01-01')).toBe(false);
    expect(ISO_DATE_PATTERN.test('not a date')).toBe(false);
    expect(ISO_DATE_PATTERN.test('2023/01/01')).toBe(false);
  });
  
  // Test date reviver function
  it('should convert ISO date strings to Date objects with dateReviver', () => {
    // Valid date string should be converted to Date
    const dateStr = '2023-01-01T12:00:00.000Z';
    const result = dateReviver('testKey', dateStr);
    expect(result instanceof Date).toBe(true);
    expect(result.toISOString()).toBe(dateStr);
    
    // Non-date strings should not be converted
    expect(dateReviver('testKey', 'not a date')).toBe('not a date');
    expect(dateReviver('testKey', '2023-01-01')).toBe('2023-01-01');
    
    // Non-string values should not be converted
    expect(dateReviver('testKey', 123)).toBe(123);
    expect(dateReviver('testKey', null)).toBe(null);
    expect(dateReviver('testKey', undefined)).toBe(undefined);
  });
  
  // Test processing objects with dates
  it('should process objects with dates recursively', () => {
    const testDate1 = new Date('2023-01-01T12:00:00.000Z');
    const testDate2 = new Date('2024-02-02T12:00:00.000Z');
    
    // Create a complex object with dates
    const obj = {
      id: 'test',
      createdAt: testDate1,
      nested: {
        id: 'nested',
        updatedAt: testDate2
      },
      items: [
        {
          id: 'item1',
          timestamp: testDate1
        },
        {
          id: 'item2',
          timestamp: testDate2
        }
      ]
    };
    
    // Serialize the object (convert dates to strings)
    const serialized = JSON.stringify(obj);
    
    // Verify dates have been converted to strings
    const parsed = JSON.parse(serialized);
    expect(parsed.createdAt).toBe(testDate1.toISOString());
    expect(parsed.nested.updatedAt).toBe(testDate2.toISOString());
    expect(parsed.items[0].timestamp).toBe(testDate1.toISOString());
    expect(parsed.items[1].timestamp).toBe(testDate2.toISOString());
    
    // Process the parsed object to convert string dates back to Date objects
    const processed = processObjectWithDates(parsed);
    
    // Verify dates have been converted back to Date objects
    expect(processed.createdAt instanceof Date).toBe(true);
    expect(processed.nested.updatedAt instanceof Date).toBe(true);
    expect(processed.items[0].timestamp instanceof Date).toBe(true);
    expect(processed.items[1].timestamp instanceof Date).toBe(true);
    
    // Verify date values are preserved
    expect(processed.createdAt.toISOString()).toBe(testDate1.toISOString());
    expect(processed.nested.updatedAt.toISOString()).toBe(testDate2.toISOString());
    expect(processed.items[0].timestamp.toISOString()).toBe(testDate1.toISOString());
    expect(processed.items[1].timestamp.toISOString()).toBe(testDate2.toISOString());
  });
  
  // Test parse JSON with dates
  it('should parse JSON strings and convert date strings to Date objects', () => {
    const testDate = new Date('2023-01-01T12:00:00.000Z');
    const obj = { id: 'test', createdAt: testDate };
    
    // Serialize object to JSON
    const json = JSON.stringify(obj);
    
    // Parse JSON with dates
    const parsed = parseJsonWithDates(json);
    
    // Verify date was converted back to Date object
    expect(parsed.createdAt instanceof Date).toBe(true);
    expect(parsed.createdAt.toISOString()).toBe(testDate.toISOString());
  });
  
  // Test deep clone with dates
  it('should deep clone objects and preserve Date objects', () => {
    const testDate = new Date('2023-01-01T12:00:00.000Z');
    const obj = {
      id: 'test',
      createdAt: testDate,
      nested: {
        updatedAt: testDate
      }
    };
    
    // Deep clone the object
    const cloned = deepCloneWithDates(obj);
    
    // Verify object is cloned (not the same reference)
    expect(cloned).not.toBe(obj);
    expect(cloned.nested).not.toBe(obj.nested);
    
    // Verify properties are copied
    expect(cloned.id).toBe(obj.id);
    
    // Verify dates are preserved as Date objects
    expect(cloned.createdAt instanceof Date).toBe(true);
    expect(cloned.nested.updatedAt instanceof Date).toBe(true);
    
    // Verify date values are preserved
    expect(cloned.createdAt.toISOString()).toBe(testDate.toISOString());
    expect(cloned.nested.updatedAt.toISOString()).toBe(testDate.toISOString());
    
    // Verify modifying the clone doesn't affect the original
    cloned.createdAt = new Date('2024-01-01T12:00:00.000Z');
    expect(obj.createdAt.toISOString()).toBe(testDate.toISOString());
  });
  
  // Test handling circular references
  it('should handle objects with circular references', () => {
    // Create object with circular reference
    const obj = { id: 'test', createdAt: new Date('2023-01-01T12:00:00.000Z') };
    obj.self = obj; // Circular reference
    
    // Attempt to deep clone
    const cloned = deepCloneWithDates(obj);
    
    // Verify basic properties are copied
    expect(cloned.id).toBe(obj.id);
    expect(cloned.createdAt instanceof Date).toBe(true);
    
    // Verify circular reference is replaced with placeholder
    expect(cloned.self).toBe('[Circular Reference]');
  });
});