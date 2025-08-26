import React from 'react';
import { StageViz } from '@/components/nexus/StageViz';
import { Stage } from '@/components/nexus/FlowStageIcons';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function SimpleVizTest() {
  const [currentStage, setCurrentStage] = React.useState<number>(0);
  const [completedStages, setCompletedStages] = React.useState<number[]>([]);
  const [status, setStatus] = React.useState<'pending' | 'in_progress' | 'completed' | 'failed'>('in_progress');
  
  // Handle advancing the stage
  const handleAdvanceStage = () => {
    if (currentStage < 8) {
      setCompletedStages([...completedStages, currentStage]);
      setCurrentStage(currentStage + 1);
    } else {
      setCompletedStages([0, 1, 2, 3, 4, 5, 6, 7, 8]);
      setStatus('completed');
    }
  };

  // Handle resetting the stages
  const handleReset = () => {
    setCurrentStage(0);
    setCompletedStages([]);
    setStatus('in_progress');
  };

  // Handle failing the current stage
  const handleFail = () => {
    setStatus('failed');
  };

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">Simple StageViz Test</h1>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>0-8 Flow Visualization</CardTitle>
        </CardHeader>
        <CardContent>
          <StageViz
            stages={[0, 1, 2, 3, 4, 5, 6, 7, 8]}
            currentStage={currentStage}
            completedStages={completedStages}
            status={status}
            className="w-full h-[200px]"
          />
          
          <div className="flex gap-3 mt-6">
            <Button 
              onClick={handleAdvanceStage}
              disabled={status === 'completed' || status === 'failed'}
            >
              Advance Stage
            </Button>
            <Button 
              onClick={handleFail}
              variant="destructive"
              disabled={status === 'completed' || status === 'failed'}
            >
              Fail Current Stage
            </Button>
            <Button 
              onClick={handleReset}
              variant="secondary"
            >
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-3 gap-4">
        <div>
          <h3 className="text-lg font-semibold mb-2">Current Stage:</h3>
          <p>{currentStage} - {Object.values(Stage)[currentStage]}</p>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2">Completed Stages:</h3>
          <p>{completedStages.join(', ') || 'None'}</p>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2">Status:</h3>
          <p>{status}</p>
        </div>
      </div>
    </div>
  );
}