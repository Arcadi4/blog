import type { PageMarkdown } from "../../../src/lib/notion/client"
import { NotionValidationError } from "../validation-shared"

export const EXPIRING_ASSET_PATTERNS = [
  /secure\.notion-static\.com/,
  /s3\.us-west.*notion/i
]

export type MarkdownValidationContext = {
  readonly pageTitle?: string
  readonly propertyName?: string
}

export function createMarkdownValidationContext(
  pageId: string,
  context: MarkdownValidationContext
) {
  return {
    pageId,
    pageTitle: context.pageTitle,
    propertyName: context.propertyName
  }
}

export function formatMarkdownContext(
  pageId: string,
  context: MarkdownValidationContext
): string {
  return `(pageTitle=${context.pageTitle ?? pageId}, pageId=${pageId}, property=${context.propertyName ?? "markdown"})`
}

export function validateNotionMarkdown(
  pageMarkdown: PageMarkdown,
  pageId: string,
  context: MarkdownValidationContext
): void {
  const warnings = pageMarkdown.warnings
  if (warnings?.truncated) {
    throw new NotionValidationError(
      `Page content was truncated ${formatMarkdownContext(pageId, context)}`,
      createMarkdownValidationContext(pageId, context)
    )
  }

  const unknownBlockIds = warnings?.unknown_block_ids
  if (unknownBlockIds?.length) {
    throw new NotionValidationError(
      `Unknown block types: ${unknownBlockIds.join(", ")} ${formatMarkdownContext(pageId, context)}`,
      createMarkdownValidationContext(pageId, context)
    )
  }

  for (const pattern of EXPIRING_ASSET_PATTERNS) {
    if (pattern.test(pageMarkdown.markdown)) {
      throw new NotionValidationError(
        `Markdown contains expiring Notion-hosted asset URLs ${formatMarkdownContext(pageId, context)}`,
        createMarkdownValidationContext(pageId, context)
      )
    }
  }
}
