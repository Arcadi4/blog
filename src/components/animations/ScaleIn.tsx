"use client";

import React, {useCallback, useRef} from "react";
import type {EntranceSeenOptions} from "./useEntranceAnimation";
import {useEntranceAnimation} from "./useEntranceAnimation";
import {
  calculateStaggerDelay,
  normalizeChildren,
  setElementRef,
  warnMultiChildClassName,
} from "./entranceChildAdapter";

type Origin =
  | "left"
  | "right"
  | "top"
  | "bottom"
  | "top-left"
  | "bottom-left"
  | "top-right"
  | "bottom-right"
  | "center"
  | "horizontal"
  | "vertical";

const originClass: Record<Origin, string> = {
  left: "origin-left",
  right: "origin-right",
  top: "origin-top",
  bottom: "origin-bottom",
  "top-left": "origin-top-left",
  "bottom-left": "origin-bottom-left",
  "top-right": "origin-top-right",
  "bottom-right": "origin-bottom-right",
  center: "origin-center",
  horizontal: "origin-center",
  vertical: "origin-center",
};

const cornerOrigins: ReadonlySet<Origin> = new Set([
  "top-left",
  "bottom-left",
  "top-right",
  "bottom-right",
]);

/**
 * ScaleIn props
 *
 * Empty-child mode: Renders host div for decorative usage (e.g., divider lines).
 * Child-present mode: Wrapperless child injection via Fragment (no implicit wrapper).
 *
 * @property step - Per-child delay increment (ms) for stagger effect in multi-child mode
 * @property className - Applied to host div in empty-child mode; multi-child + className emits dev warning (wrap children in explicit container div)
 * @property fade - Adds opacity transition alongside scale animation
 * @property onSeen - Waits until the child reaches minPosition before the animation delay starts
 * @property minPosition - Trigger line percentage measured up from the viewport bottom (0 = entering screen, 50 = middle, negative = before entering)
 */
type ScaleInProps = EntranceSeenOptions & {
  children?: React.ReactNode;
  from?: Origin;
  delayMs?: number;
  durationMs?: number;
  className?: string;
  disabled?: boolean;
  fade?: boolean;
  step?: number;
};

type ScaleClasses = {
  readonly base: string;
  readonly hidden: string;
  readonly shown: string;
};

function getScaleClasses(from: Origin, fade: boolean): ScaleClasses {
  const base = `will-change-transform transition ease-in-out ${originClass[from]}`;
  const axisHidden =
    from === "center" || cornerOrigins.has(from)
      ? "scale-0"
      : from === "left" || from === "right" || from === "horizontal"
        ? "scale-x-0"
        : "scale-y-0";
  const axisShown =
    from === "center" || cornerOrigins.has(from)
      ? "scale-100"
      : from === "left" || from === "right" || from === "horizontal"
        ? "scale-x-100"
        : "scale-y-100";

  const opacityHidden = fade ? "opacity-0" : "";
  const opacityShown = fade ? "opacity-100" : "";

  return {
    base,
    hidden: `${axisHidden} ${opacityHidden}`,
    shown: `${axisShown} ${opacityShown}`,
  };
}

function getAnimationClassName(
  from: Origin,
  fade: boolean,
  entered: boolean,
): string {
  const classes = getScaleClasses(from, fade);
  return `${classes.base} ${entered ? classes.shown : classes.hidden}`;
}

function AnimatedChild({
  child,
  delayMs,
  durationMs,
  from,
  fade,
  disabled,
  minPosition,
  onSeen,
}: {
  child: React.ReactElement;
  delayMs: number;
  durationMs: number;
  from: Origin;
  fade: boolean;
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

  const animationClasses = getAnimationClassName(from, fade, entered);

  const existingClassName = (child.props as { className?: string }).className;
  const existingStyle = (child.props as { style?: React.CSSProperties }).style;

  return React.cloneElement(child, {
    className: existingClassName
      ? `${existingClassName} ${animationClasses}`
      : animationClasses,
    ref: onSeen ? ref : childRef,
    style: { ...existingStyle, ...style },
  } as Partial<typeof child.props>);
}

/**
 * 拉伸展开：X 方向用 scale-x，Y 方向用 scale-y
 * - from left/right => scale-x
 * - from top/bottom => scale-y
 * - from center => scale
 * - from horizontal => centered scale-x
 * - from vertical => centered scale-y
 * - from top-left/bottom-right/etc. => corner-origin scale
 */
export function ScaleIn({
  children,
  from = "left",
  delayMs = 0,
  durationMs = 600,
  className = "",
  disabled = false,
  fade = false,
  minPosition = 30,
  onSeen = false,
  step = 0,
}: ScaleInProps) {
  const normalized = children ? normalizeChildren(children) : [];
  const hasChildren = normalized.length > 0;
  const rendersHost = !hasChildren || (!!className && normalized.length === 1);
  const targetRef = useRef<HTMLDivElement | null>(null);

  const { entered, reduceMotion } = useEntranceAnimation({
    delayMs,
    disabled,
    minPosition,
    onSeen: onSeen && rendersHost,
    targetRef,
  });

  if (rendersHost) {
    const style: React.CSSProperties = reduceMotion
      ? {}
      : { transitionDuration: `${durationMs}ms` };
    const animationClasses = getAnimationClassName(from, fade, entered);

    return (
      <div
        className={`${animationClasses} ${className}`.trim()}
        ref={onSeen ? targetRef : undefined}
        style={style}
      >
        {children}
      </div>
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
            minPosition={minPosition}
            onSeen={onSeen}
          />
        );
      })}
    </>
  );
}
