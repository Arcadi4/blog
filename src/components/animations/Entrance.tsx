"use client"

import clsx from "clsx"
import { createElement, useRef, useState } from "react"
import type {
  AnimationEvent,
  AnimationEventHandler,
  ComponentPropsWithoutRef,
  ElementType,
  JSX
} from "react"
import type { EntranceSeenOptions } from "./useEntranceAnimation"
import { useEntranceAnimation } from "./useEntranceAnimation"

type EntranceElement = keyof HTMLElementTagNameMap & keyof JSX.IntrinsicElements

type EntranceOwnProps<T extends EntranceElement> = EntranceSeenOptions & {
  animationClassName: string
  as?: T
  delayMs?: number
  durationMs: number
  disabled?: boolean
}

export type EntranceProps<T extends EntranceElement = "div"> =
  EntranceOwnProps<T> &
    Omit<ComponentPropsWithoutRef<T>, keyof EntranceOwnProps<T>>

/**
 * Renders one semantic element with temporary entrance styles. The animation
 * state is retired after completion, so later layout changes stay immediate.
 *
 * @property onSeen - Waits until the element reaches minPosition before the animation delay starts
 * @property minPosition - Trigger line percentage measured up from the viewport bottom (0 = entering screen, 50 = middle, negative = before entering)
 * @property disabled - When true, bypasses the scroll trigger and starts the entrance immediately
 */
export function Entrance<T extends EntranceElement = "div">({
  animationClassName,
  as,
  className,
  delayMs = 0,
  durationMs,
  onAnimationEnd,
  style,
  disabled = false,
  minPosition = 30,
  onSeen = false,
  ...props
}: EntranceProps<T>) {
  const [hasFinished, setHasFinished] = useState(false)
  const Component: ElementType = as ?? "div"
  const targetRef = useRef<HTMLElement | null>(null)

  const { entered, reduceMotion } = useEntranceAnimation({
    delayMs: onSeen ? delayMs : 0,
    disabled,
    minPosition,
    onSeen,
    targetRef
  })

  const forwardedAnimationEnd = onAnimationEnd as
    | AnimationEventHandler<HTMLElement>
    | undefined
  const handleAnimationEnd = (event: AnimationEvent<HTMLElement>) => {
    forwardedAnimationEnd?.(event)
    if (event.target === event.currentTarget) {
      setHasFinished(true)
    }
  }

  const shouldAnimate =
    !hasFinished && !reduceMotion && (onSeen ? entered : true)
  const isHidden = onSeen && !entered && !hasFinished && !reduceMotion

  return createElement(Component, {
    ...props,
    ...(onSeen ? { ref: targetRef } : {}),
    className: clsx(
      className,
      isHidden && "opacity-0",
      shouldAnimate && "animate-in motion-reduce:animate-none",
      shouldAnimate && animationClassName
    ),
    onAnimationEnd: shouldAnimate ? handleAnimationEnd : forwardedAnimationEnd,
    style: shouldAnimate
      ? {
          ...style,
          animationDelay: `${onSeen ? 0 : delayMs}ms`,
          animationDuration: `${durationMs}ms`,
          animationFillMode: "backwards",
          animationTimingFunction: "ease-out"
        }
      : style
  })
}
