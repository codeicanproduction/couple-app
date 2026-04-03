export type SpendingType = 'explorer' | 'guardian' | 'giver' | 'architect' | 'drifter'

export type DimensionScores = {
  IP: number  // Impulse vs Planning (higher = more impulse)
  SO: number  // Self vs Other (higher = more other-oriented)
  PF: number  // Present vs Future (higher = more present)
  AW: number  // Awareness (higher = more aware)
}

export type SpendingAnswer = 'A' | 'B' | 'C' | 'D'

export interface SpendingTypeInfo {
  id: SpendingType
  name: string
  tagline: string
  emoji: string
  color: string
  description: string
  strengths: string[]
  blindSpots: string[]
  resonantQuote: string
}

export const SPENDING_TYPES: Record<SpendingType, SpendingTypeInfo> = {
  explorer: {
    id: 'explorer',
    name: 'Si Penjelajah',
    tagline: 'Hidup cuma sekali, kenapa nggak dicoba?',
    emoji: '🌊',
    color: '#F08060',
    description: 'Spending kamu didorong oleh pengalaman dan momen. Beli karena excited, bukan karena butuh. Impulsif tapi bukan materialistis — lebih ke experiences daripada barang.',
    strengths: [
      'Bikin hubungan seru dan tidak membosankan',
      'Tidak pelit untuk momen bersama',
      'Open to trying new things berdua',
    ],
    blindSpots: [
      'Tabungan sering terkuras sebelum akhir bulan',
      'Susah commit ke long-term financial goal',
      'Sering beli sesuatu yang tidak terpakai',
    ],
    resonantQuote: 'Nanti kalau udah tua baru nabung, sekarang nikmatin dulu',
  },
  guardian: {
    id: 'guardian',
    name: 'Si Penjaga',
    tagline: 'Lebih baik aman daripada menyesal.',
    emoji: '🏰',
    color: '#5B8EDB',
    description: 'Spending kamu didorong oleh rasa aman dan kontrol. Setiap keputusan finansial dipikirkan matang. Security adalah motivasi utama — bukan pelit, tapi prudent.',
    strengths: [
      'Finansial couple paling stabil',
      'Natural planner untuk nikah/rumah/masa depan',
      'Tidak pernah over-spend, selalu ada safety net',
    ],
    blindSpots: [
      'Bisa terasa controlling soal uang',
      'Sering ngerem pasangan sampai bikin frustrasi',
      'Terlalu risk-averse bahkan untuk hal yang reasonable',
    ],
    resonantQuote: 'Kita harus nabung dulu sebelum beli itu',
  },
  giver: {
    id: 'giver',
    name: 'Si Pemberi',
    tagline: 'Paling bahagia kalau orang yang gw sayang bahagia.',
    emoji: '🎁',
    color: '#F06B6B',
    description: 'Spending kamu didorong oleh love dan afeksi. Uang = cara mengungkapkan perasaan. Sering over-spend untuk orang lain, under-spend untuk diri sendiri.',
    strengths: [
      'Partner merasa sangat dihargai dan dicintai',
      'Murah hati untuk momen spesial',
      'Tidak egois soal uang dalam hubungan',
    ],
    blindSpots: [
      'Sulit bilang tidak meski budget tidak cukup',
      'Sering neglect kebutuhan finansial diri sendiri',
      'Mudah merasa guilty kalau tidak bisa memberi',
    ],
    resonantQuote: 'Gak apa-apa, kan buat kamu',
  },
  architect: {
    id: 'architect',
    name: 'Si Perencana',
    tagline: 'Semua ada rencana dan tujuannya.',
    emoji: '📊',
    color: '#7EC4A0',
    description: 'Spending kamu didorong oleh goals dan sistem. Bukan pelit — setiap rupiah punya purpose yang jelas. Kamu mau spend, tapi harus ada reason yang clear.',
    strengths: [
      'Paling efektif untuk achieving shared financial goals',
      'Natural at couples financial planning',
      'Data-driven, keputusan berdasarkan fakta bukan emosi',
    ],
    blindSpots: [
      'Bisa terasa tidak romantis — kok semua dihitung?',
      'Overthink hal-hal kecil',
      'Kurang spontaneous dalam hubungan',
    ],
    resonantQuote: 'Kalau kita mulai nabung sekarang, 2 tahun lagi udah bisa...',
  },
  drifter: {
    id: 'drifter',
    name: 'Si Pengikut Arus',
    tagline: 'Ntar juga beres sendiri.',
    emoji: '🌀',
    color: '#E8C078',
    description: 'Spending kamu tidak punya pattern yang jelas — kadang hemat, kadang boros, tergantung mood. Bukan tidak peduli, tapi financial awareness rendah.',
    strengths: [
      'Tidak drama soal uang, easy-going',
      'Adaptif, tidak rigid',
      'Tidak controlling terhadap pasangan soal finansial',
    ],
    blindSpots: [
      'Tidak punya financial goals yang jelas',
      'Sering jadi financial burden tanpa sadar',
      'Sulit diajak planning jangka panjang',
    ],
    resonantQuote: 'Eh kok udah tanggal tua? Kayaknya kemarin baru gajian deh',
  },
}
