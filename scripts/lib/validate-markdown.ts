import rehypeShikiFromHighlighter from "@shikijs/rehype/core"
import type { Parent, Root, RootContent } from "mdast"
import rehypeRaw from "rehype-raw"
import rehypeSanitize, { defaultSchema } from "rehype-sanitize"
import rehypeStringify from "rehype-stringify"
import remarkDirective from "remark-directive"
import remarkGfm from "remark-gfm"
import remarkParse from "remark-parse"
import remarkRehype from "remark-rehype"
import { createHighlighter } from "shiki"
import { type Plugin, unified } from "unified"
import type { PageMarkdown } from "../../src/lib/notion/client"
import { NotionValidationError } from "./validation-shared"

export const EXPIRING_ASSET_PATTERNS = [
  /secure\.notion-static\.com/,
  /s3\.us-west.*notion/i
]

export type MarkdownCompiler = {
  compile(
    pageMarkdown: PageMarkdown,
    pageId: string,
    context?: {
      pageTitle?: string
      propertyName?: string
    }
  ): Promise<string>
  dispose(): void
}

const reservedDirectiveTypes = new Set([
  "textDirective",
  "leafDirective",
  "containerDirective"
])

// Keep the sanitizer's default restrictions while preserving the small set of
// semantic inline HTML tags that Notion's Markdown export may emit.
const markdownSanitizationSchema = {
  ...defaultSchema,
  tagNames: [...(defaultSchema.tagNames ?? []), "sub", "sup", "u"]
}

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

