import ProximityLink from "@/components/ProximityLink"
import { cn } from "@/lib/utils"

type PageIndexRowProps = {
  readonly className?: string
  readonly href: string
  readonly index: string
  readonly meta: string
  readonly summary?: string
  readonly title: string
}

/**
 * Scannable archive row inspired by editorial indexes and transport boards;
 * typography carries navigation while the hover signal remains secondary.
 */
export function PageIndexRow({
  className,
  href,
  index,
  meta,
  summary,
  title
}: PageIndexRowProps) {
  return (
    <article
      className={cn(
        "col-span-full grid min-h-44 grid-cols-subgrid border-t border-foreground py-4",
        className
      )}
    >
      <div className="col-span-2 flex flex-col justify-between font-mono text-[10px] leading-none uppercase max-md:col-span-3">
        <span>Index / {index}</span>
        <span>{meta}</span>
      </div>
      <h3 className="col-span-7 col-start-3 self-center font-funnel-display text-[clamp(3rem,6vw,6.5rem)] leading-[0.76] tracking-[-0.055em] max-md:col-span-9 max-md:col-start-4 max-md:text-4xl">
        <ProximityLink
          className="max-w-full"
          href={href}
          label={title}
          shadowColor="var(--color-magenta)"
        />
      </h3>
      <div className="col-span-2 col-start-11 flex flex-col justify-between border-l border-foreground pl-4 text-sm leading-tight max-md:col-span-9 max-md:col-start-4 max-md:row-start-2 max-md:mt-4 max-md:border-t max-md:border-l-0 max-md:pt-3 max-md:pl-0">
        <p>{summary ?? "Open indexed entry."}</p>
        <span
          aria-hidden="true"
          className="font-funnel-display text-6xl leading-none"
        >
          →
        </span>
      </div>
    </article>
  )
}
