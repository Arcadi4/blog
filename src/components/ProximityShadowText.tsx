"use client";

import {
  MutableRefObject,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from "react";
import type { AxisRange, ProximityShadowTuning } from "./proximityLinkMath";
import type { ProximityLinkProps } from "./ProximityLink.types";
import {
  buildLayerVariationSettings,
  getFalloffValue,
  getShadowOffset,
  parseVariationSettings,
} from "./proximityLinkMath";

export interface ProximityShadowTextProps extends Required<
  Pick<
    ProximityLinkProps,
    | "fromFontVariationSettings"
    | "toFontVariationSettings"
    | "radius"
    | "falloff"
    | "shadowColor"
    | "allowShadowYFollow"
    | "reverseShadowDirection"
    | "reverseShadowNearStronger"
  >
> {
  label: string;
  containerRef: MutableRefObject<HTMLElement | null>;
  isHovered: boolean;
  shadowTuning: ProximityShadowTuning;
}

type FrameSubscriber = () => boolean;

const pointerPosition = { x: -1000, y: -1000 };
const frameSubscribers = new Set<FrameSubscriber>();

let frameId: number | null = null;
let listenersAttached = false;
let cleanupPointerListeners: (() => void) | null = null;

function setPointerPosition(x: number, y: number) {
  pointerPosition.x = x;
  pointerPosition.y = y;
}

export function setProximityShadowPointerPosition(x: number, y: number) {
  setPointerPosition(x, y);
}

function attachPointerListeners() {
  if (listenersAttached || typeof window === "undefined") {
    return;
  }

  const handleMouseMove = (event: MouseEvent) => {
    setPointerPosition(event.clientX, event.clientY);
  };

  const handleTouchMove = (event: TouchEvent) => {
    const touch = event.touches[0];
    if (!touch) {
      return;
    }
    setPointerPosition(touch.clientX, touch.clientY);
  };

  window.addEventListener("mousemove", handleMouseMove, { passive: true });
  window.addEventListener("touchmove", handleTouchMove, { passive: true });

  listenersAttached = true;
  cleanupPointerListeners = () => {
    window.removeEventListener("mousemove", handleMouseMove);
    window.removeEventListener("touchmove", handleTouchMove);
    listenersAttached = false;
    cleanupPointerListeners = null;
  };
}

function stopGlobalLoop() {
  if (frameId !== null) {
    cancelAnimationFrame(frameId);
    frameId = null;
  }

  if (frameSubscribers.size === 0) {
    cleanupPointerListeners?.();
  }
}

function runGlobalLoop() {
  for (const subscriber of Array.from(frameSubscribers)) {
    const keep = subscriber();
    if (!keep) {
      frameSubscribers.delete(subscriber);
    }
  }

  if (frameSubscribers.size === 0) {
    stopGlobalLoop();
    return;
  }

  frameId = requestAnimationFrame(runGlobalLoop);
}

function subscribeFrameLoop(subscriber: FrameSubscriber) {
  if (typeof window === "undefined") {
    return () => {};
  }

  frameSubscribers.add(subscriber);
  attachPointerListeners();

  if (frameId === null) {
    frameId = requestAnimationFrame(runGlobalLoop);
  }

  return () => {
    frameSubscribers.delete(subscriber);
    if (frameSubscribers.size === 0) {
      stopGlobalLoop();
    }
  };
}

export default function ProximityShadowText({
  label,
  containerRef,
  fromFontVariationSettings,
  toFontVariationSettings,
  radius,
  falloff,
  isHovered,
  shadowColor,
  allowShadowYFollow,
  reverseShadowDirection,
  reverseShadowNearStronger,
  shadowTuning,
}: ProximityShadowTextProps) {
  const glyphRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const baseLetterRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const shadowLetterRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const glyphCentersRef = useRef<{ x: number; y: number }[]>([]);
  const containerBoundsRef = useRef<{
    left: number;
    right: number;
    top: number;
    bottom: number;
  } | null>(null);
  const shadowOffsetRefs = useRef<{ x: number; y: number }[]>([]);
  const appliedStyleRefs = useRef<
    { base: string; shadow: string; x: number; y: number; opacity: string }[]
  >([]);
  const hoverProgressRef = useRef(0);
  const isRestedRef = useRef(true);
  const isHoveredRef = useRef(isHovered);
  const unsubscribeRef = useRef<(() => void) | null>(null);
  const lastFrameRef = useRef<{
    x: number | null;
    y: number | null;
    hoverProgress: number;
  }>({
    x: null,
    y: null,
    hoverProgress: -1,
  });

  isHoveredRef.current = isHovered;

  const parsedSettings = useMemo<AxisRange[]>(() => {
    const fromSettings = parseVariationSettings(fromFontVariationSettings);
    const toSettings = parseVariationSettings(toFontVariationSettings);

    return Array.from(fromSettings.entries()).map(([axis, fromValue]) => ({
      axis,
      fromValue,
      toValue: toSettings.get(axis) ?? fromValue,
    }));
  }, [fromFontVariationSettings, toFontVariationSettings]);
  const wghtAxisRange = useMemo(
    () => parsedSettings.find((entry) => entry.axis === "wght"),
    [parsedSettings],
  );

  const parsedSettingsRef = useRef(parsedSettings);
  const wghtAxisRangeRef = useRef(wghtAxisRange);
  const fromSettingsRef = useRef(fromFontVariationSettings);
  const falloffRef = useRef(falloff);
  const radiusRef = useRef(radius);
  const allowShadowYFollowRef = useRef(allowShadowYFollow);
  const reverseShadowDirectionRef = useRef(reverseShadowDirection);
  const reverseShadowNearStrongerRef = useRef(reverseShadowNearStronger);
  const shadowTuningRef = useRef(shadowTuning);

  parsedSettingsRef.current = parsedSettings;
  wghtAxisRangeRef.current = wghtAxisRange;
  fromSettingsRef.current = fromFontVariationSettings;
  falloffRef.current = falloff;
  radiusRef.current = radius;
  allowShadowYFollowRef.current = allowShadowYFollow;
  reverseShadowDirectionRef.current = reverseShadowDirection;
  reverseShadowNearStrongerRef.current = reverseShadowNearStronger;
  shadowTuningRef.current = shadowTuning;

  const measureGlyphCenters = useCallback(() => {
    const containerRect = containerRef.current?.getBoundingClientRect();
    containerBoundsRef.current = containerRect
      ? {
          left: containerRect.left,
          right: containerRect.right,
          top: containerRect.top,
          bottom: containerRect.bottom,
        }
      : null;

    glyphCentersRef.current = glyphRefs.current.map((glyphRef) => {
      if (!glyphRef) {
        return { x: -1000, y: -1000 };
      }

      const rect = glyphRef.getBoundingClientRect();
      return {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
      };
    });
  }, [containerRef]);

  const hasResidualOffset = useCallback(() => {
    return shadowOffsetRefs.current.some(
      (offset) => Math.abs(offset.x) > 0.01 || Math.abs(offset.y) > 0.01,
    );
  }, []);

  const stopLoop = useCallback(() => {
    unsubscribeRef.current?.();
    unsubscribeRef.current = null;
  }, []);

  const resetToRestState = useCallback(() => {
    const fromSettings = fromSettingsRef.current;

    glyphRefs.current.forEach((glyphRef, index) => {
      if (!glyphRef) {
        return;
      }

      const baseRef = baseLetterRefs.current[index];
      const shadowRef = shadowLetterRefs.current[index];
      if (!baseRef || !shadowRef) {
        return;
      }

      const applied =
        appliedStyleRefs.current[index] ??
        ({
          base: "",
          shadow: "",
          x: Number.NaN,
          y: Number.NaN,
          opacity: "",
        } as {
          base: string;
          shadow: string;
          x: number;
          y: number;
          opacity: string;
        });

      if (applied.base !== fromSettings) {
        baseRef.style.fontVariationSettings = fromSettings;
        applied.base = fromSettings;
      }

      if (applied.shadow !== fromSettings) {
        shadowRef.style.fontVariationSettings = fromSettings;
        applied.shadow = fromSettings;
      }

      if (applied.x !== 0 || applied.y !== 0) {
        shadowRef.style.transform = "translate3d(0px, 0px, 0)";
        applied.x = 0;
        applied.y = 0;
      }

      if (applied.opacity !== "0") {
        shadowRef.style.opacity = "0";
        applied.opacity = "0";
      }

      appliedStyleRefs.current[index] = applied;
      shadowOffsetRefs.current[index] = { x: 0, y: 0 };
    });

    isRestedRef.current = true;
  }, []);

  const startLoop = useCallback(() => {
    if (unsubscribeRef.current) {
      return;
    }

    unsubscribeRef.current = subscribeFrameLoop(() => {
      if (!containerRef.current) {
        return true;
      }

      const currentShadowTuning = shadowTuningRef.current;
      const targetHoverProgress = isHoveredRef.current ? 1 : 0;
      const hoverDelta = targetHoverProgress - hoverProgressRef.current;

      if (Math.abs(hoverDelta) > 0.001) {
        const hoverLerp =
          hoverDelta > 0
            ? currentShadowTuning.hoverEnterLerp
            : currentShadowTuning.hoverLeaveLerp;
        hoverProgressRef.current += hoverDelta * hoverLerp;

        if (Math.abs(targetHoverProgress - hoverProgressRef.current) < 0.01) {
          hoverProgressRef.current = targetHoverProgress;
        }
      }

      const x = pointerPosition.x;
      const y = pointerPosition.y;
      const hoverChanged =
        Math.abs(
          lastFrameRef.current.hoverProgress - hoverProgressRef.current,
        ) > 0.0001;
      const pointerChanged =
        lastFrameRef.current.x !== x || lastFrameRef.current.y !== y;
      const residualOffset = hasResidualOffset();
      const bounds = containerBoundsRef.current;
      const currentRadius = radiusRef.current;
      const nearContainer =
        !bounds ||
        (x >= bounds.left - currentRadius &&
          x <= bounds.right + currentRadius &&
          y >= bounds.top - currentRadius &&
          y <= bounds.bottom + currentRadius);
      const shouldAnimateExit =
        hoverChanged || isHoveredRef.current || residualOffset;

      if (!nearContainer && !shouldAnimateExit) {
        if (!isRestedRef.current) {
          resetToRestState();
        }

        lastFrameRef.current = {
          x,
          y,
          hoverProgress: hoverProgressRef.current,
        };

        return true;
      }

      const shouldProcess =
        pointerChanged ||
        hoverChanged ||
        isHoveredRef.current ||
        residualOffset;

      if (!shouldProcess) {
        return true;
      }

      isRestedRef.current = false;

      lastFrameRef.current = {
        x,
        y,
        hoverProgress: hoverProgressRef.current,
      };

      glyphRefs.current.forEach((glyphRef, index) => {
        const baseRef = baseLetterRefs.current[index];
        const shadowRef = shadowLetterRefs.current[index];
        if (!glyphRef || !baseRef || !shadowRef) {
          return;
        }

        const center = glyphCentersRef.current[index];
        if (!center) {
          return;
        }

        const deltaX = x - center.x;
        const deltaY = y - center.y;
        const distance = Math.hypot(deltaX, deltaY);
        const falloffValue =
          distance >= currentRadius
            ? 0
            : getFalloffValue(distance, currentRadius, falloffRef.current);
        const shadowFalloff = Math.pow(
          falloffValue,
          currentShadowTuning.falloffExponent,
        );
        const shadowStrength = shadowFalloff * hoverProgressRef.current;
        const { baseSettings, shadowSettings } = buildLayerVariationSettings({
          parsedSettings: parsedSettingsRef.current,
          wghtAxisRange: wghtAxisRangeRef.current,
          falloffValue,
          allowShadowYFollow: allowShadowYFollowRef.current,
          shadowStrength,
          shadowTuning: currentShadowTuning,
        });

        const previousOffset = shadowOffsetRefs.current[index] ?? {
          x: 0,
          y: 0,
        };
        const nextShadow = getShadowOffset({
          deltaX,
          deltaY,
          distance,
          radius: currentRadius,
          shadowStrength,
          hoverProgress: hoverProgressRef.current,
          isHovered: isHoveredRef.current,
          allowShadowYFollow: allowShadowYFollowRef.current,
          reverseDirection: reverseShadowDirectionRef.current,
          reverseNearStronger: reverseShadowNearStrongerRef.current,
          previousOffset,
          shadowTuning: currentShadowTuning,
        });

        shadowOffsetRefs.current[index] = { x: nextShadow.x, y: nextShadow.y };

        const applied =
          appliedStyleRefs.current[index] ??
          ({
            base: "",
            shadow: "",
            x: Number.NaN,
            y: Number.NaN,
            opacity: "",
          } as {
            base: string;
            shadow: string;
            x: number;
            y: number;
            opacity: string;
          });

        if (applied.base !== baseSettings) {
          baseRef.style.fontVariationSettings = baseSettings;
          applied.base = baseSettings;
        }

        if (applied.shadow !== shadowSettings) {
          shadowRef.style.fontVariationSettings = shadowSettings;
          applied.shadow = shadowSettings;
        }

        if (applied.x !== nextShadow.x || applied.y !== nextShadow.y) {
          shadowRef.style.transform = `translate3d(${nextShadow.x}px, ${nextShadow.y}px, 0)`;
          applied.x = nextShadow.x;
          applied.y = nextShadow.y;
        }

        const opacity = nextShadow.visible ? "1" : "0";
        if (applied.opacity !== opacity) {
          shadowRef.style.opacity = opacity;
          applied.opacity = opacity;
        }

        appliedStyleRefs.current[index] = applied;
      });

      return true;
    });
  }, [containerRef, hasResidualOffset, resetToRestState]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    let measureFrame: number | null = null;
    const scheduleMeasure = () => {
      if (measureFrame !== null) {
        return;
      }

      measureFrame = window.requestAnimationFrame(() => {
        measureFrame = null;
        measureGlyphCenters();
      });
    };

    scheduleMeasure();

    const resizeObserver =
      typeof ResizeObserver !== "undefined" && containerRef.current
        ? new ResizeObserver(scheduleMeasure)
        : null;

    if (resizeObserver && containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    window.addEventListener("resize", scheduleMeasure, { passive: true });
    window.addEventListener("scroll", scheduleMeasure, { passive: true });

    document.fonts?.ready.then(scheduleMeasure).catch(() => {});

    return () => {
      if (measureFrame !== null) {
        window.cancelAnimationFrame(measureFrame);
      }
      resizeObserver?.disconnect();
      window.removeEventListener("resize", scheduleMeasure);
      window.removeEventListener("scroll", scheduleMeasure);
    };
  }, [containerRef, label, measureGlyphCenters]);

  useEffect(() => {
    if (isHovered) {
      measureGlyphCenters();
    }
  }, [isHovered, measureGlyphCenters]);

  useEffect(() => {
    startLoop();

    return () => {
      stopLoop();
    };
  }, [startLoop, stopLoop]);

  useEffect(() => {
    shadowOffsetRefs.current = [];
    appliedStyleRefs.current = [];
    hoverProgressRef.current = 0;
    isRestedRef.current = true;
    lastFrameRef.current = { x: null, y: null, hoverProgress: -1 };
    measureGlyphCenters();
  }, [
    fromFontVariationSettings,
    label,
    measureGlyphCenters,
    toFontVariationSettings,
  ]);

  const words = label.split(" ");
  let letterIndex = 0;

  return (
    <span
      style={{
        display: "inline",
        fontFamily: "inherit",
      }}
    >
      {words.map((word, wordIndex) => (
        <span key={wordIndex} className="inline-block whitespace-nowrap">
          {word.split("").map((letter) => {
            const currentLetterIndex = letterIndex++;
            return (
              <span
                key={currentLetterIndex}
                ref={(el) => {
                  glyphRefs.current[currentLetterIndex] = el;
                }}
                style={{
                  display: "inline-block",
                  position: "relative",
                }}
                aria-hidden="true"
              >
                <span
                  ref={(el) => {
                    shadowLetterRefs.current[currentLetterIndex] = el;
                  }}
                  style={{
                    position: "absolute",
                    inset: 0,
                    zIndex: 0,
                    pointerEvents: "none",
                    color: shadowColor,
                    opacity: 0,
                    transform: "translate3d(0, 0, 0)",
                    fontVariationSettings: fromFontVariationSettings,
                  }}
                  aria-hidden="true"
                >
                  {letter}
                </span>
                <span
                  ref={(el) => {
                    baseLetterRefs.current[currentLetterIndex] = el;
                  }}
                  style={{
                    display: "inline-block",
                    position: "relative",
                    zIndex: 1,
                    fontVariationSettings: fromFontVariationSettings,
                  }}
                  aria-hidden="true"
                >
                  {letter}
                </span>
              </span>
            );
          })}
          {wordIndex < words.length - 1 && (
            <span className="inline-block">&nbsp;</span>
          )}
        </span>
      ))}
      <span className="sr-only">{label}</span>
    </span>
  );
}
