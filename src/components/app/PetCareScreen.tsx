'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { CARE_ACTION_META, type CareAction } from '@/types/pet'
import { performCareAction, getCareLogsToday } from '@/lib/pet'

interface CareRole {
  id: string
  profile_id: string
  actions: string[]
}

interface Props {
  pet: { id: string; name: string; pet_type: string; level: number; created_at: string | null }
  careRoles: CareRole[]
  userId: string
  partnerId: string | null
  partnerName: string
}

const ACTION_EMOJIS: Record<CareAction, string> = {
  feed: '🍖', play: '🎾', bath: '🛁', treat: '🍪', walk: '🏃', cuddle: '💬',
}

const ACTION_COLORS: Record<string, string> = {
  feed: 'bg-[#FFE8E0]', play: 'bg-[#E0EEFF]', bath: 'bg-[#E0F5EC]',
  treat: 'bg-[#FFF8DC]', walk: 'bg-[#E0EEFF]', cuddle: 'bg-[#FFF8DC]',
}

export default function PetCareScreen({ pet, careRoles, userId, partnerId, partnerName }: Props) {
  const router = useRouter()
  const [doneLogs, setDoneLogs] = useState<{ action_type: string; done_by: string; done_at: string }[]>([])
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  const today = new Date()
  const daysSinceAdopt = pet.created_at ? Math.floor((Date.now() - new Date(pet.created_at).getTime()) / 86400000) : 0

  const loadLogs = useCallback(async () => {
    const logs = await getCareLogsToday(pet.id)
    setDoneLogs(logs as any)
    setLoading(false)
  }, [pet.id])

  useEffect(() => { loadLogs() }, [loadLogs])

  // Build care items list
  const myRole = careRoles.find(r => r.profile_id === userId)
  const partnerRole = careRoles.find(r => r.profile_id !== userId)
  const myActions = (myRole?.actions || []) as CareAction[]
  const partnerActions = (partnerRole?.actions || []) as CareAction[]
  const allActions = [...myActions, ...partnerActions]

  const isDoneByAnyone = (action: CareAction) => doneLogs.some(l => l.action_type === action)
  const getLogFor = (action: CareAction) => doneLogs.find(l => l.action_type === action)
  const totalTasks = allActions.length
  const doneTasks = allActions.filter(a => isDoneByAnyone(a)).length

  const handleAction = async (action: CareAction) => {
    if (actionLoading) return
    setActionLoading(action)
    try {
      const meta = CARE_ACTION_META[action]
      await performCareAction(pet.id, action, userId, meta)

      // Send push to partner
      if (partnerId) {
        fetch('/api/push/send', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            recipientId: partnerId,
            title: `${pet.name} dirawat! 🐾`,
            body: `Pasanganmu baru saja ${meta.label.toLowerCase()} ${pet.name}`,
            url: '/app/pet/care',
          }),
        }).catch(() => {})
      }

      await loadLogs()
    } catch (e) {
      console.error('Care action failed:', e)
    } finally {
      setActionLoading(null)
    }
  }

  const circumference = 2 * Math.PI * 19
  const progressOffset = circumference - (doneTasks / Math.max(totalTasks, 1)) * circumference

  return (
    <div className="min-h-[100dvh] bg-cream animate-fade-in">
      {/* Hero */}
      <div className="px-4 pt-4 pb-5" style={{ background: 'linear-gradient(160deg, #FFE0CC 0%, #FFF2E8 100%)' }}>
        <div className="flex items-center gap-3 mb-3.5">
          <button onClick={() => router.back()} className="p-1">
            <ArrowLeft className="w-5 h-5 text-ink" />
          </button>
          <div className="w-12 h-12 bg-[#FFD0B0] rounded-2xl flex items-center justify-center text-[26px]">
            {pet.pet_type === 'cat' ? '🐱' : '🐶'}
          </div>
          <div>
            <div className="text-[17px] font-bold text-ink">Rawat {pet.name}</div>
            <div className="text-[11px] text-ink-muted">
              {today.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long' })} · Hari ke-{daysSinceAdopt}
            </div>
          </div>
        </div>

        {/* Progress card */}
        <div className="bg-white/75 rounded-2xl p-3 flex items-center gap-3.5">
          <div className="relative w-12 h-12 flex-shrink-0">
            <svg className="transform -rotate-90" width="48" height="48">
              <circle cx="24" cy="24" r="19" fill="none" stroke="#F0E8E0" strokeWidth="4" />
              <circle
                cx="24" cy="24" r="19" fill="none" stroke="#F06B6B" strokeWidth="4"
                strokeDasharray={circumference}
                strokeDashoffset={progressOffset}
                strokeLinecap="round"
                className="transition-all duration-700"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center text-xs font-extrabold text-rose">
              {doneTasks}/{totalTasks}
            </div>
          </div>
          <div className="flex-1">
            <div className="text-xs font-bold text-ink">{doneTasks} dari {totalTasks} tugas selesai</div>
            <div className="text-[10px] text-ink-muted mt-0.5">
              {doneTasks === totalTasks ? 'Semua selesai! 🎉' : `${totalTasks - doneTasks} tugas belum dilakukan`}
            </div>
          </div>
          {doneTasks === totalTasks && (
            <div className="bg-[rgba(94,196,130,0.14)] text-[#3A9E5A] text-[10px] font-bold px-2.5 py-1.5 rounded-[10px]">
              +15 mood
            </div>
          )}
        </div>
      </div>

      {/* Care actions list */}
      <div className="p-3 flex flex-col gap-2">
        {/* My actions */}
        {myActions.map(action => {
          const done = isDoneByAnyone(action)
          const meta = CARE_ACTION_META[action]
          const isLoading = actionLoading === action
          const log = getLogFor(action)

          return (
            <div
              key={action}
              className={`relative bg-white rounded-[18px] p-3.5 flex items-center gap-3 transition-transform hover:translate-x-0.5 overflow-hidden ${done ? 'opacity-60' : ''}`}
            >
              {/* Left accent */}
              <div className={`absolute left-0 top-0 bottom-0 w-1 rounded-l-[18px] ${done ? 'bg-sage opacity-50' : 'bg-rose'}`} />

              <div className={`w-[42px] h-[42px] rounded-[14px] flex items-center justify-center text-[21px] flex-shrink-0 ${ACTION_COLORS[action]}`}>
                {ACTION_EMOJIS[action]}
              </div>
              <div className="flex-1">
                <div className="text-[13px] font-bold text-ink">{meta.label}</div>
                <div className={`text-[10px] font-semibold ${done ? 'text-sage-dark' : 'text-rose-dark'}`}>
                  {done
                    ? `Kamu · ${log ? formatTimeAgo(log.done_at) : ''} ✓`
                    : 'Tugasmu · belum dilakukan'}
                </div>
              </div>
              {done ? (
                <div className="bg-[#EEF9F4] text-sage-dark text-[11px] font-extrabold px-3.5 py-2 rounded-xl">
                  Selesai
                </div>
              ) : (
                <button
                  onClick={() => handleAction(action)}
                  disabled={isLoading}
                  className="bg-rose text-white text-[11px] font-extrabold px-3.5 py-2 rounded-xl shadow-[0_3px_10px_rgba(240,107,107,0.35)] hover:scale-105 transition-transform disabled:opacity-50"
                >
                  {isLoading ? '...' : 'Lakukan!'}
                </button>
              )}
            </div>
          )
        })}

        {/* Partner actions */}
        {partnerActions.map(action => {
          const done = isDoneByAnyone(action)
          const meta = CARE_ACTION_META[action]
          const log = getLogFor(action)

          return (
            <div
              key={action}
              className={`relative bg-white rounded-[18px] p-3.5 flex items-center gap-3 overflow-hidden ${done ? 'opacity-60' : ''}`}
            >
              <div className={`absolute left-0 top-0 bottom-0 w-1 rounded-l-[18px] ${done ? 'bg-sage opacity-50' : 'bg-[#7BA8E8]'}`} />

              <div className={`w-[42px] h-[42px] rounded-[14px] flex items-center justify-center text-[21px] flex-shrink-0 ${ACTION_COLORS[action]}`}>
                {ACTION_EMOJIS[action]}
              </div>
              <div className="flex-1">
                <div className="text-[13px] font-bold text-ink">{meta.label}</div>
                <div className={`text-[10px] font-semibold ${done ? 'text-sage-dark' : 'text-[#4A80CC]'}`}>
                  {done
                    ? `${partnerName} · ${log ? formatTimeAgo(log.done_at) : ''} ✓`
                    : `Tugas ${partnerName} · menunggu...`}
                </div>
              </div>
              {done ? (
                <div className="bg-[#EEF9F4] text-sage-dark text-[11px] font-extrabold px-3.5 py-2 rounded-xl">
                  Selesai
                </div>
              ) : (
                <div className="bg-[#EEF3FC] text-[#4A80CC] text-[11px] font-extrabold px-3.5 py-2 rounded-xl">
                  Nunggu
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

function formatTimeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'baru saja'
  if (mins < 60) return `${mins} menit lalu`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours} jam lalu`
  return 'kemarin'
}
