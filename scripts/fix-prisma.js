// Script to fix Prisma generation issues on Windows
// Run with: node scripts/fix-prisma.js

import { execSync } from 'child_process';
import { existsSync, rmSync } from 'fs';
import { join } from 'path';

const prismaClientPath = join(process.cwd(), 'node_modules', '.prisma', 'client');

console.log('🔧 Fixing Prisma client generation...\n');

try {
  // Step 1: Try to find and kill any Node processes that might be using Prisma
  console.log('1. Checking for running Node processes...');
  try {
    const processes = execSync('tasklist /FI "IMAGENAME eq node.exe" /FO CSV', { encoding: 'utf-8' });
    if (processes.includes('node.exe')) {
      console.log('   ⚠️  Found running Node processes.');
      console.log('   Please close your dev server (npm run dev) and any other Node processes.');
      console.log('   Or run this command manually:');
      console.log('   taskkill /F /IM node.exe');
    } else {
      console.log('   ✅ No Node processes found.');
    }
  } catch (e) {
    console.log('   ℹ️  Could not check for Node processes.');
  }

  // Step 2: Remove .prisma folder if it exists
  console.log('\n2. Cleaning Prisma client cache...');
  if (existsSync(prismaClientPath)) {
    try {
      rmSync(prismaClientPath, { recursive: true, force: true });
      console.log('   ✅ Removed .prisma/client folder');
    } catch (e) {
      console.log('   ⚠️  Could not remove .prisma/client folder');
      console.log('   Please close all Node processes and try again.');
      console.log('   Or manually delete: node_modules/.prisma/client');
    }
  } else {
    console.log('   ℹ️  .prisma/client folder does not exist');
  }

  // Step 3: Generate Prisma client
  console.log('\n3. Generating Prisma client...');
  execSync('npx prisma generate', { stdio: 'inherit' });
  console.log('\n✅ Prisma client generated successfully!');

} catch (error) {
  console.error('\n❌ Error:', error.message);
  console.log('\n💡 Manual steps:');
  console.log('1. Close all Node processes (stop dev server, etc.)');
  console.log('2. Close your IDE/editor');
  console.log('3. Delete: node_modules/.prisma/client');
  console.log('4. Run: npm run prisma:generate');
  console.log('\nAlternatively, restart your computer and try again.');
}

