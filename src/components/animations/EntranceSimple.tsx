"use client";

import React from "react";
import { useEntranceAnimation } from "./useEntranceAnimation";
import {
  normalizeChildren,
  calculateStaggerDelay,
  warnMultiChildClassName,
} from "./entranceChildAdapter";

type TextFrom = "up" | "down" | "left" | "right";
type Distance = "sm" | "md" | "lg";

const distanceClass: Record<TextFrom, Record<Distance, string>> = {
  up: { sm: "translate-y-2", md: "translate-y-4", lg: "translate-y-8" },
  down: { sm: "-translate-y-2", md: "-translate-y-4", lg: "-translate-y-8" },
  left: { sm: "translate-x-2", md: "translate-x-4", lg: "translate-x-8" },
  right: { sm: "-translate-x-2", md: "-translate-x-4", lg: "-translate-x-8" },
};

/**
 * SimpleEntrance props
 *
 * Single-child mode: Merges animation classes directly onto child (no wrapper).
 * Multi-child mode: Returns Fragment with independently animated children (wrapperless).
 *
 * @property step - Per-child delay increment (ms) for stagger effect in multi-child mode
 * @property className - Applied only in single-child mode; multi-child + className emits dev warning (wrap children in explicit container div)
 */
type SimpleEntranceProps = {
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
}: {
  child: React.ReactElement;
  delayMs: number;
  durationMs: number;
  from: TextFrom;
  distance: Distance;
  disabled: boolean;
}) {
  const { entered, reduceMotion } = useEntranceAnimation({ delayMs, disabled });

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
    style: mergedStyle,
  } as React.HTMLAttributes<HTMLElement>);
}

export function SimpleEntrance({
  children,
  from = "up",
  distance = "md",
  delayMs = 0,
  durationMs = 1000,
  className = "",
  disabled = false,
  step = 0,
}: SimpleEntranceProps) {
  const normalizedChildren = normalizeChildren(children);

  const { entered, reduceMotion } = useEntranceAnimation({
    delayMs,
    disabled,
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
      style?: React.CSSProperties;
    };
    const childClassName =
      typeof childProps.className === "string" ? childProps.className : "";
    const mergedClassName =
      `${base} ${entered ? shown : hidden} ${className} ${childClassName}`.trim();
    const mergedStyle = { ...childProps.style, ...style };

    return React.cloneElement(child, {
      className: mergedClassName,
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
          />
        );
      })}
    </>
  );
}
