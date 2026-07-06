"use client";

import {
  memo,
  MutableRefObject,
  useEffect,
  useMemo,
  useRef,
} from "react";
import type {
  AxisRange,
  ProximityShadowTuning,
  ShadowOffsetResult,
} from "./proximityLinkMath";
import type { ProximityLinkProps } from "./ProximityLink.types";
import {
  createShadowOffsetComputer,
  createVariationSettingsCache,
  getFalloffValue,
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
  hoverRef: MutableRefObject<boolean>;
  shadowTuning: ProximityShadowTuning;
}

type FrameSubscriber = () => void;

const pointerPosition = { x: -1000, y: -1000 };
let pointerGeneration = 0;
const frameSubscribers = new Set<FrameSubscriber>();
const wakeCallbacks = new Set<() => void>();

let frameId: number | null = null;
let listenersAttached = false;
let cleanupPointerListeners: (() => void) | null = null;

function wakeAll() {
  for (const wake of wakeCallbacks) {
    wake();
  }
}

function setPointerPosition(x: number, y: number) {
  if (pointerPosition.x === x && pointerPosition.y === y) {
    return;
  }
  pointerPosition.x = x;
  pointerPosition.y = y;
  pointerGeneration++;
  wakeAll();
}

export function setProximityShadowPointerPosition(x: number, y: number) {
  setPointerPosition(x, y);
  // Hover state may change without pointer movement (element animated or
  // scrolled under a stationary cursor), so always wake sleeping loops.
  wakeAll();
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

function runGlobalLoop() {
  frameId = null;
  for (const subscriber of frameSubscribers) {
    subscriber();
  }
}

function requestFrame() {
  if (frameId === null && frameSubscribers.size > 0) {
    frameId = requestAnimationFrame(runGlobalLoop);
  }
}

function subscribeFrameLoop(subscriber: FrameSubscriber, wake: () => void) {
  if (typeof window === "undefined") {
    return () => {};
  }

  frameSubscribers.add(subscriber);
  wakeCallbacks.add(wake);
  attachPointerListeners();
  requestFrame();

  return () => {
    frameSubscribers.delete(subscriber);
    wakeCallbacks.delete(wake);
    if (frameSubscribers.size === 0) {
      if (frameId !== null) {
        cancelAnimationFrame(frameId);
        frameId = null;
      }
      pointerPosition.x = -1000;
      pointerPosition.y = -1000;
      pointerGeneration++;
      cleanupPointerListeners?.();
    }
  };
}

interface GlyphState {
  count: number;
  centers: Float64Array;
  offsets: Float64Array;
  appliedOffsets: Float64Array;
  appliedBase: string[];
  appliedShadow: string[];
  appliedVisible: Uint8Array;
}

function createGlyphState(count: number): GlyphState {
  return {
    count,
    centers: new Float64Array(count * 2),
    offsets: new Float64Array(count * 2),
    appliedOffsets: new Float64Array(count * 2),
    appliedBase: Array.from({ length: count }, () => ""),
    appliedShadow: Array.from({ length: count }, () => ""),
    appliedVisible: new Uint8Array(count),
  };
}

interface RenderedGlyph {
  letter: string;
  key: number;
}

interface RenderedWord {
  glyphs: RenderedGlyph[];
  hasTrailingSpace: boolean;
}

function splitLabel(label: string): {
  words: RenderedWord[];
  glyphCount: number;
} {
  const rawWords = label.split(" ");
  const words: RenderedWord[] = [];
  let glyphCount = 0;
  for (let i = 0; i < rawWords.length; i++) {
    const glyphs: RenderedGlyph[] = [];
    for (const letter of rawWords[i].split("")) {
      glyphs.push({ letter, key: glyphCount++ });
    }
    words.push({ glyphs, hasTrailingSpace: i < rawWords.length - 1 });
  }
  return { words, glyphCount };
}

function ProximityShadowText({
  label,
  containerRef,
  fromFontVariationSettings,
  toFontVariationSettings,
  radius,
  falloff,
  hoverRef,
  shadowColor,
  allowShadowYFollow,
  reverseShadowDirection,
  reverseShadowNearStronger,
  shadowTuning,
}: ProximityShadowTextProps) {
  const { words, glyphCount } = useMemo(() => splitLabel(label), [label]);

  const baseLetterRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const shadowLetterRefs = useRef<(HTMLSpanElement | null)[]>([]);

  const parsedSettings = useMemo<AxisRange[]>(() => {
    const fromSettings = parseVariationSettings(fromFontVariationSettings);
    const toSettings = parseVariationSettings(toFontVariationSettings);

    return Array.from(fromSettings.entries()).map(([axis, fromValue]) => ({
      axis,
      fromValue,
      toValue: toSettings.get(axis) ?? fromValue,
    }));
  }, [fromFontVariationSettings, toFontVariationSettings]);

  const settingsCache = useMemo(
    () =>
      createVariationSettingsCache(
        parsedSettings,
        parsedSettings.find((entry) => entry.axis === "wght"),
        allowShadowYFollow,
        shadowTuning,
      ),
    [parsedSettings, allowShadowYFollow, shadowTuning],
  );

  const computeShadowOffset = useMemo(
    () =>
      createShadowOffsetComputer({
        radius,
        allowShadowYFollow,
        reverseDirection: reverseShadowDirection,
        reverseNearStronger: reverseShadowNearStronger,
        shadowTuning,
      }),
    [
      radius,
      allowShadowYFollow,
      reverseShadowDirection,
      reverseShadowNearStronger,
      shadowTuning,
    ],
  );

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const state = createGlyphState(glyphCount);
    const bounds = { left: 0, right: 0, top: 0, bottom: 0, valid: false };
    const scratchOffset: ShadowOffsetResult = { x: 0, y: 0, visible: false };
    const previousOffset = { x: 0, y: 0 };
    const restBase = settingsCache.baseFor(0);

    let hoverProgress = 0;
    let wasHovered = false;
    let isRested = false;
    let hasResidualOffset = false;
    let measured = false;
    let needsMeasure = true;
    let lastPointerGeneration = -1;
    let lastHoverProgress = -1;
    let cancelled = false;
    // While asleep the rAF loop is stopped entirely; wake() restarts it on
    // pointer movement, scroll, resize, or hover changes.
    let awake = true;

    const measureGlyphCenters = () => {
      needsMeasure = false;
      const containerRect = containerRef.current?.getBoundingClientRect();
      if (containerRect) {
        bounds.left = containerRect.left;
        bounds.right = containerRect.right;
        bounds.top = containerRect.top;
        bounds.bottom = containerRect.bottom;
        bounds.valid = true;
      } else {
        bounds.valid = false;
      }

      for (let i = 0; i < state.count; i++) {
        const el = baseLetterRefs.current[i]?.parentElement;
        if (!el) {
          state.centers[i * 2] = -10000;
          state.centers[i * 2 + 1] = -10000;
          continue;
        }
        const rect = el.getBoundingClientRect();
        state.centers[i * 2] = rect.left + rect.width / 2;
        state.centers[i * 2 + 1] = rect.top + rect.height / 2;
      }

      measured = true;
      lastPointerGeneration = -1;
    };

    const resetToRestState = () => {
      for (let i = 0; i < state.count; i++) {
        const baseRef = baseLetterRefs.current[i];
        const shadowRef = shadowLetterRefs.current[i];
        if (!baseRef || !shadowRef) {
          continue;
        }

        if (state.appliedBase[i] !== restBase) {
          baseRef.style.fontVariationSettings = restBase;
          state.appliedBase[i] = restBase;
        }
        if (state.appliedShadow[i] !== restBase) {
          shadowRef.style.fontVariationSettings = restBase;
          state.appliedShadow[i] = restBase;
        }
        if (
          state.offsets[i * 2] !== 0 ||
          state.offsets[i * 2 + 1] !== 0 ||
          state.appliedOffsets[i * 2] !== 0 ||
          state.appliedOffsets[i * 2 + 1] !== 0
        ) {
          shadowRef.style.transform = "translate3d(0px, 0px, 0)";
          state.offsets[i * 2] = 0;
          state.offsets[i * 2 + 1] = 0;
          state.appliedOffsets[i * 2] = 0;
          state.appliedOffsets[i * 2 + 1] = 0;
        }
        if (state.appliedVisible[i] !== 0) {
          shadowRef.style.opacity = "0";
          state.appliedVisible[i] = 0;
        }
      }
      hasResidualOffset = false;
      isRested = true;
    };

    const processFrame = () => {
      if (!containerRef.current) {
        return;
      }

      if (needsMeasure) {
        measureGlyphCenters();
      }

      const x = pointerPosition.x;
      const y = pointerPosition.y;
      const isHovered = hoverRef.current;
      if (isHovered && !wasHovered) {
        measureGlyphCenters();
      }
      wasHovered = isHovered;

      const nearContainer =
        bounds.valid &&
        (x >= bounds.left - radius &&
          x <= bounds.right + radius &&
          y >= bounds.top - radius &&
          y <= bounds.bottom + radius);
      const insideContainer =
        bounds.valid &&
        x >= bounds.left &&
        x <= bounds.right &&
        y >= bounds.top &&
        y <= bounds.bottom;
      const isActive = isHovered || insideContainer;
      const targetHoverProgress = isActive ? 1 : 0;
      const hoverDelta = targetHoverProgress - hoverProgress;

      if (Math.abs(hoverDelta) > 0.001) {
        const hoverLerp =
          hoverDelta > 0
            ? shadowTuning.hoverEnterLerp
            : shadowTuning.hoverLeaveLerp;
        hoverProgress += hoverDelta * hoverLerp;
        if (Math.abs(targetHoverProgress - hoverProgress) < 0.01) {
          hoverProgress = targetHoverProgress;
        }
      }

      const hoverChanged = Math.abs(lastHoverProgress - hoverProgress) > 0.0001;
      const pointerChanged = lastPointerGeneration !== pointerGeneration;
      const shouldAnimate = hoverChanged || isActive || hasResidualOffset;

      if (!nearContainer && !shouldAnimate) {
        if (!isRested) {
          resetToRestState();
        }
        lastPointerGeneration = pointerGeneration;
        lastHoverProgress = hoverProgress;
        awake = false;
        return;
      }

      if (!pointerChanged && !shouldAnimate) {
        awake = false;
        return;
      }

      isRested = false;
      lastPointerGeneration = pointerGeneration;
      lastHoverProgress = hoverProgress;

      let residual = false;

      for (let i = 0; i < state.count; i++) {
        const baseRef = baseLetterRefs.current[i];
        const shadowRef = shadowLetterRefs.current[i];
        if (!baseRef || !shadowRef) {
          continue;
        }

        const deltaX = x - state.centers[i * 2];
        const deltaY = y - state.centers[i * 2 + 1];
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        const falloffValue =
          distance >= radius ? 0 : getFalloffValue(distance, radius, falloff);
        const shadowFalloff = Math.pow(
          falloffValue,
          shadowTuning.falloffExponent,
        );
        const shadowStrength = shadowFalloff * hoverProgress;

        const baseSettings = settingsCache.baseFor(falloffValue);
        const shadowSettings = settingsCache.shadowFor(
          falloffValue,
          shadowStrength,
        );

        previousOffset.x = state.offsets[i * 2];
        previousOffset.y = state.offsets[i * 2 + 1];
        computeShadowOffset(
          deltaX,
          deltaY,
          distance,
          shadowStrength,
          hoverProgress,
          isActive,
          previousOffset,
          scratchOffset,
        );

        if (state.appliedBase[i] !== baseSettings) {
          baseRef.style.fontVariationSettings = baseSettings;
          state.appliedBase[i] = baseSettings;
        }
        if (state.appliedShadow[i] !== shadowSettings) {
          shadowRef.style.fontVariationSettings = shadowSettings;
          state.appliedShadow[i] = shadowSettings;
        }

        const exactX = Math.abs(scratchOffset.x) < 0.005 ? 0 : scratchOffset.x;
        const exactY = Math.abs(scratchOffset.y) < 0.005 ? 0 : scratchOffset.y;
        state.offsets[i * 2] = exactX;
        state.offsets[i * 2 + 1] = exactY;

        // Quantize only the DOM write; the internal lerp state stays exact so
        // exit animations cannot get stranded at a rounded sub-pixel value.
        const nextX = Math.round(exactX * 100) / 100;
        const nextY = Math.round(exactY * 100) / 100;
        if (
          state.appliedOffsets[i * 2] !== nextX ||
          state.appliedOffsets[i * 2 + 1] !== nextY
        ) {
          shadowRef.style.transform = `translate3d(${nextX}px, ${nextY}px, 0)`;
          state.appliedOffsets[i * 2] = nextX;
          state.appliedOffsets[i * 2 + 1] = nextY;
        }

        const visible = scratchOffset.visible ? 1 : 0;
        if (state.appliedVisible[i] !== visible) {
          shadowRef.style.opacity = visible ? "1" : "0";
          state.appliedVisible[i] = visible;
        }

        if (exactX !== 0 || exactY !== 0) {
          residual = true;
        }
      }

      hasResidualOffset = residual;
    };

    const subscriber = () => {
      processFrame();
      if (awake) {
        requestFrame();
      }
    };

    const wake = () => {
      if (!awake) {
        awake = true;
      }
      requestFrame();
    };

    const unsubscribe = subscribeFrameLoop(subscriber, wake);

    const scheduleMeasure = () => {
      if (cancelled) {
        return;
      }
      needsMeasure = true;
      wake();
    };

    // Scrolling only translates viewport-space positions, so shifting cached
    // centers by the scroll delta replaces N getBoundingClientRect calls
    // (forced layout) per scroll frame.
    let lastScrollX = window.scrollX;
    let lastScrollY = window.scrollY;
    const handleScroll = () => {
      const dx = lastScrollX - window.scrollX;
      const dy = lastScrollY - window.scrollY;
      lastScrollX = window.scrollX;
      lastScrollY = window.scrollY;
      if (dx === 0 && dy === 0) {
        return;
      }
      if (!measured) {
        scheduleMeasure();
        return;
      }
      for (let i = 0; i < state.count; i++) {
        state.centers[i * 2] += dx;
        state.centers[i * 2 + 1] += dy;
      }
      if (bounds.valid) {
        bounds.left += dx;
        bounds.right += dx;
        bounds.top += dy;
        bounds.bottom += dy;
      }
      lastPointerGeneration = -1;
      wake();
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
    window.addEventListener("scroll", handleScroll, { passive: true });
    document.fonts?.ready.then(scheduleMeasure).catch(() => {});

    return () => {
      cancelled = true;
      unsubscribe();
      resizeObserver?.disconnect();
      window.removeEventListener("resize", scheduleMeasure);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [
    containerRef,
    hoverRef,
    label,
    glyphCount,
    radius,
    falloff,
    settingsCache,
    computeShadowOffset,
    shadowTuning,
  ]);

  return (
    <span className="proximity-shadow-text">
      {words.map((word, wordIndex) => (
        <span key={wordIndex} className="inline-block whitespace-nowrap">
          {word.glyphs.map(({ letter, key }) => (
            <span
              key={key}
              className="proximity-shadow-text__glyph"
              aria-hidden="true"
            >
              <span
                ref={(el) => {
                  shadowLetterRefs.current[key] = el;
                }}
                className="proximity-shadow-text__shadow"
                style={{
                  color: shadowColor,
                  fontVariationSettings: fromFontVariationSettings,
                }}
                aria-hidden="true"
              >
                {letter}
              </span>
              <span
                ref={(el) => {
                  baseLetterRefs.current[key] = el;
                }}
                className="proximity-shadow-text__base"
                style={{ fontVariationSettings: fromFontVariationSettings }}
                aria-hidden="true"
              >
                {letter}
              </span>
            </span>
          ))}
          {word.hasTrailingSpace && (
            <span className="inline-block">&nbsp;</span>
          )}
        </span>
      ))}
      <span className="sr-only">{label}</span>
    </span>
  );
}

export default memo(ProximityShadowText);
