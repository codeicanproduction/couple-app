'use client'

import { useRouter } from 'next/navigation'
import { ClipboardList, ArrowRight, SkipForward } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export default function OnboardingAssessmentPage() {
  const router = useRouter()

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-50">
          <ClipboardList className="h-7 w-7 text-rose" strokeWidth={2} />
        </div>
        <h1 className="text-2xl font-bold text-ink">Assessment Hubungan</h1>
        <p className="mt-2 text-sm text-ink-muted">
          Kenali lebih dalam kekuatan dan area pertumbuhan hubunganmu melalui 30 pertanyaan singkat.
        </p>
      </div>

      <div className="mb-8 space-y-3">
        {[
          'Hanya 15–20 menit',
          'Hasil langsung terlihat',
          'Privat untuk kalian berdua',
        ].map(item => (
          <div key={item} className="flex items-center gap-3 text-sm text-ink">
            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-rose/10">
              <div className="h-2 w-2 rounded-full bg-rose" />
            </div>
            {item}
          </div>
        ))}
      </div>

      <div className="space-y-3">
        <Button
          onClick={() => router.push('/app/assessment')}
          size="lg"
        >
          <span className="flex items-center gap-2">
            Mulai Assessment
            <ArrowRight className="h-4 w-4" />
          </span>
        </Button>

        <button
          onClick={() => router.push('/onboarding/install')}
          className="flex w-full items-center justify-center gap-2 py-3 text-sm font-medium text-ink-muted transition-colors hover:text-ink"
        >
          <SkipForward className="h-4 w-4" />
          Lewati dulu
        </button>
      </div>
    </div>
  )
}
