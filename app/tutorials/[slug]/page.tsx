import { TutorialContent } from "@/components/tutorial-content"
import { TutorialNavigation } from "@/components/tutorial-navigation"
import { TutorialProgress } from "@/components/tutorial-progress"

interface TutorialPageProps {
  params: {
    slug: string
  }
}

export default function TutorialPage({ params }: TutorialPageProps) {
  return (
    <div className="min-h-screen bg-background">
      <div className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <TutorialProgress slug={params.slug} />
        </div>
      </div>

      <main className="container mx-auto px-4 py-6">
        <div className="grid gap-6 lg:grid-cols-4">
          <div className="lg:col-span-3">
            <TutorialContent slug={params.slug} />
          </div>
          <div className="lg:col-span-1">
            <TutorialNavigation slug={params.slug} />
          </div>
        </div>
      </main>
    </div>
  )
}
