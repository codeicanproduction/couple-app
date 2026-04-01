'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { MapPin, ArrowRight, RefreshCw, Sparkles } from 'lucide-react'
import { getRandomDateIdea, type DateIdea } from '@/data/dateIdeas'

interface DatePlanCardProps {
  nextDatePlan: { title: string; daysLeft: number } | null
}

export default function DatePlanCard({ nextDatePlan }: DatePlanCardProps) {
  const [idea, setIdea] = useState<DateIdea | null>(null)

  useEffect(() => {
    setIdea(getRandomDateIdea())
  }, [])

  // If there's an upcoming date plan, show countdown
  if (nextDatePlan) {
    return (
      <Link
        href="/app/calendar"
        className="mx-6 flex items-center gap-3 rounded-2xl border border-purple-200 bg-gradient-to-r from-purple-50 to-rose-50 p-4 shadow-card"
      >
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-purple-100">
          <MapPin className="h-5 w-5 text-purple-600" strokeWidth={2} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wider text-purple-500">Date Plan Mendatang</p>
          <p className="text-sm font-bold text-ink truncate">{nextDatePlan.title}</p>
        </div>
        <span className="rounded-full bg-purple-100 px-2.5 py-1 text-xs font-bold text-purple-600">
          {nextDatePlan.daysLeft === 0 ? 'Hari ini!' : `${nextDatePlan.daysLeft}h`}
        </span>
      </Link>
    )
  }

  // No date plan — show suggestion
  if (!idea) return null

  return (
    <div className="mx-6 rounded-2xl border border-purple-200 bg-gradient-to-br from-purple-50 to-white p-4 shadow-card">
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Sparkles className="h-3.5 w-3.5 text-purple-500" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-purple-500">Ide Date Hari Ini</span>
        </div>
        <button onClick={() => setIdea(getRandomDateIdea())} className="text-purple-400 hover:text-purple-600">
          <RefreshCw className="h-3.5 w-3.5" />
        </button>
      </div>
      <p className="text-sm font-bold text-ink">{idea.title}</p>
      <p className="mt-0.5 text-xs text-ink-muted">{idea.description}</p>
      <Link
        href="/app/calendar"
        className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-purple-600 hover:underline"
      >
        Buat date plan <ArrowRight className="h-3 w-3" />
      </Link>
    </div>
  )
}
