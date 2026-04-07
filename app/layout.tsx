import type { Metadata, Viewport } from "next"
import localFont from "next/font/local"
import config from "@/lib/config"
import "./globals.css"

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

const geist = localFont({
  src: "./fonts/Geist-Medium.woff2",
  weight: "500",
  variable: "--font-geist-sans",
  display: "swap",
})

const geistMono = localFont({
  src: "./fonts/GeistMono-Medium.woff2",
  weight: "500",
  variable: "--font-geist-mono",
  display: "swap",
})

const grenette = localFont({
  src: "../public/fonts/GrenettePro-Regular.ttf",
  weight: "400",
  variable: "--font-grenette",
  display: "swap",
})

export const metadata: Metadata = {
  metadataBase: new URL(`https://${config.branding.domain}`),
  title: config.branding.name,
  description: config.branding.tagline,
  robots: { index: false, follow: false },
  icons: {
    icon: [
      { url: config.branding.favicon.light, media: "(prefers-color-scheme: light)" },
      { url: config.branding.favicon.dark, media: "(prefers-color-scheme: dark)" },
    ],
    apple: config.branding.favicon.apple,
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geist.variable} ${geistMono.variable} ${grenette.variable} h-full`}>
      <body className="h-full antialiased">
        <a href="#main-feed" className="skip-link">Skip to feed</a>
        {children}
        {process.env.NODE_ENV === "development" && (
          <div style={{
            position: "fixed", bottom: 8, left: 8, zIndex: 9999, pointerEvents: "none",
            background: "#1a6cf0", color: "#fff", fontSize: 10, fontFamily: "monospace",
            padding: "3px 8px", borderRadius: 4, opacity: 0.85,
          }}>
            {config.branding.name.toUpperCase()} · :{config.branding.port}
          </div>
        )}
      </body>
    </html>
  )
}
