"use client"

import clsx from "clsx"
import { createElement, useEffect, useState } from "react"
import type {
  AnimationEvent,
  AnimationEventHandler,
  ComponentPropsWithoutRef,
  ElementType,
  JSX
} from "react"

type EntranceElement = keyof HTMLElementTagNameMap & keyof JSX.IntrinsicElements

type EntranceOwnProps<T extends EntranceElement> = {
  animationClassName: string
  as?: T
  delayMs?: number
  durationMs: number
}

export type EntranceProps<T extends EntranceElement = "div"> =
  EntranceOwnProps<T> &
    Omit<ComponentPropsWithoutRef<T>, keyof EntranceOwnProps<T>>

/**
 * Renders one semantic element with temporary entrance styles. The animation
 * state is retired after completion, so later layout changes stay immediate.
 */
export function Entrance<T extends EntranceElement = "div">({
  animationClassName,
  as,
  className,
  delayMs = 0,
  durationMs,
  onAnimationEnd,
  style,
  ...props
}: EntranceProps<T>) {
  const [hasEntered, setHasEntered] = useState(false)
  const Component: ElementType = as ?? "div"

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setHasEntered(true)
    }
  }, [])

  const forwardedAnimationEnd = onAnimationEnd as
    | AnimationEventHandler<HTMLElement>
    | undefined
  const handleAnimationEnd = (event: AnimationEvent<HTMLElement>) => {
    forwardedAnimationEnd?.(event)
    if (event.target === event.currentTarget) {
      setHasEntered(true)
    }
  }

  return createElement(Component, {
    ...props,
    className: clsx(
      className,
      !hasEntered && "animate-in motion-reduce:animate-none",
      !hasEntered && animationClassName
    ),
    onAnimationEnd: hasEntered ? forwardedAnimationEnd : handleAnimationEnd,
    style: hasEntered
      ? style
      : {
          ...style,
          animationDelay: `${delayMs}ms`,
          animationDuration: `${durationMs}ms`,
          animationFillMode: "backwards",
          animationTimingFunction: "ease-out"
        }
  })
}
