import { notFound } from "next/navigation"
import { getAllPostSlugs, getPostData } from "@/lib/posts"
import { formatDate } from "@/lib/utils"
import { menuItems } from "@/app/posts/menuItems"
import { Entrance } from "@/components/animations/Entrance"
import { MarkdownContent } from "@/components/article/MarkdownContent"
import { ArticleWheelNav, ReadingProgress, type TocItem } from "./PostClient"
import { Menu } from "@/components/layout/Menu"
import { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"

export const dynamicParams = false

export async function generateStaticParams() {
  const posts = await getAllPostSlugs()
  return posts.map((post) => ({
    slug: post.slug
  }))
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const post = await getPostData(slug)

  if (!post) {
    return {
      title: slug
    }
  }

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt
    }
  }
}

const gridClassName = "grid grid-cols-12 gap-4 p-8"

function slugifyHeading(input: string): string {
  const stripped = input
    .replace(/<[^>]+>/g, "")
    .trim()
    .toLowerCase()
  return stripped
    .replace(/\s+/g, "-")
    .replace(/[^\w\u4e00-\u9fff-]+/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 48)
}

export default async function Post({
  params
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = await getPostData(slug)

  if (!post) {
    notFound()
  }

  const edited = post.publishedAt.getTime() !== post.lastModifiedAt.getTime()

  let toc: TocItem[] = []
  let finalHtml = post.content
  let headingCursor = 0

  const withH2H3 = post.content.replace(
    /<h([2-3])([^>]*)>([\s\S]*?)<\/h\1>/gi,
    (full: string, levelStr: string, attrs: string, inner: string) => {
      const label = inner
        .replace(/<[^>]+>/g, "")
        .replace(/\s+/g, " ")
        .trim()
      if (!label) return full
      const base = slugifyHeading(label) || "section"
      const id = `${base}-${headingCursor}`
      toc.push({ id, label, level: Number(levelStr) })
      headingCursor += 1
      if (/id\s*=/.test(attrs)) return full
      return `<h${levelStr}${attrs} id="${id}">${inner}</h${levelStr}>`
    }
  )

  if (toc.length > 0) {
    finalHtml = withH2H3
  } else {
    let h1Cursor = 0
    const h1Toc: TocItem[] = []
    const withH1 = post.content.replace(
      /<h1([^>]*)>([\s\S]*?)<\/h1>/gi,
      (full: string, attrs: string, inner: string) => {
        const label = inner
          .replace(/<[^>]+>/g, "")
          .replace(/\s+/g, " ")
          .trim()
        if (!label) return full
        const base = slugifyHeading(label) || "section"
        const id = `${base}-${h1Cursor}`
        h1Toc.push({ id, label, level: 1 })
        h1Cursor += 1
        if (/id\s*=/.test(attrs)) return full
        return `<h1${attrs} id="${id}">${inner}</h1>`
      }
    )
    if (h1Toc.length > 0) {
      toc = h1Toc
      finalHtml = withH1
    }
  }

  return (
    <main
      id="top"
      className="relative isolate min-h-dvh overflow-x-clip bg-background text-foreground"
    >
      <ReadingProgress />
      <ArticleWheelNav items={toc} />

      {/* Hero — short Swiss, banner as main visual below */}
      <section
        aria-labelledby="post-title"
        className={`${gridClassName} relative`}
      >
        <Entrance
          animationClassName="fade-in slide-in-from-left-4"
          as="header"
          className="col-span-4 col-start-1 row-start-1 self-start"
          durationMs={500}
        >
          <Link
            className="font-funnel-display text-4xl leading-none tracking-[-0.04em] transition-colors hover:text-klein focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-klein"
            href="/"
          >
            @4rcadia
          </Link>
        </Entrance>

        <nav
          aria-label="Primary"
          className="col-span-3 col-start-9 row-span-1 row-start-1 self-start justify-self-end max-md:col-span-5 max-md:col-start-8"
        >
          <Menu
            items={menuItems.filter((item) => item.href !== "/all")}
            className="flex flex-col items-end font-funnel-display text-4xl leading-none max-md:text-3xl"
            delayMs={240}
            delayStepMs={55}
          />
        </nav>

        <Entrance
          animationClassName="fade-in slide-in-from-bottom-4"
          as="div"
          className="col-span-7 col-start-2 row-start-2 mt-8 self-end max-md:col-span-full max-md:col-start-1 max-md:mt-8"
          delayMs={160}
          durationMs={700}
        >
          <h1
            id="post-title"
            className="font-funnel-display text-[clamp(2.8rem,6vw,5.2rem)] leading-[0.88] font-medium tracking-[-0.06em] text-pretty"
          >
            {post.title}
          </h1>
        </Entrance>

        <div className="col-span-6 col-start-2 row-start-3 mt-3 flex flex-wrap gap-x-6 gap-y-2 self-start text-sm leading-tight max-md:col-span-full max-md:col-start-1">
          <span>
            <span className="text-foreground/45">Published</span>{" "}
            {formatDate(post.publishedAt)}
          </span>
          {edited && (
            <span>
              <span className="text-foreground/45">Revised</span>{" "}
              {formatDate(post.lastModifiedAt)}
            </span>
          )}
          {post.tags.length > 0 && (
            <span>
              {post.tags.map((tag) => (
                <span key={tag} className="mr-2 last:mr-0">
                  + {tag}
                </span>
              ))}
            </span>
          )}
        </div>
      </section>

      {post.banner ? (
        <section className={`${gridClassName} pt-0`}>
          <Entrance
            animationClassName="fade-in slide-in-from-bottom-4"
            as="div"
            className="col-span-10 col-start-2 overflow-hidden border border-foreground/10 max-md:col-span-full max-md:col-start-1"
            delayMs={220}
            durationMs={700}
            onSeen
          >
            <div className="relative aspect-[21/9] max-h-[28vh] w-full overflow-hidden bg-[#ececec]">
              <Image
                src={post.banner}
                alt={post.title}
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 80vw, 100vw"
                priority={false}
              />
            </div>
          </Entrance>
        </section>
      ) : null}

      {/* Body — 12-col reading grid, generous whitespace */}
      <section className="grid grid-cols-12 gap-4 px-8 py-12 max-md:px-6 max-md:py-10">
        {/* Mobile TOC */}
        <details className="group col-span-full lg:hidden">
          <summary className="flex cursor-pointer list-none items-center justify-between border-y border-foreground py-3">
            <span className="text-sm tracking-[-0.02em]">
              Contents — {toc.length}
            </span>
            <span className="text-lg leading-none transition-transform group-open:rotate-45">
              +
            </span>
          </summary>
          <ol className="mt-4 grid gap-2">
            {toc.length === 0 ? (
              <li className="text-sm text-foreground/40">
                No sections — linear reading.
              </li>
            ) : (
              toc.map((item, i) => (
                <li
                  key={item.id}
                  className="flex gap-3 border-b border-foreground/10 py-2 last:border-0"
                >
                  <span className="text-sm text-foreground/30">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <a
                    href={`#${item.id}`}
                    className="font-funnel-display text-sm leading-tight tracking-[-0.01em] hover:text-klein"
                  >
                    {item.label}
                  </a>
                </li>
              ))
            )}
          </ol>
        </details>

        {/* Center prose */}
        <div className="col-span-12 lg:col-span-6 lg:col-start-4">
          {post.excerpt && (
            <Entrance
              animationClassName="fade-in slide-in-from-bottom-4"
              as="div"
              className="mb-10 border-y border-foreground py-6"
              delayMs={120}
              durationMs={600}
              onSeen
            >
              <p className="font-funnel-display text-[clamp(1.25rem,2.2vw,1.75rem)] leading-[1.15] tracking-[-0.02em] text-pretty">
                {post.excerpt}
              </p>
            </Entrance>
          )}

          <Entrance
            animationClassName="fade-in slide-in-from-bottom-2"
            as="div"
            className="min-w-0"
            delayMs={80}
            durationMs={650}
            onSeen
          >
            <MarkdownContent className="min-w-0" html={finalHtml} />
          </Entrance>
        </div>
      </section>

      {/* End */}
      <section className="grid grid-cols-12 gap-4 border-t border-foreground/15 p-8">
        <div className="col-span-7 col-start-1 flex items-center gap-3 self-center max-md:col-span-full">
          <span
            className="hidden h-px flex-1 bg-foreground/10 md:block"
            aria-hidden
          />
          <p className="text-xs tracking-[-0.01em] text-foreground/30">
            end of transmission
          </p>
        </div>

        <nav
          aria-label="Post navigation"
          className="col-span-5 col-start-8 flex flex-col items-end gap-1 self-center max-md:col-span-full max-md:items-start"
        >
          <Menu
            items={[
              { name: "Back to home", href: "/" },
              { name: "All posts", href: "/all" }
            ]}
            className="flex flex-col items-end max-md:items-start"
            linkClassName="font-funnel-display text-4xl leading-none tracking-[-0.03em] hover:text-klein max-md:text-3xl"
            prefix="← "
            delayMs={120}
            delayStepMs={80}
          />
          <Link
            href="#top"
            className="mt-2 text-xs tracking-[-0.01em] text-foreground/40 underline-offset-4 hover:text-foreground hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-klein"
          >
            ↑ back to top
          </Link>
        </nav>
      </section>
    </main>
  )
}
