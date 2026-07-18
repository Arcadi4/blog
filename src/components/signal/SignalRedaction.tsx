"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import styles from "./SignalRedaction.module.css"

type SignalRedactionProps = {
  readonly children: string
  readonly className?: string
}

/**
 * An inline disclosure for spoilers, withheld terms, and answer reveals.
 * Hover or focus previews the text; activating the button pins it open for
 * keyboard and touch users. This is a presentation device, not a way to keep
 * secrets out of the document source.
 */
export function SignalRedaction({ children, className }: SignalRedactionProps) {
  const [revealed, setRevealed] = useState(false)

  return (
    <button
      aria-pressed={revealed}
      className={cn(styles.redaction, className)}
      data-revealed={revealed}
      onClick={() => setRevealed((current) => !current)}
      type="button"
    >
      <span
        aria-hidden="true"
        className={styles.redactionText}
        data-text={children}
      >
        {children}
      </span>
      <span aria-live="polite" className="sr-only">
        {revealed
          ? `Revealed: ${children}. Activate to conceal.`
          : "Redacted text. Activate to reveal."}
      </span>
    </button>
  )
}
