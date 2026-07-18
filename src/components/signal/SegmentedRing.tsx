import type { CSSProperties, ReactNode } from "react"
import { cn } from "@/lib/utils"
import styles from "./SignalPrimitives.module.css"

type SegmentedRingProps = {
  readonly children?: ReactNode
  readonly className?: string
  readonly label?: string
  readonly ringClassName?: string
  readonly ringWidth?: number
}

export function SegmentedRing({
  children,
  className,
  label,
  ringClassName,
  ringWidth = 9
}: SegmentedRingProps) {
  return (
    <span
      aria-label={label}
      className={cn(
        "relative inline-flex size-28 items-center justify-center",
        className
      )}
      role={label ? "img" : undefined}
    >
      <span
        aria-hidden="true"
        className={cn(styles.segmentedRing, "absolute inset-0", ringClassName)}
        style={{ "--ring-width": `${ringWidth}px` } as CSSProperties}
      />
      {children ? <span className="relative z-10">{children}</span> : null}
    </span>
  )
}
