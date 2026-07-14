"use client";

import type {ProximityLinkProps} from "@/components/ProximityLink";
import ProximityLink from "@/components/ProximityLink";
import {EaseIn} from "@/components/animations/EaseIn";
import type {LinkItem} from "@/app/posts/menuItems";

type MenuProps = {
  readonly items: readonly LinkItem[];
  readonly className?: string;
  readonly itemClassName?: string;
  readonly linkClassName?: string;
  readonly prefix?: string;
  readonly suffix?: string;
  readonly shadowColor?: ProximityLinkProps["shadowColor"];
  readonly delayMs?: number;
  readonly delayStepMs?: number;
  readonly onSeen?: boolean;
};

export function Menu({
  items,
  className = "flex flex-col",
  itemClassName,
  linkClassName,
  prefix = "→ ",
  suffix,
  shadowColor,
  delayMs = 0,
  delayStepMs = 0,
  onSeen = false,
}: MenuProps) {
  return (
    <div className={className}>
      {items.map((item, index) => (
        <EaseIn
          key={`${item.name}-${item.href}`}
          from="right"
          delayMs={delayMs + index * delayStepMs}
          onSeen={onSeen}
        >
          {itemClassName ? (
            <div className={itemClassName}>
              {prefix}
              <ProximityLink
                href={item.href}
                label={item.name}
                shadowColor={shadowColor}
                className={linkClassName}
              />
              {suffix}
            </div>
          ) : (
            <ProximityLink
              href={item.href}
              shadowColor={shadowColor}
              className={linkClassName}
            >
              {prefix + item.name}
            </ProximityLink>
          )}
        </EaseIn>
      ))}
    </div>
  );
}
