import rehypeShikiFromHighlighter from "@shikijs/rehype/core";
import type { Parent, Root, RootContent } from "mdast";
import rehypeSanitize from "rehype-sanitize";
import rehypeStringify from "rehype-stringify";
import remarkDirective from "remark-directive";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { createHighlighter } from "shiki";
import { unified } from "unified";
import type { PageMarkdown } from "../../src/lib/notion/client";
import { NotionValidationError } from "./validation-shared";

export const EXPIRING_ASSET_PATTERNS = [
  /secure\.notion-static\.com/,
  /s3\.us-west.*notion/i,
];

export type MarkdownCompiler = {
  compile(
    pageMarkdown: PageMarkdown,
    pageId: string,
    context?: {
      pageTitle?: string;
      propertyName?: string;
    },
  ): Promise<string>;
  dispose(): void;
};

const reservedDirectiveTypes = new Set([
  "textDirective",
  "leafDirective",
  "containerDirective",
]);

function isParent(node: RootContent): node is RootContent & Parent {
  return "children" in node;
}

function removeDirectives(parent: Parent): void {
  parent.children = parent.children.filter((child) => {
    if (reservedDirectiveTypes.has(child.type)) return false;
    if (isParent(child)) removeDirectives(child);
    return true;
  });
}

function removeReservedDirectives() {
  return (tree: Root): void => {
    removeDirectives(tree);
  };
}

function validationContext(
  pageId: string,
  context: {
    readonly pageTitle?: string;
    readonly propertyName?: string;
  },
) {
  return {
    pageId,
    pageTitle: context.pageTitle,
    propertyName: context.propertyName,
  };
}

function contextSuffix(
  pageId: string,
  context: {
    readonly pageTitle?: string;
    readonly propertyName?: string;
  },
): string {
  return `(pageTitle=${context.pageTitle ?? pageId}, pageId=${pageId}, property=${context.propertyName ?? "markdown"})`;
}

function validateMarkdown(
  pageMarkdown: PageMarkdown,
  pageId: string,
  context: {
    readonly pageTitle?: string;
    readonly propertyName?: string;
  },
): void {
  const warnings = pageMarkdown.warnings;
  if (warnings?.truncated) {
    throw new NotionValidationError(
      `Page content was truncated ${contextSuffix(pageId, context)}`,
      validationContext(pageId, context),
    );
  }

  const unknownBlockIds = warnings?.unknown_block_ids;
  if (unknownBlockIds?.length) {
    throw new NotionValidationError(
      `Unknown block types: ${unknownBlockIds.join(", ")} ${contextSuffix(pageId, context)}`,
      validationContext(pageId, context),
    );
  }

  for (const pattern of EXPIRING_ASSET_PATTERNS) {
    if (pattern.test(pageMarkdown.markdown)) {
      throw new NotionValidationError(
        `Markdown contains expiring Notion-hosted asset URLs ${contextSuffix(pageId, context)}`,
        validationContext(pageId, context),
      );
    }
  }
}

export async function createMarkdownCompiler(): Promise<MarkdownCompiler> {
  const highlighter = await createHighlighter({
    themes: ["one-dark-pro"],
    langs: ["plaintext"],
  });
  const processor = unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkDirective)
    .use(removeReservedDirectives)
    .use(remarkRehype)
    .use(rehypeSanitize)
    .use(rehypeShikiFromHighlighter, highlighter, {
      theme: "one-dark-pro",
      defaultLanguage: "plaintext",
      fallbackLanguage: "plaintext",
      lazy: true,
    })
    .use(rehypeStringify);

  const compile: MarkdownCompiler["compile"] = async (
    pageMarkdown,
    pageId,
    context = {},
  ) => {
    validateMarkdown(pageMarkdown, pageId, context);

    try {
      const result = await processor.process(pageMarkdown.markdown);
      return result.toString();
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      throw new NotionValidationError(
        `Markdown compilation failed: ${message} ${contextSuffix(pageId, context)}`,
        validationContext(pageId, context),
      );
    }
  };

  return {
    compile,
    dispose: () => {
      highlighter.dispose();
    },
  };
}
