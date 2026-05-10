import { getPostData, getAllPostSlugs } from "@/lib/posts";
import { formatDate } from "@/lib/utils";
import Link from "@/components/Link";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
  const posts = await getAllPostSlugs();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostData(slug);

  if (!post) {
    return {
      title: slug,
    };
  }

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
    },
  };
}

export default async function Post({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostData(slug);

  if (!post) {
    notFound();
  }

  return (
    <main className="flex min-h-dvh flex-col">
      <section className="bg-acid border-b-2 border-b-black">
        <div className="mx-auto max-w-3xl py-10">
          <Link href="/" className="large-p">
            ← Back to all posts
          </Link>
        </div>
      </section>

      <section className="flex-1 bg-white">
        <article className="mx-auto my-16 w-3/4 max-w-3xl">
          <header className="mb-10">
            <h1 className="h1-hero mb-4 text-6xl">{post.title}</h1>
            <time className="large-p">{formatDate(post.date)}</time>
          </header>

          <div
            className="prose prose-headings:font-(--font-title) prose-headings:text-black prose-p:text-black/80 prose-li:text-black/80 prose-strong:text-black prose-a:text-black prose-a:underline prose-a:decoration-black prose-code:text-white prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-pre:bg-gray-600 prose-pre:text-white prose-blockquote:text-black/70 max-w-none"
            dangerouslySetInnerHTML={{ __html: post.content || "" }}
          />
        </article>
      </section>
    </main>
  );
}
