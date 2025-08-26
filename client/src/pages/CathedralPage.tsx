import React from 'react';
// Legacy import removed - using ConsciousnessKernel instead
import { ConsciousnessKernel } from '@/components/ConsciousnessKernel';

export function CathedralPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50">
      <ConsciousnessKernel />
    </div>
  );
}