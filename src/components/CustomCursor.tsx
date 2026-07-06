"use client";

import {useEffect, useRef, useState} from "react";
import {cn} from "@/lib/utils";

const CURSOR_SIZE = 28;
const CURSOR_OFFSET = CURSOR_SIZE / 2;
const INTERACTIVE_SELECTOR = [
  "[data-cursor='interactive']",
  "a",
  "button",
  "summary",
  "[role='button']",
  "input",
  "select",
  "textarea",
  "label",
].join(", ");

type CursorPosition = {
  x: number;
  y: number;
};

function canUseCustomCursor() {
  return (
    window.matchMedia("(any-pointer: fine)").matches &&
    window.matchMedia("(any-hover: hover)").matches &&
    !window.matchMedia("(forced-colors: active)").matches
  );
}

function isInteractiveTarget(target: EventTarget | null) {
  return (
    target instanceof Element && Boolean(target.closest(INTERACTIVE_SELECTOR))
  );
}

function getCursorTransform({ x, y }: CursorPosition) {
  return `translate3d(${x - CURSOR_OFFSET}px, ${y - CURSOR_OFFSET}px, 0)`;
}

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [isInteractive, setIsInteractive] = useState(false);

  useEffect(() => {
    if (!canUseCustomCursor()) {
      return;
    }

    const handlePointerMove = (event: MouseEvent) => {
      document.body.classList.add("custom-cursor-enabled");

      if (cursorRef.current) {
        cursorRef.current.style.transform = getCursorTransform({
          x: event.clientX,
          y: event.clientY,
        });
      }

      setIsInteractive(isInteractiveTarget(event.target));
    };

    window.addEventListener("mousemove", handlePointerMove, {
      passive: true,
    });

    return () => {
      window.removeEventListener("mousemove", handlePointerMove);
      document.body.classList.remove("custom-cursor-enabled");
    };
  }, []);

  return (
    <div
      ref={cursorRef}
      aria-hidden="true"
      className={cn(
        "pointer-events-none fixed top-0 left-0 z-9999 will-change-transform",
        isInteractive ? "mix-blend-exclusion" : "mix-blend-multiply",
      )}
    >
      <div
        className={cn(
          " size-16 rounded-full transition-all duration-400 ease-in-out will-change-transform",
          isInteractive && "scale-[0.375] bg-white outline-1",
          !isInteractive && " bg-magenta",
        )}
      />
    </div>
  );
}
