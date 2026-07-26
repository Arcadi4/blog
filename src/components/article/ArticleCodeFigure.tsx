import type { ReactNode } from "react"
import { cn } from "@/lib/utils"
import { CopySignal } from "@/components/signal/CopySignal"

type ArticleCodeFigureProps = {
  readonly caption?: string
  readonly children: ReactNode
  readonly className?: string
  readonly copyValue?: string
  readonly filename: string
}

/**
 * Captioned source frame inspired by technical manuals and terminal readouts,
 * keeping already-highlighted code inside one deliberate scroll region.
 */
export function ArticleCodeFigure({
  caption,
  children,
  className,
  copyValue,
  filename
}: ArticleCodeFigureProps) {
  return (
    <figure className={cn("col-span-full grid grid-cols-subgrid", className)}>
      <div className="col-span-8 col-start-3 overflow-hidden bg-foreground text-background max-md:col-span-full max-md:col-start-1">
        <div className="flex min-h-12 items-center justify-between border-b border-background/25 px-4">
          <span className="font-mono text-[10px] leading-tight tracking-[0.12em] break-all uppercase">
            {filename}
          </span>
          {copyValue ? <CopySignal value={copyValue} /> : null}
        </div>
        <section
          aria-label={`Source code: ${filename}`}
          className="min-w-0 overflow-x-auto p-5"
        >
          <div className="w-max min-w-full text-sm leading-relaxed">
            {children}
          </div>
        </section>
        <figcaption className="border-t border-background/25 px-4 py-3 text-xs leading-tight text-background/65">
          {caption ?? "Highlighted source excerpt"}
        </figcaption>
      </div>
    </figure>
  )
}
