"use client";

import { useEffect, useState } from "react";

const CURSOR_SIZE = 28;

export default function CustomCursor() {
    const [position, setPosition] = useState({ x: -100, y: -100 });
    const [isInteractive, setIsInteractive] = useState(false);

    useEffect(() => {
        const mediaQuery = window.matchMedia("(pointer: fine)");
        if (!mediaQuery.matches) {
            return;
        }


        const handlePointerMove = (event: PointerEvent) => {
            setPosition({ x: event.clientX, y: event.clientY });
            const target = event.target;
            if (!(target instanceof Element)) {
                return;
            }

            const interactive = Boolean(
                target.closest(
                    "[data-cursor='interactive'], a, button, summary, [role='button'], input, select, textarea, label"
                )
            );
            setIsInteractive(interactive);
        };

        window.addEventListener("pointermove", handlePointerMove, { passive: true });

        return () => {
            window.removeEventListener("pointermove", handlePointerMove);
        };
    }, []);

    const scale = isInteractive ? 1.6 : 1;

    return (
        <div
            aria-hidden="true"
            className="custom-cursor hidden md:block"
            style={{
                width: CURSOR_SIZE,
                height: CURSOR_SIZE,
                transform: `translate3d(${position.x - CURSOR_SIZE / 2}px, ${position.y - CURSOR_SIZE / 2}px, 0) scale(${scale})`,
            }}
        />
    );
}
