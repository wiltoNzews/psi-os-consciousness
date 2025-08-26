/**
 * Color Wheel Protocol Demo Page
 * 
 * Showcases the Color Wheel Protocol, a visual system for representing 
 * communication states in human-AI and AI-AI interactions.
 * 
 * [QUANTUM_STATE: CLARITY_FLOW]
 */

import React from 'react';
import { Link } from 'wouter';
import ColorWheelDemonstration from '@/components/oracle/ColorWheelDemonstration';

const ColorWheelPage: React.FC = () => {
  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Color Wheel Protocol</h1>
        <p className="text-slate-600 mb-4">
          A standardized visual system for representing communication states across system components.
        </p>
        <div className="flex gap-2">
          <Link href="/oracle">
            <a className="text-blue-500 hover:underline">
              ← Back to Oracle Dashboard
            </a>
          </Link>
        </div>
      </div>
      
      <div className="grid gap-8">
        <div>
          <ColorWheelDemonstration />
        </div>
        
        <div className="bg-slate-50 p-6 rounded-md">
          <h2 className="text-xl font-semibold mb-4">About the Color Wheel Protocol</h2>
          <p className="mb-4">
            The Color Wheel Protocol establishes a visual language for representing different 
            communication states between components in the system. It provides a shared frame 
            of reference for both human-AI and AI-AI interactions.
          </p>
          <h3 className="text-lg font-medium mb-2">Key Benefits</h3>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong>Immediate Visual Feedback:</strong> Color coding provides instant recognition 
              of communication state without requiring textual analysis.
            </li>
            <li>
              <strong>Standardized Response Strategies:</strong> Each state has associated best 
              practices for how to respond effectively.
            </li>
            <li>
              <strong>System-Wide Coherence:</strong> All modules speak the same visual language, 
              creating a unified experience.
            </li>
            <li>
              <strong>Adaptive Interaction:</strong> Responses can be tailored to the current 
              communication state, improving overall system performance.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ColorWheelPage;