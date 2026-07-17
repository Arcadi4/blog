"use client"

import { type RefObject, useEffect, useMemo, useState } from "react"

export type EntranceSeenOptions = {
  /**
   * Trigger line as a percentage measured upward from the viewport bottom.
   * 0 fires at screen entry, 50 fires at mid-screen, and negative values fire
   * before entry below the viewport bottom.
   */
  readonly minPosition?: number
  readonly onSeen?: boolean
}

type EnterOptions = EntranceSeenOptions & {
  delayMs?: number
  disabled?: boolean
  targetRef?: RefObject<HTMLElement | null>
}

function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false
  return (
    window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false
  )
}

/**
 * 在组件挂载后触发 enter=true（支持延迟）。
 * 用于 “mount 时播放” 的 class 切换。
 */
export function useEntranceAnimation(options: EnterOptions = {}) {
  const {
    delayMs = 0,
    disabled = false,
    minPosition = 50,
    onSeen = false,
    targetRef
  } = options
  const [entered, setEntered] = useState(false)

  const reduce = useMemo(() => prefersReducedMotion(), [])

  useEffect(() => {
    if (disabled || reduce) {
      const immediateId = window.setTimeout(() => setEntered(true), 0)
      return () => window.clearTimeout(immediateId)
    }

    let timeoutId: number | undefined

    const enter = () => {
      timeoutId = window.setTimeout(() => setEntered(true), delayMs)
    }

    const hasEnteredThreshold = () => {
      if (!onSeen) return true

      const target = targetRef?.current
      if (!target) return false

      const viewportTriggerY = window.innerHeight * (1 - minPosition / 100)
      const targetY = target.getBoundingClientRect().top

      return targetY <= viewportTriggerY
    }

    const onViewportChange = () => {
      if (!hasEnteredThreshold()) return
      window.removeEventListener("scroll", onViewportChange)
      window.removeEventListener("resize", onViewportChange)
      enter()
    }

    if (hasEnteredThreshold()) {
      enter()
      return () => {
        if (timeoutId !== undefined) window.clearTimeout(timeoutId)
      }
    }

    window.addEventListener("scroll", onViewportChange, { passive: true })
    window.addEventListener("resize", onViewportChange)

    return () => {
      window.removeEventListener("scroll", onViewportChange)
      window.removeEventListener("resize", onViewportChange)
      if (timeoutId !== undefined) window.clearTimeout(timeoutId)
    }
  }, [delayMs, disabled, minPosition, onSeen, reduce, targetRef])

  return { entered, reduceMotion: reduce }
}
