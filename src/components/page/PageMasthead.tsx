import type { ReactNode } from "react"
import { cn } from "@/lib/utils"
import { FieldLabel } from "@/components/signal/FieldLabel"
import { SegmentedRing } from "@/components/signal/SegmentedRing"
import { SignalBarcode } from "@/components/signal/SignalBarcode"
import { SignalBars } from "@/components/signal/SignalBars"
import { SignalChecker } from "@/components/signal/SignalChecker"

type PageMastheadProps = {
  readonly children?: ReactNode
  readonly className?: string
  readonly eyebrow: string
  readonly sequence?: string
  readonly summary: ReactNode
  readonly title: ReactNode
}

/**
 * Expressive opener for Home, About, and indexes, combining an International
 * Style title field with small technical calibration marks.
 */
export function PageMasthead({
  children,
  className,
  eyebrow,
  sequence = "01",
  summary,
  title
}: PageMastheadProps) {
  return (
    <header
      className={cn(
        "col-span-full grid min-h-[46rem] grid-cols-subgrid overflow-hidden border-b border-foreground bg-background",
        className
      )}
    >
      <div className="col-span-2 flex flex-col justify-between bg-klein p-4 text-background max-md:col-span-3">
        <div className="flex items-start justify-between gap-3">
          <FieldLabel className="text-background">{eyebrow}</FieldLabel>
          <SignalChecker className="size-6 shrink-0" />
        </div>
        <SegmentedRing
          className="size-28 self-center"
          ringClassName="text-acid"
          ringWidth={8}
        >
          <span aria-hidden="true" className="font-mono text-sm">
            {sequence}
          </span>
        </SegmentedRing>
        <div className="flex flex-col gap-3">
          <SignalBars invert />
          <SignalBarcode code={`SEQ-${sequence}`} />
        </div>
      </div>

      <div className="col-span-7 col-start-3 flex min-w-0 flex-col justify-between px-4 py-5 max-md:col-span-9 max-md:col-start-4 max-md:min-h-[42rem]">
        <FieldLabel className="text-foreground/70">
          composition · 12-column field
        </FieldLabel>
        <h1 className="font-funnel-display text-[clamp(5.5rem,10vw,11rem)] leading-[0.68] tracking-[-0.065em] text-pretty uppercase max-md:text-[clamp(3.5rem,17vw,5.5rem)]">
          {title}
        </h1>
        <div className="grid grid-cols-7 border-t border-foreground pt-4">
          <p className="col-span-5 text-lg leading-tight text-foreground/80">
            {summary}
          </p>
          <span className="col-span-1 col-start-7 justify-self-end font-mono text-4xl leading-none text-klein">
            ↓
          </span>
        </div>
      </div>

      <div className="relative col-span-3 col-start-10 flex min-h-80 items-center justify-center overflow-hidden border-l border-foreground bg-acid p-6 max-md:col-span-full max-md:col-start-1 max-md:min-h-52 max-md:border-t max-md:border-l-0">
        <FieldLabel
          aria-hidden
          className="absolute top-3 left-3 text-foreground"
          kind="index"
        >
          {sequence}
        </FieldLabel>
        <SignalChecker className="absolute right-3 bottom-3 h-4 w-16 [--checker-size:0.5rem]" />
        {children ?? (
          <span
            aria-hidden="true"
            className="font-funnel-display text-[clamp(8rem,16vw,18rem)] leading-none tracking-[-0.09em]"
          >
            {sequence}
          </span>
        )}
      </div>
    </header>
  )
}
