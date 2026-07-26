import type { ReactNode } from "react"
import { cn } from "@/lib/utils"
import { FieldLabel } from "@/components/signal/FieldLabel"

export type PageFact = {
  readonly label: string
  readonly value: ReactNode
}

type PageFactSheetProps = {
  readonly children?: ReactNode
  readonly className?: string
  readonly eyebrow: string
  readonly facts: readonly PageFact[]
  readonly lede: ReactNode
  readonly title: ReactNode
  readonly year?: string
}

/**
 * Identity or project dossier inspired by modernist CVs and technical forms;
 * large naming type is balanced by factual, repeatable metadata cells.
 */
export function PageFactSheet({
  children,
  className,
  eyebrow,
  facts,
  lede,
  title,
  year
}: PageFactSheetProps) {
  return (
    <section
      aria-label={eyebrow}
      className={cn(
        "col-span-full grid grid-cols-subgrid border-y border-foreground",
        className
      )}
    >
      <div className="col-span-4 min-h-96 overflow-hidden border-r border-foreground bg-[#e9e9e9] max-md:col-span-full max-md:min-h-64 max-md:border-r-0 max-md:border-b">
        {children}
      </div>

      <header className="col-span-8 col-start-5 grid min-h-96 grid-cols-8 p-5 max-md:col-span-full max-md:col-start-1 max-md:min-h-80">
        <div className="col-span-full flex items-baseline justify-between gap-3">
          <span className="font-funnel-display text-xl leading-none tracking-[-0.02em]">
            {eyebrow}
          </span>
          {year ? <FieldLabel>{year}</FieldLabel> : null}
        </div>
        <h2 className="col-span-full self-center font-funnel-display text-[clamp(4.5rem,10vw,11rem)] leading-[0.7] tracking-[-0.07em] text-pretty">
          {title}
        </h2>
        <div className="col-span-5 col-start-4 self-end border-t border-foreground pt-4 text-lg leading-tight max-md:col-span-7 max-md:col-start-2">
          {lede}
        </div>
      </header>

      <dl className="col-span-full grid grid-cols-subgrid border-t border-foreground">
        {facts.map((fact) => (
          <div
            className="col-span-3 min-h-36 border-r border-foreground p-4 last:border-r-0 max-md:col-span-6 max-md:border-b"
            key={fact.label}
          >
            <dt>
              <FieldLabel>{fact.label}</FieldLabel>
            </dt>
            <dd className="mt-8 font-funnel-display text-3xl leading-[0.9] tracking-[-0.035em]">
              {fact.value}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  )
}
