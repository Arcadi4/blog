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

function getElementAtCursor(position: CursorPosition | null) {
  if (!position) {
    return null;
  }

  return document.elementFromPoint(position.x, position.y);
}

function getCursorTransform({ x, y }: CursorPosition) {
  return `translate3d(${x - CURSOR_OFFSET}px, ${y - CURSOR_OFFSET}px, 0)`;
}

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const positionRef = useRef<CursorPosition | null>(null);
  const [isInteractive, setIsInteractive] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  useEffect(() => {
    if (!canUseCustomCursor()) {
      return;
    }

    const handlePointerMove = (event: MouseEvent) => {
      const position = {
        x: event.clientX,
        y: event.clientY,
      };

      positionRef.current = position;
      document.body.classList.add("custom-cursor-enabled");

      if (cursorRef.current) {
        cursorRef.current.style.transform = getCursorTransform(position);
      }

      setIsInteractive(isInteractiveTarget(event.target));
    };

    const updateInteractiveTarget = () => {
      setIsInteractive(
        isInteractiveTarget(getElementAtCursor(positionRef.current)),
      );
    };

    let holdTimer: ReturnType<typeof setTimeout> | null = null;

    const clearHold = () => {
      if (holdTimer !== null) {
        clearTimeout(holdTimer);
        holdTimer = null;
      }
      setIsPressed(false);
    };

    const handleMouseDown = (event: MouseEvent) => {
      // Only track primary button (left click)
      if (event.button !== 0) return;
      holdTimer = setTimeout(() => {
        setIsPressed(true);
        holdTimer = null;
      }, 150);
    };

    const handleMouseUp = () => {
      clearHold();
    };

    window.addEventListener("mousemove", handlePointerMove, {
      passive: true,
    });
    window.addEventListener("scroll", updateInteractiveTarget, {
      passive: true,
    });
    window.addEventListener("resize", updateInteractiveTarget, {
      passive: true,
    });
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    // Reset hold when focus is lost (tab away, alt-tab, etc.)
    window.addEventListener("blur", clearHold);
    // Reset hold when pointer leaves the document (drag outside window)
    document.addEventListener("mouseleave", clearHold);
    // Reset hold on context menu (right-click during hold)
    window.addEventListener("contextmenu", clearHold);

    return () => {
      window.removeEventListener("mousemove", handlePointerMove);
      window.removeEventListener("scroll", updateInteractiveTarget);
      window.removeEventListener("resize", updateInteractiveTarget);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("blur", clearHold);
      document.removeEventListener("mouseleave", clearHold);
      window.removeEventListener("contextmenu", clearHold);
      if (holdTimer !== null) {
        clearTimeout(holdTimer);
      }
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
          "size-16 transition-all ease-in-out will-change-transform",
          isPressed
            ? "scale-x-25 bg-klein transition-colors duration-1250"
            : "rounded-full",
          isInteractive && "scale-[0.375] bg-white outline-2 duration-400",
          !isInteractive && !isPressed && "bg-magenta",
        )}
      />
    </div>
  );
}
