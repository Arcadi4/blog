import type { ReactNode } from "react"
import { cn } from "@/lib/utils"
import { SignalAsterisk } from "@/components/signal/SignalAsterisk"

type PageSectionIntroProps = {
  readonly children: ReactNode
  readonly className?: string
  readonly index: string
  readonly label: string
  readonly title: ReactNode
}

/**
 * Major page-section heading based on Swiss asymmetric hierarchy, with small
 * color registration marks keeping the transition visibly authored.
 */
export function PageSectionIntro({
  children,
  className,
  index,
  label,
  title
}: PageSectionIntroProps) {
  return (
    <header
      className={cn(
        "col-span-full grid grid-cols-subgrid border-t border-foreground pt-5 pb-10",
        className
      )}
    >
      <div className="col-span-2 flex items-baseline justify-between gap-3 max-md:col-span-3">
        <span className="font-funnel-display text-xl leading-none tracking-[-0.02em]">
          {label}
        </span>
        <span className="font-funnel-display text-5xl leading-[0.7] tracking-[-0.06em] text-klein">
          {index}
        </span>
      </div>
      <div className="col-span-8 col-start-3 max-md:col-span-9 max-md:col-start-4">
        <h2 className="font-funnel-display text-[clamp(3.5rem,7vw,7rem)] leading-[0.74] tracking-[-0.055em] text-pretty uppercase">
          {title}
        </h2>
        <div className="mt-6 max-w-3xl text-lg leading-tight text-foreground/75">
          {children}
        </div>
      </div>
      <div
        aria-hidden="true"
        className="col-span-2 col-start-11 flex items-start justify-end gap-4 max-md:hidden"
      >
        <SignalAsterisk className="text-4xl text-klein" />
        <span className="flex">
          <span className="size-5 bg-magenta" />
          <span className="mt-5 size-5 bg-klein" />
          <span className="mt-10 size-5 bg-acid" />
        </span>
      </div>
    </header>
  )
}
