import {ScaleIn} from "@/components/animations/ScaleIn";
import {cn} from "@/lib/utils";

interface VerticalGridProps {
  height: string;
}

type GridLinePairProps = VerticalGridProps & {
  delayMs?: number;
  leftColumnClassName: string;
  rightColumnClassName: string;
  elevated?: boolean;
};

const animationDurationMs = 1600;

function GridLinePair({
  delayMs,
  elevated = false,
  height,
  leftColumnClassName,
  rightColumnClassName,
}: GridLinePairProps) {
  const zIndexClass = elevated ? "z-20" : undefined;

  return (
    <>
      <ScaleIn
        from="top"
        delayMs={delayMs}
        durationMs={animationDurationMs}
        className={cn(
          "separator col-span-1 row-start-1 border-r",
          leftColumnClassName,
          zIndexClass,
          height,
        )}
      />
      <ScaleIn
        from="top"
        delayMs={delayMs}
        durationMs={animationDurationMs}
        className={cn(
          "separator col-span-1 row-start-1 border-l",
          rightColumnClassName,
          zIndexClass,
          height,
        )}
      />
    </>
  );
}

export function VerticalGridL({ height }: VerticalGridProps) {
  return (
    <GridLinePair
      height={height}
      leftColumnClassName="col-start-2"
      rightColumnClassName="col-start-3"
      elevated
    />
  );
}

export function VerticalGridM({ height }: VerticalGridProps) {
  return (
    <GridLinePair
      height={height}
      leftColumnClassName="col-start-6"
      rightColumnClassName="col-start-7"
      delayMs={200}
    />
  );
}

export function VerticalGridR({ height }: VerticalGridProps) {
  return (
    <GridLinePair
      height={height}
      leftColumnClassName="col-start-10"
      rightColumnClassName="col-start-11"
      delayMs={400}
      elevated
    />
  );
}

export default function VerticalGrid({ height }: VerticalGridProps) {
  return (
    <div className="absolute grid h-dvh w-dvw grid-cols-12 gap-x-4 px-8">
      <VerticalGridL height={height} />
      <VerticalGridM height={height} />
      <VerticalGridR height={height} />
    </div>
  );
}
