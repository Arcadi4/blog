#!/usr/bin/env node
import { NotionValidationError } from './lib/validation-shared';
import { getAllArticles } from './lib/validate-articles';
import { getAllTranslations } from './lib/validate-translations';

async function main() {
    try {
        const articles = await getAllArticles();
        const translations = await getAllTranslations();
        console.log('=== Notion Content Validation ===');
        console.log(`Publishable articles count: ${articles.length}`);
        console.log(`Completed translations count: ${translations.length}`);
        console.log('\n✅ Validation passed');
        process.exit(0);
    } catch (error: NotionValidationError | unknown) {
        if (error instanceof NotionValidationError) {
            console.error('\n❌ Validation failed:');
            console.error(`  Error: ${error.message}`);
            if (error.pageTitle) console.error(`  Page title: ${error.pageTitle}`);
            if (error.pageId) console.error(`  Page ID: ${error.pageId}`);
            if (error.propertyName) console.error(`  Property: ${error.propertyName}`);
        } else {
            console.error('\n❌ Unexpected error:', error);
        }
        process.exit(1);
    }
}
main();