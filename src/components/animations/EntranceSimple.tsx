import React, { JSX } from "react";

type TextFrom = "up" | "down" | "left" | "right";
type Distance = "sm" | "md" | "lg";

const distanceOffset: Record<TextFrom, Record<Distance, [string, string]>> = {
  up: { sm: ["0px", "0.5rem"], md: ["0px", "1rem"], lg: ["0px", "2rem"] },
  down: {
    sm: ["0px", "-0.5rem"],
    md: ["0px", "-1rem"],
    lg: ["0px", "-2rem"],
  },
  left: { sm: ["0.5rem", "0px"], md: ["1rem", "0px"], lg: ["2rem", "0px"] },
  right: {
    sm: ["-0.5rem", "0px"],
    md: ["-1rem", "0px"],
    lg: ["-2rem", "0px"],
  },
};

type SimpleEntranceProps = {
  as?: keyof JSX.IntrinsicElements;
  children: React.ReactNode;
  from?: TextFrom;
  distance?: Distance;
  delayMs?: number;
  durationMs?: number;
  className?: string;
  disabled?: boolean;
};

export function SimpleEntrance({
  as: Tag = "div",
  children,
  from = "up",
  distance = "md",
  delayMs = 0,
  durationMs = 1000,
  className = "",
  disabled = false,
}: SimpleEntranceProps) {
  /**
   * This is a performance optimization that replaces per-instance JS entrance
   * timers with pure CSS keyframe animation.
   * The optimization works by passing delay and duration through styles so the
   * browser animation pipeline handles timing with less JS scheduling.
   * Visual output stays consistent because from, distance, delay, and duration
   * keep the same semantics, and disabled still resolves directly to the end state.
   */
  const [x, y] = distanceOffset[from][distance];
  const style = disabled
    ? undefined
    : ({
        "--entrance-x": x,
        "--entrance-y": y,
        animationDelay: `${delayMs}ms`,
        animationDuration: `${durationMs}ms`,
      } as React.CSSProperties);
  const baseClass = disabled
    ? "opacity-100 translate-x-0 translate-y-0"
    : "entrance-simple-motion";

  return (
    <Tag className={`${baseClass} ${className}`} style={style}>
      {children}
    </Tag>
  );
}
