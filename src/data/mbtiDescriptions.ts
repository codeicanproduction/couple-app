export interface MbtiTypeInfo {
  type: string
  title: string
  emoji: string
  description: string
  strengths: string[]
  loveStyle: string
}

export const MBTI_DESCRIPTIONS: Record<string, MbtiTypeInfo> = {
  INTJ: {
    type: 'INTJ', title: 'Si Arsitek', emoji: '\u{1F9E0}',
    description: 'Pemikir strategis yang visioner. Selalu punya rencana jangka panjang dan standar tinggi.',
    strengths: ['Strategis', 'Mandiri', 'Determinasi kuat', 'Analitis'],
    loveStyle: 'Menunjukkan cinta lewat tindakan nyata dan perencanaan masa depan bersama.',
  },
  INTP: {
    type: 'INTP', title: 'Si Pemikir', emoji: '\u{1F4A1}',
    description: 'Pecinta logika dan teori. Selalu penasaran dan suka menganalisis segala hal.',
    strengths: ['Logis', 'Kreatif', 'Open-minded', 'Objektif'],
    loveStyle: 'Menunjukkan cinta dengan mendengarkan dan memahami cara berpikir pasangan.',
  },
  ENTJ: {
    type: 'ENTJ', title: 'Si Komandan', emoji: '\u{1F451}',
    description: 'Pemimpin alami yang tegas dan efisien. Suka memotivasi orang di sekitarnya.',
    strengths: ['Percaya diri', 'Tegas', 'Ambisius', 'Inspiratif'],
    loveStyle: 'Menunjukkan cinta dengan membantu pasangan mencapai potensi terbaiknya.',
  },
  ENTP: {
    type: 'ENTP', title: 'Si Pendebat', emoji: '\u{26A1}',
    description: 'Inovator yang suka tantangan. Selalu punya ide baru dan tidak takut beda pendapat.',
    strengths: ['Inovatif', 'Adaptif', 'Energik', 'Quick-thinker'],
    loveStyle: 'Menunjukkan cinta lewat diskusi mendalam dan petualangan bersama.',
  },
  INFJ: {
    type: 'INFJ', title: 'Si Penasihat', emoji: '\u{1F52E}',
    description: 'Idealis yang penuh empati. Memahami orang lain secara mendalam dan punya visi mulia.',
    strengths: ['Empatik', 'Visioner', 'Penuh perhatian', 'Bermakna'],
    loveStyle: 'Menunjukkan cinta dengan kedalaman emosional dan koneksi spiritual.',
  },
  INFP: {
    type: 'INFP', title: 'Si Mediator', emoji: '\u{1F338}',
    description: 'Pemimpi yang idealis dan penuh perasaan. Mencari makna dalam segala hal.',
    strengths: ['Idealis', 'Kreatif', 'Setia', 'Penuh kasih'],
    loveStyle: 'Menunjukkan cinta lewat perhatian kecil yang penuh makna dan puisi hati.',
  },
  ENFJ: {
    type: 'ENFJ', title: 'Si Protagonis', emoji: '\u{1F31F}',
    description: 'Pemimpin karismatik yang peduli. Menginspirasi orang lain menjadi versi terbaik mereka.',
    strengths: ['Karismatik', 'Inspiratif', 'Altruistik', 'Diplomatis'],
    loveStyle: 'Menunjukkan cinta dengan dukungan penuh dan memprioritaskan kebahagiaan pasangan.',
  },
  ENFP: {
    type: 'ENFP', title: 'Si Juru Kampanye', emoji: '\u{1F308}',
    description: 'Jiwa bebas yang antusias dan penuh semangat. Melihat potensi di mana-mana.',
    strengths: ['Antusias', 'Kreatif', 'Sosial', 'Optimis'],
    loveStyle: 'Menunjukkan cinta lewat spontanitas, kejutan, dan kata-kata penuh semangat.',
  },
  ISTJ: {
    type: 'ISTJ', title: 'Si Inspektur', emoji: '\u{1F4CB}',
    description: 'Dapat diandalkan dan bertanggung jawab. Memegang teguh komitmen dan tradisi.',
    strengths: ['Bertanggung jawab', 'Teliti', 'Konsisten', 'Setia'],
    loveStyle: 'Menunjukkan cinta lewat kesetiaan, konsistensi, dan tindakan praktis.',
  },
  ISFJ: {
    type: 'ISFJ', title: 'Si Pelindung', emoji: '\u{1F6E1}',
    description: 'Pelindung yang hangat dan perhatian. Selalu ada untuk orang-orang tersayang.',
    strengths: ['Perhatian', 'Sabar', 'Setia', 'Detail-oriented'],
    loveStyle: 'Menunjukkan cinta lewat perhatian sehari-hari dan menjaga kenyamanan pasangan.',
  },
  ESTJ: {
    type: 'ESTJ', title: 'Si Eksekutif', emoji: '\u{1F4BC}',
    description: 'Organisator yang tegas dan terstruktur. Menjaga ketertiban dan standar tinggi.',
    strengths: ['Terorganisir', 'Tegas', 'Setia', 'Pekerja keras'],
    loveStyle: 'Menunjukkan cinta dengan memberikan stabilitas dan struktur dalam hubungan.',
  },
  ESFJ: {
    type: 'ESFJ', title: 'Si Konsul', emoji: '\u{1F91D}',
    description: 'Orang yang hangat dan populer. Selalu menjaga harmoni dan peduli pada sekitar.',
    strengths: ['Hangat', 'Peduli', 'Sosial', 'Kooperatif'],
    loveStyle: 'Menunjukkan cinta lewat perhatian penuh, hadiah, dan quality time.',
  },
  ISTP: {
    type: 'ISTP', title: 'Si Virtuoso', emoji: '\u{1F527}',
    description: 'Praktis dan suka eksplorasi. Punya kemampuan problem-solving yang tajam.',
    strengths: ['Praktis', 'Adaptif', 'Logis', 'Spontan'],
    loveStyle: 'Menunjukkan cinta lewat bantuan praktis dan berbagi pengalaman baru.',
  },
  ISFP: {
    type: 'ISFP', title: 'Si Petualang', emoji: '\u{1F3A8}',
    description: 'Jiwa seni yang sensitif dan penuh perasaan. Hidup di momen sekarang.',
    strengths: ['Artistik', 'Sensitif', 'Hangat', 'Spontan'],
    loveStyle: 'Menunjukkan cinta lewat gesture romantis dan momen kebersamaan yang indah.',
  },
  ESTP: {
    type: 'ESTP', title: 'Si Pengusaha', emoji: '\u{1F525}',
    description: 'Energik dan berani. Suka tantangan dan hidup dengan penuh aksi.',
    strengths: ['Energik', 'Berani', 'Adaptif', 'Pragmatis'],
    loveStyle: 'Menunjukkan cinta lewat petualangan seru dan momen penuh kegembiraan.',
  },
  ESFP: {
    type: 'ESFP', title: 'Si Penghibur', emoji: '\u{1F389}',
    description: 'Pusat perhatian yang ceria dan spontan. Membuat setiap momen jadi menyenangkan.',
    strengths: ['Ceria', 'Spontan', 'Praktis', 'Bersemangat'],
    loveStyle: 'Menunjukkan cinta lewat kebersamaan yang penuh tawa dan kejutan manis.',
  },
}

export function getMbtiDescription(type: string): MbtiTypeInfo | null {
  return MBTI_DESCRIPTIONS[type.toUpperCase()] ?? null
}
