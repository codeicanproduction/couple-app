'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  Plus, Minus, Check, TrendingUp, Calendar, Pencil, ChevronRight, Heart,
  Sparkles, Award, ArrowDownLeft, ArrowUpRight,
} from 'lucide-react'
import { createClient } from '@/lib/supabase'
import { formatDateID } from '@/lib/dates'
import Link from 'next/link'
import SavingsWizard from '@/components/app/SavingsWizard'
import AddTransactionModal from '@/components/app/AddTransactionModal'
import TransactionList from '@/components/app/TransactionList'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'

interface SavingsGoal {
  id: string; name: string; current_amount: number; target_amount: number
  target_date: string | null; created_at: string
}
interface Transaction {
  id: string; amount: number; type: string; category: string | null
  note: string | null; created_by: string; created_at: string | null
}
function fmtRp(n: number): string {
  const abs = Math.abs(n)
  if (abs >= 1_000_000_000) return `Rp${(abs / 1_000_000_000).toFixed(1)}M`
  if (abs >= 1_000_000) return `Rp${(abs / 1_000_000).toFixed(1)}jt`
  if (abs >= 1_000) return `Rp${(abs / 1_000).toFixed(0)}rb`
  return `Rp${abs.toLocaleString('id-ID')}`
}
function fmtRpFull(n: number): string { return `Rp ${Math.abs(n).toLocaleString('id-ID')}` }
function fmtInput(val: string): string {
  const num = val.replace(/\D/g, '')
  return num ? parseInt(num, 10).toLocaleString('id-ID') : ''
}
function parseRp(val: string): number { return parseInt(val.replace(/\D/g, ''), 10) || 0 }

