import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

type ArticleFigureProps = {
  readonly caption: ReactNode
  readonly children: ReactNode
  readonly className?: string
  readonly credit?: string
  readonly figureId: string
}

export function ArticleFigure({
  caption,
  children,
  className,
  credit,
  figureId
}: ArticleFigureProps) {
  return (
    <figure
      className={cn(
        "col-span-full grid min-h-[42rem] grid-cols-subgrid overflow-hidden border-y border-foreground bg-background",
        className
      )}
    >
      <div className="col-span-2 flex flex-col justify-between p-4">
        <span className="font-mono text-[10px] leading-none tracking-[0.16em] uppercase">
          Figure / {figureId}
        </span>
        <span className="font-funnel-display text-7xl leading-[0.72] tracking-[-0.08em]">
          {figureId}
        </span>
        <code className="font-mono text-[10px] leading-none uppercase">
          :::arc-figure
        </code>
      </div>

      <div className="relative col-span-8 col-start-3 flex items-center justify-center overflow-hidden border-x border-foreground bg-[#e9e9e9] p-12">
        <span className="absolute top-4 left-4 font-mono text-[10px] leading-none uppercase">
          Media field / evidence
        </span>
        <div className="relative flex h-full w-full items-center justify-center">
          {children}
        </div>
      </div>

      <figcaption className="col-span-2 col-start-11 flex flex-col justify-between bg-acid p-4 text-foreground">
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
