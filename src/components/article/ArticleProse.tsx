import type { ReactNode } from "react"
import { cn } from "@/lib/utils"
import styles from "./MarkdownContent.module.css"

type ArticleProseProps = {
  readonly children: ReactNode
  readonly className?: string
}

/**
 * Reading-width semantic lane whose restrained measure and hierarchy follow
 * Swiss book typography; intended for a future allowlisted React renderer.
 */
export function ArticleProse({ children, className }: ArticleProseProps) {
  return (
    <div className={cn("col-span-full grid grid-cols-subgrid", className)}>
      <div
        className={cn(
          styles.content,
          "col-span-8 col-start-3 max-md:col-span-full max-md:col-start-1"
        )}
      >
        {children}
      </div>
    </div>
  )
}
