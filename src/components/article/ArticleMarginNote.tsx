import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

type ArticleMarginNoteProps = {
  readonly children: ReactNode
  readonly className?: string
  readonly label?: string
}

/**
 * Brief supporting context placed like a modernist marginal annotation, using
 * the outer rail so it remains visibly secondary to the argument.
 */
export function ArticleMarginNote({
  children,
  className,
  label = "Margin note"
}: ArticleMarginNoteProps) {
  return (
    <aside className={cn("col-span-full grid grid-cols-subgrid", className)}>
      <div className="col-span-2 col-start-11 border-t border-klein pt-3 text-sm leading-relaxed text-foreground/65 max-md:col-span-full max-md:col-start-1">
        <p className="mb-2 font-mono text-[10px] leading-none tracking-[0.14em] text-klein uppercase">
          {label}
        </p>
        {children}
      </div>
    </aside>
  )
}
