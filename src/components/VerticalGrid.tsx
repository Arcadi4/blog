import { ScaleIn } from "@/components/animations/ScaleIn"
import { cn } from "@/lib/utils"

interface VerticalGridProps {
  className: string
}

type GridLinePairProps = VerticalGridProps & {
  delayMs?: number
  leftColumnClassName: string
  rightColumnClassName: string
  elevated?: boolean
}

const animationDurationMs = 1600

function GridLinePair({
  delayMs,
  elevated = false,
  className,
  leftColumnClassName,
  rightColumnClassName
}: GridLinePairProps) {
  const zIndexClass = elevated ? "z-20" : undefined

  return (
    <>
      <ScaleIn
        from="top"
        delayMs={delayMs}
        durationMs={animationDurationMs}
        className={cn(
          "separator col-span-1 border-r",
          leftColumnClassName,
          zIndexClass,
          className
        )}
      />
      <ScaleIn
        from="top"
        delayMs={delayMs}
        durationMs={animationDurationMs}
        className={cn(
          "separator col-span-1 border-l",
          rightColumnClassName,
          zIndexClass,
          className
        )}
      />
    </>
  )
}

export function VerticalGridL({ className }: VerticalGridProps) {
  return (
    <GridLinePair
      className={className}
      leftColumnClassName="col-start-2"
      rightColumnClassName="col-start-3"
      elevated
    />
  )
}

export function VerticalGridM({ className }: VerticalGridProps) {
  return (
    <GridLinePair
      className={className}
      leftColumnClassName="col-start-6"
      rightColumnClassName="col-start-7"
      delayMs={200}
    />
  )
}

export function VerticalGridR({ className }: VerticalGridProps) {
  return (
    <GridLinePair
      className={className}
      leftColumnClassName="col-start-10"
      rightColumnClassName="col-start-11"
      delayMs={400}
      elevated
    />
  )
}

export default function VerticalGrid({ className }: VerticalGridProps) {
  return (
    <div className="absolute grid h-full w-dvw grid-cols-12 gap-x-4 px-8">
      <VerticalGridL className={className} />
      <VerticalGridM className={className} />
      <VerticalGridR className={className} />
    </div>
  )
}
