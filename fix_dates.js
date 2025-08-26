import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read the storage.ts file
const filePath = path.join(__dirname, 'server/storage.ts');
let content = fs.readFileSync(filePath, 'utf8');

// Replace all occurrences of createdAt: new Date() with createdAt: this.dateHandler.createDate()
const updatedContent = content.replace(/createdAt: new Date\(\)/g, 'createdAt: this.dateHandler.createDate()');

// Write the file back
fs.writeFileSync(filePath, updatedContent);

console.log('All date creations have been updated');

// Count the number of replacements
const originalCount = (content.match(/createdAt: new Date\(\)/g) || []).length;
const updatedCount = (updatedContent.match(/createdAt: this.dateHandler.createDate\(\)/g) || []).length;

console.log(`Replaced ${originalCount} occurrences of "createdAt: new Date()" with "createdAt: this.dateHandler.createDate()"`);
