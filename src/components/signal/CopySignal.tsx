"use client"

import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"
import styles from "./CopySignal.module.css"

type CopyStatus = "idle" | "copying" | "copied" | "denied"

type CopySignalProps = {
  readonly className?: string
  readonly value: string
}

const statusLabel: Record<CopyStatus, string> = {
  copied: "Copied",
  copying: "Copying",
  denied: "Copy denied",
  idle: "Copy"
}

/**
 * Compact clipboard control for code and identifiers, combining an ordinary
 * button with a small technical status-block animation.
 */
export function CopySignal({ className, value }: CopySignalProps) {
  const [status, setStatus] = useState<CopyStatus>("idle")
  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(
    () => () => {
      if (resetTimer.current) {
        clearTimeout(resetTimer.current)
      }
    },
    []
  )

  const copy = async () => {
    setStatus("copying")

    try {
      await Promise.race([
        navigator.clipboard.writeText(value),
        new Promise<never>((_, reject) => {
          setTimeout(() => reject(new Error("Clipboard write timed out")), 1500)
        })
      ])
      setStatus("copied")
    } catch {
      setStatus("denied")
    }

    if (resetTimer.current) {
      clearTimeout(resetTimer.current)
    }
    resetTimer.current = setTimeout(() => setStatus("idle"), 3000)
  }

  return (
    <button
      aria-label={`${statusLabel[status]} source text`}
      className={cn(styles.copySignal, className)}
      data-status={status}
      onClick={copy}
      type="button"
    >
      <span aria-hidden="true" className={styles.blocks}>
        <span />
        <span />
        <span />
      </span>
      <span aria-live="polite" className="font-mono text-xs leading-none">
        {statusLabel[status]}
      </span>
    </button>
  )
}
