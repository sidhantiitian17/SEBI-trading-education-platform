import { QuizHeader } from "@/components/quiz-header"
import { QuizGrid } from "@/components/quiz-grid"

export default function QuizzesPage() {
  return (
    <div className="min-h-screen bg-background">
      <QuizHeader />
      <main className="container mx-auto px-4 py-6">
        <QuizGrid />
      </main>
    </div>
  )
}
