import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

type PageFeatureFigureProps = {
  readonly caption: ReactNode
  readonly children: ReactNode
  readonly className?: string
  readonly credit?: string
  readonly figureId: string
}

/** Large visual evidence field for landing pages and editorial feature pages. */
export function PageFeatureFigure({
  caption,
  children,
  className,
  credit,
  figureId
}: PageFeatureFigureProps) {
  return (
    <figure
      className={cn(
        "col-span-full grid min-h-[42rem] grid-cols-subgrid overflow-hidden border-y border-foreground bg-background",
        className
      )}
    >
      <div className="col-span-2 flex flex-col justify-between p-4 max-md:col-span-3">
        <span className="font-mono text-[10px] leading-none tracking-[0.16em] uppercase">
          Feature / {figureId}
        </span>
        <span className="font-funnel-display text-7xl leading-[0.72] tracking-[-0.08em]">
          {figureId}
        </span>
        <span className="font-mono text-[10px] leading-none uppercase">
          Page media field
        </span>
      </div>

      <div className="relative col-span-8 col-start-3 flex items-center justify-center overflow-hidden border-x border-foreground bg-[#e9e9e9] p-12 max-md:col-span-9 max-md:col-start-4 max-md:border-r-0 max-md:p-6">
        <span className="absolute top-4 left-4 font-mono text-[10px] leading-none uppercase">
          Visual evidence / interactive allowed
        </span>
        <div className="relative flex h-full w-full items-center justify-center">
          {children}
        </div>
      </div>

      <figcaption className="col-span-2 col-start-11 flex flex-col justify-between bg-acid p-4 text-foreground max-md:col-span-9 max-md:col-start-4 max-md:row-start-2 max-md:min-h-36 max-md:border-t max-md:border-foreground">
        <span className="font-mono text-[10px] leading-none tracking-[0.16em] uppercase">
          Caption
        </span>
        <div className="text-sm leading-tight">{caption}</div>
        {credit ? (
          <span className="border-t border-foreground pt-3 font-mono text-[10px] leading-tight uppercase">
            {credit}
          </span>
        ) : null}
      </figcaption>
    </figure>
  )
}
