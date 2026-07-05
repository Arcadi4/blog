"use client";

import React from "react";
import {useEntranceAnimation} from "./useEntranceAnimation";
import {calculateStaggerDelay, normalizeChildren, warnMultiChildClassName,} from "./entranceChildAdapter";

type Origin = "left" | "right" | "top" | "bottom" | "center";

const originClass: Record<Origin, string> = {
  left: "origin-left",
  right: "origin-right",
  top: "origin-top",
  bottom: "origin-bottom",
  center: "origin-center",
};

/**
 * ScaleIn props
 *
 * Empty-child mode: Renders host div for decorative usage (e.g., divider lines).
 * Child-present mode: Wrapperless child injection via Fragment (no implicit wrapper).
 *
 * @property step - Per-child delay increment (ms) for stagger effect in multi-child mode
 * @property className - Applied to host div in empty-child mode; multi-child + className emits dev warning (wrap children in explicit container div)
 * @property fade - Adds opacity transition alongside scale animation
 */
type ScaleInProps = {
  children?: React.ReactNode;
  from?: Origin;
  delayMs?: number;
  durationMs?: number;
  className?: string;
  disabled?: boolean;
  fade?: boolean;
  step?: number;
};

function AnimatedChild({
  child,
  delayMs,
  durationMs,
  from,
  fade,
  disabled,
}: {
  child: React.ReactElement;
  delayMs: number;
  durationMs: number;
  from: Origin;
  fade: boolean;
  disabled: boolean;
}) {
  const { entered, reduceMotion } = useEntranceAnimation({ delayMs, disabled });

  const style: React.CSSProperties = reduceMotion
    ? {}
    : { transitionDuration: `${durationMs}ms` };

  const base = `will-change-transform transition ease-in-out ${originClass[from]}`;
  const axisHidden =
    from === "center"
      ? "scale-0"
      : from === "left" || from === "right"
        ? "scale-x-0"
        : "scale-y-0";
  const axisShown =
    from === "center"
      ? "scale-100"
      : from === "left" || from === "right"
        ? "scale-x-100"
        : "scale-y-100";

  const opacityHidden = fade ? "opacity-0" : "";
  const opacityShown = fade ? "opacity-100" : "";

  const animationClasses = `${base} ${entered ? `${axisShown} ${opacityShown}` : `${axisHidden} ${opacityHidden}`}`;

  const existingClassName = (child.props as { className?: string }).className;
  const existingStyle = (child.props as { style?: React.CSSProperties }).style;

  return React.cloneElement(child, {
    className: existingClassName
      ? `${existingClassName} ${animationClasses}`
      : animationClasses,
    style: { ...existingStyle, ...style },
  } as Partial<typeof child.props>);
}

/**
 * 拉伸展开：X 方向用 scale-x，Y 方向用 scale-y
 * - from left/right => scale-x
 * - from top/bottom => scale-y
 * - from center => scale
 */
export function ScaleIn({
  children,
  from = "left",
  delayMs = 0,
  durationMs = 600,
  className = "",
  disabled = false,
  fade = false,
  step = 0,
}: ScaleInProps) {
  const normalized = children ? normalizeChildren(children) : [];
  const hasChildren = normalized.length > 0;

  const { entered, reduceMotion } = useEntranceAnimation({
    delayMs,
    disabled,
  });

  // Empty-child mode: render host element (decorative usage)
  if (!hasChildren) {
    const style: React.CSSProperties = reduceMotion
      ? {}
      : { transitionDuration: `${durationMs}ms` };

    const base = `will-change-transform transition ease-in-out ${originClass[from]}`;
    const axisHidden =
      from === "center"
        ? "scale-0"
        : from === "left" || from === "right"
          ? "scale-x-0"
          : "scale-y-0";
    const axisShown =
      from === "center"
        ? "scale-100"
        : from === "left" || from === "right"
          ? "scale-x-100"
          : "scale-y-100";

    const opacityHidden = fade ? "opacity-0" : "";
    const opacityShown = fade ? "opacity-100" : "";

    return (
      <div
        className={`${base} ${entered ? `${axisShown} ${opacityShown}` : `${axisHidden} ${opacityHidden}`} ${className}`}
        style={style}
      />
    );
  }

  // Child-present mode: wrapperless child injection
  warnMultiChildClassName(!!className, normalized.length);

  return (
    <>
      {normalized.map((child, index) => {
        const childDelay = calculateStaggerDelay(delayMs, index, step);
        return (
          <AnimatedChild
            key={child.key ?? index}
            child={child}
            delayMs={childDelay}
            durationMs={durationMs}
            from={from}
            fade={fade}
            disabled={disabled}
          />
        );
      })}
    </>
  );
}
