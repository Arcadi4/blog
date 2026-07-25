import type { ReactNode } from "react"
import { cn } from "@/lib/utils"
import { SignalBars } from "@/components/signal/SignalBars"

type PageInterruptionProps = {
  readonly children: ReactNode
  readonly className?: string
  readonly index: string
  readonly title: string
}

/** Rare full-field state change for long visual pages, not ordinary article prose. */
export function PageInterruption({
  children,
  className,
  index,
  title
}: PageInterruptionProps) {
  return (
    <section
      aria-label={title}
      className={cn(
        "col-span-full grid min-h-[36rem] grid-cols-subgrid overflow-hidden border-y border-foreground bg-foreground text-background",
        className
      )}
    >
      <div className="col-span-2 flex flex-col justify-between bg-klein p-4 text-background max-md:col-span-3">
        <span className="font-mono text-[10px] leading-none tracking-[0.16em] uppercase">
          Page interruption
        </span>
        <span className="font-funnel-display text-8xl leading-[0.7] tracking-[-0.08em]">
          {index}
        </span>
      </div>

      <div className="col-span-8 col-start-3 grid grid-cols-subgrid grid-rows-[1fr_min-content] p-8 max-md:col-span-9 max-md:col-start-4 max-md:p-4">
        <h2 className="col-span-full font-funnel-display text-[clamp(5rem,9vw,10rem)] leading-[0.72] tracking-[-0.06em] text-pretty max-md:text-[clamp(3rem,14vw,5rem)]">
          {title}
        </h2>
        <div className="col-span-full grid grid-cols-subgrid border-t border-background/50 pt-4">
          <SignalBars className="col-span-3 self-end" invert />
          <div className="col-span-4 col-start-5 text-lg leading-tight text-background/75">
            {children}
          </div>
        </div>
      </div>

      <div className="col-span-2 col-start-11 flex items-center justify-center bg-acid text-foreground max-md:col-span-full max-md:col-start-1 max-md:row-start-2 max-md:min-h-28">
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
