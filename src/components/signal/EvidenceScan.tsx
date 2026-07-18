"use client"

import type {
  CSSProperties,
  KeyboardEvent,
  PointerEvent,
  ReactNode
} from "react"
import { useRef, useState } from "react"
import { cn } from "@/lib/utils"
import styles from "./EvidenceScan.module.css"

type EvidenceScanProps = {
  readonly base: ReactNode
  readonly className?: string
  readonly label: string
  readonly signal: ReactNode
}

const minimumPosition = 10
const maximumPosition = 90

function clampPosition(position: number) {
  return Math.min(Math.max(position, minimumPosition), maximumPosition)
}

/**
 * A pointer- and keyboard-operated comparison band for article media.
 * The alternate signal is absent at rest and can be pinned with activation.
 * Base and signal should be non-interactive visual media; the label describes
 * the comparison to assistive technology.
 */
export function EvidenceScan({
  base,
  className,
  label,
  signal
}: EvidenceScanProps) {
  const frameRef = useRef<HTMLButtonElement | null>(null)
  const positionRef = useRef(50)
  const [pinned, setPinned] = useState(false)

  const setPosition = (position: number) => {
    const nextPosition = clampPosition(position)
    positionRef.current = nextPosition
    frameRef.current?.style.setProperty("--scan-position", `${nextPosition}%`)
  }

  const handlePointerMove = (event: PointerEvent<HTMLButtonElement>) => {
    if (pinned && event.buttons === 0) {
      return
    }
    const bounds = event.currentTarget.getBoundingClientRect()
    setPosition(((event.clientX - bounds.left) / bounds.width) * 100)
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    const keyOffset = event.shiftKey ? 10 : 2

    if (event.key === "ArrowLeft" || event.key === "ArrowDown") {
      event.preventDefault()
      setPosition(positionRef.current - keyOffset)
      setPinned(true)
    }
    if (event.key === "ArrowRight" || event.key === "ArrowUp") {
      event.preventDefault()
      setPosition(positionRef.current + keyOffset)
      setPinned(true)
    }
    if (event.key === "Home") {
      event.preventDefault()
      setPosition(minimumPosition)
      setPinned(true)
    }
    if (event.key === "End") {
      event.preventDefault()
      setPosition(maximumPosition)
      setPinned(true)
    }
    if (event.key === "Escape") {
      setPinned(false)
    }
  }

  return (
    <button
      aria-label={`${label}. Move the pointer or use arrow keys to scan. Activate to pin.`}
      aria-pressed={pinned}
      className={cn(styles.frame, className)}
      data-pinned={pinned}
      onClick={() => setPinned((current) => !current)}
      onKeyDown={handleKeyDown}
      onPointerMove={handlePointerMove}
      ref={frameRef}
      style={{ "--scan-position": "50%" } as CSSProperties}
      type="button"
    >
      <span className={styles.baseLayer}>{base}</span>
      <span aria-hidden="true" className={styles.signalLayer}>
        {signal}
      </span>
      <span aria-hidden="true" className={styles.reticle}>
        <span className={styles.readout}>SCAN / LOCAL</span>
      </span>
    </button>
  )
}
