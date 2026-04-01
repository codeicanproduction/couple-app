'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Heart } from 'lucide-react'
import { createClient } from '@/lib/supabase'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const supabase = createClient()
    const { data, error: authError } = await supabase.auth.signInWithPassword({ email, password })

    if (authError) {
      setError('Email atau password salah.')
      setLoading(false)
      return
    }

    // Check profile + couple status to decide where to send user
    const { data: profile } = await supabase
      .from('profiles')
      .select('name, onboarding_complete')
      .eq('id', data.user.id)
      .single()

    // Check if user is already in a couple
    const { data: membership } = await supabase
      .from('couple_members')
      .select('couple_id')
      .eq('profile_id', data.user.id)
      .maybeSingle()

    const hasName = !!profile?.name
    const hasCouple = !!membership?.couple_id
    const isComplete = profile?.onboarding_complete

    if (isComplete || (hasName && hasCouple)) {
      // If somehow flag is still false but they're actually done, fix it silently
      if (!isComplete && hasName && hasCouple) {
        await supabase
          .from('profiles')
          .update({ onboarding_complete: true })
          .eq('id', data.user.id)
      }
      router.push('/app/home')
    } else if (hasName && !hasCouple) {
      // Has profile but no couple yet
      router.push('/onboarding/invite')
    } else {
      // Fresh user, start onboarding
      router.push('/onboarding/welcome')
    }
  }

  return (
    <div className="animate-fade-in">
      {/* Logo */}
      <div className="mb-10 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-50">
          <Heart className="h-7 w-7 text-rose" strokeWidth={2} />
        </div>
        <h1 className="text-2xl font-bold text-ink">Masuk</h1>
        <p className="mt-1 text-sm text-ink-muted">Selamat datang kembali</p>
      </div>

      <form onSubmit={handleLogin} className="space-y-4">
        <Input
          label="Email"
          type="email"
          placeholder="kamu@email.com"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          autoComplete="email"
        />
        <Input
          label="Password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          autoComplete="current-password"
          error={error}
        />

        <div className="pt-2">
          <Button type="submit" loading={loading} size="lg">
            Masuk
          </Button>
        </div>
      </form>

      <p className="mt-8 text-center text-sm text-ink-muted">
        Belum punya akun?{' '}
        <Link href="/auth/signup" className="font-semibold text-rose hover:text-rose-dark">
          Daftar sekarang
        </Link>
      </p>
    </div>
  )
}
