import { cn } from "@/lib/utils"
import styles from "./SignalGlitch.module.css"

type SignalGlitchProps = {
  readonly children: string
  readonly className?: string
}

/**
 * Hover/focus slice glitch: two color-split copies (klein and magenta) shear
 * through horizontal clip bands over the original text, like a transmission
 * losing vertical hold. Pure CSS, steps() timing, reduced-motion safe.
 * Wrap the text inside a focusable parent (link, button) — the effect also
 * triggers when that parent is hovered or focused.
 */
export function SignalGlitch({ children, className }: SignalGlitchProps) {
  return (
    <span className={cn(styles.glitch, className)} data-text={children}>
      {children}
    </span>
  )
}
