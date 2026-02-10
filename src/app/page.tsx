import Link from "@/components/Link";
import crypto from "crypto";

export default async function Home({ searchParams }: { searchParams: Promise<{ homeName?: string; }>; }) {
  const params = await searchParams;
  const homeName = params.homeName;
  const displayName =
    homeName &&
      crypto.createHash("md5").update(homeName).digest("hex") === "441be6a1cc1cc50f35b95395f20f6b55"
      ? homeName
      : "4rcadia";

  return (
    <main className="min-h-dvh flex flex-col">
      <section className="bg-acid border-2 border-black" style={{ "--link-bg": "var(--color-acid)" } as React.CSSProperties}>
        <div className="flex flex-row gap-16">
          <h1 className="h1-hero mb-16">
            {displayName}&apos;s<br />Blog
          </h1>
          <div className="flex flex-col" >
            <Link href="https://github.com/arcadi4" className="text-2xl">
              GitHub
            </Link>
            <Link href="https://space.bilibili.com/499244418" className="text-2xl">
              Bilibili
            </Link>
          </div>
        </div>
      </section >
      <section className="bg-white flex flex-row border-b-2 border-l-2 border-r-2 border-black flex-1">
        <div className="w-[60vw] border-r-2 border-black">
          <h1 className="h1-hero">
            Latest<br />Updates
          </h1>
        </div>
        <div>
          <h1 className="h1-hero">
            Menu
          </h1>
        </div>
      </section>
    </main>
  );
}
