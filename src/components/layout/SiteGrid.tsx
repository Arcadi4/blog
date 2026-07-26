import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

type SiteGridProps = {
  readonly children: ReactNode
  readonly className?: string
}

/**
 * Canonical twelve-column field inspired by Swiss grid systems; every page and
 * article component inherits these exact tracks through CSS subgrid.
 */
export function SiteGrid({ children, className }: SiteGridProps) {
  return (
    <div className={cn("grid w-full grid-cols-12 gap-x-4 px-8", className)}>
      {children}
    </div>
  )
}
