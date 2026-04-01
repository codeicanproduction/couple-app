import Link from 'next/link'
import { CalendarDays, ArrowRight } from 'lucide-react'
import { daysUntil, getNextOccurrence, formatDateShortID } from '@/lib/dates'

interface CoupleEvent {
  id: string
  title: string
  event_date: string
  event_type: string
  is_recurring: boolean
}

interface UpcomingDatesProps {
  events: CoupleEvent[]
}

function getCountdownLabel(daysLeft: number): { label: string; color: string } {
  if (daysLeft === 0) return { label: 'Hari ini!', color: 'bg-rose text-white' }
  if (daysLeft <= 7) return { label: `${daysLeft}h lagi`, color: 'bg-rose/10 text-rose' }
  if (daysLeft <= 30) return { label: `${daysLeft}h lagi`, color: 'bg-gold/20 text-yellow-700' }
  return { label: `${daysLeft}h lagi`, color: 'bg-sage/20 text-sage-dark' }
}

export default function UpcomingDates({ events }: UpcomingDatesProps) {
  if (events.length === 0) {
    return (
      <Link
        href="/app/calendar"
        className="mx-6 flex items-center justify-between rounded-2xl border border-dashed border-border bg-white p-4 shadow-card"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sage/20">
            <CalendarDays className="h-4.5 w-4.5 text-sage-dark" strokeWidth={2} />
          </div>
          <div>
            <p className="text-sm font-semibold text-ink">Tidak ada acara mendatang</p>
            <p className="text-xs text-ink-muted">Tambahkan di Kalender</p>
          </div>
        </div>
        <ArrowRight className="h-4 w-4 text-ink-muted" />
      </Link>
    )
  }

  const upcomingWithDays = events
    .map(event => {
      const nextDate: string = event.is_recurring
        ? getNextOccurrence(event.event_date)
        : event.event_date
      const days = daysUntil(nextDate)
      return { ...event, nextDate, daysLeft: days }
    })
    .filter(e => e.daysLeft >= 0)
    .sort((a, b) => a.daysLeft - b.daysLeft)
    .slice(0, 3)

  return (
    <div className="mx-6 overflow-hidden rounded-2xl border border-border bg-white shadow-card">
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <div className="flex items-center gap-2">
          <CalendarDays className="h-4 w-4 text-sage-dark" strokeWidth={2} />
          <span className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
            Acara Mendatang
          </span>
        </div>
        <Link href="/app/calendar" className="text-xs font-semibold text-rose">
          Lihat semua
        </Link>
      </div>

      <div className="divide-y divide-border">
        {upcomingWithDays.map(event => {
          const { label, color } = getCountdownLabel(event.daysLeft)
          return (
            <div key={event.id} className="flex items-center justify-between px-4 py-3">
              <div>
                <p className="text-sm font-medium text-ink">{event.title}</p>
                <p className="text-xs text-ink-muted">
                  {formatDateShortID(event.nextDate)}
                </p>
              </div>
              <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${color}`}>
                {label}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
