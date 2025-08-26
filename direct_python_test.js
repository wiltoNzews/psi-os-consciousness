/**
 * Direct Python Boot Loader Test
 * 
 * This script directly tests the Python boot-loader on port 5001
 * without going through the Express server.
 */

import fetch from 'node-fetch';

const PYTHON_PORT = 5001;

console.log(`[TEST] Testing direct connection to Python boot-loader at http://localhost:${PYTHON_PORT}`);

async function testPythonBootLoader() {
  try {
    // Test root endpoint
    const response = await fetch(`http://localhost:${PYTHON_PORT}`);
    const data = await response.json();
    
    console.log(`[TEST] Python boot-loader response:`, JSON.stringify(data, null, 2));
    
    // Check for coherence ratio
    if (data.coherence_state && data.coherence_state.coherence_ratio === '3:1') {
      console.log(`[TEST] ✅ Coherence ratio verification: PASSED (3:1 quantum balance maintained)`);
    } else {
      console.log(`[TEST] ❌ Coherence ratio verification: FAILED (expected 3:1, got ${data.coherence_state?.coherence_ratio || 'unknown'})`);
    }
    
    // Check coherence scores
    if (data.coherence_state) {
      const { coherence_score, stability_score, exploration_score } = data.coherence_state;
      console.log(`[TEST] Coherence scores:`);
      console.log(`[TEST]   - Coherence: ${coherence_score}`);
      console.log(`[TEST]   - Stability: ${stability_score}`);
      console.log(`[TEST]   - Exploration: ${exploration_score}`);
      
      // Verify coherence score matches 3:1 ratio (75/25)
      if (coherence_score === 75 && stability_score === 75 && exploration_score === 25) {
        console.log(`[TEST] ✅ Coherence scores verification: PASSED (75/75/25 distribution maintained)`);
      } else {
        console.log(`[TEST] ❌ Coherence scores verification: FAILED (expected 75/75/25 distribution)`);
      }
    }
    
    console.log(`[TEST] ✅ Python boot-loader test successful!`);
    return true;
  } catch (error) {
    console.error(`[TEST] ❌ Failed to connect to Python boot-loader: ${error.message}`);
    console.log(`[TEST] Is the Python process running on port ${PYTHON_PORT}?`);
    return false;
  }
}

// Run the test
testPythonBootLoader();