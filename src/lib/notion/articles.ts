import { getPageMarkdown, queryDataSource } from './client';
import {
  ARTICLE_PROPS,
  ARTICLE_STATUS,
  ARTICLES_DATA_SOURCE_ID,
  SUPPORTED_LOCALES,
} from './config';
import { convertMarkdownToHtml } from './markdown';
import type { ArticleStatus, Locale, NotionArticle } from './types';
import { NotionValidationError } from './types';

const REQUIRED_ARTICLE_PROPERTIES = [
  ARTICLE_PROPS.TITLE,
  ARTICLE_PROPS.SLUG,
  ARTICLE_PROPS.EXCERPT,
  ARTICLE_PROPS.PUBLISH_DATE,
  ARTICLE_PROPS.ORIGINAL_LANGUAGE,
  ARTICLE_PROPS.STATUS,
] as const;

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

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const supportedArticleStatuses = Object.values(ARTICLE_STATUS) as string[];

function plainText(items?: { plain_text?: string }[]) {
  return items?.map((item) => item.plain_text ?? '').join('').trim() ?? '';
}

function property(page: NotionPage, name: string) {
  return page.properties?.[name] ?? {};
}

function titleForError(fields: ArticleFields, page: NotionPage) {
  return fields.title || page.id;
}

function validationError(
  message: string,
  page: NotionPage,
  fields: ArticleFields,
  propertyName: string
) {
  return new NotionValidationError(
    `${message} (pageTitle=${titleForError(fields, page)}, pageId=${page.id}, property=${propertyName})`,
    { pageId: page.id, pageTitle: titleForError(fields, page), propertyName }
  );
}

function schemaError(message: string, page: NotionPage, propertyName: string) {
  const pageTitle = plainText(property(page, ARTICLE_PROPS.TITLE).title) || page.id;

  return new NotionValidationError(
    `${message} (pageTitle=${pageTitle}, pageId=${page.id}, property=${propertyName})`,
    { pageId: page.id, pageTitle, propertyName }
  );
}

function assertRequiredProperties(page: NotionPage) {
  for (const propertyName of REQUIRED_ARTICLE_PROPERTIES) {
    if (!page.properties || !(propertyName in page.properties)) {
      throw schemaError('Article data source is missing a required property', page, propertyName);
    }
  }
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

function isLocale(value: string): value is Locale {
  return SUPPORTED_LOCALES.includes(value as Locale);
}

function validatePublicArticle(page: NotionPage, fields: ArticleFields) {
  if (!fields.title) {
    throw validationError('Article title is required', page, fields, ARTICLE_PROPS.TITLE);
  }

  if (!supportedArticleStatuses.includes(fields.status)) {
    throw validationError(
      `Article status must be one of: ${supportedArticleStatuses.join(', ')}`,
      page,
      fields,
      ARTICLE_PROPS.STATUS
    );
  }

  if (!slugPattern.test(fields.slug)) {
    throw validationError(
      'Article slug must be lowercase and URL-safe',
      page,
      fields,
      ARTICLE_PROPS.SLUG
    );
  }

  if (!fields.publishDate) {
    throw validationError('Article publish date is required', page, fields, ARTICLE_PROPS.PUBLISH_DATE);
  }

  if (!isLocale(fields.originalLanguage)) {
    throw validationError(
      'Article original language must be zh-CN or en-US',
      page,
      fields,
      ARTICLE_PROPS.ORIGINAL_LANGUAGE
    );
  }

  if (!fields.excerpt) {
    throw validationError('Article excerpt is required', page, fields, ARTICLE_PROPS.EXCERPT);
  }
}

export async function getAllArticles(): Promise<NotionArticle[]> {
  const rows = (await queryDataSource(ARTICLES_DATA_SOURCE_ID)) as NotionPage[];
  const articles: NotionArticle[] = [];
  const slugs = new Map<string, NotionArticle>();

  for (const page of rows) {
    assertRequiredProperties(page);
    const fields = normalizeArticle(page);

    if (fields.status && !supportedArticleStatuses.includes(fields.status)) {
      throw validationError(
        `Article status must be one of: ${supportedArticleStatuses.join(', ')}`,
        page,
        fields,
        ARTICLE_PROPS.STATUS
      );
    }

    if (fields.status !== ARTICLE_STATUS.PUBLIC) continue;

    validatePublicArticle(page, fields);

    const slugKey = fields.slug.toLowerCase();
    const duplicate = slugs.get(slugKey);
    if (duplicate) {
      throw validationError(
        `Duplicate public article slug also used by pageId=${duplicate.id}`,
        page,
        fields,
        ARTICLE_PROPS.SLUG
      );
    }

    const publishDate = fields.publishDate;
    if (!publishDate) {
      throw validationError('Article publish date is required', page, fields, ARTICLE_PROPS.PUBLISH_DATE);
    }

    const originalLanguage = fields.originalLanguage;
    if (!isLocale(originalLanguage)) {
      throw validationError(
        'Article original language must be zh-CN or en-US',
        page,
        fields,
        ARTICLE_PROPS.ORIGINAL_LANGUAGE
      );
    }

    const pageMarkdown = await getPageMarkdown(page.id);
    if (!pageMarkdown.markdown.trim()) {
      throw validationError('Article markdown body is required', page, fields, ARTICLE_PROPS.TITLE);
    }

    const content = await convertMarkdownToHtml(pageMarkdown, page.id, {
      pageTitle: titleForError(fields, page),
      propertyName: ARTICLE_PROPS.TITLE,
    });
    const article: NotionArticle = {
      id: page.id,
      title: fields.title,
      slug: fields.slug,
      excerpt: fields.excerpt,
      publishDate,
      originalLanguage,
      tags: fields.tags,
      status: fields.status as ArticleStatus,
      translationIds: fields.translationIds,
      lastEditedTime: fields.lastEditedTime ?? new Date(0),
      content,
    };

    slugs.set(slugKey, article);
    articles.push(article);
  }

  return articles.sort((a, b) => b.publishDate.getTime() - a.publishDate.getTime());
}
