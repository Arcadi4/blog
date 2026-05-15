import { getArticleBySlug, getContentIndex } from "@/lib/content-index";
import { formatDate } from "@/lib/utils";
import Link from "@/components/Link";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
  const { translations } = await getContentIndex();
  return translations.map((translation) => ({
    locale: translation.locale,
    slug: translation.originalSlug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const { translations } = await getContentIndex();
  const translation = translations.find(
    (t) => t.locale === locale && t.originalSlug === slug,
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

export default async function Post({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const { translations } = await getContentIndex();
  const translation = translations.find(
    (t) => t.locale === locale && t.originalSlug === slug,
  );

  if (!translation) {
    notFound();
  }

  const originalArticle = await getArticleBySlug(slug);

  return (
    <main className="flex min-h-dvh flex-col">
      <section className="border-b-2 border-b-black bg-acid">
        <div className="mx-auto max-w-3xl py-10">
          <Link href="/" className="large-p">
            ← Back to all posts
          </Link>
        </div>
      </section>

      <section className="flex-1 bg-white">
        <article className="mx-auto my-16 w-3/4 max-w-3xl">
          <header className="mb-10">
            <h1 className="h1-hero mb-4 text-6xl">{translation.title}</h1>
            <time className="large-p">
              {originalArticle
                ? formatDate(originalArticle.publishDate.toISOString())
                : ""}
            </time>
          </header>

          <div
            className="prose max-w-none prose-headings:font-(--font-title) prose-headings:text-black prose-p:text-black/80 prose-a:text-black prose-a:underline prose-a:decoration-black prose-blockquote:text-black/70 prose-strong:text-black prose-code:rounded prose-code:px-1 prose-code:py-0.5 prose-code:text-white prose-pre:bg-gray-600 prose-pre:text-white prose-li:text-black/80"
            dangerouslySetInnerHTML={{ __html: translation.content || "" }}
          />
        </article>
      </section>
    </main>
  );
}
