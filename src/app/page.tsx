import Link from 'next/link'

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 py-12">
      <div className="text-center">
        <div className="mb-6 text-6xl">💑</div>
        <h1 className="mb-3 text-4xl font-bold text-gray-900">
          Couple App
        </h1>
        <p className="mb-2 text-lg text-primary-600 font-semibold">
          Kesiapan Assessment
        </p>
        <p className="mb-8 text-gray-500 leading-relaxed">
          Cek seberapa siap kamu dan pasangan untuk melangkah ke tahap
          berikutnya. 15 pertanyaan, 8 menit, hasil yang jujur.
        </p>

        <Link
          href="/assessment"
          className="inline-block rounded-full bg-primary-500 px-8 py-4 text-lg font-semibold text-white shadow-lg transition hover:bg-primary-600 hover:shadow-xl active:scale-95"
        >
          Mulai Assessment
        </Link>

        <div className="mt-12 space-y-4 text-sm text-gray-400">
          <div className="flex items-center justify-center gap-6">
            <div className="flex items-center gap-2">
              <span>⏱️</span>
              <span>~8 menit</span>
            </div>
            <div className="flex items-center gap-2">
              <span>📊</span>
              <span>5 dimensi</span>
            </div>
            <div className="flex items-center gap-2">
              <span>🔒</span>
              <span>Privat</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-16 rounded-2xl bg-primary-50 p-6 text-center">
        <h2 className="mb-3 text-lg font-semibold text-gray-800">
          5 Dimensi Kesiapan
        </h2>
        <div className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-3">
          {[
            { icon: '💬', label: 'Komunikasi' },
            { icon: '🎯', label: 'Nilai & Visi' },
            { icon: '💰', label: 'Keuangan' },
            { icon: '👨‍👩‍👧‍👦', label: 'Keluarga' },
            { icon: '💍', label: 'Komitmen' },
          ].map((d) => (
            <div
              key={d.label}
              className="rounded-xl bg-white px-3 py-2 shadow-sm"
            >
              <span className="text-xl">{d.icon}</span>
              <p className="mt-1 text-gray-600">{d.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
