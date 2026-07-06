import "../styles/animated-link.css";
import "../styles/proximity-link.css";
import "./global.css";
import CustomCursor from "@/components/CustomCursor";
import Footer from "@/components/Footer";
import MobileGate from "@/components/MobileGate";
import {NoiseOverlay} from "@/components/NoiseOverlay";
import type {Metadata} from "next";
import {Analytics} from "@vercel/analytics/next";
import {SpeedInsights} from "@vercel/speed-insights/next";
import {bricolageGrotesque, funnelDisplay, geist, ibmPlexMono, ibmPlexSans, playfairDisplay,} from "@/app/fonts";
import {cn} from "@/lib/utils";
import React from "react";

export const metadata: Metadata = {
  title: "@4rcadia",
  description: "My personal blog.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="zh-CN"
      className={cn(
        bricolageGrotesque.variable,
        ibmPlexMono.variable,
        ibmPlexSans.variable,
        playfairDisplay.variable,
        funnelDisplay.variable,
        geist.variable,
        "overflow-x-clip antialiased",
        "font-sans",
        "selection:bg-magenta selection:text-white",
      )}
    >
      <body>
        <Analytics />
        <SpeedInsights />
        <CustomCursor />
        <MobileGate />
        <NoiseOverlay />
        {children}
        <Footer />
      </body>
    </html>
  );
}