export default function FinancePage() {
  const [userId, setUserId] = useState<string | null>(null)
  const [userName, setUserName] = useState<string | null>(null)
  const [coupleId, setCoupleId] = useState<string | null>(null)
  const [partnerName, setPartnerName] = useState<string | null>(null)
  const [goal, setGoal] = useState<SavingsGoal | null>(null)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [addTxOpen, setAddTxOpen] = useState(false)
  const [addTxInitialType, setAddTxInitialType] = useState<'deposit' | 'withdrawal'>('deposit')
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  const [editName, setEditName] = useState('')
  const [editTarget, setEditTarget] = useState('')
  const [editDate, setEditDate] = useState('')
  const [editSaving, setEditSaving] = useState(false)

  const loadData = useCallback(async () => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    setUserId(user.id)

    // Get my name
    const { data: myProfile } = await supabase.from('profiles').select('name').eq('id', user.id).single()
    setUserName(myProfile?.name ?? null)

    const { data: membership } = await supabase
      .from('couple_members').select('couple_id').eq('profile_id', user.id).single()
    if (!membership?.couple_id) { setLoading(false); return }
    setCoupleId(membership.couple_id)

    // Partner name
    const { data: allMembers } = await supabase
      .from('couple_members').select('profile_id').eq('couple_id', membership.couple_id).neq('profile_id', user.id)
    if (allMembers?.[0]) {
      const { data: p } = await supabase.from('profiles').select('name').eq('id', allMembers[0].profile_id).single()
      setPartnerName(p?.name ?? null)
    }

    const [goalR, txR] = await Promise.all([
      supabase.from('savings_goals').select('*').eq('couple_id', membership.couple_id).order('created_at').limit(1).maybeSingle(),
      supabase.from('couple_transactions').select('*').eq('couple_id', membership.couple_id).order('created_at', { ascending: false }),
    ])

    if (goalR.data) setGoal(goalR.data)
    setTransactions(txR.data ?? [])
    setLoading(false)
  }, [])

  useEffect(() => { loadData() }, [loadData])

  function openEditGoal() {
    if (!goal) return
    setEditName(goal.name); setEditTarget(goal.target_amount.toLocaleString('id-ID'))
    setEditDate(goal.target_date ?? ''); setEditModalOpen(true)
  }

  async function saveEditGoal(e: React.FormEvent) {
    e.preventDefault()
    if (!goal) return
    setEditSaving(true)
    const supabase = createClient()
    await supabase.from('savings_goals').update({
      name: editName.trim(), target_amount: parseRp(editTarget), target_date: editDate || null,
    }).eq('id', goal.id)
    setEditModalOpen(false); setEditSaving(false); loadData()
  }

  async function deleteGoal() {
    if (!goal || !confirm('Hapus target dan semua transaksi?')) return
    const supabase = createClient()
    await supabase.from('couple_transactions').delete().eq('goal_id', goal.id)
    await supabase.from('savings_goals').delete().eq('id', goal.id)
    setGoal(null); setTransactions([]); loadData()
  }

  // Computed
  const balance = goal ? Number(goal.current_amount) : 0
  const totalIn = transactions.filter(t => t.type === 'deposit').reduce((s, t) => s + Math.abs(Number(t.amount)), 0)
  const totalOut = transactions.filter(t => t.type === 'withdrawal').reduce((s, t) => s + Math.abs(Number(t.amount)), 0)
  const monthsRemaining = goal?.target_date ? Math.max(0, Math.ceil((new Date(goal.target_date).getTime() - Date.now()) / (30.44 * 86400000))) : null
  const monthlyRequired = goal && monthsRemaining && monthsRemaining > 0 ? Math.ceil((goal.target_amount - balance) / monthsRemaining) : null
  const progressPercent = goal && goal.target_amount > 0 ? Math.min(100, Math.round((balance / goal.target_amount) * 100)) : 0
  const milestoneMsg = progressPercent >= 100 ? 'Target tercapai!' : progressPercent >= 75 ? 'Hampir sampai!' : progressPercent >= 50 ? 'Setengah jalan!' : progressPercent >= 25 ? 'Seperempat terkumpul!' : null

  if (loading) {
    return <div className="flex items-center justify-center py-20"><div className="h-6 w-6 animate-spin rounded-full border-2 border-rose border-t-transparent" /></div>
  }

  // ===== NO GOAL: Show wizard =====
  if (!goal && coupleId) {
    return <div className="px-6 py-6"><SavingsWizard coupleId={coupleId} onComplete={loadData} /></div>
  }

  return (
    <div className="animate-fade-in pb-6">
      {/* ===== GRADIENT HERO ===== */}
      {goal && (
        <div className="relative overflow-hidden bg-gradient-to-br from-rose via-rose-dark to-[#d45a5a] px-6 pb-8 pt-6 text-white">
          <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/5" />
          <div className="absolute -bottom-4 -left-4 h-20 w-20 rounded-full bg-white/5" />
          <div className="relative">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-white/70">Saldo Tabungan</p>
                <p className="mt-0.5 text-3xl font-extrabold tracking-tight">{fmtRpFull(balance)}</p>
              </div>
              <button onClick={openEditGoal} className="rounded-xl bg-white/15 p-2 backdrop-blur-sm">
                <Pencil className="h-4 w-4 text-white" />
              </button>
            </div>

            {/* In/Out summary */}
            <div className="mt-3 flex gap-4">
              <div className="flex items-center gap-1.5">
                <ArrowDownLeft className="h-3.5 w-3.5 text-white/70" />
                <span className="text-xs text-white/70">Masuk</span>
                <span className="text-xs font-bold text-white">{fmtRp(totalIn)}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ArrowUpRight className="h-3.5 w-3.5 text-white/70" />
                <span className="text-xs text-white/70">Keluar</span>
                <span className="text-xs font-bold text-white">{fmtRp(totalOut)}</span>
              </div>
            </div>

            {/* Progress bar */}
            <div className="mt-3">
              <div className="mb-1 flex items-center justify-between text-xs text-white/70">
                <span>{goal.name}</span>
                <span>{progressPercent}%</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-white/20">
                <div className="h-full rounded-full bg-white transition-all duration-700" style={{ width: `${progressPercent}%` }} />
              </div>
              <p className="mt-1 text-xs text-white/60">
                Target: {fmtRp(Number(goal.target_amount))}
                {monthsRemaining != null && monthsRemaining > 0 && ` \u2022 ${monthsRemaining}bln lagi`}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4 px-6 pt-5">
        {/* Monthly hint */}
        {monthlyRequired != null && monthlyRequired > 0 && (
          <div className="flex items-center gap-2.5 rounded-2xl bg-gold/10 px-4 py-3">
            <TrendingUp className="h-5 w-5 flex-shrink-0 text-yellow-700" />
            <div>
              <p className="text-sm font-semibold text-yellow-800">{fmtRp(monthlyRequired)}<span className="font-normal">/bulan</span></p>
              <p className="text-xs text-yellow-700/70">untuk mencapai target tepat waktu</p>
            </div>
          </div>
        )}

        {/* Milestone */}
        {milestoneMsg && (
          <div className="flex items-center gap-2.5 rounded-2xl bg-sage/10 px-4 py-3">
            {progressPercent >= 100 ? <Award className="h-5 w-5 text-sage-dark" /> : <Sparkles className="h-5 w-5 text-sage-dark" />}
            <p className="text-sm font-medium text-sage-dark">{milestoneMsg}</p>
          </div>
        )}

        {/* ACTION BUTTONS: Masuk / Keluar */}
        <div className="flex gap-3">
          <button
            onClick={() => { setAddTxInitialType('deposit'); setAddTxOpen(true) }}
            className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-sage py-3.5 text-sm font-bold text-white shadow-card transition-all hover:bg-sage-dark active:scale-[0.98]"
          >
            <Plus className="h-4 w-4" />
            Uang Masuk
          </button>
          <button
            onClick={() => { setAddTxInitialType('withdrawal'); setAddTxOpen(true) }}
            className="flex flex-1 items-center justify-center gap-2 rounded-2xl border-2 border-rose/30 bg-white py-3.5 text-sm font-bold text-rose shadow-card transition-all hover:bg-rose-50 active:scale-[0.98]"
          >
            <Minus className="h-4 w-4" />
            Uang Keluar
          </button>
        </div>

        {/* Stats row */}
        {goal && (
          <div className="grid grid-cols-3 gap-2">
            <StatBox label="Saldo" value={fmtRp(balance)} icon={<TrendingUp className="h-3.5 w-3.5 text-rose" />} />
            <StatBox label="Masuk" value={fmtRp(totalIn)} icon={<ArrowDownLeft className="h-3.5 w-3.5 text-sage-dark" />} />
            <StatBox label="Keluar" value={fmtRp(totalOut)} icon={<ArrowUpRight className="h-3.5 w-3.5 text-rose" />} />
          </div>
        )}

        {/* TRANSACTION HISTORY */}
        <div className="rounded-2xl border border-border bg-white shadow-card overflow-hidden">
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-ink-muted">Riwayat Transaksi</h2>
            <span className="text-xs text-ink-muted">{transactions.length} transaksi</span>
          </div>
          <TransactionList
            transactions={transactions.slice(0, 20)}
            userId={userId ?? ''}
            partnerName={partnerName}
            userName={userName}
          />
          {transactions.length > 20 && (
            <div className="border-t border-border px-4 py-2 text-center">
              <p className="text-xs text-ink-muted">Menampilkan 20 terbaru dari {transactions.length}</p>
            </div>
          )}
        </div>

        {/* Wedding planner link */}
        <Link href="/app/finance/wedding"
          className="flex items-center gap-4 rounded-2xl border border-rose/20 bg-rose/5 p-4 transition-all hover:bg-rose/10 active:scale-[0.98]">
          <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-rose/10">
            <Heart className="h-5 w-5 text-rose" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold text-ink">Wedding Planner</p>
            <p className="text-xs text-ink-muted">Hitung biaya nikah sendiri, item per item</p>
          </div>
          <ChevronRight className="h-4 w-4 text-rose" />
        </Link>

        {/* Delete goal */}
        {goal && (
          <button onClick={deleteGoal} className="w-full py-1 text-center text-xs text-ink-muted/40 hover:text-red-400">
            Hapus target
          </button>
        )}

      </div>

      {/* Modals */}
      {coupleId && userId && (
        <AddTransactionModal
          isOpen={addTxOpen} onClose={() => setAddTxOpen(false)}
          coupleId={coupleId} goalId={goal?.id ?? null} userId={userId}
          onSuccess={loadData} initialType={addTxInitialType}
        />
      )}

      <Modal open={editModalOpen} onClose={() => setEditModalOpen(false)} title="Edit Target">
        <form onSubmit={saveEditGoal} className="space-y-4">
          <input type="text" value={editName} onChange={e => setEditName(e.target.value)} placeholder="Nama target"
            className="w-full rounded-2xl border border-border bg-white px-4 py-3 text-sm focus:border-rose focus:outline-none focus:ring-2 focus:ring-rose/20" required />
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-ink-muted">Rp</span>
            <input type="text" inputMode="numeric" value={editTarget} onChange={e => setEditTarget(fmtInput(e.target.value))}
              className="w-full rounded-2xl border border-border bg-white py-3 pl-10 pr-4 text-sm focus:border-rose focus:outline-none focus:ring-2 focus:ring-rose/20" required />
          </div>
          <input type="date" value={editDate} onChange={e => setEditDate(e.target.value)}
            className="w-full rounded-2xl border border-border bg-white px-4 py-3 text-sm focus:border-rose focus:outline-none focus:ring-2 focus:ring-rose/20" />
          <Button type="submit" loading={editSaving} size="lg">Simpan</Button>
        </form>
      </Modal>
    </div>
  )
}

function StatBox({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-1 rounded-xl border border-border bg-white px-3 py-3 shadow-card">
      {icon}
      <p className="text-sm font-bold text-ink">{value}</p>
      <p className="text-[10px] text-ink-muted">{label}</p>
    </div>
  )
}
