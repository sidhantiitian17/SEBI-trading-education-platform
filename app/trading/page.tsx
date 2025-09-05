import { TradingHeader } from "@/components/trading-header"
import { TradingDashboard } from "@/components/trading-dashboard"
import { PerformanceOptimizer } from "@/components/performance-optimizer"

export default function TradingPage() {
  return (
    <div className="min-h-screen bg-background">
      <PerformanceOptimizer />
      <TradingHeader />
      <main className="container mx-auto px-4 py-6">
        <TradingDashboard />
      </main>
    </div>
  )
}
