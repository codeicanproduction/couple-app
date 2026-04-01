import type { Chapter, RoundConfig } from '@/types/samakan'

// ─── CHAPTERS ───

export const CHAPTERS: Chapter[] = [
  {
    id: 'hari-pertama',
    title: 'Hari Pertama',
    subtitle: 'Kalian baru ketemu. Seberapa sync dari awal?',
    gradient: 'from-rose to-pink-600',
    bgClass: 'bg-gradient-to-br from-rose-900 to-pink-900',
    intro: 'Bayangkan ini hari pertama kalian ketemu. Belum kenal, tapi ada sesuatu yang bikin penasaran. Seberapa mirip cara kalian melihat dunia?',
    bridges: [
      'Obrolan pertama mengalir. Kalian mulai nemuin kesamaan kecil yang bikin senyum.',
      'Makan siang bareng. Ternyata selera kalian...',
      'Sore hari, kalian jalan-jalan tanpa arah. Yang penting bareng.',
      'Hari mulai gelap. Satu hal lagi sebelum pulang...',
    ],
    endings: {
      high: 'Hari pertama yang sempurna. Kalian kayak udah kenal lama.',
      mid: 'Banyak hal tak terduga hari ini. Tapi justru itu yang bikin mau ketemu lagi.',
      low: 'Kalian berbeda, dan itu gapapa. Kadang yang beda justru saling melengkapi.',
    },
    rounds: [
      {
        type: 'pilih_sama',
        storyPrompt: 'Kalian mampir ke kafe. Pilih minuman yang sama!',
        options: ['Kopi', 'Matcha', 'Coklat', 'Jus Buah'],
      },
      {
        type: 'ketik_sama',
        storyPrompt: 'Obrolan nyambung ke soal tempat. Sebutin satu kota impian!',
        category: 'Kota impian',
        timeLimit: 10,
      },
      {
        type: 'tebak_pasangan',
        storyPrompt: 'Kalian mulai nebak-nebak tentang satu sama lain.',
        questionForSelf: 'Kalau weekend, kamu lebih suka ngapain?',
        questionForPartner: 'Kalau weekend, pasanganmu lebih suka ngapain?',
      },
      {
        type: 'hitung_bareng',
        storyPrompt: 'Bill datang. Total Rp15. Bagi rata, tapi harus pas!',
        target: 15,
      },
      {
        type: 'tap_bareng',
        storyPrompt: 'Hari selesai. Ketuk meja bareng sebagai tanda hari yang seru!',
      },
    ],
  },
  {
    id: 'jalan-jalan',
    title: 'Jalan-Jalan Bareng',
    subtitle: 'Liburan pertama berdua. Bisa kompak?',
    gradient: 'from-sky-500 to-blue-600',
    bgClass: 'bg-gradient-to-br from-sky-900 to-blue-900',
    intro: 'Koper udah siap. Destinasi belum pasti. Yang penting: bareng. Liburan pertama kalian dimulai sekarang.',
    bridges: [
      'Sampai di bandara. Perut udah mulai lapar...',
      'Check-in hotel selesai. Sekarang mau ngapain dulu?',
      'Seharian jalan, kaki udah pegel. Tapi masih semangat.',
      'Malam terakhir. Satu momen lagi sebelum pulang.',
    ],
    endings: {
      high: 'Liburan terbaik. Kalian travel partner yang sempurna.',
      mid: 'Ada drama kecil di jalan, tapi justru jadi cerita lucu buat diceritain nanti.',
      low: 'Gaya liburan kalian beda. Tapi hey, yang penting pengalamannya bareng.',
    },
    rounds: [
      {
        type: 'pilih_sama',
        storyPrompt: 'Sampai di destinasi. Mau makan apa dulu?',
        options: ['Seafood', 'Sate', 'Mie', 'Nasi Goreng'],
      },
      {
        type: 'ketik_sama',
        storyPrompt: 'Besok mau ke mana? Sebutin satu aktivitas!',
        category: 'Aktivitas liburan',
        timeLimit: 10,
      },
      {
        type: 'hitung_bareng',
        storyPrompt: 'Belanja oleh-oleh. Budget Rp20, jangan sampai lebih!',
        target: 20,
      },
      {
        type: 'tebak_pasangan',
        storyPrompt: 'Di toko souvenir, kamu tebak apa yang pasanganmu pilih.',
        questionForSelf: 'Souvenir apa yang kamu mau beli?',
        questionForPartner: 'Souvenir apa yang pasanganmu mau beli?',
      },
      {
        type: 'tap_bareng',
        storyPrompt: 'Sunset view! Foto bareng — klik shutter bersamaan!',
      },
    ],
  },
  {
    id: 'rumah-baru',
    title: 'Rumah Baru',
    subtitle: 'Bikin rumah bersama. Harus satu visi!',
    gradient: 'from-emerald-500 to-green-600',
    bgClass: 'bg-gradient-to-br from-emerald-900 to-green-900',
    intro: 'Kunci rumah baru ada di tangan. Kosong, putih, penuh kemungkinan. Saatnya bikin jadi rumah kalian.',
    bridges: [
      'Ruang tamu masih kosong. Mulai dari sini.',
      'Sekarang dapur. Ini tempat yang bakal sering dipake.',
      'Belanja kebutuhan rumah. Harus atur budget.',
      'Rumah udah mulai kelihatan bentuknya.',
    ],
    endings: {
      high: 'Rumah ini punya jiwa kalian berdua. Sempurna.',
      mid: 'Ada kompromi di sana-sini, tapi hasilnya tetap rumah yang hangat.',
      low: 'Selera kalian beda, dan rumah ini jadi unik karena itu.',
    },
    rounds: [
      {
        type: 'pilih_sama',
        storyPrompt: 'Pilih warna cat untuk ruang tamu!',
        options: ['Putih', 'Abu-abu', 'Krem', 'Biru Muda'],
      },
      {
        type: 'ketik_sama',
        storyPrompt: 'Satu barang yang wajib ada di rumah kalian?',
        category: 'Barang rumah wajib',
        timeLimit: 10,
      },
      {
        type: 'tebak_pasangan',
        storyPrompt: 'Bagi tugas rumah tangga.',
        questionForSelf: 'Tugas rumah yang kamu rela lakuin?',
        questionForPartner: 'Tugas rumah yang pasanganmu rela lakuin?',
      },
      {
        type: 'hitung_bareng',
        storyPrompt: 'Budget belanja furnitur Rp18 juta. Atur bareng!',
        target: 18,
      },
      {
        type: 'tap_bareng',
        storyPrompt: 'Rumah siap! Buka pintu bareng untuk pertama kalinya.',
      },
    ],
  },
  {
    id: 'hari-besar',
    title: 'Hari Besar',
    subtitle: 'Rencana momen spesial. Koordinasi harus pas!',
    gradient: 'from-amber-500 to-orange-500',
    bgClass: 'bg-gradient-to-br from-amber-900 to-orange-900',
    intro: 'Ada momen besar yang harus dirayakan. Surprise? Party? Intimate dinner? Kalian harus satu suara.',
    bridges: [
      'Konsep udah ada di kepala. Tapi sama gak ya?',
      'Detail kecil yang bikin beda. Siapa yang lebih teliti?',
      'Budget harus diperhitungkan dengan baik.',
      'Hampir ready. Satu sentuhan terakhir.',
    ],
    endings: {
      high: 'Hari besar yang gak akan dilupain. Teamwork kalian luar biasa.',
      mid: 'Ada improvisasi di sana-sini. Tapi momennya tetap spesial.',
      low: 'Beda visi, tapi yang penting niat baiknya sama.',
    },
    rounds: [
      {
        type: 'pilih_sama',
        storyPrompt: 'Tema acaranya apa?',
        options: ['Makan Malam', 'House Party', 'Piknik', 'Staycation'],
      },
      {
        type: 'ketik_sama',
        storyPrompt: 'Lagu apa yang harus diputer di acara ini?',
        category: 'Lagu untuk momen spesial',
        timeLimit: 10,
      },
      {
        type: 'hitung_bareng',
        storyPrompt: 'Budget acara Rp12. Atur pengeluaran bareng!',
        target: 12,
      },
      {
        type: 'tebak_pasangan',
        storyPrompt: 'Hadiah. Kamu tahu gak apa yang pasanganmu mau?',
        questionForSelf: 'Hadiah yang kamu paling mau sekarang?',
        questionForPartner: 'Hadiah yang pasanganmu paling mau sekarang?',
      },
      {
        type: 'tap_bareng',
        storyPrompt: 'Tiup lilin bareng. Hitung mundur... dan tiup!',
      },
    ],
  },
]

export function getChapter(id: string): Chapter | undefined {
  return CHAPTERS.find(c => c.id === id)
}
