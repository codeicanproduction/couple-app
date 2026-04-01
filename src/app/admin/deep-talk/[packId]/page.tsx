'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, Plus, Trash2, Check, X, ChevronDown, ChevronUp } from 'lucide-react'
import { createClient } from '@/lib/supabase'
import type { DeepTalkPack, DeepTalkLevel, DeepTalkQuestion } from '@/lib/deep-talk'

interface LevelWithQuestions extends DeepTalkLevel {
  questions: DeepTalkQuestion[]
  open: boolean
}

export default function AdminPackEditorPage() {
  const { packId } = useParams<{ packId: string }>()
  const router = useRouter()

  const [pack, setPack] = useState<DeepTalkPack | null>(null)
  const [levels, setLevels] = useState<LevelWithQuestions[]>([])
  const [loading, setLoading] = useState(true)
  const [editingPack, setEditingPack] = useState(false)
  const [packTitle, setPackTitle] = useState('')
  const [packDesc, setPackDesc] = useState('')
  const [newQuestions, setNewQuestions] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState(false)

  const loadData = useCallback(async () => {
    const supabase = createClient()
    const { data: p } = await supabase.from('deep_talk_packs').select('*').eq('id', packId).single()
    if (!p) { setLoading(false); return }
    setPack(p as DeepTalkPack)
    setPackTitle(p.title)
    setPackDesc(p.description ?? '')

    const { data: lvls } = await supabase.from('deep_talk_levels').select('*').eq('pack_id', packId).order('level_number')
    const levelList = (lvls ?? []) as DeepTalkLevel[]

    const withQuestions: LevelWithQuestions[] = await Promise.all(
      levelList.map(async (l) => {
        const { data: qs } = await supabase
          .from('deep_talk_questions')
          .select('*')
          .eq('level_id', l.id)
          .order('sort_order')
        return { ...l, questions: (qs ?? []) as DeepTalkQuestion[], open: true }
      })
    )
    setLevels(withQuestions)
    setLoading(false)
  }, [packId])

  useEffect(() => { loadData() }, [loadData])

  async function savePack() {
    setSaving(true)
    const supabase = createClient()
    await supabase.from('deep_talk_packs').update({ title: packTitle, description: packDesc }).eq('id', packId)
    setEditingPack(false)
    await loadData()
    setSaving(false)
  }

  async function addQuestion(levelId: string) {
    const text = newQuestions[levelId]?.trim()
    if (!text) return
    const supabase = createClient()
    const level = levels.find(l => l.id === levelId)
    const maxOrder = (level?.questions ?? []).reduce((m, q) => Math.max(m, q.sort_order ?? 0), 0)
    await supabase.from('deep_talk_questions').insert({
      level_id: levelId,
      question_text: text,
      sort_order: maxOrder + 1,
    })
    setNewQuestions(prev => ({ ...prev, [levelId]: '' }))
    await loadData()
  }

  async function deleteQuestion(questionId: string) {
    const supabase = createClient()
    await supabase.from('deep_talk_questions').delete().eq('id', questionId)
    await loadData()
  }

  async function updateQuestion(questionId: string, text: string) {
    const supabase = createClient()
    await supabase.from('deep_talk_questions').update({ question_text: text }).eq('id', questionId)
  }

  function toggleLevel(id: string) {
    setLevels(prev => prev.map(l => l.id === id ? { ...l, open: !l.open } : l))
  }

  if (loading) {
    return <div className="flex items-center justify-center py-20"><div className="h-5 w-5 animate-spin rounded-full border-2 border-rose border-t-transparent" /></div>
  }

  return (
    <div>
      <button onClick={() => router.back()} className="mb-5 flex items-center gap-1 text-sm text-ink-muted hover:text-ink">
        <ArrowLeft className="h-4 w-4" /> Deep Talk
      </button>

      {/* Pack header */}
      <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        {editingPack ? (
          <div className="space-y-2">
            <input
              value={packTitle}
              onChange={e => setPackTitle(e.target.value)}
              className="w-full rounded-xl border border-border px-3 py-2 text-sm font-bold outline-none focus:border-rose"
            />
            <input
              value={packDesc}
              onChange={e => setPackDesc(e.target.value)}
              className="w-full rounded-xl border border-border px-3 py-2 text-sm outline-none focus:border-rose"
              placeholder="Deskripsi"
            />
            <div className="flex gap-2">
              <button onClick={savePack} disabled={saving} className="flex items-center gap-1.5 rounded-xl bg-rose px-3 py-1.5 text-xs font-semibold text-white">
                <Check className="h-3.5 w-3.5" /> Simpan
              </button>
              <button onClick={() => setEditingPack(false)} className="flex items-center gap-1.5 rounded-xl border border-border px-3 py-1.5 text-xs text-ink-muted">
                <X className="h-3.5 w-3.5" /> Batal
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-xl font-bold text-ink">{pack?.title}</h1>
              <p className="mt-1 text-sm text-ink-muted">{pack?.description ?? '—'}</p>
            </div>
            <button onClick={() => setEditingPack(true)} className="text-xs font-medium text-rose hover:underline">Edit</button>
          </div>
        )}
      </div>

      {/* Levels */}
      <div className="space-y-4">
        {levels.map((level, idx) => (
          <div key={level.id} className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
            {/* Level header */}
            <button
              onClick={() => toggleLevel(level.id)}
              className="flex w-full items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-rose/10 text-xs font-bold text-rose">
                  {level.level_number}
                </span>
                <div className="text-left">
                  <p className="text-sm font-semibold text-ink">{level.title}</p>
                  <p className="text-xs text-ink-muted">{level.questions.length} pertanyaan</p>
                </div>
              </div>
              {level.open ? <ChevronUp className="h-4 w-4 text-ink-muted" /> : <ChevronDown className="h-4 w-4 text-ink-muted" />}
            </button>

            {level.open && (
              <div className="border-t border-gray-100 px-5 pb-4 pt-3">
                {/* Questions list */}
                <div className="space-y-2 mb-3">
                  {level.questions.map((q, qi) => (
                    <QuestionRow
                      key={q.id}
                      question={q}
                      index={qi + 1}
                      onDelete={() => deleteQuestion(q.id)}
                      onUpdate={(text) => updateQuestion(q.id, text)}
                    />
                  ))}
                  {level.questions.length === 0 && (
                    <p className="py-2 text-xs text-ink-muted">Belum ada pertanyaan di level ini.</p>
                  )}
                </div>

                {/* Add question */}
                <div className="flex gap-2">
                  <input
                    value={newQuestions[level.id] ?? ''}
                    onChange={e => setNewQuestions(prev => ({ ...prev, [level.id]: e.target.value }))}
                    onKeyDown={e => e.key === 'Enter' && addQuestion(level.id)}
                    placeholder="Ketik pertanyaan baru, Enter untuk simpan..."
                    className="flex-1 rounded-xl border border-border bg-gray-50 px-3 py-2 text-xs outline-none focus:border-rose focus:bg-white"
                  />
                  <button
                    onClick={() => addQuestion(level.id)}
                    className="flex h-8 w-8 items-center justify-center rounded-xl bg-rose text-white"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

function QuestionRow({
  question,
  index,
  onDelete,
  onUpdate,
}: {
  question: DeepTalkQuestion
  index: number
  onDelete: () => void
  onUpdate: (text: string) => void
}) {
  const [editing, setEditing] = useState(false)
  const [text, setText] = useState(question.question_text)

  function save() {
    onUpdate(text)
    setEditing(false)
  }

  return (
    <div className="group flex items-start gap-2 rounded-xl border border-transparent p-2 hover:border-gray-100 hover:bg-gray-50 transition-colors">
      <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-md bg-gray-100 text-[10px] font-bold text-ink-muted">
        {index}
      </span>
      {editing ? (
        <div className="flex-1 flex gap-2">
          <input
            value={text}
            onChange={e => setText(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && save()}
            autoFocus
            className="flex-1 rounded-lg border border-rose px-2 py-1 text-xs outline-none"
          />
          <button onClick={save} className="text-rose"><Check className="h-4 w-4" /></button>
          <button onClick={() => { setEditing(false); setText(question.question_text) }} className="text-ink-muted"><X className="h-4 w-4" /></button>
        </div>
      ) : (
        <>
          <p
            className="flex-1 cursor-pointer text-xs text-ink hover:text-rose transition-colors"
            onClick={() => setEditing(true)}
          >
            {question.question_text}
          </p>
          <button
            onClick={onDelete}
            className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity text-red-400 hover:text-red-600"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </>
      )}
    </div>
  )
}
