import { getPostData, getAllPostSlugs } from "@/lib/posts";
import { formatDate } from "@/lib/utils";
import Link from "@/components/Link";
import ProximityLink from "@/components/ProximityLink";
import { SimpleEntrance } from "@/components/animations/EntranceSimple";

export async function generateStaticParams() {
  const posts = getAllPostSlugs();
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
  return {
    title: post.title,
    description: post.excerpt,
  };
}

export default async function Post({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostData(slug);

  const heroDelay = 0;
  const railDelay = 400;
  const proseDelay = 800;

  return (
    <main className="min-h-dvh flex flex-col" data-reader-page>
      <section
        className="h-screen w-full bg-white relative border-b-2 border-b-black"
        data-reader-hero
      >
        <div className="absolute inset-0 -z-50 bg-white" />

        <div className="flex flex-row h-full w-full p-6 gap-6">
          {/* Left zone: repeated slug text */}
          <div className="flex-1 h-full relative">
            <SimpleEntrance delayMs={heroDelay}>
              <div className="flex flex-col z-20 gap-1 absolute left-0 top-0">
                {Array.from({ length: 5 }, (_, index) => (
                  <p key={index} className="font-mono large-p">
                    {slug}
                  </p>
                ))}
              </div>
            </SimpleEntrance>
            <SimpleEntrance delayMs={heroDelay + 200}>
              <div className="flex flex-col z-20 gap-1 absolute left-0 bottom-[calc(1/3*100%+.5rem)]">
                {Array.from({ length: 5 }, (_, index) => (
                  <p key={index} className="font-mono large-p">
                    {slug}
                  </p>
                ))}
              </div>
            </SimpleEntrance>
            <SimpleEntrance delayMs={heroDelay + 400}>
              <div className="absolute left-0 bottom-0 w-full h-1/4 bg-klein -z-10" />
            </SimpleEntrance>
          </div>

          {/* Center zone: navigation/meta */}
          <div className="flex-1 h-full relative border-x-2 border-x-black">
            <SimpleEntrance delayMs={heroDelay + 600}>
              <div
                className="flex flex-col items-end absolute right-6 top-[calc(2/3*100%-6*3rem+.5rem)]"
                data-reader-meta-strip
              >
                <ProximityLink href="/" className="large-link select-none">
                  Home
                </ProximityLink>
              </div>
            </SimpleEntrance>
            <SimpleEntrance delayMs={heroDelay + 800}>
              <pre className="large-p absolute left-6 bottom-6">
                {formatDate(post.date)}
              </pre>
            </SimpleEntrance>
            <SimpleEntrance delayMs={heroDelay + 1000}>
              <pre className="large-p absolute left-6 top-6">
                {post.excerpt || ""}
              </pre>
            </SimpleEntrance>
            <SimpleEntrance delayMs={heroDelay + 400}>
              <div className="absolute right-0 top-0 w-1/2 h-1/3 bg-magenta -z-10" />
            </SimpleEntrance>
          </div>

          {/* Right zone: title/glyph */}
          <div className="flex-1 h-full relative">
            <SimpleEntrance delayMs={heroDelay + 200}>
              <div className="absolute left-0 top-0 -translate-x-1/2 -translate-y-1/6 text-[1280px] font-medium font-serif text-stroke -z-10 pointer-events-none select-none">
                *
              </div>
            </SimpleEntrance>
            <SimpleEntrance delayMs={heroDelay + 1200}>
              <div className="absolute bottom-1/3">
                <h1 className="h1-hero w-fit relative" data-reader-hero-title>
                  {post.title}
                  <div className="w-full h-screen bg-acid absolute bottom-full z-30" />
                </h1>
              </div>
            </SimpleEntrance>
          </div>
        </div>
      </section>

      <section
        className="bg-white flex-1 flex flex-col md:flex-row"
        data-reader-shell
      >
        <div
          data-reader-rail
          className="w-full md:w-48 border-b-2 md:border-b-0 md:border-r-2 border-black flex-shrink-0"
        >
          <SimpleEntrance
            delayMs={railDelay}
            className="p-8 flex flex-col md:flex-col gap-8 md:sticky md:top-0"
          >
            <div>
              <p className="article-meta-label mb-2">Date</p>
              <time className="text-sm leading-tight text-black">
                {formatDate(post.date)}
              </time>
            </div>
            {post.excerpt && (
              <div>
                <p className="article-meta-label mb-2">Excerpt</p>
                <p className="text-xs leading-snug text-black/70">
                  {post.excerpt}
                </p>
              </div>
            )}
            <div>
              <p className="article-meta-label mb-2">Slug</p>
              <p className="text-xs font-mono text-black/60">{slug}</p>
            </div>
          </SimpleEntrance>
        </div>

        <div data-reader-body className="flex-1 flex flex-col">
          <SimpleEntrance
            delayMs={proseDelay}
            className="py-8 md:py-16 px-6 md:px-12 max-w-2xl"
          >
            <article>
              <div
                className="article-prose"
                dangerouslySetInnerHTML={{ __html: post.content || "" }}
              />

              <div data-reader-exit>
                <SimpleEntrance
                  delayMs={proseDelay + 200}
                  className="article-exit-panel"
                >
                  <div className="exit-marker">&gt;&gt;&gt;</div>

                  <div className="exit-cta-section">
                    <p className="exit-label mb-6">End of Article</p>
                    <Link href="/" className="large-link" data-reader-exit-link>
                      ← Back Home
                    </Link>
                  </div>

                  <div className="exit-license">
                    <p className="exit-label">License</p>
                    <p className="text-xs font-mono text-black/75 leading-relaxed">
                      All articles and web design licensed under CC BY-NC 4.0
                      unless otherwise specified.
                    </p>
                  </div>

                  <div className="exit-marker text-right">&gt;&gt;&gt;</div>
                </SimpleEntrance>
              </div>
            </article>
          </SimpleEntrance>
        </div>
      </section>
    </main>
  );
}
