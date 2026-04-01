'use client'

import { useState, useEffect } from 'react'

interface SamakanCountdownProps {
  onComplete: () => void
}

export default function SamakanCountdown({ onComplete }: SamakanCountdownProps) {
  const [count, setCount] = useState(3)

  useEffect(() => {
    if (count === 0) {
      const t = setTimeout(onComplete, 800)
      return () => clearTimeout(t)
    }
    const t = setTimeout(() => setCount(c => c - 1), 1000)
    return () => clearTimeout(t)
  }, [count, onComplete])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-ink to-gray-900">
      <div
        key={count}
        className="animate-scale-in"
      >
        {count > 0 ? (
          <span className="text-8xl font-black text-white drop-shadow-lg">{count}</span>
        ) : (
          <span className="text-5xl font-black text-rose drop-shadow-lg">MAIN!</span>
        )}
      </div>
    </div>
  )
}
