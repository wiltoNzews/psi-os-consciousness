/**
 * Script to manually trigger meta-cognitive analysis
 * 
 * This script directly calls the performBackgroundAnalysis method
 * to process all events and generate patterns and insights.
 * 
 * [QUANTUM_STATE: SIM_FLOW]
 */

// Use ESM with proper import paths
import axios from 'axios';
const API_BASE = 'http://localhost:5000/api';

/**
 * Manually trigger meta-cognitive analysis
 */
async function triggerAnalysis() {
  try {
    console.log('Starting manual meta-cognitive analysis...');
    
    try {
      // Try direct API approach first
      console.log('Triggering API-based analysis...');
      
      // Trigger analysis
      await axios.post(`${API_BASE}/mc/analyze`);
      console.log('Analysis triggered via API');
      
      // Get events
      const eventsResponse = await axios.get(`${API_BASE}/mc/events`);
      const events = eventsResponse.data;
      console.log(`Found ${events.length} meta-cognitive events via API.`);
      
      // Get patterns
      const patternsResponse = await axios.get(`${API_BASE}/mc/patterns`);
      const patterns = patternsResponse.data;
      
      // Get insights
      const insightsResponse = await axios.get(`${API_BASE}/mc/insights`);
      const insights = insightsResponse.data;
      
      console.log(`Analysis complete. Generated ${patterns.length} patterns and ${insights.length} insights.`);
      
      // Print some stats about patterns
      if (patterns.length > 0) {
        console.log('\nPattern types:');
        const patternTypes = {};
        patterns.forEach(p => {
          patternTypes[p.type] = (patternTypes[p.type] || 0) + 1;
        });
        Object.entries(patternTypes).forEach(([type, count]) => {
          console.log(`  ${type}: ${count}`);
        });
        
        // Print a sample pattern
        console.log('\nSample pattern:');
        console.log(patterns[0]);
      }
      
      // Print some stats about insights
      if (insights.length > 0) {
        console.log('\nInsight severities:');
        const insightSeverities = {};
        insights.forEach(i => {
          insightSeverities[i.severity] = (insightSeverities[i.severity] || 0) + 1;
        });
        Object.entries(insightSeverities).forEach(([severity, count]) => {
          console.log(`  ${severity}: ${count}`);
        });
        
        // Print a sample insight
        console.log('\nSample insight:');
        console.log(insights[0]);
      }
      
      return;
    } catch (apiError) {
      console.error('API approach failed, falling back to direct import:', apiError.message);
    }
    
    // Fallback to direct import if API fails
    // Check if events exist
    const events = await storage.getAllMetaCognitiveEvents();
    console.log(`Found ${events.length} meta-cognitive events via direct import.`);
    
    if (events.length === 0) {
      console.log('No events found. Please import events first.');
      return;
    }
    
    // Manually trigger background analysis
    console.log('Triggering background analysis...');
    await metaCognitiveEngine.performBackgroundAnalysis();
    
    // Get generated patterns and insights
    const patterns = metaCognitiveEngine.getPatterns();
    const insights = metaCognitiveEngine.getInsights();
    
    console.log(`Analysis complete. Generated ${patterns.length} patterns and ${insights.length} insights.`);
    
    // Print some stats about patterns
    if (patterns.length > 0) {
      console.log('\nPattern types:');
      const patternTypes = {};
      patterns.forEach(p => {
        patternTypes[p.type] = (patternTypes[p.type] || 0) + 1;
      });
      Object.entries(patternTypes).forEach(([type, count]) => {
        console.log(`  ${type}: ${count}`);
      });
      
      // Print a sample pattern
      console.log('\nSample pattern:');
      console.log(patterns[0]);
    }
    
    // Print some stats about insights
    if (insights.length > 0) {
      console.log('\nInsight severities:');
      const insightSeverities = {};
      insights.forEach(i => {
        insightSeverities[i.severity] = (insightSeverities[i.severity] || 0) + 1;
      });
      Object.entries(insightSeverities).forEach(([severity, count]) => {
        console.log(`  ${severity}: ${count}`);
      });
      
      // Print a sample insight
      console.log('\nSample insight:');
      console.log(insights[0]);
    }
  } catch (error) {
    console.error('Error during manual analysis:', error);
  }
}

// Execute the analysis
triggerAnalysis().catch(console.error);