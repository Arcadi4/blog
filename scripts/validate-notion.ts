#!/usr/bin/env node
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { loadEnvFile } from "node:process";

if (!process.env.VERCEL_ENV) {
  loadEnvFile(".env");
}

async function main() {
  const [
    { NotionValidationError },
    { getAllArticles },
    { getAllTranslations },
  ] = await Promise.all([
    import("./lib/validation-shared"),
    import("./lib/validate-articles"),
    import("./lib/validate-translations"),
  ]);

  try {
    const articles = await getAllArticles();
    const translations = await getAllTranslations();
    const generatedPath = join(
      process.cwd(),
      "src/generated/content-index.json",
    );

    await mkdir(join(process.cwd(), "src/generated"), { recursive: true });
    await writeFile(
      generatedPath,
      `${JSON.stringify({ articles, translations }, null, 2)}\n`,
    );

    console.log("=== Notion Content Validation ===");
    console.log(`Publishable articles count: ${articles.length}`);
    console.log(`Completed translations count: ${translations.length}`);
    console.log(`Generated content index: ${generatedPath}`);
    console.log("\n✅ Validation passed");
    process.exit(0);
  } catch (error) {
    if (error instanceof NotionValidationError) {
      console.error("\n❌ Validation failed:");
      console.error(`  Error: ${error.message}`);
      if (error.pageTitle) console.error(`  Page title: ${error.pageTitle}`);
      if (error.pageId) console.error(`  Page ID: ${error.pageId}`);
      if (error.propertyName)
        console.error(`  Property: ${error.propertyName}`);
    } else {
      console.error("\n❌ Unexpected error:", error);
    }
    process.exit(1);
  }
}
void main();
