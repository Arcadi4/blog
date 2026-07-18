import type { ReactNode } from "react"
import { cn } from "@/lib/utils"
import { SignalBars } from "@/components/signal/SignalBars"

type ArticleInterruptionProps = {
  readonly children: ReactNode
  readonly className?: string
  readonly index: string
  readonly title: string
}

export function ArticleInterruption({
  children,
  className,
  index,
  title
}: ArticleInterruptionProps) {
  return (
    <section
      aria-label={title}
      className={cn(
        "col-span-full grid min-h-[36rem] grid-cols-subgrid overflow-hidden border-y border-foreground bg-foreground text-background",
        className
      )}
    >
      <div className="col-span-2 flex flex-col justify-between bg-klein p-4 text-background">
        <code className="font-mono text-[10px] leading-none tracking-[0.16em] uppercase">
          :::arc-interruption
        </code>
        <span className="font-funnel-display text-8xl leading-[0.7] tracking-[-0.08em]">
          {index}
        </span>
      </div>

      <div className="col-span-8 col-start-3 grid grid-cols-subgrid grid-rows-[1fr_min-content] p-8">
        <h2 className="col-span-full font-funnel-display text-[clamp(5rem,9vw,10rem)] leading-[0.72] tracking-[-0.06em] text-pretty">
          {title}
        </h2>
        <div className="col-span-full grid grid-cols-subgrid border-t border-background/50 pt-4">
          <SignalBars className="col-span-3 self-end" invert />
          <div className="col-span-4 col-start-5 text-lg leading-tight text-background/75">
            {children}
          </div>
        </div>
      </div>

      <div className="col-span-2 col-start-11 flex items-center justify-center bg-acid text-foreground">
        <span
          aria-hidden="true"
          className="font-funnel-display text-9xl leading-none"
        >
          ↓
        </span>
      </div>
    </section>
  )
}
