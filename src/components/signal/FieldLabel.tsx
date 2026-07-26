import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

type FieldLabelProps = {
  readonly "aria-hidden"?: boolean
  readonly children: ReactNode
  readonly className?: string
  readonly kind?: "field" | "index"
}

const delimiters = {
  field: ["{", "}"],
  index: ["(", ")"]
} as const

/**
 * The bureau naming one of its own slots. Braces designate a field, parens an
 * index — the same readout dialect the home and post pages already speak in
 * ({published}, {path}, (01)). The instrument voice reads out; it never
 * announces, so it stays lowercase, unspaced, and at a size a person can read.
 */
export function FieldLabel({
  "aria-hidden": ariaHidden,
  children,
  className,
  kind = "field"
}: FieldLabelProps) {
  const [open, close] = delimiters[kind]

  return (
    <span
      aria-hidden={ariaHidden}
      className={cn("font-mono text-xs leading-none text-klein", className)}
    >
      {open}
      {children}
      {close}
    </span>
  )
}
