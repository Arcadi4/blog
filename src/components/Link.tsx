import NextLink from "next/link"
import type { AnchorHTMLAttributes } from "react"
import { cn } from "@/lib/utils"
import styles from "./Link.module.css"

interface LinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  readonly direction?: "back" | "forward"
  readonly href: string
  readonly variant?: "directional" | "underline"
}

/**
 * Site link with a quiet reading default and an opt-in directional treatment
 * for previous, next, continuation, and related-destination actions.
 */
export default function Link({
  href,
  children,
  className = "",
  direction = "forward",
  variant = "underline",
  ...props
}: LinkProps) {
  const isExternal = href.startsWith("http") || href.startsWith("mailto:")
  const linkClass = cn(
    variant === "underline" && "animated-link",
    variant === "directional" && styles.directional,
    variant === "directional" && direction === "back" && styles.back,
    className
  )

  // Treat null/undefined/empty-string/empty-array children as "no children"
  const childrenEmpty =
    children === undefined ||
    children === null ||
    (typeof children === "string" && children.trim() === "") ||
    (Array.isArray(children) && children.length === 0)

  const content = childrenEmpty ? href : children
  const linkContent =
    variant === "directional" ? (
      <>
        {direction === "back" ? <DirectionTrail direction={direction} /> : null}
        <span className={styles.label}>{content}</span>
        {direction === "forward" ? (
          <DirectionTrail direction={direction} />
        ) : null}
      </>
    ) : (
      content
    )

  if (isExternal) {
    return (
      <a
        href={href}
        className={linkClass}
        target="_blank"
        rel="noopener noreferrer"
        {...props}
      >
        {linkContent}
      </a>
    )
  }

  return (
    <NextLink href={href} className={linkClass} {...props}>
      {linkContent}
    </NextLink>
  )
}

function DirectionTrail({
  direction
}: {
  readonly direction: "back" | "forward"
}) {
  const arrow = direction === "back" ? "←" : "→"

  return (
    <span aria-hidden="true" className={styles.trail}>
      {[0, 1, 2].map((index) => (
        <span className={styles.arrow} key={index}>
          {arrow}
        </span>
      ))}
    </span>
  )
}
