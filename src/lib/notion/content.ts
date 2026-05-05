import { getAllArticles } from './articles';
import { buildAlternates } from './routes';
import { getAllTranslations } from './translations';
import type { Locale, NotionArticle, NotionTranslation } from './types';

type ContentIndex = {
  articles: NotionArticle[];
  translations: NotionTranslation[];
};

let cached: Promise<ContentIndex> | null = null;

export async function getContentIndex(): Promise<ContentIndex> {
  cached ??= Promise.all([getAllArticles(), getAllTranslations()]).then(
    ([articles, translations]) => ({ articles, translations })
  );

  return cached;
}

export async function getPublicArticles(): Promise<NotionArticle[]> {
  const { articles } = await getContentIndex();
  return articles;
}

export async function getArticleBySlug(slug: string): Promise<NotionArticle | null> {
  const { articles } = await getContentIndex();
  return articles.find((article) => article.slug === slug) ?? null;
}

export async function getTranslationParams(): Promise<Array<{ locale: Locale; slug: string }>> {
  const { translations } = await getContentIndex();
  return translations.map(({ locale, originalSlug }) => ({ locale, slug: originalSlug }));
}

export async function getTranslation(
  locale: Locale,
  slug: string
): Promise<NotionTranslation | null> {
  const { translations } = await getContentIndex();
  return (
    translations.find(
      (translation) => translation.locale === locale && translation.originalSlug === slug
    ) ?? null
  );
}

export async function getArticleAlternates(
  slug: string
): Promise<{ canonical: string; languages: Record<string, string> }> {
  const { articles, translations } = await getContentIndex();
  const article = articles.find((item) => item.slug === slug);
  const translationLocales = translations
    .filter((translation) => translation.originalSlug === slug)
    .map((translation) => translation.locale);
  const locales = article
    ? [article.originalLanguage, ...translationLocales]
    : translationLocales;

  return buildAlternates(slug, locales);
}
