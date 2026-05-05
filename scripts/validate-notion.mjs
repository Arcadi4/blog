#!/usr/bin/env node

// Simple validation: just try to build and check for errors
import { execSync } from 'child_process';

console.log('Validating Notion content via Next.js build check...\n');

if (!process.env.NOTION_API_KEY) {
  console.error('❌ NOTION_API_KEY not set');
  process.exit(1);
}

try {
  execSync('yarn build', { stdio: 'inherit' });
  console.log('\n✅ Validation passed - build successful');
  process.exit(0);
  } catch (err) {
    console.error('Validation failed:', err.message);
    process.exit(1);
  }
