import type { ReactNode } from "react"
import { cn } from "@/lib/utils"
import styles from "./SignalDotField.module.css"

type SignalDotFieldProps = {
  readonly children?: ReactNode
  readonly className?: string
  readonly label?: string
}

/** Dotted calibration substrate; decorative unless a visual label is supplied. */
export function SignalDotField({
  children,
  className,
  label
}: SignalDotFieldProps) {
  return (
    <div
      aria-hidden={label ? undefined : true}
      aria-label={label}
      className={cn(styles.field, className)}
      role={label ? "img" : undefined}
    >
      {children ? <div className={styles.content}>{children}</div> : null}
    </div>
  )
}
