"use client"

import type { PointerEvent, ReactNode } from "react"
import { useRef, useState } from "react"
import { cn } from "@/lib/utils"
import styles from "./SignalCrosshairField.module.css"

type SignalCrosshairFieldProps = {
  readonly children: ReactNode
  readonly className?: string
  readonly label?: string
}

/**
 * A surveyed surface: while the pointer is inside, full-height crosshair
 * rules track it and a mono readout reports grid coordinates, like a HUD
 * measuring the composition. Content stays untouched underneath.
 */
export function SignalCrosshairField({
  children,
  className,
  label
}: SignalCrosshairFieldProps) {
  const fieldRef = useRef<HTMLDivElement | null>(null)
  const readoutRef = useRef<HTMLSpanElement | null>(null)
  const [active, setActive] = useState(false)

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const field = fieldRef.current
    if (!field) {
      return
    }
    const rect = field.getBoundingClientRect()
    const x = (event.clientX - rect.left) / rect.width
    const y = (event.clientY - rect.top) / rect.height
    field.style.setProperty("--cross-x", `${(x * 100).toFixed(2)}%`)
    field.style.setProperty("--cross-y", `${(y * 100).toFixed(2)}%`)

    const readout = readoutRef.current
    if (readout) {
      const column = Math.min(12, Math.max(1, Math.ceil(x * 12)))
      readout.textContent = `C${String(column).padStart(2, "0")} / X${(
        x * 100
      ).toFixed(0)} Y${(y * 100).toFixed(0)}`
    }
  }

  return (
    <div
      aria-label={label}
      className={cn(styles.field, className)}
      data-active={active || undefined}
      onPointerEnter={() => setActive(true)}
      onPointerLeave={() => setActive(false)}
      onPointerMove={handlePointerMove}
      ref={fieldRef}
      role={label ? "img" : undefined}
    >
      {children}
      <span aria-hidden="true" className={styles.lineX} />
      <span aria-hidden="true" className={styles.lineY} />
      <span aria-hidden="true" className={styles.readout} ref={readoutRef}>
        C00 / X00 Y00
      </span>
    </div>
  )
}
