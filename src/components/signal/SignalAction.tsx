import ProximityLink from "@/components/ProximityLink"
import { cn } from "@/lib/utils"

type SignalActionProps = {
  readonly className?: string
  readonly description?: string
  readonly eyebrow?: string
  readonly href: string
  readonly index?: string
  readonly label: string
}

export function SignalAction({
  className,
  description,
  eyebrow = "Open channel",
  href,
  index = "01",
  label
}: SignalActionProps) {
  return (
    <div
      className={cn(
        "col-span-full grid min-h-44 grid-cols-subgrid overflow-hidden border-y border-foreground bg-background",
        className
      )}
    >
      <div className="col-span-2 flex flex-col justify-between bg-klein p-4 text-background">
        <span className="font-mono text-[10px] leading-none tracking-[0.16em] uppercase">
          Action / {index}
        </span>
        <span className="font-funnel-display text-7xl leading-[0.7] tracking-[-0.08em]">
          {index}
        </span>
      </div>

      <div className="col-span-8 flex flex-col justify-between py-4">
        <span className="font-mono text-xs leading-none tracking-[0.16em] uppercase">
          {eyebrow}
        </span>
        <div className="font-funnel-display text-[clamp(3.5rem,6.6vw,7rem)] leading-[0.76] tracking-[-0.05em]">
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
        className="col-span-2 col-start-11 flex items-center justify-center border-l border-foreground"
      >
        <span className="font-funnel-display text-8xl leading-none">→</span>
      </div>
    </div>
  )
}
