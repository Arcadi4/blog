import { cn } from "@/lib/utils"
import styles from "./MarkdownContent.module.css"

type MarkdownContentProps = {
  readonly className?: string
  readonly html: string
}

/** Renders the sanitized HTML produced by the build-time Markdown compiler. */
export function MarkdownContent({ className, html }: MarkdownContentProps) {
  return (
    <article
      className={cn(styles.content, className)}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}
