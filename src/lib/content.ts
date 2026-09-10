import { posts } from "@/generated/velite"
import type { TocItem } from "@/lib/toc"

/** Everything the article listings and cards render. */
export type ArticleMeta = {
  readonly slug: string
  readonly title: string
  readonly excerpt: string
  readonly publishDate: Date
  readonly lastEditedTime: Date
  readonly tags: readonly string[]
  readonly banner?: string
}

/** An article plus the body the reader renders. */
export type Article = ArticleMeta & {
  readonly toc: readonly TocItem[]
  readonly content: string
}

const articles: Article[] = posts
  .filter((post) => !post.draft)
  .map((post) => ({
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    publishDate: new Date(post.publishDate),
    lastEditedTime: new Date(post.lastEditedTime),
    tags: post.tags,
    banner: post.banner ?? undefined,
    toc: post.toc,
    content: post.content
  }))
  .toSorted(
    (a, b) =>
      b.publishDate.valueOf() - a.publishDate.valueOf() ||
      a.slug.localeCompare(b.slug)
  )

const articleMetas: ArticleMeta[] = articles.map((article) => ({
  slug: article.slug,
  title: article.title,
  excerpt: article.excerpt,
  publishDate: article.publishDate,
  lastEditedTime: article.lastEditedTime,
  tags: article.tags,
  banner: article.banner
}))

/** Published articles, newest first. Article bodies are left behind. */
export function getArticles(): readonly ArticleMeta[] {
  return articleMetas
}

export function getArticle(slug: string): Article | undefined {
  return articles.find((article) => article.slug === slug)
}
