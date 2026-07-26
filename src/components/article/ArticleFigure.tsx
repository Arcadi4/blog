import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

type ArticleFigureProps = {
  readonly caption: ReactNode
  readonly children: ReactNode
  readonly className?: string
  readonly credit?: string
  readonly figureId: string
  readonly width?: "reading" | "wide"
}

/**
 * Editorial figure whose caption stays measured; wide mode borrows the
 * full-field impact of a poster without abandoning the shared twelve columns.
 */
export function ArticleFigure({
  caption,
  children,
  className,
  credit,
  figureId,
  width = "reading"
}: ArticleFigureProps) {
  return (
    <figure className={cn("col-span-full grid grid-cols-subgrid", className)}>
      <div
        className={cn(
          "overflow-hidden bg-[#e9e9e9]",
          width === "wide"
            ? "col-span-full"
            : "col-span-8 col-start-3 max-md:col-span-full max-md:col-start-1"
        )}
      >
        {children}
      </div>

      <figcaption className="col-span-8 col-start-3 grid grid-cols-8 border-b border-foreground/35 py-3 text-sm leading-tight max-md:col-span-full max-md:col-start-1">
        <span className="col-span-1 font-mono text-[10px] tracking-[0.14em] uppercase">
          Fig. {figureId}
        </span>
        <div className="col-span-5 col-start-2 text-foreground/75">
          {caption}
        </div>
        {credit ? (
          <span className="col-span-2 text-right font-mono text-[10px] leading-tight uppercase">
            {credit}
          </span>
        ) : null}
      </figcaption>
    </figure>
  )
}
