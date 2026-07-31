import { useHomeSlideState } from "@/components/home/HomeSlideDeck"
import { cn } from "@/lib/utils"
import { cloneElement } from "react"
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

const offsetClass: Record<RevealDistance, Record<RevealDirection, string>> = {
  far: {
    down: "-translate-y-32",
    left: "-translate-x-32",
    right: "translate-x-32",
    scale: "scale-[.82]",
    up: "translate-y-32"
  },
  near: {
    down: "-translate-y-8",
    left: "-translate-x-8",
    right: "translate-x-8",
    scale: "scale-[.82]",
    up: "translate-y-8"
  }
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
  const style: CSSProperties = {
    ...children.props.style,
    transitionDelay: isActive ? `${delayMs}ms` : "0ms",
    transitionDuration: `${durationMs}ms`
  }

  return cloneElement(children, {
    className: cn(
      "transition ease-[cubic-bezier(.22,1,.36,1)]",
      "motion-reduce:blur-none motion-reduce:transition-none",
      isActive
        ? "translate-x-0 translate-y-0 scale-100 opacity-100 blur-none"
        : cn("opacity-0 blur-[.45rem]", offsetClass[distance][direction]),
      children.props.className
    ),
    style
  })
}
