"use client";

import ProximityLink from "@/components/ProximityLink";
import {EaseIn} from "@/components/animations/EaseIn";
import type {LinkItem} from "@/app/posts/menuItems";
import {menuItems, socialMediaItems} from "@/app/posts/menuItems";
import {useEffect, useRef, useState} from "react";
import {cn, formatDate} from "@/lib/utils";
import {colorKlein} from "@/lib/colors";
import VerticalGrid from "@/components/VerticalGrid";
import {ScaleIn} from "@/components/animations/ScaleIn";
import type {ContentArticle} from "@/lib/content-index";
import Dither from "@/components/Dither";
import MarqueeCard from "@/components/MarqueeCard";

type HomePageClientProps = {
  readonly articles: readonly ContentArticle[];
};

const homepageHeight = "h-[500dvh]";

export function HomePageClient({ articles }: HomePageClientProps) {
  const menuAnimationIndex = useRef(0);

  const [useRealName, setUseRealName] = useState(false);
  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    setUseRealName(
      queryParams.has("name") && queryParams.get("name") === "skylar",
    );
  }, []);
  const name = useRealName ? "Skylar" : "4rcadia";

  const variableBgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let frameId: number | null = null;

    const update = () => {
      frameId = null;

      const progress = Math.min(window.scrollY / (window.innerHeight * 0.2), 1);

      if (variableBgRef.current) {
        variableBgRef.current.style.transform = `scaleX(${1 + progress * 11})`;
      }
    };

    const handleScroll = () => {
      if (frameId === null) {
        frameId = requestAnimationFrame(update);
      }
    };

    update();

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
      if (frameId !== null) {
        cancelAnimationFrame(frameId);
      }
    };
  }, []);

  return (
    <main className="relative">
      <figure
        className="pointer-events-none absolute inset-0 z-100 opacity-20 mix-blend-screen filter-[url('#noise-bg-fx')_grayscale(100%)]"
        aria-hidden="true"
      >
        <svg>
          <filter id="noise-bg-fx">
            <feTurbulence baseFrequency="0.8" />
          </filter>
        </svg>
      </figure>

      <VerticalGrid height={homepageHeight} />

      <div
        className={cn(
          "relative mx-auto grid grid-cols-12 grid-rows-25 gap-x-4 gap-y-4 p-8 w-dvw",
          homepageHeight,
        )}
      >
        <p className="z-30 col-span-full col-start-3 row-start-1 font-sans text-2xl leading-none font-semibold">
          <span className="text-klein">©</span> 2026
          <br />
          <span className="text-klein">https://</span>blog.arcadia.moe
        </p>

        {/* Hero */}
        <div
          ref={variableBgRef}
          className="col-start-1 row-span-4 row-start-1 -mt-8 -ml-8 origin-left bg-klein transition-transform duration-400 ease-out"
        />
        <span className="pointer-events-none z-10 col-start-3 row-start-2 font-funnel-display text-[10rem] text-trim-cap">
          @{name}
        </span>

        <div className="z-30 col-span-full col-start-3 row-start-3 font-funnel-display text-5xl leading-none whitespace-pre-line text-klein">
          {"studying "}
          <span className="text-foreground capitalize">
            applied mathematics;
          </span>
          <br />
          {"i am a "}
          <span className="text-foreground capitalize">full stack dev;</span>
          <br />
          {"hobbyist "}
          <span className="text-foreground capitalize">
            graphical designer;
          </span>
          <br />
          {"i play "}
          <span className="text-foreground capitalize">
            Dark Souls, Rogue-likes,
          </span>
          <br />
          <span className="opacity-0">{"i play "}</span>
          <span className="text-foreground capitalize">
            {"Minecraft, {and more};"}
          </span>
          <br />
          {"fan of "}
          <span className="text-foreground capitalize">
            j-pop band ZUTOMAYO;
          </span>
          <br />
        </div>

        <span className="col-start-1 row-start-5 self-center font-mono text-5xl leading-none text-klein">
          ↓↓
        </span>
        <span className="col-start-7 row-start-5 self-center font-mono text-5xl leading-none text-klein">
          ↓↓
        </span>

        <ScaleIn
          durationMs={1000}
          from="top"
          minPosition={15}
          delayMs={0}
          onSeen
        >
          <MarqueeCard className="z-10 col-span-8 col-start-3 row-span-4 row-start-6 bg-acid">
            navigation navigation navigation navigation navigation
          </MarqueeCard>
        </ScaleIn>
        <ScaleIn
          durationMs={1000}
          from="top"
          delayMs={0}
          onSeen
          minPosition={15}
        >
          <MarqueeCard
            className="col-span-6 col-start-1 row-span-3 row-start-9 bg-magenta"
            trackClassName="text-background"
          >
            social media social media social media social media
          </MarqueeCard>
        </ScaleIn>
        <div className="separator absolute row-start-10 w-screen border-b" />
        <div className="separator absolute z-50 row-start-12 w-screen border-b" />

        <nav className="z-50 col-span-full col-start-3 row-start-6">
          <div className="flex flex-col">
            {menuItems.map((menuItem: LinkItem) => {
              menuAnimationIndex.current++;
              return (
                <EaseIn key={menuItem.name} from="right" onSeen>
                  <div className="font-funnel-display text-7xl leading-none">
                    {"→ "}
                    <ProximityLink
                      shadowColor={colorKlein}
                      label={menuItem.name}
                      href={menuItem.href}
                    />
                  </div>
                </EaseIn>
              );
            })}
          </div>
        </nav>

        <nav className="z-50 col-span-full col-start-3 row-start-10">
          <div className="flex flex-col">
            {socialMediaItems.map((menuItem: LinkItem) => {
              menuAnimationIndex.current++;
              return (
                <EaseIn key={menuItem.name} from="right" onSeen>
                  <div className="font-funnel-display text-7xl leading-none text-background">
                    {"↗ "}
                    <ProximityLink
                      shadowColor={colorKlein}
                      label={menuItem.name}
                      href={menuItem.href}
                    />
                  </div>
                </EaseIn>
              );
            })}
          </div>
        </nav>

        <div className="col-span-10 col-start-3 row-start-12">
          <Dither
            enableMouseInteraction={false}
            disableAnimation={false}
            waveSpeed={0.2}
            waveColor={[0, 0.2, 1]}
            waveAmplitude={0.2}
            waveFrequency={3}
          />
        </div>
        <EaseIn
          onSeen
          from="right"
          className="z-30 col-start-3 row-start-13 font-funnel-display text-[10rem] leading-none text-klein"
        >
          Articles
        </EaseIn>
        <div className="separator absolute row-start-14 w-screen border-t" />

        <div className="col-span-full row-start-15 flex flex-col gap-8">
          {articles
            .toSorted(
              (a, b) => b.publishDate.valueOf() - a.publishDate.valueOf(),
            )
            .slice(0, 3)
            .map((article, index) => (
              <div key={article.id} className="grid w-full grid-cols-12 gap-4">
                <ScaleIn
                  from="horizontal"
                  durationMs={1000}
                  onSeen
                  className="relative col-span-8 col-start-3 row-start-1 bg-acid text-[10rem] text-trim-cap text-magenta"
                >
                  <div>
                    {`{${(index + 1).toString()}}`}
                    <p className="absolute right-0 bottom-0 text-end text-2xl text-foreground">
                      {`Published ${formatDate(article.publishDate.toISOString())}`}
                      <br />
                      {`Last edited ${formatDate(article.lastEditedTime.toISOString())}`}
                    </p>
                  </div>
                </ScaleIn>

                <EaseIn onSeen>
                  <h1 className="col-start-3 col-end-11 row-start-2 mt-8 text-7xl font-semibold">
                    {article.title}
                  </h1>
                  <p className="col-span-8 col-start-3 row-start-3 text-4xl">
                    {article.excerpt}
                  </p>
                </EaseIn>
              </div>
            ))}
        </div>

        <div className="z-30 col-span-6 col-start-1 row-start-25 self-end font-serif text-5xl font-semibold text-pretty">
          A man who thinks he is a king is mad, a king who thinks he is a king
          is no less so.
          <br />
          I le fou qui se croit roi est fou, le roi qui se croit roi ne l'est
          pas moins.
          <br />
          <p className="text-end font-light">— Jacques Lacan</p>
        </div>
      </div>
    </main>
  );
}
