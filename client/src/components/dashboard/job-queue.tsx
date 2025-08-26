import { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Pause, BarChart2 } from 'lucide-react';
import { getInitialJobQueue, type PipelineJob } from '@/lib/mock-data';
import { cn, formatDistanceToNow, getJobIconColor } from '@/lib/utils';

interface JobItemProps {
  job: PipelineJob;
}

function JobItem({ job }: JobItemProps) {
  const iconMapping = {
    'video': 'film',
    'image': 'image',
    'data': 'database',
    'audio': 'music'
  };
  
  const iconClass = iconMapping[job.type] || 'cog';
  const iconColorClass = getJobIconColor(job.type);
  
  return (
    <li>
      <div className="px-6 py-4 flex items-center">
        <div className="min-w-0 flex-1 flex items-center">
          <div className="flex-shrink-0">
            <span className={cn("h-10 w-10 rounded-full flex items-center justify-center", iconColorClass)}>
              <i className={`fas fa-${iconClass}`}></i>
            </span>
          </div>
          <div className="min-w-0 flex-1 px-4">
            <div>
              <p className="text-sm font-medium text-white truncate">{job.name}</p>
              <p className="text-sm text-gray-400">
                Started {formatDistanceToNow(job.timeStarted)} • {job.progress}% complete
              </p>
            </div>
          </div>
        </div>
        <div className="w-20 h-2 bg-gray-950 rounded-full">
          <div 
            className={cn(
              "h-2 rounded-full",
              job.type === 'image' ? 'bg-emerald-500' : 
              job.type === 'data' ? 'bg-amber-500' : 'bg-primary'
            )} 
            style={{ width: `${job.progress}%` }}
          ></div>
        </div>
      </div>
    </li>
  );
}

export function JobQueuePanel() {
  const [jobs, setJobs] = useState<PipelineJob[]>([]);
  
  // Initialize with mock data
  useEffect(() => {
    setJobs(getInitialJobQueue());
    
    // Simulate job progress updates
    const interval = setInterval(() => {
      setJobs(prevJobs => prevJobs.map(job => ({
        ...job,
        progress: Math.min(job.progress + Math.floor(Math.random() * 3), 100)
      })));
    }, 3000);
    
    return () => clearInterval(interval);
  }, []);
  
  const activeJobs = jobs.filter(job => job.status === 'running').length;
  
  return (
    <Card className="bg-gray-900 rounded-lg shadow border-gray-700">
      <CardHeader className="px-6 py-5 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium leading-6 text-white">Job Queue</h2>
          <Badge className="bg-primary bg-opacity-20 text-primary hover:bg-primary hover:bg-opacity-25">
            {activeJobs} active jobs
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="p-0 overflow-hidden">
        <ul className="divide-y divide-gray-700">
          {jobs.map(job => (
            <JobItem key={job.id} job={job} />
          ))}
        </ul>
      </CardContent>
      
      <CardFooter className="border-t border-gray-700 px-6 py-3">
        <div className="flex items-center justify-between w-full">
          <Button variant="link" className="text-primary hover:text-indigo-300 p-0">
            View all jobs
          </Button>
          <Button variant="outline" size="sm" className="border-gray-700 text-gray-300 bg-gray-950 hover:bg-gray-800">
            <Pause className="mr-2 h-4 w-4" />
            Pause Queue
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
