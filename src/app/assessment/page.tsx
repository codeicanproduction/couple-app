'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { questions, DIMENSION_LABELS, type Dimension } from '@/data/questions'

type Answers = Record<number, number | string>

export default function AssessmentPage() {
  const router = useRouter()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState<Answers>({})

  const question = questions[currentIndex]
  const progress = ((currentIndex + 1) / questions.length) * 100

  function handleAnswer(value: number | string) {
    const newAnswers = { ...answers, [question.id]: value }
    setAnswers(newAnswers)

    if (currentIndex < questions.length - 1) {
      setTimeout(() => setCurrentIndex(currentIndex + 1), 300)
    } else {
      // Store answers and navigate to results
      sessionStorage.setItem('assessment_answers', JSON.stringify(newAnswers))
      router.push('/results')
    }
  }

  const agreeOptions = [
    { value: 1, label: 'Sangat Tidak Setuju', color: 'bg-red-100 text-red-700 border-red-200' },
    { value: 2, label: 'Tidak Setuju', color: 'bg-orange-100 text-orange-700 border-orange-200' },
    { value: 3, label: 'Netral', color: 'bg-gray-100 text-gray-700 border-gray-200' },
    { value: 4, label: 'Setuju', color: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
    { value: 5, label: 'Sangat Setuju', color: 'bg-green-100 text-green-700 border-green-200' },
  ]

  const scaleLabels = ['Jarang', '', '', '', 'Selalu']

  return (
    <div className="flex min-h-screen flex-col px-6 py-8">
      {/* Progress bar */}
      <div className="mb-2 flex items-center justify-between text-sm text-gray-400">
        <span>{currentIndex + 1} / {questions.length}</span>
        <span className="rounded-full bg-primary-50 px-3 py-1 text-xs font-medium text-primary-600">
          {DIMENSION_LABELS[question.dimension]}
        </span>
      </div>
      <div className="mb-8 h-2 overflow-hidden rounded-full bg-gray-100">
        <div
          className="h-full rounded-full bg-primary-500 transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Question */}
      <div className="flex flex-1 flex-col justify-center">
        <h2 className="mb-8 text-xl font-semibold leading-relaxed text-gray-800">
          {question.text}
        </h2>

        {/* Answer options */}
        <div className="space-y-3">
          {question.type === 'agree_disagree' &&
            agreeOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => handleAnswer(opt.value)}
                className={`w-full rounded-xl border-2 px-4 py-3 text-left font-medium transition hover:scale-[1.02] active:scale-95 ${
                  answers[question.id] === opt.value
                    ? 'border-primary-500 bg-primary-50 text-primary-700'
                    : `${opt.color} border-transparent`
                }`}
              >
                {opt.label}
              </button>
            ))}

          {question.type === 'scale' && (
            <div className="space-y-4">
              <input
                type="range"
                min={1}
                max={5}
                step={1}
                value={answers[question.id] ?? 3}
                onChange={(e) => handleAnswer(Number(e.target.value))}
                className="w-full accent-primary-500"
              />
              <div className="flex justify-between text-xs text-gray-400">
                {scaleLabels.map((label, i) => (
                  <span key={i}>{label}</span>
                ))}
              </div>
              <button
                onClick={() => handleAnswer(answers[question.id] ?? 3)}
                className="w-full rounded-xl bg-primary-500 px-4 py-3 font-semibold text-white transition hover:bg-primary-600 active:scale-95"
              >
                Lanjut
              </button>
            </div>
          )}

          {question.type === 'priority' &&
            question.options?.map((opt) => (
              <button
                key={opt}
                onClick={() => handleAnswer(opt)}
                className={`w-full rounded-xl border-2 px-4 py-4 text-left font-medium transition hover:scale-[1.02] active:scale-95 ${
                  answers[question.id] === opt
                    ? 'border-primary-500 bg-primary-50 text-primary-700'
                    : 'border-gray-200 bg-gray-50 text-gray-700'
                }`}
              >
                {opt}
              </button>
            ))}
        </div>
      </div>

      {/* Back button */}
      {currentIndex > 0 && (
        <button
          onClick={() => setCurrentIndex(currentIndex - 1)}
          className="mt-8 text-sm text-gray-400 transition hover:text-gray-600"
        >
          ← Kembali
        </button>
      )}
    </div>
  )
}
