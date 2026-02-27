"use client";

import { usePathname } from "next/navigation";
import { menuItemsErrorPage } from "@/app/posts/menuItems";
import ProximityLink from "@/components/ProximityLink";

export default function NotFound() {
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

  return (
    <main className="overflow-hidden">
      {/*<p className="absolute font-title font-bold text-9xl text-stroke leading-none top-0 right-0 select-none pointer-events-none">*/}
      {/*  404*/}
      {/*</p>*/}
      {/*<p className="absolute font-title font-bold text-9xl text-stroke leading-none inset-y-1/2 right-0 select-none pointer-events-none">*/}
      {/*  Error*/}
      {/*</p>*/}
      {/*<p className="absolute font-title font-bold text-9xl text-stroke leading-none bottom-0 right-0 select-none pointer-events-none">*/}
      {/*  Not Found*/}
      {/*</p>*/}

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
      <div className="flex flex-row h-screen w-full p-6 gap-6">
        <div className="flex-1 h-full relative">
          <div className="flex flex-col z-20 gap-1 absolute left-0 top-0">
            {Array.from({ length: 5 }, (_, index) => (
              <p key={index} className="font-mono large-p">
                {pathname}
              </p>
            ))}
          </div>
          <div className="flex flex-col z-20 gap-1 absolute left-0 bottom-[calc(1/3*100%+.5rem)]">
            {Array.from({ length: 5 }, (_, index) => (
              <p key={index} className="font-mono large-p">
                {pathname}
              </p>
            ))}
          </div>
          <pre className="large-p absolute left-0 bottom-0">4xx|404</pre>
        </div>
        <div className="flex-1 h-full relative">
          <div className="flex flex-col items-end absolute right-0 top-[calc(2/3*100%-6*3rem+.5rem)]">
            {menuItemsErrorPage.map((menuItem, index) => {
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
          <pre className="large-p absolute left-0 bottom-0">not found</pre>
          <pre className="large-p absolute left-0 top-0">
            Server returned
            <br />
            an error :(
          </pre>
        </div>
        <div className="flex-1 h-full relative">
          <div className="absolute left-0 top-0 -translate-x-1/2 -translate-y-1/6 text-[1280px] font-medium font-serif text-stroke -z-10 pointer-events-none select-none">
            *
          </div>
          <div className="absolute bottom-1/3">
            <h1 className="h1-hero w-fit relative">
              404
              <div className="w-full h-screen bg-klein absolute bottom-full" />
            </h1>
            <h1 className="h1-hero">
              Not
              <br />
              Found
            </h1>
          </div>
          <pre className="large-p absolute left-0 bottom-0">&gt;&gt;&gt;</pre>
          <pre className="large-p absolute right-0 bottom-0">&gt;&gt;&gt;</pre>
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
