import type { ReactNode } from "react"
import ProximityLink from "@/components/ProximityLink"
import { cn } from "@/lib/utils"

export type PageContactSheetItem = {
  readonly className?: string
  readonly href?: string
  readonly id: string
  readonly media: ReactNode
  readonly meta: string
  readonly title: string
}

type PageContactSheetProps = {
  readonly className?: string
  readonly items: readonly PageContactSheetItem[]
  readonly label: string
  readonly title: string
}

/**
 * Authored media mosaic for portfolios and image-led archives, inspired by
 * contact sheets while keeping every irregular card on the twelve-column field.
 */
export function PageContactSheet({
  className,
  items,
  label,
  title
}: PageContactSheetProps) {
  return (
    <section
      aria-label={title}
      className={cn(
        "col-span-full grid grid-cols-subgrid gap-y-4 border-y border-foreground py-4",
        className
      )}
    >
      <header className="col-span-full grid grid-cols-subgrid items-end pb-8">
        <p className="col-span-2 font-mono text-[10px] leading-none tracking-[0.15em] uppercase max-md:col-span-3">
          {label}
        </p>
        <h2 className="col-span-7 col-start-3 font-funnel-display text-[clamp(3rem,7vw,7rem)] leading-[0.74] tracking-[-0.055em] uppercase max-md:col-span-9 max-md:col-start-4">
          {title}
        </h2>
        <p className="col-span-2 col-start-11 text-right font-mono text-[10px] leading-tight uppercase max-md:col-span-3 max-md:col-start-10">
          {String(items.length).padStart(2, "0")} records
        </p>
      </header>

      {items.map((item) => (
        <article
          className={cn(
            "col-span-4 grid min-h-[28rem] grid-rows-[1fr_auto] overflow-hidden border border-foreground bg-background max-md:col-span-6 max-md:col-start-auto max-sm:col-span-full",
            item.className
          )}
          key={item.id}
        >
          <div className="min-h-64 overflow-hidden border-b border-foreground">
            {item.media}
          </div>
          <footer className="grid grid-cols-4 gap-x-4 p-3">
            <span className="col-span-1 font-mono text-[10px] leading-none uppercase">
              {item.id}
            </span>
            <div className="col-span-3">
              <h3 className="font-funnel-display text-3xl leading-[0.9] tracking-[-0.035em]">
                {item.href ? (
                  <ProximityLink
                    className="max-w-full"
                    href={item.href}
                    label={item.title}
                    radius={180}
                  />
                ) : (
                  item.title
                )}
              </h3>
              <p className="mt-3 font-mono text-[10px] leading-tight text-foreground/60 uppercase">
                {item.meta}
              </p>
            </div>
          </footer>
        </article>
      ))}
    </section>
  )
}
