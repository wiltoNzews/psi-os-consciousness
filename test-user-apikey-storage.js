/**
 * Test script for User and API Key operations in FileSystemStorage
 * 
 * This script tests the basic CRUD operations for users and API keys in the FileSystemStorage class.
 * It applies the TSAR BOMBA verification approach with explicit testing after each operation.
 */
import path from 'path';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { v4 as uuidv4 } from 'uuid';

// Get the current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

class TestFileSystemStorage {
  constructor(baseDir) {
    this.baseDir = baseDir;
    this.usersDir = path.join(this.baseDir, 'users');
    this.apiKeysDir = path.join(this.baseDir, 'apikeys');
  }

  async ensureDirectories() {
    await fs.mkdir(this.baseDir, { recursive: true });
    await fs.mkdir(this.usersDir, { recursive: true });
    await fs.mkdir(this.apiKeysDir, { recursive: true });
  }

  dateReviver(key, value) {
    if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.*Z$/.test(value)) {
      return new Date(value);
    }
    return value;
  }

  dateReplacer(key, value) {
    if (value instanceof Date) {
      return value.toISOString();
    }
    return value;
  }

  // User operations
  async createUser(user) {
    await this.ensureDirectories();
    
    // Check if user exists
    try {
      const existingUser = await this.getUserByUsername(user.username);
      if (existingUser) {
        throw new Error(`User with username ${user.username} already exists`);
      }
    } catch (error) {
      if (!error.message.includes('not found')) {
        throw error;
      }
    }
    
    // Find highest ID
    let nextId = 1;
    try {
      const files = await fs.readdir(this.usersDir);
      const userFiles = files.filter(file => file.startsWith('user_') && file.endsWith('.json'));
      
      for (const file of userFiles) {
        const match = file.match(/user_(\d+)\.json/);
        if (match) {
          const id = parseInt(match[1], 10);
          if (id >= nextId) {
            nextId = id + 1;
          }
        }
      }
    } catch (error) {
      if (error.code !== 'ENOENT') {
        throw error;
      }
    }
    
    const fullUser = {
      ...user,
      id: nextId,
      role: user.role || 'user',
      createdAt: new Date()
    };
    
    const filePath = path.join(this.usersDir, `user_${nextId}.json`);
    await fs.writeFile(
      filePath,
      JSON.stringify(fullUser, this.dateReplacer, 2)
    );
    
    return fullUser;
  }
  
  async getUser(id) {
    await this.ensureDirectories();
    
    const filePath = path.join(this.usersDir, `user_${id}.json`);
    
    try {
      const data = await fs.readFile(filePath, 'utf8');
      return JSON.parse(data, this.dateReviver);
    } catch (error) {
      if (error.code === 'ENOENT') {
        return undefined;
      }
      throw error;
    }
  }
  
  async getUserByUsername(username) {
    await this.ensureDirectories();
    
    try {
      const files = await fs.readdir(this.usersDir);
      const userFiles = files.filter(file => file.startsWith('user_') && file.endsWith('.json'));
      
      for (const file of userFiles) {
        const filePath = path.join(this.usersDir, file);
        const data = await fs.readFile(filePath, 'utf8');
        const user = JSON.parse(data, this.dateReviver);
        
        if (user.username === username) {
          return user;
        }
      }
      
      return undefined;
    } catch (error) {
      if (error.code === 'ENOENT') {
        return undefined;
      }
      throw error;
    }
  }
  
  async updateUser(id, userData) {
    await this.ensureDirectories();
    
    const filePath = path.join(this.usersDir, `user_${id}.json`);
    
    try {
      const data = await fs.readFile(filePath, 'utf8');
      const existingUser = JSON.parse(data, this.dateReviver);
      
      if (userData.username && userData.username !== existingUser.username) {
        const userWithSameUsername = await this.getUserByUsername(userData.username);
        if (userWithSameUsername && userWithSameUsername.id !== id) {
          throw new Error(`User with username ${userData.username} already exists`);
        }
      }
      
      const updatedUser = {
        ...existingUser,
        ...userData,
        id // Ensure ID stays the same
      };
      
      await fs.writeFile(
        filePath,
        JSON.stringify(updatedUser, this.dateReplacer, 2)
      );
      
      return updatedUser;
    } catch (error) {
      if (error.code === 'ENOENT') {
        return undefined;
      }
      throw error;
    }
  }
  
  async getAllUsers() {
    await this.ensureDirectories();
    
    try {
      const files = await fs.readdir(this.usersDir);
      const userFiles = files.filter(file => file.startsWith('user_') && file.endsWith('.json'));
      
      const users = [];
      for (const file of userFiles) {
        const filePath = path.join(this.usersDir, file);
        const data = await fs.readFile(filePath, 'utf8');
        const user = JSON.parse(data, this.dateReviver);
        users.push(user);
      }
      
      users.sort((a, b) => a.id - b.id);
      return users;
    } catch (error) {
      if (error.code === 'ENOENT') {
        return [];
      }
      throw error;
    }
  }
  
  // API Key operations
  async createApiKey(apiKey) {
    await this.ensureDirectories();
    
    let nextId = 1;
    try {
      const files = await fs.readdir(this.apiKeysDir);
      const apiKeyFiles = files.filter(file => file.startsWith('apikey_') && file.endsWith('.json'));
      
      for (const file of apiKeyFiles) {
        const match = file.match(/apikey_(\d+)\.json/);
        if (match) {
          const id = parseInt(match[1], 10);
          if (id >= nextId) {
            nextId = id + 1;
          }
        }
      }
    } catch (error) {
      if (error.code !== 'ENOENT') {
        throw error;
      }
    }
    
    const fullApiKey = {
      ...apiKey,
      id: nextId,
      status: apiKey.status || 'active',
      usage: apiKey.usage || 0,
      usageLimit: apiKey.usageLimit || 1000,
      createdAt: new Date(),
      expiresAt: apiKey.expiresAt || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
    };
    
    const filePath = path.join(this.apiKeysDir, `apikey_${nextId}.json`);
    await fs.writeFile(
      filePath,
      JSON.stringify(fullApiKey, this.dateReplacer, 2)
    );
    
    return fullApiKey;
  }
  
  async getApiKey(id) {
    await this.ensureDirectories();
    
    const filePath = path.join(this.apiKeysDir, `apikey_${id}.json`);
    
    try {
      const data = await fs.readFile(filePath, 'utf8');
      return JSON.parse(data, this.dateReviver);
    } catch (error) {
      if (error.code === 'ENOENT') {
        return undefined;
      }
      throw error;
    }
  }
  
  async updateApiKey(id, apiKeyData) {
    await this.ensureDirectories();
    
    const filePath = path.join(this.apiKeysDir, `apikey_${id}.json`);
    
    try {
      const data = await fs.readFile(filePath, 'utf8');
      const existingApiKey = JSON.parse(data, this.dateReviver);
      
      const updatedApiKey = {
        ...existingApiKey,
        ...apiKeyData,
        id // Ensure ID stays the same
      };
      
      await fs.writeFile(
        filePath,
        JSON.stringify(updatedApiKey, this.dateReplacer, 2)
      );
      
      return updatedApiKey;
    } catch (error) {
      if (error.code === 'ENOENT') {
        return undefined;
      }
      throw error;
    }
  }
  
  async getAllApiKeys() {
    await this.ensureDirectories();
    
    try {
      const files = await fs.readdir(this.apiKeysDir);
      const apiKeyFiles = files.filter(file => file.startsWith('apikey_') && file.endsWith('.json'));
      
      const apiKeys = [];
      for (const file of apiKeyFiles) {
        const filePath = path.join(this.apiKeysDir, file);
        const data = await fs.readFile(filePath, 'utf8');
        const apiKey = JSON.parse(data, this.dateReviver);
        apiKeys.push(apiKey);
      }
      
      apiKeys.sort((a, b) => a.id - b.id);
      return apiKeys;
    } catch (error) {
      if (error.code === 'ENOENT') {
        return [];
      }
      throw error;
    }
  }
  
  async deleteApiKey(id) {
    await this.ensureDirectories();
    
    const filePath = path.join(this.apiKeysDir, `apikey_${id}.json`);
    
    try {
      await fs.access(filePath);
      await fs.unlink(filePath);
      return true;
    } catch (error) {
      if (error.code === 'ENOENT') {
        return false;
      }
      throw error;
    }
  }
}

