"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { menuItemsErrorPage } from "@/app/posts/menuItems";
import ProximityLink from "@/components/ProximityLink";

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

const DEFAULT_DESCRIPTION = (
  <>
    Server returned
    <br />
    an error :(
  </>
);

type CurrentDateTime = {
  currentDate: string;
  currentTime: string;
};

const EMPTY_DATE_TIME: CurrentDateTime = {
  currentDate: "",
  currentTime: "",
};

function getCurrentDateTime(): CurrentDateTime {
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  return {
    currentDate:
      year +
      "-" +
      String(month).padStart(2, "0") +
      "-" +
      String(day).padStart(2, "0"),
    currentTime: date.toLocaleTimeString(),
  };
}

function getErrorFamilyLabel(code: string) {
  const firstDigit = code.match(/\d/)?.[0];
  if (!firstDigit) {
    return `error|${code}`;
  }

  return `${firstDigit}xx|${code}`;
}

export default function ErrorPage({
  code,
  title,
  codeDisplay,
  familyLabel,
  caption,
  description = DEFAULT_DESCRIPTION,
  titleLines,
  heroSymbol = "*",
  marker = ">>>",
  pathnameRepeats = 5,
  links = menuItemsErrorPage,
}: ErrorPageProps) {
  const pathname = usePathname();
  const [{ currentDate, currentTime }, setCurrentDateTime] =
    useState(EMPTY_DATE_TIME);
  const normalizedCode = String(code);
  const resolvedCodeDisplay = codeDisplay ?? normalizedCode;
  const resolvedFamilyLabel =
    familyLabel ?? getErrorFamilyLabel(resolvedCodeDisplay);
  const resolvedTitleLines = titleLines ?? title.split(/\s+/).filter(Boolean);

  useEffect(() => {
    setCurrentDateTime(getCurrentDateTime());
  }, []);

  return (
    <main className="overflow-hidden">
      <div className="absolute top-2/3 z-10 w-full border-t-2 border-t-black" />
      <div className="bg-magenta absolute top-2/3 h-12 w-full" />
      <div className="bg-acid absolute -z-10 md:h-dvh md:w-1/3 md:min-w-96 md:border-b-0" />
      <div className="absolute z-10 border-b-2 border-b-black md:h-dvh md:w-1/3 md:min-w-96 md:border-r-2 md:border-b-0 md:border-r-black" />
      <div className="absolute inset-0 -z-50 bg-white" />
      <div className="flex h-screen w-full flex-row gap-6 p-6">
        <div className="relative h-full flex-1">
          <div className="absolute top-0 left-0 z-20 flex flex-col gap-1">
            {Array.from({ length: pathnameRepeats }, (_, index) => (
              <p key={index} className="large-p font-mono">
                {pathname}
              </p>
            ))}
          </div>
          <div className="absolute bottom-[calc(1/3*100%+.5rem)] left-0 z-20 flex flex-col gap-1">
            {Array.from({ length: pathnameRepeats }, (_, index) => (
              <p key={index} className="large-p font-mono">
                {pathname}
              </p>
            ))}
          </div>
          <pre className="large-p absolute bottom-0 left-0">
            {resolvedFamilyLabel}
          </pre>
        </div>
        <div className="relative h-full flex-1">
          <div className="absolute top-[calc(2/3*100%-6*3rem+.5rem)] right-0 flex flex-col items-end">
            {links.map((menuItem, index) => {
              return (
                <ProximityLink
                  href={menuItem.href}
                  className="large-link select-none"
                  key={index}
                >
                  {menuItem.name}
                </ProximityLink>
              );
            })}
          </div>
          <pre className="large-p absolute bottom-0 left-0">
            {caption ?? title.toLowerCase()}
          </pre>
          <pre className="large-p absolute top-0 left-0">{description}</pre>
        </div>
        <div className="relative h-full flex-1">
          {heroSymbol === "*" ? (
            <div className="text-stroke pointer-events-none absolute top-0 left-0 -z-10 -translate-x-1/2 -translate-y-1/6 font-serif text-[1280px] font-medium select-none">
              *
            </div>
          ) : (
            <div className="text-stroke-white pointer-events-none absolute top-0 left-0 z-20 -translate-x-1/2 -translate-y-1/6 font-serif text-[960px] font-bold mix-blend-difference select-none">
              {heroSymbol}
            </div>
          )}
          <div className="absolute bottom-1/3">
            <h1 className="h1-hero relative w-fit">
              {resolvedCodeDisplay}
              <div className="bg-klein absolute bottom-full z-30 h-screen w-full" />
            </h1>
            <h1
              className={`h1-hero ${resolvedCodeDisplay === "503" ? "text-6xl" : ""}`} // 503 service unavailable is too wide, so we reduce font size for it
            >
              {resolvedTitleLines.map((line, index) => {
                return (
                  <span key={`${line}-${index}`}>
                    {line}
                    {index < resolvedTitleLines.length - 1 ? <br /> : null}
                  </span>
                );
              })}
            </h1>
          </div>
          <pre className="large-p absolute bottom-0 left-0">{marker}</pre>
          <pre className="large-p absolute right-0 bottom-0">{marker}</pre>
          <pre className="large-p absolute top-0 right-0 text-right">
            {currentDate}
            <br />
            {currentTime}
          </pre>
        </div>
      </div>
    </main>
  );
}
