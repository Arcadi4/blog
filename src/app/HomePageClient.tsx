"use client";

import {EaseIn} from "@/components/animations/EaseIn";
import {menuItems, socialMediaItems} from "@/app/posts/menuItems";
import {useEffect, useRef, useState} from "react";
import {cn, formatDate} from "@/lib/utils";
import {colorKlein} from "@/lib/colors";
import VerticalGrid from "@/components/VerticalGrid";
import {ScaleIn} from "@/components/animations/ScaleIn";
import type {ContentArticle} from "@/lib/content-index";
import MarqueeCard from "@/components/MarqueeCard";
import {Menu} from "@/components/Menu";
import NextLink from "next/link";

type HomePageClientProps = {
  readonly articles: readonly ContentArticle[];
};

// roughly 3.4 screens (64rem per screen)
// the grid system is 5 rows per screen, so its 17 rows
const homepageHeight = "h-[217.6rem]";

export function HomePageClient({ articles }: HomePageClientProps) {
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
      <div
        className={cn(
          "relative grid grid-cols-12 grid-rows-17 gap-x-4 gap-y-4 p-8 w-dvw",
          homepageHeight,
        )}
      >
        <div className="absolute inset-0 row-span-12 row-start-1 -mt-8">
          <VerticalGrid className="h-full" />
        </div>

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
        <span className="h- pointer-events-none z-10 col-start-3 row-start-2 font-funnel-display text-[10rem] text-trim-cap">
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

        <span className="col-start-12 row-start-4 self-end font-mono text-5xl leading-none text-klein">
          ↓↓
        </span>

        {/*
        Lyrics from "秒針を噛み". Reserved, plans:
          - Uncomment if I found a good Japanese font.
          - Replace this with some other prose.
          - I implemented a player component
        */}
        {/*
        <h1 className="col-span-8 col-start-3 row-span-6 row-start-6 overflow-clip text-6xl leading-none text-pretty">
          {`生活の偽造 いつも通り 通り過ぎて
            1回言った「わかった。」戻らない
            確信犯でしょ？ 夕食中に泣いた後
            君は笑ってた
            「私もそうだよ。」って 偽りの気持ち合算して
            吐いて 黙って ずっと溜まってく
            何が何でも 面と向かって「さよなら」
            する資格もないまま 僕は
            灰に潜り 秒針を噛み
            白昼夢の中で ガンガン砕いた
            でも壊れない 止まってくれない
            「本当」を知らないまま 進むのさ
            このまま奪って 隠して 忘れたい
            分かり合う○ 1つもなくても
            会って「ごめん。」って返さないでね
            形のない言葉は いらないから
            消えない後遺症「なんでも受け止める。」と
            言ったきり もう帰ることはない
            デタラメでも 僕のためじゃなくても
            君に守られた
            目も口も 意味がないほどに
            塞ぎ込んで 動けない僕を
            みつけないで ほっといてくれないか
            どこ見ても どこに居ても 開かない
            肺に潜り 秒針を噛み
            白昼夢の中で ガンガン砕いた
            でも壊れない 止まってくれない
            演じ続けるのなら
            このまま奪って 隠して 忘れたい
            分かり合う○ 1つもなくても
            会って「ごめん。」って返さないでね
            形のない言葉は いらないから
            縋って 叫んで 朝はない
            笑って 転んで 情けない
            誰のせいでも ないこと
            誰かのせいに したくて
            「僕って いるのかな？」
            本当は わかってるんだ
            見放されても 信じてしまうよ
            このまま 奪って 隠して 忘れたい
            このまま 奪って 隠して 忘れたい
            このまま 奪って 隠して 話したい
            分かり合う○ 1つもなくても
            会って「ごめん。」って返さないでね
            「疑うだけの 僕をどうして？」
            救いきれない 嘘はいらないから
            ハレタ レイラ`}
        </h1>
        */}

        {/* Menu - grid lines */}
        <div className="separator absolute z-10 row-span-5 row-start-6 h-full w-screen border-y" />

        {/* Menu - cards */}
        <ScaleIn from="top-left" delayMs={200} onSeen minPosition={10}>
          <MarqueeCard className="col-span-7 col-start-3 row-span-3 row-start-6 -mb-4 bg-acid">
            navigation navigation navigation navigation navigation
          </MarqueeCard>
        </ScaleIn>

        <ScaleIn from="top-right" delayMs={200} onSeen minPosition={10}>
          <MarqueeCard
            className="col-span-7 col-start-4 row-span-2 row-start-9 bg-magenta"
            trackClassName="text-background"
          >
            social media social media social media social media
          </MarqueeCard>
        </ScaleIn>

        {/* Menu - links */}
        <nav className="z-50 col-span-8 col-start-3 row-start-6">
          <Menu
            items={menuItems}
            itemClassName="font-funnel-display text-7xl leading-none"
            shadowColor={colorKlein}
            onSeen
          />
        </nav>

        <nav className="z-50 col-span-8 col-start-3 row-span-2 row-start-9 justify-self-end">
          <Menu
            items={socialMediaItems}
            itemClassName="font-funnel-display text-7xl leading-none text-background text-end"
            prefix=""
            suffix=" ↗"
            shadowColor="#000"
            onSeen
          />
        </nav>

        <EaseIn
          onSeen
          from="none"
          className="z-30 col-span-full col-start-1 row-start-12 self-end"
        >
          <h1 className="text-justify font-funnel-display text-[8rem] text-trim-cap leading-none text-klein [text-align-last:justify]">
            Latest Articles
          </h1>
        </EaseIn>

        <div className="separator absolute z-50 row-span-1 row-start-12 h-full w-screen border-b" />

        {articles
          .toSorted((a, b) => b.publishDate.valueOf() - a.publishDate.valueOf())
          .slice(0, 3)
          .map((article, i) => (
            <div
              className="group relative col-span-full row-span-1 grid grid-cols-subgrid grid-rows-[min-content_1fr_min-content]"
              style={{ gridRowStart: 13 + i }}
              key={article.id}
            >
              <ScaleIn
                from="right"
                onSeen
                className={cn(
                  "absolute bg-magenta inset-0",
                  `col-end-5 col-start-${3 - Math.abs((i % 4) - 2)}`,
                )}
              >
                <h1 className="absolute top-0 right-0 origin-top-right font-funnel-display text-5xl text-trim-cap font-bold transition-transform duration-300 ease-out group-hover:scale-200">
                  (0{i + 1})
                </h1>
              </ScaleIn>

              <p className="col-span-3 col-start-5 row-start-1 text-lg leading-none">
                published {formatDate(article.publishDate)}
                <br />
                {article.publishDate == article.lastEditedTime
                  ? null
                  : `(edited ${formatDate(article.lastEditedTime)})`}
              </p>
              <p className="col-span-3 col-start-8 row-start-1 text-lg leading-none">
                {article.tags.map((tag) => `#${tag}`).join(" ")}
              </p>
              <NextLink
                href={`/posts/${article.slug}`}
                className="col-span-3 col-start-8 row-start-2 self-end text-lg leading-none font-medium text-pretty hover:text-magenta"
              >
                {article.excerpt}
              </NextLink>
              <NextLink
                href={`/posts/${article.slug}`}
                className="col-span-3 col-start-5 row-start-3 max-h-fit self-end font-funnel-display text-4xl leading-none hover:text-magenta"
              >
                {article.title}
              </NextLink>

              <div className="separator absolute inset-0 col-start-5 col-end-11 -mx-4 border-b" />
              <div className="absolute inset-0 col-span-1 col-start-11 bg-acid" />
            </div>
          ))}

        <Menu
          className="col-span-full row-start-17 text-center"
          prefix="{{"
          suffix="}}"
          itemClassName="font-funnel-display text-7xl leading-none"
          items={[{ name: "View All", href: "/all" }]}
        />
      </div>
    </main>
  );
}
