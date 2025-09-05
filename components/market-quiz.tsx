import React, { useState } from 'react'
import { motion } from 'framer-motion'

interface QuizQuestion {
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
}

const quizQuestions: QuizQuestion[] = [
  {
    question: "What does 'bull market' mean?",
    options: [
      "A market where prices are falling",
      "A market where prices are rising",
      "A market with no price movement",
      "A market controlled by large investors"
    ],
    correctAnswer: 1,
    explanation: "A bull market is characterized by rising stock prices and investor optimism."
  },
  {
    question: "What is diversification in investing?",
    options: [
      "Putting all money in one stock",
      "Spreading investments across different assets",
      "Only investing in bonds",
      "Trading frequently for quick profits"
    ],
    correctAnswer: 1,
    explanation: "Diversification means spreading your investments across different asset types to reduce risk."
  },
  {
    question: "What is a 'bear market'?",
    options: [
      "A market with rising prices",
      "A market with falling prices for an extended period",
      "A market with stable prices",
      "A market for bear-related stocks"
    ],
    correctAnswer: 1,
    explanation: "A bear market is when stock prices fall 20% or more from recent highs, lasting months or years."
  },
  {
    question: "What does P/E ratio stand for?",
    options: [
      "Price to Earnings ratio",
      "Profit to Expense ratio",
      "Performance to Equity ratio",
      "Portfolio to Earnings ratio"
    ],
    correctAnswer: 0,
    explanation: "P/E ratio compares a company's stock price to its earnings per share, helping assess valuation."
  },
  {
    question: "What is a dividend?",
    options: [
      "A type of stock option",
      "A portion of company profits paid to shareholders",
      "A fee for trading stocks",
      "A government tax on investments"
    ],
    correctAnswer: 1,
    explanation: "Dividends are payments made by companies to shareholders from their profits."
  }
]

interface MarketQuizProps {
  onComplete?: (score: number) => void
}

export default function MarketQuiz({ onComplete }: MarketQuizProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [score, setScore] = useState(0)
  const [showExplanation, setShowExplanation] = useState(false)
  const [quizCompleted, setQuizCompleted] = useState(false)

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex)
    setShowExplanation(true)

    if (answerIndex === quizQuestions[currentQuestion].correctAnswer) {
      setScore(score + 1)
    }
  }

  const nextQuestion = () => {
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setSelectedAnswer(null)
      setShowExplanation(false)
    } else {
      setQuizCompleted(true)
      onComplete?.(score + (selectedAnswer === quizQuestions[currentQuestion].correctAnswer ? 1 : 0))
    }
  }

  const restartQuiz = () => {
    setCurrentQuestion(0)
    setSelectedAnswer(null)
    setScore(0)
    setShowExplanation(false)
    setQuizCompleted(false)
  }

  if (quizCompleted) {
    const finalScore = score + (selectedAnswer === quizQuestions[currentQuestion].correctAnswer ? 1 : 0)
    const percentage = Math.round((finalScore / quizQuestions.length) * 100)

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card p-6 rounded-lg shadow-lg max-w-md mx-auto text-center"
      >
        <h3 className="text-2xl font-bold mb-4">Quiz Complete!</h3>
        <div className="mb-6">
          <div className="text-4xl font-bold text-primary mb-2">{percentage}%</div>
          <p className="text-muted-foreground">
            You got {finalScore} out of {quizQuestions.length} questions correct
          </p>
        </div>

        <div className="mb-6">
          {percentage >= 80 && (
            <div className="text-green-600 font-medium">Excellent! You're a market expert! 🏆</div>
          )}
          {percentage >= 60 && percentage < 80 && (
            <div className="text-blue-600 font-medium">Good job! Keep learning! 📈</div>
          )}
          {percentage < 60 && (
            <div className="text-orange-600 font-medium">Keep studying! You're getting there! 📚</div>
          )}
        </div>

        <button
          onClick={restartQuiz}
          className="w-full bg-primary text-primary-foreground py-2 px-4 rounded-md hover:bg-primary/90 transition-colors"
        >
          Take Quiz Again
        </button>
      </motion.div>
    )
  }

  const question = quizQuestions[currentQuestion]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card p-6 rounded-lg shadow-lg max-w-2xl mx-auto"
    >
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">Market Knowledge Quiz</h3>
          <span className="text-sm text-muted-foreground">
            Question {currentQuestion + 1} of {quizQuestions.length}
          </span>
        </div>

        <div className="w-full bg-muted rounded-full h-2 mb-4">
          <div
            className="bg-primary h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentQuestion + 1) / quizQuestions.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="mb-6">
        <h4 className="text-lg font-medium mb-4">{question.question}</h4>

        <div className="space-y-3">
          {question.options.map((option, index) => (
            <motion.button
              key={index}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleAnswerSelect(index)}
              disabled={selectedAnswer !== null}
              className={`w-full p-4 text-left rounded-md border transition-all ${
                selectedAnswer === null
                  ? 'border-border hover:border-primary hover:bg-primary/5'
                  : selectedAnswer === index
                  ? index === question.correctAnswer
                    ? 'border-green-500 bg-green-50 text-green-800'
                    : 'border-red-500 bg-red-50 text-red-800'
                  : index === question.correctAnswer && showExplanation
                  ? 'border-green-500 bg-green-50 text-green-800'
                  : 'border-border opacity-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-sm font-medium ${
                  selectedAnswer === index
                    ? index === question.correctAnswer
                      ? 'border-green-500 bg-green-500 text-white'
                      : 'border-red-500 bg-red-500 text-white'
                    : 'border-current'
                }`}>
                  {String.fromCharCode(65 + index)}
                </span>
                <span>{option}</span>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {showExplanation && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-muted p-4 rounded-md mb-4"
        >
          <h5 className="font-medium mb-2">Explanation:</h5>
          <p className="text-sm text-muted-foreground">{question.explanation}</p>
        </motion.div>
      )}

      {selectedAnswer !== null && (
        <div className="flex justify-between items-center">
          <div className="text-sm text-muted-foreground">
            Score: {score + (selectedAnswer === question.correctAnswer ? 1 : 0)} / {quizQuestions.length}
          </div>
          <button
            onClick={nextQuestion}
            className="bg-primary text-primary-foreground py-2 px-4 rounded-md hover:bg-primary/90 transition-colors"
          >
            {currentQuestion === quizQuestions.length - 1 ? 'Finish Quiz' : 'Next Question'}
          </button>
        </div>
      )}
    </motion.div>
  )
}
