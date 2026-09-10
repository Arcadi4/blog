import * as runtime from "react/jsx-runtime"
import type { ComponentType, ElementType } from "react"
import { cn } from "@/lib/utils"
import styles from "./MarkdownContent.module.css"

/** Components article content may reference by name, resolved at render time. */
type MdxComponents = Record<string, ElementType>

type MdxContent = ComponentType<{ components?: MdxComponents }>

type MarkdownContentProps = {
  readonly className?: string
  /** Compiled MDX function body emitted by the content layer. */
  readonly code: string
  readonly components?: MdxComponents
}

const cached = new Map<string, MdxContent>()

function compile(code: string): MdxContent {
  const existing = cached.get(code)
  if (existing) return existing

  const { default: Content } =
    // oxlint-disable-next-line typescript/no-implied-eval -- MDX ships function bodies; the content layer compiled this from our own repository.
    (new Function(code) as (scope: unknown) => { default: MdxContent })(runtime)

  cached.set(code, Content)
  return Content
}

/**
 * MDX boundary for article bodies; its CSS applies the restrained Swiss reading
 * typography without inventing a second document model.
 */
export function MarkdownContent({
  className,
  code,
  components
}: MarkdownContentProps) {
  const Content = compile(code)

  return (
    <article className={cn(styles.content, className)}>
      <Content components={components} />
    </article>
  )
}
