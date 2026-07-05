"use client";

import React, {useCallback, useRef} from "react";
import type {EntranceSeenOptions} from "./useEntranceAnimation";
import {useEntranceAnimation} from "./useEntranceAnimation";
import {calculateStaggerDelay, normalizeChildren, setElementRef, warnMultiChildClassName,} from "./entranceChildAdapter";

type TextFrom = "up" | "down" | "left" | "right" | "none";
type Distance = "sm" | "md" | "lg";

const distanceClass: Record<TextFrom, Record<Distance, string>> = {
  up: { sm: "-translate-y-2", md: "-translate-y-4", lg: "-translate-y-8" },
  down: { sm: "translate-y-2", md: "translate-y-4", lg: "translate-y-8" },
  left: { sm: "-translate-x-2", md: "-translate-x-4", lg: "-translate-x-8" },
  right: { sm: "translate-x-2", md: "translate-x-4", lg: "translate-x-8" },
  none: { sm: "translate-x-0", md: "translate-x-0", lg: "translate-x-0" },
};

/**
 * FadeIn props
 *
 * Single-child mode: Merges animation classes directly onto child (no wrapper).
 * Multi-child mode: Returns Fragment with independently animated children (wrapperless).
 *
 * @property step - Per-child delay increment (ms) for stagger effect in multi-child mode
 * @property onSeen - Waits until the child reaches minPosition before the animation delay starts
 * @property minPosition - Trigger line percentage measured up from the viewport bottom (0 = entering screen, 50 = middle, negative = before entering)
 * @property className - Applied only in single-child mode; multi-child + className emits dev warning (wrap children in explicit container div)
 */
type FadeInProps = EntranceSeenOptions & {
  children: React.ReactNode;
  from?: TextFrom;
  distance?: Distance;
  delayMs?: number;
  durationMs?: number;
  className?: string;
  disabled?: boolean;
  step?: number;
};

function AnimatedChild({
  child,
  delayMs,
  durationMs,
  from,
  distance,
  disabled,
  minPosition,
  onSeen,
}: {
  child: React.ReactElement;
  delayMs: number;
  durationMs: number;
  from: TextFrom;
  distance: Distance;
  disabled: boolean;
  minPosition: number;
  onSeen: boolean;
}) {
  const targetRef = useRef<HTMLElement | null>(null);
  const childRef = (child.props as { ref?: React.Ref<HTMLElement> }).ref;
  const ref = useCallback(
    (node: HTMLElement | null) => {
      targetRef.current = node;
      setElementRef(childRef, node);
    },
    [childRef],
  );

  const { entered, reduceMotion } = useEntranceAnimation({
    delayMs,
    disabled,
    minPosition,
    onSeen,
    targetRef,
  });

  const style: React.CSSProperties = reduceMotion
    ? {}
    : { transitionDuration: `${durationMs}ms` };

  const base =
    "will-change-transform will-change-opacity transition ease-in-out";
  const hidden = `opacity-0 ${distanceClass[from][distance]}`;
  const shown = "opacity-100 translate-x-0 translate-y-0";

  const childProps = child.props as {
    className?: string;
    style?: React.CSSProperties;
  };
  const childClassName =
    typeof childProps.className === "string" ? childProps.className : "";
  const mergedClassName =
    `${base} ${entered ? shown : hidden} ${childClassName}`.trim();
  const mergedStyle = { ...childProps.style, ...style };

  return React.cloneElement(child, {
    className: mergedClassName,
    ref: onSeen ? ref : childRef,
    style: mergedStyle,
  } as React.HTMLAttributes<HTMLElement>);
}

export function FadeIn({
  children,
  from = "up",
  distance = "md",
  delayMs = 0,
  durationMs = 1000,
  className = "",
  disabled = false,
  minPosition = 50,
  onSeen = false,
  step = 0,
}: FadeInProps) {
  const normalizedChildren = normalizeChildren(children);
  const targetRef = useRef<HTMLElement | null>(null);

  const { entered, reduceMotion } = useEntranceAnimation({
    delayMs,
    disabled,
    minPosition,
    onSeen: onSeen && normalizedChildren.length === 1,
    targetRef,
  });

  warnMultiChildClassName(!!className, normalizedChildren.length);

  if (normalizedChildren.length === 1) {
    const child = normalizedChildren[0];

    const style: React.CSSProperties = reduceMotion
      ? {}
      : { transitionDuration: `${durationMs}ms` };

    const base =
      "will-change-transform will-change-opacity transition ease-in-out";
    const hidden = `opacity-0 ${distanceClass[from][distance]}`;
    const shown = "opacity-100 translate-x-0 translate-y-0";

    const childProps = child.props as {
      className?: string;
      ref?: React.Ref<HTMLElement>;
      style?: React.CSSProperties;
    };
    const ref = (node: HTMLElement | null) => {
      targetRef.current = node;
      setElementRef(childProps.ref, node);
    };
    const childClassName =
      typeof childProps.className === "string" ? childProps.className : "";
    const mergedClassName =
      `${base} ${entered ? shown : hidden} ${className} ${childClassName}`.trim();
    const mergedStyle = { ...childProps.style, ...style };

    return React.cloneElement(child, {
      className: mergedClassName,
      ref: onSeen ? ref : childProps.ref,
      style: mergedStyle,
    } as React.HTMLAttributes<HTMLElement>);
  }

  return (
    <>
      {normalizedChildren.map((child, index) => {
        const staggeredDelay = calculateStaggerDelay(delayMs, index, step);
        return (
          <AnimatedChild
            key={child.key || index}
            child={child}
            delayMs={staggeredDelay}
            durationMs={durationMs}
            from={from}
            distance={distance}
            disabled={disabled}
            minPosition={minPosition}
            onSeen={onSeen}
          />
        );
      })}
    </>
  );
}
