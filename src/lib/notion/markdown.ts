// Validation moved to build-time: scripts/lib/validate-markdown.ts

import { remark } from "remark";
import html from "remark-html";
import type { PageMarkdown } from "./client";

export async function convertMarkdownToHtml(
  pageMarkdown: PageMarkdown,
): Promise<string> {
  const result = await remark().use(html).process(pageMarkdown.markdown);
  return result.toString();
}
