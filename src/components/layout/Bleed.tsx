import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

type BleedProps = {
  readonly children: ReactNode
  readonly className?: string
}

/**
 * Escapes the 12-column frame to the full viewport width. Use it inside
 * SiteGrid for elements that must hit the edges of the screen — ticker
 * bands, interruptions, hero media. The page frame stays authoritative;
 * bleeding is the exception that proves the grid.
 */
export function Bleed({ children, className }: BleedProps) {
  return (
    <div
      className={cn(
        "col-span-full ml-[calc(50%-50vw)] w-screen max-w-none",
        className
      )}
    >
      {children}
    </div>
  )
}
