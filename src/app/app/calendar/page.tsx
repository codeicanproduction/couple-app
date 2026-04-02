'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import {
  Plus, Trash2, CalendarDays, Gift, Heart, Star, Bell,
  MapPin, Wallet, Sparkles, ChevronRight, ChevronLeft, RefreshCw, Users, User,
} from 'lucide-react'
import { createClient } from '@/lib/supabase'
import { daysUntil, getNextOccurrence, formatDateID } from '@/lib/dates'
import { getRandomDateIdea, type DateIdea } from '@/data/dateIdeas'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'

interface CoupleEvent {
  id: string
  title: string
  event_date: string
  event_type: string
  is_recurring: boolean
  description: string | null
  location: string | null
  event_scope: string | null
  budget: number | null
  is_completed: boolean | null
}

type Tab = 'semua' | 'personal' | 'partner' | 'couple'

const EVENT_ICONS: Record<string, typeof Heart> = {
  anniversary: Heart, birthday: Gift, milestone: Star,
  date_plan: MapPin, reminder: Bell, event: CalendarDays, other: CalendarDays,
}

const EVENT_COLORS: Record<string, string> = {
  anniversary: 'bg-rose/10 text-rose', birthday: 'bg-gold/20 text-yellow-700',
  milestone: 'bg-sage/20 text-sage-dark', date_plan: 'bg-purple-100 text-purple-600',
  reminder: 'bg-blue-50 text-blue-600', event: 'bg-ink/5 text-ink-muted', other: 'bg-ink/5 text-ink-muted',
}

const EVENT_DOT_COLORS: Record<string, string> = {
  anniversary: 'bg-rose', birthday: 'bg-yellow-500',
  milestone: 'bg-sage', date_plan: 'bg-purple-500',
  reminder: 'bg-blue-500', event: 'bg-ink-muted', other: 'bg-ink-muted',
}

const SCOPE_LABELS: Record<string, { icon: typeof Users; label: string }> = {
  couple: { icon: Users, label: 'Bersama' },
  personal: { icon: User, label: 'Pribadi' },
  partner: { icon: Heart, label: 'Pasangan' },
}

const MONTH_NAMES = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember']
const DAY_NAMES = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min']