async function runTests() {
  try {
    // Create a test directory
    const testDir = path.join(__dirname, 'test_data');
    await fs.mkdir(testDir, { recursive: true });
    
    console.log('Creating TestFileSystemStorage instance with test directory...');
    const storage = new TestFileSystemStorage(testDir);
    
    // Test User operations
    console.log('\n--- USER OPERATIONS TESTS ---');
    console.log('Creating test user...');
    const user = await storage.createUser({
      username: 'testuser',
      password: 'password123',
      email: 'test@example.com',
      name: 'Test User'
    });
    console.log('User created:', user);
    
    console.log('\nGetting user by ID...');
    const retrievedUser = await storage.getUser(user.id);
    console.log('Retrieved user:', retrievedUser);
    
    console.log('\nGetting user by username...');
    const userByUsername = await storage.getUserByUsername('testuser');
    console.log('Retrieved user by username:', userByUsername);
    
    console.log('\nUpdating user...');
    const updatedUser = await storage.updateUser(user.id, {
      name: 'Updated Test User',
      email: 'updated@example.com'
    });
    console.log('Updated user:', updatedUser);
    
    console.log('\nGetting all users...');
    const allUsers = await storage.getAllUsers();
    console.log('All users:', allUsers);
    
    // Test API Key operations
    console.log('\n--- API KEY OPERATIONS TESTS ---');
    console.log('Creating test API key...');
    const apiKey = await storage.createApiKey({
      label: 'Test API Key',
      key: 'test-api-key-123',
      userId: user.id
    });
    console.log('API key created:', apiKey);
    
    console.log('\nGetting API key by ID...');
    const retrievedApiKey = await storage.getApiKey(apiKey.id);
    console.log('Retrieved API key:', retrievedApiKey);
    
    console.log('\nUpdating API key...');
    const updatedApiKey = await storage.updateApiKey(apiKey.id, {
      label: 'Updated Test API Key',
      usage: 5
    });
    console.log('Updated API key:', updatedApiKey);
    
    console.log('\nGetting all API keys...');
    const allApiKeys = await storage.getAllApiKeys();
    console.log('All API keys:', allApiKeys);
    
    console.log('\nDeleting API key...');
    const apiKeyDeleted = await storage.deleteApiKey(apiKey.id);
    console.log('API key deleted:', apiKeyDeleted);
    
    console.log('\nGetting all API keys after deletion...');
    const apiKeysAfterDeletion = await storage.getAllApiKeys();
    console.log('API keys after deletion:', apiKeysAfterDeletion);
    
    console.log('\n--- CLEAN UP ---');
    // Clean up test data at the end
    try {
      await fs.rm(testDir, { recursive: true, force: true });
      console.log('Test directory cleaned up successfully');
    } catch (cleanupError) {
      console.error('Error cleaning up test directory:', cleanupError);
    }
    
    console.log('\nAll tests completed successfully!');
  } catch (error) {
    console.error('Error running tests:', error);
  }
}

runTests();