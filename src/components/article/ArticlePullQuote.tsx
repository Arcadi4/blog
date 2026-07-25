import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

type ArticlePullQuoteProps = {
  readonly children: ReactNode
  readonly citation: string
  readonly className?: string
}

/** Mid-article emphasis that stays inside the reading rhythm. */
export function ArticlePullQuote({
  children,
  citation,
  className
}: ArticlePullQuoteProps) {
  return (
    <figure
      className={cn("col-span-full grid grid-cols-subgrid py-8", className)}
    >
      <div className="col-span-1 col-start-2 flex justify-end pr-3 max-md:hidden">
        <span
          aria-hidden="true"
          className="font-serif text-6xl leading-none text-magenta"
        >
          “
        </span>
      </div>

      <blockquote className="col-span-7 col-start-3 border-l border-foreground/35 pl-6 max-md:col-span-full max-md:col-start-1">
        <div className="font-funnel-display text-[clamp(2rem,4vw,3.75rem)] leading-[0.95] tracking-[-0.035em] text-pretty">
          {children}
        </div>
        <figcaption className="mt-5 font-mono text-[10px] leading-tight tracking-[0.12em] text-foreground/65 uppercase">
          <cite className="not-italic">{citation}</cite>
        </figcaption>
      </blockquote>
    </figure>
  )
}