function toDateKey(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

function countdownText(days: number): string {
  if (days === 0) return 'Hari ini'
  if (days === 1) return 'Besok'
  if (days < 0) return `${Math.abs(days)}h lalu`
  return `${days} hari lagi`
}

function dayName(dateStr: string): string {
  const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu']
  return days[new Date(dateStr + 'T00:00:00').getDay()]
}

export default function CalendarPage() {
  const [coupleId, setCoupleId] = useState<string | null>(null)
  const [userId, setUserId] = useState<string | null>(null)
  const [userName, setUserName] = useState<string | null>(null)
  const [partnerId, setPartnerId] = useState<string | null>(null)
  const [events, setEvents] = useState<CoupleEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<Tab>('semua')
  const [modalOpen, setModalOpen] = useState(false)
  const [datePlanModal, setDatePlanModal] = useState(false)
  const [selectedDate, setSelectedDate] = useState<string | null>(null)

  // Calendar navigation
  const now = new Date()
  const [calMonth, setCalMonth] = useState(now.getMonth())
  const [calYear, setCalYear] = useState(now.getFullYear())

  // Form state
  const [newTitle, setNewTitle] = useState('')
  const [newDate, setNewDate] = useState('')
  const [newType, setNewType] = useState('event')
  const [newScope, setNewScope] = useState('couple')
  const [newRecurring, setNewRecurring] = useState(false)
  const [newDescription, setNewDescription] = useState('')
  const [newLocation, setNewLocation] = useState('')
  const [newBudget, setNewBudget] = useState('')
  const [saving, setSaving] = useState(false)

  const [dateIdea, setDateIdea] = useState<DateIdea | null>(null)

  const loadData = useCallback(async () => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    setUserId(user.id)

    const { data: membership } = await supabase
      .from('couple_members').select('couple_id').eq('profile_id', user.id).single()

    if (!membership?.couple_id) { setLoading(false); return }
    setCoupleId(membership.couple_id)

    // Load my name + partner id
    const { data: myProfile } = await supabase.from('profiles').select('name').eq('id', user.id).single()
    setUserName(myProfile?.name ?? null)
    const { data: members } = await supabase.from('couple_members').select('profile_id').eq('couple_id', membership.couple_id).neq('profile_id', user.id)
    if (members?.[0]) setPartnerId(members[0].profile_id)

    const { data } = await supabase
      .from('couple_events').select('*').eq('couple_id', membership.couple_id).order('event_date')

    setEvents(data ?? [])
    setLoading(false)
  }, [])

  useEffect(() => { loadData() }, [loadData])
  useEffect(() => { setDateIdea(getRandomDateIdea()) }, [])

  // Build a map of date -> events for calendar dots
  const eventsByDate = useMemo(() => {
    const map = new Map<string, CoupleEvent[]>()
    events.forEach(ev => {
      const next = ev.is_recurring ? getNextOccurrence(ev.event_date) : ev.event_date
      const key = next
      const list = map.get(key) ?? []
      list.push(ev)
      map.set(key, list)
    })
    return map
  }, [events])

  // Calendar grid
  const calendarDays = useMemo(() => {
    const firstDay = new Date(calYear, calMonth, 1)
    let startDow = firstDay.getDay() - 1 // Monday = 0
    if (startDow < 0) startDow = 6
    const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate()
    const prevMonthDays = new Date(calYear, calMonth, 0).getDate()

    const cells: Array<{ day: number; month: 'prev' | 'current' | 'next'; dateKey: string }> = []

    // Previous month padding
    for (let i = startDow - 1; i >= 0; i--) {
      const d = prevMonthDays - i
      const m = calMonth === 0 ? 11 : calMonth - 1
      const y = calMonth === 0 ? calYear - 1 : calYear
      cells.push({ day: d, month: 'prev', dateKey: `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}` })
    }
    // Current month
    for (let d = 1; d <= daysInMonth; d++) {
      cells.push({ day: d, month: 'current', dateKey: `${calYear}-${String(calMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}` })
    }
    // Next month padding to fill 6 rows
    const remaining = 42 - cells.length
    for (let d = 1; d <= remaining; d++) {
      const m = calMonth === 11 ? 0 : calMonth + 1
      const y = calMonth === 11 ? calYear + 1 : calYear
      cells.push({ day: d, month: 'next', dateKey: `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}` })
    }
    return cells
  }, [calMonth, calYear])

  const todayKey = toDateKey(now)

  function prevMonth() {
    if (calMonth === 0) { setCalMonth(11); setCalYear(y => y - 1) }
    else setCalMonth(m => m - 1)
    setSelectedDate(null)
  }
  function nextMonth() {
    if (calMonth === 11) { setCalMonth(0); setCalYear(y => y + 1) }
    else setCalMonth(m => m + 1)
    setSelectedDate(null)
  }
  function goToday() {
    setCalMonth(now.getMonth())
    setCalYear(now.getFullYear())
    setSelectedDate(todayKey)
  }

  function resetForm() {
    setNewTitle(''); setNewDate(''); setNewType('event'); setNewScope('couple')
    setNewRecurring(false); setNewDescription(''); setNewLocation(''); setNewBudget('')
  }

  async function addEvent(e: React.FormEvent) {
    e.preventDefault()
    if (!coupleId || !userId || !newTitle.trim() || !newDate) return
    setSaving(true)
    const supabase = createClient()
    await supabase.from('couple_events').insert({
      couple_id: coupleId, title: newTitle.trim(), event_date: newDate,
      event_type: newType, is_recurring: newRecurring, event_scope: newScope,
      description: newDescription || null, location: newLocation || null,
      budget: newBudget ? parseInt(newBudget.replace(/\D/g, ''), 10) : null,
      created_by: userId,
    })
    // Notify partner
    if (partnerId) {
      const typeLabel = newType === 'date_plan' ? 'date plan' : newType === 'reminder' ? 'pengingat' : 'acara'
      try {
        await fetch('/api/push/send', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            recipientId: partnerId,
            title: 'Nanti Kita',
            body: `${userName ?? 'Pasanganmu'} menambahkan ${typeLabel}: "${newTitle.trim()}"`,
            url: '/app/calendar',
          }),
        })
      } catch { /* optional */ }
    }

    resetForm(); setSaving(false); setModalOpen(false); setDatePlanModal(false)
    loadData()
  }

  function openDatePlanFromIdea(idea: DateIdea) {
    setNewTitle(idea.title); setNewDescription(idea.description)
    setNewType('date_plan'); setNewScope('couple'); setDatePlanModal(true)
  }

  async function deleteEvent(id: string) {
    const supabase = createClient()
    await supabase.from('couple_events').delete().eq('id', id)
    setEvents(prev => prev.filter(ev => ev.id !== id))
  }

  async function toggleComplete(ev: CoupleEvent) {
    const supabase = createClient()
    await supabase.from('couple_events').update({ is_completed: !ev.is_completed }).eq('id', ev.id)
    setEvents(prev => prev.map(e => e.id === ev.id ? { ...e, is_completed: !e.is_completed } : e))
  }

  // Filter events by scope — if a date is selected on calendar, filter to that date
  const filtered = events.filter(ev => {
    if (tab === 'personal') return ev.event_scope === 'personal'
    if (tab === 'partner') return ev.event_scope === 'partner'
    if (tab === 'couple') return ev.event_scope === 'couple'
    return true
  })

  const sorted = [...filtered].map(ev => {
    const next = ev.is_recurring ? getNextOccurrence(ev.event_date) : ev.event_date
    return { ...ev, nextDate: next, daysLeft: daysUntil(next) }
  }).filter(ev => {
    if (selectedDate) return ev.nextDate === selectedDate
    return true
  }).sort((a, b) => a.daysLeft - b.daysLeft)

  if (loading) {
    return <div className="flex items-center justify-center py-20"><div className="h-6 w-6 animate-spin rounded-full border-2 border-rose border-t-transparent" /></div>
  }

  const TABS: { key: Tab; label: string; count: number }[] = [
    { key: 'semua', label: 'Semua', count: events.length },
    { key: 'personal', label: 'Acara Saya', count: events.filter(e => e.event_scope === 'personal').length },
    { key: 'partner', label: 'Pasangan', count: events.filter(e => e.event_scope === 'partner').length },
    { key: 'couple', label: 'Bersama', count: events.filter(e => e.event_scope === 'couple').length },
  ]

  return (
    <div className="animate-fade-in pb-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border bg-white px-6 py-4">
        <div>
          <h1 className="text-xl font-bold text-ink">Kalender</h1>
          <p className="text-xs text-ink-muted">Tanggal penting & date plan</p>
        </div>
        <button onClick={() => { resetForm(); setModalOpen(true) }}
          className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose text-white shadow-sm">
          <Plus className="h-4 w-4" />
        </button>
      </div>

      {/* ===== CALENDAR GRID ===== */}
      <div className="bg-white px-4 pb-3 pt-2">
        {/* Month nav */}
        <div className="mb-3 flex items-center justify-between">
          <button onClick={prevMonth} className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-cream">
            <ChevronLeft className="h-4 w-4 text-ink-muted" />
          </button>
          <button onClick={goToday} className="flex items-center gap-1.5">
            <span className="text-sm font-bold text-ink">{MONTH_NAMES[calMonth]}</span>
            <span className="text-sm text-ink-muted">{calYear}</span>
          </button>
          <button onClick={nextMonth} className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-cream">
            <ChevronRight className="h-4 w-4 text-ink-muted" />
          </button>
        </div>

        {/* Day headers */}
        <div className="mb-1 grid grid-cols-7 text-center">
          {DAY_NAMES.map(d => (
            <div key={d} className="py-1 text-[10px] font-semibold uppercase tracking-wider text-ink-muted/60">{d}</div>
          ))}
        </div>

        {/* Calendar cells */}
        <div className="grid grid-cols-7">
          {calendarDays.map((cell, i) => {
            const dayEvents = eventsByDate.get(cell.dateKey) ?? []
            const isToday = cell.dateKey === todayKey
            const isSelected = cell.dateKey === selectedDate
            const isOtherMonth = cell.month !== 'current'

            return (
              <button
                key={i}
                onClick={() => setSelectedDate(isSelected ? null : cell.dateKey)}
                className={`relative flex flex-col items-center py-1.5 transition-all ${
                  isOtherMonth ? 'opacity-30' : ''
                }`}
              >
                <span className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-medium transition-all ${
                  isSelected
                    ? 'bg-rose text-white font-bold scale-110'
                    : isToday
                      ? 'bg-rose/10 text-rose font-bold ring-1 ring-rose/30'
                      : 'text-ink hover:bg-cream'
                }`}>
                  {cell.day}
                </span>
                {/* Event dots */}
                {dayEvents.length > 0 && (
                  <div className="mt-0.5 flex gap-0.5">
                    {dayEvents.slice(0, 3).map((ev, j) => (
                      <span key={j} className={`h-1 w-1 rounded-full ${
                        isSelected ? 'bg-white' : (EVENT_DOT_COLORS[ev.event_type] ?? 'bg-ink-muted')
                      }`} />
                    ))}
                  </div>
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* Selected date header */}
      {selectedDate && (
        <div className="mx-6 mt-3 flex items-center justify-between">
          <div>
            <p className="text-sm font-bold text-ink">{dayName(selectedDate)}, {formatDateID(selectedDate)}</p>
            <p className="text-xs text-ink-muted">{countdownText(daysUntil(selectedDate))}</p>
          </div>
          <button onClick={() => setSelectedDate(null)} className="rounded-lg px-2.5 py-1 text-xs font-semibold text-rose hover:bg-rose/5">
            Lihat semua
          </button>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 border-b border-border bg-white px-6 py-2 mt-2">
        {TABS.map(t => (
          <button key={t.key} onClick={() => { setTab(t.key); setSelectedDate(null) }}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
              tab === t.key ? 'bg-rose text-white' : 'text-ink-muted hover:bg-cream'
            }`}>
            {t.label}
            {t.count > 0 && <span className={`rounded-full px-1.5 text-[10px] ${
              tab === t.key ? 'bg-white/20' : 'bg-border'
            }`}>{t.count}</span>}
          </button>
        ))}
      </div>

      <div className="px-6 pt-4 space-y-4">
        {/* Date Idea Suggestion Card */}
        {!selectedDate && dateIdea && (
          <div className="rounded-2xl border border-purple-200 bg-gradient-to-br from-purple-50 to-rose-50 p-4">
            <div className="mb-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-purple-500" />
                <span className="text-xs font-bold uppercase tracking-wider text-purple-600">Ide Date</span>
              </div>
              <button onClick={() => setDateIdea(getRandomDateIdea())}
                className="rounded-lg p-1 text-purple-400 hover:text-purple-600">
                <RefreshCw className="h-3.5 w-3.5" />
              </button>
            </div>
            <p className="text-sm font-bold text-ink">{dateIdea.title}</p>
            <p className="mt-0.5 text-xs text-ink-muted">{dateIdea.description}</p>
            <div className="mt-2 flex items-center justify-between">
              <span className="flex items-center gap-1 text-xs text-ink-muted">
                <Wallet className="h-3 w-3" /> {dateIdea.estimatedBudget}
              </span>
              <button onClick={() => openDatePlanFromIdea(dateIdea)}
                className="flex items-center gap-1 text-xs font-bold text-purple-600 hover:underline">
                Jadikan Date Plan <ChevronRight className="h-3 w-3" />
              </button>
            </div>
          </div>
        )}

        {/* Event List */}
        {sorted.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <CalendarDays className="mb-3 h-10 w-10 text-ink-muted/30" strokeWidth={1.5} />
            <p className="text-sm font-semibold text-ink-muted">
              {selectedDate ? 'Tidak ada acara di tanggal ini' : tab === 'personal' ? 'Belum ada acara pribadi' : tab === 'partner' ? 'Belum ada acara pasangan' : tab === 'couple' ? 'Belum ada acara bersama' : 'Belum ada acara'}
            </p>
            <p className="text-xs text-ink-muted/60">Ketuk + untuk menambahkan</p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {sorted.map(ev => {
              const Icon = EVENT_ICONS[ev.event_type] ?? CalendarDays
              const colorClass = EVENT_COLORS[ev.event_type] ?? EVENT_COLORS.other
              const isToday = ev.daysLeft === 0
              const isPast = ev.daysLeft < 0 && !ev.is_recurring
              const scopeInfo = ev.event_scope ? SCOPE_LABELS[ev.event_scope] : undefined

              return (
                <div key={ev.id}
                  className={`rounded-2xl border bg-white shadow-card overflow-hidden ${
                    isToday ? 'border-rose' : ev.is_completed ? 'border-sage/30 opacity-60' : 'border-border'
                  }`}>
                  <div className="flex items-center gap-3 p-4">
                    <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl ${colorClass}`}>
                      <Icon className="h-5 w-5" strokeWidth={2} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-semibold truncate ${ev.is_completed ? 'line-through text-ink-muted' : 'text-ink'}`}>
                        {ev.title}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <p className="text-xs text-ink-muted">
                          {dayName(ev.nextDate)}, {formatDateID(ev.nextDate)}
                        </p>
                        {ev.is_recurring && <span className="text-[10px] text-ink-muted/50">tiap tahun</span>}
                        {scopeInfo && (
                          <span className="flex items-center gap-0.5 text-[10px] text-ink-muted/50">
                            <scopeInfo.icon className="h-2.5 w-2.5" /> {scopeInfo.label}
                          </span>
                        )}
                      </div>
                    </div>
                    <span className={`rounded-full px-2.5 py-1 text-xs font-bold whitespace-nowrap ${
                      ev.is_completed ? 'bg-sage/10 text-sage-dark'
                        : isToday ? 'bg-rose text-white'
                        : isPast ? 'bg-ink/5 text-ink-muted'
                        : ev.daysLeft <= 7 ? 'bg-rose/10 text-rose'
                        : ev.daysLeft <= 30 ? 'bg-gold/20 text-yellow-700'
                        : 'bg-sage/20 text-sage-dark'
                    }`}>
                      {ev.is_completed ? 'Selesai' : countdownText(ev.daysLeft)}
                    </span>
                  </div>

                  {(ev.description || ev.location || ev.budget) && (
                    <div className="border-t border-border px-4 py-2.5 flex items-center gap-3 text-xs text-ink-muted">
                      {ev.location && <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{ev.location}</span>}
                      {ev.budget && <span className="flex items-center gap-1"><Wallet className="h-3 w-3" />Rp {Number(ev.budget).toLocaleString('id-ID')}</span>}
                      {ev.description && !ev.location && !ev.budget && <span>{ev.description}</span>}
                    </div>
                  )}

                  {ev.event_type === 'date_plan' && (
                    <div className="flex border-t border-border">
                      <button onClick={() => toggleComplete(ev)}
                        className="flex-1 py-2 text-xs font-semibold text-sage-dark hover:bg-sage/5">
                        {ev.is_completed ? 'Belum selesai' : 'Tandai selesai'}
                      </button>
                      <div className="w-px bg-border" />
                      <button onClick={() => deleteEvent(ev.id)}
                        className="px-4 py-2 text-xs text-ink-muted/40 hover:text-red-400">
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  )}
                  {ev.event_type !== 'date_plan' && (
                    <div className="flex justify-end border-t border-border px-4">
                      <button onClick={() => deleteEvent(ev.id)} className="py-2 text-ink-muted/30 hover:text-red-400">
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* ===== ADD EVENT MODAL ===== */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Tambah ke Kalender">
        <form onSubmit={addEvent} className="space-y-4">
          <input type="text" placeholder="Judul acara" value={newTitle} onChange={e => setNewTitle(e.target.value)} required
            className="w-full rounded-2xl border border-border bg-white px-4 py-3 text-sm font-medium focus:border-rose focus:outline-none focus:ring-2 focus:ring-rose/20" />
          <input type="date" value={newDate} onChange={e => setNewDate(e.target.value)} required
            className="w-full rounded-2xl border border-border bg-white px-4 py-3 text-sm focus:border-rose focus:outline-none focus:ring-2 focus:ring-rose/20" />
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-ink-muted">Jenis</label>
            <div className="grid grid-cols-3 gap-1.5">
              {[
                { value: 'event', label: 'Acara' }, { value: 'reminder', label: 'Pengingat' },
                { value: 'date_plan', label: 'Date Plan' }, { value: 'birthday', label: 'Ultah' },
                { value: 'anniversary', label: 'Anniversary' }, { value: 'milestone', label: 'Milestone' },
              ].map(opt => (
                <button key={opt.value} type="button" onClick={() => setNewType(opt.value)}
                  className={`rounded-lg border px-2 py-1.5 text-xs font-medium transition-colors ${
                    newType === opt.value ? 'border-rose bg-rose-50 text-rose' : 'border-border text-ink-muted hover:border-rose'
                  }`}>{opt.label}</button>
              ))}
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-ink-muted">Untuk siapa?</label>
            <div className="grid grid-cols-3 gap-1.5">
              {[
                { value: 'couple', label: 'Bersama', icon: Users },
                { value: 'personal', label: 'Pribadi', icon: User },
                { value: 'partner', label: 'Pasangan', icon: Heart },
              ].map(opt => {
                const ScopeIcon = opt.icon
                return (
                  <button key={opt.value} type="button" onClick={() => setNewScope(opt.value)}
                    className={`flex items-center justify-center gap-1 rounded-lg border px-2 py-1.5 text-xs font-medium transition-colors ${
                      newScope === opt.value ? 'border-rose bg-rose-50 text-rose' : 'border-border text-ink-muted hover:border-rose'
                    }`}>
                    <ScopeIcon className="h-3 w-3" /> {opt.label}
                  </button>
                )
              })}
            </div>
          </div>
          <input type="text" placeholder="Catatan (opsional)" value={newDescription} onChange={e => setNewDescription(e.target.value)}
            className="w-full rounded-2xl border border-border bg-white px-4 py-3 text-sm focus:border-rose focus:outline-none focus:ring-2 focus:ring-rose/20" />
          {newType === 'date_plan' && (
            <>
              <input type="text" placeholder="Lokasi (opsional)" value={newLocation} onChange={e => setNewLocation(e.target.value)}
                className="w-full rounded-2xl border border-border bg-white px-4 py-3 text-sm focus:border-rose focus:outline-none focus:ring-2 focus:ring-rose/20" />
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs text-ink-muted">Rp</span>
                <input type="text" inputMode="numeric" placeholder="Budget (opsional)" value={newBudget}
                  onChange={e => { const n = e.target.value.replace(/\D/g, ''); setNewBudget(n ? parseInt(n,10).toLocaleString('id-ID') : '') }}
                  className="w-full rounded-2xl border border-border bg-white py-3 pl-9 pr-4 text-sm focus:border-rose focus:outline-none focus:ring-2 focus:ring-rose/20" />
              </div>
            </>
          )}
          <label className="flex items-center gap-3 rounded-xl border border-border px-4 py-3">
            <input type="checkbox" checked={newRecurring} onChange={e => setNewRecurring(e.target.checked)}
              className="h-4 w-4 rounded border-border text-rose focus:ring-rose" />
            <span className="text-sm text-ink">Berulang setiap tahun</span>
          </label>
          <Button type="submit" loading={saving} size="lg">Simpan</Button>
        </form>
      </Modal>

      {/* ===== DATE PLAN FROM IDEA MODAL ===== */}
      <Modal open={datePlanModal} onClose={() => { setDatePlanModal(false); resetForm() }} title="Buat Date Plan">
        <form onSubmit={addEvent} className="space-y-4">
          <div className="rounded-xl bg-purple-50 p-3">
            <p className="text-sm font-bold text-purple-700">{newTitle}</p>
            <p className="text-xs text-purple-600/70">{newDescription}</p>
          </div>
          <div className="space-y-1">
            <label className="block text-xs font-semibold uppercase tracking-wider text-ink-muted">Kapan?</label>
            <input type="date" value={newDate} onChange={e => setNewDate(e.target.value)} required
              className="w-full rounded-2xl border border-border bg-white px-4 py-3 text-sm focus:border-rose focus:outline-none focus:ring-2 focus:ring-rose/20" />
          </div>
          <input type="text" placeholder="Lokasi (opsional)" value={newLocation} onChange={e => setNewLocation(e.target.value)}
            className="w-full rounded-2xl border border-border bg-white px-4 py-3 text-sm focus:border-rose focus:outline-none focus:ring-2 focus:ring-rose/20" />
          <Button type="submit" loading={saving} size="lg">Simpan Date Plan</Button>
        </form>
      </Modal>
    </div>
  )
}
