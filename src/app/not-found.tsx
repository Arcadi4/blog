"use client";

import { usePathname } from "next/navigation";
import Link from "@/components/Link";

export default function NotFound() {
    const pathname = usePathname();

    return (
        <main className="min-h-dvh flex flex-col 
                        h-max
                        md:flex-row md:h-dvh">
            {/* <div className="absolute h-60 w-12 bg-magenta z-11" />
            <div className="absolute bottom-0 h-full w-12 bg-klein z-10" /> */}
            <section className="bg-acid border-b-2 border-b-black
                md:h-dvh md:border-b-0 md:border-r-2 md:border-r-black md:w-2/5">
                <div className="flex flex-col justify-between h-full p-4 gap-16">
                    <div className="flex flex-col z-20">
                        {Array.from({ length: 5 }, (_, index) => (
                            <p key={index} className="font-mono large-p">{pathname}</p>
                        ))}
                    </div>
                    <h1 className="h1-hero left-2">
                        404<br />Not Found
                    </h1>
                </div>
            </section>
            <section className="relative bg-white flex-1
                md:h-dvh">
                <div className="absolute
                    top-0 py-4 pl-6
                    md:bottom-0 md:top-auto">
                    <div className="flex flex-col gap-4">
                        <Link href="/" className="large-link">
                            Home
                        </Link>
                        <Link href="/all" className="large-link">
                            All Posts
                        </Link>
                        <Link href="/about" className="large-link">
                            About
                        </Link>
                        <Link href="/tags" className="large-link">
                            Tags
                        </Link>
                        <Link href="/projects" className="large-link">
                            Projects
                        </Link>
                        <Link href="/links" className="large-link">
                            Links
                        </Link>
                        <Link href="/contact" className="large-link">
                            Contact
                        </Link>
                    </div>
                </div>
            </section>
        </main>
    );
}
