import type { ReactNode } from "react"
import { cn } from "@/lib/utils"
import styles from "./ArticleFold.module.css"

type ArticleFoldProps = {
  readonly children: ReactNode
  readonly className?: string
  readonly summary: string
}

/** Native optional-reading disclosure aligned to the site's twelve tracks. */
export function ArticleFold({
  children,
  className,
  summary
}: ArticleFoldProps) {
  return (
    <details
      className={cn(
        styles.fold,
        "col-span-full grid grid-cols-subgrid border-y border-foreground",
        className
      )}
    >
      <summary
        aria-label={summary}
        className={`${styles.summary} col-span-full grid min-h-36 grid-cols-subgrid`}
      >
        <span className="col-span-2 flex flex-col justify-between bg-foreground p-4 font-mono text-[10px] leading-none tracking-[0.16em] text-background uppercase">
          <span>Optional reading</span>
          <span>Fold / native</span>
        </span>

        <span className="col-span-8 col-start-3 flex items-center px-4">
          <span
            className={`${styles.summaryText} font-funnel-display text-[clamp(2.5rem,5vw,5.5rem)] leading-[0.78] tracking-[-0.04em]`}
            data-summary={summary}
          >
            {summary}
          </span>
        </span>

        <span className="col-span-2 col-start-11 flex items-center justify-center bg-acid text-foreground">
          <span
            aria-hidden="true"
            className={`${styles.closedIcon} font-funnel-display text-8xl leading-none`}
          >
            +
          </span>
          <span
            aria-hidden="true"
            className={`${styles.openIcon} font-funnel-display text-8xl leading-none`}
          >
            −
          </span>
        </span>
      </summary>

      <div
        className={`${styles.foldBody} col-span-full grid grid-cols-subgrid border-t border-foreground`}
      >
        <div className="col-span-2 flex items-end p-4">
          <span className="font-mono text-[10px] leading-none uppercase [writing-mode:vertical-rl]">
            Context / retained
          </span>
        </div>
        <div className="col-span-6 col-start-4 py-10 text-lg leading-relaxed">
          {children}
        </div>
        <div className="col-span-2 col-start-11 flex items-center justify-center border-l border-foreground">
          <code className="font-mono text-[10px] leading-none uppercase [writing-mode:vertical-rl]">
            :::arc-fold
          </code>
        </div>
      </div>
    </details>
  )
}
