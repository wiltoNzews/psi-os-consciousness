/**
 * ChronosHandler - Central Time Management System
 * 
 * This module provides a unified time management system for the platform,
 * ensuring consistent time handling across all components. It serves as
 * the "clock" for the entire system, enabling temporal alignment of events
 * and actions.
 * 
 * Following Void-Centered Design principles, this module explicitly acknowledges
 * the boundary between system time and simulation time.
 */

// Chronos timestamp structure
export interface ChronosTimestamp {
  tick: number;       // The discrete tick count
  epoch: number;      // Current epoch (increases on epoch transitions)
  time: Date;         // The actual Date object
}

// Task callback interface
export type ChronosTaskCallback = (timestamp: ChronosTimestamp) => void | Promise<void>;

// Registered task structure
interface ChronosTask {
  id: string;
  interval: number;
  lastExecuted: number;
  callback: ChronosTaskCallback;
}

// Listener callback type
type ChronosListener = (timestamp: ChronosTimestamp) => void | Promise<void>;

/**
 * ChronosHandler implements a central time management system
 * for synchronizing time-based operations across the application
 */
class ChronosHandler {
  // Current tick count
  private currentTick: number = 0;
  
  // Current epoch
  private currentEpoch: number = 0;
  
  // Time when chronos was started
  private startTime: Date = new Date();
  
  // Last tick time
  private lastTickTime: Date = new Date();
  
  // Tick interval in milliseconds
  private tickInterval: number = 50; // Default: 20 ticks per second
  
  // Time scale (1.0 = real time, 0.5 = half speed, 2.0 = double speed)
  private timeScale: number = 1.0;
  
  // Epoch duration in ticks
  private epochDuration: number = 1000; // 1000 ticks per epoch
  
  // The ticker interval handle
  private tickerHandle: NodeJS.Timeout | null = null;
  
  // Registered tick callbacks
  private tickListeners: ChronosListener[] = [];
  
  // Registered epoch transition listeners
  private epochListeners: ChronosListener[] = [];
  
  // Registered tasks
  private tasks: Map<string, ChronosTask> = new Map();
  
  // Paused flag
  private isPaused: boolean = false;
  
  /**
   * Initialize the Chronos time system
   * @param options Optional configuration options
   */
  initialize(options?: {
    tickInterval?: number;
    timeScale?: number;
    epochDuration?: number;
  }): void {
    // Apply options if provided
    if (options) {
      if (options.tickInterval) this.tickInterval = options.tickInterval;
      if (options.timeScale) this.timeScale = options.timeScale;
      if (options.epochDuration) this.epochDuration = options.epochDuration;
    }
    
    // Update start time and last tick time
    this.startTime = new Date();
    this.lastTickTime = new Date();
    
    // Reset counters
    this.currentTick = 0;
    this.currentEpoch = 0;
    
    // Start the ticker
    this.startTicker();
    
    console.log(`ChronosHandler initialized: ${this.tickInterval}ms intervals, ${this.timeScale}x time scale, ${this.epochDuration} ticks per epoch`);
  }
  
  /**
   * Start the ticker
   */
  private startTicker(): void {
    // Clear any existing ticker
    if (this.tickerHandle) {
      clearInterval(this.tickerHandle);
    }
    
    // Adjust interval based on time scale
    const scaledInterval = this.tickInterval / this.timeScale;
    
    // Start new ticker
    this.tickerHandle = setInterval(() => this.tick(), scaledInterval);
  }
  
  /**
   * Process a tick
   */
  private tick(): void {
    if (this.isPaused) return;
    
    // Increment tick counter
    this.currentTick++;
    
    // Update tick time
    this.lastTickTime = new Date();
    
    // Create timestamp for this tick
    const timestamp: ChronosTimestamp = {
      tick: this.currentTick,
      epoch: this.currentEpoch,
      time: this.lastTickTime
    };
    
    // Check for epoch transition
    if (this.currentTick % this.epochDuration === 0) {
      this.currentEpoch++;
      
      // Notify epoch listeners
      this.notifyEpochListeners(timestamp);
    }
    
    // Execute scheduled tasks
    this.executeTasks(timestamp);
    
    // Notify tick listeners
    this.notifyTickListeners(timestamp);
  }
  
  /**
   * Notify all tick listeners
   */
  private notifyTickListeners(timestamp: ChronosTimestamp): void {
    for (const listener of this.tickListeners) {
      try {
        const result = listener(timestamp);
        if (result instanceof Promise) {
          result.catch(error => {
            console.error(`Error in tick listener: ${error}`);
          });
        }
      } catch (error) {
        console.error(`Error in tick listener: ${error}`);
      }
    }
  }
  
  /**
   * Notify all epoch listeners
   */
  private notifyEpochListeners(timestamp: ChronosTimestamp): void {
    for (const listener of this.epochListeners) {
      try {
        const result = listener(timestamp);
        if (result instanceof Promise) {
          result.catch(error => {
            console.error(`Error in epoch listener: ${error}`);
          });
        }
      } catch (error) {
        console.error(`Error in epoch listener: ${error}`);
      }
    }
  }
  
