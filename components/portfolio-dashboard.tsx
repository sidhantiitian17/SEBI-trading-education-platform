"use client"
import { PortfolioChart } from "@/components/portfolio-chart"
import { AssetAllocation } from "@/components/asset-allocation"
import { PerformanceMetrics } from "@/components/performance-metrics"
import { PositionsTable } from "@/components/positions-table"

export function PortfolioDashboard() {
  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <PortfolioChart />
        </div>
        <div>
          <AssetAllocation />
        </div>
      </div>

      <PerformanceMetrics />

      <PositionsTable />
    </div>
  )
}
