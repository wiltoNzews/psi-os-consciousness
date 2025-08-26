/**
 * Simple verification script for storage interface implementation
 * 
 * This script checks if the MemStorage class properly implements all methods
 * defined in the IStorage interface.
 */
import * as fs from 'fs/promises';
import * as path from 'path';

async function checkStorageImplementation(storagePath) {
    console.log(`Checking storage implementation in: ${storagePath}`);
    
    try {
        const content = await fs.readFile(storagePath, 'utf-8');
        const lines = content.split('\n');
        
        // Find all methods in the IStorage interface
        console.log('Extracting IStorage interface methods...');
        const interfaceMethods = [];
        let insideInterface = false;
        let bracketCount = 0;
        
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();
            
            // Check if we've found the interface
            if (line.includes('interface IStorage')) {
                insideInterface = true;
                bracketCount = 0;
                continue;
            }
            
            if (insideInterface) {
                // Count brackets to know when we're out of the interface
                if (line.includes('{')) bracketCount++;
                if (line.includes('}')) bracketCount--;
                
                // If bracketCount reaches 0, we're out of the interface
                if (bracketCount < 0) {
                    insideInterface = false;
                    continue;
                }
                
                // Look for method definitions
                const methodMatch = line.match(/^\s*(\w+)\s*\(/);
                if (methodMatch) {
                    interfaceMethods.push(methodMatch[1]);
                }
            }
        }
        
        console.log(`Found ${interfaceMethods.length} methods in IStorage interface`);
        if (interfaceMethods.length > 0) {
            console.log('Sample methods:', interfaceMethods.slice(0, 5));
        }
        
        // Find all implemented methods in the MemStorage class
        console.log('Extracting MemStorage implemented methods...');
        const implementedMethods = [];
        let insideClass = false;
        
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();
            
            // Check if we've found the class
            if (line.includes('class MemStorage') && line.includes('implements IStorage')) {
                insideClass = true;
                continue;
            }
            
            if (insideClass) {
                // Look for method implementations
                const methodMatch = line.match(/^\s*async\s+(\w+)\s*\(/);
                if (methodMatch) {
                    implementedMethods.push(methodMatch[1]);
                }
            }
        }
        
        console.log(`Found ${implementedMethods.length} implemented methods in MemStorage class`);
        if (implementedMethods.length > 0) {
            console.log('Sample implementations:', implementedMethods.slice(0, 5));
        }
        
        // Find missing methods
        const missingMethods = interfaceMethods.filter(
            method => !implementedMethods.includes(method)
        );
        
        if (missingMethods.length > 0) {
            console.log(`Missing ${missingMethods.length} methods:`, missingMethods);
            return {
                passed: false,
                message: `MemStorage is missing implementations for methods: ${missingMethods.join(', ')}`,
                missingMethods
            };
        }
        
        return { 
            passed: true, 
            message: "MemStorage fully implements the IStorage interface" 
        };
        
    } catch (error) {
        return {
            passed: false,
            message: `Error reading file: ${error.message}`
        };
    }
}

// Main execution
const storagePath = process.argv[2] || '../storage.ts';

// Resolve the module path relative to the current directory
const absoluteStoragePath = path.resolve(process.cwd(), storagePath);

// Run the verification
checkStorageImplementation(absoluteStoragePath)
    .then(result => {
        console.log(JSON.stringify(result, null, 2));
        process.exit(result.passed ? 0 : 1);
    })
    .catch(error => {
        console.error("Verification failed:", error);
        process.exit(1);
    });