const fencedCodeStart = /^ {0,3}(`{3,}|~{3,})/
const notionTableStart = /^<table(?:\s[^>]*)?>$/
const htmlBlockEnd = /^<\/(?:details|table)>$/
const notionTableRow = /<tr>\s*([\s\S]*?)\s*<\/tr>/g
const notionTableCell = /<td>\s*([\s\S]*?)\s*<\/td>/g
const escapedInlineHtmlTag = /(?:\\<|&lt;)(\/?(?:sub|sup|u))\\?>/gi

function notionTableToGfm(lines: string[]): string[] | undefined {
  if (!/\bheader-row=(?:"true"|'true')/.test(lines[0])) return

  const rows = [...lines.join("\n").matchAll(notionTableRow)].map((row) =>
    [...row[1].matchAll(notionTableCell)].map((cell) =>
      cell[1].trim().replaceAll("\n", "<br>").replaceAll("|", "\\|")
    )
  )
  const columnCount = rows[0]?.length
  if (!columnCount || rows.some((row) => row.length !== columnCount)) {
    return
  }

  const formatRow = (row: string[]) => `| ${row.join(" | ")} |`
  return [
    formatRow(rows[0]),
    formatRow(Array.from({ length: columnCount }, () => "---")),
    ...rows.slice(1).map(formatRow)
  ]
}

function normalizeTableHeader(lines: string[]): string[] {
  const headerRow = /\bheader-row=(?:"true"|'true')/.test(lines[0])
  const normalized = [...lines]
  normalized[0] = normalized[0].replace(/\sheader-row=(?:"[^"]*"|'[^']*')/, "")

  if (!headerRow) return normalized

  let inHeaderRow = false
  for (let index = 1; index < normalized.length; index++) {
    const trimmed = normalized[index].trim()
    if (!inHeaderRow && trimmed === "<tr>") {
      inHeaderRow = true
      continue
    }

    if (inHeaderRow && trimmed === "</tr>") break
    if (inHeaderRow) {
      normalized[index] = normalized[index]
        .replaceAll("<td>", "<th>")
        .replaceAll("</td>", "</th>")
    }
  }

  return normalized
}

function normalizeNotionMarkdown(markdown: string): string {
  const lines = markdown.split("\n")
  const normalized: string[] = []
  let fence: { character: string; length: number } | undefined

  for (let index = 0; index < lines.length; index++) {
    const line = lines[index]
    const fenceMatch = fencedCodeStart.exec(line)

    if (fence) {
      normalized.push(line)
      if (
        fenceMatch?.[1][0] === fence.character &&
        fenceMatch[1].length >= fence.length &&
        line.slice(fenceMatch[0].length).trim() === ""
      ) {
        fence = undefined
      }
      continue
    }

    if (fenceMatch) {
      fence = {
        character: fenceMatch[1][0],
        length: fenceMatch[1].length
      }
      normalized.push(line)
      continue
    }

    if (notionTableStart.test(line.trim())) {
      const tableLines = [line]
      let end = index + 1
      while (end < lines.length) {
        tableLines.push(lines[end])
        if (lines[end].trim() === "</table>") break
        end++
      }

      if (tableLines.at(-1)?.trim() === "</table>") {
        if (normalized.at(-1) !== "") normalized.push("")
        normalized.push(
          ...(notionTableToGfm(tableLines) ?? normalizeTableHeader(tableLines))
        )
        if (lines[end + 1] !== "") normalized.push("")
        index = end
        continue
      }
    }

    normalized.push(line)
    if (htmlBlockEnd.test(line.trim()) && lines[index + 1] !== "") {
      normalized.push("")
    }
  }

  // Notion escapes these supported inline HTML tags in its Markdown export.
  // Restore only their attribute-free forms; the sanitizer still rejects every
  // other raw HTML element and all attributes.
  return normalized.join("\n").replace(escapedInlineHtmlTag, "<$1>")
}

function validationContext(
  pageId: string,
  context: {
    readonly pageTitle?: string
    readonly propertyName?: string
  }
) {
  return {
    pageId,
    pageTitle: context.pageTitle,
    propertyName: context.propertyName
  }
}

function contextSuffix(
  pageId: string,
  context: {
    readonly pageTitle?: string
    readonly propertyName?: string
  }
): string {
  return `(pageTitle=${context.pageTitle ?? pageId}, pageId=${pageId}, property=${context.propertyName ?? "markdown"})`
}

function validateMarkdown(
  pageMarkdown: PageMarkdown,
  pageId: string,
  context: {
    readonly pageTitle?: string
    readonly propertyName?: string
  }
): void {
  const warnings = pageMarkdown.warnings
  if (warnings?.truncated) {
    throw new NotionValidationError(
      `Page content was truncated ${contextSuffix(pageId, context)}`,
      validationContext(pageId, context)
    )
  }

  const unknownBlockIds = warnings?.unknown_block_ids
  if (unknownBlockIds?.length) {
    throw new NotionValidationError(
      `Unknown block types: ${unknownBlockIds.join(", ")} ${contextSuffix(pageId, context)}`,
      validationContext(pageId, context)
    )
  }

  for (const pattern of EXPIRING_ASSET_PATTERNS) {
    if (pattern.test(pageMarkdown.markdown)) {
      throw new NotionValidationError(
        `Markdown contains expiring Notion-hosted asset URLs ${contextSuffix(pageId, context)}`,
        validationContext(pageId, context)
      )
    }
  }
}

export async function createMarkdownCompiler(): Promise<MarkdownCompiler> {
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
    .use(rehypeSanitize, markdownSanitizationSchema)
    .use(rehypeShikiFromHighlighter, highlighter, {
      theme: "one-dark-pro",
      defaultLanguage: "plaintext",
      fallbackLanguage: "plaintext",
      lazy: true
    })
    .use(rehypeStringify)

  const compile: MarkdownCompiler["compile"] = async (
    pageMarkdown,
    pageId,
    context = {}
  ) => {
    validateMarkdown(pageMarkdown, pageId, context)

    try {
      const result = await processor.process(
        normalizeNotionMarkdown(pageMarkdown.markdown)
      )
      return result.toString()
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      throw new NotionValidationError(
        `Markdown compilation failed: ${message} ${contextSuffix(pageId, context)}`,
        validationContext(pageId, context)
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
