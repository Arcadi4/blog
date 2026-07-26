import { cn } from "@/lib/utils"
import styles from "./MarkdownContent.module.css"

type MarkdownContentProps = {
  readonly className?: string
  readonly html: string
}

/**
 * Sanitized-HTML boundary for live posts; its CSS applies the same restrained
 * Swiss reading typography without inventing a second document model.
 */
export function MarkdownContent({ className, html }: MarkdownContentProps) {
  return (
    <article
      className={cn(styles.content, className)}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}
