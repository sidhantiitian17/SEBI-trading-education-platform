import { ProgressHeader } from "@/components/progress-header"
import { ProgressDashboard } from "@/components/progress-dashboard"

export default function ProgressPage() {
  return (
    <div className="min-h-screen bg-background">
      <ProgressHeader />
      <main className="container mx-auto px-4 py-6">
        <ProgressDashboard />
      </main>
    </div>
  )
}
