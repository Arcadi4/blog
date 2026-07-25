import { cn } from "@/lib/utils"

type ArticleDividerProps = {
  readonly className?: string
  readonly index?: string
  readonly label: string
  readonly variant?: "route" | "rule"
}

/** Chapter transition with a quiet rule default and an opt-in directional route. */
export function ArticleDivider({
  className,
  index,
  label,
  variant = "rule"
}: ArticleDividerProps) {
  if (variant === "route") {
    return (
      <div
        className={cn("col-span-full grid grid-cols-subgrid py-6", className)}
      >
        <hr aria-label={`Section: ${label}`} className="sr-only" />
        <div className="col-span-8 col-start-3 grid min-h-16 grid-cols-8 items-stretch border-y border-foreground/35 font-mono text-[10px] leading-none tracking-[0.14em] uppercase max-md:col-span-full max-md:col-start-1">
          <span className="col-span-1 flex items-center bg-klein px-3 text-background">
            {index ?? "→"}
          </span>
          <span className="col-span-4 flex items-center px-4">{label}</span>
          <span
            aria-hidden="true"
            className="col-span-3 flex items-center gap-2 px-3 text-klein"
          >
            <span className="size-1.5 bg-current" />
            <span className="h-px flex-1 bg-current/35" />
            <span className="size-1.5 rounded-full border border-current" />
            <span className="h-px flex-1 bg-current/35" />
            <span className="text-base leading-none">→</span>
          </span>
        </div>
      </div>
    )
  }

  return (
    <div className={cn("col-span-full grid grid-cols-subgrid py-6", className)}>
      <div className="relative col-span-8 col-start-3 flex items-center gap-4 pt-3 font-mono text-[10px] leading-none tracking-[0.14em] uppercase max-md:col-span-full max-md:col-start-1">
        <hr
          aria-label={`Section: ${label}`}
          className="absolute inset-x-0 top-0 border-0 border-t border-foreground/35"
        />
        {index ? <span className="text-klein">{index}</span> : null}
        <span>{label}</span>
        <span aria-hidden="true" className="ml-auto flex gap-1">
          <span className="size-1.5 bg-foreground" />
          <span className="size-1.5 bg-magenta" />
          <span className="size-1.5 bg-acid ring-1 ring-foreground" />
        </span>
      </div>
    </div>
  )
}
