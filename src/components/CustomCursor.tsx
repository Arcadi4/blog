"use client";

import { useEffect, useState } from "react";

const CURSOR_SIZE = 28;

export default function CustomCursor() {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [isInteractive, setIsInteractive] = useState(false);

  useEffect(() => {
    const hasFinePointer = window.matchMedia("(any-pointer: fine)").matches;
    const hasHover = window.matchMedia("(any-hover: hover)").matches;
    const forcedColors = window.matchMedia("(forced-colors: active)").matches;

    if (!hasFinePointer || !hasHover || forcedColors) {
      return;
    }

    const handlePointerMove = (event: MouseEvent) => {
      if (!document.body.classList.contains("custom-cursor-enabled")) {
        document.body.classList.add("custom-cursor-enabled");
      }

      setPosition({ x: event.clientX, y: event.clientY });
      const target = event.target;
      if (!(target instanceof Element)) {
        return;
      }

      const interactive = Boolean(
        target.closest(
          "[data-cursor='interactive'], a, button, summary, [role='button'], input, select, textarea, label",
        ),
      );
      setIsInteractive(interactive);
    };

    window.addEventListener("mousemove", handlePointerMove, {
      passive: true,
    });

    return () => {
      window.removeEventListener("mousemove", handlePointerMove);
      document.body.classList.remove("custom-cursor-enabled");
    };
  }, []);

  const scale = isInteractive ? 1.667 : 1;
  const color = isInteractive ? "var(--color-klein)" : "var(--color-gray-700)";

  return (
    <div
      aria-hidden="true"
      className="custom-cursor"
      style={{
        transform: `translate3d(${position.x - CURSOR_SIZE / 2}px, ${position.y - CURSOR_SIZE / 2}px, 0)`,
      }}
    >
      <div
        className="custom-cursor-dot"
        style={{
          width: CURSOR_SIZE,
          height: CURSOR_SIZE,
          transform: `scale(${scale})`,
          backgroundColor: color,
        }}
      />
    </div>
  );
}
