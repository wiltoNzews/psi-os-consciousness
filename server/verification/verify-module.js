// server/verification/verify-module.js
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { verifyModule } from './module-verifier.js';

// In ES modules, we need to create __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const modulePath = process.argv[2];

if (!modulePath) {
    console.error("Usage: node verify-module.js <modulePath>");
    process.exit(1);
}

// Resolve the module path relative to the current directory
const absoluteModulePath = path.resolve(process.cwd(), modulePath);

// Check if the file exists
if (!fs.existsSync(absoluteModulePath)) {
    console.error(`File not found: ${absoluteModulePath}`);
    process.exit(1);
}

console.log(`Verifying module: ${absoluteModulePath}`);

verifyModule(absoluteModulePath)
    .then(result => {
        console.log(JSON.stringify(result, null, 2));
        process.exit(result.overallPassed ? 0 : 1);
    })
    .catch(error => {
        console.error("Verification failed:", error);
        console.error(error.stack);
        process.exit(1);
    });