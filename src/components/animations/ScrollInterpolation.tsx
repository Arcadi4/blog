"use client"

import { useEffect, useRef } from "react"
import type { ComponentPropsWithoutRef } from "react"

type ScrollInterpolationProps = ComponentPropsWithoutRef<"div"> & {
  readonly from?: number
  readonly to?: number
  readonly scrollRange?: number
  readonly interpolate: (value: number, element: HTMLDivElement) => void
}

export function ScrollInterpolation({
  from = 0,
  to = 1,
  scrollRange = 1,
  interpolate,
  ...props
}: ScrollInterpolationProps) {
  const elementRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let frameId: number | null = null

    const update = () => {
      frameId = null

      const progress = Math.min(
        window.scrollY / (window.innerHeight * scrollRange),
        1
      )
      const element = elementRef.current

      if (element) {
        interpolate(from + (to - from) * progress, element)
      }
    }

    const scheduleUpdate = () => {
      if (frameId === null) {
        frameId = requestAnimationFrame(update)
      }
    }

    update()
    window.addEventListener("scroll", scheduleUpdate, { passive: true })
    window.addEventListener("resize", scheduleUpdate)

    return () => {
      window.removeEventListener("scroll", scheduleUpdate)
      window.removeEventListener("resize", scheduleUpdate)
      if (frameId !== null) {
        cancelAnimationFrame(frameId)
      }
    }
  }, [from, interpolate, scrollRange, to])

  return <div ref={elementRef} {...props} />
}
