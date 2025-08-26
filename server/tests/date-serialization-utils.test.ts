/**
 * Date Serialization Utilities Tests
 * 
 * Comprehensive tests for date serialization and deserialization utilities,
 * ensuring proper handling of dates in nested objects across serialization cycles.
 */

import * as dateUtils from '../services/utils/date-serialization.js';

describe('Date Serialization Utilities', () => {
  
  describe('dateReviver', () => {
    it('should convert ISO date strings to Date objects', () => {
      const isoString = '2023-05-20T14:30:00.000Z';
      const result = dateUtils.dateReviver('someKey', isoString);
      expect(result).toBeInstanceOf(Date);
      expect(result.toISOString()).toBe(isoString);
    });
    
    it('should not convert non-ISO date strings', () => {
      const nonIsoString = '2023-05-20';
      const result = dateUtils.dateReviver('someKey', nonIsoString);
      expect(result).toBe(nonIsoString);
    });
    
    it('should return non-string values unchanged', () => {
      const numberValue = 42;
      const result = dateUtils.dateReviver('someKey', numberValue);
      expect(result).toBe(numberValue);
    });
  });
  
  describe('processObjectWithDates', () => {
    it('should process dates in an object', () => {
      const now = new Date();
      const isoString = now.toISOString();
      const obj = {
        date: isoString,
        nested: {
          anotherDate: isoString
        }
      };
      
      const processed = dateUtils.processObjectWithDates(obj);
      expect(processed.date).toBeInstanceOf(Date);
      expect(processed.nested.anotherDate).toBeInstanceOf(Date);
      expect(processed.date.toISOString()).toBe(isoString);
      expect(processed.nested.anotherDate.toISOString()).toBe(isoString);
    });
    
    it('should process dates in arrays', () => {
      const now = new Date();
      const isoString = now.toISOString();
      const obj = {
        dates: [isoString, '2022-01-01', 42],
        nested: {
          moreDates: [isoString, 'not a date']
        }
      };
      
      const processed = dateUtils.processObjectWithDates(obj);
      expect(processed.dates[0]).toBeInstanceOf(Date);
      expect(processed.dates[1]).toBe('2022-01-01'); // Not an ISO string
      expect(processed.dates[2]).toBe(42);
      expect(processed.nested.moreDates[0]).toBeInstanceOf(Date);
      expect(processed.nested.moreDates[1]).toBe('not a date');
    });
    
    it('should handle null and undefined values', () => {
      expect(dateUtils.processObjectWithDates(null)).toBeNull();
      expect(dateUtils.processObjectWithDates(undefined)).toBeUndefined();
    });
    
    it('should handle edge case with empty object', () => {
      const result = dateUtils.processObjectWithDates({});
      expect(result).toEqual({});
    });
  });
  
  describe('parseJsonWithDates', () => {
    it('should parse JSON string and convert ISO dates to Date objects', () => {
      const now = new Date();
      const isoString = now.toISOString();
      const jsonString = `{"date":"${isoString}","nested":{"anotherDate":"${isoString}"}}`;
      
      const parsed = dateUtils.parseJsonWithDates(jsonString);
      expect(parsed.date).toBeInstanceOf(Date);
      expect(parsed.nested.anotherDate).toBeInstanceOf(Date);
      expect(parsed.date.toISOString()).toBe(isoString);
      expect(parsed.nested.anotherDate.toISOString()).toBe(isoString);
    });
    
    it('should handle malformed JSON', () => {
      const malformedJson = '{date:not valid json}';
      expect(() => dateUtils.parseJsonWithDates(malformedJson)).toThrow();
    });
  });
  
  describe('deepCloneWithDates', () => {
    it('should create a deep clone with preserved Date objects', () => {
      const originalDate = new Date();
      const original = {
        date: originalDate,
        nested: {
          anotherDate: new Date(originalDate),
          array: [new Date(originalDate), 'string', 42]
        }
      };
      
      const cloned = dateUtils.deepCloneWithDates(original);
      
      // Should be different object references but equal values
      expect(cloned).not.toBe(original);
      expect(cloned.date).not.toBe(original.date);
      expect(cloned.nested).not.toBe(original.nested);
      
      // Date values should be preserved
      expect(cloned.date).toBeInstanceOf(Date);
      expect(cloned.date.getTime()).toBe(original.date.getTime());
      expect(cloned.nested.anotherDate).toBeInstanceOf(Date);
      expect(cloned.nested.anotherDate.getTime()).toBe(original.nested.anotherDate.getTime());
      expect(cloned.nested.array[0]).toBeInstanceOf(Date);
      expect(cloned.nested.array[0].getTime()).toBe(original.nested.array[0].getTime());
    });
    
    it('should handle null and undefined', () => {
      expect(dateUtils.deepCloneWithDates(null)).toBeNull();
      expect(dateUtils.deepCloneWithDates(undefined)).toBeUndefined();
    });
    
    it('should handle circular references', () => {
      const obj: any = { prop: 'value' };
      obj.circular = obj;
      
      // Should not throw an error due to circular reference
      const cloned = dateUtils.deepCloneWithDates(obj);
      expect(cloned.prop).toBe('value');
      expect(cloned.circular).toBe('[Circular Reference]');
    });
    
    it('should handle complex nested structure with dates', () => {
      const now = new Date();
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      const complex = {
        id: 'test',
        created: now,
        metadata: {
          updated: tomorrow,
          history: [
            { timestamp: now, event: 'created' },
            { timestamp: tomorrow, event: 'updated' }
          ]
        },
        tags: ['test', 'dates']
      };
      
      const cloned = dateUtils.deepCloneWithDates(complex);
      
      expect(cloned.created).toBeInstanceOf(Date);
      expect(cloned.created.getTime()).toBe(now.getTime());
      expect(cloned.metadata.updated).toBeInstanceOf(Date);
      expect(cloned.metadata.updated.getTime()).toBe(tomorrow.getTime());
      expect(cloned.metadata.history[0].timestamp).toBeInstanceOf(Date);
      expect(cloned.metadata.history[0].timestamp.getTime()).toBe(now.getTime());
      expect(cloned.metadata.history[1].timestamp).toBeInstanceOf(Date);
      expect(cloned.metadata.history[1].timestamp.getTime()).toBe(tomorrow.getTime());
    });
  });
  
  describe('Integration', () => {
    it('should properly handle multiple serialization and deserialization cycles', () => {
      // Create a complex object with dates
      const now = new Date();
      const original = {
        id: 'test',
        timestamp: now,
        nested: {
          created: now,
          updated: new Date(now.getTime() + 3600000) // 1 hour later
        }
      };
      
      // Serialize to JSON
      const serialized = JSON.stringify(original);
      
      // Parse with date revival
      const deserialized = dateUtils.parseJsonWithDates(serialized);
      
      // Dates should be converted back to Date objects
      expect(deserialized.timestamp).toBeInstanceOf(Date);
      expect(deserialized.nested.created).toBeInstanceOf(Date);
      expect(deserialized.nested.updated).toBeInstanceOf(Date);
      
      // Dates should have correct values
      expect(deserialized.timestamp.getTime()).toBe(now.getTime());
      expect(deserialized.nested.created.getTime()).toBe(now.getTime());
      expect(deserialized.nested.updated.getTime()).toBe(now.getTime() + 3600000);
      
      // Serialize again
      const serializedAgain = JSON.stringify(deserialized);
      
      // Deserialize again
      const deserializedAgain = dateUtils.parseJsonWithDates(serializedAgain);
      
      // Dates should still be properly converted
      expect(deserializedAgain.timestamp).toBeInstanceOf(Date);
      expect(deserializedAgain.nested.created).toBeInstanceOf(Date);
      expect(deserializedAgain.nested.updated).toBeInstanceOf(Date);
      
      // And should maintain correct values through multiple cycles
      expect(deserializedAgain.timestamp.getTime()).toBe(now.getTime());
      expect(deserializedAgain.nested.created.getTime()).toBe(now.getTime());
      expect(deserializedAgain.nested.updated.getTime()).toBe(now.getTime() + 3600000);
    });
    
    it('should handle complex PersistentContext-like structures', () => {
      // Create an object similar to PersistentContext with multiple date fields
      const now = new Date();
      const hourLater = new Date(now.getTime() + 3600000);
      const dayLater = new Date(now.getTime() + 86400000);
      
      const context = {
        sessionId: "test-session",
        historyChunks: [
          {
            chunkId: "chunk1",
            content: "Test content",
            cognitiveLayer: "strategic",
            timestamp: now
          },
          {
            chunkId: "chunk2",
            content: "More content",
            cognitiveLayer: "reactive",
            timestamp: hourLater
          }
        ],
        strategicPlans: [
          {
            taskId: "task1",
            planSummary: "Test plan",
            subTasks: ["subtask1", "subtask2"],
            createdAt: now,
            updatedAt: hourLater,
            status: "in_progress"
          }
        ],
        metaInsights: [
          {
            eventType: "pattern-recognition",
            summary: "Test insight",
            details: {},
            timestamp: dayLater,
            importance: 0.8,
            confidence: 0.9
          }
        ],
        relationships: [],
        updatedAt: dayLater,
        createdAt: now,
        version: 1
      };
      
      // Serialize and deserialize
      const serialized = JSON.stringify(context);
      const deserialized = dateUtils.parseJsonWithDates(serialized);
      
      // Verify dates are correctly preserved in nested structures
      expect(deserialized.updatedAt).toBeInstanceOf(Date);
      expect(deserialized.createdAt).toBeInstanceOf(Date);
      expect(deserialized.historyChunks[0].timestamp).toBeInstanceOf(Date);
      expect(deserialized.historyChunks[1].timestamp).toBeInstanceOf(Date);
      expect(deserialized.strategicPlans[0].createdAt).toBeInstanceOf(Date);
      expect(deserialized.strategicPlans[0].updatedAt).toBeInstanceOf(Date);
      expect(deserialized.metaInsights[0].timestamp).toBeInstanceOf(Date);
      
      // Verify date values are correct
      expect(deserialized.createdAt.getTime()).toBe(now.getTime());
      expect(deserialized.updatedAt.getTime()).toBe(dayLater.getTime());
      expect(deserialized.historyChunks[0].timestamp.getTime()).toBe(now.getTime());
      expect(deserialized.historyChunks[1].timestamp.getTime()).toBe(hourLater.getTime());
      expect(deserialized.strategicPlans[0].createdAt.getTime()).toBe(now.getTime());
      expect(deserialized.strategicPlans[0].updatedAt.getTime()).toBe(hourLater.getTime());
      expect(deserialized.metaInsights[0].timestamp.getTime()).toBe(dayLater.getTime());
    });
  });
});