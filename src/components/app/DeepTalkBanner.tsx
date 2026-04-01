'use client'

import { useRouter } from 'next/navigation'
import { ChevronRight } from 'lucide-react'

export default function DeepTalkBanner() {
  const router = useRouter()
  return (
    <button
      onClick={() => router.push('/app/games/deep-talk')}
      className="mx-4 flex w-[calc(100%-2rem)] items-center gap-4 overflow-hidden rounded-2xl bg-gradient-to-r from-rose to-[#c45a7a] p-4 text-left shadow-elevated transition-all active:scale-[0.98]"
    >
      <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-white/20 text-2xl backdrop-blur-sm">
        💬
      </div>
      <div className="flex-1">
        <p className="text-sm font-bold text-white">Deep Talk</p>
        <p className="text-xs text-white/75">5 pack percakapan mendalam berdua</p>
      </div>
      <ChevronRight className="h-4 w-4 flex-shrink-0 text-white/60" />
    </button>
  )
}
