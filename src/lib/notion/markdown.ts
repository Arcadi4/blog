import { remark } from 'remark';
import html from 'remark-html';
import type { PageMarkdown } from './client';
import { NotionValidationError } from './types';

const EXPIRING_ASSET_PATTERNS = [
  /secure\.notion-static\.com/,
  /s3\.us-west.*notion/i,
];

export async function convertMarkdownToHtml(
  pageMarkdown: PageMarkdown,
  pageId: string,
  context: { pageTitle?: string; propertyName?: string } = {}
): Promise<string> {
  if (pageMarkdown.warnings.truncated) {
    throw new NotionValidationError(
      `Page content was truncated (pageTitle=${context.pageTitle ?? pageId}, pageId=${pageId}, property=${context.propertyName ?? 'markdown'})`,
      { pageId, pageTitle: context.pageTitle, propertyName: context.propertyName }
    );
  }

  if (pageMarkdown.warnings.unknown_block_ids?.length) {
    throw new NotionValidationError(
      `Unknown block types: ${pageMarkdown.warnings.unknown_block_ids.join(', ')} (pageTitle=${context.pageTitle ?? pageId}, pageId=${pageId}, property=${context.propertyName ?? 'markdown'})`,
      { pageId, pageTitle: context.pageTitle, propertyName: context.propertyName }
    );
  }

  for (const pattern of EXPIRING_ASSET_PATTERNS) {
    if (pattern.test(pageMarkdown.markdown)) {
      throw new NotionValidationError(
        `Markdown contains expiring Notion-hosted asset URLs (pageTitle=${context.pageTitle ?? pageId}, pageId=${pageId}, property=${context.propertyName ?? 'markdown'})`,
        { pageId, pageTitle: context.pageTitle, propertyName: context.propertyName }
      );
    }
  }

  const result = await remark().use(html).process(pageMarkdown.markdown);
  return result.toString();
}
