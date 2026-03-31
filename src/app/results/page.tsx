'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  questions,
  DIMENSION_LABELS,
  DIMENSION_ICONS,
  type Dimension,
} from '@/data/questions'

interface DimensionScore {
  dimension: Dimension
  score: number
  maxScore: number
  percentage: number
}

function calculateScores(answers: Record<number, number | string>): DimensionScore[] {
  const dimensions: Dimension[] = [
    'komunikasi',
    'nilai_visi',
    'keuangan',
    'keluarga',
    'komitmen',
  ]

  return dimensions.map((dim) => {
    const dimQuestions = questions.filter((q) => q.dimension === dim)
    let score = 0
    let maxScore = 0

    dimQuestions.forEach((q) => {
      const answer = answers[q.id]
      if (q.type === 'agree_disagree' || q.type === 'scale') {
        score += typeof answer === 'number' ? answer : 3
        maxScore += 5
      } else if (q.type === 'priority') {
        // Priority questions always score 3/5 (neutral - they measure alignment, not readiness)
        score += 3
        maxScore += 5
      }
    })

    return {
      dimension: dim,
      score,
      maxScore,
      percentage: maxScore > 0 ? Math.round((score / maxScore) * 100) : 0,
    }
  })
}

function getOverallScore(scores: DimensionScore[]): number {
  const totalScore = scores.reduce((sum, s) => sum + s.score, 0)
  const totalMax = scores.reduce((sum, s) => sum + s.maxScore, 0)
  return Math.round((totalScore / totalMax) * 100)
}

function getScoreLabel(percentage: number): string {
  if (percentage >= 80) return 'Sangat Siap! 🎉'
  if (percentage >= 60) return 'Cukup Siap 👍'
  if (percentage >= 40) return 'Perlu Diskusi 💬'
  return 'Masih Perlu Waktu 🌱'
}

function getScoreColor(percentage: number): string {
  if (percentage >= 80) return 'text-green-600'
  if (percentage >= 60) return 'text-emerald-600'
  if (percentage >= 40) return 'text-amber-600'
  return 'text-red-500'
}

function getBarColor(percentage: number): string {
  if (percentage >= 80) return 'bg-green-500'
  if (percentage >= 60) return 'bg-emerald-500'
  if (percentage >= 40) return 'bg-amber-500'
  return 'bg-red-400'
}

export default function ResultsPage() {
  const [scores, setScores] = useState<DimensionScore[]>([])
  const [overall, setOverall] = useState(0)

  useEffect(() => {
    const stored = sessionStorage.getItem('assessment_answers')
    if (stored) {
      const answers = JSON.parse(stored)
      const calculated = calculateScores(answers)
      setScores(calculated)
      setOverall(getOverallScore(calculated))
    }
  }, [])

  if (scores.length === 0) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-6">
        <p className="mb-4 text-gray-500">Belum ada hasil assessment.</p>
        <Link
          href="/assessment"
          className="rounded-full bg-primary-500 px-6 py-3 font-semibold text-white"
        >
          Mulai Assessment
        </Link>
      </div>
    )
  }

  const strengths = scores.filter((s) => s.percentage >= 60)
  const growthAreas = scores.filter((s) => s.percentage < 60)

  return (
    <div className="min-h-screen px-6 py-8">
      {/* Overall score */}
      <div className="mb-8 rounded-2xl bg-gradient-to-br from-primary-50 to-pink-50 p-6 text-center">
        <p className="mb-2 text-sm font-medium text-gray-500">
          Skor Kesiapan Kamu
        </p>
        <p className={`text-6xl font-bold ${getScoreColor(overall)}`}>
          {overall}%
        </p>
        <p className={`mt-2 text-lg font-semibold ${getScoreColor(overall)}`}>
          {getScoreLabel(overall)}
        </p>
      </div>

      {/* Per-dimension breakdown */}
      <h3 className="mb-4 text-lg font-semibold text-gray-800">
        Breakdown per Dimensi
      </h3>
      <div className="mb-8 space-y-4">
        {scores.map((s) => (
          <div key={s.dimension} className="rounded-xl bg-gray-50 p-4">
            <div className="mb-2 flex items-center justify-between">
              <span className="font-medium text-gray-700">
                {DIMENSION_ICONS[s.dimension]} {DIMENSION_LABELS[s.dimension]}
              </span>
              <span className={`font-bold ${getScoreColor(s.percentage)}`}>
                {s.percentage}%
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-gray-200">
              <div
                className={`h-full rounded-full transition-all duration-700 ${getBarColor(s.percentage)}`}
                style={{ width: `${s.percentage}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Strengths */}
      {strengths.length > 0 && (
        <div className="mb-6">
          <h3 className="mb-3 text-lg font-semibold text-gray-800">
            💪 Kekuatan Kalian
          </h3>
          <div className="space-y-2">
            {strengths.map((s) => (
              <div
                key={s.dimension}
                className="rounded-lg bg-green-50 px-4 py-3 text-green-700"
              >
                {DIMENSION_ICONS[s.dimension]} {DIMENSION_LABELS[s.dimension]} —
                kalian sudah di jalur yang tepat!
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Growth areas */}
      {growthAreas.length > 0 && (
        <div className="mb-8">
          <h3 className="mb-3 text-lg font-semibold text-gray-800">
            🌱 Area untuk Bertumbuh
          </h3>
          <div className="space-y-2">
            {growthAreas.map((s) => (
              <div
                key={s.dimension}
                className="rounded-lg bg-amber-50 px-4 py-3 text-amber-700"
              >
                {DIMENSION_ICONS[s.dimension]} {DIMENSION_LABELS[s.dimension]} —
                coba diskusikan lebih dalam bersama pasangan.
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CTA */}
      <div className="space-y-3 pb-8">
        <Link
          href="/assessment"
          className="block rounded-full bg-primary-500 px-6 py-3 text-center font-semibold text-white transition hover:bg-primary-600"
        >
          Ulangi Assessment
        </Link>
        <Link
          href="/"
          className="block rounded-full border-2 border-gray-200 px-6 py-3 text-center font-semibold text-gray-600 transition hover:border-gray-300"
        >
          Kembali ke Beranda
        </Link>
      </div>
    </div>
  )
}
