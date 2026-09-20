import rehypeShikiFromHighlighter from "@shikijs/rehype/core"
import rehypeKatex from "rehype-katex"
import remarkMath from "remark-math"
import { createHighlighter } from "shiki"
import { defineConfig, s } from "velite"
import { gfmFootnote } from "micromark-extension-gfm-footnote"
import { gfmFootnoteFromMarkdown } from "mdast-util-gfm-footnote"
import type { Plugin } from "unified"
import { parseToc, remarkHeadingAnchors, type TocItem } from "./src/lib/toc"

/**
 * remark-gfm omits footnotes, so the official GFM footnote extensions are
 * wired in directly; MDX's mdast-util-to-hast pass renders the endnote
 * section and the reference/backref links from the resulting nodes.
 */
const remarkFootnotes: Plugin = function () {
  const data = this.data()
  data.micromarkExtensions ??= []
  data.micromarkExtensions.push(gfmFootnote())
  data.fromMarkdownExtensions ??= []
  data.fromMarkdownExtensions.push(gfmFootnoteFromMarkdown())
}

const highlighter = await createHighlighter({
  themes: ["one-dark-pro"],
  langs: ["plaintext"]
})

// `s.toc()` re-parses the body without our remark plugins and would emit ids
// that disagree with the anchors above, so the entries come from the same pass.
const toc = s
  .custom<TocItem[] | undefined>(
    (value) => value === undefined || typeof value === "string"
  )
  .transform((_value, { meta }) => parseToc(meta.content ?? ""))

export default defineConfig({
  root: "content",
  output: {
    data: "src/generated/velite"
  },
  collections: {
    posts: {
      name: "Post",
      pattern: "posts/**/*.mdx",
      schema: s.object({
        title: s.string(),
        slug: s.slug("posts"),
        excerpt: s.string(),
        publishDate: s.isodate(),
        lastEditedTime: s.isodate(),
        locale: s.enum(["zh-CN", "en-US"]).default("zh-CN"),
        tags: s.array(s.string()).default([]),
        draft: s.boolean().default(false),
        banner: s.string().optional(),
        toc,
        content: s.mdx({
          remarkPlugins: [remarkHeadingAnchors, remarkFootnotes, remarkMath],
          rehypePlugins: [
            // KaTeX must run before Shiki: block math reaches rehype as
            // pre > code.language-math, which Shiki would otherwise highlight
            // as plaintext before rehypeKatex can claim it.
            [rehypeKatex, { output: "htmlAndMathml" }],
            [
              rehypeShikiFromHighlighter,
              highlighter,
              {
                theme: "one-dark-pro",
                defaultLanguage: "plaintext",
                fallbackLanguage: "plaintext",
                lazy: true
              }
            ]
          ]
        })
      })
    }
  }
})
