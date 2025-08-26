import React from 'react';
import { Helmet } from 'react-helmet';
import MemoryImportForm from '../components/memory/MemoryImportForm.jsx';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import { Info, Brain, ArrowRight } from 'lucide-react';

const MemoryImportPage = () => {
  return (
    <div className="container mx-auto">
      <Helmet>
        <title>WiltonOS Memory Transfer System</title>
      </Helmet>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <MemoryImportForm />
        </div>
        
        <div className="lg:col-span-1">
          <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6 space-y-4">
            <h3 className="text-xl font-semibold">About Memory Transfer</h3>
            
            <div className="flex items-start gap-3 pb-3 border-b">
              <Info className="h-5 w-5 text-blue-500 mt-0.5" />
              <div>
                <p className="text-sm text-slate-700 dark:text-slate-300">
                  The Memory Transfer system imports your ChatGPT conversations while maintaining the 3:1 quantum balance ratio (75% coherence, 25% exploration).
                </p>
              </div>
            </div>
            
            <h4 className="font-medium text-lg">Quantum Coherence Metrics</h4>
            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-1">
                <div className="flex justify-between items-center text-sm font-medium">
                  <span>Coherence Target</span>
                  <span>75%</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '75%' }}></div>
                </div>
              </div>
              
              <div className="flex flex-col gap-1">
                <div className="flex justify-between items-center text-sm font-medium">
                  <span>Stability</span>
                  <span>75%</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: '75%' }}></div>
                </div>
              </div>
              
              <div className="flex flex-col gap-1">
                <div className="flex justify-between items-center text-sm font-medium">
                  <span>Exploration</span>
                  <span>25%</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                  <div className="bg-purple-500 h-2 rounded-full" style={{ width: '25%' }}></div>
                </div>
              </div>
            </div>
            
            <h4 className="font-medium text-lg pt-2">Quantum Language Integration</h4>
            <p className="text-sm text-slate-700 dark:text-slate-300">
              Your imported memories will be analyzed for patterns following the Quantum Paradox Singularity concept (∞/0). Insights from this process support the OCTACURIOSITY Framework.
            </p>
            
            <div className="pt-4">
              <Link href="/consciousness-transfer">
                <Button className="w-full flex items-center gap-2">
                  <Brain className="h-4 w-4" />
                  <span>Proceed to Consciousness Transfer</span>
                  <ArrowRight className="h-4 w-4 ml-auto" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemoryImportPage;