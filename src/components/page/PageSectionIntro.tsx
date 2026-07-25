import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

type PageSectionIntroProps = {
  readonly children: ReactNode
  readonly className?: string
  readonly index: string
  readonly label: string
  readonly title: ReactNode
}

/** Establishes hierarchy between major sections on expressive, non-article pages. */
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
      <div className="col-span-2 flex justify-between font-mono text-[10px] leading-none tracking-[0.16em] uppercase max-md:col-span-3">
        <span>{label}</span>
        <span>{index}</span>
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
        className="col-span-2 col-start-11 flex justify-end max-md:hidden"
      >
        <span className="size-5 bg-magenta" />
        <span className="mt-5 size-5 bg-klein" />
        <span className="mt-10 size-5 bg-acid" />
      </div>
    </header>
  )
}
