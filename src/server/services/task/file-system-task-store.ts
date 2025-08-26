/**
 * File System Task Store
 * 
 * Provides functionality for task persistence in the file system
 * following Void-Centered Design principles with explicit boundary handling
 * between in-memory and persisted tasks.
 */

import * as fs from 'fs/promises';
import * as path from 'path';

// Task related interfaces
export interface Task {
  id: string;
  name: string;
  description?: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  priority: number;
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
  assignedTo?: string;
  metadata?: Record<string, any>;
}

export interface SubTask {
  id: string;
  parentId: string;
  name: string;
  description?: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  priority: number;
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
}

export class FileSystemTaskStore {
  private basePath: string;
  private tasksPath: string;
  private subTasksPath: string;
  
  constructor(basePath: string) {
    this.basePath = basePath;
    this.tasksPath = path.join(basePath, 'tasks');
    this.subTasksPath = path.join(basePath, 'subtasks');
    console.log(`Task store initialized with base path: ${basePath}`);
  }
  
  /**
   * Ensure required directories exist
   */
  private async ensureDirectories(): Promise<void> {
    try {
      await fs.mkdir(this.tasksPath, { recursive: true });
      await fs.mkdir(this.subTasksPath, { recursive: true });
    } catch (error) {
      console.error(`Error creating directories: ${error.message}`);
      throw new Error(`Failed to create task store directories: ${error.message}`);
    }
  }
  
  /**
   * Date reviver function for JSON parsing
   */
  private dateReviver(key: string, value: any): any {
    if (typeof value === 'string') {
      const isoDatePattern = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/;
      if (isoDatePattern.test(value)) {
        return new Date(value);
      }
    }
    return value;
  }
  
  /**
   * Date replacer function for JSON stringification
   */
  private dateReplacer(key: string, value: any): any {
    if (value instanceof Date) {
      return value.toISOString();
    }
    return value;
  }
  
  // Task management methods
  async saveTask(task: Task): Promise<void> {
    console.log(`Saving task: ${task.id}`);
    await this.ensureDirectories();
    
    const taskFilePath = path.join(this.tasksPath, `${task.id}.json`);
    
    // Ensure dates are properly set
    if (!task.createdAt) task.createdAt = new Date();
    if (!task.updatedAt) task.updatedAt = new Date();
    
    try {
      // Stringify with date handling
      const taskJson = JSON.stringify(task, this.dateReplacer, 2);
      await fs.writeFile(taskFilePath, taskJson, 'utf8');
    } catch (error) {
      console.error(`Error saving task ${task.id}: ${error.message}`);
      throw new Error(`Failed to save task ${task.id}: ${error.message}`);
    }
  }
  
  async getTask(id: string): Promise<Task | null> {
    console.log(`Getting task: ${id}`);
    try {
      const taskFilePath = path.join(this.tasksPath, `${id}.json`);
      const taskJson = await fs.readFile(taskFilePath, 'utf8');
      
      // Parse with date handling
      const task = JSON.parse(taskJson, this.dateReviver) as Task;
      return task;
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
        console.log(`Task ${id} not found`);
        return null;
      }
      console.error(`Error getting task ${id}: ${error.message}`);
      throw new Error(`Failed to get task ${id}: ${error.message}`);
    }
  }
  
  async deleteTask(id: string): Promise<boolean> {
    console.log(`Deleting task: ${id}`);
    try {
      const taskFilePath = path.join(this.tasksPath, `${id}.json`);
      await fs.unlink(taskFilePath);
      
      // Also delete any associated subtasks
      const subTasksPattern = `${id}-*.json`;
      const subTasksDir = await fs.readdir(this.subTasksPath);
      
      for (const file of subTasksDir) {
        if (file.startsWith(`${id}-`) && file.endsWith('.json')) {
          await fs.unlink(path.join(this.subTasksPath, file));
        }
      }
      
      return true;
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
        console.log(`Task ${id} not found for deletion`);
        return false;
      }
      console.error(`Error deleting task ${id}: ${error.message}`);
      throw new Error(`Failed to delete task ${id}: ${error.message}`);
    }
  }
  
  async getAllTasks(limit?: number): Promise<Task[]> {
    console.log(`Getting all tasks${limit ? ' with limit ' + limit : ''}`);
    try {
      await this.ensureDirectories();
      
      const files = await fs.readdir(this.tasksPath);
      const taskFiles = files.filter(file => file.endsWith('.json'));
      
      const tasks: Task[] = [];
      
      for (const file of taskFiles) {
        try {
          const taskJson = await fs.readFile(path.join(this.tasksPath, file), 'utf8');
          const task = JSON.parse(taskJson, this.dateReviver) as Task;
          tasks.push(task);
          
          if (limit && tasks.length >= limit) {
            break;
          }
        } catch (error) {
          console.error(`Error reading task file ${file}: ${error.message}`);
          // Continue with other files
        }
      }
      
      return tasks;
    } catch (error) {
      console.error(`Error getting all tasks: ${error.message}`);
      throw new Error(`Failed to get all tasks: ${error.message}`);
    }
  }
  
  // SubTask management methods
  async saveSubTasks(parentId: string, subTasks: SubTask[]): Promise<void> {
    console.log(`Saving ${subTasks.length} subtasks for parent: ${parentId}`);
    await this.ensureDirectories();
    
    try {
      for (const subTask of subTasks) {
        // Ensure the subtask has the correct parentId
        subTask.parentId = parentId;
        
        // Ensure dates are properly set
        if (!subTask.createdAt) subTask.createdAt = new Date();
        if (!subTask.updatedAt) subTask.updatedAt = new Date();
        
        const subTaskFilePath = path.join(this.subTasksPath, `${subTask.id}.json`);
        const subTaskJson = JSON.stringify(subTask, this.dateReplacer, 2);
        
        await fs.writeFile(subTaskFilePath, subTaskJson, 'utf8');
      }
    } catch (error) {
      console.error(`Error saving subtasks for parent ${parentId}: ${error.message}`);
      throw new Error(`Failed to save subtasks for parent ${parentId}: ${error.message}`);
    }
  }
  
  async getSubTasks(parentId: string): Promise<SubTask[]> {
    console.log(`Getting subtasks for parent: ${parentId}`);
    try {
      await this.ensureDirectories();
      
      const files = await fs.readdir(this.subTasksPath);
      const subTasks: SubTask[] = [];
      
      for (const file of files) {
        if (file.endsWith('.json')) {
          try {
            const subTaskJson = await fs.readFile(path.join(this.subTasksPath, file), 'utf8');
            const subTask = JSON.parse(subTaskJson, this.dateReviver) as SubTask;
            
            if (subTask.parentId === parentId) {
              subTasks.push(subTask);
            }
          } catch (error) {
            console.error(`Error reading subtask file ${file}: ${error.message}`);
            // Continue with other files
          }
        }
      }
      
      return subTasks;
    } catch (error) {
      console.error(`Error getting subtasks for parent ${parentId}: ${error.message}`);
      throw new Error(`Failed to get subtasks for parent ${parentId}: ${error.message}`);
    }
  }
  
  async deleteSubTask(id: string): Promise<boolean> {
    console.log(`Deleting subtask: ${id}`);
    try {
      const subTaskFilePath = path.join(this.subTasksPath, `${id}.json`);
      await fs.unlink(subTaskFilePath);
      return true;
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
        console.log(`SubTask ${id} not found for deletion`);
        return false;
      }
      console.error(`Error deleting subtask ${id}: ${error.message}`);
      throw new Error(`Failed to delete subtask ${id}: ${error.message}`);
    }
  }
}