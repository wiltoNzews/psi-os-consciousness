import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { apiRequest } from '@/lib/queryClient';

interface Task {
  id: string;
  name: string;
  description?: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  priority: number;
  createdAt: Date;
  updatedAt: Date;
  metadata?: Record<string, any>;
}

interface SubTask {
  id: string;
  parentId: string;
  name: string;
  description?: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  priority: number;
  createdAt: Date;
  updatedAt: Date;
}

export default function TaskTest() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [subtasks, setSubtasks] = useState<SubTask[]>([]);
  const [newTaskName, setNewTaskName] = useState('');
  const [newTaskDesc, setNewTaskDesc] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');

  // Load all tasks
  const loadTasks = async () => {
    setLoading(true);
    try {
      const result = await apiRequest({
        method: 'GET',
        path: '/api/tasks'
      });
      setTasks(result);
      setStatus('Tasks loaded successfully');
    } catch (error) {
      console.error('Error loading tasks:', error);
      setStatus('Error loading tasks');
    } finally {
      setLoading(false);
    }
  };

  // Load subtasks for a specific task
  const loadSubtasks = async (taskId: string) => {
    setLoading(true);
    try {
      const result = await apiRequest({
        method: 'GET',
        path: `/api/tasks/${taskId}/subtasks`
      });
      setSubtasks(result);
      setStatus('Subtasks loaded successfully');
    } catch (error) {
      console.error('Error loading subtasks:', error);
      setStatus('Error loading subtasks');
    } finally {
      setLoading(false);
    }
  };

  // Create a new task
  const createTask = async () => {
    if (!newTaskName.trim()) {
      setStatus('Task name is required');
      return;
    }

    setLoading(true);
    try {
      const newTask = {
        name: newTaskName,
        description: newTaskDesc,
        status: 'pending',
        priority: 1,
        metadata: { testRun: true }
      };

      const result = await apiRequest({
        method: 'POST',
        path: '/api/tasks',
        body: newTask
      });

      setTasks([...tasks, result]);
      setNewTaskName('');
      setNewTaskDesc('');
      setStatus('Task created successfully');
    } catch (error) {
      console.error('Error creating task:', error);
      setStatus('Error creating task');
    } finally {
      setLoading(false);
    }
  };

  // Delete a task
  const deleteTask = async (taskId: string) => {
    setLoading(true);
    try {
      await apiRequest({
        method: 'DELETE',
        path: `/api/tasks/${taskId}`
      });
      setTasks(tasks.filter(t => t.id !== taskId));
      if (selectedTask?.id === taskId) {
        setSelectedTask(null);
        setSubtasks([]);
      }
      setStatus('Task deleted successfully');
    } catch (error) {
      console.error('Error deleting task:', error);
      setStatus('Error deleting task');
    } finally {
      setLoading(false);
    }
  };

  // Select a task and load its subtasks
  const selectTask = (task: Task) => {
    setSelectedTask(task);
    loadSubtasks(task.id);
  };

  // Load tasks on mount
  useEffect(() => {
    loadTasks();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Task Test Interface</h1>
      
      {status && (
        <div className="mb-4 p-2 bg-blue-100 rounded">
          {status}
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Create New Task</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label htmlFor="taskName" className="block text-sm font-medium text-gray-700">Task Name</label>
                <Input
                  id="taskName"
                  value={newTaskName}
                  onChange={(e) => setNewTaskName(e.target.value)}
                  placeholder="Enter task name"
                  className="mt-1"
                />
              </div>
              <div>
                <label htmlFor="taskDesc" className="block text-sm font-medium text-gray-700">Description</label>
                <Textarea
                  id="taskDesc"
                  value={newTaskDesc}
                  onChange={(e) => setNewTaskDesc(e.target.value)}
                  placeholder="Enter task description"
                  className="mt-1"
                />
              </div>
              <Button onClick={createTask} disabled={loading}>
                {loading ? 'Creating...' : 'Create Task'}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Task List</CardTitle>
          </CardHeader>
          <CardContent>
            <Button onClick={loadTasks} disabled={loading} className="mb-4">
              {loading ? 'Loading...' : 'Refresh Tasks'}
            </Button>
            
            {tasks.length === 0 ? (
              <p>No tasks found</p>
            ) : (
              <div className="space-y-2">
                {tasks.map(task => (
                  <div 
                    key={task.id}
                    className={`p-2 border rounded flex justify-between items-center cursor-pointer ${selectedTask?.id === task.id ? 'bg-blue-50 border-blue-300' : ''}`}
                    onClick={() => selectTask(task)}
                  >
                    <div>
                      <div className="font-medium">{task.name}</div>
                      <div className="text-sm text-gray-500">{task.description}</div>
                      <Badge variant={
                        task.status === 'completed' ? 'default' :
                        task.status === 'in_progress' ? 'secondary' :
                        task.status === 'failed' ? 'destructive' : 'outline'
                      }>
                        {task.status}
                      </Badge>
                    </div>
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteTask(task.id);
                      }}
                    >
                      Delete
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {selectedTask && (
        <Card className="mt-4">
          <CardHeader>
            <CardTitle>Subtasks for {selectedTask.name}</CardTitle>
          </CardHeader>
          <CardContent>
            {subtasks.length === 0 ? (
              <p>No subtasks found</p>
            ) : (
              <div className="space-y-2">
                {subtasks.map(subtask => (
                  <div key={subtask.id} className="p-2 border rounded">
                    <div className="font-medium">{subtask.name}</div>
                    <div className="text-sm text-gray-500">{subtask.description}</div>
                    <Badge variant={
                      subtask.status === 'completed' ? 'default' :
                      subtask.status === 'in_progress' ? 'secondary' :
                      subtask.status === 'failed' ? 'destructive' : 'outline'
                    }>
                      {subtask.status}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}