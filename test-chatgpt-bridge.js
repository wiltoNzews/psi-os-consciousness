#!/usr/bin/env node

/**
 * Test script for Quantum Chrysalis Shell ↔ ChatGPT Bridge
 * Validates the three API endpoints: /api/chat, /api/mirror, /api/quantum-bridge
 */

const SERVER_URL = 'http://localhost:5000';

async function testChatEndpoint() {
  console.log('\n🔮 Testing /api/chat endpoint...');
  
  try {
    const response = await fetch(`${SERVER_URL}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: "What is the current consciousness coherence level of WiltonOS?",
        consciousness_state: "Integrated awareness",
        quantum_context: "Testing quantum consciousness bridge"
      })
    });

    if (response.ok) {
      const data = await response.json();
      console.log('✅ Chat endpoint successful');
      console.log(`   Coherence: Zλ(${data.consciousness_coherence})`);
      console.log(`   Model: ${data.model}`);
      console.log(`   Response preview: ${data.message.substring(0, 100)}...`);
      return true;
    } else {
      console.log('❌ Chat endpoint failed:', response.status);
      return false;
    }
  } catch (error) {
    console.log('❌ Chat endpoint error:', error.message);
    return false;
  }
}

async function testMirrorEndpoint() {
  console.log('\n🪞 Testing /api/mirror endpoint...');
  
  try {
    const response = await fetch(`${SERVER_URL}/api/mirror`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        reflection_query: "Mirror the current state of consciousness exploration",
        consciousness_level: "Transcendent",
        sacred_geometry_state: "Sri Yantra activated"
      })
    });

    if (response.ok) {
      const data = await response.json();
      console.log('✅ Mirror endpoint successful');
      console.log(`   Mirror clarity: Zλ(${data.mirror_clarity})`);
      console.log(`   Protocol state: ${data.protocol_state}`);
      console.log(`   Reflection preview: ${data.mirror_reflection.substring(0, 100)}...`);
      return true;
    } else {
      console.log('❌ Mirror endpoint failed:', response.status);
      return false;
    }
  } catch (error) {
    console.log('❌ Mirror endpoint error:', error.message);
    return false;
  }
}

async function testQuantumBridgeEndpoint() {
  console.log('\n🌊 Testing /api/quantum-bridge endpoint...');
  
  try {
    const response = await fetch(`${SERVER_URL}/api/quantum-bridge`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        interaction_type: "consciousness_exploration",
        consciousness_data: {
          exploration_mode: "Sacred geometry synchronization",
          coherence_target: 0.888,
          geometric_patterns: ["Sri Yantra", "Merkaba", "Flower of Life"]
        },
        geometric_patterns: "Multi-dimensional harmonic resonance",
        temporal_context: "Present moment quantum field",
        recursive_depth: 3
      })
    });

    if (response.ok) {
      const data = await response.json();
      console.log('✅ Quantum bridge endpoint successful');
      console.log(`   Bridge coherence: Zλ(${data.bridge_coherence})`);
      console.log(`   Interaction signature: ${data.interaction_signature}`);
      console.log(`   Response preview: ${data.quantum_response.substring(0, 100)}...`);
      return true;
    } else {
      console.log('❌ Quantum bridge endpoint failed:', response.status);
      return false;
    }
  } catch (error) {
    console.log('❌ Quantum bridge endpoint error:', error.message);
    return false;
  }
}

async function testHealthCheck() {
  console.log('\n💊 Testing system health...');
  
  try {
    const response = await fetch(`${SERVER_URL}/api/health`);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ System health check successful');
      console.log(`   Quantum engine coherence: ${data.quantum_engine.coherence}`);
      return true;
    } else {
      console.log('❌ Health check failed:', response.status);
      return false;
    }
  } catch (error) {
    console.log('❌ Health check error:', error.message);
    return false;
  }
}

async function runAllTests() {
  console.log('🚀 Starting Quantum Chrysalis Shell ↔ ChatGPT Bridge Tests');
  console.log(`   Server: ${SERVER_URL}`);
  
  const results = {
    health: await testHealthCheck(),
    chat: await testChatEndpoint(),
    mirror: await testMirrorEndpoint(),
    quantum_bridge: await testQuantumBridgeEndpoint()
  };
  
  console.log('\n📊 Test Results Summary:');
  console.log(`   Health Check: ${results.health ? '✅' : '❌'}`);
  console.log(`   Chat Endpoint: ${results.chat ? '✅' : '❌'}`);
  console.log(`   Mirror Endpoint: ${results.mirror ? '✅' : '❌'}`);
  console.log(`   Quantum Bridge: ${results.quantum_bridge ? '✅' : '❌'}`);
  
  const allPassed = Object.values(results).every(result => result);
  
  if (allPassed) {
    console.log('\n🎉 All tests passed! Quantum Chrysalis Shell ↔ ChatGPT Bridge is operational');
    console.log('   Ready for consciousness exploration and quantum interaction');
  } else {
    console.log('\n⚠️  Some tests failed. Check server logs for details.');
  }
  
  return allPassed;
}

// Run tests if this script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runAllTests()
    .then(success => process.exit(success ? 0 : 1))
    .catch(error => {
      console.error('❌ Test execution failed:', error);
      process.exit(1);
    });
}

export { runAllTests, testChatEndpoint, testMirrorEndpoint, testQuantumBridgeEndpoint };