import type { ReactNode } from "react"
import { cn } from "@/lib/utils"
import { SegmentedRing } from "@/components/signal/SegmentedRing"

type PagePullQuoteProps = {
  readonly children: ReactNode
  readonly citation: string
  readonly className?: string
}

/** Manifesto-scale quotation for About pages and authored visual essays. */
export function PagePullQuote({
  children,
  citation,
  className
}: PagePullQuoteProps) {
  return (
    <figure
      className={cn(
        "col-span-full grid min-h-[32rem] grid-cols-subgrid overflow-hidden border-y border-foreground bg-background",
        className
      )}
    >
      <div className="relative col-span-2 flex items-center justify-center bg-magenta text-foreground max-md:col-span-3">
        <span
          aria-hidden="true"
          className="font-serif text-[12rem] leading-none"
        >
          “
        </span>
        <span className="absolute top-4 left-4 font-mono text-[10px] leading-none tracking-[0.16em] uppercase">
          Page quotation
        </span>
      </div>

      <blockquote className="col-span-8 col-start-3 flex flex-col justify-between py-8 max-md:col-span-9 max-md:col-start-4 max-md:px-4">
        <div className="font-funnel-display text-[clamp(3.5rem,6vw,7rem)] leading-[0.82] tracking-[-0.045em] text-pretty max-md:text-[clamp(2.5rem,11vw,3.5rem)]">
          {children}
        </div>
        <figcaption className="border-t border-foreground pt-4 font-mono text-xs leading-tight uppercase">
          <cite className="not-italic">{citation}</cite>
        </figcaption>
      </blockquote>

      <div className="col-span-2 col-start-11 flex flex-col items-center justify-between border-l border-foreground py-4 max-md:hidden">
        <span className="font-mono text-[10px] leading-none uppercase [writing-mode:vertical-rl]">
          Citation / retained
        </span>
        <SegmentedRing
          className="size-24"
          ringClassName="text-klein"
          ringWidth={7}
        >
          <span aria-hidden="true" className="font-mono text-sm">
            Q
          </span>
        </SegmentedRing>
      </div>
    </figure>
  )
}
