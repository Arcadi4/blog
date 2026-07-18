import type { ReactNode } from "react"
import { cn } from "@/lib/utils"
import { CopySignal } from "@/components/signal/CopySignal"
import { SignalBars } from "@/components/signal/SignalBars"

type ArticleCodeFigureProps = {
  readonly caption?: string
  readonly children: ReactNode
  readonly className?: string
  readonly copyValue?: string
  readonly filename: string
}

export function ArticleCodeFigure({
  caption,
  children,
  className,
  copyValue,
  filename
}: ArticleCodeFigureProps) {
  return (
    <figure
      className={cn(
        "not-prose col-span-full grid min-h-[32rem] grid-cols-subgrid overflow-hidden border-y border-foreground bg-foreground text-background",
        className
      )}
    >
      <div className="col-span-2 flex flex-col justify-between bg-magenta p-4 text-foreground">
        <code className="font-mono text-[10px] leading-none tracking-[0.16em] uppercase">
          :::arc-code
        </code>
        <span className="font-mono text-sm leading-tight break-all">
          {filename}
        </span>
        {copyValue ? <CopySignal value={copyValue} /> : null}
        <SignalBars className="w-full" />
      </div>

      <section
        aria-label={`Source code: ${filename}`}
        className="col-span-8 col-start-3 flex min-w-0 items-center overflow-x-auto border-x border-background/35 p-8"
      >
        <div className="w-max min-w-full text-sm leading-relaxed">
          {children}
        </div>
      </section>

      <figcaption className="col-span-2 col-start-11 flex flex-col justify-between bg-acid p-4 text-foreground">
        <span className="font-mono text-[10px] leading-none tracking-[0.16em] uppercase">
          Code specimen
        </span>
        <p className="text-sm leading-tight">
          {caption ?? "Highlighted source excerpt"}
        </p>
        <span className="font-mono text-[10px] leading-none uppercase [writing-mode:vertical-rl]">
          Language / from fence
        </span>
      </figcaption>
    </figure>
  )
}
