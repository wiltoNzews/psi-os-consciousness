
/**
 * Filesystem helper functions for persistent context operations
 */
import { promises as fsPromises } from 'node:fs';
import * as fs from 'node:fs';
import * as path from 'node:path';

/**
 * Ensures a directory exists, creating it if necessary (async version)
 * @param dirPath Path to the directory
 */
export async function ensureDirectoryExistsAsync(dirPath: string): Promise<void> {
  try {
    await fsPromises.access(dirPath);
  } catch (error) {
    // Directory doesn't exist, create it
    try {
      await fsPromises.mkdir(dirPath, { recursive: true });
      console.log(`Created directory: ${dirPath}`);
    } catch (mkdirError) {
      console.error(`Error creating directory ${dirPath}:`, mkdirError);
      throw mkdirError;
    }
  }
}

/**
 * Ensures a directory exists, creating it if necessary (sync version)
 * @param dirPath Directory path to ensure
 */
export function ensureDirectoryExists(dirPath: string): void {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
  
  if (!fs.statSync(dirPath).isDirectory()) {
    throw new Error(`Path is not a directory: ${dirPath}`);
  }
}

/**
 * Checks if a file exists
 * @param filePath Path to the file
 * @returns true if file exists, false otherwise
 */
export async function fileExists(filePath: string): Promise<boolean> {
  try {
    await fsPromises.access(filePath);
    return true;
  } catch {
    return false;
  }
}

/**
 * Gets all JSON files in a directory
 * @param dirPath Directory path
 * @returns Array of file paths
 */
export async function getJsonFilesInDirectory(dirPath: string): Promise<string[]> {
  try {
    await ensureDirectoryExistsAsync(dirPath);
    const files = await fsPromises.readdir(dirPath);
    return files
      .filter(file => file.endsWith('.json'))
      .map(file => path.join(dirPath, file));
  } catch (error) {
    console.error(`Error reading directory ${dirPath}:`, error);
    return [];
  }
}

/**
 * Validates that a path is writable by creating and deleting a test file
 * @param dirPath Directory path to validate
 */
export function validateDirectoryWritable(dirPath: string): void {
  try {
    const testFilePath = path.join(dirPath, '.permission_test');
    fs.writeFileSync(testFilePath, 'test');
    fs.unlinkSync(testFilePath);
  } catch (error) {
    throw new Error(`Directory is not writable: ${dirPath}`);
  }
}

/**
 * Safely writes data to a file atomically
 * @param filePath File path to write to
 * @param data Data to write
 */
export function safeWriteFile(filePath: string, data: string): void {
  const tempPath = `${filePath}.tmp`;
  fs.writeFileSync(tempPath, data, 'utf8');
  fs.renameSync(tempPath, filePath);
}
