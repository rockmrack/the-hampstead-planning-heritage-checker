#!/usr/bin/env node
/**
 * Patch Next.js build utils to safely handle error logging
 * This prevents util.inspect errors when logging objects with undefined properties
 */

const fs = require('fs');
const path = require('path');

const utilsPath = path.join(__dirname, '..', 'node_modules', 'next', 'dist', 'build', 'utils.js');

if (!fs.existsSync(utilsPath)) {
  console.log('⚠️  Next.js utils.js not found, skipping patch');
  process.exit(0);
}

try {
  let content = fs.readFileSync(utilsPath, 'utf8');
  
  // Check if already patched
  if (content.includes('err instanceof Error ? err.message : String(err)')) {
    console.log('✅ Next.js utils.js already patched');
    process.exit(0);
  }
  
  // Pattern 1: Original unpatched code
  const originalPattern1 = /console\.error\(err\);\s*throw new Error\(`Failed to collect page data for \$\{page\}`\);/;
  
  // Pattern 2: Similar pattern with different spacing
  const originalPattern2 = /console\.error\(err\);\s+throw new Error\("Failed to collect page data for " \+ page\);/;
  
  const patchedCode = `try {
            console.error(err instanceof Error ? err.message : String(err));
        } catch {
            console.error("Failed to collect page data");
        }
        throw new Error(\`Failed to collect page data for \${page}\`);`;
  
  let patched = false;
  
  if (originalPattern1.test(content)) {
    content = content.replace(originalPattern1, patchedCode);
    patched = true;
  } else if (originalPattern2.test(content)) {
    content = content.replace(originalPattern2, patchedCode);
    patched = true;
  }
  
  if (patched) {
    fs.writeFileSync(utilsPath, content, 'utf8');
    console.log('✅ Successfully patched Next.js utils.js');
  } else {
    console.log('⚠️  Could not find target code to patch, Next.js version might be different or already manually patched');
  }
} catch (error) {
  console.error('❌ Error patching Next.js:', error.message);
  process.exit(1);
}
