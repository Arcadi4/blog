import type { Metadata } from "next";
import Header from "@/components/Header";
import CustomCursor from "@/components/CustomCursor";
import "./global.css";
import "../styles/animated-link.css";
import "../styles/proximity-link.css";
import "../styles/custom-cursor.css";
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
        <Header />
        {children}
        <CustomCursor />
      </body>
    </html>
  );
}
