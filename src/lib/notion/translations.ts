import { getPageMarkdown, queryDataSource } from './client';
import {
  ARTICLE_PROPS,
  ARTICLES_DATA_SOURCE_ID,
  SUPPORTED_LOCALES,
  TRANSLATION_PROGRESS,
  TRANSLATION_PROPS,
  TRANSLATIONS_DATA_SOURCE_ID,
} from './config';
import { convertMarkdownToHtml } from './markdown';
import type { Locale, NotionTranslation } from './types';
import { NotionValidationError } from './types';

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

function isLocale(value: string): value is Locale {
  return SUPPORTED_LOCALES.includes(value as Locale);
}

function titleForError(fields: TranslationFields, page: NotionPage) {
  return fields.title || page.id;
}

function validationError(
  message: string,
  page: NotionPage,
  fields: TranslationFields,
  propertyName: string
) {
  return new NotionValidationError(
    `${message} (pageTitle=${titleForError(fields, page)}, pageId=${page.id}, property=${propertyName})`,
    { pageId: page.id, pageTitle: titleForError(fields, page), propertyName }
  );
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

function validateCompletedTranslation(page: NotionPage, fields: TranslationFields) {
  if (fields.originalArticleIds.length !== 1) {
    throw validationError(
      'Completed translation must relate to exactly one original article',
      page,
      fields,
      TRANSLATION_PROPS.ORIGINAL
    );
  }

  if (!isLocale(fields.locale)) {
    throw validationError(
      'Completed translation language must be zh-CN or en-US',
      page,
      fields,
      TRANSLATION_PROPS.LANGUAGE
    );
  }

  if (!fields.title) {
    throw validationError('Completed translation title is required', page, fields, TRANSLATION_PROPS.TITLE);
  }

  if (!fields.excerpt) {
    throw validationError(
      'Completed translation excerpt is required',
      page,
      fields,
      TRANSLATION_PROPS.EXCERPT
    );
  }
}

export async function getAllTranslations(): Promise<NotionTranslation[]> {
  const rows = (await queryDataSource(TRANSLATIONS_DATA_SOURCE_ID)) as NotionPage[];
  const translations: NotionTranslation[] = [];
  if (rows.length === 0) return translations;

  const originals = await getOriginalArticleFields();
  const completedByOriginalAndLocale = new Map<string, NotionPage>();

  for (const page of rows) {
    const fields = normalizeTranslation(page);
    if (fields.progress !== TRANSLATION_PROGRESS.COMPLETED) continue;

    validateCompletedTranslation(page, fields);

    const locale = fields.locale as Locale;
    const originalArticleId = fields.originalArticleIds[0];
    const original = originals.get(originalArticleId);
    if (!original) {
      throw validationError(
        `Original article relation was not found: originalArticleId=${originalArticleId}`,
        page,
        fields,
        TRANSLATION_PROPS.ORIGINAL
      );
    }

    if (!isLocale(original.locale)) {
      throw validationError(
        `Original article has unsupported locale: originalArticleId=${originalArticleId}`,
        page,
        fields,
        TRANSLATION_PROPS.ORIGINAL
      );
    }

    if (locale === original.locale) {
      throw validationError(
        'Completed translation language must differ from original article language',
        page,
        fields,
        TRANSLATION_PROPS.LANGUAGE
      );
    }

    const duplicateKey = `${originalArticleId}:${locale}`;
    const duplicate = completedByOriginalAndLocale.get(duplicateKey);
    if (duplicate) {
      throw validationError(
        `Duplicate completed translation for originalArticleId=${originalArticleId} locale=${locale} also used by pageId=${duplicate.id}`,
        page,
        fields,
        TRANSLATION_PROPS.LANGUAGE
      );
    }

    const pageMarkdown = await getPageMarkdown(page.id);
    if (!pageMarkdown.markdown.trim()) {
      throw validationError(
        'Completed translation markdown body is required',
        page,
        fields,
        TRANSLATION_PROPS.TITLE
      );
    }

    const content = await convertMarkdownToHtml(pageMarkdown, page.id);
    completedByOriginalAndLocale.set(duplicateKey, page);
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
