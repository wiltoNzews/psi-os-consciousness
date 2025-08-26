/**
 * OpenAI Connection Test
 * 
 * This script tests the OpenAI API connection to ensure the API key is valid and working.
 */

import OpenAI from 'openai';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Log setup info
console.log(`Testing OpenAI connection with API key: ${process.env.OPENAI_API_KEY ? 'PRESENT (Key hidden for security)' : 'MISSING'}`);

async function testOpenAIConnection() {
  try {
    if (!process.env.OPENAI_API_KEY) {
      console.error('ERROR: OPENAI_API_KEY environment variable is not set');
      process.exit(1);
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });

    console.log('Initialized OpenAI client, testing connection...');

    // Make a minimal API call to test the connection
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "System initialization test. Respond with 'connection_valid' only."
        },
        {
          role: "user",
          content: "Validate API connection"
        }
      ],
      max_tokens: 10,
      temperature: 0
    });

    // Verify the response
    if (response && response.choices && response.choices.length > 0) {
      console.log('✅ SUCCESS: OpenAI API connection validated successfully');
      console.log('Response:', response.choices[0].message.content);
      return true;
    } else {
      console.error('❌ ERROR: OpenAI API returned an invalid response structure');
      console.error('Response:', response);
      return false;
    }
  } catch (error) {
    console.error('❌ ERROR: OpenAI API connection validation failed');
    console.error('Error message:', error.message);
    console.error('Error details:', error);

    if (error.message.includes('401')) {
      console.error('This appears to be an authentication error - check your API key');
    } else if (error.message.includes('429')) {
      console.error('This appears to be a rate limit error - reduce request volume or wait');
    } else if (error.message.includes('5')) {  // Any 5xx error
      console.error('This appears to be a server error - try again later');
    }

    return false;
  }
}

// Run the test
testOpenAIConnection()
  .then(success => {
    console.log(`Test completed with ${success ? 'SUCCESS' : 'FAILURE'}`);
    process.exit(success ? 0 : 1);
  })
  .catch(err => {
    console.error('Unhandled error during test:', err);
    process.exit(1);
  });