"use client"

import { useEffect, useState } from "react"
import OptionWheel from "@/components/OptionWheel"
import { colorMagenta } from "@/lib/colors"

export type TocItem = {
  readonly id: string
  readonly label: string
  readonly level: number
}

export function ReadingProgress() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    let frame: number | undefined
    const onScroll = () => {
      if (frame !== undefined) return
      frame = window.requestAnimationFrame(() => {
        frame = undefined
        const doc = document.documentElement
        const max = doc.scrollHeight - window.innerHeight
        const p = max > 0 ? window.scrollY / max : 0
        setProgress(Math.min(1, Math.max(0, p)))
      })
    }
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll)
    return () => {
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
      if (frame !== undefined) window.cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 top-0 z-50 h-px bg-foreground/10"
    >
      <div
        className="h-full w-full origin-left bg-klein"
        style={{ transform: `scaleX(${progress})` }}
      />
    </div>
  )
}

export function ArticleWheelNav({
  items
}: {
  readonly items: readonly TocItem[]
}) {
  const [showWheel, setShowWheel] = useState(false)
  const [wheelMounted, setWheelMounted] = useState(false)
  const [wheelEntering, setWheelEntering] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(0)

  useEffect(() => {
    if (items.length < 2) return
    let frame: number | undefined
    const update = () => {
      if (frame !== undefined) return
      frame = window.requestAnimationFrame(() => {
        frame = undefined
        setShowWheel(window.scrollY >= window.innerHeight * 0.4)
        const center = window.innerHeight / 2
        let nearest = 0
        let best = Number.POSITIVE_INFINITY
        items.forEach((item, index) => {
          const el = document.getElementById(item.id)
          if (!el) return
          const rect = el.getBoundingClientRect()
          if (rect.height === 0) return
          const c = rect.top + Math.min(rect.height, 40) / 2
          const d = Math.abs(c - center)
          if (d < best) {
            best = d
            nearest = index
          }
        })
        setSelectedIndex(nearest)
      })
    }
    update()
    window.addEventListener("scroll", update, { passive: true })
    window.addEventListener("resize", update)
    return () => {
      window.removeEventListener("scroll", update)
      window.removeEventListener("resize", update)
      if (frame !== undefined) window.cancelAnimationFrame(frame)
    }
  }, [items])

  useEffect(() => {
    let t: number | undefined
    let f: number | undefined
    if (showWheel) {
      setWheelMounted(true)
      f = window.requestAnimationFrame(() => setWheelEntering(true))
    } else if (wheelMounted) {
      setWheelEntering(false)
      t = window.setTimeout(() => setWheelMounted(false), 300)
    }
    return () => {
      if (f !== undefined) window.cancelAnimationFrame(f)
      if (t !== undefined) window.clearTimeout(t)
    }
  }, [showWheel, wheelMounted])

  if (items.length < 2 || !wheelMounted) return null

  const labels = items.map((i) => i.label)

  return (
    <div
      className="pointer-events-none fixed inset-0 z-40 grid grid-cols-12 gap-4 p-8"
      style={{
        opacity: wheelEntering ? 1 : 0,
        transform: wheelEntering ? "scale(1)" : "scale(0.97)",
        transition: "opacity 300ms ease-out, transform 300ms ease-out"
      }}
      aria-hidden="true"
    >
      <div className="pointer-events-auto col-span-2 col-start-11 hidden h-[33svh] self-center lg:block">
        <OptionWheel
          tilt={0}
          xPadding={4}
          fade={0.28}
          blur={0.25}
          items={labels}
          selectedIndex={selectedIndex}
          activeColor={colorMagenta}
          onItemClick={(idx) => {
            const id = items[idx]?.id
            if (!id) return
            document
              .getElementById(id)
              ?.scrollIntoView({ behavior: "smooth", block: "start" })
          }}
        />
      </div>
    </div>
  )
}
