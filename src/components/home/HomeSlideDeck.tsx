"use client"

import { ScenePersistentLayer } from "@/components/animations/ScenePersistentElement"
import { LineSidebar } from "@/components/ui/line-sidebar"
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

type LegacyWheelEvent = WheelEvent & { readonly wheelDeltaY?: number }

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

  useEffect(() => {
    const deck = deckRef.current

    if (!deck) {
      return
    }

    const handleWheel = (event: WheelEvent) => {
      // Detented wheels typically expose 120-unit steps; pixel gestures stay native.
      const wheelDeltaY = Math.abs((event as LegacyWheelEvent).wheelDeltaY ?? 0)

      if (
        event.ctrlKey ||
        Math.abs(event.deltaY) <= Math.abs(event.deltaX) ||
        (event.deltaMode === WheelEvent.DOM_DELTA_PIXEL &&
          (wheelDeltaY < 120 || wheelDeltaY % 120 !== 0))
      ) {
        return
      }

      selectSlide(activeIndex + Math.sign(event.deltaY))
    }

    deck.addEventListener("wheel", handleWheel, { passive: false })

    return () => deck.removeEventListener("wheel", handleWheel)
  }, [activeIndex, selectSlide])

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

      <div className="fixed top-1/2 right-8 z-50 -translate-y-1/2 mix-blend-difference">
        <LineSidebar
          activeIndex={activeIndex}
          aria-label="Choose a homepage scene"
          items={labels}
          onItemClick={selectSlide}
          className="font-mono text-[.7rem] uppercase"
          accentColor="var(--color-magenta)"
          markerColor="rgba(255, 255, 255, 0.2)"
          textColor="#fff"
          itemGap={10}
          fontSize={0.7}
          maxShift={8}
          markerLength={18}
          proximityRadius={90}
        />
      </div>
    </main>
  )
}
