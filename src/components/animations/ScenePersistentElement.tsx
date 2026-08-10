"use client"

import { cloneElement, useLayoutEffect, useMemo, useRef, useState } from "react"
import type { CSSProperties, ReactElement } from "react"
import { MorphingText } from "@/components/ui/morphing-text"
import { cn } from "@/lib/utils"

type ScenePersistentTransitionEndpoint = CSSProperties & {
  /** Duration in milliseconds. */
  readonly duration?: number
}

export type ScenePersistentTransition = {
  readonly change?: {
    readonly effect?: "morph"
    readonly in?: CSSProperties
    readonly out?: CSSProperties
  }
  readonly in?: ScenePersistentTransitionEndpoint
  readonly out?: ScenePersistentTransitionEndpoint
}

type PersistentTargetProps = {
  readonly className?: string
  readonly style?: CSSProperties
  readonly "data-scene-persistent"?: string
  readonly "data-scene-persistent-layer-z-index"?: string
  readonly "data-scene-persistent-transition"?: string
}

type ScenePersistentElementProps = {
  readonly children: ReactElement<PersistentTargetProps>
  readonly layerZIndex?: CSSProperties["zIndex"]
  readonly name: string
  readonly transition?: ScenePersistentTransition
}

type CapturedElement = {
  readonly content: string
  readonly name: string
  readonly targetStyle: CSSProperties
  readonly transition?: ScenePersistentTransition
}

type PersistentElementPhase =
  | "active"
  | "entering"
  | "exiting"
  | "transitioning"
type PersistentContentPhase = "starting" | "transitioning"

type PersistentElement = CapturedElement & {
  readonly contentPhase?: PersistentContentPhase
  readonly durationMs: number
  readonly phase: PersistentElementPhase
  readonly previousContent?: string
  readonly previousTransition?: ScenePersistentTransition
  readonly style: CSSProperties
}

type ScenePersistentLayerProps = {
  readonly activeIndex: number
}

const PERSISTENT_TRANSITION_DURATION_MS = 900
const PERSISTENT_MORPH_TIME_SECONDS = 0.45

function resolveTransitionEndpoint(
  endpoint: ScenePersistentTransitionEndpoint | undefined
) {
  const { duration = PERSISTENT_TRANSITION_DURATION_MS, ...style } =
    endpoint ?? {}

  if (!Number.isFinite(duration) || duration < 0) {
    throw new Error(
      "Scene persistent transition duration must be non-negative."
    )
  }

  return { durationMs: duration, style }
}

type ScenePersistentMorphingTextProps = {
  readonly incomingContent: string
  readonly outgoingContent: string
  readonly textBox?: CSSProperties["textBox"]
}

function ScenePersistentMorphingText({
  incomingContent,
  outgoingContent,
  textBox
}: ScenePersistentMorphingTextProps) {
  const texts = useMemo(
    () => [outgoingContent, incomingContent],
    [incomingContent, outgoingContent]
  )

  return (
    <MorphingText
      className="absolute inset-0"
      html
      loop={false}
      morphTime={PERSISTENT_MORPH_TIME_SECONDS}
      textBox={textBox}
      texts={texts}
      unstyled
    />
  )
}

/**
 * Declares a scene-local target for a live element that persists between
 * scenes. Position, size, visual styles, and plain-text content are captured
 * from the child. Optional in/out styles animate the element across scene
 * boundaries without requiring placeholder copies in adjacent scenes. When a
 * persistent element's plain-text content changes, the previous and next text
 * use either the optional change.out/change.in endpoints or the morph effect
 * while the live layer remains in place.
 */
export function ScenePersistentElement({
  children,
  layerZIndex,
  name,
  transition
}: ScenePersistentElementProps) {
  return cloneElement(children, {
    className: cn("invisible", children.props.className),
    "data-scene-persistent": name,
    "data-scene-persistent-layer-z-index":
      layerZIndex === undefined ? undefined : String(layerZIndex),
    "data-scene-persistent-transition": transition
      ? JSON.stringify(transition)
      : undefined
  })
}

function parseTransition(
  serializedTransition: string | undefined
): ScenePersistentTransition | undefined {
  if (!serializedTransition) {
    return undefined
  }

  return JSON.parse(serializedTransition) as ScenePersistentTransition
}

