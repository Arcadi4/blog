import type { CSSProperties, ReactNode } from "react"
import { cn } from "@/lib/utils"

const SCENE_COLUMN_COUNT = 12

type SceneGridProps = {
  readonly as?: "article" | "div"
  readonly children: ReactNode
  readonly className?: string
  readonly gridLines?: "background" | "foreground" | "none"
  readonly height?: CSSProperties["height"]
  readonly rows: number
  readonly style?: CSSProperties
}

/**
 * A fixed-height scene canvas with twelve stable columns and a designer-owned
 * row count. Increase height above 100svh to give a scene its own scroll range.
 */
export function SceneGrid({
  as: Component = "div",
  children,
  className,
  gridLines = "foreground",
  height = "100svh",
  rows,
  style
}: SceneGridProps) {
  if (!Number.isInteger(rows) || rows < 1) {
    throw new Error("SceneGrid rows must be a positive integer.")
  }

  return (
    <Component
      className={cn(
        "relative isolate grid w-full grid-cols-12 gap-4 overflow-visible p-8",
        className
      )}
      style={{
        ...style,
        height,
        gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`
      }}
    >
      {gridLines === "none" ? null : (
        <div
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute inset-y-0 right-8 left-8 -z-1 grid grid-cols-12 gap-4 opacity-[.12]",
            gridLines === "background" ? "text-background" : "text-foreground"
          )}
        >
          {Array.from({ length: SCENE_COLUMN_COUNT }, (_, index) => (
            <span className="border-l border-current" key={index} />
          ))}
        </div>
      )}

      {children}
    </Component>
  )
}
