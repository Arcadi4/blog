import type { ReactNode } from "react"
import { cn } from "@/lib/utils"
import { FieldLabel } from "@/components/signal/FieldLabel"

export type ArticleFact = {
  readonly label: string
  readonly value: ReactNode
}

type ArticleFactGridProps = {
  readonly className?: string
  readonly facts: readonly ArticleFact[]
  readonly label?: string
}

/**
 * Compact versions, scope, status, or results arranged like a technical data
 * sheet; factual labels provide the rhythm rather than marketing metrics.
 */
export function ArticleFactGrid({
  className,
  facts,
  label = "Article facts"
}: ArticleFactGridProps) {
  return (
    <section
      aria-label={label}
      className={cn("col-span-full grid grid-cols-subgrid", className)}
    >
      <dl className="col-span-8 col-start-3 grid grid-cols-8 border-y border-foreground/35 max-md:col-span-full max-md:col-start-1">
        <div className="col-span-2 border-r border-foreground/35 p-4 max-md:col-span-full max-md:border-r-0 max-md:border-b">
          <dt>
            <FieldLabel>context</FieldLabel>
          </dt>
          <dd className="mt-8 font-funnel-display text-2xl leading-none tracking-[-0.03em]">
            {label}
          </dd>
        </div>
        {facts.map((fact) => (
          <div
            className="col-span-2 min-h-28 border-r border-foreground/20 p-4 last:border-r-0 max-md:col-span-4 max-md:border-b"
            key={fact.label}
          >
            <dt className="text-sm leading-none text-foreground/55">
              {fact.label}
            </dt>
            <dd className="mt-5 font-funnel-display text-2xl leading-[0.95] tracking-[-0.025em]">
              {fact.value}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  )
}
