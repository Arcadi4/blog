import type { Locale } from './types';

export function getLocaleSegment(locale: Locale): string {
  return locale === 'zh-CN' ? '' : locale;
}

export function buildOriginalUrl(slug: string): string {
  return `/posts/${slug}`;
}

export function buildTranslationUrl(locale: Locale, slug: string): string {
  const segment = getLocaleSegment(locale);
  return segment ? `/${segment}/posts/${slug}` : `/posts/${slug}`;
}

export function buildAlternates(
  originalSlug: string,
  availableLocales: Locale[]
): { canonical: string; languages: Record<string, string> } {
  const languages: Record<string, string> = {};

  for (const locale of availableLocales) {
    languages[locale] = buildTranslationUrl(locale, originalSlug);
  }

  if (!languages['zh-CN']) {
    languages['zh-CN'] = buildOriginalUrl(originalSlug);
  }

  return {
    canonical: languages['zh-CN'],
    languages,
  };
}
