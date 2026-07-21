import { defaultSchema } from "rehype-sanitize"

/**
 * HTML elements preserved from Notion's escaped Markdown export.
 *
 * They are semantic, require no attributes, and are restored by
 * `normalizeNotionMarkdown` before the shared sanitizer processes them.
 */
const supportedInlineHtmlTags = ["sub", "sup", "u"]

export const notionMarkdownSanitizationSchema = {
  ...defaultSchema,
  tagNames: [...(defaultSchema.tagNames ?? []), ...supportedInlineHtmlTags]
}

const fencedCodeStart = /^ {0,3}(`{3,}|~{3,})/
const notionTableStart = /^<table(?:\s[^>]*)?>$/
const htmlBlockEnd = /^<\/(?:details|table)>$/
const notionTableRow = /<tr>\s*([\s\S]*?)\s*<\/tr>/g
const notionTableCell = /<td>\s*([\s\S]*?)\s*<\/td>/g
const escapedInlineHtmlTag = new RegExp(
  String.raw`(?:\\<|&lt;)(\/?(?:${supportedInlineHtmlTags.join("|")}))\\?>`,
  "gi"
)
const markdownEscapablePunctuation = new Set(
  `!"#$%&'()*+,-./:;<=>?@[\\]^_\`{|}~`
)

function restoreNotionInlineSyntax(line: string): string {
  return line
    .replace(escapedInlineHtmlTag, "<$1>")
    .replace(/\\\\(.)/g, (escape, character) =>
      markdownEscapablePunctuation.has(character) ? `\\${character}` : escape
    )
}

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

/**
 * Converts the small, known set of Notion Markdown export deviations into
 * ordinary Markdown. Fenced code is copied verbatim.
 */
export function normalizeNotionMarkdown(markdown: string): string {
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

    const normalizedLine = restoreNotionInlineSyntax(line)
    if (notionTableStart.test(normalizedLine.trim())) {
      const tableLines = [normalizedLine]
      let end = index + 1
      while (end < lines.length) {
        const tableLine = restoreNotionInlineSyntax(lines[end])
        tableLines.push(tableLine)
        if (tableLine.trim() === "</table>") break
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

    normalized.push(normalizedLine)
    if (htmlBlockEnd.test(normalizedLine.trim()) && lines[index + 1] !== "") {
      normalized.push("")
    }
  }

  return normalized.join("\n")
}
