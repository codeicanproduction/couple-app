'use client'

interface SavingsRingProps {
  currentAmount: number
  targetAmount: number
  size?: number
}

function formatRupiah(amount: number): string {
  if (amount >= 1_000_000_000) return `Rp ${(amount / 1_000_000_000).toFixed(1)}M`
  if (amount >= 1_000_000) return `Rp ${(amount / 1_000_000).toFixed(1)}jt`
  if (amount >= 1_000) return `Rp ${(amount / 1_000).toFixed(0)}rb`
  return `Rp ${amount.toLocaleString('id-ID')}`
}

export default function SavingsRing({ currentAmount, targetAmount, size = 200 }: SavingsRingProps) {
  const progress = targetAmount > 0 ? Math.min(currentAmount / targetAmount, 1) : 0
  const radius = (size - 24) / 2
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference * (1 - progress)
  const progressPercent = Math.round(progress * 100)

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="-rotate-90"
        >
          {/* Background track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#F0EAE4"
            strokeWidth={12}
          />
          {/* Progress arc */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#F06B6B"
            strokeWidth={12}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-700"
          />
        </svg>

        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <p className="text-2xl font-bold text-ink">{progressPercent}%</p>
          <p className="text-xs text-ink-muted">tercapai</p>
        </div>
      </div>

      <div className="mt-3 text-center">
        <p className="text-base font-bold text-ink">{formatRupiah(currentAmount)}</p>
        <p className="text-xs text-ink-muted">dari {formatRupiah(targetAmount)}</p>
      </div>
    </div>
  )
}
