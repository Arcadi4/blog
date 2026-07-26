import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

type ArticleReferencesProps = {
  readonly children: ReactNode
  readonly className?: string
  readonly title?: string
}

/**
 * Citation and further-reading end matter modeled on quiet book back matter,
 * with a stable label rail and conventional linked list semantics.
 */
export function ArticleReferences({
  children,
  className,
  title = "References"
}: ArticleReferencesProps) {
  return (
    <section
      aria-label={title}
      className={cn("col-span-full grid grid-cols-subgrid", className)}
    >
      <div className="col-span-8 col-start-3 grid grid-cols-8 border-t border-foreground py-6 max-md:col-span-full max-md:col-start-1">
        <h2 className="col-span-2 font-mono text-xs leading-none tracking-[0.14em] uppercase">
          {title}
        </h2>
        <div className="col-span-6 col-start-3 text-sm leading-relaxed text-foreground/70 [&_a]:text-klein [&_a]:underline [&_a]:underline-offset-2 [&_li+li]:mt-3 [&_ol]:list-decimal [&_ol]:pl-5">
          {children}
        </div>
      </div>
    </section>
  )
}
