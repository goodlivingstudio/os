import type { Metadata, Viewport } from "next"
import localFont from "next/font/local"
import config from "@/lib/config"
import { TooltipProvider } from "@/components/ui/tooltip"
import "./globals.css"

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

const sohne = localFont({
  src: "./fonts/Sohne-Buch.otf",
  weight: "400",
  variable: "--font-sohne",
  display: "swap",
})

const sohneMono = localFont({
  src: "./fonts/SohneMono-Buch.otf",
  weight: "400",
  variable: "--font-sohne-mono",
  display: "swap",
})

const sohneSchmal = localFont({
  src: "./fonts/SohneSchmal-Halbfett.otf",
  weight: "600",
  variable: "--font-sohne-schmal",
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
    <html lang="en" className={`h-full ${sohne.variable} ${sohneMono.variable} ${sohneSchmal.variable}`}>
      <body className="h-full antialiased">
        <TooltipProvider>
        <a href="#main-feed" className="skip-link">Skip to feed</a>
        {children}
        </TooltipProvider>
        {process.env.NODE_ENV === "development" && (
          <div style={{
            position: "fixed", bottom: 8, left: 8, zIndex: 9999, pointerEvents: "none",
            background: "#1a6cf0", color: "#fff", fontSize: 10, fontFamily: "var(--font-sohne-mono), monospace",
            padding: "3px 8px", borderRadius: 4, opacity: 0.85,
          }}>
            {config.branding.name.toUpperCase()} · :{config.branding.port}
          </div>
        )}
      </body>
    </html>
  )
}
