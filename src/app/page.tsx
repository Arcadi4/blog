import Link from "@/components/Link";

export default function Home() {
  return (
    <main className="min-h-dvh flex flex-col">
      <section className="bg-acid border-2 border-black">
        <div className="flex flex-row gap-16">
          <h1 className="h1-hero mb-16">
            4rcadia’s<br />Blog
          </h1>
          <div className="flex flex-col" >
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
