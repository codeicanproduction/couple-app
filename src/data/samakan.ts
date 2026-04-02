import type { Chapter } from '@/types/samakan'

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
      'Hari mulai gelap. Saatnya cek chemistry yang sesungguhnya.',
      'Satu pertanyaan terakhir sebelum malam berakhir.',
      'Momen penutup yang gak bakal dilupain.',
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
        options: ['Kopi', 'Matcha', 'Coklat Panas', 'Jus Buah'],
      },
      {
        type: 'pilih_sama',
        storyPrompt: 'Sambil ngobrol, ternyata selera musik kalian...',
        options: ['Pop', 'R&B / Soul', 'Lo-fi / Chill', 'Dangdut / Indo'],
      },
      {
        type: 'slider_sama',
        storyPrompt: 'Kalian mulai bahas soal kopi.',
        question: 'Seberapa suka kamu ngopi?',
        minLabel: 'Gak suka',
        maxLabel: 'Gak bisa hidup tanpa kopi',
      },
      {
        type: 'tebak_pasangan',
        storyPrompt: 'Kalian mulai nebak-nebak tentang satu sama lain.',
        questionForSelf: 'Kalau weekend, kamu lebih suka ngapain?',
        questionForPartner: 'Kalau weekend, pasanganmu lebih suka ngapain?',
        options: ['Rebahan di rumah', 'Jalan-jalan keluar', 'Nongkrong sama teman', 'Olahraga / Gym'],
      },
      {
        type: 'pilih_sama',
        storyPrompt: 'Perut mulai lapar. Pilih makanan bareng!',
        options: ['Pizza', 'Sushi', 'Nasi Padang', 'Burger'],
      },
      {
        type: 'tebak_angka',
        storyPrompt: 'Sebelum pulang, coba pilih angka yang sama!',
        question: 'Angka keberuntungan kalian hari ini?',
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
      'Check-in hotel selesai. Saatnya explore!',
      'Seharian jalan, kaki udah pegel. Tapi masih semangat.',
      'Belanja oleh-oleh. Harus pinter milih.',
      'Sore hari, istirahat sebentar di hotel.',
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
        options: ['Seafood', 'Sate', 'Mie Lokal', 'Nasi Goreng'],
      },
      {
        type: 'pilih_sama',
        storyPrompt: 'Besok mau ke mana?',
        options: ['Pantai', 'Gunung / Alam', 'Kota tua / Museum', 'Pasar lokal'],
      },
      {
        type: 'slider_sama',
        storyPrompt: 'Jalan seharian, mulai lelah...',
        question: 'Seberapa kuat stamina jalan kaki kamu?',
        minLabel: 'Gampang capek',
        maxLabel: 'Bisa jalan seharian',
      },
      {
        type: 'tebak_pasangan',
        storyPrompt: 'Di toko souvenir, kamu tebak apa yang pasanganmu pilih.',
        questionForSelf: 'Oleh-oleh apa yang kamu mau beli?',
        questionForPartner: 'Oleh-oleh apa yang pasanganmu mau beli?',
        options: ['Kaos / Baju', 'Makanan khas', 'Gantungan kunci', 'Kerajinan tangan'],
      },
      {
        type: 'tebak_angka',
        storyPrompt: 'Kalian main tebak-tebakan di hotel.',
        question: 'Pilih angka 1-10. Coba samain!',
      },
      {
        type: 'pilih_sama',
        storyPrompt: 'Malam terakhir. Mau ngapain?',
        options: ['Dinner romantis', 'Street food hunting', 'Karaoke', 'Nonton sunset'],
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
      'Sekarang kamar tidur. Warna apa ya?',
      'Dapur. Ini tempat yang bakal sering dipake.',
      'Urusan bersih-bersih. Siapa yang rajin ya?',
      'Belanja furniture. Harus sesuai budget.',
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
        type: 'pilih_sama',
        storyPrompt: 'Gaya interior rumah impian?',
        options: ['Minimalis', 'Industrial', 'Scandinavian', 'Modern Tropical'],
      },
      {
        type: 'slider_sama',
        storyPrompt: 'Soal kebersihan rumah...',
        question: 'Seberapa rapi kamu orangnya?',
        minLabel: 'Santai aja',
        maxLabel: 'Harus bersih sempurna',
      },
      {
        type: 'tebak_pasangan',
        storyPrompt: 'Bagi tugas rumah tangga.',
        questionForSelf: 'Tugas rumah yang kamu rela lakuin?',
        questionForPartner: 'Tugas rumah yang pasanganmu rela lakuin?',
        options: ['Masak', 'Nyuci baju', 'Ngepel / Nyapu', 'Cuci piring'],
      },
      {
        type: 'tebak_angka',
        storyPrompt: 'Main angka dulu sebelum lanjut belanja.',
        question: 'Pilih angka 1-10, coba match!',
      },
      {
        type: 'pilih_sama',
        storyPrompt: 'Satu barang wajib di rumah baru?',
        options: ['TV gede', 'Sofa empuk', 'Meja makan kayu', 'Tanaman hias'],
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
      'Detail kecil yang bikin beda.',
      'Musik harus pas buat momennya.',
      'Soal hadiah. Siapa yang lebih jago nebak?',
      'Budget harus diperhitungkan.',
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
        options: ['Makan Malam Romantis', 'House Party', 'Piknik Outdoor', 'Staycation Hotel'],
      },
      {
        type: 'pilih_sama',
        storyPrompt: 'Dress code buat acara?',
        options: ['Casual santai', 'Smart casual', 'Formal elegan', 'Tema warna matching'],
      },
      {
        type: 'slider_sama',
        storyPrompt: 'Soal surprise...',
        question: 'Seberapa suka kamu dikasih surprise?',
        minLabel: 'Biasa aja',
        maxLabel: 'Suka banget!',
      },
      {
        type: 'tebak_pasangan',
        storyPrompt: 'Hadiah. Kamu tahu gak apa yang pasanganmu mau?',
        questionForSelf: 'Hadiah yang kamu paling mau sekarang?',
        questionForPartner: 'Hadiah yang pasanganmu paling mau sekarang?',
        options: ['Barang elektronik', 'Baju / Sepatu', 'Pengalaman (trip/spa)', 'Makanan / Kue'],
      },
      {
        type: 'tebak_angka',
        storyPrompt: 'Angka hoki buat hari ini!',
        question: 'Pilih angka keberuntungan kalian!',
      },
      {
        type: 'pilih_sama',
        storyPrompt: 'Lagu penutup malam ini?',
        options: ['Lagu slow romantis', 'Lagu upbeat seru', 'Lagu nostalgia', 'Lagu viral TikTok'],
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
