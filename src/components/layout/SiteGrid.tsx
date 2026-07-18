import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

type SiteGridProps = {
  readonly children: ReactNode
  readonly className?: string
}

/** Owns the site's canonical twelve column tracks. Layout components inherit them with CSS subgrid. */
export function SiteGrid({ children, className }: SiteGridProps) {
  return (
    <div className={cn("grid w-full grid-cols-12 gap-x-4 px-8", className)}>
      {children}
    </div>
  )
}
