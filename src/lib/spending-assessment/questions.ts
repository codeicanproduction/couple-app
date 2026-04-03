import type { SpendingAnswer } from './types'

export interface SpendingQuestion {
  id: number
  question: string
  options: {
    key: SpendingAnswer
    text: string
    scores: Partial<Record<'IP_impulse' | 'IP_planning' | 'SO_other' | 'PF_present' | 'PF_future' | 'AW_high' | 'AW_low' | 'AW_medium', number>>
  }[]
}

export const SPENDING_QUESTIONS: SpendingQuestion[] = [
  {
    id: 1,
    question: 'Hari ini gajian. Hal pertama yang kamu lakuin?',
    options: [
      { key: 'A', text: 'Langsung transfer ke tabungan sesuai budget bulanan yang udah dibuat', scores: { IP_planning: 2, PF_future: 2, AW_high: 1 } },
      { key: 'B', text: 'Bayar semua tagihan dulu, sisanya baru dipikirin', scores: { IP_planning: 1, AW_high: 1 } },
      { key: 'C', text: 'Beliin sesuatu yang udah lama pengen dibeli sebagai reward', scores: { IP_impulse: 1, PF_present: 2 } },
      { key: 'D', text: 'Nggak terlalu ngeh, uang di rekening nanti kepakai sendiri', scores: { AW_low: 3 } },
    ],
  },
  {
    id: 2,
    question: 'Lagi jalan di mall sama pasangan, nemu jaket keren harga masuk akal. Yang paling mungkin kamu lakuin?',
    options: [
      { key: 'A', text: 'Langsung beli, sayang kalau kehabisan', scores: { IP_impulse: 2, PF_present: 2 } },
      { key: 'B', text: 'Tanya pasangan dulu pendapatnya sebelum beli', scores: { SO_other: 1, IP_planning: 1 } },
      { key: 'C', text: 'Foto dulu, pulang research harga di tempat lain', scores: { IP_planning: 2, AW_high: 1 } },
      { key: 'D', text: 'Nggak jadi beli, nanti dulu deh', scores: { IP_planning: 1, PF_future: 1 } },
    ],
  },
  {
    id: 3,
    question: 'Ulang tahun pasangan sebulan lagi. Gimana kamu approach hadiahnya?',
    options: [
      { key: 'A', text: 'Udah mikirin dari jauh-jauh hari, bahkan udah nabung khusus', scores: { SO_other: 2, IP_planning: 2 } },
      { key: 'B', text: 'Beliin yang paling mahal yang bisa gw afford, apapun itu', scores: { SO_other: 3, IP_impulse: 1 } },
      { key: 'C', text: 'Kasih budget range dulu, baru cari yang pas', scores: { IP_planning: 2, AW_high: 1 } },
      { key: 'D', text: 'Nunggu deket-deket tanggal baru kepikiran', scores: { AW_low: 2, IP_impulse: 1 } },
    ],
  },
  {
    id: 4,
    question: 'Tanggal 28, kamu nggak yakin berapa saldo rekening sekarang. Responnya?',
    options: [
      { key: 'A', text: 'Gw selalu tau saldo gw down to the last rupiah', scores: { AW_high: 3 } },
      { key: 'B', text: 'Cek sekarang juga, agak khawatir', scores: { AW_high: 1, PF_future: 1 } },
      { key: 'C', text: 'Kira-kira tau lah, tapi nggak persis', scores: { AW_medium: 1 } },
      { key: 'D', text: 'Nggak tau, biasanya nunggu notif aja kalau hampir habis', scores: { AW_low: 3 } },
    ],
  },
  {
    id: 5,
    question: 'Teman ngajak nongkrong malam ini ke tempat agak mahal. Budget lagi mepet. Kamu?',
    options: [
      { key: 'A', text: 'Tetap ikut, YOLO — moment bareng temen itu priceless', scores: { IP_impulse: 2, PF_present: 2 } },
      { key: 'B', text: 'Ikut tapi pesan yang paling murah', scores: { IP_planning: 1, AW_high: 1 } },
      { key: 'C', text: 'Minta reschedule ke tempat yang lebih terjangkau', scores: { IP_planning: 2, PF_future: 1 } },
      { key: 'D', text: 'Skip aja, nggak mau ganggu budget', scores: { PF_future: 2, AW_high: 1 } },
    ],
  },
  {
    id: 6,
    question: 'Pasangan bilang pengen banget sesuatu tapi harganya lumayan. Kamu?',
    options: [
      { key: 'A', text: 'Langsung cari cara buat wujudin, apapun caranya', scores: { SO_other: 3, IP_impulse: 1 } },
      { key: 'B', text: 'Seneng denger, mulai nabung bareng dari sekarang', scores: { SO_other: 2, IP_planning: 2 } },
      { key: 'C', text: 'Diskusi dulu — ini masuk priority list kita nggak?', scores: { IP_planning: 2, AW_high: 1 } },
      { key: 'D', text: 'Dengerin aja, ntar juga dia lupa', scores: { AW_low: 2 } },
    ],
  },
  {
    id: 7,
    question: 'Flash sale item yang udah lama diincar, diskon 60%, hari ini harus bayar. Kamu?',
    options: [
      { key: 'A', text: 'Beli! Kapan lagi dapet diskon segitu', scores: { IP_impulse: 3, PF_present: 2 } },
      { key: 'B', text: 'Cek dulu ada budget nggak, kalau ada beli', scores: { AW_high: 2, IP_planning: 1 } },
      { key: 'C', text: 'Minta pendapat pasangan dulu', scores: { SO_other: 1, IP_planning: 1 } },
      { key: 'D', text: 'Skip, takut ganggu keuangan bulan ini', scores: { PF_future: 2, AW_high: 1 } },
    ],
  },
  {
    id: 8,
    question: 'Kamu dan pasangan mau mulai nabung bareng. Approach-nya gimana?',
    options: [
      { key: 'A', text: 'Bikin spreadsheet, target per bulan, deadline jelas', scores: { IP_planning: 3, AW_high: 2 } },
      { key: 'B', text: 'Transfer nominal yang kira-kira cukup tiap bulan', scores: { AW_medium: 1 } },
      { key: 'C', text: 'Senang dengan ide ini tapi belum tau mulai dari mana', scores: { AW_low: 1, IP_impulse: 1 } },
      { key: 'D', text: 'Nurut aja sama pasangan soal angkanya', scores: { SO_other: 1, AW_low: 2 } },
    ],
  },
  {
    id: 9,
    question: 'Akhir bulan ada sisa uang yang lumayan. Kamu paling mungkin?',
    options: [
      { key: 'A', text: 'Langsung tambah ke tabungan', scores: { PF_future: 3, IP_planning: 2 } },
      { key: 'B', text: 'Ajak pasangan dinner atau mini-date sebagai reward', scores: { SO_other: 2, PF_present: 1 } },
      { key: 'C', text: 'Beli sesuatu yang udah lama pengen', scores: { IP_impulse: 2, PF_present: 2 } },
      { key: 'D', text: 'Biarin aja di rekening, ntar kepake sendiri', scores: { AW_low: 2 } },
    ],
  },
  {
    id: 10,
    question: 'Pasangan ngerasa kamu terlalu boros / terlalu pelit. Responmu?',
    options: [
      { key: 'A', text: 'Dengerin dan minta kita duduk bareng bikin plan', scores: { IP_planning: 2, SO_other: 1 } },
      { key: 'B', text: 'Defend diri — gw rasa spending gw wajar', scores: { IP_impulse: 1, AW_medium: 1 } },
      { key: 'C', text: 'Setuju dan minta maaf, pengen langsung berubah', scores: { SO_other: 2 } },
      { key: 'D', text: 'Bingung, karena gw sendiri nggak terlalu track pengeluaran', scores: { AW_low: 3 } },
    ],
  },
  {
    id: 11,
    question: 'Kalau ada uang lebih, kamu paling prioritasin ke mana?',
    options: [
      { key: 'A', text: 'Tambah tabungan / investasi', scores: { PF_future: 3, IP_planning: 2 } },
      { key: 'B', text: 'Pengalaman bersama pasangan (trip, date, dll)', scores: { SO_other: 1, PF_present: 2, IP_impulse: 1 } },
      { key: 'C', text: 'Hadiah / surprise untuk orang yang disayang', scores: { SO_other: 3 } },
      { key: 'D', text: 'Upgrade sesuatu untuk diri sendiri', scores: { PF_present: 2, IP_impulse: 1 } },
    ],
  },
  {
    id: 12,
    question: 'Ada barang mahal yang kamu mau, bisa dicicil 0% 12 bulan. Kamu?',
    options: [
      { key: 'A', text: 'Ambil — cicilan kecil, barangnya bisa dinikmati sekarang', scores: { IP_impulse: 2, PF_present: 2 } },
      { key: 'B', text: 'Hitung dulu total cicilan vs tabungan, baru decide', scores: { AW_high: 2, IP_planning: 2 } },
      { key: 'C', text: 'Tanya pasangan dulu, ini keputusan besar', scores: { SO_other: 1, IP_planning: 1 } },
      { key: 'D', text: 'Hindari cicilan sebisa mungkin', scores: { PF_future: 2, AW_high: 1 } },
    ],
  },
  {
    id: 13,
    question: 'Pasangan minta dinner romantis. Kamu approach budget-nya gimana?',
    options: [
      { key: 'A', text: 'Cari yang terbaik dalam budget reasonable, research dulu', scores: { IP_planning: 2, AW_high: 1 } },
      { key: 'B', text: 'Pergi ke tempat paling special, gak peduli habis berapa', scores: { SO_other: 2, IP_impulse: 1 } },
      { key: 'C', text: 'Terserah pasangan mau kemana, gw ikut aja', scores: { AW_low: 1, SO_other: 1 } },
      { key: 'D', text: 'Propose makan di rumah / masak bareng biar hemat', scores: { PF_future: 1, IP_planning: 1 } },
    ],
  },
  {
    id: 14,
    question: 'Seberapa terbuka kamu soal kondisi keuangan ke pasangan?',
    options: [
      { key: 'A', text: 'Sangat terbuka — pasangan tau hampir semua soal keuangan gw', scores: { SO_other: 2, AW_high: 1 } },
      { key: 'B', text: 'Terbuka tapi ada beberapa hal yang gw keep private', scores: { AW_high: 1 } },
      { key: 'C', text: 'Jarang bahas, bukan karena hide tapi nggak kepikiran', scores: { AW_low: 2 } },
      { key: 'D', text: 'Gw sendiri nggak terlalu tau detail keuangan gw', scores: { AW_low: 3 } },
    ],
  },
  {
    id: 15,
    question: 'Kalau dipikirin 5 tahun ke depan, yang paling bikin kamu excited?',
    options: [
      { key: 'A', text: 'Punya rumah / financially stable bersama pasangan', scores: { PF_future: 3, SO_other: 1 } },
      { key: 'B', text: 'Udah punya banyak pengalaman dan memories seru bareng', scores: { PF_present: 2, SO_other: 1 } },
      { key: 'C', text: 'Pasangan dan keluarga bahagia dan tercukupi', scores: { SO_other: 3 } },
      { key: 'D', text: 'Entah — jalani aja dulu, ntar keliatan', scores: { AW_low: 2 } },
    ],
  },
]
