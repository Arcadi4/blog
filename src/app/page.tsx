import Link from "@/components/Link";
import crypto from "crypto";
import { getSortedPostsData } from "@/lib/posts";
import { formatDate } from "@/lib/utils";
import ProximityLink from "@/components/ProximityLink";

const posts = getSortedPostsData();
const latestPosts = posts.slice(0, 3);

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ homeName?: string }>;
}) {
  const params = await searchParams;
  const homeName = params.homeName;
  const displayName =
    homeName &&
    crypto.createHash("md5").update(homeName).digest("hex") ===
      "441be6a1cc1cc50f35b95395f20f6b55"
      ? homeName
      : "4rcadia";

  return (
    <main className="relative min-h-[166dvh] flex flex-col">
      <div className="absolute bg-acid right-0 top-0 h-128 w-1/2 -z-50" />
      <div className="absolute bg-none left-0 top-0 h-full w-12 border-r-2 border-r-black" />
      <p className="absolute -left-1/12 -top-1/3 text-[768pt] font-serif text-acid -z-10">
        *
      </p>
      <section className="h-64 border-b-2 border-b-black">
        <div className="flex flex-row">
          <h1 className="h1-hero min-w-3/4 pl-14 pt-4 select-none self-center">
            {displayName}&apos;s
            <br />
            Blog
          </h1>
          <div className="relative h-full">
            <div className="absolute bg-magenta h-80 w-16 right-full -z-30" />
            <div className="flex flex-col pl-2">
              <ProximityLink
                href="https://github.com/arcadi4"
                className="large-link"
              >
                GitHub
              </ProximityLink>
              <ProximityLink
                href="https://space.bilibili.com/499244418"
                className="large-link"
              >
                bilibili
              </ProximityLink>
              <ProximityLink
                href="https://x.com/_4rcadia"
                className="large-link"
              >
                Twitter
              </ProximityLink>
            </div>
          </div>
        </div>
      </section>
      <div className="h-16 border-b-2 border-b-black" />
      <div className="border-b-2 border-b-black ">
        <div className="flex flex-row">
          <p className="large-p pl-16 min-w-3/4">LATEST ARTICLES</p>
          <div className="flex flex-col pl-2">
            <ProximityLink href="/about" className="large-link">
              About
            </ProximityLink>
            <ProximityLink href="/contact" className="large-link">
              Contact
            </ProximityLink>
            <ProximityLink href="/projects" className="large-link">
              Projects
            </ProximityLink>
            <ProximityLink href="/links" className="large-link">
              Friend Links
            </ProximityLink>
          </div>
        </div>
      </div>
      <section className="flex flex-row flex-1">
        <div className="w-3/4">
          <div className="flex flex-col gap-8 max-w-2/3">
            {latestPosts.map((post) => (
              <article className="relative flex flex-row gap-4" key={post.slug}>
                <div className="absolute h-full w-6 bg-klein " />
                <div className="absolute h-full w-1/3 left-full bg-klein" />
                <div className="w-96 pl-16">
                  <Link href={`/posts/${post.slug}`} className="large-p">
                    {post.title}
                  </Link>
                  <p className="large-p">{formatDate(post.date)}</p>
                </div>
                {post.excerpt && <p className="large-p w-96">{post.excerpt}</p>}
              </article>
            ))}
          </div>
        </div>
        <div className="absolute font-title font-bold text-[640pt] text-stroke left-1/2 -top-32 select-none -z-10">
          &
        </div>
        <div className="flex flex-col justify-between items-start">
          <div className="relative flex flex-col pl-2">
            <ProximityLink href="/tags" className="large-link">
              Tags
            </ProximityLink>
            <ProximityLink href="/all" className="large-link">
              All Posts
            </ProximityLink>
            <div className="absolute bg-magenta h-96 w-16 top-full translate-y-4 -z-30" />
          </div>
        </div>
      </section>
      <footer className="h-80 bg-klein"></footer>
    </main>
  );
}
