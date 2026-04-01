export type MbtiDichotomy = 'EI' | 'SN' | 'TF' | 'JP'

export interface MbtiQuestion {
  id: number
  dichotomy: MbtiDichotomy
  optionA: { text: string; pole: string }
  optionB: { text: string; pole: string }
}

// 40 questions — 10 per dichotomy, scenario-based, poles mixed between A and B
export const mbtiQuestions: MbtiQuestion[] = [

  // ─── E / I ─── (10 questions)
  { id: 1, dichotomy: 'EI',
    optionA: { text: 'Setelah hari yang panjang, aku lebih suka nongkrong dulu sama teman sebelum pulang', pole: 'E' },
    optionB: { text: 'Setelah hari yang panjang, aku lebih suka langsung pulang dan punya waktu sendiri', pole: 'I' } },

  { id: 2, dichotomy: 'EI',
    optionA: { text: 'Aku lebih nyaman di pesta kecil dengan teman dekat daripada acara besar dengan banyak orang', pole: 'I' },
    optionB: { text: 'Aku justru lebih bersemangat di acara besar yang ramai dan bertemu banyak orang baru', pole: 'E' } },

  { id: 3, dichotomy: 'EI',
    optionA: { text: 'Kalau ada konflik, aku biasanya langsung membicarakannya saat itu juga', pole: 'E' },
    optionB: { text: 'Kalau ada konflik, aku butuh waktu sendiri dulu untuk menenangkan pikiran sebelum bicara', pole: 'I' } },

  { id: 4, dichotomy: 'EI',
    optionA: { text: 'Dalam rapat atau diskusi, aku lebih sering diam dan mendengarkan', pole: 'I' },
    optionB: { text: 'Dalam rapat atau diskusi, aku cenderung aktif menyampaikan pendapat', pole: 'E' } },

  { id: 5, dichotomy: 'EI',
    optionA: { text: 'Aku bisa menghabiskan seharian penuh tanpa bertemu siapapun dan tetap merasa baik-baik saja', pole: 'I' },
    optionB: { text: 'Kalau seharian tidak bertemu atau ngobrol dengan orang, aku merasa ada yang kurang', pole: 'E' } },

  { id: 6, dichotomy: 'EI',
    optionA: { text: 'Aku mudah akrab dengan orang yang baru dikenal dalam waktu singkat', pole: 'E' },
    optionB: { text: 'Butuh waktu cukup lama bagiku untuk benar-benar nyaman dengan orang baru', pole: 'I' } },

  { id: 7, dichotomy: 'EI',
    optionA: { text: 'Aku sering berpikir keras dalam diam sebelum menyampaikan sesuatu', pole: 'I' },
    optionB: { text: 'Aku sering baru menyadari apa yang aku pikirkan setelah mengucapkannya', pole: 'E' } },

  { id: 8, dichotomy: 'EI',
    optionA: { text: 'Bekerja dalam tim yang besar dan dinamis membuatku lebih produktif', pole: 'E' },
    optionB: { text: 'Aku bekerja paling baik sendirian atau dalam kelompok kecil yang tenang', pole: 'I' } },

  { id: 9, dichotomy: 'EI',
    optionA: { text: 'Aku punya banyak kenalan tetapi hanya sedikit teman yang benar-benar dekat', pole: 'I' },
    optionB: { text: 'Aku punya banyak teman dan relatif mudah mendekat dengan siapa saja', pole: 'E' } },

  { id: 10, dichotomy: 'EI',
    optionA: { text: 'Di tempat umum yang ramai, aku cepat merasa kelelahan dan ingin keluar', pole: 'I' },
    optionB: { text: 'Di tempat umum yang ramai, aku justru merasa lebih hidup dan berenergi', pole: 'E' } },


  // ─── S / N ─── (10 questions)
  { id: 11, dichotomy: 'SN',
    optionA: { text: 'Saat membaca instruksi baru, aku ikuti langkah-langkahnya secara urut', pole: 'S' },
    optionB: { text: 'Saat membaca instruksi baru, aku lihat gambaran besarnya dulu baru detail', pole: 'N' } },

  { id: 12, dichotomy: 'SN',
    optionA: { text: 'Aku lebih tertarik mendiskusikan konsep dan ide abstrak yang mungkin terjadi di masa depan', pole: 'N' },
    optionB: { text: 'Aku lebih tertarik membahas hal yang konkret dan relevan dengan situasi sekarang', pole: 'S' } },

  { id: 13, dichotomy: 'SN',
    optionA: { text: 'Aku sering memperhatikan detail kecil yang sering dilewatkan orang lain', pole: 'S' },
    optionB: { text: 'Aku lebih mudah menangkap pola dan koneksi antar hal yang sekilas tidak berhubungan', pole: 'N' } },

  { id: 14, dichotomy: 'SN',
    optionA: { text: 'Aku sering memikirkan berbagai kemungkinan yang belum terjadi', pole: 'N' },
    optionB: { text: 'Aku lebih fokus pada apa yang sudah terjadi dan bisa diamati secara nyata', pole: 'S' } },

  { id: 15, dichotomy: 'SN',
    optionA: { text: 'Cara terbaik belajar hal baru bagiku adalah langsung praktik', pole: 'S' },
    optionB: { text: 'Cara terbaik belajar hal baru bagiku adalah memahami konsep dan teorinya dulu', pole: 'N' } },

  { id: 16, dichotomy: 'SN',
    optionA: { text: 'Aku lebih sering hidup di momen sekarang daripada memikirkan masa depan', pole: 'S' },
    optionB: { text: 'Pikiranku sering melompat ke masa depan, membayangkan skenario yang belum terjadi', pole: 'N' } },

  { id: 17, dichotomy: 'SN',
    optionA: { text: 'Aku senang berimajinasi dan mengeksplorasi ide-ide yang tidak biasa', pole: 'N' },
    optionB: { text: 'Aku lebih senang mencari solusi yang terbukti berhasil daripada mencoba hal baru', pole: 'S' } },

  { id: 18, dichotomy: 'SN',
    optionA: { text: 'Aku lebih mengingat fakta dan angka spesifik dari sesuatu yang kupelajari', pole: 'S' },
    optionB: { text: 'Aku lebih mengingat kesan dan makna dari sesuatu yang kupelajari, bukan detailnya', pole: 'N' } },

  { id: 19, dichotomy: 'SN',
    optionA: { text: 'Aku lebih percaya apa yang bisa dibuktikan secara langsung', pole: 'S' },
    optionB: { text: 'Aku sering mengikuti firasat meski sulit dijelaskan alasannya', pole: 'N' } },

  { id: 20, dichotomy: 'SN',
    optionA: { text: 'Aku suka membicarakan makna di balik sesuatu, bukan sekadar faktanya', pole: 'N' },
    optionB: { text: 'Aku lebih tertarik pada fakta dan kenyataan daripada spekulasi maknanya', pole: 'S' } },


  // ─── T / F ─── (10 questions)
  { id: 21, dichotomy: 'TF',
    optionA: { text: 'Saat temanku cerita masalah, aku cenderung langsung menawarkan solusi', pole: 'T' },
    optionB: { text: 'Saat temanku cerita masalah, aku lebih dulu fokus untuk mendengarkan dan memvalidasi perasaannya', pole: 'F' } },

  { id: 22, dichotomy: 'TF',
    optionA: { text: 'Aku bisa setuju atau tidak setuju dengan seseorang tanpa itu mempengaruhi hubunganku dengannya', pole: 'T' },
    optionB: { text: 'Perbedaan pendapat yang tajam sering membuatku memikirkan kondisi hubungan kami', pole: 'F' } },

  { id: 23, dichotomy: 'TF',
    optionA: { text: 'Saat mengkritik seseorang, aku tidak merasa perlu memperhalus kata-kataku terlalu banyak asal maksudnya tersampaikan', pole: 'T' },
    optionB: { text: 'Aku sangat memperhatikan cara penyampaian kritik agar tidak menyakiti perasaan orang', pole: 'F' } },

  { id: 24, dichotomy: 'TF',
    optionA: { text: 'Keputusan terbaik adalah yang paling logis, meski tidak semua orang senang', pole: 'T' },
    optionB: { text: 'Keputusan yang baik juga harus mempertimbangkan dampaknya terhadap perasaan semua pihak', pole: 'F' } },

  { id: 25, dichotomy: 'TF',
    optionA: { text: 'Aku lebih terdorong oleh nilai-nilai dan apa yang terasa benar bagiku', pole: 'F' },
    optionB: { text: 'Aku lebih terdorong oleh efisiensi dan apa yang masuk akal secara logis', pole: 'T' } },

  { id: 26, dichotomy: 'TF',
    optionA: { text: 'Kalau orang marah kepadaku, aku pertama-tama menganalisis apakah kemarahan itu valid secara logis', pole: 'T' },
    optionB: { text: 'Kalau orang marah kepadaku, aku pertama-tama merasa tidak enak dan ingin memperbaiki hubungan', pole: 'F' } },

  { id: 27, dichotomy: 'TF',
    optionA: { text: 'Aku mudah berempati dan sering ikut merasakan emosi orang di sekitarku', pole: 'F' },
    optionB: { text: 'Aku cukup mampu memisahkan perasaanku dari situasi yang sedang dihadapi orang lain', pole: 'T' } },

  { id: 28, dichotomy: 'TF',
    optionA: { text: 'Lebih penting bagimu menjaga keharmonisan dalam hubungan daripada selalu menang argumen', pole: 'F' },
    optionB: { text: 'Kebenaran dan konsistensi logis lebih penting bagimu meski harus berdebat', pole: 'T' } },

  { id: 29, dichotomy: 'TF',
    optionA: { text: 'Aku bisa menyampaikan hal yang menyakitkan dengan cukup langsung jika itu diperlukan', pole: 'T' },
    optionB: { text: 'Menyampaikan hal yang menyakitkan itu sangat sulit bagiku, aku selalu mencari cara yang lebih lembut', pole: 'F' } },

  { id: 30, dichotomy: 'TF',
    optionA: { text: 'Pujian dan apresiasi dari orang lain sangat berarti dan memotivasi aku', pole: 'F' },
    optionB: { text: 'Aku lebih termotivasi oleh pencapaian dan standar yang aku tetapkan untuk diri sendiri', pole: 'T' } },


  // ─── J / P ─── (10 questions)
  { id: 31, dichotomy: 'JP',
    optionA: { text: 'Aku merasa lebih tenang kalau hari minggu sudah ada rencana yang jelas untuk minggu depan', pole: 'J' },
    optionB: { text: 'Aku merasa lebih segar dan bebas saat tidak punya rencana yang mengikat', pole: 'P' } },

  { id: 32, dichotomy: 'JP',
    optionA: { text: 'Aku sering mengumpulkan informasi dulu sebanyak mungkin sebelum membuat keputusan', pole: 'P' },
    optionB: { text: 'Aku lebih nyaman mengambil keputusan lebih awal dan berkomitmen padanya', pole: 'J' } },

  { id: 33, dichotomy: 'JP',
    optionA: { text: 'Ruang kerja atau kamarku cenderung rapi dan terorganisir', pole: 'J' },
    optionB: { text: 'Ruang kerjaku terlihat berantakan bagi orang lain meski aku tahu di mana semua barangnya', pole: 'P' } },

  { id: 34, dichotomy: 'JP',
    optionA: { text: 'Aku merasa lebih nyaman kalau sudah ada itinerary sebelum bepergian', pole: 'J' },
    optionB: { text: 'Liburan terbaik bagiku adalah yang diputuskan mendadak dan tanpa banyak rencana', pole: 'P' } },

  { id: 35, dichotomy: 'JP',
    optionA: { text: 'Aku bisa mengerjakan banyak proyek berbeda sekaligus dengan berpindah-pindah', pole: 'P' },
    optionB: { text: 'Aku lebih suka menyelesaikan satu hal sampai tuntas sebelum mulai yang berikutnya', pole: 'J' } },

  { id: 36, dichotomy: 'JP',
    optionA: { text: 'Deadline membuatku stres, aku lebih suka progres yang bertahap tanpa tekanan waktu ketat', pole: 'P' },
    optionB: { text: 'Tanpa deadline yang jelas, aku cenderung kurang fokus dan butuh target waktu untuk produktif', pole: 'J' } },

  { id: 37, dichotomy: 'JP',
    optionA: { text: 'Aku sering menunda pengambilan keputusan sampai benar-benar harus memilih', pole: 'P' },
    optionB: { text: 'Sesuatu yang belum diputuskan atau masih menggantung membuatku tidak nyaman', pole: 'J' } },

  { id: 38, dichotomy: 'JP',
    optionA: { text: 'Perubahan mendadak pada rencana cukup mengganggu dan membutuhkan penyesuaian ekstra', pole: 'J' },
    optionB: { text: 'Aku cukup mudah beradaptasi dan tidak terlalu terganggu saat rencana berubah mendadak', pole: 'P' } },

  { id: 39, dichotomy: 'JP',
    optionA: { text: 'Aku biasanya mengerjakan tugas jauh-jauh hari sebelum deadline', pole: 'J' },
    optionB: { text: 'Aku justru paling produktif saat sudah mepet deadline, tekanan membuatku fokus', pole: 'P' } },

  { id: 40, dichotomy: 'JP',
    optionA: { text: 'Aku suka punya opsi yang tetap terbuka, siapa tahu ada yang lebih baik', pole: 'P' },
    optionB: { text: 'Aku lebih suka kepastian — tahu apa yang akan terjadi membuatku merasa lebih siap', pole: 'J' } },
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
