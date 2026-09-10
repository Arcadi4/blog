import type { Heading, Root, RootContent } from "mdast"
import remarkGfm from "remark-gfm"
import remarkParse from "remark-parse"
import type { Plugin } from "unified"
import { unified } from "unified"

export type TocItem = {
  readonly id: string
  readonly label: string
}

type HeadingData = {
  hProperties?: Record<string, string>
}

function textOf(node: RootContent): string {
  if ("value" in node && typeof node.value === "string") return node.value
  if ("children" in node) return node.children.map(textOf).join("")
  return ""
}

function labelOf(node: Heading): string {
  return textOf(node)
    .replace(/<[^>]+>/g, "")
    .replace(/\s+/g, " ")
    .trim()
}

function headingSlug(label: string): string {
  return label
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w\u4e00-\u9fff-]+/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 48)
}

function collectHeadings(root: Root): Heading[] {
  const headings: Heading[] = []

  const walk = (node: Root | RootContent) => {
    if (node.type === "heading") headings.push(node)
    if ("children" in node) for (const child of node.children) walk(child)
  }

  walk(root)
  return headings
}

/**
 * Anchors every heading the article reader links against and returns the
 * matching table of contents, so an id and its entry can never drift apart.
 * Deeper documents index `h2`/`h3`; linear ones fall back to `h1`.
 */
export function assignHeadingAnchors(root: Root): TocItem[] {
  const candidates = collectHeadings(root).flatMap((node) => {
    const label = labelOf(node)
    return label ? [{ node, label }] : []
  })
  const deep = candidates.filter(
    ({ node }) => node.depth === 2 || node.depth === 3
  )
  const indexed =
    deep.length > 0 ? deep : candidates.filter(({ node }) => node.depth === 1)

  return indexed.map(({ node, label }, index) => {
    const id = `${headingSlug(label) || "section"}-${index}`
    const data = (node.data ??= {}) as HeadingData
    data.hProperties = { ...data.hProperties, id }
    return { id, label }
  })
}

export const remarkHeadingAnchors: Plugin<[], Root> = () => (root) => {
  assignHeadingAnchors(root)
}

const tocParser = unified().use(remarkParse).use(remarkGfm)

export function parseToc(markdown: string): TocItem[] {
  return assignHeadingAnchors(tocParser.parse(markdown))
}
