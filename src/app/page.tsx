import Link from "next/link";
import { getSortedPostsData } from "@/lib/posts";
import { formatDate } from "@/lib/utils";

export default function Home() {
  const posts = getSortedPostsData();

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">
            Welcome to My Blog
          </h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400">
            Thoughts, ideas, and tutorials about web development and technology.
          </p>
        </div>

        <div className="space-y-8">
          {posts.map((post) => (
            <article
              key={post.slug}
              className="bg-white dark:bg-zinc-900 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow border border-zinc-200 dark:border-zinc-800"
            >
              <Link href={`/posts/${post.slug}`}>
                <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  {post.title}
                </h2>
              </Link>
              <time className="text-sm text-zinc-500 dark:text-zinc-500 mb-3 block">
                {formatDate(post.date)}
              </time>
              {post.excerpt && (
                <p className="text-zinc-600 dark:text-zinc-400 mb-4">
                  {post.excerpt}
                </p>
              )}
              <Link
                href={`/posts/${post.slug}`}
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
              >
                Read more →
              </Link>
            </article>
          ))}
        </div>
      </main>
    </div>
  );
}
