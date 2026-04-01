'use client'

import { useState, useEffect, useCallback } from 'react'
import { Search, Shield, User } from 'lucide-react'
import { createClient } from '@/lib/supabase'

interface UserRow {
  id: string
  name: string | null
  role: string | null
  created_at: string
  email?: string
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserRow[]>([])
  const [filtered, setFiltered] = useState<UserRow[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [toggling, setToggling] = useState<string | null>(null)

  const loadUsers = useCallback(async () => {
    const supabase = createClient()
    const { data } = await supabase
      .from('profiles')
      .select('id, name, role, created_at')
      .order('created_at', { ascending: false })
    setUsers((data ?? []) as UserRow[])
    setFiltered((data ?? []) as UserRow[])
    setLoading(false)
  }, [])

  useEffect(() => { loadUsers() }, [loadUsers])

  useEffect(() => {
    const q = search.toLowerCase()
    setFiltered(users.filter(u =>
      (u.name ?? '').toLowerCase().includes(q) || u.id.includes(q)
    ))
  }, [search, users])

  async function toggleRole(user: UserRow) {
    setToggling(user.id)
    const supabase = createClient()
    const newRole = user.role === 'admin' ? 'user' : 'admin'
    await supabase.from('profiles').update({ role: newRole }).eq('id', user.id)
    await loadUsers()
    setToggling(null)
  }

  function formatDate(s: string) {
    return new Date(s).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-ink">Pengguna</h1>
        <p className="mt-1 text-sm text-ink-muted">{users.length} pengguna terdaftar</p>
      </div>

      {/* Search */}
      <div className="mb-4 flex items-center gap-3 rounded-2xl border border-gray-200 bg-white px-4 py-2.5 shadow-sm">
        <Search className="h-4 w-4 flex-shrink-0 text-ink-muted" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Cari nama atau ID pengguna..."
          className="flex-1 bg-transparent text-sm outline-none placeholder:text-ink-muted"
        />
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex items-center justify-center py-16"><div className="h-5 w-5 animate-spin rounded-full border-2 border-rose border-t-transparent" /></div>
      ) : (
        <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="px-5 py-3 text-left text-xs font-semibold text-ink-muted">Nama</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-ink-muted">ID</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-ink-muted">Bergabung</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-ink-muted">Role</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-ink-muted"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(user => (
                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-rose/10 text-xs font-bold text-rose">
                        {(user.name ?? '?')[0].toUpperCase()}
                      </div>
                      <span className="font-medium text-ink">{user.name ?? '—'}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 font-mono text-xs text-ink-muted">{user.id.slice(0, 8)}…</td>
                  <td className="px-5 py-3.5 text-xs text-ink-muted">{formatDate(user.created_at)}</td>
                  <td className="px-5 py-3.5">
                    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                      user.role === 'admin'
                        ? 'bg-purple-100 text-purple-700'
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {user.role === 'admin' ? <Shield className="h-3 w-3" /> : <User className="h-3 w-3" />}
                      {user.role ?? 'user'}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <button
                      onClick={() => toggleRole(user)}
                      disabled={toggling === user.id}
                      className={`text-xs font-medium transition-colors ${
                        user.role === 'admin'
                          ? 'text-red-500 hover:text-red-700'
                          : 'text-purple-600 hover:text-purple-800'
                      }`}
                    >
                      {toggling === user.id ? '...' : user.role === 'admin' ? 'Hapus Admin' : 'Jadikan Admin'}
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-sm text-ink-muted">
                    {search ? 'Tidak ada pengguna ditemukan' : 'Belum ada pengguna'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
