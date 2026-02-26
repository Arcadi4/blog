"use client";

import NextLink from "next/link";
import {
  AnchorHTMLAttributes,
  MutableRefObject,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

interface ProximityShadowTuning {
  /** Hover progress lerp while entering */
  hoverEnterLerp: number;
  /** Hover progress lerp while leaving */
  hoverLeaveLerp: number;
  /** Shadow-specific falloff exponent */
  falloffExponent: number;
  /** Max shadow offset in px */
  maxOffset: number;
  /** Softens direction vector near glyph center */
  directionSoftness: number;
  /** Radius where shadow offset is suppressed */
  innerDeadZone: number;
  /** Offset interpolation while entering */
  offsetEnterLerp: number;
  /** Offset interpolation while leaving */
  offsetLeaveLerp: number;
  /** Hide shadow when offset is below this value */
  visibilityThreshold: number;
  /** Weight-axis boost when Y-follow is enabled */
  wghtBoost: number;
  /** Extra max clamp for weight-axis boost */
  wghtMaxExtra: number;
  /** Width-axis boost when Y-follow is disabled */
  wdthBoost: number;
  /** Extra max clamp for width-axis boost */
  wdthMaxExtra: number;
  /** Base wdth value used when wdth axis is absent */
  wdthFallbackBase: number;
}

const defaultShadowTuning: ProximityShadowTuning = {
  hoverEnterLerp: 0.12,
  hoverLeaveLerp: 0.2,
  falloffExponent: 0.8,
  maxOffset: 24,
  directionSoftness: 8,
  innerDeadZone: 8,
  offsetEnterLerp: 0.16,
  offsetLeaveLerp: 0.24,
  visibilityThreshold: 0.08,
  wghtBoost: 220,
  wghtMaxExtra: 280,
  wdthBoost: 18,
  wdthMaxExtra: 24,
  wdthFallbackBase: 100,
};

interface ProximityLinkProps extends Omit<
  AnchorHTMLAttributes<HTMLAnchorElement>,
  "children"
> {
  href: string;
  /** Link text — can be provided as `children` (string) or `label` prop. `children` takes priority. */
  children?: string;
  /** Alternative to children. Ignored when children is provided. */
  label?: string;
  /** Variable-font variation settings when the cursor is far away */
  fromFontVariationSettings?: string;
  /** Variable-font variation settings when the cursor is closest */
  toFontVariationSettings?: string;
  /** Effect radius in px (default 192) */
  radius?: number;
  /** Distance falloff curve */
  falloff?: "linear" | "exponential" | "gaussian";
  /** Shadow color used on hover */
  shadowColor?: string;
  /** Allow Y-axis shadow follow in addition to X-axis */
  allowShadowYFollow?: boolean;
  /** Advanced tuning for shadow movement and axis boosting */
  shadowTuning?: Partial<ProximityShadowTuning>;
}

interface ProximityInteractiveTextProps {
  label: string;
  containerRef: MutableRefObject<HTMLElement | null>;
  fromFontVariationSettings: string;
  toFontVariationSettings: string;
  radius: number;
  falloff: "linear" | "exponential" | "gaussian";
  isHovered: boolean;
  shadowColor: string;
  allowShadowYFollow: boolean;
  shadowTuning: ProximityShadowTuning;
}

// Frame loop utility so motion stays in sync with cursor updates.
function useAnimationFrame(callback: () => void) {
  useEffect(() => {
    let frameId: number;
    const loop = () => {
      callback();
      frameId = requestAnimationFrame(loop);
    };
    frameId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frameId);
  }, [callback]);
}

