import {forwardRef} from "react";
import type {ReactNode} from "react";
import {cn} from "@/lib/utils";

type MarqueeTrackProps = {
  readonly className?: string;
  readonly children: ReactNode;
};

function MarqueeTrack({ className, children }: MarqueeTrackProps) {
  return (
    <div
      className={cn(
        "absolute bottom-0 flex animate-[marquee_20s_linear_infinite] gap-2 font-mono text-lg whitespace-nowrap",
        className,
      )}
    >
      <p>{children}</p>
      <p>{children}</p>
      <p>{children}</p>
    </div>
  );
}

type MarqueeCardProps = {
  readonly className?: string;
  readonly trackClassName?: string;
  readonly children: ReactNode;
};

const MarqueeCard = forwardRef<HTMLDivElement, MarqueeCardProps>(
  function MarqueeCard(
    {className, trackClassName, children},
    ref,
  ) {
    return (
      <div ref={ref} className={cn("relative overflow-clip", className)}>
        <MarqueeTrack className={trackClassName}>{children}</MarqueeTrack>
      </div>
    );
  },
);

export default MarqueeCard;
