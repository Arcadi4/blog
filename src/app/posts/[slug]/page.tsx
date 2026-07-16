import {notFound} from "next/navigation";
import NextLink from "next/link";
import {getAllPostSlugs, getPostData} from "@/lib/posts";
import {formatDate} from "@/lib/utils";
import {menuItems} from "@/app/posts/menuItems";
import {EaseIn} from "@/components/animations/EaseIn";
import {ScaleIn} from "@/components/animations/ScaleIn";
import {Menu} from "@/components/Menu";
import MarqueeCard from "@/components/MarqueeCard";
import VerticalGrid from "@/components/VerticalGrid";
import {Metadata} from "next";
import {colorKlein} from "@/lib/colors";

export const dynamicParams = false;

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
}): Promise<Metadata> {
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

const yearRampRows = [
  { row: "row-start-1", weight: "font-light" },
  { row: "row-start-2", weight: "font-normal" },
  { row: "row-start-3", weight: "font-medium" },
  { row: "row-start-4", weight: "font-semibold" },
  { row: "row-start-5", weight: "font-bold" },
];

const titleType =
  "font-title text-[clamp(3rem,8vw,9.5rem)] leading-[0.85] font-light tracking-[-0.06em] text-pretty";

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

  const edited = post.publishedAt.getTime() !== post.lastModifiedAt.getTime();
  const year = String(post.publishedAt.getFullYear());

  return (
    <main id="top" className="relative overflow-x-clip">
      {/* ============ Hero poster ============ */}
      <section className="relative grid h-dvh w-dvw grid-cols-12 grid-rows-5 gap-x-4 gap-y-4 p-8">
        {/* Color blocks */}
        <ScaleIn
          from="top"
          className="-z-10 col-span-6 col-start-1 row-span-4 row-start-1 -mt-8 -ml-8 bg-klein"
        />
        <ScaleIn
          from="left"
          delayMs={300}
          className="-z-10 col-start-8 row-start-2 h-2/3 self-end bg-magenta"
        />
        <ScaleIn
          from="bottom"
          delayMs={200}
          className="-z-10 col-span-2 col-start-11 row-start-5 -mr-8 -mb-8 bg-acid"
        />

        {/* Guidelines */}
        <ScaleIn
          from="top"
          delayMs={100}
          className="separator -z-10 col-span-1 col-start-7 row-span-full row-start-1 -my-8 border-r"
        />
        <ScaleIn
          from="right"
          delayMs={150}
          className="separator -z-10 col-span-full col-start-1 row-start-5 -mx-8 border-t"
        />

        {/* Corner text */}
        <p className="col-start-1 row-start-1 leading-none whitespace-pre-line text-background">
          {"https://\nblog.\narcadia\n.moe"}
        </p>
        <p className="col-start-1 row-start-5 self-end">POST_PAGE</p>

        {/* Menu */}
        <aside className="z-50 col-span-full col-start-10 row-start-1">
          <Menu
            items={menuItems}
            linkClassName="font-title text-4xl leading-none"
            delayMs={100}
            delayStepMs={100}
          />
        </aside>

        {/* Year weight ramp */}
        {yearRampRows.map((item, index) => (
          <EaseIn
            key={item.row}
            from="up"
            delayMs={100 * index}
            className={`col-start-8 ${item.row} ${item.weight} self-start text-2xl leading-none tracking-[-0.06em] text-trim-cap select-none`}
          >
            <span>{year}</span>
          </EaseIn>
        ))}

        {/* Title: solid over magenta-stroke echo */}
        <EaseIn
          from="up"
          distance="lg"
          delayMs={200}
          className="col-span-5 col-start-2 row-span-3 row-start-2 self-end"
        >
          <div className="relative">
            <h1
              aria-hidden
              className={`${titleType} text-stroke-magenta absolute inset-0 translate-x-[0.05em] translate-y-[0.05em] select-none`}
            >
              {post.title}.
            </h1>
            <h1 className={`${titleType} relative text-background`}>
              {post.title}
              <span className="text-magenta">.</span>
            </h1>
          </div>
        </EaseIn>

        {/* Rotated slug */}
        <p className="col-start-12 row-span-2 row-start-2 self-center justify-self-end font-mono text-xs leading-none text-klein select-none [writing-mode:vertical-rl]">
          /posts/{post.id}
        </p>

        {/* Metadata */}
        <div className="col-span-3 col-start-9 row-span-2 row-start-3 self-end text-lg leading-tight">
          <EaseIn from="left" delayMs={300}>
            <p>
              <span className="text-klein">{"{published}"}</span>
              <br />
              {formatDate(post.publishedAt)}
            </p>
          </EaseIn>
          {edited && (
            <EaseIn from="left" delayMs={400}>
              <p className="mt-4">
                <span className="text-klein">{"{last revision}"}</span>
                <br />
                {formatDate(post.lastModifiedAt)}
              </p>
            </EaseIn>
          )}
          {post.tags.length > 0 && (
            <EaseIn from="left" delayMs={500}>
              <p className="mt-4">
                <span className="text-klein">{"{tags}"}</span>
                <br />
                {post.tags.map((tag) => `#${tag}`).join(" ")}
              </p>
            </EaseIn>
          )}
          {post.excerpt && (
            <EaseIn from="left" delayMs={600}>
              <p className="mt-4">
                <span className="text-klein">{"{abstract}"}</span>
                <br />
                {post.excerpt}
              </p>
            </EaseIn>
          )}
        </div>

        {/* Scroll hint */}
        <span className="col-start-12 row-start-4 self-end justify-self-end font-mono text-5xl leading-none text-klein">
          ↓↓
        </span>
      </section>

      {/* ============ Body ============ */}
      <section className="relative grid w-dvw grid-cols-12 gap-x-4 p-8">
        <div className="absolute inset-0">
          <VerticalGrid className="h-full" />
        </div>

        <ScaleIn
          from="right"
          className="separator col-span-full row-start-1 -mx-8 border-t"
        />

        <aside className="z-20 col-span-2 col-start-1 row-start-2 pt-16">
          <div className="sticky top-8 font-mono text-sm leading-tight">
            <p className="text-klein">{"{path}"}</p>
            <p className="break-all">/posts/{post.id}</p>
          </div>
        </aside>

        <article className="col-span-6 col-start-4 row-start-2 py-16">
          <div
            className="prose prose-lg max-w-none prose-headings:font-title prose-headings:font-semibold prose-headings:text-foreground prose-h2:text-4xl prose-h3:text-3xl prose-p:text-foreground/80 prose-a:text-klein prose-a:underline prose-a:decoration-klein prose-blockquote:border-l-magenta prose-blockquote:text-foreground/70 prose-strong:text-foreground prose-code:rounded-none prose-code:bg-foreground prose-code:px-1 prose-code:py-0.5 prose-code:text-acid prose-code:before:content-none prose-code:after:content-none prose-pre:rounded-none prose-li:text-foreground/80 prose-img:w-full prose-hr:border-gray-400"
            dangerouslySetInnerHTML={{ __html: post.content || "" }}
          />
        </article>
      </section>

      {/* ============ End cap ============ */}
      <section className="relative grid w-dvw grid-cols-12 gap-x-4 gap-y-4 p-8">
        <ScaleIn durationMs={1000} from="left" onSeen minPosition={5}>
          <MarqueeCard className="col-span-7 col-start-1 row-start-1 -ml-8 h-32 bg-acid">
            end of transmission end of transmission end of transmission
          </MarqueeCard>
        </ScaleIn>

        <nav className="z-50 col-span-full col-start-8 row-start-1 self-center">
          <Menu
            items={[
              { name: "Back to home", href: "/" },
              { name: "All posts", href: "/all" },
            ]}
            itemClassName="font-funnel-display text-6xl leading-none"
            prefix="← "
            shadowColor={colorKlein}
            onSeen
          />
        </nav>

        <ScaleIn
          from="right"
          onSeen
          className="separator col-span-full row-start-2 -mx-8 border-t"
        />

        <p className="col-start-1 row-start-3 self-end font-mono leading-none">
          <span className="text-klein">EOF</span>
          {` /posts/${post.id}`}
        </p>
        <NextLink
          href="#top"
          className="col-start-12 row-start-3 self-end justify-self-end font-mono leading-none text-klein"
        >
          ↑↑
        </NextLink>
      </section>
    </main>
  );
}
