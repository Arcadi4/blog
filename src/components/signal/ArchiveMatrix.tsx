"use client"

import type { KeyboardEvent } from "react"
import { useId, useRef, useState } from "react"
import { cn } from "@/lib/utils"
import styles from "./ArchiveMatrix.module.css"

const matrixColumns = 12
const matrixRows = 6
const matrixToneClass = {
  acid: "bg-acid text-foreground",
  klein: "bg-klein text-background",
  magenta: "bg-magenta text-foreground"
} as const
type MatrixTone = keyof typeof matrixToneClass
const defaultCoordinates: readonly (readonly [number, number])[] = [
  [1, 1],
  [4, 2],
  [8, 1],
  [10, 3],
  [2, 4],
  [6, 5],
  [9, 5],
  [11, 4]
]

export type ArchiveMatrixItem = {
  readonly coordinate?: readonly [column: number, row: number]
  readonly id: string
  readonly meta: string
  readonly title: string
  readonly tone?: MatrixTone
}

type ArchiveMatrixProps = {
  readonly className?: string
  readonly items: readonly ArchiveMatrixItem[]
  readonly label?: string
}

function clampCoordinate(value: number, maximum: number) {
  return Math.min(Math.max(Math.round(value), 1), maximum)
}

function resolveCoordinate(
  item: ArchiveMatrixItem,
  index: number
): readonly [column: number, row: number] {
  const fallback = defaultCoordinates[index % defaultCoordinates.length]
  const coordinate = item.coordinate ?? fallback
  return [
    clampCoordinate(coordinate[0], matrixColumns),
    clampCoordinate(coordinate[1], matrixRows)
  ]
}

