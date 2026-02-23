import "../styles/animated-link.css";
import "../styles/custom-cursor.css";
import "../styles/proximity-link.css";
import "./global.css";
import CustomCursor from "@/components/CustomCursor";
import Footer from "@/components/Footer";
import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { bricolageGrotesque, ibmPlexSans, playfairDisplay } from "@/app/fonts";

export const metadata: Metadata = {
  title: "Nextjs", //TODO: This is a placeholder
  description:
    "A personal blog built with Next.js, TypeScript, and Tailwind CSS",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${bricolageGrotesque.variable} ${ibmPlexSans.variable} ${playfairDisplay.variable} antialiased`}
      >
        <Analytics />
        <SpeedInsights />
        <CustomCursor />
        {children}
        <Footer />
      </body>
    </html>
  );
}
