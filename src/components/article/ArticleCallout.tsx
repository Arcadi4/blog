import type { ReactNode } from "react"
import { cn } from "@/lib/utils"
import { SignalBars } from "@/components/signal/SignalBars"

type ArticleCalloutProps = {
  readonly children: ReactNode
  readonly className?: string
  readonly label: string
  readonly title?: string
}

export function ArticleCallout({
  children,
  className,
  label,
  title
}: ArticleCalloutProps) {
  return (
    <aside
      className={cn(
        "col-span-full grid min-h-64 grid-cols-subgrid overflow-hidden border-y border-foreground bg-background",
        className
      )}
      role="note"
    >
      <div className="col-span-2 flex flex-col justify-between bg-acid p-4 text-foreground">
        <span className="font-mono text-[10px] leading-none tracking-[0.16em] uppercase">
          Note / retained
        </span>
        <span
          aria-hidden="true"
          className="font-funnel-display text-8xl leading-[0.7]"
        >
          !
        </span>
        <SignalBars className="w-full" />
      </div>

      <div className="col-span-6 col-start-4 flex flex-col justify-center py-8">
        <p className="font-mono text-xs leading-none tracking-[0.16em] text-klein uppercase">
          {label}
        </p>
        {title ? (
          <h2 className="mt-4 font-funnel-display text-5xl leading-[0.82] tracking-[-0.04em]">
            {title}
          </h2>
        ) : null}
        <div className="mt-6 text-lg leading-relaxed text-foreground/80">
          {children}
        </div>
      </div>

      <div className="col-span-2 col-start-11 flex items-center justify-center border-l border-foreground">
        <code className="font-mono text-[10px] leading-none uppercase [writing-mode:vertical-rl]">
          :::arc-callout
        </code>
      </div>
    </aside>
  )
}
