"use client";

import { useEffect, useMemo, useState } from "react";

type EnterOptions = {
  delayMs?: number;
  disabled?: boolean;
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
export function useEnterAnimation(options: EnterOptions = {}) {
  const { delayMs = 0, disabled = false } = options;
  const [entered, setEntered] = useState(false);

  const reduce = useMemo(() => prefersReducedMotion(), []);

  useEffect(() => {
    if (disabled || reduce) {
      setEntered(true);
      return;
    }
    const id = window.setTimeout(() => setEntered(true), delayMs);
    return () => window.clearTimeout(id);
  }, [delayMs, disabled, reduce]);

  return { entered, reduceMotion: reduce };
}
