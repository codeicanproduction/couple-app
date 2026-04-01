'use client'

interface SamakanLobbyProps {
  myName: string
  myAvatar: string | null
  partnerName: string
  partnerAvatar: string | null
  isPartnerConnected: boolean
  isMyReady: boolean
  isPartnerReady: boolean
  onReady: () => void
}

export default function SamakanLobby({
  myName,
  myAvatar,
  partnerName,
  partnerAvatar,
  isPartnerConnected,
  isMyReady,
  isPartnerReady,
  onReady,
}: SamakanLobbyProps) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-ink to-gray-900 px-6">
      <h2 className="mb-2 text-2xl font-bold text-white">Samakan</h2>
      <p className="mb-10 text-sm text-white/60">Siap-siap main bareng!</p>

      <div className="flex items-center gap-8 mb-12">
        {/* My avatar */}
        <div className="flex flex-col items-center gap-2">
          <div
            className={`h-20 w-20 rounded-full border-4 overflow-hidden flex items-center justify-center text-2xl font-bold text-white ${
              isMyReady ? 'border-emerald-400 bg-emerald-500/20' : 'border-white/30 bg-white/10'
            }`}
          >
            {myAvatar ? (
              <img src={myAvatar} alt={myName} className="h-full w-full object-cover" />
            ) : (
              myName.charAt(0).toUpperCase()
            )}
          </div>
          <span className="text-sm font-medium text-white">{myName}</span>
          {isMyReady && (
            <span className="text-xs font-bold text-emerald-400">SIAP!</span>
          )}
        </div>

        {/* VS */}
        <div className="text-white/30 text-lg font-bold">&</div>

        {/* Partner avatar */}
        <div className="flex flex-col items-center gap-2">
          <div
            className={`h-20 w-20 rounded-full border-4 overflow-hidden flex items-center justify-center text-2xl font-bold text-white ${
              isPartnerReady
                ? 'border-emerald-400 bg-emerald-500/20'
                : isPartnerConnected
                ? 'border-white/30 bg-white/10'
                : 'border-white/20 bg-white/5 animate-pulse'
            }`}
          >
            {isPartnerConnected ? (
              partnerAvatar ? (
                <img src={partnerAvatar} alt={partnerName} className="h-full w-full object-cover" />
              ) : (
                partnerName.charAt(0).toUpperCase()
              )
            ) : (
              <span className="text-white/30 text-3xl">?</span>
            )}
          </div>
          <span className="text-sm font-medium text-white">
            {isPartnerConnected ? partnerName : 'Menunggu...'}
          </span>
          {isPartnerReady && (
            <span className="text-xs font-bold text-emerald-400">SIAP!</span>
          )}
          {!isPartnerConnected && (
            <span className="text-xs text-white/40">Belum bergabung</span>
          )}
        </div>
      </div>

      {/* Ready button */}
      {!isMyReady ? (
        <button
          onClick={onReady}
          disabled={!isPartnerConnected}
          className={`rounded-full px-10 py-3 text-lg font-bold transition-all ${
            isPartnerConnected
              ? 'bg-rose text-white active:scale-95 shadow-lg shadow-rose/30'
              : 'bg-white/10 text-white/30 cursor-not-allowed'
          }`}
        >
          Siap!
        </button>
      ) : (
        <div className="flex flex-col items-center gap-2">
          <div className="h-10 w-10 rounded-full border-2 border-white/20 border-t-rose animate-spin" />
          <p className="text-sm text-white/50">Menunggu pasangan siap...</p>
        </div>
      )}

      {!isPartnerConnected && (
        <p className="mt-6 text-xs text-white/30 text-center max-w-xs">
          Pasanganmu akan mendapat notifikasi. Mereka bisa join dari link yang sama.
        </p>
      )}
    </div>
  )
}
