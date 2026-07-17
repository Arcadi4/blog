"use client"

import { useCallback } from "react"
import type { ComponentPropsWithoutRef } from "react"
import { ScrollInterpolation } from "./ScrollInterpolation"

type ScaleAxis = "x" | "y" | "both"

type ScrollScaleProps = ComponentPropsWithoutRef<"div"> & {
  readonly from?: number
  readonly to?: number
  readonly axis?: ScaleAxis
  readonly scrollRange?: number
}

function getScaleTransform(axis: ScaleAxis, scale: number): string {
  if (axis === "x") {
    return `scaleX(${scale})`
  }

  if (axis === "y") {
    return `scaleY(${scale})`
  }

  return `scale(${scale})`
}

export function ScrollScale({
  from = 0,
  to = 1,
  axis = "both",
  scrollRange = 1,
  ...props
}: ScrollScaleProps) {
  const interpolate = useCallback(
    (scale: number, element: HTMLDivElement) => {
      element.style.transform = getScaleTransform(axis, scale)
    },
    [axis]
  )

  return (
    <ScrollInterpolation
      from={from}
      to={to}
      scrollRange={scrollRange}
      interpolate={interpolate}
      {...props}
    />
  )
}
