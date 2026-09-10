# AGENTS.md

This is a personal blog built with Next.js. Articles are MDX files in `content/posts/`, validated and compiled into `src/generated/velite` by Velite for SSG. Run `pnpm dev` (Velite watches content) or `pnpm build` (Velite runs first); never edit `src/generated` by hand.

Frontmatter fields: `title`, `slug`, `excerpt`, `publishDate`, `lastEditedTime`, `locale`, `tags`, `draft`, optional `banner` (a path under `public/`). Headings are indexed automatically — write `##`/`###` (or `#` when a document has no lower levels) and the reader links them. Article content may use MDX/JSX; pass components to `MarkdownContent` in `src/app/posts/[slug]/page.tsx` to make them available.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
