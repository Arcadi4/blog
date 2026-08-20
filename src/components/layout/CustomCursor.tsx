"use client"

import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"

const SIZE = 64
const OFFSET = SIZE / 2
const INTERACTIVE_EXIT_DELAY_MS = 100
const INTERACTIVE_SELECTOR = [
  "[data-cursor='interactive']",
  "a",
  "button",
  "summary",
  "[role='button']",
  "input",
  "select",
  "textarea",
  "label"
].join(", ")

function supportsCustomCursor() {
  return (
    window.matchMedia("(any-pointer: fine)").matches &&
    window.matchMedia("(any-hover: hover)").matches &&
    !window.matchMedia("(forced-colors: active)").matches
  )
}

function isInteractive(target: EventTarget | null) {
  return (
    target instanceof Element && Boolean(target.closest(INTERACTIVE_SELECTOR))
  )
}

export default function CustomCursor() {
  const fillRef = useRef<HTMLDivElement>(null)
  const outlineRef = useRef<HTMLDivElement>(null)
  const [interactive, setInteractive] = useState(false)
  const [pressed, setPressed] = useState(false)

  useEffect(() => {
    if (!supportsCustomCursor()) return

    let position: { x: number; y: number } | null = null
    let holdTimer: number | undefined
    let interactiveTimer: number | undefined
    let prevInteractive = false
    const moveTo = (x: number, y: number) => {
      position = { x, y }
      const transform = `translate3d(${x - OFFSET}px, ${y - OFFSET}px, 0)`
      fillRef.current?.style.setProperty("transform", transform)
      outlineRef.current?.style.setProperty("transform", transform)
    }

    const updateInteractiveTarget = () => {
      if (position) {
        setInteractiveTarget(
          isInteractive(document.elementFromPoint(position.x, position.y))
        )
      }
    }

    const setInteractiveTarget = (nextInteractive: boolean) => {
      if (nextInteractive === prevInteractive) return

      prevInteractive = nextInteractive
      clearTimeout(interactiveTimer)
      interactiveTimer = undefined

      if (nextInteractive) {
        setInteractive(true)
        return
      }

      interactiveTimer = window.setTimeout(() => {
        interactiveTimer = undefined
        setInteractive(false)
      }, INTERACTIVE_EXIT_DELAY_MS)
    }

    const clearPress = () => {
      clearTimeout(holdTimer)
      holdTimer = undefined
      setPressed(false)
    }

    const handlePointerMove = (event: PointerEvent) => {
      moveTo(event.clientX, event.clientY)
      document.body.classList.add("custom-cursor-enabled")
      setInteractiveTarget(isInteractive(event.target))
    }

    const handlePointerDown = (event: PointerEvent) => {
      if (event.button !== 0) return
      holdTimer = window.setTimeout(() => {
        holdTimer = undefined
        setPressed(true)
      }, 150)
    }

    window.addEventListener("pointermove", handlePointerMove, { passive: true })
    window.addEventListener("scroll", updateInteractiveTarget, {
      passive: true
    })
    window.addEventListener("resize", updateInteractiveTarget, {
      passive: true
    })
    window.addEventListener("pointerdown", handlePointerDown)
    window.addEventListener("pointerup", clearPress)
    window.addEventListener("pointercancel", clearPress)
    window.addEventListener("blur", clearPress)
    document.addEventListener("mouseleave", clearPress)
    window.addEventListener("contextmenu", clearPress)

    return () => {
      window.removeEventListener("pointermove", handlePointerMove)
      window.removeEventListener("scroll", updateInteractiveTarget)
      window.removeEventListener("resize", updateInteractiveTarget)
      window.removeEventListener("pointerdown", handlePointerDown)
      window.removeEventListener("pointerup", clearPress)
      window.removeEventListener("pointercancel", clearPress)
      window.removeEventListener("blur", clearPress)
      document.removeEventListener("mouseleave", clearPress)
      window.removeEventListener("contextmenu", clearPress)
      clearTimeout(holdTimer)
      clearTimeout(interactiveTimer)
      document.body.classList.remove("custom-cursor-enabled")
    }
  }, [])

  return (
    <>
      <div
        ref={fillRef}
        aria-hidden="true"
        className={cn(
          "pointer-events-none fixed top-0 left-0 z-9999 will-change-transform",
          pressed
            ? "mix-blend-multiply"
            : interactive
              ? "mix-blend-exclusion"
              : "mix-blend-multiply"
        )}
      >
        <div
          className={cn(
            "size-16 transition-all ease-in-out will-change-transform",
            pressed
              ? "scale-x-25 bg-klein transition-colors duration-1250"
              : interactive
                ? "rounded-full scale-[0.375] bg-white duration-400"
                : "rounded-full bg-magenta"
          )}
        />
      </div>
      <div
        ref={outlineRef}
        aria-hidden="true"
        className="pointer-events-none fixed top-0 left-0 z-9999 size-16 will-change-transform"
      >
        <div
          className={cn(
            "absolute inset-0 rounded-full border-2 border-black transition-all duration-400 ease-in-out",
            interactive && !pressed
              ? "scale-[0.375] opacity-100"
              : "scale-0 opacity-0"
          )}
        />
      </div>
    </>
  )
}
