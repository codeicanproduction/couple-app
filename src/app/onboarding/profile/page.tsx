'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Smile } from 'lucide-react'
import { createClient } from '@/lib/supabase'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

export default function OnboardingProfilePage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [gender, setGender] = useState<'male' | 'female' | ''>('')
  const [birthday, setBirthday] = useState('')
  const [relationshipStart, setRelationshipStart] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) { setError('Nama tidak boleh kosong'); return }
    setError('')
    setLoading(true)

    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/auth/login'); return }

    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        name: name.trim(),
        gender: gender || null,
        birthday: birthday || null,
        relationship_start_date: relationshipStart || null,
      })
      .eq('id', user.id)

    if (updateError) {
      setError(updateError.message)
      setLoading(false)
      return
    }

    router.push('/onboarding/couple')
  }

  return (
    <div className="animate-fade-in">
      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-50">
          <Smile className="h-7 w-7 text-rose" strokeWidth={2} />
        </div>
        <h1 className="text-2xl font-bold text-ink">Kenalan dulu, yuk!</h1>
        <p className="mt-1 text-sm text-ink-muted">Nama apa yang biasa dipanggil pasanganmu?</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <Input
          label="Nama Panggilan"
          type="text"
          placeholder="Contoh: Budi, Sayang, B"
          value={name}
          onChange={e => setName(e.target.value)}
          required
          autoComplete="given-name"
          error={error}
        />

        <div className="space-y-1.5">
          <label className="block text-xs font-semibold uppercase tracking-wider text-ink-muted">
            Kamu...
          </label>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setGender('male')}
              className={`flex-1 rounded-2xl border py-3 text-sm font-semibold transition-all ${
                gender === 'male'
                  ? 'border-rose bg-rose-50 text-rose'
                  : 'border-border bg-white text-ink-muted hover:border-rose'
              }`}
            >
              Cowok
            </button>
            <button
              type="button"
              onClick={() => setGender('female')}
              className={`flex-1 rounded-2xl border py-3 text-sm font-semibold transition-all ${
                gender === 'female'
                  ? 'border-rose bg-rose-50 text-rose'
                  : 'border-border bg-white text-ink-muted hover:border-rose'
              }`}
            >
              Cewek
            </button>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-semibold uppercase tracking-wider text-ink-muted">
            Kapan ulang tahunmu?
          </label>
          <input
            type="date"
            value={birthday}
            onChange={e => setBirthday(e.target.value)}
            className="w-full rounded-2xl border border-border bg-white px-4 py-3.5 text-sm text-ink focus:border-rose focus:outline-none focus:ring-2 focus:ring-rose/20"
          />
          <p className="text-xs text-ink-muted">
            Kami akan ingatkan pasanganmu nanti
          </p>
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-semibold uppercase tracking-wider text-ink-muted">
            Kapan kalian mulai bersama?
          </label>
          <input
            type="date"
            value={relationshipStart}
            onChange={e => setRelationshipStart(e.target.value)}
            className="w-full rounded-2xl border border-border bg-white px-4 py-3.5 text-sm text-ink focus:border-rose focus:outline-none focus:ring-2 focus:ring-rose/20"
          />
          <p className="text-xs text-ink-muted">
            Buat hitung hari bersama &amp; pengingat anniversary
          </p>
        </div>

        <div className="pt-2">
          <Button type="submit" loading={loading} size="lg">
            Lanjut
          </Button>
        </div>
      </form>
    </div>
  )
}
