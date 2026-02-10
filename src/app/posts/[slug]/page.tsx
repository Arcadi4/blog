import { getPostData, getAllPostSlugs } from '@/lib/posts';
import { formatDate } from '@/lib/utils';
import Link from '@/components/Link';

export async function generateStaticParams() {
  const posts = getAllPostSlugs();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string; }>; }) {
  const { slug } = await params;
  const post = await getPostData(slug);
  return {
    title: post.title,
    description: post.excerpt,
  };
}

export default async function Post({ params }: { params: Promise<{ slug: string; }>; }) {
  const { slug } = await params;
  const post = await getPostData(slug);

  return (
    <main className="min-h-dvh flex flex-col">
      <section className="bg-acid border-b-2 border-b-black">
        <div className="max-w-4xl mx-auto px-6 py-10">
          <Link href="/" className="large-p">
            ← Back to all posts
          </Link>
        </div>
      </section>

      <section className="bg-white border-b-2 border-l-2 border-r-2 border-black flex-1">
        <article className="max-w-4xl mx-auto px-6 py-12">
          <header className="mb-10">
            <h1 className="h1-hero text-6xl mb-4">
              {post.title}
            </h1>
            <time className="large-p">{formatDate(post.date)}</time>
          </header>

          <div
            className="prose max-w-none prose-headings:font-[var(--font-title)] prose-headings:text-black prose-p:text-black/80 prose-li:text-black/80 prose-strong:text-black prose-a:text-black prose-a:underline prose-a:decoration-black prose-code:text-black prose-code:bg-black/5 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-pre:bg-black prose-pre:text-white prose-blockquote:text-black/70"
            dangerouslySetInnerHTML={{ __html: post.content || '' }}
          />
        </article>
      </section>
    </main>
  );
}
