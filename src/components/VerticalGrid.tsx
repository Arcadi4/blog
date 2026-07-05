import {ScaleIn} from "@/components/animations/ScaleIn";
import {cn} from "@/lib/utils";

interface VerticalGridProps {
  height: string;
}

export default function VerticalGrid({ height }: VerticalGridProps) {
  return (
    <div className="absolute grid h-dvh w-dvw grid-cols-12 gap-x-4 px-8">
      <ScaleIn
        from="top"
        durationMs={1600}
        className={cn(
          "separator z-20 col-start-2 col-span-1 row-start-1 border-r",
          height,
        )}
      />
      <ScaleIn
        from="top"
        durationMs={1600}
        className={cn(
          "separator z-20 col-start-3 col-span-1 row-start-1 border-l",
          height,
        )}
      />
      <ScaleIn
        from="top"
        delayMs={200}
        durationMs={1600}
        className={cn(
          "separator col-start-6 col-span-1 row-start-1 border-r",
          height,
        )}
      />
      <ScaleIn
        from="top"
        delayMs={200}
        durationMs={1600}
        className={cn(
          "separator col-start-7 col-span-1 row-start-1 border-l",
          height,
        )}
      />
      <ScaleIn
        from="top"
        delayMs={400}
        durationMs={1600}
        className={cn(
          "separator z-20 col-start-10 col-span-1 row-start-1 border-r",
          height,
        )}
      />
      <ScaleIn
        from="top"
        delayMs={400}
        durationMs={1600}
        className={cn(
          "separator z-20 col-start-11 col-span-1 row-start-1 border-l",
          height,
        )}
      />
    </div>
  );
}
