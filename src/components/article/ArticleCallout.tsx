import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

type ArticleCalloutProps = {
  readonly children: ReactNode
  readonly className?: string
  readonly emphasis?: "quiet" | "strong"
  readonly label: string
  readonly title?: string
}

/**
 * A measured article note: quiet follows the reading grid, while strong takes
 * its color-blocking cue from International Style field notices and game UI.
 */
export function ArticleCallout({
  children,
  className,
  emphasis = "quiet",
  label,
  title
}: ArticleCalloutProps) {
  const strong = emphasis === "strong"

  return (
    <aside
      className={cn("col-span-full grid grid-cols-subgrid", className)}
      role="note"
    >
      <div
        className={cn(
          "col-span-8 col-start-3 grid grid-cols-8 border-y py-6 max-md:col-span-full max-md:col-start-1",
          strong
            ? "border-klein bg-klein text-background"
            : "border-foreground/35"
        )}
      >
        <div
          className={cn(
            "col-span-1 flex items-start gap-2 font-mono text-[10px] leading-none tracking-[0.14em] uppercase",
            strong ? "text-acid" : "text-klein"
          )}
        >
          <span
            aria-hidden="true"
            className={cn(
              "mt-0.5 size-2 bg-acid ring-1",
              strong ? "ring-background" : "ring-foreground"
            )}
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
              "text-base leading-relaxed",
              strong ? "text-background/80" : "text-foreground/75",
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
