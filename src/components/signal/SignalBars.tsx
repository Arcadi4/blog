import { cn } from "@/lib/utils"
import styles from "./SignalPrimitives.module.css"

const defaultBarHeights = [38, 72, 52, 100, 64, 84, 45, 92, 58, 76, 34, 68]

type SignalBarsProps = {
  readonly className?: string
  readonly invert?: boolean
}

export function SignalBars({ className, invert = false }: SignalBarsProps) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "grid h-10 auto-cols-fr grid-flow-col items-end gap-1 overflow-hidden",
        className
      )}
    >
      {defaultBarHeights.map((height, index) => (
        <span
          className={cn(
            styles.signalBar,
            invert ? "bg-background" : "bg-foreground"
          )}
          key={`${height}-${index}`}
          style={{
            animationDelay: `${index * 35}ms`,
            height: `${height}%`
          }}
        />
      ))}
    </span>
  )
}
