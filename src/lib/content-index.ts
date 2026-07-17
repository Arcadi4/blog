import generatedContentIndex from "@/generated/content-index.json"
import type { Locale } from "./notion/types"

export interface ContentArticle {
  id: string
  title: string
  slug: string
  excerpt: string
  publishDate: Date
  originalLanguage: Locale
  tags: string[]
  status: string
  translationIds: string[]
  lastEditedTime: Date
  content: string
  banner?: string
}

export interface ContentTranslation {
  id: string
  title: string
  excerpt: string
  locale: Locale
  originalArticleId: string
  originalSlug: string
  content: string
}

type GeneratedArticle = Omit<
  ContentArticle,
  "publishDate" | "lastEditedTime"
> & {
  publishDate: string
  lastEditedTime: string
}

type GeneratedContentIndex = {
  articles: GeneratedArticle[]
  translations: ContentTranslation[]
}

const contentIndex = generatedContentIndex as GeneratedContentIndex

function toArticle(article: GeneratedArticle): ContentArticle {
  return {
    ...article,
    publishDate: new Date(article.publishDate),
    lastEditedTime: new Date(article.lastEditedTime)
  }
}

export async function getContentIndex() {
  return {
    articles: contentIndex.articles.map(toArticle),
    translations: contentIndex.translations
  }
}

export async function getPublicArticles(): Promise<ContentArticle[]> {
  const { articles } = await getContentIndex()
  return articles
}

export async function getArticleBySlug(
  slug: string
): Promise<ContentArticle | null> {
  const { articles } = await getContentIndex()
  return articles.find((article) => article.slug === slug) ?? null
}

export async function getTranslation(
  locale: Locale,
  slug: string
): Promise<ContentTranslation | null> {
  const { translations } = await getContentIndex()
  return (
    translations.find(
      (translation) =>
        translation.locale === locale && translation.originalSlug === slug
    ) ?? null
  )
}
