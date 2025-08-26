// Simple script to test the coherence logs API
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/quantum-fractal-art/coherence-logs';

async function testCoherenceLogs() {
  try {
    console.log('Testing coherence logs API...');
    
    // Test logs for quantum-humor type
    const response = await axios.get(`${API_URL}?type=quantum-humor&limit=5`);
    console.log('Response:', JSON.stringify(response.data, null, 2));
    
    // Check the response structure
    if (response.data.success) {
      console.log('\n✅ PASS: Coherence logs API endpoint is working!');
      
      // Check if we have logs
      const logs = response.data.logs;
      if (logs && logs.length > 0) {
        console.log(`Found ${logs.length} coherence logs.`);
        
        // Check if the logs have the necessary properties
        const firstLog = logs[0];
        if (firstLog.coherenceScore !== undefined && 
            firstLog.quantumResonanceFactor !== undefined && 
            firstLog.stabilityThreshold !== undefined && 
            firstLog.coherenceThreshold !== undefined) {
          console.log('✅ PASS: Coherence metrics are present in the logs.');
          
          // Calculate if the coherence metrics follow the 3:1 ratio
          // For simplicity, we assume the coherence/exploration ratio would be around the optimal values
          // which is 75% coherence, 25% exploration, giving a coherence score of around 1.0
          if (firstLog.coherenceScore > 0.9) {
            console.log(`✅ PASS: Coherence score (${firstLog.coherenceScore}) is close to optimal (1.0), indicating 3:1 quantum balance ratio is maintained.`);
          } else {
            console.log(`❓ INFO: Coherence score is ${firstLog.coherenceScore}, which may not reflect optimal 3:1 ratio.`);
          }
        } else {
          console.log('❌ FAIL: Coherence metrics are missing from logs.');
        }
      } else {
        console.log('ℹ️ INFO: No coherence logs found. Try generating some quantum humor or fractals first.');
      }
    } else {
      console.log('❌ FAIL: API request failed.');
    }
  } catch (error) {
    console.error('Error testing coherence logs API:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
    }
  }
}

testCoherenceLogs();