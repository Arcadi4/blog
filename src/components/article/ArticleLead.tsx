import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

type ArticleLeadProps = {
  readonly children: ReactNode
  readonly className?: string
}

/**
 * Opening thesis set like an editorial deck: larger than prose, still measured
 * by the reading grid, and never promoted into poster-scale display.
 */
export function ArticleLead({ children, className }: ArticleLeadProps) {
  return (
    <div className={cn("col-span-full grid grid-cols-subgrid", className)}>
      <p className="col-span-7 col-start-3 font-funnel-display text-[clamp(1.8rem,3.4vw,3.25rem)] leading-[1.02] tracking-[-0.025em] text-pretty max-md:col-span-full max-md:col-start-1">
        {children}
      </p>
    </div>
  )
}
