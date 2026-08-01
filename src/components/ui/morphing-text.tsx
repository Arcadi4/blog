"use client"

import { useCallback, useEffect, useId, useRef } from "react"
import type { CSSProperties } from "react"

import { cn } from "@/lib/utils"

const defaultMorphTime = 1.5
const defaultCooldownTime = 0.5
const blurFactor = 8
const maxBlur = 100

function setTextState(element: HTMLSpanElement, fraction: number) {
  const blur =
    fraction <= 0
      ? maxBlur
      : Math.min(blurFactor / fraction - blurFactor, maxBlur)

  element.style.filter = `blur(${blur}px)`
  element.style.opacity = String(fraction ** 0.4)
}

const useMorphingText = (
  texts: string[],
  morphTime: number,
  cooldownTime: number,
  loop: boolean
) => {
  const textIndexRef = useRef(0)
  const morphRef = useRef(0)
  const cooldownRef = useRef(0)
  const timeRef = useRef(new Date())

  const text1Ref = useRef<HTMLSpanElement>(null)
  const text2Ref = useRef<HTMLSpanElement>(null)

  const setStyles = useCallback(
    (fraction: number) => {
      const [current1, current2] = [text1Ref.current, text2Ref.current]
      if (!current1 || !current2) return

      setTextState(current2, fraction)

      const invertedFraction = 1 - fraction
      setTextState(current1, invertedFraction)

      current1.textContent = texts[textIndexRef.current % texts.length]
      current2.textContent = texts[(textIndexRef.current + 1) % texts.length]
    },
    [texts]
  )

  const doMorph = useCallback(() => {
    morphRef.current -= cooldownRef.current
    cooldownRef.current = 0

    let fraction = morphRef.current / morphTime

    if (fraction > 1) {
      if (loop) {
        cooldownRef.current = cooldownTime
      }
      fraction = 1
    }

    setStyles(fraction)

    if (fraction === 1 && loop) {
      textIndexRef.current++
    }

    return fraction < 1 || loop
  }, [cooldownTime, loop, morphTime, setStyles])

  const doCooldown = useCallback(() => {
    morphRef.current = 0
    const [current1, current2] = [text1Ref.current, text2Ref.current]
    if (current1 && current2) {
      current2.style.filter = "none"
      current2.style.opacity = "100%"
      current1.style.filter = "none"
      current1.style.opacity = "0%"
    }
  }, [])

  useEffect(() => {
    let animationFrameId: number

    textIndexRef.current = 0
    morphRef.current = 0
    cooldownRef.current = 0
    timeRef.current = new Date()
    setStyles(0)

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setStyles(loop ? 0 : 1)
      return
    }

    const animate = () => {
      const newTime = new Date()
      const dt = (newTime.getTime() - timeRef.current.getTime()) / 1000
      timeRef.current = newTime

      cooldownRef.current -= dt

      const continues =
        cooldownRef.current <= 0 ? doMorph() : (doCooldown(), true)

      if (continues) {
        animationFrameId = requestAnimationFrame(animate)
      }
    }

    animationFrameId = requestAnimationFrame(animate)
    return () => {
      cancelAnimationFrame(animationFrameId)
    }
  }, [doMorph, doCooldown, loop, setStyles])

  return { text1Ref, text2Ref }
}

export interface MorphingTextProps {
  className?: string
  cooldownTime?: number
  loop?: boolean
  morphTime?: number
  textBox?: CSSProperties["textBox"]
  texts: string[]
  unstyled?: boolean
}

type TextsProps = Required<
  Pick<MorphingTextProps, "cooldownTime" | "loop" | "morphTime">
> &
  Pick<MorphingTextProps, "textBox" | "texts">

const Texts: React.FC<TextsProps> = ({
  cooldownTime,
  loop,
  morphTime,
  textBox,
  texts
}) => {
  const { text1Ref, text2Ref } = useMorphingText(
    texts,
    morphTime,
    cooldownTime,
    loop
  )
  const textStyle: CSSProperties = {
    textBox,
    willChange: "filter, opacity"
  }

  return (
    <>
      <span
        className="absolute inset-x-0 top-0 m-auto inline-block w-full"
        ref={text1Ref}
        style={textStyle}
      />
      <span
        className="absolute inset-x-0 top-0 m-auto inline-block w-full"
        ref={text2Ref}
        style={textStyle}
      />
    </>
  )
}

interface SvgFiltersProps {
  filterId: string
}

const SvgFilters: React.FC<SvgFiltersProps> = ({ filterId }) => (
  <svg
    aria-hidden="true"
    className="fixed h-0 w-0"
    focusable="false"
    preserveAspectRatio="xMidYMid slice"
  >
    <defs>
      <filter height="300%" id={filterId} width="300%" x="-100%" y="-100%">
        <feColorMatrix
          in="SourceGraphic"
          type="matrix"
          values="1 0 0 0 0
                  0 1 0 0 0
                  0 0 1 0 0
                  0 0 0 255 -140"
        />
      </filter>
    </defs>
  </svg>
)

export function MorphingText({
  className,
  cooldownTime = defaultCooldownTime,
  loop = true,
  morphTime = defaultMorphTime,
  textBox,
  texts,
  unstyled = false
}: MorphingTextProps) {
  const filterId = `morphing-text-${useId().replaceAll(":", "")}`

  return (
    <div
      className={cn(
        !unstyled &&
          "relative mx-auto h-16 w-full max-w-3xl text-center font-sans text-[40pt] leading-none font-bold md:h-24 lg:text-[6rem]",
        className
      )}
      style={{ filter: `url(#${filterId}) blur(0.6px)` }}
    >
      <Texts
        cooldownTime={cooldownTime}
        loop={loop}
        morphTime={morphTime}
        textBox={textBox}
        texts={texts}
      />
      <SvgFilters filterId={filterId} />
    </div>
  )
}
