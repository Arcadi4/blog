"use client"

import Fuse from "fuse.js"
import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import { menuItems } from "@/app/posts/menuItems"
import { Entrance } from "@/components/animations/Entrance"
import { Menu } from "@/components/layout/Menu"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText
} from "@/components/ui/input-group"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import type { ContentArticle } from "@/lib/content-index"
import { formatDate } from "@/lib/utils"
import { Toggle } from "@/components/ui/toggle"
import HalftoneReveal from "@/components/HalftoneReveal"
import { colorAcid, colorKlein, colorMagenta } from "@/lib/colors"
import OptionWheel from "@/components/OptionWheel"

type AllArticlesClientProps = {
  readonly articles: readonly ContentArticle[]
}

type ArchiveArticleProps = {
  readonly article: ContentArticle
  readonly hidden: boolean
  readonly index: number
  readonly selectedTags: ReadonlySet<string>
}

const gridClassName = "grid grid-cols-12 gap-4 p-8"

const tagClassName =
  "px-2 !rounded-none text-base font-normal data-[state=on]:bg-magenta data-[state=on]:text-white aria-pressed:bg-magenta aria-pressed:text-white"

function ArchiveArticle({
  article,
  hidden,
  index,
  selectedTags
}: ArchiveArticleProps) {
  return (
    <Entrance
      id={`article-${article.slug}`}
      animationClassName="fade-in slide-in-from-bottom-8"
      as="article"
      className={hidden ? "hidden" : "grid grid-cols-12 gap-4 px-8"}
      delayMs={Math.min(index, 3) * 90}
      durationMs={650}
    >
      <div className="col-span-5 col-start-1 flex flex-col gap-4 border-t pt-4">
        <div className="col-span-full flex h-auto justify-between leading-none">
          <p>({index + 1})</p>
          <p>Published {formatDate(article.publishDate)}</p>
          <p>Edited {formatDate(article.lastEditedTime)}</p>
        </div>
        <Link
          aria-label={`Read ${article.title}`}
          href={`/posts/${article.slug}`}
        >
          <h2 className="text-justify font-funnel-display text-6xl leading-none text-pretty transition-colors duration-300 hover:text-klein focus-visible:text-klein">
            {article.title}
          </h2>
        </Link>

        <p className="text-base leading-tight">{article.excerpt}</p>
      </div>

      {article.banner ? (
        <Link
          aria-label={`Read ${article.title}`}
          className="group relative col-span-3 col-start-8 h-full overflow-hidden focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-klein max-md:col-span-9 max-md:col-start-1 max-md:row-start-5"
          href={`/posts/${article.slug}`}
        >
          <HalftoneReveal
            dotDensity={90}
            dotSize={0.6}
            paperColor={colorKlein}
            inkColor={colorAcid}
            src={article.banner}
            borderRadius="0px"
            idleReveal={0.25}
          />
        </Link>
      ) : null}

      {article.tags.length > 0 ? (
        <div className="col-span-2 col-start-11 mt-8 self-end text-[clamp(1.25rem,1.8cqi,2rem)] leading-none max-md:col-span-3 max-md:col-start-10 max-md:row-start-5">
          {article.tags.map((tag) => (
            <p
              className={selectedTags.has(tag) ? "text-klein" : undefined}
              key={tag}
            >
              + {tag}
            </p>
          ))}
        </div>
      ) : null}
    </Entrance>
  )
}

