import { cn } from "@/lib/utils"

type SignalAsteriskProps = {
  readonly className?: string
  readonly spin?: boolean
}

/**
 * Oversized typographic asterisk — punctuation promoted to a layout mark.
 * Rendered as a real glyph in the display face so it always matches the
 * site's typography. Size it with font-size (text-*) classes; color follows
 * currentColor.
 */
export function SignalAsterisk({
  className,
  spin = false
}: SignalAsteriskProps) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "inline-block leading-none font-black select-none [font-family:var(--font-geist),sans-serif]",
        spin && "motion-safe:animate-[spin_24s_steps(12,end)_infinite]",
        className
      )}
    >
      <span className="block translate-y-[0.28em] scale-[1.45]">*</span>
    </span>
  )
}
