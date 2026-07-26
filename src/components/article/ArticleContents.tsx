import Link from "@/components/Link"
import { cn } from "@/lib/utils"

export type ArticleContentsItem = {
  readonly href: `#${string}`
  readonly label: string
}

type ArticleContentsProps = {
  readonly className?: string
  readonly items: readonly ArticleContentsItem[]
  readonly title?: string
}

/**
 * Visible outline for long posts, treating hash links like a Swiss contents
 * table or route map instead of adding a floating application sidebar.
 */
export function ArticleContents({
  className,
  items,
  title = "On this page"
}: ArticleContentsProps) {
  return (
    <nav
      aria-label={title}
      className={cn("col-span-full grid grid-cols-subgrid", className)}
    >
      <div className="col-span-8 col-start-3 grid grid-cols-8 border-y border-foreground/35 max-md:col-span-full max-md:col-start-1">
        <div className="col-span-2 border-r border-foreground/35 p-4 max-md:col-span-full max-md:border-r-0 max-md:border-b">
          <p className="font-mono text-[10px] leading-none tracking-[0.14em] uppercase">
            Reader map
          </p>
          <p className="mt-10 font-funnel-display text-3xl leading-none tracking-[-0.035em]">
            {title}
          </p>
        </div>
        <ol className="col-span-6 col-start-3 max-md:col-span-full max-md:col-start-1">
          {items.map((item, index) => (
            <li
              className="grid min-h-16 grid-cols-6 items-center border-b border-foreground/20 last:border-b-0"
              key={item.href}
            >
              <span className="col-span-1 px-4 font-mono text-[10px] leading-none text-klein">
                {String(index + 1).padStart(2, "0")}
              </span>
              <Link
                className="col-span-5 font-funnel-display text-xl leading-tight tracking-[-0.02em]"
                href={item.href}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ol>
      </div>
    </nav>
  )
}
