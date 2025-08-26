
/**
 * Ultra-minimal JavaScript test 
 * Just to verify that Jest is running correctly
 */

const { describe, it, expect } = require('@jest/globals');

describe('Minimal Test', () => {
  it('should pass a simple assertion', () => {
    expect(1 + 1).toBe(2);
  });
});
