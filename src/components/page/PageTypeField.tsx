import type { ReactNode } from "react"
import { cn } from "@/lib/utils"
import { FieldLabel } from "@/components/signal/FieldLabel"
import { Barcode } from "@/components/signal/Barcode"

type PageTypeFieldProps = {
  readonly children?: ReactNode
  readonly className?: string
  readonly details?: readonly string[]
  readonly eyebrow: string
  readonly index?: string
  readonly summary: ReactNode
  readonly title: ReactNode
}

/**
 * Poster-scale statement for authored pages where one phrase should become the
 * composition. Its cropped type follows Swiss poster practice; use it for
 * campaigns, visual essays, and occasional About sections.
 */
export function PageTypeField({
  children,
  className,
  details = [],
  eyebrow,
  index = "01",
  summary,
  title
}: PageTypeFieldProps) {
  return (
    <section
      aria-label={eyebrow}
      className={cn(
        "col-span-full grid min-h-[48rem] grid-cols-subgrid overflow-hidden border-y border-foreground bg-acid text-foreground",
        className
      )}
    >
      <header className="col-span-full grid grid-cols-subgrid border-b border-foreground px-0 py-4">
        <div className="col-span-2 flex items-baseline justify-between gap-3 max-md:col-span-5 max-md:flex-col max-md:justify-start max-md:gap-2">
          <span className="font-funnel-display text-xl leading-none tracking-[-0.02em]">
            {eyebrow}
          </span>
          <FieldLabel className="text-foreground" kind="index">
            {index}
          </FieldLabel>
        </div>
        {details.length > 0 ? (
          <ul className="col-span-3 col-start-10 text-sm leading-tight text-foreground/70 max-md:col-span-7 max-md:col-start-6">
            {details.map((detail) => (
              <li key={detail}>{detail}</li>
            ))}
          </ul>
        ) : null}
      </header>

      <div className="relative col-span-full flex min-w-0 items-center overflow-hidden py-12">
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 flex translate-x-[0.06em] translate-y-[0.08em] items-center py-12 text-transparent [-webkit-text-stroke:1.5px_rgb(15_15_15/30%)]"
        >
          <span className="-mx-[0.045em] font-funnel-display text-[clamp(10rem,25vw,28rem)] leading-[0.62] tracking-[-0.075em] whitespace-nowrap uppercase">
            {title}
          </span>
        </span>
        <h2 className="relative -mx-[0.045em] font-funnel-display text-[clamp(10rem,25vw,28rem)] leading-[0.62] tracking-[-0.075em] whitespace-nowrap uppercase">
          {title}
        </h2>
      </div>

      <footer className="col-span-full grid min-h-48 grid-cols-subgrid items-end border-t border-foreground">
        <div className="col-span-3 col-start-2 py-5 text-sm leading-tight max-md:col-span-9 max-md:col-start-4">
          {summary}
        </div>
        {children ? (
          <div className="col-span-3 col-start-5 self-stretch overflow-hidden border-x border-foreground max-md:col-span-9 max-md:col-start-4 max-md:row-start-2 max-md:min-h-56 max-md:border-r-0">
            {children}
          </div>
        ) : null}
        <div className="col-span-2 col-start-11 flex flex-col items-end justify-end gap-3 pb-4 max-md:col-span-3 max-md:col-start-10">
          <span
            aria-hidden="true"
            className="font-funnel-display text-7xl leading-none"
          >
            ↘
          </span>
          <Barcode code={`TYP-${index}`} />
        </div>
      </footer>
    </section>
  )
}
