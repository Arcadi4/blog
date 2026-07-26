import {
  Bricolage_Grotesque,
  Funnel_Display,
  Geist,
  IBM_Plex_Mono,
  IBM_Plex_Sans,
  Libre_Barcode_128,
  Playfair_Display
} from "next/font/google"

export const bricolageGrotesque = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-bricolage-grotesque",
  weight: "variable"
})

export const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
  weight: ["100", "300", "500", "900"]
})

export const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-ibm-plex-mono",
  weight: ["300", "500", "600", "700"]
})

export const ibmPlexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  variable: "--font-ibm-plex-sans",
  weight: "variable",
  axes: ["wdth"]
})

export const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair-display",
  weight: "variable"
})

export const libreBarcode = Libre_Barcode_128({
  subsets: ["latin"],
  variable: "--font-libre-barcode",
  weight: "400"
})

export const funnelDisplay = Funnel_Display({
  display: "swap",
  preload: true,
  subsets: ["latin"],
  variable: "--font-funnel-display",
  weight: "variable"
})
