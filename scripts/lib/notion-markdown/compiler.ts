import rehypeShikiFromHighlighter from "@shikijs/rehype/core"
import type { Parent, Root, RootContent } from "mdast"
import rehypeRaw from "rehype-raw"
import rehypeSanitize from "rehype-sanitize"
import rehypeStringify from "rehype-stringify"
import remarkDirective from "remark-directive"
import remarkGfm from "remark-gfm"
import remarkParse from "remark-parse"
import remarkRehype from "remark-rehype"
import { createHighlighter } from "shiki"
import { type Plugin, unified } from "unified"
import type { PageMarkdown } from "../../../src/lib/notion/client"
import { NotionValidationError } from "../validation-shared"
import {
  normalizeNotionMarkdown,
  notionMarkdownSanitizationSchema
} from "./source"
import {
  createMarkdownValidationContext,
  formatMarkdownContext,
  type MarkdownValidationContext,
  validateNotionMarkdown
} from "./validation"

export type NotionMarkdownCompiler = {
  compile(
    pageMarkdown: PageMarkdown,
    pageId: string,
    context?: MarkdownValidationContext
  ): Promise<string>
  dispose(): void
}

const reservedDirectiveTypes = new Set([
  "textDirective",
  "leafDirective",
  "containerDirective"
])

function isParent(node: RootContent): node is RootContent & Parent {
  return "children" in node
}

function removeDirectives(parent: Parent): void {
  parent.children = parent.children.filter((child) => {
    if (reservedDirectiveTypes.has(child.type)) return false
    if (isParent(child)) removeDirectives(child)
    return true
  })
}

function removeReservedDirectives() {
  return (tree: Root): void => {
    removeDirectives(tree)
  }
}

const disableSetextHeadings: Plugin = function () {
  const extensions = this.data("micromarkExtensions") ?? []
  this.data("micromarkExtensions", [
    ...extensions,
    { disable: { null: ["setextUnderline"] } }
  ])
}

export async function createNotionMarkdownCompiler(): Promise<NotionMarkdownCompiler> {
  const highlighter = await createHighlighter({
    themes: ["one-dark-pro"],
    langs: ["plaintext"]
  })
  const processor = unified()
    .use(disableSetextHeadings)
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkDirective)
    .use(removeReservedDirectives)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(rehypeSanitize, notionMarkdownSanitizationSchema)
    .use(rehypeShikiFromHighlighter, highlighter, {
      theme: "one-dark-pro",
      defaultLanguage: "plaintext",
      fallbackLanguage: "plaintext",
      lazy: true
    })
    .use(rehypeStringify)

  const compile: NotionMarkdownCompiler["compile"] = async (
    pageMarkdown,
    pageId,
    context = {}
  ) => {
    validateNotionMarkdown(pageMarkdown, pageId, context)

    try {
      const result = await processor.process(
        normalizeNotionMarkdown(pageMarkdown.markdown)
      )
      return result.toString()
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      throw new NotionValidationError(
        `Markdown compilation failed: ${message} ${formatMarkdownContext(pageId, context)}`,
        createMarkdownValidationContext(pageId, context)
      )
    }
  }

  return {
    compile,
    dispose: () => {
      highlighter.dispose()
    }
  }
}
