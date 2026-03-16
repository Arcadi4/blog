"use client";

import { usePathname } from "next/navigation";
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
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const currentDate =
    year +
    "-" +
    String(month).padStart(2, "0") +
    "-" +
    String(day).padStart(2, "0");
  const currentTime = date.toLocaleTimeString();
  const normalizedCode = String(code);
  const resolvedCodeDisplay = codeDisplay ?? normalizedCode;
  const resolvedFamilyLabel =
    familyLabel ?? getErrorFamilyLabel(resolvedCodeDisplay);
  const resolvedTitleLines = titleLines ?? title.split(/\s+/).filter(Boolean);

  return (
    <main className="overflow-hidden">
      <div className="absolute w-full top-2/3 border-t-black border-t-2 z-10" />
      <div className="absolute w-full h-12 top-2/3 bg-magenta" />
      <div
        className="
        absolute bg-acid -z-10
        md:h-dvh md:border-b-0 md:w-1/3 md:min-w-96"
      />
      <div
        className="
        absolute border-b-2 border-b-black z-10
        md:h-dvh md:border-b-0 md:border-r-2 md:border-r-black md:w-1/3 md:min-w-96"
      />
      <div className="absolute inset-0 -z-50 bg-white" />
      <div className="flex flex-row h-screen w-full p-6 gap-6">
        <div className="flex-1 h-full relative">
          <div className="flex flex-col z-20 gap-1 absolute left-0 top-0">
            {Array.from({ length: pathnameRepeats }, (_, index) => (
              <p key={index} className="font-mono large-p">
                {pathname}
              </p>
            ))}
          </div>
          <div className="flex flex-col z-20 gap-1 absolute left-0 bottom-[calc(1/3*100%+.5rem)]">
            {Array.from({ length: pathnameRepeats }, (_, index) => (
              <p key={index} className="font-mono large-p">
                {pathname}
              </p>
            ))}
          </div>
          <pre className="large-p absolute left-0 bottom-0">
            {resolvedFamilyLabel}
          </pre>
        </div>
        <div className="flex-1 h-full relative">
          <div className="flex flex-col items-end absolute right-0 top-[calc(2/3*100%-6*3rem+.5rem)]">
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
          <pre className="large-p absolute left-0 bottom-0">
            {caption ?? title.toLowerCase()}
          </pre>
          <pre className="large-p absolute left-0 top-0">{description}</pre>
        </div>
        <div className="flex-1 h-full relative ">
          {heroSymbol === "*" ? (
            <div className="absolute left-0 top-0 -translate-x-1/2 -translate-y-1/6 text-[1280px] font-medium font-serif text-stroke -z-10 pointer-events-none select-none">
              *
            </div>
          ) : (
            <div className="absolute left-0 top-0 -translate-x-1/2 -translate-y-1/6 text-[960px] font-bold font-serif text-stroke-white z-20 mix-blend-difference pointer-events-none select-none">
              {heroSymbol}
            </div>
          )}
          <div className="absolute bottom-1/3">
            <h1 className="h1-hero w-fit relative">
              {resolvedCodeDisplay}
              <div className="w-full h-screen bg-klein absolute bottom-full z-30" />
            </h1>
            <h1
              className={
                "h1-hero" + (resolvedCodeDisplay === "503" ? " text-6xl" : "")
              }
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
          <pre className="large-p absolute left-0 bottom-0">{marker}</pre>
          <pre className="large-p absolute right-0 bottom-0">{marker}</pre>
          <pre className="large-p absolute right-0 top-0 text-right">
            {currentDate}
            <br />
            {currentTime}
          </pre>
        </div>
      </div>
    </main>
  );
}
