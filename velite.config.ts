import rehypeShikiFromHighlighter from "@shikijs/rehype/core"
import { createHighlighter } from "shiki"
import { defineConfig, s } from "velite"
import { parseToc, remarkHeadingAnchors, type TocItem } from "./src/lib/toc"

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
          remarkPlugins: [remarkHeadingAnchors],
          rehypePlugins: [
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
