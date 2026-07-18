"use client"

import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"
import styles from "./CopySignal.module.css"

type CopyStatus = "idle" | "copied" | "denied"

type CopySignalProps = {
  readonly className?: string
  readonly value: string
}

const statusLabel: Record<CopyStatus, string> = {
  copied: "Copied",
  denied: "Copy denied",
  idle: "Copy"
}

/** A compact clipboard control for code, commands, citations, and identifiers. */
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
    try {
      await navigator.clipboard.writeText(value)
      setStatus("copied")
    } catch {
      setStatus("denied")
    }

    if (resetTimer.current) {
      clearTimeout(resetTimer.current)
    }
    resetTimer.current = setTimeout(() => setStatus("idle"), 1600)
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
      <span
        aria-live="polite"
        className="font-mono text-[10px] leading-none uppercase"
      >
        {statusLabel[status]}
      </span>
    </button>
  )
}
