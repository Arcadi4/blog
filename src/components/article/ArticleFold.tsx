import type { ReactNode } from "react"
import { cn } from "@/lib/utils"
import styles from "./ArticleFold.module.css"

type ArticleFoldProps = {
  readonly children: ReactNode
  readonly className?: string
  readonly summary: string
}

/**
 * Native optional-reading disclosure aligned to the twelve tracks; its small
 * double-image response echoes ProximityLink without replacing browser behavior.
 */
export function ArticleFold({
  children,
  className,
  summary
}: ArticleFoldProps) {
  return (
    <details
      className={cn(
        styles.fold,
        "col-span-full grid grid-cols-subgrid",
        className
      )}
    >
      <summary
        aria-label={summary}
        className={`${styles.summary} col-span-8 col-start-3 grid min-h-20 grid-cols-8 border-y border-foreground/35 max-md:col-span-full max-md:col-start-1`}
      >
        <span className="col-span-2 flex items-center border-r border-foreground/35 font-mono text-[10px] leading-none tracking-[0.14em] uppercase">
          Optional reading
        </span>

        <span className="col-span-5 col-start-3 flex min-w-0 items-center px-4">
          <span
            className={`${styles.summaryText} font-funnel-display text-[clamp(1.5rem,3vw,2.5rem)] leading-tight tracking-[-0.025em]`}
            data-summary={summary}
          >
            {summary}
          </span>
        </span>

        <span className="col-span-1 col-start-8 flex items-center justify-end text-foreground">
          <span
            aria-hidden="true"
            className={`${styles.closedIcon} font-funnel-display text-4xl leading-none`}
          >
            +
          </span>
          <span
            aria-hidden="true"
            className={`${styles.openIcon} font-funnel-display text-4xl leading-none`}
          >
            −
          </span>
        </span>
      </summary>

      <div
        className={`${styles.foldBody} col-span-8 col-start-3 grid grid-cols-8 border-b border-foreground/35 max-md:col-span-full max-md:col-start-1`}
      >
        <div className="col-span-2 border-r border-foreground/35 py-6 font-mono text-[10px] leading-none tracking-[0.14em] uppercase">
          Detail / retained
        </div>
        <div className="col-span-5 col-start-3 px-4 py-6 text-base leading-relaxed text-foreground/75">
          {children}
        </div>
      </div>
    </details>
  )
}
