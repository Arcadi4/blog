import Link from "@/components/Link";
import crypto from "crypto";
import { getSortedPostsData } from "@/lib/posts";
import { formatDate } from "@/lib/utils";

const posts = getSortedPostsData();
const latestPosts = posts.slice(0, 3);

export default async function Home({ searchParams }: { searchParams: Promise<{ homeName?: string; }>; }) {
  const params = await searchParams;
  const homeName = params.homeName;
  const displayName =
    homeName &&
      crypto.createHash("md5").update(homeName).digest("hex") === "441be6a1cc1cc50f35b95395f20f6b55"
      ? homeName
      : "4rcadia";

  return (
    <main className="min-h-dvh flex flex-col">
      <section className="bg-acid border-b-2 border-b-black">
        <div className="flex flex-row gap-4 p-4">
          <h1 className="h1-hero min-w-3/5">
            {displayName}&apos;s<br />
            Blog
          </h1>
          <div className="flex flex-col items-start">
            <Link href="https://github.com/arcadi4" className="large-link">
              GitHub
            </Link>
            <Link href="https://space.bilibili.com/499244418" className="large-link">
              Bilibili
            </Link>
            <Link href="https://x.com/_4rcadia" className="large-link">
              Twitter
            </Link>
          </div>
        </div>
      </section >
      <section className="bg-white flex flex-row flex-1">
        <div className="w-3/5 border-r-2 border-r-black px-6 py-4">
          {/* <h1 className="h1-hero">
            Latest<br />Updates
          </h1> */}
          <div className="flex flex-col gap-8">
            <p className="large-p">Latest Updates</p>
            {latestPosts.map((post) => (
              <article className="flex flex-row gap-8" key={post.slug}>
                <div className="min-w-2/4">
                  <Link href={`/posts/${post.slug}`} className="large-p">
                    {post.title}
                  </Link>
                  <p className="large-p">{formatDate(post.date)}</p>
                </div>
                {post.excerpt && (
                  <p className="large-p">{post.excerpt}</p>
                )}
              </article>
            ))}
          </div>
        </div>
        <div className="flex flex-col justify-between px-4 items-start">
          <div className="flex flex-col">
            <Link href="/about" className="large-link">
              About
            </Link>
            <Link href="/projects" className="large-link">
              Projects
            </Link>
            <Link href="/links" className="large-link">
              Links
            </Link>
            <Link href="/contact" className="large-link">
              Contact
            </Link>
          </div>
          <div className="flex flex-col items-start">
            <Link href="/tags" className="large-link">
              Tags
            </Link>
            <Link href="/all" className="large-link">
              All Posts
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
