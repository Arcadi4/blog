"use client";

import NextLink from "next/link";
import { MutableRefObject, useMemo, useRef, useState } from "react";
import ProximityShadowText, {
  setProximityShadowPointerPosition,
} from "./ProximityShadowText";
import { defaultShadowTuning } from "./proximityLinkMath";
import type { FalloffMode } from "./proximityLinkMath";
import type { ProximityLinkProps } from "./ProximityLink.types";

export type { ProximityLinkProps } from "./ProximityLink.types";

const DEFAULT_PROXIMITY_LINK_PROPS = {
  fromFontVariationSettings: "'wght' 300",
  toFontVariationSettings: "'wght' 900",
  radius: 256,
  falloff: "exponential" as FalloffMode,
  shadowColor: "var(--color-magenta)",
  allowShadowYFollow: false,
  reverseShadowDirection: true,
  reverseShadowNearStronger: true,
};

export default function ProximityLink({
  href,
  children,
  label,
  fromFontVariationSettings = DEFAULT_PROXIMITY_LINK_PROPS.fromFontVariationSettings,
  toFontVariationSettings = DEFAULT_PROXIMITY_LINK_PROPS.toFontVariationSettings,
  radius = DEFAULT_PROXIMITY_LINK_PROPS.radius,
  falloff = DEFAULT_PROXIMITY_LINK_PROPS.falloff,
  shadowColor = DEFAULT_PROXIMITY_LINK_PROPS.shadowColor,
  allowShadowYFollow = DEFAULT_PROXIMITY_LINK_PROPS.allowShadowYFollow,
  reverseShadowDirection = DEFAULT_PROXIMITY_LINK_PROPS.reverseShadowDirection,
  reverseShadowNearStronger = DEFAULT_PROXIMITY_LINK_PROPS.reverseShadowNearStronger,
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
    <ProximityShadowText
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
      reverseShadowNearStronger={reverseShadowNearStronger}
      shadowTuning={resolvedShadowTuning}
    />
  );

  const handleMouseEnter: ProximityLinkProps["onMouseEnter"] = (event) => {
    setProximityShadowPointerPosition(event.clientX, event.clientY);
    setIsHovered(true);
    onMouseEnter?.(event);
  };

  const handleMouseLeave: ProximityLinkProps["onMouseLeave"] = (event) => {
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
