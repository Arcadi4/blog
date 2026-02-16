import Link from "@/components/Link";
import crypto from "crypto";
import { getSortedPostsData } from "@/lib/posts";
import { formatDate } from "@/lib/utils";
import ProximityLink from "@/components/ProximityLink";
import { TextAnimatedEntrance } from "@/components/animations/EntranceText";

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

  const socialMediaLinks = [
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

  let linkAnimationOrder = 0;
  const delayPerLink = 100;

  return (
    <main className="relative min-h-[166dvh] flex flex-col">
      <div className="absolute bg-acid right-0 top-0 h-128 w-1/2 -z-50" />
      <div className="absolute bg-none left-0 top-0 h-full w-12 border-r-2 border-r-black" />
      <p className="absolute -left-1/12 -top-1/3 text-[768pt] font-serif text-acid -z-10">
        *
      </p>
      <section className="h-64 border-b-2 border-b-black">
        <div className="flex flex-row">
          <h1 className="h1-hero min-w-3/4 pl-14 pt-4 select-none self-center">
            {displayName}&apos;s
            <br />
            Blog
          </h1>
          <div className="relative h-full">
            <div className="absolute bg-magenta h-80 w-16 right-full -z-30" />
            <div className="flex flex-col pl-2">
              {socialMediaLinks.map((link) => {
                linkAnimationOrder++;
                return (
                  <TextAnimatedEntrance
                    key={link.name}
                    delayMs={linkAnimationOrder * delayPerLink}
                  >
                    <ProximityLink href={link.href} className="large-link">
                      {link.name}
                    </ProximityLink>
                  </TextAnimatedEntrance>
                );
              })}
            </div>
          </div>
        </div>
      </section>
      <div className="h-16 border-b-2 border-b-black" />
      <div className="border-b-2 border-b-black ">
        <div className="flex flex-row">
          <p className="large-p pl-16 min-w-3/4">LATEST ARTICLES</p>
          <div className="flex flex-col pl-2">
            {menuPartOne.map((link) => {
              linkAnimationOrder++;
              return (
                <TextAnimatedEntrance
                  key={link.name}
                  delayMs={linkAnimationOrder * delayPerLink}
                >
                  <ProximityLink href={link.href} className="large-link">
                    {link.name}
                  </ProximityLink>
                </TextAnimatedEntrance>
              );
            })}
          </div>
        </div>
      </div>
      <section className="flex flex-row flex-1">
        <div className="w-3/4">
          <div className="flex flex-col gap-8 max-w-2/3">
            {latestPosts.map((post) => (
              <article className="relative flex flex-row gap-4" key={post.slug}>
                <div className="absolute h-full w-6 bg-klein " />
                <div className="absolute h-full w-1/3 left-full bg-klein" />
                <div className="w-96 pl-16">
                  <Link href={`/posts/${post.slug}`} className="large-p">
                    {post.title}
                  </Link>
                  <p className="large-p">{formatDate(post.date)}</p>
                </div>
                {post.excerpt && <p className="large-p w-96">{post.excerpt}</p>}
              </article>
            ))}
          </div>
        </div>
        <div className="absolute font-title font-bold text-[640pt] text-stroke left-1/2 -top-32 select-none -z-10">
          &
        </div>
        <div className="flex flex-col justify-between items-start">
          <div className="flex flex-col pl-2">
            {menuPartTwo.map((link) => {
              linkAnimationOrder++;
              return (
                <TextAnimatedEntrance
                  key={link.name}
                  delayMs={linkAnimationOrder * delayPerLink}
                >
                  <ProximityLink href={link.href} className="large-link">
                    {link.name}
                  </ProximityLink>
                </TextAnimatedEntrance>
              );
            })}
          </div>
        </div>
      </section>
      <footer className="h-80 bg-klein"></footer>
    </main>
  );
}
