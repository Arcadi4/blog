import { notFound } from "next/navigation"
import { getAllPostSlugs, getPostData } from "@/lib/posts"
import { formatDate } from "@/lib/utils"
import { menuItems } from "@/app/posts/menuItems"
import { EaseIn } from "@/components/animations/EaseIn"
import { ScaleIn } from "@/components/animations/ScaleIn"
import { MarkdownContent } from "@/components/article/MarkdownContent"
import { Menu } from "@/components/Menu"
import MarqueeCard from "@/components/MarqueeCard"
import VerticalGrid from "@/components/VerticalGrid"
import { Metadata } from "next"
import { colorKlein } from "@/lib/colors"

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

const yearRampRows = [
  { row: "row-start-1", weight: "font-light" },
  { row: "row-start-2", weight: "font-normal" },
  { row: "row-start-3", weight: "font-medium" }
]

const titleType =
  "font-title text-[clamp(3rem,8vw,9.5rem)] leading-[0.85] font-light tracking-[-0.06em] text-pretty"

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
  const year = String(post.publishedAt.getFullYear())

  return (
    <main id="top" className="relative overflow-x-clip">
      {/* Hero */}
      <section className="relative grid h-[60dvh] w-dvw grid-cols-12 grid-rows-3 gap-x-4 gap-y-4 px-8 pt-8">
        {/* Color Block */}
        <ScaleIn
          from="top"
          className="-z-10 col-span-6 col-start-1 row-span-4 row-start-1 -mt-8 -ml-8 bg-klein"
        />

        {/* Guidelines */}
        <ScaleIn
          from="top"
          delayMs={100}
          className="separator absolute inset-0 -z-10 col-span-1 col-start-7 border-r"
        />

        {/* Corner text */}
        <p className="col-start-1 row-start-1 leading-none whitespace-pre-line text-background">
          {"https://\nblog.\narcadia\n.moe"}
        </p>

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
            className={`col-start-8 ${item.row} ${item.weight} self-start text-2xl text-trim-cap leading-none tracking-[-0.06em] select-none`}
          >
            <span>{year}</span>
          </EaseIn>
        ))}

        {/* Title: solid over magenta-stroke echo */}
        <EaseIn
          from="up"
          distance="lg"
          delayMs={200}
          className="col-span-5 col-start-2 row-span-3 row-start-1 self-end"
        >
          <h1 className={`${titleType} relative font-bold text-background`}>
            {post.title}
          </h1>
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
        <span className="col-start-12 row-start-3 self-end justify-self-end font-mono text-5xl leading-none text-klein">
          ↓↓
        </span>
      </section>

      {/* Body */}
      <section className="relative grid w-dvw grid-cols-12 gap-x-4 px-8">
        <div className="absolute inset-0 -z-10">
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

        <MarkdownContent
          className="col-span-8 col-start-3 row-start-2 py-16"
          html={post.content}
        />
      </section>

      {/* End */}
      <section className="relative grid w-dvw grid-cols-12 grid-rows-1 gap-x-4 px-8">
        <div className="separator absolute top-0 z-10 w-dvw border-t" />

        <ScaleIn durationMs={1000} from="left" onSeen minPosition={5}>
          <MarqueeCard className="col-span-7 col-start-1 row-start-1 -ml-8 h-32 bg-acid">
            end of transmission end of transmission end of transmission
          </MarqueeCard>
        </ScaleIn>

        <nav className="z-50 col-span-full col-start-8 row-start-1 self-center">
          <Menu
            items={[
              { name: "Back to home", href: "/" },
              { name: "All posts", href: "/all" }
            ]}
            itemClassName="font-funnel-display text-6xl leading-none"
            prefix="← "
            shadowColor={colorKlein}
          />
        </nav>

        <ScaleIn
          from="right"
          onSeen
          className="separator col-span-full row-start-2 -mx-8 border-t"
        />
      </section>
    </main>
  )
}
