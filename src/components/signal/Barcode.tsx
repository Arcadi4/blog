import { cn } from "@/lib/utils"

type SignalBarcodeProps = {
  readonly className?: string
  readonly code: string
  readonly showCode?: boolean
}

/**
 * Registration barcode set in Libre Barcode 128 — the code string itself is
 * the artwork. Decorative print-production furniture for rails and footers;
 * scale it with text-* classes on the wrapper, color follows currentColor.
 */
export function SignalBarcode({
  className,
  code,
  showCode = true
}: SignalBarcodeProps) {
  return (
    <span
      aria-hidden="true"
      className={cn("inline-flex flex-col gap-1 select-none", className)}
    >
      <span className="font-barcode text-[2.25em] leading-[0.85]">{code}</span>
      {showCode ? (
        <span className="font-mono text-xs leading-none">{code}</span>
      ) : null}
    </span>
  )
}
