import { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getInitialSystemLogs, type SystemLog } from '@/lib/mock-data';
import { formatDistanceToNow } from '@/lib/utils';

interface SystemLogItemProps {
  log: SystemLog;
}

function SystemLogItem({ log }: SystemLogItemProps) {
  const getIconByType = (type: string) => {
    switch (type) {
      case 'error':
        return 'exclamation-triangle';
      case 'warning':
        return 'exclamation-circle';
      case 'success':
        return 'check-circle';
      default:
        return 'info-circle';
    }
  };
  
  const getBackgroundByType = (type: string) => {
    switch (type) {
      case 'error':
        return 'bg-red-500 bg-opacity-10';
      case 'warning':
        return 'bg-amber-500 bg-opacity-10';
      case 'success':
        return 'bg-emerald-500 bg-opacity-10';
      default:
        return 'bg-gray-500 bg-opacity-10';
    }
  };
  
  const getTextColorByType = (type: string) => {
    switch (type) {
      case 'error':
        return 'text-red-500';
      case 'warning':
        return 'text-amber-500';
      case 'success':
        return 'text-emerald-500';
      default:
        return 'text-gray-500';
    }
  };
  
  return (
    <li className="px-6 py-4">
      <div className="flex items-start">
        <div className="flex-shrink-0 pt-0.5">
          <span className={`h-8 w-8 rounded-full ${getBackgroundByType(log.type)} flex items-center justify-center`}>
            <i className={`fas fa-${getIconByType(log.type)} ${getTextColorByType(log.type)}`}></i>
          </span>
        </div>
        <div className="ml-3 flex-1">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-white">{log.message}</p>
            <p className="text-sm text-gray-400">{formatDistanceToNow(log.timestamp)}</p>
          </div>
          <div className="mt-1">
            <p className="text-sm text-gray-400">{log.details}</p>
          </div>
          <div className="mt-2">
            <Button variant="outline" size="sm" className="border-gray-700 text-gray-300 bg-gray-950 hover:bg-gray-800">
              View Details
            </Button>
          </div>
        </div>
      </div>
    </li>
  );
}

export function SystemHealthSection() {
  const [logs, setLogs] = useState<SystemLog[]>([]);
  
  // Initialize with mock data
  useEffect(() => {
    setLogs(getInitialSystemLogs());
  }, []);
  
  return (
    <Card className="bg-gray-900 rounded-lg shadow border-gray-700 mb-8">
      <CardHeader className="px-6 py-5 border-b border-gray-700">
        <h2 className="text-lg font-medium leading-6 text-white">System Health & Error Logs</h2>
      </CardHeader>
      
      <CardContent className="p-0 overflow-hidden">
        <ul className="divide-y divide-gray-700">
          {logs.map(log => (
            <SystemLogItem key={log.id} log={log} />
          ))}
        </ul>
      </CardContent>
      
      <CardFooter className="border-t border-gray-700 px-6 py-3">
        <Button variant="link" className="text-primary hover:text-indigo-300 p-0">
          View all logs
        </Button>
      </CardFooter>
    </Card>
  );
}