// Tracks cursor/touch position in local coordinates of the link container.
function useMousePositionRef(
  containerRef: MutableRefObject<HTMLElement | null>,
) {
  const positionRef = useRef({ x: -1000, y: 0 });

  useEffect(() => {
    const updatePosition = (x: number, y: number) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        positionRef.current = { x: x - rect.left, y: y - rect.top };
      } else {
        positionRef.current = { x, y };
      }
    };

    const handleMouseMove = (ev: MouseEvent) =>
      updatePosition(ev.clientX, ev.clientY);
    const handleTouchMove = (ev: TouchEvent) => {
      const touch = ev.touches[0];
      updatePosition(touch.clientX, touch.clientY);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("touchmove", handleTouchMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
    };
  }, [containerRef]);

  return positionRef;
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
  shadowTuning,
}: ProximityInteractiveTextProps) {
  const glyphRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const baseLetterRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const shadowLetterRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const shadowOffsetRefs = useRef<{ x: number; y: number }[]>([]);
  const interpolatedSettingsRef = useRef<string[]>([]);
  const mousePositionRef = useMousePositionRef(containerRef);
  const hoverProgressRef = useRef(0);
  const lastFrameRef = useRef<{
    x: number | null;
    y: number | null;
    hoverProgress: number;
  }>({
    x: null,
    y: null,
    hoverProgress: -1,
  });

  // Parses axis settings once so per-frame interpolation is cheap.
  const parsedSettings = useMemo(() => {
    const parseSettings = (settingsStr: string) =>
      new Map(
        settingsStr
          .split(",")
          .map((s) => s.trim())
          .map((s) => {
            const [name, value] = s.split(" ");
            return [name.replace(/['"]/g, ""), parseFloat(value)];
          }),
      );

    const fromSettings = parseSettings(fromFontVariationSettings);
    const toSettings = parseSettings(toFontVariationSettings);

    return Array.from(fromSettings.entries()).map(([axis, fromValue]) => ({
      axis,
      fromValue,
      toValue: toSettings.get(axis) ?? fromValue,
    }));
  }, [fromFontVariationSettings, toFontVariationSettings]);

  const calculateDistance = (x1: number, y1: number, x2: number, y2: number) =>
    Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);

  const calculateFalloff = (distance: number) => {
    const norm = Math.min(Math.max(1 - distance / radius, 0), 1);
    switch (falloff) {
      case "exponential":
        return norm ** 2;
      case "gaussian":
        return Math.exp(-((distance / (radius / 2)) ** 2) / 2);
      case "linear":
      default:
        return norm;
    }
  };

  // Per-frame loop: keep interpolation responsive to cursor motion.
  useAnimationFrame(() => {
    if (!containerRef.current) return;

    // Smoothly animate hover in/out so shadow activation feels organic.
    const targetHoverProgress = isHovered ? 1 : 0;
    const hoverDelta = targetHoverProgress - hoverProgressRef.current;
    if (Math.abs(hoverDelta) > 0.001) {
      const hoverLerp =
        hoverDelta > 0
          ? shadowTuning.hoverEnterLerp
          : shadowTuning.hoverLeaveLerp;
      hoverProgressRef.current += hoverDelta * hoverLerp;
      if (Math.abs(targetHoverProgress - hoverProgressRef.current) < 0.01) {
        hoverProgressRef.current = targetHoverProgress;
      }
    }

    const { x, y } = mousePositionRef.current;
    if (
      lastFrameRef.current.x === x &&
      lastFrameRef.current.y === y &&
      lastFrameRef.current.hoverProgress === hoverProgressRef.current
    ) {
      return;
    }

    lastFrameRef.current = {
      x,
      y,
      hoverProgress: hoverProgressRef.current,
    };

    // Geometry stabilizers: reduce jitter near glyph center.
    const shadowSoftNorm = shadowTuning.directionSoftness;
    const shadowInnerRadius = shadowTuning.innerDeadZone;
    const hasWdthAxis = parsedSettings.some(({ axis }) => axis === "wdth");

    glyphRefs.current.forEach((glyphRef, index) => {
      const baseRef = baseLetterRefs.current[index];
      const shadowRef = shadowLetterRefs.current[index];
      if (!glyphRef || !baseRef || !shadowRef) return;

      const letterCenterX = glyphRef.offsetLeft + glyphRef.offsetWidth / 2;
      const letterCenterY = glyphRef.offsetTop + glyphRef.offsetHeight / 2;
      const deltaX = x - letterCenterX;
      const deltaY = y - letterCenterY;
      const distance = calculateDistance(x, y, letterCenterX, letterCenterY);
      const falloffValue = distance >= radius ? 0 : calculateFalloff(distance);

      // Shadow intensity uses a separate curve for earlier/later activation.
      const shadowFalloff = Math.pow(
        falloffValue,
        shadowTuning.falloffExponent,
      );
      const shadowStrength = shadowFalloff * hoverProgressRef.current;
      // Base layer keeps normal proximity interpolation behavior.
      const baseSettings = parsedSettings
        .map(({ axis, fromValue, toValue }) => {
          const interpolatedValue =
            fromValue + (toValue - fromValue) * falloffValue;
          return `'${axis}' ${interpolatedValue}`;
        })
        .join(", ");
      // Shadow layer can favor wdth-only or wght-only boost by mode.
      const shadowSettingsParts = parsedSettings.map(
        ({ axis, fromValue, toValue }) => {
          const interpolatedValue =
            fromValue + (toValue - fromValue) * falloffValue;

          if (!allowShadowYFollow) {
            if (axis !== "wdth") {
              return `'${axis}' ${interpolatedValue}`;
            }

            const boostedValue =
              interpolatedValue + shadowTuning.wdthBoost * shadowStrength;
            const axisMin = Math.min(fromValue, toValue);
            const axisMax =
              Math.max(fromValue, toValue) + shadowTuning.wdthMaxExtra;
            const clampedValue = Math.min(
              Math.max(boostedValue, axisMin),
              axisMax,
            );
            return `'${axis}' ${clampedValue}`;
          }

          if (axis !== "wght") {
            return `'${axis}' ${interpolatedValue}`;
          }

          const boostedValue =
            interpolatedValue + shadowTuning.wghtBoost * shadowStrength;
          const axisMin = Math.min(fromValue, toValue);
          const axisMax =
            Math.max(fromValue, toValue) + shadowTuning.wghtMaxExtra;
          const clampedValue = Math.min(
            Math.max(boostedValue, axisMin),
            axisMax,
          );
          return `'${axis}' ${clampedValue}`;
        },
      );
      // Fallback for fonts that don't expose wdth in incoming settings.
      if (!allowShadowYFollow && !hasWdthAxis) {
        shadowSettingsParts.push(
          `'wdth' ${shadowTuning.wdthFallbackBase + shadowTuning.wdthBoost * shadowStrength}`,
        );
      }
      const shadowSettings = shadowSettingsParts.join(", ");

      interpolatedSettingsRef.current[index] = baseSettings;
      baseRef.style.fontVariationSettings = baseSettings;
      shadowRef.style.fontVariationSettings = shadowSettings;

      // Cursor-directed offset creates the magnetic follow illusion.
      const shadowDistance =
        shadowTuning.maxOffset * shadowFalloff * hoverProgressRef.current;
      const innerRadiusRange = Math.max(radius - shadowInnerRadius, 1);
      const centerRamp = Math.min(
        Math.max((distance - shadowInnerRadius) / innerRadiusRange, 0),
        1,
      );
      const directionScale =
        shadowDistance /
        Math.sqrt(deltaX * deltaX + deltaY * deltaY + shadowSoftNorm ** 2);
      const targetOffsetX = deltaX * directionScale * centerRamp;
      const targetOffsetY = allowShadowYFollow
        ? deltaY * directionScale * centerRamp
        : 0;
      const previousOffset = shadowOffsetRefs.current[index] ?? { x: 0, y: 0 };
      const offsetLerp = isHovered
        ? shadowTuning.offsetEnterLerp
        : shadowTuning.offsetLeaveLerp;
      const nextOffsetX =
        previousOffset.x + (targetOffsetX - previousOffset.x) * offsetLerp;
      const nextOffsetY =
        previousOffset.y + (targetOffsetY - previousOffset.y) * offsetLerp;
      const nextOffsetMagnitude = Math.hypot(nextOffsetX, nextOffsetY);
      const shouldShowShadow =
        hoverProgressRef.current > 0.01 &&
        nextOffsetMagnitude > shadowTuning.visibilityThreshold;

      // Persist smoothed offset so exit animation can settle naturally.
      shadowOffsetRefs.current[index] = { x: nextOffsetX, y: nextOffsetY };
      shadowRef.style.transform = `translate3d(${nextOffsetX}px, ${nextOffsetY}px, 0)`;
      shadowRef.style.opacity = shouldShowShadow ? "1" : "0";
    });
  });

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
                {/* Shadow glyph mirrors the same character and receives motion/axis boosts. */}
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
                    fontVariationSettings:
                      interpolatedSettingsRef.current[currentLetterIndex] ??
                      fromFontVariationSettings,
                  }}
                  aria-hidden="true"
                >
                  {letter}
                </span>
                {/* Base glyph stays readable while shadow glyph handles motion. */}
                <span
                  ref={(el) => {
                    baseLetterRefs.current[currentLetterIndex] = el;
                  }}
                  style={{
                    display: "inline-block",
                    position: "relative",
                    fontVariationSettings:
                      interpolatedSettingsRef.current[currentLetterIndex] ??
                      fromFontVariationSettings,
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

/**
 * Link component that uses VariableProximity instead of an underline.
 * Characters near the cursor morph toward `toFontVariationSettings`,
 * giving an interactive, fluid feel without any underline decoration.
 *
 * Supports both wrapping and label syntax:
 *   <ProximityLink href="/about">About</ProximityLink>
 *   <ProximityLink href="/about" label="About" />
 *
 * Requires a variable font (default values assume Bricolage Grotesque's
 * `wght` axis). Override the `from/toFontVariationSettings` props to
 * match your font's available axes.
 */
export default function ProximityLink({
  href,
  children,
  label,
  fromFontVariationSettings = "'wght' 300",
  toFontVariationSettings = "'wght' 850",
  radius = 192,
  falloff = "exponential",
  shadowColor = "var(--color-magenta)",
  allowShadowYFollow = false,
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
  // Merge user overrides with defaults so tuning stays opt-in.
  const resolvedShadowTuning = useMemo(
    () => ({ ...defaultShadowTuning, ...shadowTuning }),
    [shadowTuning],
  );
  const isExternal = href.startsWith("http") || href.startsWith("mailto:");
  const linkClass = `proximity-link ${className}`;

  // Interactive text keeps base glyph and shadow glyph synchronized.
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
      shadowTuning={resolvedShadowTuning}
    />
  );

  // Keep native event passthrough while tracking internal hover progress.
  const handleMouseEnter: AnchorHTMLAttributes<HTMLAnchorElement>["onMouseEnter"] =
    (event) => {
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
