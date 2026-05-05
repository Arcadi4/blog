import type { Locale } from './types';

export function getLocaleSegment(locale: Locale): string {
  return locale;
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

  const originalLocale = availableLocales[0];
  const canonical = originalLocale
    ? buildTranslationUrl(originalLocale, originalSlug)
    : buildOriginalUrl(originalSlug);

  return {
    canonical,
    languages,
  };
}
