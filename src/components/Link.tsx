import NextLink from "next/link";
import { AnchorHTMLAttributes } from "react";

interface LinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
}

/**
 * Animated link component with:
 * - Underline that fades in on hover via text-decoration-color transition
 * - Native text-decoration-skip-ink for descender gaps
 *
 * Works on any background (solid, gradient, multi-colour) without
 * needing a colour-matching CSS variable.
 */
export default function Link({
  href,
  children,
  className = "",
  ...props
}: LinkProps) {
  const isExternal = href.startsWith("http") || href.startsWith("mailto:");
  const linkClass = `animated-link ${className}`;

  // Treat null/undefined/empty-string/empty-array children as "no children"
  const childrenEmpty =
    children === undefined ||
    children === null ||
    (typeof children === "string" && children.trim() === "") ||
    (Array.isArray(children) && children.length === 0);

  const content = childrenEmpty ? href : children;

  if (isExternal) {
    return (
      <a
        href={href}
        className={linkClass}
        target="_blank"
        rel="noopener noreferrer"
        {...props}
      >
        {content}
      </a>
    );
  }

  return (
    <NextLink href={href} className={linkClass} {...props}>
      {content}
    </NextLink>
  );
}
