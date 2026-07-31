"use client"

import { cloneElement, useLayoutEffect, useRef, useState } from "react"
import type { CSSProperties, ReactElement } from "react"
import { cn } from "@/lib/utils"

export type ScenePersistentTransition = {
  readonly in?: CSSProperties
  readonly out?: CSSProperties
}

type PersistentTargetProps = {
  readonly className?: string
  readonly style?: CSSProperties
  readonly "data-scene-persistent"?: string
  readonly "data-scene-persistent-transition"?: string
}

type ScenePersistentElementProps = {
  readonly children: ReactElement<PersistentTargetProps>
  readonly name: string
  readonly transition?: ScenePersistentTransition
}

type CapturedElement = {
  readonly name: string
  readonly targetStyle: CSSProperties
  readonly text: string
  readonly transition?: ScenePersistentTransition
}

type PersistentElementPhase = "active" | "entering" | "exiting"

type PersistentElement = CapturedElement & {
  readonly phase: PersistentElementPhase
  readonly style: CSSProperties
}

type ScenePersistentLayerProps = {
  readonly activeIndex: number
}

const PERSISTENT_TRANSITION_DURATION_MS = 900

/**
 * Declares a scene-local target for a live element that persists between
 * scenes. Position, size, visual styles, and plain-text content are captured
 * from the child. Optional in/out styles animate the element across scene
 * boundaries without requiring placeholder copies in adjacent scenes.
 */
export function ScenePersistentElement({
  children,
  name,
  transition
}: ScenePersistentElementProps) {
  return cloneElement(children, {
    className: cn("invisible", children.props.className),
    "data-scene-persistent": name,
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
      width: bounds.width
    },
    text: target.textContent ?? "",
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
      return {
        ...target,
        phase: "active",
        style: target.targetStyle
      }
    }

    return {
      ...target,
      phase: target.transition?.in ? "entering" : "active",
      style: {
        ...target.targetStyle,
        ...target.transition?.in
      }
    }
  })

  currentElements.forEach((element) => {
    if (nextNames.has(element.name) || !element.transition?.out) {
      return
    }

    nextElements.push({
      ...element,
      phase: "exiting",
      style: {
        ...element.targetStyle,
        ...element.transition.out
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
      ...target,
      phase: element.phase,
      style: {
        ...target.targetStyle,
        ...(element.phase === "entering" ? target.transition?.in : undefined)
      }
    }
  })
}

export function ScenePersistentLayer({
  activeIndex
}: ScenePersistentLayerProps) {
  const [elements, setElements] = useState<readonly PersistentElement[]>([])
  const rootRef = useRef<HTMLDivElement>(null)

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

    setElements((currentElements) =>
      reconcileElements(currentElements, captureTargets(slide, targets))
    )

    let enterFrameId = window.requestAnimationFrame(() => {
      enterFrameId = window.requestAnimationFrame(() => {
        setElements((currentElements) =>
          currentElements.map((element) =>
            element.phase === "entering"
              ? {
                  ...element,
                  phase: "active",
                  style: element.targetStyle
                }
              : element
          )
        )
      })
    })
    const exitTimerId = window.setTimeout(() => {
      setElements((currentElements) =>
        currentElements.filter((element) => element.phase !== "exiting")
      )
    }, PERSISTENT_TRANSITION_DURATION_MS)

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
      window.clearTimeout(exitTimerId)
      resizeObserver.disconnect()
      window.removeEventListener("resize", refresh)
    }
  }, [activeIndex])

  return (
    <div className="contents" data-scene-persistent-root ref={rootRef}>
      {elements.map((element) => (
        <div
          aria-hidden="true"
          className="pointer-events-none fixed z-1 transition-all duration-900 ease-[cubic-bezier(.76,0,.24,1)] motion-reduce:transition-none"
          data-scene-persistent-layer={element.name}
          data-scene-persistent-phase={element.phase}
          key={element.name}
          style={element.style}
        >
          {element.text}
        </div>
      ))}
    </div>
  )
}
