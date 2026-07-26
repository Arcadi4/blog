import ProximityLink from "@/components/proximity/ProximityLink"
import { cn } from "@/lib/utils"
import { FieldLabel } from "@/components/signal/FieldLabel"
import { SignalBarcode } from "@/components/signal/SignalBarcode"

type PageSignalActionProps = {
  readonly className?: string
  readonly description?: string
  readonly eyebrow?: string
  readonly href: string
  readonly index?: string
  readonly label: string
}

/**
 * High-emphasis closing destination for expressive pages, combining a Swiss
 * action strip with ProximityLink's hover-only double image.
 */
export function PageSignalAction({
  className,
  description,
  eyebrow = "Open channel",
  href,
  index = "01",
  label
}: PageSignalActionProps) {
  return (
    <div
      className={cn(
        "col-span-full grid min-h-44 grid-cols-subgrid overflow-hidden border-y border-foreground bg-background",
        className
      )}
    >
      <div className="col-span-2 flex flex-col justify-between bg-klein p-4 text-background max-md:col-span-3">
        <FieldLabel className="text-background">action</FieldLabel>
        <span className="font-funnel-display text-7xl leading-[0.7] tracking-[-0.08em]">
          {index}
        </span>
        <SignalBarcode code={`ACT-${index}`} />
      </div>

      <div className="col-span-8 flex flex-col justify-between py-4 max-md:col-span-9 max-md:px-4">
        <span className="font-funnel-display text-xl leading-none tracking-[-0.02em]">
          {eyebrow}
        </span>
        <div className="font-funnel-display text-[clamp(3.5rem,6.6vw,7rem)] leading-[0.76] tracking-[-0.05em] max-md:text-[clamp(2.5rem,12vw,3.5rem)]">
          <ProximityLink
            className="max-w-full"
            href={href}
            label={label}
            shadowColor="var(--color-klein)"
          />
        </div>
        {description ? (
          <p className="max-w-2xl text-sm leading-tight">{description}</p>
        ) : null}
      </div>

      <div
        aria-hidden="true"
        className="col-span-2 col-start-11 flex items-center justify-center border-l border-foreground max-md:col-span-full max-md:col-start-1 max-md:row-start-2 max-md:min-h-24 max-md:border-t max-md:border-l-0"
      >
        <span className="font-funnel-display text-8xl leading-none">→</span>
      </div>
    </div>
  )
}
