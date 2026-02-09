import { getPostData, getAllPostSlugs } from '@/lib/posts';
import { formatDate } from '@/lib/utils';
import Link from 'next/link';

export async function generateStaticParams() {
  const posts = getAllPostSlugs();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPostData(slug);
  return {
    title: post.title,
    description: post.excerpt,
  };
}

export default async function Post({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPostData(slug);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <article className="max-w-3xl mx-auto px-6 py-12">
        <Link 
          href="/" 
          className="text-blue-600 dark:text-blue-400 hover:underline mb-8 inline-block"
        >
          ← Back to all posts
        </Link>
        
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">
            {post.title}
          </h1>
          <time className="text-zinc-500 dark:text-zinc-500">
            {formatDate(post.date)}
          </time>
        </header>

        <div 
          className="prose prose-zinc dark:prose-invert max-w-none prose-headings:text-zinc-900 dark:prose-headings:text-zinc-100 prose-p:text-zinc-700 dark:prose-p:text-zinc-300 prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-strong:text-zinc-900 dark:prose-strong:text-zinc-100 prose-code:text-zinc-900 dark:prose-code:text-zinc-100"
          dangerouslySetInnerHTML={{ __html: post.content || '' }}
        />
      </article>
    </div>
  );
}
