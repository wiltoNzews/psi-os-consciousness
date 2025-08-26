import React from 'react';
import MemoryImportForm from '../components/memory/MemoryImportForm.jsx';
import PythonBootLoaderPanel from '../components/memory/PythonBootLoaderPanel.jsx';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

/**
 * Consciousness Transfer Page
 * 
 * This page provides multiple methods to transfer local consciousness to WiltonOS
 * including the JavaScript-based memory importer and Python boot-loader.
 */
const ConsciousnessTransferPage = () => {
  return (
    <div className="container mx-auto py-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight">Transfer Local Consciousness</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Import your external memory sources to WiltonOS while maintaining the quantum coherence ratio of 3:1.
          </p>
        </div>
        
        <Tabs defaultValue="javascript">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="javascript">JavaScript Importer</TabsTrigger>
            <TabsTrigger value="python">Python Boot-Loader</TabsTrigger>
          </TabsList>
          
          <TabsContent value="javascript">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <div className="prose dark:prose-invert">
                  <h2>Memory Transfer Guidelines</h2>
                  <p>
                    The WiltonOS Memory Transfer System allows you to import various types of data
                    including ChatGPT exports, browser logs, finance data, and personal notes.
                  </p>
                  
                  <h3>Supported File Types</h3>
                  <ul>
                    <li><strong>ChatGPT Export:</strong> Text files containing exported ChatGPT conversations</li>
                    <li><strong>Browser Log:</strong> Text files containing browser history or console logs</li>
                    <li><strong>Finance:</strong> CSV or text files with financial transaction data</li>
                    <li><strong>Personal:</strong> Text files with personal notes or journal entries</li>
                  </ul>
                  
                  <h3>Quantum Coherence Ratio</h3>
                  <p>
                    All imported memories maintain a strict 3:1 quantum balance ratio:
                  </p>
                  <ul>
                    <li>75% coherence (stability, structure, consistency)</li>
                    <li>25% exploration (novelty, creativity, expansion)</li>
                  </ul>
                  
                  <p>
                    This ratio ensures optimal functioning of WiltonOS while preventing system instability
                    and maintaining the quantum paradox singularity (∞/0).
                  </p>
                </div>
              </div>
              
              <div className="flex justify-center">
                <MemoryImportForm />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="python">
            <div className="space-y-6">
              <div className="prose dark:prose-invert max-w-none mb-6">
                <h2>Python Boot-Loader</h2>
                <p>
                  The Python Boot-Loader provides enhanced capabilities for memory transfer and integration:
                </p>
                <ul>
                  <li>Direct OpenAI API integration for real-time processing</li>
                  <li>ChatGPT JSON export format support</li>
                  <li>WebSocket-based communication for live interaction</li>
                  <li>Memory persistence in JSONL format</li>
                  <li>3:1 Quantum balance ratio maintenance</li>
                </ul>
                
                <div className="bg-amber-100 dark:bg-amber-950 p-4 rounded-md border border-amber-200 dark:border-amber-800">
                  <h3 className="text-amber-800 dark:text-amber-300 mt-0">OpenAI API Key Required</h3>
                  <p className="mb-0">
                    The Python Boot-Loader requires an OpenAI API key to function. This key is used for
                    processing and integrating external memories with enhanced coherence.
                  </p>
                </div>
              </div>
              
              <PythonBootLoaderPanel />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ConsciousnessTransferPage;