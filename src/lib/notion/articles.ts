// Validation moved to build-time: scripts/lib/validate-articles.ts

import { getPageMarkdown, queryDataSource } from './client';
import {
  ARTICLE_PROPS,
  ARTICLE_STATUS,
  ARTICLES_DATA_SOURCE_ID,
} from './config';
import { convertMarkdownToHtml } from './markdown';
import type { ArticleStatus, Locale, NotionArticle } from './types';

type NotionProperty = {
  title?: { plain_text?: string }[];
  rich_text?: { plain_text?: string }[];
  date?: { start?: string | null } | null;
  select?: { name?: string } | null;
  multi_select?: { name?: string }[];
  status?: { name?: string } | null;
  relation?: { id?: string }[];
  last_edited_time?: string;
};

type NotionPage = {
  id: string;
  properties?: Record<string, NotionProperty>;
};

type ArticleFields = {
  title: string;
  slug: string;
  excerpt: string;
  publishDate: Date | null;
  originalLanguage: string;
  tags: string[];
  status: string;
  translationIds: string[];
  lastEditedTime: Date | null;
};

function plainText(items?: { plain_text?: string }[]) {
  return items?.map((item) => item.plain_text ?? '').join('').trim() ?? '';
}

function property(page: NotionPage, name: string) {
  return page.properties?.[name] ?? {};
}

function dateValue(value?: string | null) {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function normalizeArticle(page: NotionPage): ArticleFields {
  return {
    title: plainText(property(page, ARTICLE_PROPS.TITLE).title),
    slug: plainText(property(page, ARTICLE_PROPS.SLUG).rich_text),
    excerpt: plainText(property(page, ARTICLE_PROPS.EXCERPT).rich_text),
    publishDate: dateValue(property(page, ARTICLE_PROPS.PUBLISH_DATE).date?.start),
    originalLanguage: property(page, ARTICLE_PROPS.ORIGINAL_LANGUAGE).select?.name ?? '',
    tags:
      property(page, ARTICLE_PROPS.TAGS)
        .multi_select?.map((tag) => tag.name ?? '')
        .filter(Boolean) ?? [],
    status: property(page, ARTICLE_PROPS.STATUS).status?.name ?? '',
    translationIds:
      property(page, ARTICLE_PROPS.TRANSLATIONS)
        .relation?.map((relation) => relation.id ?? '')
        .filter(Boolean) ?? [],
    lastEditedTime: dateValue(property(page, ARTICLE_PROPS.LAST_EDITED).last_edited_time),
  };
}

export async function getAllArticles(): Promise<NotionArticle[]> {
  const rows = (await queryDataSource(ARTICLES_DATA_SOURCE_ID)) as NotionPage[];
  const articles: NotionArticle[] = [];

  for (const page of rows) {
    const fields = normalizeArticle(page);

    if (fields.status !== ARTICLE_STATUS.PUBLIC) continue;

    const pageMarkdown = await getPageMarkdown(page.id);
    const content = await convertMarkdownToHtml(pageMarkdown);
    const article: NotionArticle = {
      id: page.id,
      title: fields.title,
      slug: fields.slug,
      excerpt: fields.excerpt,
      publishDate: fields.publishDate as Date,
      originalLanguage: fields.originalLanguage as Locale,
      tags: fields.tags,
      status: fields.status as ArticleStatus,
      translationIds: fields.translationIds,
      lastEditedTime: fields.lastEditedTime ?? new Date(0),
      content,
    };

    articles.push(article);
  }

  return articles.sort((a, b) => b.publishDate.getTime() - a.publishDate.getTime());
}
