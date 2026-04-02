'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import {
  LogOut, Heart, ChevronRight, Pencil, Check,
  Bell, User, Brain, Wallet, CalendarDays, Gamepad2,
  Mail, Share2, HelpCircle, Shield,
} from 'lucide-react'
import { createClient } from '@/lib/supabase'
import { daysSince, formatDateID, getRelationshipLevel } from '@/lib/dates'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import NotificationToggle from '@/components/app/NotificationToggle'
import AvatarUpload from '@/components/app/AvatarUpload'

interface ProfileData {
  name: string | null
  birthday: string | null
  relationship_start_date: string | null
  avatar_url: string | null
}

export default function ProfilePage() {
  const router = useRouter()
  const [userId, setUserId] = useState<string | null>(null)
  const [profile, setProfile] = useState<ProfileData | null>(null)
  const [inviteCode, setInviteCode] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [signingOut, setSigningOut] = useState(false)

  // Edit profile state
  const [editOpen, setEditOpen] = useState(false)
  const [editName, setEditName] = useState('')
  const [editBirthday, setEditBirthday] = useState('')
  const [editRelDate, setEditRelDate] = useState('')
  const [saving, setSaving] = useState(false)

  const loadData = useCallback(async () => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    setUserId(user.id)

    const { data: prof } = await supabase
      .from('profiles')
      .select('name, birthday, relationship_start_date, avatar_url')
      .eq('id', user.id).single()
    setProfile(prof)

    const { data: membership } = await supabase
      .from('couple_members').select('couple_id').eq('profile_id', user.id).single()

    if (membership?.couple_id) {
      const { data: allMembers } = await supabase
        .from('couple_members').select('profile_id').eq('couple_id', membership.couple_id)
      if ((allMembers?.length ?? 0) < 2) {
        const { data: couple } = await supabase
          .from('couples').select('invite_code').eq('id', membership.couple_id).single()
        setInviteCode(couple?.invite_code ?? null)
      }
    }
    setLoading(false)
  }, [])

  useEffect(() => { loadData() }, [loadData])

  function openEditProfile() {
    setEditName(profile?.name ?? '')
    setEditBirthday(profile?.birthday ?? '')
    setEditRelDate(profile?.relationship_start_date ?? '')
    setEditOpen(true)
  }

  async function saveProfile(e: React.FormEvent) {
    e.preventDefault()
    if (!userId || !editName.trim()) return
    setSaving(true)
    const supabase = createClient()
    await supabase.from('profiles').update({
      name: editName.trim(),
      birthday: editBirthday || null,
      relationship_start_date: editRelDate || null,
    }).eq('id', userId)
    setSaving(false)
    setEditOpen(false)
    loadData()
  }

  async function handleSignOut() {
    setSigningOut(true)
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/auth/login')
  }

  if (loading) {
    return <div className="flex items-center justify-center py-20"><div className="h-6 w-6 animate-spin rounded-full border-2 border-rose border-t-transparent" /></div>
  }

  const daysTogether = profile?.relationship_start_date ? daysSince(profile.relationship_start_date) : null
  const level = daysTogether !== null ? getRelationshipLevel(daysTogether) : null

  const MENU_ITEMS = [
    { icon: User, label: 'About Me', desc: 'MBTI, Love Language, dll', href: '/app/about-me' },
    { icon: Gamepad2, label: 'Games', desc: 'Samakan, Deep Talk, dll', href: '/app/games' },
    { icon: Wallet, label: 'Keuangan', desc: 'Tabungan & wishlist', href: '/app/finance' },
    { icon: CalendarDays, label: 'Kalender', desc: 'Tanggal penting & date plan', href: '/app/calendar' },
    { icon: Mail, label: 'Surat Rahasia', desc: 'Tulis surat terkunci', href: '/app/letters' },
  ]

  const SETTING_ITEMS = [
    { icon: Share2, label: 'Undang Pasangan', show: !!inviteCode, action: () => {
      const link = `${window.location.origin}/invite/${inviteCode}`
      navigator.clipboard.writeText(link)
      alert('Link undangan tersalin!')
    }},
    { icon: HelpCircle, label: 'Bantuan', show: true, action: () => {} },
    { icon: Shield, label: 'Kebijakan Privasi', show: true, action: () => {} },
  ]

  return (
    <div className="animate-fade-in pb-6">
      <div className="border-b border-border bg-white px-6 py-5">
        <h1 className="text-xl font-bold text-ink">Profil</h1>
      </div>

      <div className="space-y-5 px-6 pt-5">
        {/* ===== PROFILE CARD with edit ===== */}
        <div className="rounded-2xl border border-border bg-white p-5 shadow-card">
          <div className="flex items-center gap-4">
            {userId && (
              <AvatarUpload
                userId={userId}
                currentUrl={profile?.avatar_url ?? null}
                name={profile?.name ?? null}
                size="md"
                editable
                onUploaded={(url) => setProfile(p => p ? { ...p, avatar_url: url } : p)}
              />
            )}
            <div className="flex-1">
              <p className="text-lg font-bold text-ink">{profile?.name ?? 'Pengguna'}</p>
              {profile?.birthday && (
                <p className="text-xs text-ink-muted">Lahir: {formatDateID(profile.birthday)}</p>
              )}
            </div>
            <button onClick={openEditProfile} className="rounded-xl bg-cream p-2 hover:bg-rose-50">
              <Pencil className="h-4 w-4 text-ink-muted" />
            </button>
          </div>

          {daysTogether !== null && (
            <div className="mt-4 flex items-center gap-3 rounded-xl bg-rose-50 px-4 py-3">
              <Heart className="h-4 w-4 text-rose" strokeWidth={2} />
              <div className="flex-1">
                <p className="text-sm font-semibold text-ink">{daysTogether.toLocaleString('id-ID')} hari bersama</p>
                {profile?.relationship_start_date && (
                  <p className="text-xs text-ink-muted">Sejak {formatDateID(profile.relationship_start_date)}</p>
                )}
              </div>
              {level && (
                <span className="rounded-full bg-rose/10 px-3 py-1 text-xs font-bold text-rose">{level}</span>
              )}
            </div>
          )}
        </div>

        {/* ===== NOTIFICATION TOGGLE ===== */}
        <NotificationToggle />

        {/* ===== MENU LAINNYA ===== */}
        <div>
          <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-ink-muted/50">
            Menu Lainnya
          </p>
          <div className="rounded-2xl border border-border bg-white shadow-card overflow-hidden">
            {MENU_ITEMS.map((item, i) => {
              const Icon = item.icon
              return (
                <button key={item.label} onClick={() => router.push(item.href)}
                  className={`flex w-full items-center gap-3 px-4 py-3.5 text-left hover:bg-cream ${
                    i < MENU_ITEMS.length - 1 ? 'border-b border-border' : ''
                  }`}>
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cream">
                    <Icon className="h-4 w-4 text-ink-muted" strokeWidth={2} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-ink">{item.label}</p>
                    <p className="text-[11px] text-ink-muted">{item.desc}</p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-ink-muted/40" />
                </button>
              )
            })}
          </div>
        </div>

        {/* ===== SETTINGS ===== */}
        <div>
          <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-ink-muted/50">
            Pengaturan
          </p>
          <div className="rounded-2xl border border-border bg-white shadow-card overflow-hidden">
            {SETTING_ITEMS.filter(s => s.show).map((item, i, arr) => {
              const Icon = item.icon
              return (
                <button key={item.label} onClick={item.action}
                  className={`flex w-full items-center gap-3 px-4 py-3.5 text-left hover:bg-cream ${
                    i < arr.length - 1 ? 'border-b border-border' : ''
                  }`}>
                  <Icon className="h-4 w-4 text-ink-muted" strokeWidth={2} />
                  <span className="text-sm font-medium text-ink">{item.label}</span>
                  <ChevronRight className="ml-auto h-4 w-4 text-ink-muted/40" />
                </button>
              )
            })}
          </div>
        </div>

        {/* ===== SIGN OUT ===== */}
        <Button onClick={handleSignOut} loading={signingOut} variant="danger" size="lg">
          <span className="flex items-center gap-2"><LogOut className="h-4 w-4" /> Keluar</span>
        </Button>
      </div>

      {/* ===== EDIT PROFILE MODAL ===== */}
      <Modal open={editOpen} onClose={() => setEditOpen(false)} title="Edit Profil">
        <form onSubmit={saveProfile} className="space-y-4">
          <div className="space-y-1">
            <label className="block text-xs font-semibold uppercase tracking-wider text-ink-muted">Nama Panggilan</label>
            <input type="text" value={editName} onChange={e => setEditName(e.target.value)}
              placeholder="Nama kamu" required
              className="w-full rounded-2xl border border-border bg-white px-4 py-3 text-sm focus:border-rose focus:outline-none focus:ring-2 focus:ring-rose/20" />
          </div>
          <div className="space-y-1">
            <label className="block text-xs font-semibold uppercase tracking-wider text-ink-muted">Tanggal Lahir</label>
            <input type="date" value={editBirthday} onChange={e => setEditBirthday(e.target.value)}
              className="w-full rounded-2xl border border-border bg-white px-4 py-3 text-sm focus:border-rose focus:outline-none focus:ring-2 focus:ring-rose/20" />
          </div>
          <div className="space-y-1">
            <label className="block text-xs font-semibold uppercase tracking-wider text-ink-muted">Tanggal Mulai Bersama</label>
            <input type="date" value={editRelDate} onChange={e => setEditRelDate(e.target.value)}
              className="w-full rounded-2xl border border-border bg-white px-4 py-3 text-sm focus:border-rose focus:outline-none focus:ring-2 focus:ring-rose/20" />
          </div>
          <Button type="submit" loading={saving} size="lg">
            <span className="flex items-center gap-2"><Check className="h-4 w-4" /> Simpan</span>
          </Button>
        </form>
      </Modal>
    </div>
  )
}
