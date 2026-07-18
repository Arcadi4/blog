import type { ReactNode } from "react"
import { cn } from "@/lib/utils"
import { SegmentedRing } from "@/components/signal/SegmentedRing"

type ArticlePullQuoteProps = {
  readonly children: ReactNode
  readonly citation: string
  readonly className?: string
}

export function ArticlePullQuote({
  children,
  citation,
  className
}: ArticlePullQuoteProps) {
  return (
    <figure
      className={cn(
        "col-span-full grid min-h-[32rem] grid-cols-subgrid overflow-hidden border-y border-foreground bg-background",
        className
      )}
    >
      <div className="relative col-span-2 flex items-center justify-center bg-magenta text-foreground">
        <span
          aria-hidden="true"
          className="font-serif text-[12rem] leading-none"
        >
          “
        </span>
        <code className="absolute top-4 left-4 font-mono text-[10px] leading-none tracking-[0.16em] uppercase">
          :::arc-quote
        </code>
      </div>

      <blockquote className="col-span-8 col-start-3 flex flex-col justify-between py-8">
        <div className="font-funnel-display text-[clamp(3.5rem,6vw,7rem)] leading-[0.82] tracking-[-0.045em] text-pretty">
          {children}
        </div>
        <figcaption className="border-t border-foreground pt-4 font-mono text-xs leading-tight uppercase">
          <cite className="not-italic">{citation}</cite>
        </figcaption>
      </blockquote>

      <div className="col-span-2 col-start-11 flex flex-col items-center justify-between border-l border-foreground py-4">
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