function captureTarget(
  sceneBounds: DOMRect,
  target: HTMLElement
): CapturedElement {
  const bounds = target.getBoundingClientRect()
  const computedStyle = getComputedStyle(target)

  return {
    content: target.innerHTML,
    name: target.dataset.scenePersistent ?? "",
    targetStyle: {
      backdropFilter: computedStyle.backdropFilter,
      backgroundColor: computedStyle.backgroundColor,
      backgroundImage: computedStyle.backgroundImage,
      backgroundPosition: computedStyle.backgroundPosition,
      backgroundRepeat: computedStyle.backgroundRepeat,
      backgroundSize: computedStyle.backgroundSize,
      borderColor: computedStyle.borderColor,
      borderRadius: computedStyle.borderRadius,
      borderStyle: computedStyle.borderStyle,
      borderWidth: computedStyle.borderWidth,
      boxShadow: computedStyle.boxShadow,
      clipPath: computedStyle.clipPath,
      color: computedStyle.color,
      filter: computedStyle.filter,
      fontFamily: computedStyle.fontFamily,
      fontFeatureSettings: computedStyle.fontFeatureSettings,
      fontKerning: computedStyle.fontKerning as CSSProperties["fontKerning"],
      fontOpticalSizing:
        computedStyle.fontOpticalSizing as CSSProperties["fontOpticalSizing"],
      fontSize: computedStyle.fontSize,
      fontStretch: computedStyle.fontStretch,
      fontStyle: computedStyle.fontStyle,
      fontVariant: computedStyle.fontVariant,
      fontVariationSettings: computedStyle.fontVariationSettings,
      fontWeight: computedStyle.fontWeight,
      height: bounds.height,
      letterSpacing: computedStyle.letterSpacing,
      left: bounds.left - sceneBounds.left,
      lineHeight: computedStyle.lineHeight,
      opacity: computedStyle.opacity,
      textAlign: computedStyle.textAlign as CSSProperties["textAlign"],
      textBox: computedStyle.textBox as CSSProperties["textBox"],
      textDecoration: computedStyle.textDecoration,
      textIndent: computedStyle.textIndent,
      textShadow: computedStyle.textShadow,
      textTransform: computedStyle.textTransform,
      top: bounds.top - sceneBounds.top,
      transform: computedStyle.transform,
      transformOrigin: computedStyle.transformOrigin,
      whiteSpace: computedStyle.whiteSpace,
      width: bounds.width,
      zIndex: target.dataset.scenePersistentLayerZIndex
    },
    transition: parseTransition(target.dataset.scenePersistentTransition)
  }
}

function captureTargets(
  activeSlide: HTMLElement,
  targets: readonly HTMLElement[]
) {
  const names = new Set<string>()
  const sceneBounds = activeSlide.getBoundingClientRect()

  return targets.map((target) => {
    const name = target.dataset.scenePersistent ?? ""

    if (!name || names.has(name)) {
      throw new Error(
        "ScenePersistentElement names must be non-empty and unique within a scene."
      )
    }

    names.add(name)
    return captureTarget(sceneBounds, target)
  })
}

function reconcileElements(
  currentElements: readonly PersistentElement[],
  nextTargets: readonly CapturedElement[]
): readonly PersistentElement[] {
  const currentByName = new Map(
    currentElements.map((element) => [element.name, element])
  )
  const nextNames = new Set(nextTargets.map((target) => target.name))
  const nextElements = nextTargets.map<PersistentElement>((target) => {
    const current = currentByName.get(target.name)

    if (current) {
      const transitionsContent =
        current.content !== target.content &&
        Boolean(
          current.transition?.change?.effect ||
          current.transition?.change?.out ||
          target.transition?.change?.effect ||
          target.transition?.change?.in
        )

      return {
        ...target,
        contentPhase: transitionsContent ? "starting" : current.contentPhase,
        durationMs: PERSISTENT_TRANSITION_DURATION_MS,
        phase: "transitioning",
        previousContent: transitionsContent
          ? current.content
          : current.previousContent,
        previousTransition: transitionsContent
          ? current.transition
          : current.previousTransition,
        style: target.targetStyle
      }
    }

    const incoming = resolveTransitionEndpoint(target.transition?.in)

    return {
      ...target,
      durationMs: incoming.durationMs,
      phase: target.transition?.in ? "entering" : "active",
      style: {
        ...target.targetStyle,
        ...incoming.style
      }
    }
  })

  currentElements.forEach((element) => {
    if (nextNames.has(element.name) || !element.transition?.out) {
      return
    }

    const outgoing = resolveTransitionEndpoint(element.transition.out)

    nextElements.push({
      ...element,
      durationMs: outgoing.durationMs,
      phase: "exiting",
      style: {
        ...element.targetStyle,
        ...outgoing.style
      }
    })
  })

  return nextElements
}

function refreshElements(
  currentElements: readonly PersistentElement[],
  nextTargets: readonly CapturedElement[]
): readonly PersistentElement[] {
  const nextByName = new Map(nextTargets.map((target) => [target.name, target]))

  return currentElements.map((element) => {
    const target = nextByName.get(element.name)

    if (!target || element.phase === "exiting") {
      return element
    }

    return {
      ...element,
      ...target,
      phase: element.phase,
      style: {
        ...target.targetStyle,
        ...(element.phase === "entering"
          ? resolveTransitionEndpoint(target.transition?.in).style
          : undefined)
      }
    }
  })
}

