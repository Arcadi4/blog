"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { LinkItem, menuItems } from "@/app/posts/menuItems";
import ProximityLink from "@/components/ProximityLink";
import { SimpleEntrance } from "@/components/animations/EntranceSimple";
import { StretchEntrance } from "@/components/animations/EntranceStretch";

type ErrorPageLink = {
  name: string;
  href: string;
};

type ErrorPageProps = {
  code: number | string;
  title: string;
  codeDisplay?: string;
  familyLabel?: string;
  caption?: string;
  description?: ReactNode;
  titleLines?: string[];
  heroSymbol?: ReactNode;
  marker?: string;
  pathnameRepeats?: number;
  links?: ErrorPageLink[];
};
type CurrentDateTime = {
  currentDate: string;
  currentTime: string;
};
function getErrorFamilyLabel(code: string) {
  const firstDigit = code.match(/\d/)?.[0];
  if (!firstDigit) {
    return `error|${code}`;
  }

  return `${firstDigit}xx|${code}`;
}

export default function ErrorPage({
  code = 500,
  title = "Internal Server Error",
  codeDisplay,
  familyLabel,
  titleLines,
}: ErrorPageProps) {
  const pathname = usePathname();
  const normalizedCode = String(code);
  const resolvedCodeDisplay = codeDisplay ?? normalizedCode;
  familyLabel ?? getErrorFamilyLabel(resolvedCodeDisplay);
  titleLines ?? title.split(/\s+/).filter(Boolean);

  let menuAnimationIndex = 0;
  const delayPerMenuItem = 100;
  const baseUrl = "https://blog.arcadia.moe";

  return (
    <main className="relative overflow-hidden">
      {/* Deco grid, col only, no y padding */}
      <div className="absolute grid h-dvh w-dvw grid-cols-12 gap-x-4 px-8">
        <StretchEntrance
          from="bottom"
          className="-z-10 col-span-2 col-start-1 -ml-8 bg-acid"
        />
        <StretchEntrance
          from="top"
          className="separator z-10 col-span-1 col-start-12 border-r"
        />
      </div>

      {/* Deco grid, row only, no x padding */}
      <div className="absolute grid h-dvh w-dvw grid-rows-5 gap-y-4 py-8">
        <StretchEntrance
          from="right"
          className="separator col-start-1 row-span-1 row-start-4 border-t"
        />
        <StretchEntrance
          from="left"
          delayMs={300}
          className="col-start-1 row-start-3 h-2/3 self-end bg-magenta"
        />
      </div>

      <div className="relative grid h-dvh w-dvw grid-cols-12 grid-rows-5 gap-x-4 gap-y-4 p-8">
        {/* BG and guidelines */}
        <StretchEntrance
          from="top"
          className="h-ful -z-10 col-span-3 col-start-6 row-span-4 row-start-1 -mt-8 bg-klein"
        />

        <StretchEntrance
          from="top"
          className="separator col-span-1 col-start-9 row-span-3 row-start-1 -mt-8 -mb-4 border-r"
        />
        <StretchEntrance
          from="top"
          className="separator -z-10 col-span-1 col-start-3 row-span-3 row-start-1 -mt-8 -mb-4 border-r"
        />
        <StretchEntrance
          from="bottom"
          className="separator -z-10 col-span-1 col-start-4 row-span-full row-start-4 -mb-8 border-r"
        />
        <StretchEntrance
          from="top"
          className="separator -z-10 col-span-1 col-start-6 row-span-full row-start-1 -my-8 border-r"
        />

        <StretchEntrance
          from="right"
          className="separator col-span-full col-start-7 row-span-1 row-start-2 -mr-8 -ml-4 border-b"
        />

        {/* Menu */}
        <aside className="z-50 col-span-full col-start-10 row-start-1">
          <div className="flex flex-col">
            {menuItems.map((menuItem: LinkItem) => {
              menuAnimationIndex++;
              return (
                <SimpleEntrance
                  key={menuItem.name}
                  from="right"
                  delayMs={menuAnimationIndex * delayPerMenuItem}
                >
                  <ProximityLink
                    href={menuItem.href}
                    className="font-title text-4xl leading-none"
                  >
                    {"→ " + menuItem.name}
                  </ProximityLink>
                </SimpleEntrance>
              );
            })}
          </div>
        </aside>

        {/* Corner text */}
        <div className="col-start-1 row-start-5 self-end">ERROR_PAGE</div>
        <div className="col-start-1 row-start-1 leading-none whitespace-pre-line">
          {"https://\nblog.\narcadia\n.moe"}
        </div>

        {/* Current route / body */}
        <div className="col-span-full col-start-7 row-start-5 self-end">
          <p>You are trying to visit</p>
        </div>
        <div className="col-span-full col-start-9 row-start-5 self-end">
          {baseUrl}
          <span className="font-semibold">{pathname}</span>
        </div>
        <div className="col-span-3 col-start-5 row-start-5 leading-tight">
          Nothing found here. This page does not exist or have not been created.
          Try return to the previous page or go to home.
        </div>

        {/* Error code */}
        {Array.from({ length: 5 }, (_, index) => {
          const row = index + 1;
          const delay = 100 * index;
          const weight = 300 + 100 * index;

          return (
            <SimpleEntrance
              from="up"
              key={index}
              delayMs={delay}
              className={`z-20 col-start-3 text-2xl select-none font-[${weight}] row-start-${row} row-span-1 self-start leading-none tracking-[-0.06em] [text-box:trim-both_cap_alphabetic]`}
            >
              {resolvedCodeDisplay}
            </SimpleEntrance>
          );
        })}
        {Array.from({ length: 5 }, (_, index) => {
          const col = 5 + index * 2;
          const delay = 100 * index;
          const weight = 300 + 100 * index;

          return (
            <SimpleEntrance
              from="left"
              delayMs={delay}
              key={index}
              className={`z-20 text-2xl select-none col-start-${col} font-[${weight}] row-span-1 row-start-3 self-start leading-none tracking-[-0.06em] [text-box:trim-both_cap_alphabetic]`}
            >
              {resolvedCodeDisplay}
            </SimpleEntrance>
          );
        })}
        {/* Hero */}
        <div className="z-10 col-start-2 row-start-4 self-end font-title text-[320px] leading-[0.9] font-light tracking-[-0.06em] text-nowrap text-magenta mix-blend-difference select-none [text-box:trim-both_cap_alphabetic]">
          {title}.
        </div>
        <div className="z-10 col-start-2 row-start-4 self-end font-title text-[128px] leading-none font-normal tracking-[-0.06em] whitespace-nowrap select-none [text-box:trim-both_cap_alphabetic]">
          {title}.
        </div>
      </div>
    </main>
  );
}
