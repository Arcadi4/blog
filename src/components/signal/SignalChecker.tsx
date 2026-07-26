import { cn } from "@/lib/utils"
import styles from "./SignalPrimitives.module.css"

type SignalCheckerProps = {
  readonly className?: string
}

/**
 * Checkerboard registration block taken from broadcast calibration frames and
 * print targets; size it with height and width utilities, color with text-*.
 */
export function SignalChecker({ className }: SignalCheckerProps) {
  return (
    <span
      aria-hidden="true"
      className={cn(styles.checker, "block", className)}
    />
  )
}
