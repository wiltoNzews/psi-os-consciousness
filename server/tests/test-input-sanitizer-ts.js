/**
 * Simple test for the input-sanitizer
 */

// Mock the ChunkSignalType if it's not available
const ChunkSignalType = {
  NONE: 'NONE',
  REFRESH_SIGNAL: 'REFRESH_SIGNAL', 
  LOGIC_LOCKDOWN: 'LOGIC_LOCKDOWN'
};

// Mock the ChunkDomainEmoji if it's not available
const ChunkDomainEmoji = {
  AGENT: '🤖',
  LOGIC: '🧩',
  CODE: '💻'
};

// Mock the systemLogger if it's not available
const mockLogger = {
  debug: console.log,
  info: console.log,
  warn: console.log,
  error: console.log
};

// Dynamic import with fallback mocks
async function runTests() {
  try {
    // Attempt to import the module
    const inputSanitizer = await import('../utils/input-sanitizer.js');
    
    // Destructure the imported functions
    const { 
      sanitizeChunkContent, 
      sanitizeTaskProfile, 
      detectInputErrorSignals, 
      detectContentDomain, 
      processInput 
    } = inputSanitizer;

    // Test sanitizeChunkContent
    console.log('=== Testing sanitizeChunkContent ===');
    console.log(sanitizeChunkContent('This is a normal string'));
    console.log(sanitizeChunkContent('Teh quick brown fox wiht hte lazy dog')); // Contains typos that should be fixed
    console.log(sanitizeChunkContent(null)); // Should handle null
    console.log(sanitizeChunkContent({ test: 'object value' })); // Should convert to string

    // Test sanitizeTaskProfile
    console.log('\n=== Testing sanitizeTaskProfile ===');
    const validProfile = {
      depth: 'moderate',
      urgency: 'medium',
      domain: 'general',
      complexity: 'moderate',
      creativityNeeded: true,
      costSensitivity: 'medium',
      ethicalConsiderations: false,
      mainRequirement: 'balance'
    };
    console.log(sanitizeTaskProfile(validProfile));

    const invalidProfile = {
      depth: 'invalid', // Invalid value
      urgency: 'wrong', // Invalid value
      domain: 'code',
      complexity: 'COMPLEX', // Case sensitivity issue
      creativityNeeded: 'yes', // Not a boolean
      costSensitivity: 'none', // Invalid value
      ethicalConsiderations: 1, // Not a boolean
      mainRequirement: 'impossible' // Invalid value
    };
    console.log(sanitizeTaskProfile(invalidProfile)); // Should correct all invalid values

    // Test processInput
    console.log('\n=== Testing processInput ===');
    const input = 'Teh quick brown fox wiht hte lazy dog';
    const result = processInput(input, invalidProfile);
    console.log(JSON.stringify(result, null, 2));
  } catch (error) {
    console.error('Error during tests:', error);
  }
}

// Run the tests
runTests();