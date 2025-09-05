import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { Playfair_Display, Source_Sans_3 } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { LanguageProvider } from "@/hooks/use-language"
import dynamic from "next/dynamic"
import { AuthProvider } from "@/contexts/AuthContext"
import { LearningProvider } from "@/contexts/LearningContext"
import { TradingProvider } from "@/contexts/TradingContext"

// Dynamically import background component to prevent SSR issues with Three.js
const StockMarketBackground = dynamic(() => import("@/components/stock-market-background"), {
  ssr: false,
  loading: () => (
    <div className="fixed inset-0 -z-10 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900" />
  )
})
import { GamificationProvider } from "@/contexts/GamificationContext"

const playfair = Playfair_Display({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-playfair",
  preload: true,
})

const sourceSans = Source_Sans_3({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-source-sans",
  preload: true,
})

export const metadata: Metadata = {
  title: "StockLearn | Interactive Stock Market Education",
  description:
    "Master stock market basics, risk assessment, algorithmic trading, and portfolio diversification through interactive tutorials, quizzes, and virtual trading.",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${playfair.variable} ${sourceSans.variable}`}>
      <body className="font-sans">
        <AuthProvider>
          <LearningProvider>
            <TradingProvider>
              <GamificationProvider>
                <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
                  <LanguageProvider>
                    <div className="min-h-screen bg-background/95 backdrop-blur-sm relative">
                      <StockMarketBackground />
                      <div className="relative z-10">
                        {children}
                      </div>
                    </div>
                  </LanguageProvider>
                </ThemeProvider>
              </GamificationProvider>
            </TradingProvider>
          </LearningProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
