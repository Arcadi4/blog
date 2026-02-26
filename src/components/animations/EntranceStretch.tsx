"use client";

import React from "react";
import { useEntranceAnimation } from "./useEntranceAnimation";

type StretchFrom = "left" | "right" | "top" | "bottom";

const originClass: Record<StretchFrom, string> = {
  left: "origin-left",
  right: "origin-right",
  top: "origin-top",
  bottom: "origin-bottom",
};

type EntranceStretchProps = {
  children?: React.ReactNode; // optional
  from?: StretchFrom;
  delayMs?: number;
  durationMs?: number;
  className?: string;
  disabled?: boolean;
  fade?: boolean; //额外加一点透明度淡入（有时更自然）
};

/**
 * 拉伸展开：X 方向用 scale-x，Y 方向用 scale-y
 * - from left/right => scale-x
 * - from top/bottom => scale-y
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
  // Call hook unconditionally to satisfy Rules of Hooks
  const { entered, reduceMotion } = useEntranceAnimation({ delayMs, disabled });

  const style: React.CSSProperties = reduceMotion
    ? {}
    : { transitionDuration: `${durationMs}ms` };

  const base = `will-change-transform transition ease-in-out ${originClass[from]}`;
  const axisHidden =
    from === "left" || from === "right" ? "scale-x-0" : "scale-y-0";
  const axisShown =
    from === "left" || from === "right" ? "scale-x-100" : "scale-y-100";

  const opacityHidden = fade ? "opacity-0" : "";
  const opacityShown = fade ? "opacity-100" : "";

  return (
    <div
      className={`${base} ${entered ? `${axisShown} ${opacityShown}` : `${axisHidden} ${opacityHidden}`} ${className}`}
      style={style}
    >
      {children}
    </div>
  );
}
