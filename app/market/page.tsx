"use client"

import { MarketHeader } from "@/components/market-header"
import { MarketIndices } from "@/components/market-indices"
import { SectorPerformance } from "@/components/sector-performance"
import { MarketNews } from "@/components/market-news"
import { TopMovers } from "@/components/top-movers"
import { MarketHeatmap } from "@/components/market-heatmap"
import { EconomicCalendar } from "@/components/economic-calendar"

export default function MarketPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <MarketHeader />

      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Market Indices */}
        <MarketIndices />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            <MarketHeatmap />
            <SectorPerformance />
            <TopMovers />
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            <MarketNews />
            <EconomicCalendar />
          </div>
        </div>
      </main>
    </div>
  )
}
