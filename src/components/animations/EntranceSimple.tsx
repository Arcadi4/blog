"use client";

import React, { JSX } from "react";
import { useEntranceAnimation } from "./useEntranceAnimation";

type TextFrom = "up" | "down" | "left" | "right";
type Distance = "sm" | "md" | "lg";

const distanceClass: Record<TextFrom, Record<Distance, string>> = {
  up: { sm: "translate-y-2", md: "translate-y-4", lg: "translate-y-8" },
  down: { sm: "-translate-y-2", md: "-translate-y-4", lg: "-translate-y-8" },
  left: { sm: "translate-x-2", md: "translate-x-4", lg: "translate-x-8" },
  right: { sm: "-translate-x-2", md: "-translate-x-4", lg: "-translate-x-8" },
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
  const { entered, reduceMotion } = useEntranceAnimation({ delayMs, disabled });

  // Tailwind 的 duration-[] 是 arbitrary value，能用，但更建议写 style 确保可控
  const style: React.CSSProperties = reduceMotion
    ? {}
    : { transitionDuration: `${durationMs}ms` };

  const base =
    "will-change-transform will-change-opacity transition ease-in-out";
  const hidden = `opacity-0 ${distanceClass[from][distance]}`;
  const shown = "opacity-100 translate-x-0 translate-y-0";

  return (
    <Tag
      className={`${base} ${entered ? shown : hidden} ${className}`}
      style={style}
    >
      {children}
    </Tag>
  );
}
