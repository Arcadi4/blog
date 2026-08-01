"use client"

import { menuItems, socialMediaItems } from "@/app/posts/menuItems"
import { ScenePersistentElement } from "@/components/animations/ScenePersistentElement"
import { SceneReveal } from "@/components/animations/SceneReveal"
import { HomeSlideDeck } from "@/components/home/HomeSlideDeck"
import { SceneGrid } from "@/components/home/SceneGrid"
import { Barcode } from "@/components/signal/Barcode"
import type { ContentArticle } from "@/lib/content-index"
import { cn } from "@/lib/utils"
import NextLink from "next/link"
import ProximityLink from "@/components/proximity/ProximityLink"

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
          <div className="col-span-8 col-start-3 row-start-6 flex justify-between gap-6 border-t border-foreground pt-4">
            <Barcode code="4rcadia" />
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
        <SceneGrid as="article" key={article.id} rows={8}>
          <ScenePersistentElement name="primary-panel">
            <div
              aria-hidden="true"
              className={cn(
                "pointer-events-none absolute inset-y-0 w-[16dvw] left-[66.2dvw]",
                index === 0
                  ? "bg-magenta"
                  : index === 1
                    ? "bg-acid"
                    : "bg-klein"
              )}
            />
          </ScenePersistentElement>

          <ScenePersistentElement
            name="total-articles"
            transition={{
              in: {
                opacity: 0,
                transform: "translateX(35%)"
              },
              out: {
                opacity: 0,
                transform: "translateX(-35%)"
              }
            }}
          >
            <div
              aria-hidden="true"
              className="col-start-3 row-start-2 font-funnel-display text-[5.9cqw] text-trim-cap leading-none tracking-tighter text-gray-500"
            >
              /03
            </div>
          </ScenePersistentElement>

          <SceneReveal direction="left" distance="far" durationMs={920}>
            <div
              aria-hidden="true"
              className="col-span-3 col-start-1 row-start-2 -ml-2 font-funnel-display text-[16cqw] text-trim-cap leading-none tracking-tighter"
              data-article-index={index}
            >
              {String(index + 1).padStart(2, "0")}
            </div>
          </SceneReveal>

          <SceneReveal delayMs={180} distance="far">
            <div className="col-span-5 col-start-3 row-start-4">
              <h2 className="text-justify font-funnel-display text-7xl text-trim-cap leading-none font-medium">
                {article.title}
              </h2>
              <p className="mt-8 text-xl">{article.excerpt}</p>
            </div>
          </SceneReveal>
        </SceneGrid>
      ))}

      <SceneGrid className="text-background" gridLines="none" rows={8}>
        <ScenePersistentElement name="primary-panel">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 -z-2 bg-foreground"
          />
        </ScenePersistentElement>

        <div
          aria-hidden="true"
          className="absolute top-0 left-[7vw] font-serif text-[70rem] leading-none text-magenta"
        >
          *
        </div>

        <SceneReveal delayMs={140} distance="far">
          <div className="z-1 col-span-7 col-start-3 row-span-5 row-start-2 flex flex-col justify-center">
            <h2 className="font-funnel-display text-9xl leading-none font-medium text-acid">
              Looking for more?
            </h2>
            <NextLink
              className="mt-[clamp(1.5rem,4vh,3rem)] flex w-[min(100%,38rem)] items-center justify-between bg-acid p-4 font-mono text-[.78rem] leading-none text-foreground uppercase hover:bg-magenta hover:text-background"
              href="/all"
            >
              <span>All articles</span>
              <span aria-hidden="true">→</span>
            </NextLink>
          </div>
        </SceneReveal>

        <SceneReveal delayMs={300}>
          <div className="z-1 col-span-11 row-start-8 flex items-end justify-between border-t border-background/30 pt-[.7rem] font-mono text-[.66rem] uppercase">
            <Barcode className="text-background" code="End-of-File" />
          </div>
        </SceneReveal>
      </SceneGrid>
    </HomeSlideDeck>
  )
}
