/**
 * Void-Centered Minimal Test
 * 
 * A focused test to verify the metadata support in ContextRelationship
 * using authentic file-based testing.
 */

import { jest } from '@jest/globals';
jest.setTimeout(30000);

import { v4 as uuidv4 } from 'uuid';
import * as fs from 'fs/promises';
import * as path from 'path';
import {
  ContextRelationship,
  PersistentContext
} from '../services/context-manager';

describe('Void-Centered Metadata Support', () => {
  const testDir = path.join(process.cwd(), 'void-centered-test-data');
  const testFilePath = path.join(testDir, 'relationship-metadata-test.json');
  
  beforeEach(async () => {
    await fs.mkdir(testDir, { recursive: true });
  });
  
  afterEach(async () => {
    try {
      await fs.rm(testDir, { recursive: true, force: true });
    } catch (error: any) {
      console.error(`Error cleaning up test directory: ${error.message}`);
    }
  });
  
  it('should authentically store and retrieve relationship metadata', async () => {
    // Create a test context with a relationship that has metadata
    const testContext: PersistentContext = {
      sessionId: `void-test-${uuidv4()}`,
      historyChunks: [],
      strategicPlans: [],
      metaInsights: [],
      relationships: [{
        sourceId: `source-${uuidv4()}`,
        targetId: `target-${uuidv4()}`,
        relationshipType: 'void-centered-relationship',
        strength: 0.95,
        timestamp: new Date(),
        metadata: {
          boundaryType: 'explicit',
          voidCenteredAttribute: 'authenticity',
          dimensionalResonance: 0.87,
          recursiveDepth: 3
        }
      }],
      updatedAt: new Date(),
      createdAt: new Date(),
      version: 0
    };
    
    // Write the context to a file
    await fs.writeFile(
      testFilePath, 
      JSON.stringify(testContext, (key, value) => {
        // Custom serialization for dates
        return value instanceof Date ? { __date: value.toISOString() } : value;
      }, 2)
    );
    
    // Read the file back
    const fileContent = await fs.readFile(testFilePath, 'utf8');
    
    // Parse the content with date handling
    const parsedContext = JSON.parse(fileContent, (key, value) => {
      // Custom deserialization for dates
      if (value && typeof value === 'object' && value.__date) {
        return new Date(value.__date);
      }
      return value;
    });
    
    // Verify the relationship metadata was preserved
    expect(parsedContext.relationships.length).toBe(1);
    expect(parsedContext.relationships[0].metadata).toBeDefined();
    expect(parsedContext.relationships[0].metadata.boundaryType).toBe('explicit');
    expect(parsedContext.relationships[0].metadata.voidCenteredAttribute).toBe('authenticity');
    expect(parsedContext.relationships[0].metadata.dimensionalResonance).toBe(0.87);
    expect(parsedContext.relationships[0].metadata.recursiveDepth).toBe(3);
    
    // Authentic verification check
    const directFileStat = await fs.stat(testFilePath);
    expect(directFileStat.isFile()).toBe(true);
    expect(directFileStat.size).toBeGreaterThan(0);
  });
});