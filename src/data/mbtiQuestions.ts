export type MbtiDichotomy = 'EI' | 'SN' | 'TF' | 'JP'

export interface MbtiQuestion {
  id: number
  dichotomy: MbtiDichotomy
  optionA: { text: string; pole: string }
  optionB: { text: string; pole: string }
}

export const mbtiQuestions: MbtiQuestion[] = [
  // E/I — Extrovert vs Introvert
  { id: 1, dichotomy: 'EI',
    optionA: { text: 'Aku lebih semangat setelah bertemu banyak orang', pole: 'E' },
    optionB: { text: 'Aku butuh waktu sendiri untuk mengisi ulang energi', pole: 'I' } },
  { id: 2, dichotomy: 'EI',
    optionA: { text: 'Aku suka ngobrol dan berkenalan dengan orang baru', pole: 'E' },
    optionB: { text: 'Aku lebih nyaman dengan teman dekat yang sudah kenal lama', pole: 'I' } },
  { id: 3, dichotomy: 'EI',
    optionA: { text: 'Aku cenderung berpikir sambil berbicara', pole: 'E' },
    optionB: { text: 'Aku lebih suka memikirkan dulu sebelum berbicara', pole: 'I' } },
  { id: 4, dichotomy: 'EI',
    optionA: { text: 'Weekend ideal: hangout bareng banyak teman', pole: 'E' },
    optionB: { text: 'Weekend ideal: di rumah nonton film atau baca buku', pole: 'I' } },
  { id: 5, dichotomy: 'EI',
    optionA: { text: 'Aku sering jadi yang memulai percakapan duluan', pole: 'E' },
    optionB: { text: 'Aku lebih sering menunggu orang lain yang memulai', pole: 'I' } },

  // S/N — Sensing vs Intuition
  { id: 6, dichotomy: 'SN',
    optionA: { text: 'Aku fokus pada fakta dan detail yang ada di depan mata', pole: 'S' },
    optionB: { text: 'Aku lebih tertarik dengan kemungkinan dan ide besar', pole: 'N' } },
  { id: 7, dichotomy: 'SN',
    optionA: { text: 'Aku lebih percaya pengalaman langsung', pole: 'S' },
    optionB: { text: 'Aku lebih percaya intuisi dan firasat', pole: 'N' } },
  { id: 8, dichotomy: 'SN',
    optionA: { text: 'Aku suka instruksi yang jelas, step-by-step', pole: 'S' },
    optionB: { text: 'Aku suka mencari cara sendiri yang kreatif', pole: 'N' } },
  { id: 9, dichotomy: 'SN',
    optionA: { text: 'Aku lebih realistis dan praktis', pole: 'S' },
    optionB: { text: 'Aku sering melamun dan membayangkan masa depan', pole: 'N' } },
  { id: 10, dichotomy: 'SN',
    optionA: { text: 'Aku perhatikan detail kecil yang orang lain lewatkan', pole: 'S' },
    optionB: { text: 'Aku lebih melihat gambaran besar dan pola', pole: 'N' } },

  // T/F — Thinking vs Feeling
  { id: 11, dichotomy: 'TF',
    optionA: { text: 'Saat ada masalah, aku mencari solusi yang logis', pole: 'T' },
    optionB: { text: 'Saat ada masalah, aku memikirkan perasaan semua orang', pole: 'F' } },
  { id: 12, dichotomy: 'TF',
    optionA: { text: 'Aku lebih menghargai kejujuran meski menyakitkan', pole: 'T' },
    optionB: { text: 'Aku lebih memilih cara yang lembut walau harus berputar', pole: 'F' } },
  { id: 13, dichotomy: 'TF',
    optionA: { text: 'Keputusan terbaik berdasarkan data dan logika', pole: 'T' },
    optionB: { text: 'Keputusan terbaik mempertimbangkan nilai dan harmoni', pole: 'F' } },
  { id: 14, dichotomy: 'TF',
    optionA: { text: 'Aku bisa tetap objektif meski situasinya emosional', pole: 'T' },
    optionB: { text: 'Aku mudah merasakan emosi orang lain', pole: 'F' } },
  { id: 15, dichotomy: 'TF',
    optionA: { text: 'Kritik yang membangun itu penting untuk berkembang', pole: 'T' },
    optionB: { text: 'Apresiasi dan dukungan lebih memotivasi aku', pole: 'F' } },

  // J/P — Judging vs Perceiving
  { id: 16, dichotomy: 'JP',
    optionA: { text: 'Aku suka merencanakan semuanya dari jauh hari', pole: 'J' },
    optionB: { text: 'Aku lebih suka spontan dan fleksibel', pole: 'P' } },
  { id: 17, dichotomy: 'JP',
    optionA: { text: 'Aku merasa tenang kalau to-do list sudah selesai', pole: 'J' },
    optionB: { text: 'Aku merasa terkekang dengan jadwal yang kaku', pole: 'P' } },
  { id: 18, dichotomy: 'JP',
    optionA: { text: 'Aku suka menyelesaikan satu hal sebelum mulai yang lain', pole: 'J' },
    optionB: { text: 'Aku sering mengerjakan beberapa hal sekaligus', pole: 'P' } },
  { id: 19, dichotomy: 'JP',
    optionA: { text: 'Deadline membuat aku lebih produktif dan teratur', pole: 'J' },
    optionB: { text: 'Aku bekerja paling baik saat ada kebebasan waktu', pole: 'P' } },
  { id: 20, dichotomy: 'JP',
    optionA: { text: 'Liburan harus ada itinerary yang jelas', pole: 'J' },
    optionB: { text: 'Liburan paling seru kalau tanpa rencana pasti', pole: 'P' } },
]

export interface MbtiScores {
  E: number; I: number
  S: number; N: number
  T: number; F: number
  J: number; P: number
}

export function calculateMbtiType(answers: Record<number, string>): { type: string; scores: MbtiScores } {
  const scores: MbtiScores = { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 }

  mbtiQuestions.forEach(q => {
    const answer = answers[q.id]
    if (answer === 'A') scores[q.optionA.pole as keyof MbtiScores]++
    else if (answer === 'B') scores[q.optionB.pole as keyof MbtiScores]++
  })

  const type = [
    scores.E >= scores.I ? 'E' : 'I',
    scores.S >= scores.N ? 'S' : 'N',
    scores.T >= scores.F ? 'T' : 'F',
    scores.J >= scores.P ? 'J' : 'P',
  ].join('')

  return { type, scores }
}
