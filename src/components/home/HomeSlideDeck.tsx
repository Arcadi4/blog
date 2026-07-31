"use client"

import { ScenePersistentLayer } from "@/components/animations/ScenePersistentElement"
import { cn } from "@/lib/utils"
import type { ReactNode } from "react"
import {
  Children,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState
} from "react"
import styles from "./HomeSlideDeck.module.css"

type HomeSlideState = "active" | "future" | "past"

type HomeSlideDeckProps = {
  readonly children: ReactNode
  readonly labels: readonly string[]
}

const HomeSlideStateContext = createContext<HomeSlideState | null>(null)

export function useHomeSlideState() {
  const state = useContext(HomeSlideStateContext)

  if (state === null) {
    throw new Error("useHomeSlideState must be used within a HomeSlideDeck.")
  }

  return state
}

export function HomeSlideDeck({ children, labels }: HomeSlideDeckProps) {
  const slides = useMemo(() => Children.toArray(children), [children])
  const [activeIndex, setActiveIndex] = useState(0)
  const deckRef = useRef<HTMLElement>(null)
  const lastIndex = slides.length - 1

  const selectSlide = useCallback(
    (nextIndex: number) => {
      const index = Math.min(Math.max(nextIndex, 0), lastIndex)
      const slide = deckRef.current?.querySelector<HTMLElement>(
        `[data-scene-index="${index}"]`
      )

      slide?.scrollIntoView({ behavior: "smooth", block: "start" })
    },
    [lastIndex]
  )

  const moveBy = useCallback(
    (distance: number) => {
      selectSlide(activeIndex + distance)
    },
    [activeIndex, selectSlide]
  )

  useEffect(() => {
    const deck = deckRef.current

    if (!deck) {
      return
    }

    const sceneElements = Array.from(
      deck.querySelectorAll<HTMLElement>("[data-home-scene]")
    )
    const visibility = new Map<HTMLElement, number>()
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          visibility.set(entry.target as HTMLElement, entry.intersectionRatio)
        })

        const nextIndex = sceneElements.reduce((bestIndex, scene, index) => {
          const ratio = visibility.get(scene) ?? 0
          const bestRatio = visibility.get(sceneElements[bestIndex]) ?? 0

          return ratio > bestRatio ? index : bestIndex
        }, 0)

        setActiveIndex(nextIndex)
      },
      {
        root: deck,
        threshold: [0, 0.25, 0.5, 0.75, 1]
      }
    )

    sceneElements.forEach((scene) => observer.observe(scene))

    return () => observer.disconnect()
  }, [slides.length])

  if (slides.length !== labels.length) {
    throw new Error("HomeSlideDeck requires one label for every slide.")
  }

  return (
    <main
      aria-label="Homepage scenes"
      className={cn(
        styles.deck,
        "relative isolate h-svh w-dvw snap-y snap-mandatory overflow-x-hidden overflow-y-auto overscroll-y-contain bg-background text-foreground"
      )}
      data-home-deck
      ref={deckRef}
    >
      <p aria-live="polite" className="sr-only">
        Scene {activeIndex + 1} of {slides.length}: {labels[activeIndex]}
      </p>

      {slides.map((slide, index) => {
        const state: HomeSlideState =
          index === activeIndex
            ? "active"
            : index < activeIndex
              ? "past"
              : "future"

        return (
          <HomeSlideStateContext.Provider
            key={`${index}-${labels[index]}`}
            value={state}
          >
            <section
              aria-label={`${index + 1} of ${slides.length}: ${labels[index]}`}
              className="relative z-2 min-h-svh snap-start snap-always overflow-x-clip"
              data-home-scene
              data-scene-index={index}
              data-state={state}
            >
              {slide}
            </section>
          </HomeSlideStateContext.Provider>
        )
      })}

      <ScenePersistentLayer activeIndex={activeIndex} />

      <nav
        aria-label="Choose a homepage scene"
        className="fixed top-1/2 left-[92%] z-20 grid -translate-y-1/2 grid-cols-[1px_auto] items-stretch gap-3"
      >
        <span
          aria-hidden="true"
          className="relative block h-full w-px overflow-hidden bg-current/20"
        >
          <span
            className="absolute inset-0 origin-top bg-current transition-transform duration-700 ease-[cubic-bezier(.76,0,.24,1)] motion-reduce:transition-none"
            style={{
              transform: `scaleY(${(activeIndex + 1) / slides.length})`
            }}
          />
        </span>
        <ol className="m-0 flex list-none flex-col gap-[.45rem] p-0">
          {labels.map((label, index) => (
            <li key={`${index}-${label}`}>
              <button
                aria-current={index === activeIndex ? "step" : undefined}
                aria-label={`Go to scene ${index + 1}: ${label}`}
                className={cn(
                  "group/scene-button flex min-w-[2.1rem] items-baseline gap-3 bg-transparent py-[.15rem] text-left font-mono text-[.7rem] leading-none text-inherit uppercase opacity-[.38] transition duration-180 hover:-translate-x-1 hover:opacity-100 focus-visible:-translate-x-1 focus-visible:opacity-100  motion-reduce:transition-none",
                  index === activeIndex && "-translate-x-1 opacity-100"
                )}
                onClick={() => selectSlide(index)}
                type="button"
              >
                <span aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span
                  className={cn(
                    "hidden max-w-28 xl:group-hover/scene-button:inline xl:group-focus-visible/scene-button:inline",
                    index === activeIndex && "xl:inline"
                  )}
                >
                  {label}
                </span>
              </button>
            </li>
          ))}
        </ol>
      </nav>

      <div
        aria-hidden="true"
        className="fixed top-7 right-8 z-20 flex items-center gap-[.6rem] font-mono text-[.72rem] leading-none"
      >
        <span>{String(activeIndex + 1).padStart(2, "0")}</span>
        <span className="h-px w-8 bg-current opacity-45" />
        <span>{String(slides.length).padStart(2, "0")}</span>
      </div>

      <div className="fixed right-8 bottom-7 z-20 flex overflow-hidden border">
        <button
          aria-label="Previous scene"
          className="grid size-[2.7rem] place-items-center border-0 font-mono text-base text-inherit hover:not-disabled:bg-foreground hover:not-disabled:text-background disabled:opacity-25"
          disabled={activeIndex === 0}
          onClick={() => moveBy(-1)}
          type="button"
        >
          ↑
        </button>
        <button
          aria-label="Next scene"
          className="grid size-[2.7rem] place-items-center border-0 border-l border-black font-mono text-base text-inherit hover:not-disabled:bg-foreground hover:not-disabled:text-background disabled:opacity-25"
          disabled={activeIndex === lastIndex}
          onClick={() => moveBy(1)}
          type="button"
        >
          ↓
        </button>
      </div>
    </main>
  )
}
