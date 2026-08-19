"use client"
import { menuItems, socialMediaItems } from "@/app/posts/menuItems"
import { ScenePersistentElement } from "@/components/animations/ScenePersistentElement"
import { SceneReveal } from "@/components/animations/SceneReveal"
import { HomeSlideDeck } from "@/components/home/HomeSlideDeck"
import { SceneGrid } from "@/components/home/SceneGrid"
import { Barcode } from "@/components/signal/Barcode"
import type { ContentArticle } from "@/lib/content-index"
import Link from "next/link"
import ProximityLink from "@/components/proximity/ProximityLink"
import Image from "next/image"
import { formatDate } from "@/lib/utils"

type HomePageClientProps = {
  readonly articles: readonly ContentArticle[]
}

export function HomePageClient({ articles }: HomePageClientProps) {
  const latestArticles = articles
    .toSorted((a, b) => b.publishDate.valueOf() - a.publishDate.valueOf())
    .slice(0, 3)
  const labels = [
    "Home",
    "Nav",
    ...latestArticles.map((article) => article.title),
    "Footer"
  ]

  return (
    <HomeSlideDeck labels={labels}>
      <SceneGrid rows={6}>
        <ScenePersistentElement name="primary-panel">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 left-0 -z-2 w-[8%] bg-klein"
          />
        </ScenePersistentElement>

        <header className="col-span-4 col-start-3 row-start-1 self-start text-sm leading-none">
          <span className="text-klein">©</span> 2026 4rcadia
          <br />
          <span>blog.arcadia.moe</span>
        </header>

        <SceneReveal direction="left" distance="far" durationMs={980}>
          <h1 className="col-start-3 row-start-2 self-end font-funnel-display text-[12rem] text-trim-cap">
            @4rcadia
          </h1>
        </SceneReveal>

        <SceneReveal direction="left" distance="far" durationMs={980}>
          <p className="col-span-7 col-start-4 row-span-3 row-start-3 self-center font-funnel-display text-5xl text-trim-cap leading-none text-klein">
            studying <span className="text-black">applied mathematics</span>;
            <br />
            i am a <span className="text-black">full stack dev</span>;
            <br />
            hobbyist <span className="text-black">graphical designer</span>;
            <br />
            i play{" "}
            <span className="text-black">
              Dark Souls, Rogue-likes, Minecraft
            </span>
            , and more;
            <br />
            fan of <span className="text-black">j-pop band ZUTOMAYO</span>;
          </p>
        </SceneReveal>

        <SceneReveal delayMs={280}>
          <div className="col-span-9 col-start-3 row-start-6 flex justify-between gap-6 border-t border-foreground pt-4">
            <Barcode code="blog.arcadia.moe" />
            <span
              aria-hidden="true"
              className="font-funnel-display text-5xl text-klein"
            >
              ↓
            </span>
          </div>
        </SceneReveal>
      </SceneGrid>

      <SceneGrid className="text-background" gridLines="background" rows={5}>
        <ScenePersistentElement name="primary-panel">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 -z-2 bg-klein"
          />
        </ScenePersistentElement>

        <h2 className="col-span-4 col-start-5 row-span-full ml-4 self-center justify-self-center font-funnel-display text-[3cqw] leading-none text-gray-800">
          <SceneReveal direction="up" delayMs={750} distance="near">
            <div>Navigation.</div>
          </SceneReveal>
          <SceneReveal direction="up" delayMs={600} distance="near">
            <div>Navigation.</div>
          </SceneReveal>
          <SceneReveal direction="scale" delayMs={300} distance="near">
            <div>
              <span className="font-medium text-acid">Navigation.</span>
              <br />
            </div>
          </SceneReveal>
          <SceneReveal direction="down" delayMs={600} distance="near">
            <div>Navigation.</div>
          </SceneReveal>
          <SceneReveal direction="down" delayMs={750} distance="near">
            <div>Navigation.</div>
          </SceneReveal>
        </h2>

        <nav
          aria-label="Main navigation"
          className="col-span-4 col-start-1 row-span-3 row-start-1"
        >
          {menuItems
            .filter((item) => item.href !== "/")
            .map((item, index) => (
              <SceneReveal
                key={item.name}
                direction="left"
                delayMs={320 + index * 80}
              >
                <div className="w-full border-t border-background">
                  <p>({index + 1})</p>
                  <ProximityLink
                    href={item.href}
                    key={item.href}
                    label={item.name}
                    className="my-2.5 text-6xl"
                    shadowColor="#000000"
                  />
                </div>
              </SceneReveal>
            ))}
        </nav>

        <nav
          aria-label="Social media"
          className="col-span-3 col-start-9 row-span-full row-start-4"
        >
          {socialMediaItems
            .filter((item) => item.href !== "/")
            .map((item, index) => (
              <SceneReveal
                key={item.name}
                direction="right"
                delayMs={640 + index * 80}
              >
                <div className="w-full border-t border-background">
                  <p>({index + 1})</p>
                  <ProximityLink
                    href={item.href}
                    key={item.href}
                    label={item.name}
                    className="my-2.5 text-6xl"
                    shadowColor="#000000"
                  />
                </div>
              </SceneReveal>
            ))}
        </nav>
      </SceneGrid>

      {latestArticles.map((article, index) => (
        <SceneGrid as="article" rows={8} gridLines="none" key={article.id}>
          <ScenePersistentElement
            name="primary-panel"
            transition={{
              in: {
                duration: 400,
                opacity: 0
              },
              out: {
                duration: 400,
                opacity: 0
              }
            }}
          >
            <div
              aria-hidden="true"
              className="col-span-5 col-start-7 row-span-2 row-start-1 bg-black"
            />
          </ScenePersistentElement>

          <ScenePersistentElement
            layerZIndex={10}
            name="article-page-header"
            transition={{
              in: {
                opacity: 0,
                transform: "scale(0,1)",
                transformOrigin: "right",
                delay: 400
              },
              out: {
                opacity: 0,
                duration: 400
              }
            }}
          >
            <div
              aria-hidden="true"
              className="pointer-events-none relative col-span-9 col-start-3 row-span-1 row-start-3 -mt-4 origin-right bg-magenta"
            >
              <h2 className="absolute right-0 bottom-0 font-funnel-display text-9xl text-trim-cap leading-none tracking-tighter">
                Latest Articles
              </h2>
            </div>
          </ScenePersistentElement>

          <ScenePersistentElement
            name="article-index"
            transition={{
              change: {
                effect: "morph"
              },
              in: {
                opacity: 0,
                transform: "translateY(35%)"
              },
              out: {
                opacity: 0,
                transform: "translateY(-35%)"
              }
            }}
          >
            <div
              aria-hidden="true"
              className="col-end-12 row-start-1 justify-self-end font-funnel-display text-9xl text-trim-cap leading-none tracking-tighter text-white"
            >
              {`{${String(index + 1).padStart(2, "0")}}`}
            </div>
          </ScenePersistentElement>

          <div className="separator absolute inset-0 row-span-1 row-start-6 -my-4 border-y" />
          <div className="separator absolute inset-0 row-span-1 row-start-7 border-b" />

          <SceneReveal delayMs={180} distance="far">
            <Link
              aria-label={article.title}
              href={`/posts/${article.slug}`}
              key={article.id}
              className="group relative col-span-full row-start-6 grid grid-cols-subgrid"
            >
              <div className="absolute inset-0 -z-10 col-span-8 col-start-2 -my-4 origin-left bg-acid transition-all duration-500 ease-[cubic-bezier(.76,0,.24,1)] group-hover:scale-x-[1.05] group-hover:bg-klein group-focus-visible:scale-x-[1.05] motion-reduce:transition-none" />
              <div className="col-span-4 col-start-2">
                <h2 className="text-justify font-funnel-display text-4xl font-medium">
                  {article.title}
                </h2>
              </div>
              <div className="col-span-3 col-start-7">
                <p>{article.excerpt}</p>
                <p className="mt-2 -translate-x-2 font-mono text-xs leading-none text-white uppercase opacity-0 transition duration-300 group-hover:translate-x-0 group-hover:opacity-100 motion-reduce:transition-none">
                  Read article →
                </p>
              </div>
            </Link>
          </SceneReveal>

          <SceneReveal delayMs={360} distance="far">
            <div className="relative col-span-full row-start-7 grid grid-cols-subgrid">
              <p className="absolute bottom-0 col-start-2 leading-none">
                Published
                <br />
                {formatDate(article.publishDate)}
              </p>
              <p className="absolute bottom-0 col-start-4 leading-none">
                Edited
                <br />
                {formatDate(article.lastEditedTime)}
              </p>
            </div>
          </SceneReveal>

          {article.banner && (
            <SceneReveal delayMs={320} distance="near">
              <div className="relative col-span-7 col-start-2 row-span-4 row-start-2 overflow-hidden">
                <Link href={`/posts/${article.slug}`} className="group">
                  <Image
                    src={article.banner}
                    alt={article.title}
                    fill
                    className="object-cover transition-transform duration-700 ease-[cubic-bezier(.76,0,.24,1)] group-hover:scale-[1.05] group-focus-visible:scale-[1.05] motion-reduce:transition-none"
                  />
                </Link>
              </div>
            </SceneReveal>
          )}
        </SceneGrid>
      ))}

      <SceneGrid className="text-background" gridLines="background" rows={8}>
        <SceneReveal direction="up" delayMs={240}>
          <div className="col-span-7 col-start-1 row-span-full row-start-2 -mx-8 bg-acid" />
        </SceneReveal>
        <SceneReveal direction="up" delayMs={480}>
          <div className="col-span-9 col-start-1 row-span-full row-start-3 -mx-8 bg-magenta" />
        </SceneReveal>
        <SceneReveal direction="up" delayMs={720}>
          <div className="col-span-11 col-start-1 row-span-full row-start-4 -mx-8 bg-klein" />
        </SceneReveal>

        <div className="absolute inset-0 top-1/2 bg-gray-900" />

        <SceneReveal direction="up" delayMs={520} distance="near">
          <Link
            href="/all"
            className="group relative col-span-10 col-start-2 row-span-2 row-start-6 grid grid-cols-subgrid items-center overflow-hidden border-y border-background focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-acid"
          >
            <span
              aria-hidden="true"
              className="absolute inset-0 origin-left scale-x-0 bg-acid transition-transform duration-600 ease-[cubic-bezier(.76,0,.24,1)] group-hover:scale-x-100 motion-reduce:transition-none"
            />
            <span className="z-1 col-span-7 flex gap-2 align-top font-funnel-display transition-colors duration-300 group-hover:text-foreground group-focus-visible:text-foreground motion-reduce:transition-none">
              <span className="text-9xl text-trim-cap leading-none font-medium tracking-tighter">
                All posts
              </span>
              <span className="text-base">({articles.length})</span>
            </span>
            <span className="z-1 col-start-10 justify-self-end font-funnel-display text-7xl transition-colors duration-300 group-hover:text-foreground group-focus-visible:text-foreground motion-reduce:transition-none">
              →
            </span>
          </Link>
        </SceneReveal>
      </SceneGrid>
    </HomeSlideDeck>
  )
}
