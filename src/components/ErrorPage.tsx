"use client"

import { usePathname } from "next/navigation"
import type { ReactNode } from "react"
import { menuItems } from "@/app/posts/menuItems"
import { EaseIn } from "@/components/animations/EaseIn"
import { ScaleIn } from "@/components/animations/ScaleIn"
import { Menu } from "@/components/Menu"

type ErrorPageLink = {
  name: string
  href: string
}

type ErrorPageProps = {
  code: number | string
  title: string
  codeDisplay?: string
  familyLabel?: string
  caption?: string
  description?: ReactNode
  titleLines?: string[]
  heroSymbol?: ReactNode
  marker?: string
  pathnameRepeats?: number
  links?: ErrorPageLink[]
}

export default function ErrorPage({
  code,
  title,
  codeDisplay
}: ErrorPageProps) {
  const pathname = usePathname()
  const normalizedCode = String(code)
  const resolvedCodeDisplay = codeDisplay ?? normalizedCode

  const delayPerMenuItem = 100
  const baseUrl = "https://blog.arcadia.moe"

  return (
    <main className="relative overflow-hidden">
      {/* Deco grid, col only, no y padding */}
      <div className="absolute grid h-dvh w-dvw grid-cols-12 gap-x-4 px-8">
        <ScaleIn
          from="bottom"
          className="-z-10 col-span-2 col-start-1 -ml-8 bg-acid"
        />
        <ScaleIn
          from="top"
          className="separator z-10 col-span-1 col-start-12 border-r"
        />
      </div>

      {/* Deco grid, row only, no x padding */}
      <div className="absolute grid h-dvh w-dvw grid-rows-5 gap-y-4 py-8">
        <ScaleIn
          from="right"
          className="separator col-start-1 row-span-1 row-start-4 border-t"
        />
        <ScaleIn
          from="left"
          delayMs={300}
          className="col-start-1 row-start-3 h-2/3 self-end bg-magenta"
        />
      </div>

      <div className="relative grid h-dvh w-dvw grid-cols-12 grid-rows-5 gap-x-4 gap-y-4 p-8">
        {/* BG and guidelines */}
        <ScaleIn
          from="top"
          className="h-ful -z-10 col-span-3 col-start-6 row-span-4 row-start-1 -mt-8 bg-klein"
        />

        <ScaleIn
          from="top"
          className="separator col-span-1 col-start-9 row-span-3 row-start-1 -mt-8 -mb-4 border-r"
        />
        <ScaleIn
          from="top"
          className="separator -z-10 col-span-1 col-start-3 row-span-3 row-start-1 -mt-8 -mb-4 border-r"
        />
        <ScaleIn
          from="bottom"
          className="separator -z-10 col-span-1 col-start-4 row-span-full row-start-4 -mb-8 border-r"
        />
        <ScaleIn
          from="top"
          className="separator -z-10 col-span-1 col-start-6 row-span-full row-start-1 -my-8 border-r"
        />

        <ScaleIn
          from="right"
          className="separator col-span-full col-start-7 row-span-1 row-start-2 -mr-8 -ml-4 border-b"
        />

        {/* Menu */}
        <aside className="z-50 col-span-full col-start-10 row-start-1">
          <Menu
            items={menuItems}
            linkClassName="font-title text-4xl leading-none"
            delayMs={delayPerMenuItem}
            delayStepMs={delayPerMenuItem}
          />
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
          Nothing found here. The site is still under construction. This page
          might have not been created yet.
        </div>

        {/* Error code */}
        {Array.from({ length: 5 }, (_, index) => {
          const row = index + 1
          const delay = 100 * index
          const weight = 300 + 100 * index

          return (
            <EaseIn
              from="up"
              key={index}
              delayMs={delay}
              className={`z-20 col-start-3 text-2xl select-none font-[${weight}] row-start-${row} row-span-1 self-start text-trim-cap leading-none tracking-[-0.06em]`}
            >
              {resolvedCodeDisplay}
            </EaseIn>
          )
        })}
        {Array.from({ length: 5 }, (_, index) => {
          const col = 5 + index * 2
          const delay = 100 * index
          const weight = 300 + 100 * index

          return (
            <EaseIn
              from="left"
              delayMs={delay}
              key={index}
              className={`z-20 text-2xl select-none col-start-${col} font-[${weight}] row-span-1 row-start-3 self-start text-trim-cap leading-none tracking-[-0.06em]`}
            >
              {resolvedCodeDisplay}
            </EaseIn>
          )
        })}
        {/* Hero */}
        <div className="z-10 col-start-2 row-start-4 self-end font-title text-[320px] text-trim-cap leading-[0.9] font-light tracking-[-0.06em] text-nowrap text-magenta mix-blend-difference select-none">
          {title}.
        </div>
        <div className="z-10 col-start-2 row-start-4 self-end font-title text-[128px] text-trim-cap leading-none font-normal tracking-[-0.06em] whitespace-nowrap select-none">
          {title}.
        </div>
      </div>
    </main>
  )
}
