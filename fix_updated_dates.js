import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read the storage.ts file
const filePath = path.join(__dirname, 'server/storage.ts');
let content = fs.readFileSync(filePath, 'utf8');

// Replace all occurrences of updatedAt: new Date() with updatedAt: this.dateHandler.createDate()
const updatedContent = content.replace(/updatedAt: new Date\(\)/g, 'updatedAt: this.dateHandler.createDate()');

// Write the file back
fs.writeFileSync(filePath, updatedContent);

console.log('All updatedAt dates have been updated');

// Count the number of replacements
const originalCount = (content.match(/updatedAt: new Date\(\)/g) || []).length;
const updatedCount = (updatedContent.match(/updatedAt: this.dateHandler.createDate\(\)/g) || []).length;

console.log(`Replaced ${originalCount} occurrences of "updatedAt: new Date()" with "updatedAt: this.dateHandler.createDate()"`);
