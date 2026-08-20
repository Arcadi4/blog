"use client"

import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type PointerEvent,
  type WheelEvent
} from "react"

export interface OptionWheelProps {
  readonly items: readonly string[]
  readonly selectedIndex: number
  readonly onItemClick?: (index: number, item: string) => void
  readonly textColor?: string
  readonly activeColor?: string
  readonly fontSize?: number
  readonly spacing?: number
  readonly tilt?: number
  readonly fade?: number
  readonly blur?: number
  readonly xPadding?: number
  readonly smoothing?: number
  readonly className?: string
}

type DragState = {
  readonly pointerId: number
  readonly startY: number
  readonly startPosition: number
}

type WheelState = {
  readonly count: number
  readonly rowHeight: number
  readonly smoothing: number
  readonly tilt: number
  readonly fade: number
  readonly blur: number
}

const MIN_OPACITY = 0.08
const MAX_TILT_ANGLE = Math.PI / 2
const AUTO_FONT_FILL_RATIO = 0.98

function clamp(value: number, count: number) {
  return Math.min(Math.max(value, 0), Math.max(count - 1, 0))
}

export default function OptionWheel({
  items,
  selectedIndex,
  onItemClick,
  textColor = "#a6a6a6",
  activeColor = "#ffffff",
  fontSize,
  spacing = 1,
  tilt = 0,
  fade = 0.25,
  blur = 1,
  xPadding = 0,
  smoothing = 160,
  className = ""
}: OptionWheelProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const measureRef = useRef<HTMLDivElement>(null)
  const itemRefs = useRef<(HTMLDivElement | null)[]>([])
  const positionRef = useRef(clamp(selectedIndex, items.length))
  const targetRef = useRef(clamp(selectedIndex, items.length))
  const animationFrameRef = useRef<number | undefined>(undefined)
  const wheelSnapTimeoutRef = useRef<number | undefined>(undefined)
  const lastFrameRef = useRef<number | undefined>(undefined)
  const dragRef = useRef<DragState | undefined>(undefined)
  const suppressClickRef = useRef(false)
  const onItemClickRef = useRef(onItemClick)
  const stateRef = useRef<WheelState>({
    count: items.length,
    rowHeight: 16,
    smoothing,
    tilt,
    fade,
    blur
  })
  const [dragging, setDragging] = useState(false)
  const [autoFontSize, setAutoFontSize] = useState(16)
  const fontSizeInPixels = fontSize === undefined ? autoFontSize : fontSize * 16
  const resolvedFontSize = fontSize ?? autoFontSize / 16

  onItemClickRef.current = onItemClick
  stateRef.current = {
    count: items.length,
    rowHeight: Math.max(fontSizeInPixels * spacing, 1),
    smoothing,
    tilt,
    fade,
    blur
  }
  useLayoutEffect(() => {
    targetRef.current = clamp(selectedIndex, items.length)
  }, [items.length, selectedIndex])

  useLayoutEffect(() => {
    if (fontSize !== undefined) return

    const root = rootRef.current
    const measure = measureRef.current
    if (!root || !measure) return

    const updateFontSize = () => {
      const textWidth = measure.getBoundingClientRect().width
      const availableWidth = Math.max(root.clientWidth - xPadding * 2, 0)
      if (!textWidth || !availableWidth) return

      const nextFontSize = (availableWidth / textWidth) * AUTO_FONT_FILL_RATIO
      setAutoFontSize((current) =>
        Math.abs(current - nextFontSize) > 0.01 ? nextFontSize : current
      )
    }

    const observer = new ResizeObserver(updateFontSize)
    observer.observe(root)
    updateFontSize()
    void document.fonts.ready.then(updateFontSize)

    return () => observer.disconnect()
  }, [fontSize, items, xPadding])

  useEffect(() => {
    const render = (now: number) => {
      const state = stateRef.current
      const elapsed = Math.min(
        (now - (lastFrameRef.current ?? now)) / 1000,
        0.05
      )
      lastFrameRef.current = now

      const interpolation =
        1 - Math.exp(-elapsed / (Math.max(state.smoothing, 1) / 1000))
      const target = clamp(targetRef.current, state.count)
      const next =
        positionRef.current + (target - positionRef.current) * interpolation
      positionRef.current = Math.abs(target - next) < 0.001 ? target : next

      const tiltRadians = (state.tilt * Math.PI) / 180
      const radius = tiltRadians > 0.0005 ? state.rowHeight / tiltRadians : 0
      for (let index = 0; index < state.count; index += 1) {
        const element = itemRefs.current[index]
        if (!element) continue

        const distance = index - positionRef.current
        const absoluteDistance = Math.abs(distance)
        const angle = Math.max(
          -MAX_TILT_ANGLE,
          Math.min(MAX_TILT_ANGLE, distance * tiltRadians)
        )
        const y = radius ? radius * Math.sin(angle) : distance * state.rowHeight
        const x = radius ? -radius * (1 - Math.cos(angle)) : 0
        const rotation = radius ? (angle * 180) / Math.PI : 0

        element.style.transform = `translate(${x.toFixed(2)}px, calc(${y.toFixed(2)}px - 50%)) rotate(${rotation.toFixed(2)}deg)`
        element.style.opacity = String(
          Math.max(MIN_OPACITY, 1 - absoluteDistance * state.fade)
        )
        element.style.filter = `blur(${(absoluteDistance * state.blur).toFixed(2)}px)`
        element.style.setProperty(
          "--ow-position",
          Math.max(0, 1 - Math.min(absoluteDistance, 1)).toFixed(4)
        )
      }

      animationFrameRef.current = requestAnimationFrame(render)
    }

    animationFrameRef.current = requestAnimationFrame(render)
    return () => {
      if (animationFrameRef.current !== undefined) {
        cancelAnimationFrame(animationFrameRef.current)
      }
      if (wheelSnapTimeoutRef.current !== undefined) {
        window.clearTimeout(wheelSnapTimeoutRef.current)
      }
    }
  }, [])

  const setTarget = (position: number, snap = false) => {
    const next = snap ? Math.round(position) : position
    targetRef.current = clamp(next, stateRef.current.count)
  }
  const handleWheel = (event: WheelEvent<HTMLDivElement>) => {
    event.preventDefault()
    setTarget(targetRef.current + event.deltaY / stateRef.current.rowHeight)
    if (wheelSnapTimeoutRef.current !== undefined) {
      window.clearTimeout(wheelSnapTimeoutRef.current)
    }
    wheelSnapTimeoutRef.current = window.setTimeout(() => {
      setTarget(targetRef.current, true)
    }, 120)
  }

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    dragRef.current = {
      pointerId: event.pointerId,
      startY: event.clientY,
      startPosition: targetRef.current
    }
    suppressClickRef.current = false
    setDragging(true)
  }

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current
    if (!drag || drag.pointerId !== event.pointerId) return

    const distance = event.clientY - drag.startY
    if (Math.abs(distance) > 3) {
      suppressClickRef.current = true
      rootRef.current?.setPointerCapture(event.pointerId)
    }
    if (suppressClickRef.current) {
      setTarget(drag.startPosition - distance / stateRef.current.rowHeight)
    }
  }

  const handlePointerEnd = (event: PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current
    if (!drag || drag.pointerId !== event.pointerId) return

    dragRef.current = undefined
    setDragging(false)
    if (suppressClickRef.current) setTarget(targetRef.current, true)
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const direction =
      event.key === "ArrowUp" || event.key === "ArrowLeft"
        ? -1
        : event.key === "ArrowDown" || event.key === "ArrowRight"
          ? 1
          : 0
    if (!direction) return

    event.preventDefault()
    setTarget(targetRef.current + direction, true)
  }

  const handleItemClick = (index: number) => {
    if (suppressClickRef.current) {
      suppressClickRef.current = false
      return
    }

    setTarget(index, true)
    onItemClickRef.current?.(index, items[index])
  }

  return (
    <div
      ref={rootRef}
      role="listbox"
      tabIndex={0}
      aria-label="Article navigation"
      className={`relative h-full w-full [touch-action:none] overflow-hidden outline-none select-none ${dragging ? "cursor-grabbing" : "cursor-grab"}${className ? ` ${className}` : ""}`}
      style={
        {
          "--ow-text-color": textColor,
          "--ow-active-color": activeColor,
          "--ow-font-size": `${resolvedFontSize}rem`,
          "--ow-x-padding": `${xPadding}px`
        } as CSSProperties
      }
      onKeyDown={handleKeyDown}
      onPointerCancel={handlePointerEnd}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerEnd}
      onWheel={handleWheel}
    >
      {fontSize === undefined ? (
        <div
          aria-hidden="true"
          className="pointer-events-none invisible absolute w-max font-[inherit] text-[1px] leading-none"
          ref={measureRef}
        >
          {items.map((item, index) => (
            <div key={`${item}-${index}`}>{item}</div>
          ))}
        </div>
      ) : null}
      {items.map((item, index) => (
        <div
          className="absolute top-1/2 left-[var(--ow-x-padding)] origin-left cursor-pointer [font-size:var(--ow-font-size)] leading-none whitespace-nowrap [color:color-mix(in_srgb,var(--ow-active-color)_calc(var(--ow-position,0)*100%),var(--ow-text-color))] will-change-[filter,opacity,transform]"
          data-cursor="interactive"
          key={`${item}-${index}`}
          ref={(element) => {
            itemRefs.current[index] = element
          }}
          aria-selected={selectedIndex === index}
          style={{ fontWeight: selectedIndex === index ? 500 : 200 }}
          onClick={() => handleItemClick(index)}
        >
          {item}
        </div>
      ))}
    </div>
  )
}
