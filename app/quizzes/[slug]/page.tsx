import { QuizInterface } from "@/components/quiz-interface"

interface QuizPageProps {
  params: {
    slug: string
  }
}

export default function QuizPage({ params }: QuizPageProps) {
  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-6">
        <QuizInterface slug={params.slug} />
      </main>
    </div>
  )
}
