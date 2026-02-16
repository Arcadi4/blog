"use client";

import React from "react";
import { useEnterAnimation } from "./useEnterAnimation";

type RevealFrom = "left" | "right" | "top" | "bottom";

const originClass: Record<RevealFrom, string> = {
  left: "origin-left",
  right: "origin-right",
  top: "origin-top",
  bottom: "origin-bottom",
};

type AnimatedRevealProps = {
  children: React.ReactNode;
  from?: RevealFrom;
  delayMs?: number;
  durationMs?: number;
  className?: string;
  disabled?: boolean;
  /**
   * 额外加一点透明度淡入（有时更自然）
   */
  fade?: boolean;
};

/**
 * 拉伸展开：X 方向用 scale-x，Y 方向用 scale-y
 * - from left/right => scale-x
 * - from top/bottom => scale-y
 */
export function AnimatedReveal({
  children,
  from = "left",
  delayMs = 0,
  durationMs = 600,
  className = "",
  disabled = false,
  fade = false,
}: AnimatedRevealProps) {
  const { entered, reduceMotion } = useEnterAnimation({ delayMs, disabled });

  const style: React.CSSProperties = reduceMotion
    ? {}
    : { transitionDuration: `${durationMs}ms` };

  const base = `will-change-transform transition ease-out ${originClass[from]}`;
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