export function AllArticlesClient({ articles }: AllArticlesClientProps) {
  const [query, setQuery] = useState("")
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [showWheel, setShowWheel] = useState(false)
  const [wheelMounted, setWheelMounted] = useState(false)
  const [wheelEntering, setWheelEntering] = useState(false)
  const [selectedWheelIndex, setSelectedWheelIndex] = useState(0)

  const orderedArticles = useMemo(
    () =>
      articles.toSorted(
        (a, b) => b.publishDate.valueOf() - a.publishDate.valueOf()
      ),
    [articles]
  )
  const tags = useMemo(
    () =>
      Array.from(new Set(articles.flatMap((article) => article.tags))).sort(),
    [articles]
  )
  const search = useMemo(
    () =>
      new Fuse(orderedArticles, {
        ignoreLocation: true,
        keys: [
          { name: "title", weight: 0.5 },
          { name: "tags", weight: 0.25 },
          { name: "excerpt", weight: 0.2 },
          { name: "slug", weight: 0.05 }
        ],
        threshold: 0.35
      }),
    [orderedArticles]
  )

  const visibleArticles = useMemo(() => {
    const normalizedQuery = query.trim()
    const candidates = normalizedQuery
      ? search.search(normalizedQuery).map(({ item }) => item)
      : orderedArticles

    return candidates.filter((article) =>
      selectedTags.every((tag) => article.tags.includes(tag))
    )
  }, [orderedArticles, query, search, selectedTags])
  const selectedTagSet = useMemo(() => new Set(selectedTags), [selectedTags])
  const visibleArticleIds = useMemo(
    () => new Set(visibleArticles.map((article) => article.id)),
    [visibleArticles]
  )
  const slugs = useMemo(
    () => visibleArticles.map((article) => article.slug),
    [visibleArticles]
  )

  const scrollToArticle = (slug: string) => {
    document
      .getElementById(`article-${slug}`)
      ?.scrollIntoView({ behavior: "smooth", block: "center" })
  }

  useEffect(() => {
    let frameId: number | undefined

    const updateScrollState = () => {
      if (frameId !== undefined) return
      frameId = window.requestAnimationFrame(() => {
        frameId = undefined
        setShowWheel(window.scrollY >= window.innerHeight * 0.4)

        const viewportCenter = window.innerHeight / 2
        let nearestIndex = -1
        let nearestDistance = Number.POSITIVE_INFINITY

        visibleArticles.forEach((article, index) => {
          const element = document.getElementById(`article-${article.slug}`)
          if (!element) return
          const rect = element.getBoundingClientRect()
          if (rect.height === 0) return
          const center = rect.top + rect.height / 2
          const distance = Math.abs(center - viewportCenter)
          if (distance < nearestDistance) {
            nearestIndex = index
            nearestDistance = distance
          }
        })

        if (nearestIndex >= 0) setSelectedWheelIndex(nearestIndex)
      })
    }

    updateScrollState()
    window.addEventListener("scroll", updateScrollState, { passive: true })
    window.addEventListener("resize", updateScrollState)
    return () => {
      window.removeEventListener("scroll", updateScrollState)
      window.removeEventListener("resize", updateScrollState)
      if (frameId !== undefined) window.cancelAnimationFrame(frameId)
    }
  }, [visibleArticles])

  useEffect(() => {
    let timeoutId: number | undefined
    let frameId: number | undefined

    if (showWheel) {
      setWheelMounted(true)
      frameId = window.requestAnimationFrame(() => setWheelEntering(true))
    } else if (wheelMounted) {
      setWheelEntering(false)
      timeoutId = window.setTimeout(() => setWheelMounted(false), 300)
    }

    return () => {
      if (frameId !== undefined) window.cancelAnimationFrame(frameId)
      if (timeoutId !== undefined) window.clearTimeout(timeoutId)
    }
  }, [showWheel, wheelMounted])

  return (
    <main className="@container isolate min-h-dvh overflow-x-clip bg-background text-foreground">
      <section
        aria-labelledby="all-posts-heading"
        className={`${gridClassName} relative h-[80svh] grid-rows-8`}
      >
        <Entrance
          animationClassName="fade-in slide-in-from-left-4"
          as="header"
          className="z-20 col-span-4 col-start-1 row-start-1 self-start"
          durationMs={500}
        >
          <Link
            className="font-funnel-display text-5xl leading-none transition-colors hover:text-klein focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-klein"
            href="/"
          >
            @4rcadia
          </Link>
        </Entrance>

        <nav
          aria-label="Main navigation"
          className="z-20 col-span-3 col-start-8 row-span-2 row-start-1 self-start"
        >
          <Menu
            items={menuItems.filter((item) => item.href !== "/all")}
            className="flex flex-col font-funnel-display text-4xl leading-none"
            delayMs={320}
            delayStepMs={55}
          />
        </nav>

        <Entrance
          animationClassName="fade-in slide-in-from-left-8"
          as="h1"
          className="z-20 col-span-6 col-start-1 row-span-1 row-start-5 flex items-start self-start font-funnel-display text-[clamp(4.5rem,9.3cqi,10rem)] leading-none whitespace-nowrap"
          delayMs={240}
          durationMs={700}
        >
          <span className="text-trim-cap">All Posts</span>
          <span className="font-sans text-base text-trim-cap">
            ({articles.length})
          </span>
        </Entrance>

        <Entrance
          animationClassName="fade-in slide-in-from-right-6"
          as="div"
          className="z-30 col-span-4 col-start-8 row-span-2 row-start-5 self-start"
          delayMs={440}
          durationMs={600}
        >
          <Toggle
            aria-label="Show all tags"
            className={tagClassName}
            onPressedChange={(pressed) => {
              if (pressed) setSelectedTags([])
            }}
            pressed={selectedTags.length === 0}
          >
            + All tags
          </Toggle>
          {tags.length > 0 ? (
            <ToggleGroup
              aria-label="Filter articles by tag"
              className="flex flex-wrap justify-start gap-x-2 gap-y-1 rounded-none"
              multiple
              onValueChange={setSelectedTags}
              spacing={0}
              value={selectedTags}
            >
              {tags.map((tag) => (
                <ToggleGroupItem className={tagClassName} key={tag} value={tag}>
                  + {tag}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          ) : null}
        </Entrance>

        <Entrance
          animationClassName="fade-in slide-in-from-bottom-6"
          as="div"
          className="z-30 col-span-3 col-start-8 row-start-7 self-center"
          delayMs={540}
          durationMs={600}
        >
          <InputGroup className="h-8 rounded-none border-0 bg-transparent shadow-none has-[[data-slot=input-group-control]:focus-visible]:ring-0">
            <InputGroupAddon className="pl-0 text-foreground">
              <InputGroupText className="text-base font-normal text-foreground">
                Search:
              </InputGroupText>
            </InputGroupAddon>
            <InputGroupInput
              className="border-b p-0 text-base focus:border-klein md:text-base"
              aria-label="Search articles"
              onChange={(event) => setQuery(event.target.value)}
              type="search"
              value={query}
            />
          </InputGroup>
        </Entrance>
      </section>

      {wheelMounted ? (
        <div
          className="pointer-events-none fixed inset-0 z-40 grid grid-cols-12 gap-4 p-8 transition-[opacity,transform] duration-300 ease-out motion-reduce:duration-0"
          style={{
            opacity: wheelEntering ? 1 : 0,
            transform: wheelEntering ? "scale(1)" : "scale(0.95)"
          }}
        >
          <div className="pointer-events-auto col-span-2 col-start-6 h-[33svh] self-center">
            <OptionWheel
              tilt={0}
              xPadding={4}
              fade={0.25}
              blur={0.25}
              items={slugs}
              selectedIndex={selectedWheelIndex}
              textColor={colorKlein}
              activeColor={colorMagenta}
              onItemClick={(_, item) => {
                const article = visibleArticles.find(
                  (visibleArticle) => visibleArticle.slug === item
                )
                if (article) scrollToArticle(article.slug)
              }}
            />
          </div>
        </div>
      ) : null}

      <section aria-label="Articles">
        <div aria-live="polite" className="sr-only">
          {visibleArticles.length} articles shown
        </div>

        <div className="flex flex-col gap-16">
          {orderedArticles.map((article, index) => (
            <ArchiveArticle
              article={article}
              hidden={!visibleArticleIds.has(article.id)}
              index={index}
              key={article.id}
              selectedTags={selectedTagSet}
            />
          ))}
        </div>
      </section>

      <div className="h-24" />
    </main>
  )
}
