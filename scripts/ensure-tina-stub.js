#!/usr/bin/env node
// Ensure Tina database client stub exists for production builds
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const stubPath = join(__dirname, '..', 'tina', '__generated__', 'databaseClient.ts');
const stubDir = dirname(stubPath);

// Create directory if it doesn't exist
if (!existsSync(stubDir)) {
  mkdirSync(stubDir, { recursive: true });
}

// Write stub file
const stubContent = `// Stub implementation for Tina database client (production builds only)
// The actual implementation is generated during local development
// This file exists to prevent build errors when using Tina Cloud

const databaseClient = null;
export default databaseClient;
`;

writeFileSync(stubPath, stubContent, 'utf-8');
console.log('✓ Tina database client stub created');
