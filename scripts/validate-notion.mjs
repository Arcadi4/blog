#!/usr/bin/env node

// Simple Notion content validation script
// Uses dynamic import() to load the Notion data layer

import { register } from 'node:module';

// Register mock for server-only before importing Notion modules
const mockUrl = new URL('./mocks/server-only.mjs', import.meta.url).href;
register(mockUrl, import.meta.url);

async function main() {
  try {
    // Dynamic import of Notion data layer
    const { getContentIndex } = await import('../src/lib/notion/content.ts');

    const { articles, translations } = await getContentIndex();

    console.log('=== Notion Content Validation ===');
    console.log(`Total articles count: ${articles.length}`);
    console.log(`Total translations count: ${translations.length}`);

    console.log('\n✅ Validation passed');
    process.exit(0);
  } catch (error) {
    if (error.name === 'NotionValidationError') {
      console.error('\n❌ Validation failed:');
      console.error(`  Error: ${error.message}`);
      if (error.pageTitle) {
        console.error(`  Page title: ${error.pageTitle}`);
      }
      if (error.pageId) {
        console.error(`  Page ID: ${error.pageId}`);
      }
      if (error.propertyName) {
        console.error(`  Property: ${error.propertyName}`);
      }
    } else {
      console.error('\n❌ Unexpected error:', error.message);
    }
    process.exit(1);
  }
}

main();
