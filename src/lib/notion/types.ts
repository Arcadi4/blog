// Validation architecture:
// - Build-time: All Notion metadata validation runs in scripts/lib/validate-*.ts
// - Runtime: Pure data transformation only (articles.ts, translations.ts, markdown.ts)
// - Policy: Invalid public articles (状态=公开) and completed translations (翻译进度=完成) must fail at build time
// - Invalid draft/private/archive articles are skipped (not validated)

export type Locale = 'zh-CN' | 'en-US';

export type ArticleStatus = '公开' | '草稿' | '非公开' | '归档';

export type TranslationProgress = '完成' | '进行中' | '未开始';

export interface NotionArticle {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  publishDate: Date;
  originalLanguage: Locale;
  tags: string[];
  status: ArticleStatus;
  translationIds: string[];
  lastEditedTime: Date;
  content: string;
}

export interface NotionTranslation {
  id: string;
  title: string;
  excerpt: string;
  locale: Locale;
  originalArticleId: string;
  originalSlug: string;
  content: string;
}

export class NotionValidationError extends Error {
  readonly pageId?: string;
  readonly pageTitle?: string;
  readonly propertyName?: string;

  constructor(
    message: string,
    context?: { pageId?: string; pageTitle?: string; propertyName?: string }
  ) {
    super(message);
    this.name = 'NotionValidationError';
    this.pageId = context?.pageId;
    this.pageTitle = context?.pageTitle;
    this.propertyName = context?.propertyName;
  }
}
