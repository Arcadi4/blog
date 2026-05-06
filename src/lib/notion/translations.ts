// Validation moved to build-time: scripts/lib/validate-translations.ts

import { getPageMarkdown, queryDataSource } from './client';
import {
  ARTICLE_PROPS,
  ARTICLES_DATA_SOURCE_ID,
  TRANSLATION_PROGRESS,
  TRANSLATION_PROPS,
  TRANSLATIONS_DATA_SOURCE_ID,
} from './config';
import { convertMarkdownToHtml } from './markdown';
import type { Locale, NotionTranslation } from './types';

type NotionProperty = {
  title?: { plain_text?: string }[];
  rich_text?: { plain_text?: string }[];
  select?: { name?: string } | null;
  status?: { name?: string } | null;
  relation?: { id?: string }[];
};

type NotionPage = {
  id: string;
  properties?: Record<string, NotionProperty>;
};

type TranslationFields = {
  title: string;
  excerpt: string;
  locale: string;
  progress: string;
  originalArticleIds: string[];
};

type OriginalArticleFields = {
  locale: string;
  slug: string;
};

function plainText(items?: { plain_text?: string }[]) {
  return items?.map((item) => item.plain_text ?? '').join('').trim() ?? '';
}

function property(page: NotionPage, name: string) {
  return page.properties?.[name] ?? {};
}

function normalizeTranslation(page: NotionPage): TranslationFields {
  return {
    title: plainText(property(page, TRANSLATION_PROPS.TITLE).title),
    excerpt: plainText(property(page, TRANSLATION_PROPS.EXCERPT).rich_text),
    locale: property(page, TRANSLATION_PROPS.LANGUAGE).select?.name ?? '',
    progress: property(page, TRANSLATION_PROPS.PROGRESS).status?.name ?? '',
    originalArticleIds:
      property(page, TRANSLATION_PROPS.ORIGINAL)
        .relation?.map((relation) => relation.id ?? '')
        .filter(Boolean) ?? [],
  };
}

function normalizeOriginalArticle(page: NotionPage): OriginalArticleFields {
  return {
    locale: property(page, ARTICLE_PROPS.ORIGINAL_LANGUAGE).select?.name ?? '',
    slug: plainText(property(page, ARTICLE_PROPS.SLUG).rich_text),
  };
}

async function getOriginalArticleFields() {
  const rows = (await queryDataSource(ARTICLES_DATA_SOURCE_ID)) as NotionPage[];
  const originals = new Map<string, OriginalArticleFields>();

  for (const page of rows) {
    originals.set(page.id, normalizeOriginalArticle(page));
  }

  return originals;
}

export async function getAllTranslations(): Promise<NotionTranslation[]> {
  const rows = (await queryDataSource(TRANSLATIONS_DATA_SOURCE_ID)) as NotionPage[];
  const translations: NotionTranslation[] = [];
  if (rows.length === 0) return translations;

  const originals = await getOriginalArticleFields();

  for (const page of rows) {
    const fields = normalizeTranslation(page);

    if (fields.progress !== TRANSLATION_PROGRESS.COMPLETED) continue;

    const locale = fields.locale as Locale;
    const originalArticleId = fields.originalArticleIds[0]!;
    const original = originals.get(originalArticleId)!;

    const pageMarkdown = await getPageMarkdown(page.id);
    const content = await convertMarkdownToHtml(pageMarkdown);

    translations.push({
      id: page.id,
      title: fields.title,
      excerpt: fields.excerpt,
      locale,
      originalArticleId,
      originalSlug: original.slug,
      content,
    });
  }

  return translations;
}
