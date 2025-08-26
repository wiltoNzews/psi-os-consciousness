import React from 'react';
import { StageViz } from '@/components/nexus/StageViz';
import { HelixViz } from '@/components/nexus/HelixViz';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { FlowStageIcons, Stage } from '@/components/nexus/FlowStageIcons';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from 'wouter';

export default function TestStageViz() {
  const [currentStage, setCurrentStage] = React.useState<number>(4);
  const [completedStages, setCompletedStages] = React.useState<number[]>([0, 1, 2, 3]);
  const [status, setStatus] = React.useState<'pending' | 'in_progress' | 'completed' | 'failed'>('in_progress');
  const [visualizationType, setVisualizationType] = React.useState<'2d' | '3d'>('2d');
  
  // Mock stage metrics
  const stageMetrics = {
    costs: {
      0: 0.0015,
      1: 0.0032,
      2: 0.0018,
      3: 0.0075,
      4: 0.0022,
    },
    times: {
      0: 1.2,
      1: 3.5,
      2: 2.1,
      3: 8.7,
      4: 2.9,
    }
  };

  // Handler to advance the stage
  const handleAdvanceStage = () => {
    if (currentStage < 8) {
      setCompletedStages([...completedStages, currentStage]);
      setCurrentStage(currentStage + 1);
    } else {
      setCompletedStages([0, 1, 2, 3, 4, 5, 6, 7, 8]);
      setStatus('completed');
    }
  };

  // Handler to reset the stages
  const handleReset = () => {
    setCurrentStage(0);
    setCompletedStages([]);
    setStatus('in_progress');
  };

  // Handler to fail the current stage
  const handleFail = () => {
    setStatus('failed');
  };
  
  // Toggle visualization type
  const handleVisualizationChange = (type: '2d' | '3d') => {
    setVisualizationType(type);
  };

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">OROBORO NEXUS Quantum Helix Visualization</h1>
      
      {/* Navigation Links */}
      <div className="flex gap-4 mb-6">
        <Link to="/power-law-dashboard">
          <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md shadow transition-colors">
            View Power Law Dashboard with Integrated HelixViz
          </button>
        </Link>
      </div>
      
      {/* Control Panel */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Visualization Controls</CardTitle>
          <CardDescription>Control the visualization's appearance and state</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <h3 className="text-sm font-medium">Visualization Type</h3>
              <div className="flex gap-4">
                <button
                  onClick={() => handleVisualizationChange('2d')}
                  className={`px-4 py-2 rounded-md ${
                    visualizationType === '2d'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-secondary text-secondary-foreground'
                  }`}
                >
                  2D Flow
                </button>
                <button
                  onClick={() => handleVisualizationChange('3d')}
                  className={`px-4 py-2 rounded-md ${
                    visualizationType === '3d'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-secondary text-secondary-foreground'
                  }`}
                >
                  3D Helix
                </button>
              </div>
            </div>
            
            <div className="flex flex-col gap-2">
              <h3 className="text-sm font-medium">Stage Control</h3>
              <div className="flex gap-3">
                <button 
                  onClick={handleAdvanceStage}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
                  disabled={status === 'completed' || status === 'failed'}
                >
                  Advance Stage
                </button>
                <button 
                  onClick={handleFail}
                  className="px-4 py-2 bg-destructive text-destructive-foreground rounded-md hover:bg-destructive/90"
                  disabled={status === 'completed' || status === 'failed'}
                >
                  Fail Current Stage
                </button>
                <button 
                  onClick={handleReset}
                  className="px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90"
                >
                  Reset
                </button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Visualization Card */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>
            {visualizationType === '3d' ? 'Quantum Helix Visualization' : 'Quantum Flow Visualization'}
          </CardTitle>
          <CardDescription>
            {visualizationType === '3d' 
              ? 'Three-dimensional helix representation of the 0-8 Flow structure' 
              : 'Two-dimensional representation of the 0-8 Flow structure'}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {visualizationType === '3d' ? (
            <div className="bg-black rounded-md overflow-hidden">
              <HelixViz
                stages={[0, 1, 2, 3, 4, 5, 6, 7, 8]}
                currentStage={currentStage}
                completedStages={completedStages}
                status={status}
                className="w-full h-[500px]"
              />
            </div>
          ) : (
            <div className="p-6">
              <StageViz
                stages={[0, 1, 2, 3, 4, 5, 6, 7, 8]}
                currentStage={currentStage}
                completedStages={completedStages}
                status={status}
                variant="detailed"
                stageMetrics={stageMetrics}
                className="w-full h-[200px]"
              />
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Flow Stage Icons */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Flow Stage Icons</CardTitle>
          <CardDescription>Compact representation of flow stages</CardDescription>
        </CardHeader>
        <CardContent>
          <FlowStageIcons
            currentStage={currentStage}
            completedStages={completedStages}
            status={status}
            showLabels
            className="justify-between"
          />
        </CardContent>
      </Card>
      
      {/* Current State Card */}
      <Card>
        <CardHeader>
          <CardTitle>Current State</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="grid grid-cols-2">
              <span className="font-medium">Current Stage:</span>
              <span>{currentStage} - {Object.values(Stage)[currentStage]}</span>
            </div>
            <div className="grid grid-cols-2">
              <span className="font-medium">Completed Stages:</span>
              <span>{completedStages.join(', ')}</span>
            </div>
            <div className="grid grid-cols-2">
              <span className="font-medium">Status:</span>
              <span className={
                status === 'completed' ? 'text-green-600' :
                status === 'failed' ? 'text-red-600' :
                status === 'in_progress' ? 'text-amber-600' :
                'text-slate-600'
              }>
                {status}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}