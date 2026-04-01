export type QuestionType = 'agree_disagree' | 'scale' | 'priority'

export type Dimension =
  | 'komunikasi'
  | 'nilai_visi'
  | 'keuangan'
  | 'keluarga'
  | 'komitmen'

export interface Question {
  id: number
  dimension: Dimension
  type: QuestionType
  text: string
  options?: string[]
}

export const DIMENSION_LABELS: Record<Dimension, string> = {
  komunikasi: 'Komunikasi',
  nilai_visi: 'Nilai & Visi',
  keuangan: 'Keuangan',
  keluarga: 'Keluarga',
  komitmen: 'Komitmen',
}

export const questions: Question[] = [
  // Komunikasi (3 questions)
  {
    id: 1,
    dimension: 'komunikasi',
    type: 'agree_disagree',
    text: 'Aku merasa nyaman menceritakan kekhawatiran atau masalahku ke pasangan.',
  },
  {
    id: 2,
    dimension: 'komunikasi',
    type: 'scale',
    text: 'Seberapa sering kamu dan pasangan membicarakan perasaan masing-masing secara terbuka?',
  },
  {
    id: 3,
    dimension: 'komunikasi',
    type: 'agree_disagree',
    text: 'Ketika ada konflik, kami bisa menyelesaikannya tanpa saling diam-diaman berhari-hari.',
  },
  // Nilai & Visi (3 questions)
  {
    id: 4,
    dimension: 'nilai_visi',
    type: 'agree_disagree',
    text: 'Kami punya pandangan yang sama tentang bagaimana ingin menjalani hidup 5 tahun ke depan.',
  },
  {
    id: 5,
    dimension: 'nilai_visi',
    type: 'priority',
    text: 'Mana yang lebih penting menurutmu dalam hubungan?',
    options: ['Karir & ambisi pribadi', 'Waktu berkualitas bersama'],
  },
  {
    id: 6,
    dimension: 'nilai_visi',
    type: 'agree_disagree',
    text: 'Kami sudah pernah membahas soal keyakinan, nilai hidup, dan prinsip masing-masing.',
  },
  // Keuangan (3 questions)
  {
    id: 7,
    dimension: 'keuangan',
    type: 'agree_disagree',
    text: 'Kami terbuka soal penghasilan dan pengeluaran masing-masing.',
  },
  {
    id: 8,
    dimension: 'keuangan',
    type: 'scale',
    text: 'Seberapa siap kamu dan pasangan untuk mengatur keuangan bersama?',
  },
  {
    id: 9,
    dimension: 'keuangan',
    type: 'priority',
    text: 'Mana yang lebih penting untuk masa depan bersama?',
    options: ['Menabung & investasi dulu', 'Menikmati hidup sekarang'],
  },
  // Keluarga (3 questions)
  {
    id: 10,
    dimension: 'keluarga',
    type: 'agree_disagree',
    text: 'Kami sudah membahas soal rencana punya anak dan kapan waktunya.',
  },
  {
    id: 11,
    dimension: 'keluarga',
    type: 'scale',
    text: 'Seberapa baik hubungan kamu dengan keluarga pasangan?',
  },
  {
    id: 12,
    dimension: 'keluarga',
    type: 'agree_disagree',
    text: 'Kami sepakat tentang peran keluarga besar dalam kehidupan kami nanti.',
  },
  // Komitmen (3 questions)
  {
    id: 13,
    dimension: 'komitmen',
    type: 'agree_disagree',
    text: 'Aku yakin pasanganku adalah orang yang tepat untuk masa depanku.',
  },
  {
    id: 14,
    dimension: 'komitmen',
    type: 'scale',
    text: 'Seberapa siap kamu untuk berkomitmen jangka panjang dengan pasangan?',
  },
  {
    id: 15,
    dimension: 'komitmen',
    type: 'agree_disagree',
    text: 'Kami sudah pernah membicarakan tentang menikah atau langkah serius berikutnya.',
  },
]
