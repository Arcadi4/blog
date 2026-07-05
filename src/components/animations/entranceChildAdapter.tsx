"use client";

import React from "react";

export function setElementRef(
  ref: React.Ref<HTMLElement> | undefined,
  node: HTMLElement | null,
) {
  if (!ref) return;
  if (typeof ref === "function") {
    ref(node);
    return;
  }
  (ref as React.MutableRefObject<HTMLElement | null>).current = node;
}

export function normalizeChildren(
  children: React.ReactNode,
): React.ReactElement[] {
  const result: React.ReactElement[] = [];

  const process = (node: React.ReactNode): void => {
    React.Children.forEach(node, (child) => {
      if (child == null || typeof child === "boolean") {
        return;
      }

      if (React.isValidElement(child)) {
        if (child.type === React.Fragment) {
          process((child.props as { children?: React.ReactNode }).children);
        } else {
          result.push(child);
        }
      } else if (typeof child === "string" || typeof child === "number") {
        result.push(React.createElement("span", { key: result.length }, child));
      }
    });
  };

  process(children);
  return result;
}

export function calculateStaggerDelay(
  delayMs: number,
  index: number,
  step: number,
): number {
  return delayMs + index * step;
}

export function warnMultiChildClassName(
  hasClassName: boolean,
  childCount: number,
): void {
  if (process.env.NODE_ENV !== "production") {
    if (hasClassName && childCount > 1) {
      console.warn(
        "SimpleEntrance/StretchEntrance: className with multiple children is not supported. " +
          "Wrap children in an explicit container div and move className to that container.",
      );
    }
  }
}
