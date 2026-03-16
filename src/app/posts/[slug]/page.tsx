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
  const pathname = `/posts/${slug}`;

  const heroDelay = 0;
  const railDelay = 400;
  const proseDelay = 800;

  return (
    <main className="min-h-dvh flex flex-col" data-reader-page>
      <section
        className="h-auto min-h-screen md:h-screen w-full bg-white relative border-b-2 border-b-black"
        data-reader-hero
      >
        <div className="absolute inset-0 -z-50 bg-white" />

        <div className="flex flex-col md:flex-row h-full w-full p-4 md:p-6 gap-4 md:gap-6">
          {/* Left zone: repeated slug text */}
          <div className="flex-1 h-auto min-h-[33vh] md:h-full relative">
            <SimpleEntrance delayMs={heroDelay}>
              <div className="flex flex-col z-20 gap-1 absolute left-0 top-0">
                {Array.from({ length: 3 }, (_, index) => (
                  <p
                    key={index}
                    className="font-mono text-lg md:text-2xl leading-none"
                  >
                    {pathname}
                  </p>
                ))}
              </div>
            </SimpleEntrance>
            <SimpleEntrance delayMs={heroDelay + 200}>
              <div className="flex flex-col z-20 gap-1 absolute left-0 bottom-0 md:bottom-[calc(1/3*100%+.5rem)]">
                {Array.from({ length: 3 }, (_, index) => (
                  <p
                    key={index}
                    className="font-mono text-lg md:text-2xl leading-none"
                  >
                    {pathname}
                  </p>
                ))}
              </div>
            </SimpleEntrance>
            <SimpleEntrance delayMs={heroDelay + 400}>
              <div className="absolute left-0 bottom-0 w-full h-16 md:h-1/4 bg-klein -z-10" />
            </SimpleEntrance>
          </div>

          {/* Center zone: navigation/meta */}
          <div className="flex-1 h-auto min-h-[33vh] md:h-full relative border-y-2 md:border-y-0 md:border-x-2 border-black">
            <SimpleEntrance delayMs={heroDelay + 600}>
              <div
                className="flex flex-col items-start md:items-end absolute left-4 md:left-auto md:right-6 top-4 md:top-[calc(2/3*100%-6*3rem+.5rem)]"
                data-reader-meta-strip
              >
                <ProximityLink
                  href="/"
                  className="text-3xl md:text-5xl leading-none select-none"
                >
                  Home
                </ProximityLink>
              </div>
            </SimpleEntrance>
            <SimpleEntrance delayMs={heroDelay + 800}>
              <pre className="text-lg md:text-2xl leading-none absolute left-4 md:left-6 bottom-4 md:bottom-6">
                {formatDate(post.date)}
              </pre>
            </SimpleEntrance>
            <SimpleEntrance delayMs={heroDelay + 1000}>
              <pre className="text-lg md:text-2xl leading-none absolute left-4 md:left-6 top-16 md:top-6 right-4 md:right-auto max-w-[calc(100%-2rem)] md:max-w-none">
                {post.excerpt || ""}
              </pre>
            </SimpleEntrance>
            <SimpleEntrance delayMs={heroDelay + 400}>
              <div className="absolute right-0 top-0 w-1/3 md:w-1/2 h-20 md:h-1/3 bg-magenta -z-10" />
            </SimpleEntrance>
          </div>

          {/* Right zone: title/glyph */}
          <div className="flex-1 h-auto min-h-[33vh] md:h-full relative">
            <SimpleEntrance delayMs={heroDelay + 200}>
              <div className="absolute left-0 top-0 -translate-x-1/4 md:-translate-x-1/2 -translate-y-1/6 text-[480px] md:text-[1280px] font-medium font-serif text-stroke -z-10 pointer-events-none select-none">
                *
              </div>
            </SimpleEntrance>
            <SimpleEntrance delayMs={heroDelay + 1200}>
              <div className="absolute bottom-8 md:bottom-1/3">
                <h1
                  className="text-5xl md:text-8xl font-bold leading-[0.8] w-fit relative"
                  data-reader-hero-title
                >
                  {post.title}
                  <div className="w-full h-[50vh] md:h-screen bg-acid absolute bottom-full z-30" />
                </h1>
              </div>
            </SimpleEntrance>
          </div>
        </div>
      </section>

      <section className="w-full" data-reader-transition>
        <div className="w-full h-3 bg-magenta" />
        <div className="w-full border-t-2 border-t-black" />
        <div className="w-full border-t-2 border-t-black mt-2" />
        <div className="flex flex-row items-center gap-4 px-6 py-4 border-b-2 border-b-black">
          <span className="article-meta-label">ARTICLE</span>
          <div className="flex-1 border-t-2 border-t-klein" />
          <span className="text-xs font-mono tracking-wider">
            BEGIN READING
          </span>
        </div>
      </section>

      <section
        className="bg-white flex-1 flex flex-col md:flex-row relative"
        data-reader-shell
      >
        <div
          data-reader-rail
          className="w-full md:w-48 border-b-2 md:border-b-0 md:border-r-2 border-black flex-shrink-0 relative"
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
          <div className="hidden md:block absolute bottom-0 left-0 w-full border-t-2 border-t-black" />
          <div className="hidden md:flex flex-col gap-1 absolute bottom-12 left-4 opacity-20 pointer-events-none">
            {Array.from({ length: 3 }, (_, index) => (
              <p key={index} className="font-mono text-xs">
                {pathname}
              </p>
            ))}
          </div>
        </div>

        <div data-reader-body className="flex-1 flex flex-col relative">
          <div className="absolute top-0 right-0 w-24 h-full border-l-2 border-l-black -z-10" />
          <div className="absolute top-0 right-24 w-12 h-64 bg-magenta -z-20" />

          <SimpleEntrance
            delayMs={proseDelay}
            className="py-8 md:py-16 px-6 md:px-12 max-w-2xl relative"
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
                  <div className="flex flex-row justify-between items-start mb-8">
                    <div className="exit-marker">&gt;&gt;&gt;</div>
                    <div className="exit-marker">&gt;&gt;&gt;</div>
                  </div>

                  <div className="absolute top-4 right-8 text-right">
                    <p className="text-xs font-mono text-black/40 leading-tight">
                      {post.title}
                      <br />
                      {slug}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-b-2 border-b-black pb-8 mb-8">
                    <div>
                      <p className="exit-label mb-4">Status</p>
                      <p className="text-sm font-mono text-black leading-relaxed">
                        Article complete. Reader at end of content.
                      </p>
                    </div>
                    <div>
                      <p className="exit-label mb-4">Navigation</p>
                      <Link
                        href="/"
                        className="large-link"
                        data-reader-exit-link
                      >
                        ← Back Home
                      </Link>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pb-8">
                    <div>
                      <p className="exit-label mb-4">License</p>
                      <p className="text-xs font-mono text-black/75 leading-relaxed">
                        All articles and web design licensed under CC BY-NC 4.0
                        unless otherwise specified.
                      </p>
                    </div>
                    <div>
                      <p className="exit-label mb-4">Metadata</p>
                      <p className="text-xs font-mono text-black/60 leading-relaxed">
                        Slug: {slug}
                        <br />
                        Date: {formatDate(post.date)}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-row justify-between items-end">
                    <div className="exit-marker">&gt;&gt;&gt;</div>
                    <div className="exit-marker">&gt;&gt;&gt;</div>
                  </div>
                </SimpleEntrance>
              </div>
            </article>
          </SimpleEntrance>
        </div>
      </section>
    </main>
  );
}