  /**
   * Execute scheduled tasks
   */
  private executeTasks(timestamp: ChronosTimestamp): void {
    for (const [taskId, task] of this.tasks.entries()) {
      if (this.currentTick % task.interval === 0 || 
          (this.currentTick - task.lastExecuted) >= task.interval) {
        
        try {
          // Update last executed tick
          task.lastExecuted = this.currentTick;
          
          // Execute the task
          const result = task.callback(timestamp);
          
          // Handle promise result
          if (result instanceof Promise) {
            result.catch(error => {
              console.error(`Error executing task ${taskId}: ${error}`);
            });
          }
        } catch (error) {
          console.error(`Error executing task ${taskId}: ${error}`);
        }
      }
    }
  }
  
  /**
   * Register a tick listener
   * @param callback Function to call on each tick
   * @returns Function to remove the listener
   */
  onTick(callback: ChronosListener): () => void {
    this.tickListeners.push(callback);
    return () => {
      this.tickListeners = this.tickListeners.filter(listener => listener !== callback);
    };
  }
  
  /**
   * Register an epoch transition listener
   * @param callback Function to call on epoch transitions
   * @returns Function to remove the listener
   */
  onEpochTransition(callback: ChronosListener): () => void {
    this.epochListeners.push(callback);
    return () => {
      this.epochListeners = this.epochListeners.filter(listener => listener !== callback);
    };
  }
  
  /**
   * Register a task to be executed at specific intervals
   * @param id Task identifier
   * @param interval Number of ticks between executions
   * @param callback Function to execute
   * @returns Boolean indicating if registration was successful
   */
  registerTask(id: string, interval: number, callback: ChronosTaskCallback): boolean {
    if (this.tasks.has(id)) {
      console.warn(`Task ${id} already registered. Unregister first.`);
      return false;
    }
    
    this.tasks.set(id, {
      id,
      interval,
      lastExecuted: this.currentTick,
      callback
    });
    
    return true;
  }
  
  /**
   * Unregister a task
   * @param id Task identifier
   * @returns Boolean indicating if unregistration was successful
   */
  unregisterTask(id: string): boolean {
    return this.tasks.delete(id);
  }
  
  /**
   * Get the current timestamp
   * @returns ChronosTimestamp object
   */
  now(): ChronosTimestamp {
    return {
      tick: this.currentTick,
      epoch: this.currentEpoch,
      time: new Date()
    };
  }
  
  /**
   * Pause the chronos ticker
   */
  pause(): void {
    this.isPaused = true;
    console.log('ChronosHandler paused');
  }
  
  /**
   * Resume the chronos ticker
   */
  resume(): void {
    this.isPaused = false;
    console.log('ChronosHandler resumed');
  }
  
  /**
   * Reset the chronos ticker
   * This resets tick and epoch counters but keeps running
   */
  reset(): void {
    this.currentTick = 0;
    this.currentEpoch = 0;
    this.startTime = new Date();
    this.lastTickTime = new Date();
    console.log('ChronosHandler reset');
  }
  
  /**
   * Shutdown the chronos ticker
   */
  shutdown(): void {
    if (this.tickerHandle) {
      clearInterval(this.tickerHandle);
      this.tickerHandle = null;
    }
    console.log('ChronosHandler shutdown');
  }
  
  /**
   * Change the time scale
   * @param newScale New time scale value
   */
  setTimeScale(newScale: number): void {
    if (newScale <= 0) {
      console.warn(`Invalid time scale: ${newScale}. Must be positive.`);
      return;
    }
    
    this.timeScale = newScale;
    
    // Restart ticker with new scale
    this.startTicker();
    
    console.log(`ChronosHandler time scale changed to ${newScale}x`);
  }
  
  /**
   * Get the current tick count
   */
  getCurrentTick(): number {
    return this.currentTick;
  }
  
  /**
   * Get the current epoch
   */
  getCurrentEpoch(): number {
    return this.currentEpoch;
  }
  
  /**
   * Get the tick interval
   */
  getTickInterval(): number {
    return this.tickInterval;
  }
  
  /**
   * Get the current time scale
   */
  getTimeScale(): number {
    return this.timeScale;
  }
  
  /**
   * Get the epoch duration in ticks
   */
  getEpochDuration(): number {
    return this.epochDuration;
  }
  
  /**
   * Get the timestamp for a specific tick and epoch
   * @param tick Tick number
   * @param epoch Epoch number
   */
  getTimestampForTickEpoch(tick: number, epoch: number): ChronosTimestamp {
    const totalTicks = (epoch * this.epochDuration) + tick;
    const tickDiff = totalTicks - this.currentTick;
    
    // Calculate the time difference in milliseconds
    const timeDiffMs = tickDiff * (this.tickInterval / this.timeScale);
    
    // Create a new date based on the current time and the difference
    const date = new Date(Date.now() + timeDiffMs);
    
    return {
      tick,
      epoch,
      time: date
    };
  }
  
  /**
   * Get system uptime in milliseconds
   */
  getUptime(): number {
    return Date.now() - this.startTime.getTime();
  }
  
  /**
   * Get formatted system uptime
   */
  getUptimeFormatted(): string {
    const uptime = this.getUptime();
    const seconds = Math.floor(uptime / 1000) % 60;
    const minutes = Math.floor(uptime / (1000 * 60)) % 60;
    const hours = Math.floor(uptime / (1000 * 60 * 60));
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
  
  /**
   * Convert a Date to ISO string, handling null/undefined
   */
  toISO(date?: Date | null): string | null {
    return date ? date.toISOString() : null;
  }
  
  /**
   * Parse an ISO string to Date, handling null/undefined
   */
  fromISO(isoString?: string | null): Date | null {
    return isoString ? new Date(isoString) : null;
  }
}

// Export singleton instance
export const chronos = new ChronosHandler();