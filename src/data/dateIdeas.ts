export interface DateIdea {
  title: string
  category: 'gratis' | 'murah' | 'spesial'
  description: string
  estimatedBudget: string
}

export const DATE_IDEAS: DateIdea[] = [
  // Gratis
  { title: 'Piknik di taman', category: 'gratis', description: 'Bawa bekal dan tikar, nikmati sore bersama', estimatedBudget: 'Rp 0' },
  { title: 'Masak bareng di rumah', category: 'gratis', description: 'Pilih resep baru dan coba masak bersama', estimatedBudget: 'Rp 0' },
  { title: 'Marathon film', category: 'gratis', description: 'Pilih series atau film yang belum ditonton', estimatedBudget: 'Rp 0' },
  { title: 'Jalan sore / sunset', category: 'gratis', description: 'Jalan kaki keliling komplek sambil ngobrol', estimatedBudget: 'Rp 0' },
  { title: 'Main board game', category: 'gratis', description: 'UNO, kartu, atau game HP bareng', estimatedBudget: 'Rp 0' },
  { title: 'Stargazing malam', category: 'gratis', description: 'Cari tempat yang gelap dan lihat bintang', estimatedBudget: 'Rp 0' },
  { title: 'Foto-foto bareng', category: 'gratis', description: 'Mini photoshoot pakai HP di spot unik', estimatedBudget: 'Rp 0' },
  { title: 'Belajar hal baru bareng', category: 'gratis', description: 'Tutorial YouTube: origami, menggambar, dll', estimatedBudget: 'Rp 0' },

  // Murah
  { title: 'Ngopi di cafe baru', category: 'murah', description: 'Explore cafe yang belum pernah dicoba', estimatedBudget: 'Rp 50-100rb' },
  { title: 'Street food hunting', category: 'murah', description: 'Jalan-jalan cari jajanan kaki lima', estimatedBudget: 'Rp 30-80rb' },
  { title: 'Nonton bioskop', category: 'murah', description: 'Film baru + popcorn berdua', estimatedBudget: 'Rp 100-150rb' },
  { title: 'Karaoke', category: 'murah', description: 'Sewa room 1-2 jam, nyanyi sepuasnya', estimatedBudget: 'Rp 80-150rb' },
  { title: 'Naik angkot / KRL adventure', category: 'murah', description: 'Turun di stasiun random dan explore', estimatedBudget: 'Rp 20-50rb' },
  { title: 'Ke toko buku / perpustakaan', category: 'murah', description: 'Baca bareng, pilihkan buku untuk satu sama lain', estimatedBudget: 'Rp 0-100rb' },
  { title: 'Ice cream date', category: 'murah', description: 'Coba semua rasa di tempat es krim favorit', estimatedBudget: 'Rp 30-60rb' },
  { title: 'Ke pasar malam', category: 'murah', description: 'Main games, makan jajanan, naik bianglala', estimatedBudget: 'Rp 50-100rb' },

  // Spesial
  { title: 'Staycation hotel', category: 'spesial', description: 'Menginap di hotel, breakfast berdua', estimatedBudget: 'Rp 300-800rb' },
  { title: 'Fine dining', category: 'spesial', description: 'Dinner romantis di restoran bagus', estimatedBudget: 'Rp 300-600rb' },
  { title: 'Day trip ke luar kota', category: 'spesial', description: 'Naik kereta/mobil ke kota terdekat', estimatedBudget: 'Rp 200-500rb' },
  { title: 'Kelas bareng', category: 'spesial', description: 'Pottery class, cooking class, atau painting', estimatedBudget: 'Rp 200-400rb' },
  { title: 'Spa / massage couple', category: 'spesial', description: 'Relax bareng di spa pasangan', estimatedBudget: 'Rp 300-600rb' },
  { title: 'Adventure date', category: 'spesial', description: 'Hiking, snorkeling, atau flying fox', estimatedBudget: 'Rp 100-400rb' },
]

export function getRandomDateIdea(): DateIdea {
  return DATE_IDEAS[Math.floor(Math.random() * DATE_IDEAS.length)]
}

export function getDateIdeasByCategory(category: DateIdea['category']): DateIdea[] {
  return DATE_IDEAS.filter(d => d.category === category)
}
