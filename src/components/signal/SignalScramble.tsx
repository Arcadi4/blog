"use client"

import { useCallback, useEffect, useRef } from "react"
import { cn } from "@/lib/utils"

const SCRAMBLE_CHARS = "▓▚#/\\<>[]{}+=*^?_—01"
const LOCK_STEP_MS = 34
const RESOLVE_RATIO = 0.4

type SignalScrambleProps = {
  readonly children: string
  readonly className?: string
}

/**
 * Text that decodes on hover/focus: characters churn through a technical
 * charset and lock in from the left, like a terminal resolving a callsign.
 * The accessible name never changes; the effect is purely visual and skipped
 * under prefers-reduced-motion.
 */
export function SignalScramble({ children, className }: SignalScrambleProps) {
  const visualRef = useRef<HTMLSpanElement | null>(null)
  const frameRef = useRef(0)

  const stop = useCallback(() => {
    cancelAnimationFrame(frameRef.current)
    const visual = visualRef.current
    if (visual) {
      visual.textContent = children
    }
  }, [children])

  const start = useCallback(() => {
    const visual = visualRef.current
    if (
      !visual ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return
    }

    cancelAnimationFrame(frameRef.current)
    const startedAt = performance.now()

    const tick = (now: number) => {
      const locked = Math.floor((now - startedAt) / LOCK_STEP_MS)
      if (locked >= children.length) {
        visual.textContent = children
        return
      }

      let text = children.slice(0, locked)
      for (let index = locked; index < children.length; index += 1) {
        const source = children[index]
        text +=
          source === " " || Math.random() < RESOLVE_RATIO
            ? source
            : SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)]
      }
      visual.textContent = text
      frameRef.current = requestAnimationFrame(tick)
    }

    frameRef.current = requestAnimationFrame(tick)
  }, [children])

  useEffect(() => stop, [stop])

  return (
    <span
      className={cn("inline-block", className)}
      onBlur={stop}
      onFocus={start}
      onPointerEnter={start}
      onPointerLeave={stop}
    >
      <span aria-hidden="true" ref={visualRef}>
        {children}
      </span>
      <span className="sr-only">{children}</span>
    </span>
  )
}
