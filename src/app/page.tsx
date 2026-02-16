import Link from "@/components/Link";
import crypto from "crypto";
import { getSortedPostsData } from "@/lib/posts";
import { formatDate } from "@/lib/utils";
import ProximityLink from "@/components/ProximityLink";
import { SimpleEntrance } from "@/components/animations/EntranceSimple";
import { StretchEntrance } from "@/components/animations/EntranceStretch";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ homeName?: string }>;
}) {
  const params = await searchParams;
  const homeName = params.homeName;
  const displayName =
    homeName &&
    crypto.createHash("md5").update(homeName).digest("hex") ===
      "441be6a1cc1cc50f35b95395f20f6b55"
      ? homeName
      : "4rcadia";

  const posts = getSortedPostsData();
  const latestPosts = posts.slice(0, 3);

  const socialMediaItems = [
    { name: "GitHub", href: "https://github.com/arcadi4" },
    { name: "Bilibili", href: "https://space.bilibili.com/499244418" },
    { name: "Twitter", href: "https://x.com/_4rcadia" },
  ];

  const menuItems = [
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
    { name: "Projects", href: "/projects" },
    { name: "Friend Links", href: "/links" },
    { name: "Tags", href: "/tags" },
    { name: "All Posts", href: "/all" },
  ];

  const menuPartOne = menuItems.slice(0, 4);
  const menuPartTwo = menuItems.slice(4);

  let menuAnimationIndex = 0;
  const delayPerMenuItem = 100;

  const backgroundBaseDelay = 0;
  const figureBaseDelay = 400;
  const menuBaseDelay = 800;
  const articlesBaseDelay = 1400;

  return (
    <main className="relative min-h-[166dvh] flex flex-col">
      <StretchEntrance
        from="right"
        delayMs={figureBaseDelay}
        className="absolute bg-acid right-0 top-0 h-128 w-1/2 -z-50"
      />
      <StretchEntrance
        from="bottom"
        durationMs={1200}
        className="absolute left-0 top-0 h-full w-12 border-r-2 border-r-black"
      />
      <SimpleEntrance
        durationMs={450}
        delayMs={backgroundBaseDelay}
        className="absolute -left-1/12 -top-1/3 text-[768pt] font-serif text-acid -z-10"
      >
        *
      </SimpleEntrance>
      <section className="relative h-64">
        <StretchEntrance
          from="left"
          delayMs={figureBaseDelay + 200}
          className="absolute w-full bottom-0 border-b-2 border-b-black"
        />
        <div className="flex flex-row">
          <h1 className="h1-hero min-w-3/4 pl-14 pt-4 select-none self-center">
            {displayName}&apos;s
            <br />
            Blog
          </h1>
          <div className="relative h-full">
            <StretchEntrance
              from="top"
              delayMs={figureBaseDelay}
              className="absolute bg-magenta h-80 w-16 right-full -z-30"
            />
            <div className="flex flex-col pl-2">
              {socialMediaItems.map((link) => {
                menuAnimationIndex++;
                return (
                  <SimpleEntrance
                    key={link.name}
                    delayMs={
                      menuAnimationIndex * delayPerMenuItem + menuBaseDelay
                    }
                  >
                    <ProximityLink href={link.href} className="large-link">
                      {link.name}
                    </ProximityLink>
                  </SimpleEntrance>
                );
              })}
            </div>
          </div>
        </div>
      </section>
      <StretchEntrance
        from="left"
        delayMs={figureBaseDelay + 100}
        className="h-16 w-full border-b-2 border-b-black"
      />
      <section className="relative">
        <StretchEntrance
          from="left"
          delayMs={figureBaseDelay}
          className="absolute bottom-0 w-full border-b-2 border-b-black"
        />
        <div className="flex flex-row">
          <SimpleEntrance
            delayMs={articlesBaseDelay - 200}
            className="large-p pl-16 min-w-3/4"
          >
            LATEST ARTICLES
          </SimpleEntrance>
          <div className="flex flex-col pl-2">
            {menuPartOne.map((link) => {
              menuAnimationIndex++;
              return (
                <SimpleEntrance
                  key={link.name}
                  delayMs={
                    menuAnimationIndex * delayPerMenuItem + menuBaseDelay
                  }
                >
                  <ProximityLink href={link.href} className="large-link">
                    {link.name}
                  </ProximityLink>
                </SimpleEntrance>
              );
            })}
          </div>
        </div>
      </section>
      <section className="flex flex-row flex-1">
        <div className="w-3/4">
          <div className="flex flex-col gap-8 max-w-2/3">
            {latestPosts.map((post, index) => (
              <article className="relative flex flex-row gap-4" key={post.slug}>
                <StretchEntrance
                  from="bottom"
                  delayMs={articlesBaseDelay + index * 100}
                  className="absolute h-full w-6 bg-klein "
                />
                <StretchEntrance
                  from="right"
                  delayMs={articlesBaseDelay + 200 + index * 100}
                  className="absolute h-full w-1/4 translate-x-[calc(100%-64px)] left-full bg-klein"
                />
                <SimpleEntrance
                  delayMs={articlesBaseDelay + index * 100}
                  className="w-96 pl-16"
                >
                  <Link href={`/posts/${post.slug}`} className="large-p">
                    {post.title}
                  </Link>
                  <p className="large-p">{formatDate(post.date)}</p>
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
        <SimpleEntrance
          durationMs={450}
          delayMs={backgroundBaseDelay}
          className="absolute font-title font-bold text-[640pt] text-stroke left-1/2 -top-32 select-none -z-10"
        >
          &
        </SimpleEntrance>
        <div className="flex flex-col justify-between items-start">
          <div className="relative flex flex-col pl-2">
            {menuPartTwo.map((link) => {
              menuAnimationIndex++;
              return (
                <SimpleEntrance
                  key={link.name}
                  delayMs={
                    menuAnimationIndex * delayPerMenuItem + menuBaseDelay
                  }
                >
                  <ProximityLink href={link.href} className="large-link">
                    {link.name}
                  </ProximityLink>
                </SimpleEntrance>
              );
            })}
            <StretchEntrance
              from="bottom"
              delayMs={figureBaseDelay + 200}
              className="absolute bg-magenta h-96 w-16 top-full translate-y-4 -z-30"
            />
          </div>
        </div>
      </section>
      <footer className="h-80 bg-klein"></footer>
    </main>
  );
}
