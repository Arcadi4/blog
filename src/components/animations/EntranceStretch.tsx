import React from "react";

type StretchFrom = "left" | "right" | "top" | "bottom";

const originClass: Record<StretchFrom, string> = {
  left: "origin-left",
  right: "origin-right",
  top: "origin-top",
  bottom: "origin-bottom",
};

type EntranceStretchProps = {
  children?: React.ReactNode;
  from?: StretchFrom;
  delayMs?: number;
  durationMs?: number;
  className?: string;
  disabled?: boolean;
  fade?: boolean;
};

/**
 * Stretch entrance uses scale-x for horizontal directions and scale-y for
 * vertical directions.
 */
export function StretchEntrance({
  children,
  from = "left",
  delayMs = 0,
  durationMs = 600,
  className = "",
  disabled = false,
  fade = false,
}: EntranceStretchProps) {
  /**
   * This is a performance optimization that switches stretch entrance from JS
   * state-driven transitions to CSS animation.
   * The optimization works by letting the compositor animate scale and opacity
   * timing directly, which lowers main-thread coordination.
   * Visual output stays consistent because origin direction, scale axis, and
   * fade starting opacity map one-to-one with the previous implementation.
   */
  const isHorizontal = from === "left" || from === "right";
  const scaleX = isHorizontal ? "0" : "1";
  const scaleY = isHorizontal ? "1" : "0";
  const style = disabled
    ? undefined
    : ({
        "--entrance-scale-x": scaleX,
        "--entrance-scale-y": scaleY,
        "--entrance-from-opacity": fade ? "0" : "1",
        animationDelay: `${delayMs}ms`,
        animationDuration: `${durationMs}ms`,
      } as React.CSSProperties);
  const base = disabled
    ? `${originClass[from]} scale-100 ${fade ? "opacity-100" : ""}`
    : `entrance-stretch-motion ${originClass[from]}`;

  return (
    <div className={`${base} ${className}`} style={style}>
      {children}
    </div>
  );
}
