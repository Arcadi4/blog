import { getPageMarkdown, queryDataSource } from "../../src/lib/notion/client";
import {
  ARTICLE_PROPS,
  ARTICLES_DATA_SOURCE_ID,
  TRANSLATION_PROGRESS,
  TRANSLATION_PROPS,
  TRANSLATIONS_DATA_SOURCE_ID,
} from "../../src/lib/notion/config";
import type { Locale, NotionTranslation } from "../../src/lib/notion/types";
import { convertMarkdownToHtml } from "./validate-markdown";
import {
  isLocale,
  NotionValidationError,
  plainText,
  property,
  type NotionPage,
} from "./validation-shared";

export const REQUIRED_TRANSLATION_PROPERTIES = [
  TRANSLATION_PROPS.TITLE,
  TRANSLATION_PROPS.EXCERPT,
  TRANSLATION_PROPS.LANGUAGE,
  TRANSLATION_PROPS.PROGRESS,
  TRANSLATION_PROPS.ORIGINAL,
] as const;

export const REQUIRED_ORIGINAL_ARTICLE_PROPERTIES = [
  ARTICLE_PROPS.ORIGINAL_LANGUAGE,
  ARTICLE_PROPS.SLUG,
] as const;

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

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const supportedTranslationProgress = Object.values(
  TRANSLATION_PROGRESS,
) as string[];

function titleForError(fields: TranslationFields, page: NotionPage) {
  return fields.title || page.id;
}

function validationError(
  message: string,
  page: NotionPage,
  fields: TranslationFields,
  propertyName: string,
) {
  return new NotionValidationError(
    `${message} (pageTitle=${titleForError(fields, page)}, pageId=${page.id}, property=${propertyName})`,
    { pageId: page.id, pageTitle: titleForError(fields, page), propertyName },
  );
}

function schemaError(message: string, page: NotionPage, propertyName: string) {
  const pageTitle =
    plainText(property(page, TRANSLATION_PROPS.TITLE).title) ||
    plainText(property(page, ARTICLE_PROPS.TITLE).title) ||
    page.id;

  return new NotionValidationError(
    `${message} (pageTitle=${pageTitle}, pageId=${page.id}, property=${propertyName})`,
    { pageId: page.id, pageTitle, propertyName },
  );
}

export function assertRequiredProperties(
  page: NotionPage,
  propertyNames: readonly string[],
  sourceName: string,
) {
  for (const propertyName of propertyNames) {
    if (!page.properties || !(propertyName in page.properties)) {
      throw schemaError(
        `${sourceName} data source is missing a required property`,
        page,
        propertyName,
      );
    }
  }
}

export function normalizeTranslation(page: NotionPage): TranslationFields {
  return {
    title: plainText(property(page, TRANSLATION_PROPS.TITLE).title),
    excerpt: plainText(property(page, TRANSLATION_PROPS.EXCERPT).rich_text),
    locale: property(page, TRANSLATION_PROPS.LANGUAGE).select?.name ?? "",
    progress: property(page, TRANSLATION_PROPS.PROGRESS).status?.name ?? "",
    originalArticleIds:
      property(page, TRANSLATION_PROPS.ORIGINAL)
        .relation?.map((relation) => relation.id ?? "")
        .filter(Boolean) ?? [],
  };
}

function normalizeOriginalArticle(page: NotionPage): OriginalArticleFields {
  return {
    locale: property(page, ARTICLE_PROPS.ORIGINAL_LANGUAGE).select?.name ?? "",
    slug: plainText(property(page, ARTICLE_PROPS.SLUG).rich_text),
  };
}

async function getOriginalArticleFields() {
  const rows = (await queryDataSource(ARTICLES_DATA_SOURCE_ID)) as NotionPage[];
  const originals = new Map<string, OriginalArticleFields>();

  for (const page of rows) {
    assertRequiredProperties(
      page,
      REQUIRED_ORIGINAL_ARTICLE_PROPERTIES,
      "Article",
    );
    originals.set(page.id, normalizeOriginalArticle(page));
  }

  return originals;
}

export function validateCompletedTranslation(
  page: NotionPage,
  fields: TranslationFields,
) {
  if (fields.originalArticleIds.length !== 1) {
    throw validationError(
      "Completed translation must relate to exactly one original article",
      page,
      fields,
      TRANSLATION_PROPS.ORIGINAL,
    );
  }

  if (!isLocale(fields.locale)) {
    throw validationError(
      "Completed translation language must be zh-CN or en-US",
      page,
      fields,
      TRANSLATION_PROPS.LANGUAGE,
    );
  }

  if (!fields.title) {
    throw validationError(
      "Completed translation title is required",
      page,
      fields,
      TRANSLATION_PROPS.TITLE,
    );
  }

  if (!fields.excerpt) {
    throw validationError(
      "Completed translation excerpt is required",
      page,
      fields,
      TRANSLATION_PROPS.EXCERPT,
    );
  }
}

export async function getAllTranslations(): Promise<NotionTranslation[]> {
  const rows = (await queryDataSource(
    TRANSLATIONS_DATA_SOURCE_ID,
  )) as NotionPage[];
  const translations: NotionTranslation[] = [];
  if (rows.length === 0) return translations;

  const originals = await getOriginalArticleFields();
  const completedByOriginalAndLocale = new Map<string, NotionPage>();

  for (const page of rows) {
    assertRequiredProperties(
      page,
      REQUIRED_TRANSLATION_PROPERTIES,
      "Translation",
    );
    const fields = normalizeTranslation(page);

    if (
      fields.progress &&
      !supportedTranslationProgress.includes(fields.progress)
    ) {
      throw validationError(
        `Translation progress must be one of: ${supportedTranslationProgress.join(", ")}`,
        page,
        fields,
        TRANSLATION_PROPS.PROGRESS,
      );
    }

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
        TRANSLATION_PROPS.ORIGINAL,
      );
    }

    if (!isLocale(original.locale)) {
      throw validationError(
        `Original article has unsupported locale: originalArticleId=${originalArticleId}`,
        page,
        fields,
        TRANSLATION_PROPS.ORIGINAL,
      );
    }

    if (!slugPattern.test(original.slug)) {
      throw validationError(
        `Original article relation must point to an article with a lowercase URL-safe slug: originalArticleId=${originalArticleId}`,
        page,
        fields,
        TRANSLATION_PROPS.ORIGINAL,
      );
    }

    if (locale === original.locale) {
      throw validationError(
        "Completed translation language must differ from original article language",
        page,
        fields,
        TRANSLATION_PROPS.LANGUAGE,
      );
    }

    const duplicateKey = `${originalArticleId}:${locale}`;
    const duplicate = completedByOriginalAndLocale.get(duplicateKey);
    if (duplicate) {
      throw validationError(
        `Duplicate completed translation for originalArticleId=${originalArticleId} locale=${locale} also used by pageId=${duplicate.id}`,
        page,
        fields,
        TRANSLATION_PROPS.LANGUAGE,
      );
    }

    const pageMarkdown = await getPageMarkdown(page.id);
    if (!pageMarkdown.markdown.trim()) {
      throw validationError(
        "Completed translation markdown body is required",
        page,
        fields,
        TRANSLATION_PROPS.TITLE,
      );
    }

    const content = await convertMarkdownToHtml(pageMarkdown, page.id, {
      pageTitle: titleForError(fields, page),
      propertyName: TRANSLATION_PROPS.TITLE,
    });
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
