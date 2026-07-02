"use client";

import { type RefObject, useEffect, useMemo, useState } from "react";

type EnterOptions = {
  delayMs?: number;
  disabled?: boolean;
  targetRef?: RefObject<HTMLElement | null>;
  minAbsY?: number;
  minScreenY?: number;
};

function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false
  );
}

/**
 * 在组件挂载后触发 enter=true（支持延迟）。
 * 用于 “mount 时播放” 的 class 切换。
 */
export function useEntranceAnimation(options: EnterOptions = {}) {
  const {
    delayMs = 0,
    disabled = false,
    minAbsY,
    minScreenY,
    targetRef,
  } = options;
  const [entered, setEntered] = useState(false);

  const reduce = useMemo(() => prefersReducedMotion(), []);

  useEffect(() => {
    if (minAbsY !== undefined && minScreenY !== undefined) {
      throw new Error("minAbsY and minScreenY cannot coexist.");
    }

    if (disabled || reduce) {
      const immediateId = window.setTimeout(() => setEntered(true), 0);
      return () => window.clearTimeout(immediateId);
    }

    let timeoutId: number | undefined;

    const enter = () => {
      timeoutId = window.setTimeout(() => setEntered(true), delayMs);
    };

    const hasEnteredThreshold = () => {
      if (minAbsY !== undefined) return window.scrollY >= minAbsY;
      if (minScreenY === undefined) return true;

      const target = targetRef?.current;
      if (!target) return false;

      const boundedY = Math.min(
        Math.max(target.getBoundingClientRect().top, 0),
        window.innerHeight,
      );

      return boundedY <= minScreenY;
    };

    const onViewportChange = () => {
      if (!hasEnteredThreshold()) return;
      window.removeEventListener("scroll", onViewportChange);
      window.removeEventListener("resize", onViewportChange);
      enter();
    };

    if (hasEnteredThreshold()) {
      enter();
      return () => {
        if (timeoutId !== undefined) window.clearTimeout(timeoutId);
      };
    }

    window.addEventListener("scroll", onViewportChange, { passive: true });
    window.addEventListener("resize", onViewportChange);

    return () => {
      window.removeEventListener("scroll", onViewportChange);
      window.removeEventListener("resize", onViewportChange);
      if (timeoutId !== undefined) window.clearTimeout(timeoutId);
    };
  }, [delayMs, disabled, minAbsY, minScreenY, reduce, targetRef]);

  return { entered, reduceMotion: reduce };
}
