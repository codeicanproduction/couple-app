import type { SpendingType } from './types'

export interface CompatibilityInfo {
  headline: string
  insight: string
  tips: string[]
}

function key(a: SpendingType, b: SpendingType): string {
  return [a, b].sort().join('+')
}

const COMPAT: Record<string, CompatibilityInfo> = {
  'explorer+explorer': {
    headline: 'Double Fun, Double Chaos',
    insight: 'Hubungan kalian penuh momen seru dan spontanitas. Tapi financial planning bisa jadi titik lemah terbesar — ada risiko tidak ada yang jadi anchor untuk saving goals.',
    tips: ['Set satu hari per bulan untuk money date', 'Gamify saving — siapa yang bisa hemat lebih bulan ini', 'Automasi saving di awal bulan sebelum bisa dipakai'],
  },
  'explorer+guardian': {
    headline: 'Classic Tension, Perfect Balance',
    insight: 'Ini kombinasi paling umum dan paling sering ribut soal uang. Explorer merasa Guardian terlalu mengekang; Guardian merasa Explorer tidak bertanggung jawab. Tapi kalau bisa compromise, ini kombinasi paling balanced.',
    tips: ['Buat fun fund yang Explorer bisa spend tanpa pertanyaan', 'Guardian handle long-term savings', 'Tetapkan batas spending tanpa perlu izin satu sama lain'],
  },
  'explorer+giver': {
    headline: 'Saling Appreciate, Kurang Planning',
    insight: 'Kalian sama-sama generous dan mau spend untuk momen bersama. Chemistry finansial bagus, tapi saving goals butuh effort ekstra karena keduanya lebih present-oriented.',
    tips: ['Automasi saving sebelum bulan mulai', 'Tentukan spending limit untuk gifts', 'Satu dari kalian harus jadi financial captain'],
  },
  'explorer+architect': {
    headline: 'Bisa Work, Butuh Komunikasi',
    insight: 'Architect akan frustrated dengan impulsivity Explorer, tapi Explorer bisa kasih Architect spontanitas yang dia butuhkan. Kuncinya: Architect tidak micromanage, Explorer respect sistem yang udah dibuat bareng.',
    tips: ['Buat yes fund — budget yang Explorer bisa spend tanpa justify', 'Architect bikin sistem saving yang simple', 'Jangan bahas uang setiap kali ketemu'],
  },
  'explorer+drifter': {
    headline: 'Fun tapi Perlu Anchor',
    insight: 'Dua orang yang sama-sama go with the flow. Momen bersama seru, tapi tanpa ada yang jadi financial anchor, long-term goals bisa sulit tercapai.',
    tips: ['Salah satu harus step up jadi financial captain', 'Gunakan app ini untuk track savings goal', 'Set automatic transfer ke savings di awal bulan'],
  },
  'guardian+guardian': {
    headline: 'Super Stable, Jangan Lupa Hidup',
    insight: 'Finansial kalian almost certainly aman. Tapi ada risiko terlalu rigid sampai lupa enjoy momen.',
    tips: ['Budgetkan experience fund yang wajib dihabiskan tiap bulan', 'Bergantian jadi spontaneous decider', 'Jangan over-analyze setiap pengeluaran kecil'],
  },
  'giver+guardian': {
    headline: 'Guardian Protects, Giver Warms',
    insight: 'Guardian menyediakan stabilitas yang Giver butuhkan; Giver mengajarkan Guardian bahwa uang juga untuk dinikmati dan dibagikan. Kombinasi yang sangat complementary.',
    tips: ['Guardian: kasih Giver love budget tanpa dipertanggungjawabkan', 'Giver: percayakan financial planning ke Guardian', 'Jangan bypass sistem yang udah dibuat bareng'],
  },
  'architect+guardian': {
    headline: 'Dream Team Finansial',
    insight: 'Keduanya future-oriented, planning-driven, dan financially aware. Risiko utama: terlalu analytical sampai lupa spontanitas dan romance.',
    tips: ['Jadwalkan no-budget date sebulan sekali', 'Buat kategori spending untuk experiences', 'Celebrate financial milestones together'],
  },
  'drifter+guardian': {
    headline: 'Guardian Sering Frustrasi',
    insight: 'Butuh paling banyak komunikasi. Guardian akan frustrated dengan Drifter yang tidak aware; Drifter merasa dikontrol. Tapi dengan effort, Drifter bisa sangat terbantu oleh struktur Guardian.',
    tips: ['Guardian: jangan ambil alih semua finansial, libatkan Drifter', 'Drifter: commit cek kondisi finansial minimal seminggu sekali', 'Start small — satu goal yang simple dan achievable'],
  },
  'giver+giver': {
    headline: 'Saling Sayang, Jangan Lupa Diri Sendiri',
    insight: 'Kalian berdua sangat generous dan saling prioritasin satu sama lain. Beautiful — tapi pastikan kalian juga invest untuk masa depan bersama.',
    tips: ['Set future fund yang tidak bisa disentuh untuk hadiah', 'Belajar bilang kita nggak mampu sekarang', 'Love language tidak harus selalu finansial'],
  },
  'architect+giver': {
    headline: 'Heart + Head = Balance',
    insight: 'Architect memberikan struktur yang Giver butuhkan; Giver mengingatkan Architect bahwa uang juga untuk dinikmati. Kombinasi yang bisa sangat powerful.',
    tips: ['Architect: buat generosity budget khusus untuk Giver', 'Giver: percayakan Architect untuk long-term planning', 'Celebrate when giving fits within the plan'],
  },
  'drifter+giver': {
    headline: 'Giver Sering Cover Drifter',
    insight: 'Ada risiko ketidakseimbangan — Giver akan terus memberi sementara Drifter tidak terlalu aware. Ini bisa build resentment jangka panjang.',
    tips: ['Drifter: buat komitmen konkret untuk aware dengan keuangan', 'Giver: love language tidak harus selalu finansial', 'Bikin weekly money check-in 15 menit'],
  },
  'architect+architect': {
    headline: 'Terlalu Analytical? Justru Bagus',
    insight: 'Finansial kalian hampir pasti sangat terstruktur dan goal-oriented. Risiko: over-optimize sampai hubungan terasa seperti project management.',
    tips: ['Build in unplanned experiences', 'Jangan bahas uang setiap kali ketemu', 'Celebrate progress, bukan cuma results'],
  },
  'architect+drifter': {
    headline: 'Architect Perlu Sabar',
    insight: 'Sama seperti Guardian + Drifter — butuh komunikasi ekstra. Architect harus sabar dan tidak condescending; Drifter harus mau belajar dan engage.',
    tips: ['Buat sistem yang simple untuk Drifter', 'Celebrate progress kecil dari Drifter', 'Jangan overwhelm dengan spreadsheet'],
  },
  'drifter+drifter': {
    headline: 'Perlu Anchor Sekarang',
    insight: 'Ini kombinasi yang paling perlu external structure. Tidak ada yang natural jadi financial anchor. Long-term goals akan sangat sulit tanpa sistem yang jelas.',
    tips: ['Gunakan fitur savings goal di app ini sekarang', 'Set automatic transfer ke savings di awal bulan', 'Pertimbangkan financial counselor'],
  },
}

export function getCompatibility(typeA: SpendingType, typeB: SpendingType): CompatibilityInfo {
  return COMPAT[key(typeA, typeB)] ?? {
    headline: 'Unik!',
    insight: 'Setiap kombinasi punya kekuatan dan tantangan tersendiri.',
    tips: ['Komunikasi terbuka soal keuangan', 'Set financial goals bersama', 'Review keuangan bareng sebulan sekali'],
  }
}
