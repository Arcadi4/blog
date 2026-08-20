"use client"

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent
} from "react"

type Falloff = "linear" | "smooth" | "sharp"

export interface LineSidebarProps {
  readonly items?: readonly string[]
  readonly accentColor?: string
  readonly textColor?: string
  readonly markerColor?: string
  readonly showIndex?: boolean
  readonly showMarker?: boolean
  readonly proximityRadius?: number
  readonly maxShift?: number
  readonly falloff?: Falloff
  readonly markerLength?: number
  readonly markerGap?: number
  readonly tickScale?: number
  readonly scaleTick?: boolean
  readonly itemGap?: number
  readonly fontSize?: number
  readonly smoothing?: number
  readonly defaultActive?: number | null
  readonly activeIndex?: number | null
  readonly onItemClick?: (index: number, label: string) => void
  readonly className?: string
  readonly "aria-label"?: string
}

const FALLOFF_CURVES: Record<Falloff, (progress: number) => number> = {
  linear: (progress) => progress,
  smooth: (progress) => progress * progress * (3 - 2 * progress),
  sharp: (progress) => progress * progress * progress
}

const DEFAULT_ITEMS = [
  "Overview",
  "Components",
  "Animations",
  "Backgrounds",
  "Showcase",
  "Playground",
  "Templates",
  "Changelog",
  "Community",
  "Resources",
  "Documentation",
  "Support"
]

