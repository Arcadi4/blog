"use client";

import NextLink from "next/link";
import {
  AnchorHTMLAttributes,
  MutableRefObject,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type {
  AxisRange,
  FalloffMode,
  ProximityShadowTuning,
} from "./proximityLinkMath";
import {
  buildLayerVariationSettings,
  defaultShadowTuning,
  getFalloffValue,
  getShadowOffset,
  parseVariationSettings,
} from "./proximityLinkMath";

interface ProximityLinkProps extends Omit<
  AnchorHTMLAttributes<HTMLAnchorElement>,
  "children"
> {
  href: string;
  children?: string;
  label?: string;
  fromFontVariationSettings?: string;
  toFontVariationSettings?: string;
  radius?: number;
  falloff?: FalloffMode;
  shadowColor?: string;
  allowShadowYFollow?: boolean;
  reverseShadowDirection?: boolean;
  shadowTuning?: Partial<ProximityShadowTuning>;
}

interface ProximityInteractiveTextProps {
  label: string;
  containerRef: MutableRefObject<HTMLElement | null>;
  fromFontVariationSettings: string;
  toFontVariationSettings: string;
  radius: number;
  falloff: FalloffMode;
  isHovered: boolean;
  shadowColor: string;
  allowShadowYFollow: boolean;
  reverseShadowDirection: boolean;
  shadowTuning: ProximityShadowTuning;
}

type FrameSubscriber = () => boolean;

/**
 * This is a performance optimization where all ProximityLink instances share
 * one pointer listener set and one RAF loop instead of creating one per link.
 * The optimization works by merging repeated per-instance event and frame work
 * into a single global pipeline, which reduces main-thread overhead.
 * Visual output stays consistent because each instance keeps the same
 * interpolation formulas, shadow math, and pointer input stream.
 */
const pointerPosition = { x: -1000, y: -1000 };
const frameSubscribers = new Set<FrameSubscriber>();

let frameId: number | null = null;
let listenersAttached = false;

function setPointerPosition(x: number, y: number) {
  pointerPosition.x = x;
  pointerPosition.y = y;
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

let cleanupPointerListeners: (() => void) | null = null;

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

function ProximityInteractiveText({
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
  shadowTuning,
}: ProximityInteractiveTextProps) {
  const glyphRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const baseLetterRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const shadowLetterRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const glyphCentersRef = useRef<{ x: number; y: number }[]>([]);
  // This stores a lightweight proximity box for each link container.
  // The optimization works by skipping per-glyph math when the pointer is far
  // outside the effective radius of the container.
  // Visual output stays consistent because interpolation still runs unchanged
  // whenever the pointer enters the radius band or hover/exit animation is active.
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
  const shadowTuningRef = useRef(shadowTuning);

  parsedSettingsRef.current = parsedSettings;
  wghtAxisRangeRef.current = wghtAxisRange;
  fromSettingsRef.current = fromFontVariationSettings;
  falloffRef.current = falloff;
  radiusRef.current = radius;
  allowShadowYFollowRef.current = allowShadowYFollow;
  reverseShadowDirectionRef.current = reverseShadowDirection;
  shadowTuningRef.current = shadowTuning;

  /**
   * This is a performance optimization that precomputes and caches glyph center
   * positions so each frame only does numeric interpolation.
   * The optimization works by avoiding layout reads during animation frames,
   * which reduces reflow and layout pressure.
   * Visual output stays consistent because cached centers are refreshed on
   * mount, resize, font readiness, and hover entry.
   */
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

  /**
   * This is a performance optimization that snaps letters back to the exact
   * base state once the pointer is far away and no exit motion is in flight.
   * The optimization works by applying one final reset write and then avoiding
   * repeated per-frame updates while the link is fully at rest.
   * Visual output stays consistent because the reset uses the same base
   * variation settings and zero-offset shadow state as the natural end state.
   */
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

      // This is a proximity-gated fast path for pointer tracking.
      // The optimization works by short-circuiting full glyph interpolation when
      // the cursor is outside the link radius and no exit animation is needed.
      // Visual output stays consistent because active and near-range states still
      // follow the same frame-by-frame formulas as before.
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

        // This is a performance optimization that skips redundant style writes.
        // Visual output stays consistent because unchanged target values render identically.
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
    /**
     * This keeps the loop always active to match the original behavior, which
     * updates interpolation continuously even when the link is not hovered.
     * The optimization still applies because the always-on loop is shared
     * globally instead of running one loop per instance.
     * Visual output stays consistent because activation timing matches the
     * previous implementation.
     */
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

export default function ProximityLink({
  href,
  children,
  label,
  fromFontVariationSettings = "'wght' 300",
  toFontVariationSettings = "'wght' 900",
  radius = 192,
  falloff = "exponential",
  shadowColor = "var(--color-magenta)",
  allowShadowYFollow = false,
  reverseShadowDirection = false,
  shadowTuning,
  className = "",
  onMouseEnter,
  onMouseLeave,
  ...props
}: ProximityLinkProps) {
  const text = children ?? label;
  if (!text) {
    throw new Error("ProximityLink requires either children or label prop");
  }

  const containerRef = useRef<HTMLAnchorElement | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const resolvedShadowTuning = useMemo(
    () => ({ ...defaultShadowTuning, ...shadowTuning }),
    [shadowTuning],
  );
  const isExternal = href.startsWith("http") || href.startsWith("mailto:");
  const linkClass = `proximity-link ${className}`;

  const proximityContent = (
    <ProximityInteractiveText
      label={text}
      containerRef={containerRef as MutableRefObject<HTMLElement | null>}
      fromFontVariationSettings={fromFontVariationSettings}
      toFontVariationSettings={toFontVariationSettings}
      radius={radius}
      falloff={falloff}
      isHovered={isHovered}
      shadowColor={shadowColor}
      allowShadowYFollow={allowShadowYFollow}
      reverseShadowDirection={reverseShadowDirection}
      shadowTuning={resolvedShadowTuning}
    />
  );

  const handleMouseEnter: AnchorHTMLAttributes<HTMLAnchorElement>["onMouseEnter"] =
    (event) => {
      setPointerPosition(event.clientX, event.clientY);
      setIsHovered(true);
      onMouseEnter?.(event);
    };

  const handleMouseLeave: AnchorHTMLAttributes<HTMLAnchorElement>["onMouseLeave"] =
    (event) => {
      setIsHovered(false);
      onMouseLeave?.(event);
    };

  if (isExternal) {
    return (
      <a
        ref={containerRef}
        href={href}
        className={linkClass}
        target="_blank"
        rel="noopener noreferrer"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        {...props}
      >
        {proximityContent}
      </a>
    );
  }

  return (
    <NextLink
      ref={containerRef}
      href={href}
      className={linkClass}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      {proximityContent}
    </NextLink>
  );
}
