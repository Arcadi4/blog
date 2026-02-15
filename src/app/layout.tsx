import type { Metadata } from "next";
import { Bricolage_Grotesque, Playfair_Display } from "next/font/google";
import Header from "@/components/Header";
import CustomCursor from "@/components/CustomCursor";
import "./global.css";
import "../styles/animated-link.css";
import "../styles/custom-cursor.css";

export const bricolageGrotesque = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "500", "600", "700"],
});

export const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Nextjs", //TODO: This is a placeholder
  description:
    "A personal blog built with Next.js, TypeScript, and Tailwind CSS",
};

export const colorKlein = "#0048ff";
export const colorMagenta = "#ff00a6";
export const colorAcid = "#c3ff00";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${bricolageGrotesque.variable} ${playfairDisplay.variable} antialiased`}
      >
        <Header />
        {children}
        <CustomCursor />
      </body>
    </html>
  );
}
