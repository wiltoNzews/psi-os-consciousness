import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read the storage.ts file
const filePath = path.join(__dirname, 'server/storage.ts');
let content = fs.readFileSync(filePath, 'utf8');

// Replace all remaining direct occurences of new Date() with this.dateHandler.createDate()
const updatedContent = content.replace(/: new Date\(\)/g, ': this.dateHandler.createDate()');
const finalContent = updatedContent.replace(/= new Date\(\);/g, '= this.dateHandler.createDate();');

// Write the file back
fs.writeFileSync(filePath, finalContent);

console.log('All inline date instances have been updated');

// Count the number of replacements
const assignmentReplacements = (content.match(/= new Date\(\);/g) || []).length;
const propertyReplacements = (content.match(/: new Date\(\)/g) || []).length;

console.log(`Replaced ${propertyReplacements} property assignments and ${assignmentReplacements} variable assignments`);