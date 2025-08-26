/**
 * Meta-Cognitive Insights Page
 * 
 * This page displays the Meta-Cognitive Insights Dashboard component,
 * which shows patterns and insights from the system's self-reflective analysis.
 * 
 * [QUANTUM_STATE: PAGE_FLOW]
 */

import React from 'react';
import MetaCognitiveInsights from '@/components/meta-cognitive/MetaCognitiveInsights';

const MetaCognitiveInsightsPage: React.FC = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Meta-Cognitive Insights</h1>
      <p className="text-muted-foreground mb-8">
        Real-time dashboard for system self-reflection, showing patterns and insights
        detected in the system's operation and evolution.
      </p>
      
      <MetaCognitiveInsights />
    </div>
  );
};

export default MetaCognitiveInsightsPage;