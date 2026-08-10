import { useHomeSlideState } from "@/components/home/HomeSlideDeck"
import { motion, useReducedMotion } from "motion/react"
import { createElement, useState } from "react"
import type { CSSProperties, ReactElement } from "react"

type RevealDirection = "down" | "left" | "right" | "scale" | "up"
type RevealDistance = "far" | "near"

type SceneRevealProps = {
  readonly children: ReactElement<{
    className?: string
    style?: CSSProperties
  }>
  readonly delayMs?: number
  readonly direction?: RevealDirection
  readonly distance?: RevealDistance
  readonly durationMs?: number
}

const motionElements = {
  div: motion.div,
  h1: motion.h1,
  h2: motion.h2,
  nav: motion.nav,
  p: motion.p
} as const

type MotionElementTag = keyof typeof motionElements

const offsetDistance: Record<RevealDistance, string> = {
  far: "8rem",
  near: "2rem"
}

/**
 * Adds entrance choreography to one existing element when its nearest slide
 * becomes active. The slide deck owns state; this primitive only owns motion.
 */
export function SceneReveal({
  children,
  delayMs = 0,
  direction = "up",
  distance = "near",
  durationMs = 760
}: SceneRevealProps) {
  const isActive = useHomeSlideState() === "active"
  const reduceMotion = useReducedMotion() ?? false
  const [hasRevealed, setHasRevealed] = useState(false)
  const tagName = children.type

  if (typeof tagName !== "string" || !(tagName in motionElements)) {
    throw new Error(
      "SceneReveal requires a native element with Motion support as its child."
    )
  }

  const MotionElement = motionElements[tagName as MotionElementTag]

  if (hasRevealed) {
    return children
  }

  const distanceValue = offsetDistance[distance]
  const hiddenState = {
    opacity: 0,
    filter: reduceMotion ? "blur(0px)" : "blur(.45rem)",
    scale: direction === "scale" ? 0.82 : 1,
    x:
      direction === "left"
        ? `-${distanceValue}`
        : direction === "right"
          ? distanceValue
          : 0,
    y:
      direction === "down"
        ? `-${distanceValue}`
        : direction === "up"
          ? distanceValue
          : 0
  }
  const visibleState = {
    opacity: 1,
    filter: "blur(0px)",
    scale: 1,
    x: 0,
    y: 0
  }

  return createElement(MotionElement, {
    ...children.props,
    initial: isActive ? false : hiddenState,
    animate: isActive ? visibleState : hiddenState,
    onAnimationComplete: () => {
      if (isActive) {
        setHasRevealed(true)
      }
    },
    transition: {
      delay: isActive && !reduceMotion ? delayMs / 1000 : 0,
      duration: reduceMotion ? 0 : durationMs / 1000,
      ease: [0.22, 1, 0.36, 1]
    }
  })
}
