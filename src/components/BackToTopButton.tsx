"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

const SHOW_AFTER_PX = 360;

export default function BackToTopButton({ className }: { className?: string }) {
  const frameRef = useRef<number | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const updateVisibility = () => {
      frameRef.current = null;
      setIsVisible(window.scrollY > SHOW_AFTER_PX);
    };

    const scheduleVisibilityUpdate = () => {
      if (frameRef.current !== null) {
        return;
      }

      frameRef.current = window.requestAnimationFrame(updateVisibility);
    };

    updateVisibility();
    window.addEventListener("scroll", scheduleVisibilityUpdate, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", scheduleVisibilityUpdate);
      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current);
      }
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="pointer-events-none absolute z-200 mx-auto grid w-dvw grid-cols-12 gap-x-4 px-8">
      <button
        type="button"
        aria-label="Back to top"
        onClick={scrollToTop}
        className={cn(
          "fixed bottom-8 col-start-11 size-14 bg-magenta text-center font-mono text-3xl font-semibold text-white transition-all hover:bg-acid hover:text-black",
          isVisible
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0",
          className,
        )}
      >
        ↑↑
      </button>
    </div>
  );
}
