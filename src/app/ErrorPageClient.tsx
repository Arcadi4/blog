"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import type { AnimationEventHandler, CSSProperties, ReactElement } from "react"
import { cloneElement, useEffect, useState } from "react"
import { menuItems } from "@/app/posts/menuItems"
import { Menu } from "@/components/layout/Menu"

type EntranceProps = {
  children: ReactElement<{
    className?: string
    onAnimationEnd?: AnimationEventHandler<HTMLElement>
    style?: CSSProperties
  }>
  className: string
  delayMs?: number
  durationMs: number
}

/**
 * Owns the temporary CSS animation state without adding a DOM wrapper.
 * Once the entrance finishes, the original element is rendered unchanged.
 */
function Entrance({
  children,
  className,
  delayMs = 0,
  durationMs
}: EntranceProps) {
  const [hasEntered, setHasEntered] = useState(false)

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setHasEntered(true)
    }
  }, [])

  if (hasEntered) {
    return children
  }

  const {
    className: childClassName = "",
    onAnimationEnd,
    style
  } = children.props

  return cloneElement(children, {
    className:
      `${childClassName} animate-in ${className} motion-reduce:animate-none`.trim(),
    onAnimationEnd: (event) => {
      onAnimationEnd?.(event)
      if (event.target === event.currentTarget) {
        setHasEntered(true)
      }
    },
    style: {
      ...style,
      animationDelay: `${delayMs}ms`,
      animationDuration: `${durationMs}ms`,
      animationFillMode: "backwards",
      animationTimingFunction: "ease-out"
    }
  })
}

type ErrorPageClientProps = {
  code: string
  description: readonly [string, string]
  retry?: () => void
  title: readonly [string, string]
}

export function ErrorPageClient({
  code,
  description,
  retry,
  title
}: ErrorPageClientProps) {
  const pathname = usePathname()
  const digits = code.padStart(3, "0").slice(0, 3)

  return (
    <main className="relative min-h-dvh w-full overflow-hidden bg-klein text-background">
      <div className="@container relative isolate grid h-dvh w-full grid-cols-12 grid-rows-8 gap-4 overflow-hidden p-8 [--column-track:calc((100cqi-11rem)/12)] [--type-step:calc(var(--column-track)/2)]">
        <Entrance className="fade-in slide-in-from-bottom-8" durationMs={700}>
          <p
            aria-hidden="true"
            className="pointer-events-none z-0 col-span-9 col-start-4 row-span-full row-start-1 self-start font-japanese-display text-[50cqh] text-trim-cap leading-none whitespace-pre text-magenta select-none supports-[font-size:round(nearest,1px,1px)]:text-[round(nearest,50cqh,var(--type-step))]"
          >
            {"エラー\n発生"}
          </p>
        </Entrance>

        <Entrance
          className="zoom-in-95 fade-in slide-in-from-left-8"
          delayMs={150}
          durationMs={700}
        >
          <span
            aria-hidden="true"
            className="pointer-events-none z-10 col-span-2 col-start-1 row-span-3 row-start-5 self-center font-funnel-display text-[24cqi] text-trim-cap select-none supports-[font-size:round(nearest,1px,1px)]:text-[round(nearest,24cqi,var(--type-step))]"
          >
            {digits[0]}
          </span>
        </Entrance>

        <Entrance
          className="zoom-in-95 fade-in slide-in-from-top-8"
          delayMs={200}
          durationMs={700}
        >
          <span
            aria-hidden="true"
            className="pointer-events-none z-10 col-span-2 col-start-6 row-span-3 row-start-4 self-center font-funnel-display text-[24cqi] text-trim-cap select-none supports-[font-size:round(nearest,1px,1px)]:text-[round(nearest,24cqi,var(--type-step))]"
          >
            {digits[1]}
          </span>
        </Entrance>

        <Entrance
          className="zoom-in-95 fade-in slide-in-from-right-8"
          delayMs={300}
          durationMs={700}
        >
          <span
            aria-hidden="true"
            className="pointer-events-none z-10 col-span-2 col-start-11 row-span-3 row-start-3 self-center font-funnel-display text-[24cqi] text-trim-cap select-none supports-[font-size:round(nearest,1px,1px)]:text-[round(nearest,24cqi,var(--type-step))]"
          >
            {digits[2]}
          </span>
        </Entrance>

        <Entrance
          className="fade-in slide-in-from-left-4"
          delayMs={300}
          durationMs={500}
        >
          <header className="z-20 col-span-2 col-start-1 row-start-1 self-start">
            <Link
              className="font-funnel-display text-5xl leading-none font-normal transition-colors hover:text-acid focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-acid"
              href="/"
            >
              @4rcadia
            </Link>
          </header>
        </Entrance>

        <Entrance
          className="fade-in slide-in-from-left-4"
          delayMs={500}
          durationMs={500}
        >
          <p className="z-20 col-span-2 col-start-1 row-start-3 self-start font-funnel-display text-4xl leading-none xl:text-5xl">
            http {code}
          </p>
        </Entrance>

        <Entrance
          className="fade-in slide-in-from-bottom-4"
          delayMs={500}
          durationMs={500}
        >
          <h1 className="z-20 col-span-3 col-start-3 row-span-2 row-start-5 self-start font-funnel-display text-4xl text-trim-cap font-normal text-pretty xl:text-5xl">
            {title[0]}
            <br />
            {title[1]}
          </h1>
        </Entrance>

        <Entrance
          className="fade-in slide-in-from-bottom-4"
          delayMs={700}
          durationMs={500}
        >
          <p className="z-20 col-span-3 col-start-8 row-span-2 row-start-4 self-start font-funnel-display text-4xl text-pretty xl:text-5xl">
            {description[0]}
            <br />
            {description[1]}{" "}
            <span className="break-all text-background/85">{pathname}</span>
          </p>
        </Entrance>

        <nav
          aria-label="Recovery navigation"
          className="z-20 col-span-full row-span-3 row-start-6 flex flex-col items-end gap-1 self-end justify-self-end"
        >
          {retry ? (
            <Entrance
              className="fade-in slide-in-from-right-4"
              delayMs={700}
              durationMs={500}
            >
              <button
                className="w-fit cursor-pointer text-left font-funnel-display text-3xl leading-none transition-colors hover:text-acid focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-acid xl:text-5xl"
                onClick={retry}
                type="button"
              >
                Try again ←
              </button>
            </Entrance>
          ) : null}

          <Menu
            items={menuItems}
            className="flex flex-col items-end"
            delayMs={850}
            delayStepMs={70}
            prefix=""
            suffix=" ←"
            linkClassName="w-fit font-funnel-display text-3xl transition-colors hover:text-acid focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-acid xl:text-5xl"
          />
        </nav>
      </div>
    </main>
  )
}
