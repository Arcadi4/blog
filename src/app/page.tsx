"use client";

import ProximityLink from "@/components/ProximityLink";
import { SimpleEntrance } from "@/components/animations/EntranceSimple";
import { StretchEntrance } from "@/components/animations/EntranceStretch";
import { LinkItem, menuItems, socialMediaItems } from "@/app/posts/menuItems";
import { useEffect, useState } from "react";

export default function Home() {
  const [useRealName, setUseRealName] = useState(false);
  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    setUseRealName(
      queryParams.has("name") && queryParams.get("name") === "skylar",
    );
  }, []);
  const name = useRealName ? "Skylar" : "4rcadia";
  const heroSegments = useRealName ? ["Sky", "lr", "C."] : ["4rc", "ad", "ia"];
  const greeting = `Hello,\nhere’s\n${name}.`;

  let menuAnimationIndex = 0;
  const delayPerMenuItem = 100;

  const backgroundBaseDelay = 0;
  const figureBaseDelay = 400;
  const menuBaseDelay = 800;
  const contentBaseDelay = 1200;

  const location = "cleveland, oh";
  const timeZone = "America/New_York";
  type CurrentDateTime = {
    currentDate: string;
    currentTime: string;
  };
  const EMPTY_DATE_TIME: CurrentDateTime = {
    currentDate: "",
    currentTime: "",
  };
  const [{ currentDate, currentTime }, setCurrentDateTime] =
    useState(EMPTY_DATE_TIME);
  const getCurrentDateTime = (): CurrentDateTime => {
    return {
      currentDate: new Date().toLocaleDateString("en-US", {
        timeZone: timeZone,
      }),
      currentTime: new Date().toLocaleTimeString("en-US", {
        timeZone: timeZone,
      }),
    };
  };
  useEffect(() => {
    setCurrentDateTime(getCurrentDateTime());
    const intervalId = setInterval(() => {
      setCurrentDateTime(getCurrentDateTime());
    }, 1000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <main className="relative">
      {/* Grid for background elements, col only, no y padding */}
      <div className="absolute grid h-dvh w-dvw grid-cols-12 gap-x-4 px-8">
        <StretchEntrance
          from="top"
          durationMs={1600}
          className="separator z-20 col-start-2 col-end-3 row-start-1 h-[200dvh] border-r"
        />
        <div className="col-span-1 col-start-1 h-full py-8">
          <div className="grid h-full grid-rows-9 gap-y-4">
            <StretchEntrance
              from="top"
              durationMs={1000}
              className="-z-10 row-span-4 row-start-1 -mt-8 -ml-8 bg-acid"
            />
            <StretchEntrance
              from="top"
              durationMs={1000}
              className="-z-10 row-span-5 row-start-5 -mt-4 -ml-8 h-[105%] bg-klein"
            />
          </div>
        </div>
      </div>

      {/* Grid for background elements, row only, no x padding */}
      <div className="absolute grid h-[200dvh] w-full grid-rows-9 gap-y-4 py-8">
        <StretchEntrance
          from="left"
          delayMs={figureBaseDelay}
          className="separator row-span-1 row-start-1 w-full border-b"
        />
        <StretchEntrance
          from="left"
          delayMs={figureBaseDelay + 200}
          className="separator row-span-1 row-start-4 w-full border-b"
        />
      </div>

      {/* Content grid, with x-y padding */}
      <div className="relative mx-auto grid h-[200dvh] grid-cols-12 grid-rows-9 gap-x-4 gap-y-4 p-8">
        {/* Blog URL */}
        <SimpleEntrance
          from="none"
          className="col-start-1 row-start-1 text-base leading-none font-semibold whitespace-pre-line"
        >
          {"https://\nblog.\narcadia\n.moe"}
        </SimpleEntrance>

        {/* Metadata; purely decorative */}
        <SimpleEntrance
          from="right"
          delayMs={menuBaseDelay}
          className="col-start-3 row-start-1 text-sm leading-none font-light whitespace-pre-line uppercase"
        >
          {"personal_blog\n© 2026"}
        </SimpleEntrance>
        <SimpleEntrance
          from="right"
          delayMs={menuBaseDelay + 200}
          className="col-span-2 col-start-11 row-span-2 row-start-1 text-sm leading-none font-light whitespace-pre-line uppercase"
        >
          {`location
          ${location}
          
          timezone
          ${timeZone}
          
          time
          ${currentTime}
          
          date
          ${currentDate}`}
        </SimpleEntrance>

        {/* Hero text + greetings */}
        <div className="col-span-12 col-start-1 row-span-4 row-start-1 grid grid-cols-subgrid grid-rows-3">
          {/* Hero text */}
          <SimpleEntrance
            from="right"
            delayMs={backgroundBaseDelay + 300}
            className="relative col-start-4 col-end-13 row-start-1"
          >
            <span className="absolute top-0 left-0 font-title text-[352px] leading-none font-semibold tracking-[-0.06em] whitespace-nowrap uppercase [text-box:trim-both_cap_alphabetic]">
              {heroSegments[0]}
            </span>
          </SimpleEntrance>
          <SimpleEntrance
            from="right"
            delayMs={backgroundBaseDelay + 500}
            className="relative col-start-7 col-end-13 row-start-2"
          >
            <span className="absolute top-0 left-0 font-title text-[352px] leading-none font-semibold tracking-[-0.06em] whitespace-nowrap uppercase [text-box:trim-both_cap_alphabetic]">
              {heroSegments[1]}
            </span>
          </SimpleEntrance>
          <SimpleEntrance
            from="right"
            delayMs={backgroundBaseDelay + 700}
            className="relative col-start-10 col-end-13 row-start-3"
          >
            <span className="absolute top-0 left-0 font-title text-[352px] leading-none font-semibold tracking-[-0.06em] whitespace-nowrap uppercase [text-box:trim-both_cap_alphabetic]">
              {heroSegments[2]}
            </span>
          </SimpleEntrance>

          {/* Greeting text */}
          <div className="col-start-3 col-end-13 row-start-2 mt-5 grid grid-cols-10 grid-rows-1 font-sans text-7xl font-light">
            <SimpleEntrance
              from="left"
              delayMs={figureBaseDelay + 1000}
              className="-z-10 col-start-1 whitespace-pre-line text-acid"
            >
              {greeting}
            </SimpleEntrance>
            <SimpleEntrance
              from="right"
              delayMs={figureBaseDelay + 200}
              className="col-start-2 whitespace-pre-line"
            >
              {greeting}
            </SimpleEntrance>
            <SimpleEntrance
              from="left"
              delayMs={figureBaseDelay + 800}
              className="z-10 col-start-6 whitespace-pre-line text-magenta"
            >
              {greeting}
            </SimpleEntrance>
            <SimpleEntrance
              from="right"
              delayMs={figureBaseDelay + 400}
              className="col-start-10 whitespace-pre-line"
            >
              {greeting}
            </SimpleEntrance>
          </div>
        </div>

        {/* Menu; navigation and social media links */}
        <aside className="col-start-1 col-end-4 row-span-1 row-start-3">
          <div className="flex flex-col">
            {menuItems.map((menuItem: LinkItem) => {
              menuAnimationIndex++;
              return (
                <SimpleEntrance
                  key={menuItem.name}
                  from="right"
                  delayMs={
                    menuAnimationIndex * delayPerMenuItem + menuBaseDelay
                  }
                >
                  <ProximityLink
                    href={menuItem.href}
                    className="font-title text-2xl leading-none font-normal"
                  >
                    {"/ " + menuItem.name}
                  </ProximityLink>
                </SimpleEntrance>
              );
            })}
          </div>
        </aside>
        <aside className="col-start-1 col-end-4 row-span-1 row-start-4">
          <div className="flex flex-col">
            {socialMediaItems.map((menuItem: LinkItem) => {
              menuAnimationIndex++;
              return (
                <SimpleEntrance
                  key={menuItem.name}
                  from="right"
                  delayMs={
                    menuAnimationIndex * delayPerMenuItem + menuBaseDelay
                  }
                >
                  <ProximityLink
                    href={menuItem.href}
                    className="font-title text-2xl leading-none font-normal"
                  >
                    {"& " + menuItem.name}
                  </ProximityLink>
                </SimpleEntrance>
              );
            })}
          </div>
        </aside>

        {/* Quote */}
        <div className="contents font-title leading-none font-light">
          <SimpleEntrance
            from="right"
            delayMs={contentBaseDelay}
            className="col-span-1 col-start-3 row-span-1 row-start-4 text-black/25 uppercase"
          >
            quote_01
          </SimpleEntrance>
          <SimpleEntrance
            from="right"
            delayMs={contentBaseDelay + 200}
            className="col-span-2 col-start-4 row-span-1 row-start-4"
          >
            <div className="flex flex-col gap-4">
              <div>
                {
                  "A man who thinks he is a king is mad, a king who thinks he is a king is no less so."
                }
              </div>
              <div>
                {
                  "I le fou qui se croit roi est fou, le roi qui se croit roi ne l'est pas moins."
                }
              </div>
              <div className="w-full pr-4 text-right">{"— Jacques Lacan"}</div>
            </div>
          </SimpleEntrance>
        </div>

        {/* Grid lines */}
        <StretchEntrance
          from="top"
          delayMs={figureBaseDelay + 400}
          className="separator -z-10 col-span-1 col-start-4 row-span-3 row-start-2 -mt-4 border-r"
        />
        <StretchEntrance
          from="top"
          delayMs={figureBaseDelay + 600}
          className="separator -z-10 col-span-1 col-start-8 row-span-3 row-start-2 -mt-4 border-r"
        />

        {/* Figures */}
        <div className="relative col-span-4 col-start-5 row-span-3 row-start-3">
          <SimpleEntrance
            delayMs={figureBaseDelay + 1000}
            from="none"
            className="text-stroke-acid pointer-events-none absolute bottom-0 left-0 -z-20 font-grotesque text-[512pt] leading-none font-bold select-none [text-box:trim-both_cap_alphabetic]"
          >
            &
          </SimpleEntrance>
        </div>
        <div className="relative col-span-4 col-start-9 row-span-3 row-start-4">
          <SimpleEntrance
            delayMs={figureBaseDelay + 600}
            from="none"
            className="text-stroke-magenta pointer-events-none absolute bottom-0 left-0 z-10 font-grotesque text-[512pt] leading-none font-bold select-none [text-box:trim-both_cap_alphabetic]"
          >
            &
          </SimpleEntrance>
        </div>

        {/* <section className="relative">
          <StretchEntrance
            from="left"
            delayMs={figureBaseDelay}
            className="separator absolute bottom-0 w-full border-b"
          />
          <div className="flex flex-row">
            <SimpleEntrance
              delayMs={articlesBaseDelay - 200}
              className="large-p min-w-3/4 pl-16"
            >
              LATEST ARTICLES
            </SimpleEntrance>
          </div>
        </section>
        <section className="flex flex-1 flex-row">
          <div className="w-3/4">
            <div className="flex max-w-2/3 flex-col gap-8">
              {latestPosts.map((post, index) => (
                <article
                  className="relative flex flex-row gap-4"
                  key={post.slug}
                >
                  <StretchEntrance
                    from="bottom"
                    delayMs={articlesBaseDelay + index * 100}
                    className="bg-klein absolute h-full w-6"
                  />
                  <StretchEntrance
                    from="right"
                    delayMs={articlesBaseDelay + 200 + index * 100}
                    className="bg-klein absolute bottom-0 left-full h-full w-[calc(50%-64px)] translate-x-0"
                  />
                  <SimpleEntrance delayMs={articlesBaseDelay + index * 100}>
                    <div className="w-96 pl-16">
                      <Link href={`/posts/${post.slug}`} className="large-p">
                        {post.title}
                      </Link>
                      <p className="large-p">{formatDate(post.date)}</p>
                    </div>
                  </SimpleEntrance>
                  {post.excerpt && (
                    <SimpleEntrance
                      delayMs={articlesBaseDelay + 100 + index * 100}
                      className="large-p w-96"
                    >
                      {post.excerpt}
                    </SimpleEntrance>
                  )}
                </article>
              ))}
            </div>
          </div>
        </section> */}
      </div>
    </main>
  );
}
