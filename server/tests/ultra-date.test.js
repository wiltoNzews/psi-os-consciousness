/**
 * Ultra Minimal Date Test
 * This is a JavaScript-only test with minimal dependencies to verify date handling
 */

// Simple date serialization test
describe('Ultra Minimal Date Test', () => {
  // Test variables
  let original;
  let serialized;
  let deserialized;
  
  // Date reviver function 
  function dateReviver(key, value) {
    if (typeof value === 'string' && 
        /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/.test(value)) {
      console.log(`Converting date string: ${value}`);
      return new Date(value);
    }
    return value;
  }
  
  // Basic test
  test('should handle date serialization and deserialization', () => {
    console.log("Starting date test:", Date.now());
    
    // Create an object with a date
    original = {
      id: "test-123",
      name: "Test Object",
      created: new Date(),
      tags: ["test", "date"]
    };
    console.log("Original date type:", typeof original.created);
    console.log("Original date value:", original.created.toISOString());
    
    // Serialize the object
    serialized = JSON.stringify(original);
    console.log("Serialized:", serialized);
    
    // Deserialize the object with date reviver
    deserialized = JSON.parse(serialized, dateReviver);
    console.log("Deserialized date type:", typeof deserialized.created);
    
    // Validate date conversion
    expect(deserialized.created instanceof Date).toBe(true);
    expect(deserialized.created.getTime()).toBe(original.created.getTime());
    
    console.log("Date test complete:", Date.now());
  });
});