export function LineSidebar({
  items = DEFAULT_ITEMS,
  accentColor = "#a855f7",
  textColor = "#c4c4c4",
  markerColor = "#6c6c6c",
  showIndex = true,
  showMarker = true,
  proximityRadius = 100,
  maxShift = 30,
  falloff = "smooth",
  markerLength = 60,
  markerGap = 0,
  tickScale = 0.5,
  scaleTick = true,
  itemGap = 20,
  fontSize = 1.1,
  smoothing = 100,
  defaultActive = null,
  activeIndex,
  onItemClick,
  className = "",
  "aria-label": ariaLabel
}: LineSidebarProps) {
  const listRef = useRef<HTMLUListElement>(null)
  const itemRefs = useRef<(HTMLLIElement | null)[]>([])
  const targetsRef = useRef<number[]>([])
  const currentRef = useRef<number[]>([])
  const rafRef = useRef<number | null>(null)
  const lastRef = useRef(0)
  const activeRef = useRef<number | null>(activeIndex ?? defaultActive)
  const smoothingRef = useRef(smoothing)
  const [uncontrolledActiveIndex, setUncontrolledActiveIndex] = useState<
    number | null
  >(defaultActive)
  const selectedIndex = activeIndex ?? uncontrolledActiveIndex

  activeRef.current = selectedIndex
  smoothingRef.current = smoothing

  const runFrame = useCallback((now: number) => {
    const deltaTime = Math.min((now - lastRef.current) / 1000, 0.05)
    lastRef.current = now
    const timeConstant = Math.max(smoothingRef.current, 1) / 1000
    const interpolation = 1 - Math.exp(-deltaTime / timeConstant)

    let moving = false
    const items = itemRefs.current

    for (let index = 0; index < items.length; index += 1) {
      const element = items[index]

      if (!element) {
        continue
      }

      const target = Math.max(
        targetsRef.current[index] ?? 0,
        activeRef.current === index ? 1 : 0
      )
      const current = currentRef.current[index] ?? 0
      const next = current + (target - current) * interpolation
      const settled = Math.abs(target - next) < 0.0015
      const value = settled ? target : next

      currentRef.current[index] = value
      element.style.setProperty("--effect", value.toFixed(4))

      if (!settled) {
        moving = true
      }
    }

    rafRef.current = moving ? requestAnimationFrame(runFrame) : null
  }, [])

  const startLoop = useCallback(() => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current)
    }

    lastRef.current = performance.now()
    rafRef.current = requestAnimationFrame(runFrame)
  }, [runFrame])

  const handlePointerMove = useCallback(
    (event: PointerEvent<HTMLUListElement>) => {
      const list = listRef.current

      if (!list) {
        return
      }

      const listBounds = list.getBoundingClientRect()
      const pointerY = event.clientY - listBounds.top
      const ease = FALLOFF_CURVES[falloff] ?? FALLOFF_CURVES.linear
      const items = itemRefs.current

      for (let index = 0; index < items.length; index += 1) {
        const element = items[index]

        if (!element) {
          continue
        }

        const center = element.offsetTop + element.offsetHeight / 2
        const distance = Math.abs(pointerY - center)
        targetsRef.current[index] = ease(
          Math.max(0, 1 - distance / proximityRadius)
        )
      }

      startLoop()
    },
    [falloff, proximityRadius, startLoop]
  )

  const handlePointerLeave = useCallback(() => {
    targetsRef.current = targetsRef.current.map(() => 0)
    startLoop()
  }, [startLoop])

  const handleClick = useCallback(
    (index: number, label: string) => {
      if (activeIndex === undefined) {
        setUncontrolledActiveIndex(index)
      }

      onItemClick?.(index, label)
    },
    [activeIndex, onItemClick]
  )

  useEffect(() => {
    startLoop()
  }, [selectedIndex, startLoop])

  useEffect(
    () => () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current)
      }

      rafRef.current = null
    },
    []
  )

  const tickClass = showMarker
    ? `after:absolute after:left-[calc(-1*var(--marker-length)-var(--marker-gap))] after:top-[calc(100%+var(--item-gap)/2)] after:h-px after:opacity-50 after:content-[''] last:after:content-none after:[background-color:var(--marker-color)] after:[width:calc(var(--marker-length)*var(--tick-scale))] ${
        scaleTick
          ? "after:origin-left after:[transform:translateY(-50%)_scaleX(calc(0.7+var(--effect,0)*0.6))]"
          : "after:-translate-y-1/2"
      }`
    : ""

  return (
    <nav
      aria-label={ariaLabel}
      className={`relative flex justify-start${
        showMarker
          ? " [padding-left:calc(var(--marker-length)+var(--marker-gap))]"
          : ""
      }${className ? ` ${className}` : ""}`}
      style={
        {
          "--accent-color": accentColor,
          "--text-color": textColor,
          "--marker-color": markerColor,
          "--marker-length": `${markerLength}px`,
          "--marker-gap": `${markerGap}px`,
          "--tick-scale": tickScale,
          "--max-shift": `${maxShift}px`,
          "--item-gap": `${itemGap}px`,
          "--font-size": `${fontSize}rem`,
          "--smoothing": `${smoothing}ms`
        } as CSSProperties
      }
    >
      <ul
        ref={listRef}
        aria-label={ariaLabel}
        className="m-0 flex list-none flex-col [gap:var(--item-gap)] py-4"
        onPointerLeave={handlePointerLeave}
        onPointerMove={handlePointerMove}
      >
        {items.map((label, index) => (
          <li
            aria-current={selectedIndex === index ? "step" : undefined}
            className={`relative ${tickClass}`}
            key={`${label}-${index}`}
            ref={(element) => {
              itemRefs.current[index] = element
            }}
          >
            {showMarker && (
              <span
                aria-hidden="true"
                className="absolute top-1/2 left-[calc(-1*var(--marker-length)-var(--marker-gap))] h-px w-[length:var(--marker-length)] origin-left [transform:translateY(-50%)_scaleX(calc(0.7+var(--effect,0)*0.5))] [background-color:color-mix(in_srgb,var(--accent-color)_calc(var(--effect,0)*100%),var(--marker-color))]"
              />
            )}
            <button
              aria-label={`Go to scene ${index + 1}: ${label}`}
              className="relative inline-flex [transform:translateX(calc(var(--effect,0)*var(--max-shift)))] cursor-pointer items-baseline bg-transparent text-left [font-size:var(--font-size)] leading-[1.2] [color:color-mix(in_srgb,var(--accent-color)_calc(var(--effect,0)*100%),var(--text-color))]"
              onClick={() => handleClick(index, label)}
              type="button"
            >
              {showIndex && (
                <span className="mr-[0.6rem] font-mono text-[0.85em] [opacity:calc(0.55+var(--effect,0)*0.45)]">
                  {String(index + 1).padStart(2, "0")}
                </span>
              )}
              <span>{label}</span>
            </button>
          </li>
        ))}
      </ul>
    </nav>
  )
}
