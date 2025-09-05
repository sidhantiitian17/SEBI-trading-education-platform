import { PortfolioHeader } from "@/components/portfolio-header"
import { PortfolioDashboard } from "@/components/portfolio-dashboard"

export default function PortfolioPage() {
  return (
    <div className="min-h-screen bg-background">
      <PortfolioHeader />
      <main className="container mx-auto px-4 py-6">
        <PortfolioDashboard />
      </main>
    </div>
  )
}