export function ScenePersistentLayer({
  activeIndex
}: ScenePersistentLayerProps) {
  const [elements, setElements] = useState<readonly PersistentElement[]>([])
  const elementsRef = useRef(elements)
  const rootRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    elementsRef.current = elements
  }, [elements])

  useLayoutEffect(() => {
    const deck = rootRef.current?.closest<HTMLElement>("main[data-home-deck]")
    const activeSlide = deck?.querySelector<HTMLElement>(
      'section[data-state="active"]'
    )

    if (!deck || !activeSlide) {
      return
    }

    const slide = activeSlide
    const targets = Array.from(
      slide.querySelectorAll<HTMLElement>("[data-scene-persistent]")
    )

    const nextElements = reconcileElements(
      elementsRef.current,
      captureTargets(slide, targets)
    )
    const cleanupDurationsMs = Array.from(
      new Set(
        nextElements.flatMap((element) =>
          element.phase === "active" ? [] : [element.durationMs]
        )
      )
    )

    setElements(nextElements)

    let cleanupTimerIds: number[] = []
    let enterFrameId = window.requestAnimationFrame(() => {
      enterFrameId = window.requestAnimationFrame(() => {
        setElements((currentElements) =>
          currentElements.map((element) => {
            const entersLayer = element.phase === "entering"
            const startsContentTransition = element.contentPhase === "starting"

            if (!entersLayer && !startsContentTransition) {
              return element
            }

            return {
              ...element,
              contentPhase: startsContentTransition
                ? "transitioning"
                : element.contentPhase,
              phase: entersLayer ? "transitioning" : element.phase,
              style: entersLayer ? element.targetStyle : element.style
            }
          })
        )
        cleanupTimerIds = cleanupDurationsMs.map((completedDurationMs) =>
          window.setTimeout(() => {
            setElements((currentElements) =>
              currentElements
                .filter(
                  (element) =>
                    element.phase !== "exiting" ||
                    element.durationMs > completedDurationMs
                )
                .map((element) => {
                  const settlesStyle =
                    element.durationMs <= completedDurationMs &&
                    (element.phase === "entering" ||
                      element.phase === "transitioning")

                  if (!settlesStyle) {
                    return element
                  }

                  return {
                    ...element,
                    contentPhase: undefined,
                    phase: "active",
                    previousContent: undefined,
                    previousTransition: undefined
                  }
                })
            )
          }, completedDurationMs)
        )
      })
    })

    function refresh() {
      setElements((currentElements) =>
        refreshElements(currentElements, captureTargets(slide, targets))
      )
    }

    const resizeObserver = new ResizeObserver(refresh)
    resizeObserver.observe(deck)
    targets.forEach((target) => resizeObserver.observe(target))
    window.addEventListener("resize", refresh)

    return () => {
      window.cancelAnimationFrame(enterFrameId)
      cleanupTimerIds.forEach((timerId) => window.clearTimeout(timerId))
      resizeObserver.disconnect()
      window.removeEventListener("resize", refresh)
    }
  }, [activeIndex])

  return (
    <div className="contents" data-scene-persistent-root ref={rootRef}>
      {elements.map((element) => {
        const transitionsContent = element.previousContent !== undefined
        const contentIsMoving = element.contentPhase === "transitioning"
        const contentEffect =
          element.transition?.change?.effect ??
          element.previousTransition?.change?.effect
        const contentClassName =
          "absolute inset-0 block transition-all duration-450 ease-[cubic-bezier(.76,0,.24,1)] motion-reduce:transition-none"
        const contentProps = transitionsContent
          ? {
              children:
                contentEffect === "morph" ? (
                  <ScenePersistentMorphingText
                    incomingContent={element.content}
                    outgoingContent={element.previousContent}
                    textBox={element.targetStyle.textBox}
                  />
                ) : (
                  <>
                    <span
                      className={contentClassName}
                      dangerouslySetInnerHTML={{
                        __html: element.previousContent
                      }}
                      style={{
                        ...(contentIsMoving
                          ? element.previousTransition?.change?.out
                          : undefined),
                        textBox: element.targetStyle.textBox
                      }}
                    />
                    <span
                      className={contentClassName}
                      dangerouslySetInnerHTML={{ __html: element.content }}
                      style={{
                        ...(contentIsMoving
                          ? undefined
                          : element.transition?.change?.in),
                        textBox: element.targetStyle.textBox
                      }}
                    />
                  </>
                )
            }
          : {
              dangerouslySetInnerHTML: { __html: element.content }
            }

        return (
          <div
            aria-hidden="true"
            className={cn(
              "pointer-events-none fixed z-1",
              element.phase !== "active" &&
                "transition-all ease-[cubic-bezier(.76,0,.24,1)] motion-reduce:transition-none"
            )}
            data-scene-persistent-layer={element.name}
            data-scene-persistent-phase={element.phase}
            key={element.name}
            style={{
              ...element.style,
              transitionDuration:
                element.phase === "active"
                  ? undefined
                  : `${element.durationMs}ms`
            }}
            {...contentProps}
          />
        )
      })}
    </div>
  )
}
