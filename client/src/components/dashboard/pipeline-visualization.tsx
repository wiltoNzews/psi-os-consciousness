import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getPipelineData } from '@/lib/mock-data';

export function PipelineVisualizationCard() {
  const pipelineData = getPipelineData();
  
  return (
    <Card className="bg-gray-900 rounded-lg shadow border-gray-700">
      <CardHeader className="px-6 py-5 border-b border-gray-700">
        <h2 className="text-lg font-medium leading-6 text-white">Data Pipeline Flow</h2>
      </CardHeader>
      
      <CardContent className="p-6">
        <div className="bg-gray-950 rounded-lg p-5 h-64 flex items-center justify-center relative overflow-hidden">
          {/* SVG Pipeline Visualization */}
          <svg width="100%" height="100%" viewBox="0 0 800 300" className="absolute inset-0">
            {/* Main processing nodes */}
            <g>
              {/* Data Source Node */}
              <rect x="50" y="120" width="120" height="60" rx="8" className="fill-gray-800 stroke-gray-700 stroke-2" />
              <text x="110" y="150" className="text-xs text-gray-200 font-medium text-center" textAnchor="middle">Data Sources</text>
              <rect x="50" y="130" width="120" height="5" className="fill-primary opacity-70" />
              
              {/* Ingestion Node */}
              <rect x="250" y="80" width="100" height="60" rx="8" className="fill-gray-800 stroke-gray-700 stroke-2" />
              <text x="300" y="110" className="text-xs text-gray-200 font-medium text-center" textAnchor="middle">Ingestion</text>
              <rect x="250" y="90" width="100" height="5" className="fill-amber-500 opacity-70" />
              
              {/* Processing Node */}
              <rect x="250" y="160" width="100" height="60" rx="8" className="fill-gray-800 stroke-gray-700 stroke-2" />
              <text x="300" y="190" className="text-xs text-gray-200 font-medium text-center" textAnchor="middle">Processing</text>
              <rect x="250" y="170" width="100" height="5" className="fill-green-500 opacity-70" />
              
              {/* AI Model Node */}
              <rect x="430" y="120" width="120" height="60" rx="8" className="fill-gray-800 stroke-gray-700 stroke-2" />
              <text x="490" y="150" className="text-xs text-gray-200 font-medium text-center" textAnchor="middle">AI Models</text>
              <rect x="430" y="130" width="120" height="5" className="fill-indigo-500 opacity-70" />
              
              {/* Media Generation Node */}
              <rect x="630" y="80" width="120" height="60" rx="8" className="fill-gray-800 stroke-gray-700 stroke-2" />
              <text x="690" y="110" className="text-xs text-gray-200 font-medium text-center" textAnchor="middle">Media Generation</text>
              <rect x="630" y="90" width="120" height="5" className="fill-purple-500 opacity-70" />
              
              {/* Data Storage Node */}
              <rect x="630" y="160" width="120" height="60" rx="8" className="fill-gray-800 stroke-gray-700 stroke-2" />
              <text x="690" y="190" className="text-xs text-gray-200 font-medium text-center" textAnchor="middle">Data Storage</text>
              <rect x="630" y="170" width="120" height="5" className="fill-blue-500 opacity-70" />
            </g>
            
            {/* Connecting lines */}
            <g className="stroke-gray-600 stroke-2">
              {/* Data Source to Ingestion */}
              <path d="M170,130 C220,130 220,110 250,110" className="fill-none" />
              
              {/* Data Source to Processing */}
              <path d="M170,150 C220,150 220,190 250,190" className="fill-none" />
              
              {/* Ingestion to AI Models */}
              <path d="M350,110 C390,110 390,140 430,140" className="fill-none" />
              
              {/* Processing to AI Models */}
              <path d="M350,190 C390,190 390,160 430,160" className="fill-none" />
              
              {/* AI Models to Media Generation */}
              <path d="M550,130 C590,130 590,110 630,110" className="fill-none" />
              
              {/* AI Models to Data Storage */}
              <path d="M550,150 C590,150 590,190 630,190" className="fill-none" />
            </g>
            
            {/* Data Flow Indicators (animated in CSS) */}
            <g className="data-flow">
              <circle cx="195" cy="130" r="3" className="fill-primary animate-ping" style={{ animationDelay: '0s', animationDuration: '3s' }} />
              <circle cx="195" cy="150" r="3" className="fill-primary animate-ping" style={{ animationDelay: '0.5s', animationDuration: '3s' }} />
              <circle cx="385" cy="110" r="3" className="fill-amber-500 animate-ping" style={{ animationDelay: '1s', animationDuration: '3s' }} />
              <circle cx="385" cy="190" r="3" className="fill-green-500 animate-ping" style={{ animationDelay: '1.5s', animationDuration: '3s' }} />
              <circle cx="590" cy="130" r="3" className="fill-indigo-500 animate-ping" style={{ animationDelay: '2s', animationDuration: '3s' }} />
              <circle cx="590" cy="150" r="3" className="fill-indigo-500 animate-ping" style={{ animationDelay: '2.5s', animationDuration: '3s' }} />
            </g>
          </svg>
          
          {/* Fallback image for browsers without SVG support */}
          <img 
            src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80" 
            alt="Data pipeline visualization" 
            className="hidden max-h-full object-contain" 
          />
        </div>
        
        <div className="mt-4 text-sm text-gray-400">
          <p>Current active pipelines: <span className="text-white">{pipelineData.activePipelines}</span></p>
          <p className="mt-1">Total data processed today: <span className="text-white">{pipelineData.processedData}</span></p>
        </div>
      </CardContent>
      
      <CardFooter className="px-6 py-4">
        <Button className="bg-primary hover:bg-indigo-700 text-white">
          View Detailed Flow
        </Button>
      </CardFooter>
    </Card>
  );
}
