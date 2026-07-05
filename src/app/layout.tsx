import "../styles/animated-link.css";
import "../styles/custom-cursor.css";
import "../styles/proximity-link.css";
import "./global.css";
import CustomCursor from "@/components/CustomCursor";
import Footer from "@/components/Footer";
import MobileGate from "@/components/MobileGate";
import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import {
  bricolageGrotesque,
  geist,
  ibmPlexMono,
  ibmPlexSans,
  playfairDisplay,
} from "@/app/fonts";

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
      lang="en"
      className={`${bricolageGrotesque.variable} ${geist.variable} ${ibmPlexMono.variable} ${ibmPlexSans.variable} ${playfairDisplay.variable} overflow-x-clip antialiased`}
    >
      <body>
        <Analytics />
        <SpeedInsights />
        <CustomCursor />
        <MobileGate />
        {children}
        <Footer />
      </body>
    </html>
  );
}
