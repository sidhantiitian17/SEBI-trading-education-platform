import { TutorialGrid } from "@/components/tutorial-grid"
import { TutorialHeader } from "@/components/tutorial-header"

export default function TutorialsPage() {
  return (
    <div className="min-h-screen bg-background">
      <TutorialHeader />
      <main className="container mx-auto px-4 py-6">
        <TutorialGrid />
      </main>
    </div>
  )
}
