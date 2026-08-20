"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { menuItems } from "@/app/posts/menuItems"
import { Entrance } from "@/components/animations/Entrance"
import { Displacement } from "@/components/canvasui/Displacement"
import { Menu } from "@/components/layout/Menu"

type ErrorPageClientProps = {
  code: string
  description: readonly [string, string]
  retry?: () => void
  title: readonly [string, string]
}

const errorGridClassName =
  "@container relative isolate grid grid-cols-12 grid-rows-8 gap-4 overflow-visible [--column-track:calc((100cqi-11rem)/12)] [--type-step:calc(var(--column-track)/2)]"

export function ErrorPageClient({
  code,
  description,
  retry,
  title
}: ErrorPageClientProps) {
  const pathname = usePathname()
  const digits = code.padStart(3, "0").slice(0, 3)

  return (
    <main className="relative min-h-dvh w-full overflow-visible bg-klein text-background">
      <div className={`${errorGridClassName} h-dvh w-full p-8`}>
        <Displacement
          className="inset-0 z-0 p-8"
          contentClassName={`${errorGridClassName} h-full w-full`}
          contentStyle={{ overflow: "visible" }}
          style={{ position: "absolute" }}
        >
          <Entrance
            animationClassName="fade-in slide-in-from-bottom-8"
            aria-hidden="true"
            as="p"
            className="pointer-events-none z-0 col-span-9 col-start-4 row-span-full row-start-1 self-start font-japanese-display text-[50cqh] text-trim-cap leading-none whitespace-pre text-magenta select-none supports-[font-size:round(nearest,1px,1px)]:text-[round(nearest,50cqh,var(--type-step))]"
            durationMs={700}
          >
            {"エラー\n発生"}
          </Entrance>

          <Entrance
            animationClassName="zoom-in-95 fade-in slide-in-from-left-8"
            aria-hidden="true"
            as="span"
            className="pointer-events-none z-10 col-span-2 col-start-1 row-span-3 row-start-5 self-center font-funnel-display text-[24cqi] text-trim-cap select-none supports-[font-size:round(nearest,1px,1px)]:text-[round(nearest,24cqi,var(--type-step))]"
            delayMs={150}
            durationMs={700}
          >
            {digits[0]}
          </Entrance>

          <Entrance
            animationClassName="zoom-in-95 fade-in slide-in-from-top-8"
            aria-hidden="true"
            as="span"
            className="pointer-events-none z-10 col-span-2 col-start-6 row-span-3 row-start-4 self-center font-funnel-display text-[24cqi] text-trim-cap select-none supports-[font-size:round(nearest,1px,1px)]:text-[round(nearest,24cqi,var(--type-step))]"
            delayMs={200}
            durationMs={700}
          >
            {digits[1]}
          </Entrance>

          <Entrance
            animationClassName="zoom-in-95 fade-in slide-in-from-right-8"
            aria-hidden="true"
            as="span"
            className="pointer-events-none z-10 col-span-2 col-start-11 row-span-3 row-start-3 self-center font-funnel-display text-[24cqi] text-trim-cap select-none supports-[font-size:round(nearest,1px,1px)]:text-[round(nearest,24cqi,var(--type-step))]"
            delayMs={300}
            durationMs={700}
          >
            {digits[2]}
          </Entrance>

          <Entrance
            animationClassName="fade-in slide-in-from-left-4"
            as="header"
            className="z-20 col-span-2 col-start-1 row-start-1 self-start"
            delayMs={300}
            durationMs={500}
          >
            <Link
              className="font-funnel-display text-5xl leading-none font-normal transition-colors hover:text-acid focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-acid"
              href="/"
            >
              @4rcadia
            </Link>
          </Entrance>

          <Entrance
            animationClassName="fade-in slide-in-from-left-4"
            as="p"
            className="z-20 col-span-2 col-start-1 row-start-3 self-start font-funnel-display text-4xl leading-none xl:text-5xl"
            delayMs={500}
            durationMs={500}
          >
            http {code}
          </Entrance>

          <Entrance
            animationClassName="fade-in slide-in-from-bottom-4"
            as="h1"
            className="z-20 col-span-3 col-start-3 row-span-2 row-start-5 self-start font-funnel-display text-4xl text-trim-cap font-normal text-pretty xl:text-5xl"
            delayMs={500}
            durationMs={500}
          >
            {title[0]}
            <br />
            {title[1]}
          </Entrance>

          <Entrance
            animationClassName="fade-in slide-in-from-bottom-4"
            as="p"
            className="z-20 col-span-3 col-start-8 row-span-2 row-start-4 self-start font-funnel-display text-4xl text-pretty xl:text-5xl"
            delayMs={700}
            durationMs={500}
          >
            {description[0]}
            <br />
            {description[1]}{" "}
            <span className="break-all text-background/85">{pathname}</span>
          </Entrance>
        </Displacement>

        <nav
          aria-label="Recovery navigation"
          className="z-20 col-span-full row-span-3 row-start-6 flex flex-col items-end gap-1 self-end justify-self-end"
        >
          {retry ? (
            <Entrance
              animationClassName="fade-in slide-in-from-right-4"
              as="button"
              className="w-fit cursor-pointer text-left font-funnel-display text-3xl leading-none transition-colors hover:text-acid focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-acid xl:text-5xl"
              delayMs={700}
              durationMs={500}
              onClick={retry}
              type="button"
            >
              Try again ←
            </Entrance>
          ) : null}

          <Menu
            items={menuItems}
            className="flex flex-col items-end"
            delayMs={850}
            delayStepMs={70}
            prefix=""
            suffix=" ←"
            linkClassName="w-fit font-funnel-display text-3xl transition-colors hover:text-acid focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-acid xl:text-5xl"
          />
        </nav>
      </div>
    </main>
  )
}
