"use client";

import NextLink from "next/link";
import VariableProximity from "./VariableProximity";
import { AnchorHTMLAttributes, useRef } from "react";

interface ProximityLinkProps
    extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "children"> {
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
    className = "",
    ...props
}: ProximityLinkProps) {
    const text = children ?? label;
    if (!text) {
        throw new Error("ProximityLink requires either children or label prop");
    }

    const containerRef = useRef<HTMLAnchorElement | null>(null);
    const isExternal = href.startsWith("http") || href.startsWith("mailto:");
    const linkClass = `proximity-link ${className}`;

    const proximityContent = (
        <VariableProximity
            label={text}
            containerRef={containerRef as React.MutableRefObject<HTMLElement | null>}
            fromFontVariationSettings={fromFontVariationSettings}
            toFontVariationSettings={toFontVariationSettings}
            radius={radius}
            falloff={falloff}
        />
    );

    if (isExternal) {
        return (
            <a
                ref={containerRef}
                href={href}
                className={linkClass}
                target="_blank"
                rel="noopener noreferrer"
                {...props}
            >
                {proximityContent}
            </a>
        );
    }

    return (
        <NextLink ref={containerRef} href={href} className={linkClass} {...props}>
            {proximityContent}
        </NextLink>
    );
}
