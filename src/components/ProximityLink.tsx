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
  /** Effect radius in px (default 80) */
  radius?: number;
  /** Distance falloff curve */
  falloff?: "linear" | "exponential" | "gaussian";
  /** Shadow color used on hover */
  shadowColor?: string;
  /** Disable Y-axis shadow follow while keeping X-axis follow */
  disableShadowYFollow?: boolean;
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
  disableShadowYFollow: boolean;
}

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
  disableShadowYFollow,
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

  useAnimationFrame(() => {
    if (!containerRef.current) return;

    const targetHoverProgress = isHovered ? 1 : 0;
    const hoverDelta = targetHoverProgress - hoverProgressRef.current;
    if (Math.abs(hoverDelta) > 0.001) {
      const hoverLerp = hoverDelta > 0 ? 0.12 : 0.2;
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

    const shadowSoftNorm = 8;
    const shadowInnerRadius = 8;

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

      const shadowFalloff = Math.pow(falloffValue, 0.8);
      const shadowStrength = shadowFalloff * hoverProgressRef.current;
      const baseSettings = parsedSettings
        .map(({ axis, fromValue, toValue }) => {
          const interpolatedValue =
            fromValue + (toValue - fromValue) * falloffValue;
          return `'${axis}' ${interpolatedValue}`;
        })
        .join(", ");
      const shadowSettings = parsedSettings
        .map(({ axis, fromValue, toValue }) => {
          const interpolatedValue =
            fromValue + (toValue - fromValue) * falloffValue;
          if (axis !== "wght") {
            return `'${axis}' ${interpolatedValue}`;
          }

          const boostedValue = interpolatedValue + 220 * shadowStrength;
          const axisMin = Math.min(fromValue, toValue);
          const axisMax = Math.max(fromValue, toValue) + 280;
          const clampedValue = Math.min(
            Math.max(boostedValue, axisMin),
            axisMax,
          );
          return `'${axis}' ${clampedValue}`;
        })
        .join(", ");

      interpolatedSettingsRef.current[index] = baseSettings;
      baseRef.style.fontVariationSettings = baseSettings;
      shadowRef.style.fontVariationSettings = shadowSettings;

      const shadowDistance = 24 * shadowFalloff * hoverProgressRef.current;
      const innerRadiusRange = Math.max(radius - shadowInnerRadius, 1);
      const centerRamp = Math.min(
        Math.max((distance - shadowInnerRadius) / innerRadiusRange, 0),
        1,
      );
      const directionScale =
        shadowDistance /
        Math.sqrt(deltaX * deltaX + deltaY * deltaY + shadowSoftNorm ** 2);
      const targetOffsetX = deltaX * directionScale * centerRamp;
      const targetOffsetY = disableShadowYFollow
        ? 0
        : deltaY * directionScale * centerRamp;
      const previousOffset = shadowOffsetRefs.current[index] ?? { x: 0, y: 0 };
      const offsetLerp = isHovered ? 0.16 : 0.24;
      const nextOffsetX =
        previousOffset.x + (targetOffsetX - previousOffset.x) * offsetLerp;
      const nextOffsetY =
        previousOffset.y + (targetOffsetY - previousOffset.y) * offsetLerp;
      const nextOffsetMagnitude = Math.hypot(nextOffsetX, nextOffsetY);
      const shouldShowShadow =
        hoverProgressRef.current > 0.01 && nextOffsetMagnitude > 0.08;

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
  toFontVariationSettings = "'wght' 700",
  radius = 192,
  falloff = "exponential",
  shadowColor = "var(--color-magenta)",
  disableShadowYFollow = false,
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
      disableShadowYFollow={disableShadowYFollow}
    />
  );

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
