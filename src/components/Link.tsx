import NextLink from "next/link";
import { AnchorHTMLAttributes } from "react";

interface LinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
    href: string;
}

/**
 * Animated link component with:
 * - Underline that reveals left-to-right with ease-in-out
 * - text-decoration-skip-ink-like effect via text-shadow
 *
 * Set CSS variable `--link-bg` on any ancestor to match the
 * background color — this enables the skip-ink effect.
 * The underline and animation work regardless.
 */
export default function Link({
    href,
    children,
    className = "",
    ...props
}: LinkProps) {
    const isExternal = href.startsWith("http") || href.startsWith("mailto:");
    const linkClass = `animated-link ${className}`;

    if (isExternal) {
        return (
            <a
                href={href}
                className={linkClass}
                target="_blank"
                rel="noopener noreferrer"
                {...props}
            >
                {children}
            </a>
        );
    }

    return (
        <NextLink href={href} className={linkClass} {...props}>
            {children}
        </NextLink>
    );
}
