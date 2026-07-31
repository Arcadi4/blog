import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

const alignmentClassName = {
  center: "items-center",
  left: "items-start",
  right: "items-end"
} as const

type TypeEchoProps = {
  readonly align?: keyof typeof alignmentClassName
  readonly children: ReactNode
  readonly className?: string
  readonly gradualSizing?: boolean
  readonly sizeClassName?: string
  readonly spacingClassName?: string
}

const echoLayers = [
  {
    className: "opacity-20 [clip-path:inset(0_0_70%_0)]",
    sizeClassName: "text-[0.28em]",
    position: "-3"
  },
  {
    className: "opacity-30 [clip-path:inset(0_0_60%_0)]",
    sizeClassName: "text-[0.52em]",
    position: "-2"
  },
  {
    className: "opacity-60 [clip-path:inset(0_0_50%_0)]",
    sizeClassName: "text-[0.76em]",
    position: "-1"
  },
  {
    className: "",
    sizeClassName: "text-[1em]",
    position: "0"
  },
  {
    className: "opacity-60 [clip-path:inset(50%_0_0)]",
    sizeClassName: "text-[0.76em]",
    position: "1"
  },
  {
    className: "opacity-30 [clip-path:inset(60%_0_0)]",
    sizeClassName: "text-[0.52em]",
    position: "2"
  },
  {
    className: "opacity-20 [clip-path:inset(70%_0_0)]",
    sizeClassName: "text-[0.28em]",
    position: "3"
  }
] as const

/**
 * Repeats one typographic mark around a focal row. The copies remain
 * decorative so assistive technology announces the content only once.
 */
export function TypeEcho({
  align = "center",
  children,
  className,
  gradualSizing = false,
  sizeClassName = "text-[20cqw]",
  spacingClassName = "space-y-0"
}: TypeEchoProps) {
  return (
    <span
      className={cn(
        "relative block aspect-4/5 w-full overflow-hidden @container",
        className
      )}
    >
      <span className="sr-only">{children}</span>
      <span
        aria-hidden="true"
        className={cn(
          "absolute inset-0 flex flex-col justify-center font-funnel-display leading-none font-normal tracking-tighter tabular-nums",
          alignmentClassName[align],
          sizeClassName,
          spacingClassName
        )}
      >
        {echoLayers.map((layer) => (
          <span
            className={cn(
              "block shrink-0 whitespace-nowrap [text-box-edge:cap_alphabetic] [text-box-trim:trim-both]",
              gradualSizing && layer.sizeClassName,
              layer.className
            )}
            key={layer.position}
          >
            {children}
          </span>
        ))}
      </span>
    </span>
  )
}
