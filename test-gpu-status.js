// Simple script to test the GPU status API
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/quantum-fractal-art/gpu-status';

async function testGpuStatus() {
  try {
    console.log('Testing GPU status API...');
    const response = await axios.get(API_URL);
    console.log('Response:', JSON.stringify(response.data, null, 2));
    
    // Check if the quantum balance ratio is correct
    const quantumBalance = response.data.gpuStatus.quantumBalance;
    if (quantumBalance) {
      console.log('\nQuantum Balance Check:');
      console.log(`Coherence Ratio: ${quantumBalance.coherenceRatio * 100}%`);
      console.log(`Exploration Ratio: ${quantumBalance.explorationRatio * 100}%`);
      console.log(`Actual Ratio: ${quantumBalance.actualRatio}:1`);
      console.log(`Optimal Ratio Maintained: ${quantumBalance.optimalRatioMaintained ? 'Yes' : 'No'}`);
      
      // Verify 3:1 ratio
      const idealRatio = 3.0;
      const actualRatio = quantumBalance.actualRatio;
      const tolerance = 0.01;
      
      if (Math.abs(actualRatio - idealRatio) <= tolerance) {
        console.log('\n✅ PASS: The 3:1 quantum balance ratio is correctly maintained!');
      } else {
        console.log(`\n❌ FAIL: The ratio is ${actualRatio}:1, which does not match the expected 3:1 ratio.`);
      }
    } else {
      console.log('\n❌ FAIL: Quantum balance information not found in the response.');
    }
    
  } catch (error) {
    console.error('Error testing GPU status API:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
    }
  }
}

testGpuStatus();