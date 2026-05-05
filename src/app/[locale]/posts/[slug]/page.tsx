import { getContentIndex, getArticleBySlug } from '@/lib/notion/content';
import { formatDate } from '@/lib/utils';
import Link from '@/components/Link';
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
  const { translations } = await getContentIndex();
  return translations.map((translation) => ({
    locale: translation.locale,
    slug: translation.originalSlug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  const { translations } = await getContentIndex();
  const translation = translations.find(
    (t) => t.locale === locale && t.originalSlug === slug
  );

  if (!translation) {
    return {
      title: slug,
    };
  }

  return {
    title: translation.title,
    description: translation.excerpt,
    canonical: `/${locale}/posts/${slug}`,
    openGraph: {
      title: translation.title,
      description: translation.excerpt,
    },
  };
}

export default async function Post({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  const { translations } = await getContentIndex();
  const translation = translations.find(
    (t) => t.locale === locale && t.originalSlug === slug
  );

  if (!translation) {
    notFound();
  }

  const originalArticle = await getArticleBySlug(slug);

  return (
    <main className="min-h-dvh flex flex-col">
      <section className="bg-acid border-b-2 border-b-black">
        <div className="max-w-3xl mx-auto py-10">
          <Link href="/" className="large-p">
            ← Back to all posts
          </Link>
        </div>
      </section>

      <section className="bg-white flex-1">
        <article className="mx-auto my-16 w-3/4 max-w-3xl">
          <header className="mb-10">
            <h1 className="h1-hero text-6xl mb-4">
              {translation.title}
            </h1>
            <time className="large-p">{originalArticle ? formatDate(originalArticle.publishDate.toISOString()) : ''}</time>
          </header>

          <div
            className="prose max-w-none 
            prose-headings:font-(--font-title) 
            prose-headings:text-black 
            
            prose-p:text-black/80 
            prose-li:text-black/80 
            prose-strong:text-black 
            prose-a:text-black 
            prose-a:underline 
            prose-a:decoration-black 
            
            prose-code:text-white 
            prose-code:px-1 
            prose-code:py-0.5 
            prose-code:rounded 
            prose-pre:bg-gray-600 
            prose-pre:text-white 
            prose-blockquote:text-black/70"
            dangerouslySetInnerHTML={{ __html: translation.content || '' }}
          />
        </article>
      </section>
    </main>
  );
}