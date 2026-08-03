import {
  Funnel_Display,
  Geist,
  IBM_Plex_Mono,
  IBM_Plex_Sans,
  Libre_Barcode_128,
  Playfair_Display
} from "next/font/google"

export const geist = Geist({
  display: "swap",
  preload: false,
  subsets: ["latin"],
  variable: "--font-geist",
  weight: "900"
})

export const ibmPlexMono = IBM_Plex_Mono({
  display: "swap",
  preload: false,
  subsets: ["latin"],
  variable: "--font-ibm-plex-mono",
  weight: ["400", "600"]
})

export const ibmPlexSans = IBM_Plex_Sans({
  display: "swap",
  subsets: ["latin"],
  variable: "--font-ibm-plex-sans",
  weight: "variable"
})

export const playfairDisplay = Playfair_Display({
  display: "swap",
  preload: false,
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-playfair-display",
  weight: "variable"
})

export const libreBarcode = Libre_Barcode_128({
  display: "swap",
  preload: false,
  subsets: ["latin"],
  variable: "--font-libre-barcode",
  weight: "400"
})

export const funnelDisplay = Funnel_Display({
  display: "swap",
  preload: true,
  subsets: ["latin"],
  variable: "--font-funnel",
  weight: "variable"
})
