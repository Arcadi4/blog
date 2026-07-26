import { cn } from "@/lib/utils"
import { SignalAsterisk } from "@/components/signal/SignalAsterisk"

type PageTickerBandProps = {
  readonly className?: string
  readonly phrases: readonly string[]
  readonly tone?: "acid" | "foreground" | "klein" | "magenta"
}

const toneClassName = {
  acid: "bg-acid text-foreground",
  foreground: "bg-foreground text-background",
  klein: "bg-klein text-background",
  magenta: "bg-magenta text-background"
} as const

/**
 * Full-field ticker strip inspired by transit boards and title-sequence
 * crawls; oversized type repeats across a hard color band. Purely decorative
 * motion — the phrase list is exposed once to assistive technology.
 */
export function PageTickerBand({
  className,
  phrases,
  tone = "foreground"
}: PageTickerBandProps) {
  const sequence = phrases.join(". ")

  return (
    <div
      aria-label={sequence}
      className={cn(
        "col-span-full overflow-clip border-y border-foreground",
        toneClassName[tone],
        className
      )}
      role="marquee"
    >
      <div className="relative flex overflow-clip py-4">
        <div className="flex shrink-0 animate-marquee items-center whitespace-nowrap motion-reduce:animate-none">
          {[0, 1, 2].map((copy) => (
            <span aria-hidden="true" className="flex items-center" key={copy}>
              {phrases.map((phrase, phraseIndex) => (
                <span className="flex items-center" key={phrase}>
                  <span
                    className={cn(
                      "px-6 text-[clamp(3rem,6vw,6rem)]",
                      phraseIndex % 2 === 1
                        ? "font-serif leading-[0.9] tracking-[-0.01em] italic"
                        : "font-funnel-display leading-[0.8] tracking-[-0.05em] uppercase"
                    )}
                  >
                    {phrase}
                  </span>
                  <SignalAsterisk className="text-[clamp(2rem,4vw,4rem)]" />
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
