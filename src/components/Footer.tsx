"use client";

import Link from "@/components/Link";

export default function Footer() {
  return (
    <footer className="relative grid h-32 w-dvw grid-cols-12 gap-x-4 bg-klein px-8">
      <div className="absolute bottom-8 col-span-full col-start-4 row-start-1 font-mono text-sm text-white">
        &copy; {new Date().getFullYear()} 4rcadia.
        <br />
        All articles and web design licensed under CC BY-NC 4.0 if not otherwise
        specified.
        <br />
        Source code distributed with MIT License at{" "}
        <Link href="https://github.com/Arcadi4/blog" />
      </div>
      <div className="col-span-1 col-start-1 -ml-8 h-full bg-black" />
      <div className="absolute bottom-8 left-8 font-mono leading-none font-bold text-white">
        blog*
        <br />
        arcadia
        <br />
        *moe
      </div>
    </footer>
  );
}
