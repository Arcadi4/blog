import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

type ArticlePullQuoteProps = {
  readonly children: ReactNode
  readonly citation: string
  readonly className?: string
  readonly voice?: "display" | "serif"
}

/**
 * Mid-article emphasis inspired by editorial pull quotes, scaled for contrast
 * but held to the reading lane so it cannot become a competing poster.
 */
export function ArticlePullQuote({
  children,
  citation,
  className,
  voice = "display"
}: ArticlePullQuoteProps) {
  return (
    <figure
      className={cn("col-span-full grid grid-cols-subgrid py-8", className)}
    >
      <div className="col-span-1 col-start-2 flex justify-end pr-3 max-md:hidden">
        <span
          aria-hidden="true"
          className="font-serif text-6xl leading-none text-magenta"
        >
          “
        </span>
      </div>

      <blockquote className="col-span-7 col-start-3 border-l border-foreground/35 pl-6 max-md:col-span-full max-md:col-start-1">
        <div
          className={cn(
            "text-pretty",
            voice === "serif"
              ? "font-serif text-[clamp(1.9rem,3.6vw,3.4rem)] leading-[1.08] tracking-[-0.01em] italic"
              : "font-funnel-display text-[clamp(2rem,4vw,3.75rem)] leading-[0.95] tracking-[-0.035em]"
          )}
        >
          {children}
        </div>
        <figcaption className="mt-5 leading-tight text-foreground/65">
          <cite className="font-serif italic">{citation}</cite>
        </figcaption>
      </blockquote>
    </figure>
  )
}
