import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

type ArticleCalloutProps = {
  readonly children: ReactNode
  readonly className?: string
  readonly label: string
  readonly title?: string
}

/** Restrained note for a caveat, definition, or constraint inside an article. */
export function ArticleCallout({
  children,
  className,
  label,
  title
}: ArticleCalloutProps) {
  return (
    <aside
      className={cn("col-span-full grid grid-cols-subgrid", className)}
      role="note"
    >
      <div className="col-span-8 col-start-3 grid grid-cols-8 border-y border-foreground/35 py-6 max-md:col-span-full max-md:col-start-1">
        <div className="col-span-1 flex items-start gap-2 font-mono text-[10px] leading-none tracking-[0.14em] text-klein uppercase">
          <span
            aria-hidden="true"
            className="mt-0.5 size-2 bg-acid ring-1 ring-foreground"
          />
          <span>{label}</span>
        </div>
        <div className="col-span-6 col-start-3">
          {title ? (
            <h2 className="font-funnel-display text-2xl leading-tight tracking-[-0.025em]">
              {title}
            </h2>
          ) : null}
          <div
            className={cn(
              "text-base leading-relaxed text-foreground/75",
              title && "mt-3"
            )}
          >
            {children}
          </div>
        </div>
      </div>
    </aside>
  )
}
