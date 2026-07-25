import { cn } from "@/lib/utils"

type ArticleDividerProps = {
  readonly className?: string
  readonly index?: string
  readonly label: string
}

/** Quiet chapter transition for ordinary long-form articles. */
export function ArticleDivider({
  className,
  index,
  label
}: ArticleDividerProps) {
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
