import { getRelationshipLevel } from '@/lib/dates'

interface CoupleHeaderProps {
  myName: string | null
  partnerName: string | null
  myAvatarUrl?: string | null
  partnerAvatarUrl?: string | null
  daysTogether: number
  relationshipStartDate: string | null
}

const LEVEL_COLORS: Record<string, { bg: string; text: string }> = {
  Benih: { bg: 'bg-gold/20', text: 'text-yellow-700' },
  Tumbuh: { bg: 'bg-sage/20', text: 'text-sage-dark' },
  Mekar: { bg: 'bg-rose/10', text: 'text-rose' },
  Abadi: { bg: 'bg-rose/20', text: 'text-rose-dark' },
}

function Avatar({ url, name, color }: { url?: string | null; name: string | null; color: string }) {
  if (url) {
    return (
      <div className="h-10 w-10 overflow-hidden rounded-full ring-2 ring-white">
        <img src={url} alt={name ?? ''} className="h-full w-full object-cover" />
      </div>
    )
  }
  return (
    <div className={`flex h-10 w-10 items-center justify-center rounded-full ring-2 ring-white ${color}`}>
      <span className="text-sm font-bold">{name?.[0]?.toUpperCase() ?? '?'}</span>
    </div>
  )
}

export default function CoupleHeader({
  myName, partnerName, myAvatarUrl, partnerAvatarUrl,
  daysTogether, relationshipStartDate,
}: CoupleHeaderProps) {
  const level = relationshipStartDate ? getRelationshipLevel(daysTogether) : null
  const levelStyle = level ? LEVEL_COLORS[level] ?? LEVEL_COLORS.Benih : null

  return (
    <div className="bg-white border-b border-border px-6 py-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex -space-x-2">
            <Avatar url={myAvatarUrl} name={myName} color="bg-rose/10 text-rose" />
            <Avatar url={partnerAvatarUrl} name={partnerName} color="bg-sage/20 text-sage-dark" />
          </div>
          <div>
            <p className="text-sm font-semibold text-ink">
              {myName ?? 'Kamu'} &amp; {partnerName ?? 'Pasangan'}
            </p>
            {relationshipStartDate ? (
              <p className="text-xs text-ink-muted">{daysTogether} hari bersama</p>
            ) : (
              <p className="text-xs text-ink-muted">Hubungkan profil pasanganmu</p>
            )}
          </div>
        </div>

        {level && levelStyle && (
          <span className={`rounded-full px-3 py-1 text-xs font-bold ${levelStyle.bg} ${levelStyle.text}`}>
            {level}
          </span>
        )}
      </div>
    </div>
  )
}