export function ArchiveMatrix({
  className,
  items,
  label = "Archive coordinate matrix"
}: ArchiveMatrixProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [previewIndex, setPreviewIndex] = useState<number | null>(null)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])
  const panelId = useId()
  const groupName = `${panelId}-selection`
  const selectedIndex = Math.min(activeIndex, Math.max(items.length - 1, 0))
  const displayIndex = previewIndex ?? selectedIndex
  const displayItem = items[displayIndex]

  if (!displayItem) {
    return null
  }

  const moveFocus = (nextIndex: number) => {
    setActiveIndex(nextIndex)
    setPreviewIndex(null)
    inputRefs.current[nextIndex]?.focus()
  }

  const moveSpatially = (
    index: number,
    columnDirection: -1 | 0 | 1,
    rowDirection: -1 | 0 | 1
  ) => {
    const [currentColumn, currentRow] = resolveCoordinate(items[index], index)
    const candidates = items
      .map((item, candidateIndex) => {
        const [column, row] = resolveCoordinate(item, candidateIndex)
        const columnDelta = column - currentColumn
        const rowDelta = row - currentRow
        const isInDirection =
          (columnDirection === 0 ||
            Math.sign(columnDelta) === columnDirection) &&
          (rowDirection === 0 || Math.sign(rowDelta) === rowDirection)

        return {
          candidateIndex,
          isInDirection,
          score:
            Math.abs(columnDelta) * (columnDirection === 0 ? 100 : 1) +
            Math.abs(rowDelta) * (rowDirection === 0 ? 100 : 1)
        }
      })
      .filter(
        (candidate) =>
          candidate.candidateIndex !== index && candidate.isInDirection
      )
      .toSorted((left, right) => left.score - right.score)

    const nearest = candidates[0]
    if (nearest) {
      moveFocus(nearest.candidateIndex)
    }
  }

  const handleKeyDown = (
    event: KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    const direction = {
      ArrowDown: [0, 1],
      ArrowLeft: [-1, 0],
      ArrowRight: [1, 0],
      ArrowUp: [0, -1]
    } as const
    const nextDirection = direction[event.key as keyof typeof direction]

    if (nextDirection) {
      event.preventDefault()
      moveSpatially(index, nextDirection[0], nextDirection[1])
    }
    if (event.key === "Home") {
      event.preventDefault()
      moveFocus(0)
    }
    if (event.key === "End") {
      event.preventDefault()
      moveFocus(items.length - 1)
    }
  }

  return (
    <section
      aria-label={label}
      className={cn(
        "col-span-full grid min-h-[34rem] grid-cols-subgrid overflow-hidden border-y border-foreground bg-foreground text-background",
        className
      )}
    >
      <div
        aria-label={label}
        className={`${styles.matrixSurface} col-span-9 flex flex-col gap-8 p-8`}
        onPointerLeave={() => setPreviewIndex(null)}
        onPointerMove={(event) => {
          const target = (event.target as HTMLElement).closest<HTMLElement>(
            "[data-matrix-index]"
          )
          setPreviewIndex(target ? Number(target.dataset.matrixIndex) : null)
        }}
        role="radiogroup"
        tabIndex={-1}
      >
        <div className="flex items-start justify-between gap-8 font-mono text-xs leading-none tracking-[0.16em] uppercase">
          <span>Coordinate / public records</span>
          <span>{items.length.toString().padStart(2, "0")} signals</span>
        </div>

        <div className="relative grid flex-1 grid-cols-12 grid-rows-6 gap-2">
          {Array.from({ length: matrixColumns * matrixRows }, (_, index) => (
            <span
              aria-hidden="true"
              className={styles.matrixCell}
              key={index}
            />
          ))}

          {items.map((item, index) => {
            const [column, row] = resolveCoordinate(item, index)
            const tone = item.tone ?? "acid"

            return (
              <label
                className={cn(
                  styles.matrixTarget,
                  "col-span-1 row-span-1 cursor-pointer",
                  index === displayIndex
                    ? matrixToneClass[tone]
                    : "bg-background/25 text-background"
                )}
                data-matrix-index={index}
                key={item.id}
                style={{ gridColumnStart: column, gridRowStart: row }}
              >
                <input
                  aria-controls={panelId}
                  aria-label={`${item.title}, ${item.meta}`}
                  checked={index === selectedIndex}
                  className="sr-only"
                  name={groupName}
                  onChange={() => setActiveIndex(index)}
                  onFocus={() => {
                    setActiveIndex(index)
                    setPreviewIndex(null)
                  }}
                  onKeyDown={(event) => handleKeyDown(event, index)}
                  ref={(element) => {
                    inputRefs.current[index] = element
                  }}
                  type="radio"
                  value={item.id}
                />
                <span className="sr-only">{item.title}</span>
              </label>
            )
          })}
        </div>

        <p className="max-w-xl text-sm leading-tight text-background/70">
          Hover to preview. Focus to select, then move through physical
          coordinates with the arrow keys. Every signal maps to a real record.
        </p>
      </div>

      <aside
        className={cn(
          styles.activePanel,
          "relative col-span-3 col-start-10 flex flex-col justify-between overflow-hidden p-6",
          matrixToneClass[displayItem.tone ?? "acid"]
        )}
        id={panelId}
        key={displayItem.id}
      >
        <div className="flex items-start justify-between font-mono text-[10px] leading-none uppercase">
          <span>{previewIndex === null ? "Selected" : "Preview"}</span>
          <span>{(displayIndex + 1).toString().padStart(2, "0")}</span>
        </div>
        <div>
          <p className="font-funnel-display text-8xl leading-[0.7] tracking-[-0.08em]">
            {(displayIndex + 1).toString().padStart(2, "0")}
          </p>
          <h2 className="mt-6 font-funnel-display text-5xl leading-[0.82] tracking-[-0.04em]">
            {displayItem.title}
          </h2>
        </div>
        <p className="border-t border-current pt-3 font-mono text-xs leading-tight uppercase">
          {displayItem.meta}
        </p>
      </aside>
    </section>
  )
}
