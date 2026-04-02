# Nanti Kita — Feature Knowledge Bank
> Last updated: 2 April 2026

## Product Overview
Nanti Kita adalah PWA untuk pasangan Indonesia yang serius mempersiapkan masa depan bersama. Tagline: **"Bucin tapi realistis."**

**Tech Stack:** Next.js 14 App Router, Supabase (Auth + DB + Realtime + Storage), Tailwind CSS, TypeScript, PWA (Service Worker + Push Notifications)

**Production URL:** https://couple-app-three.vercel.app

---

## 1. AUTHENTICATION & ONBOARDING

### Auth System
- **Provider:** Supabase Auth (email + password)
- **Route protection:** Middleware (`src/middleware.ts`) — protects `/app/*`, `/onboarding/*`, `/admin/*`
- **Session:** Cookie-based via `@supabase/ssr`
- **Signout:** API route `/api/auth/signout` for proper cookie clearing

### Onboarding Flow (5 steps)
1. **Welcome** (`/onboarding/welcome`) — emotional intro, 3 feature pills, "Mari Mulai" CTA
2. **Profile** (`/onboarding/profile`) — nama panggilan, tanggal lahir, tanggal mulai bersama
3. **Couple** (`/onboarding/couple`) — buat pasangan baru (generate invite code) ATAU gabung dengan kode
4. **Invite** (`/onboarding/invite`) — tampilkan kode + link undangan, share via WhatsApp
5. **Install** (`/onboarding/install`) — PWA install guide (iOS/Android) + push notification permission

### Invite System
- 8-character alphanumeric invite code (collision retry 3x)
- Shareable link: `{APP_URL}/invite/{CODE}`
- WhatsApp deep link with pre-filled message
- Invite route (`/invite/[code]`) — redirects to signup (if not logged in) or onboarding couple step

### Auto-seed Events
- Saat couple dibuat/join → otomatis seed:
  - "Ulang Tahun {nama}" (birthday, recurring)
  - "Anniversary" (relationship start date, recurring, deduplicated)

---

## 2. HOME DASHBOARD (`/app/home`)

### Layout (top to bottom)
1. **CoupleProfileHero** — big centered avatars with heart connector, names, days together, relationship level badge
2. **Kangen Button** — send "miss you" notification to partner (30min cooldown, max 10/day)
3. **Surat Rahasia Banner** — shows when there are unread letters, with notification badge
4. **Daily Question Card** — pertanyaan hari ini with answer input, partner answer bubbles, streak counter
5. **Quick Access Grid** — 2x2 tiles: Games, Keuangan, Kalender, About Me

### Couple Level System
Based on relationship duration (from `relationship_start_date`):
| Level | Days | Badge Color |
|-------|------|-------------|
| Benih | 0-90 | Gold |
| Tumbuh | 91-365 | Sage/Green |
| Mekar | 366-730 | Rose |
| Abadi | 731+ | Rose gradient |

---

## 3. DAILY QUESTIONS

### Mechanism
- **Pool:** 52 pertanyaan bahasa Indonesia (rotates by day-of-year)
- **Input:** Textarea — user types answer, sends with button
- **Both partners answer:** Each partner sees their own answer (rose bubble) and partner's answer (sage bubble)
- **Waiting state:** Pulsing dot + "Menunggu jawaban {partner}..."
- **Celebration:** Heart banner "Kalian sudah menjawab hari ini!" when both answered

### Streak Counter
- Fire icon + "{N} hari" — counts consecutive days where BOTH partners answered
- Displayed in daily question card header

### Database
- Table: `daily_responses` (couple_id, profile_id, question_index, answer, answered_date)
- Unique: one answer per person per day
- RLS: couple members only

### Notification
- When partner answers → push: "{nama} sudah jawab pertanyaan hari ini! Giliranmu"

---

## 4. GAMES (`/app/games`)

### Games Hub
Grid of available games with locked/unlocked states.

### 4a. Samakan (Real-time Couple Sync Game)
- **Route:** `/app/games/samakan` → `/app/games/samakan/[sessionId]`
- **Mechanic:** Real-time via Supabase Realtime channels
- **Chapters:** 4 themed chapters, each with story narrative + 5 rounds
- **Round Types:**
  - `pilih_sama` — both pick from same options, score if match
  - `ketik_sama` — both type answer, score based on similarity
  - `hitung_bareng` — take turns counting to a target number
  - `tebak_pasangan` — guess what partner will answer
  - `tap_bareng` — tap at same time, score based on sync
- **Flow:** Lobby → Countdown → Story Intro → Rounds (with story bridges) → Story Ending → Results
- **Scoring:** 0-20 per round, percentage-based endings (high/mid/low)
- **Notification:** When game created → partner gets "ngajak main Samakan!"

### 4b. Deep Talk (Card Game)
- **Route:** `/app/games/deep-talk` → packs → levels
- **Mechanic:** Question card packs with progressive depth levels
- **Admin panel:** `/admin/deep-talk/` for managing packs and questions

### 4c. Locked Games (Coming Soon)
- Truth or Dare
- Quiz Bahasa Cinta (Love Language Quiz)
- Tes Kompatibilitas

---

## 5. FINANCE (`/app/finance`)

### Savings Goal
- **Guided Wizard:** Goal type presets (Dana Nikah, Liburan, DP Rumah, Mobil, Dana Darurat, Lainnya) → Name → Target amount → Target date → Current savings → Preview calculation
- **Gradient Hero Header:** Shows total balance, progress bar, percentage, target info
- **Monthly required:** "Rp X/bulan untuk mencapai target tepat waktu"
- **Milestone messages:** 25% / 50% / 75% / 100% celebrations

### Transaction Ledger (Shared)
- **Both partners can add:** deposits (uang masuk) and withdrawals (uang keluar)
- **Each transaction tracks:** who (created_by), amount (+/-), type, category, note, timestamp
- **Categories (withdrawal):** Date Night, Anniversary, Belanja, Persiapan Nikah, Lainnya
- **Quick amount presets:** 500rb, 1jt, 2jt, 5jt
- **Transaction history:** Activity feed with colored icons, who-badge, relative dates
- **Stats row:** Saldo, Total Masuk, Total Keluar
- **Auto-recalculate:** Goal balance = SUM(all transaction amounts)

### Notification
- When partner adds transaction → push: "{nama} menambahkan Rp X ke {target}" or "{nama} mencatat pengeluaran Rp X"

### 3-Tab Wishlist
| Tab | Content | Who Can Add |
|-----|---------|-------------|
| Bersama | Shared items (rumah tangga/nikah) | Both |
| Milikku | My personal wishlist (partner can see = gift hint!) | Only me |
| {Partner Name} | Partner's wishlist (read-only, gift ideas) | Only partner |

### Wishlist Features
- **Price:** Optional Rp amount
- **Marketplace link:** Paste Shopee/Tokopedia/Lazada URL → auto-detected badge with color
- **Check/uncheck:** Mark as purchased
- **Total display:** Sum of unpurchased items per tab
- **Partner hint:** "Ini wishlist {nama} — bisa jadi ide kado!" on partner tab
- **Notification:** When item added → partner gets push

### Database Tables
- `savings_goals` — name, target_amount, current_amount, target_date
- `couple_transactions` — amount (+/-), type, category, note, created_by
- `wishlist_items` — name, price, link, image_url, is_purchased, owner_type, owner_id

---

## 6. CALENDAR (`/app/calendar`)

### Monthly Grid View
- Visual calendar with month/year navigation
- Day cells show colored dots for events
- Tap date to see events for that day
- Today highlighted

### Event Types
| Type | Icon | Color | Example |
|------|------|-------|---------|
| birthday | Gift | Gold | Ulang Tahun Eric |
| anniversary | Heart | Rose | Anniversary |
| date_plan | MapPin | Purple | Nonton Bioskop |
| reminder | Bell | Blue | Bayar cicilan |
| event | Calendar | Gray | Kondangan teman |
| milestone | Star | Sage | 1000 Hari Bersama |

### Event Scope
- **Bersama** (couple) — visible to both
- **Pribadi** (personal) — my events
- **Pasangan** (partner) — partner's events

### Event Fields
- Title, date, type, scope, is_recurring, description, location, budget, is_completed

### Date Plan Feature
- **Date Ideas Pool:** 22 ideas (8 gratis, 8 murah, 6 spesial) with descriptions & budget estimates
- **Random suggestion:** "Ide Date" card with refresh button
- **"Jadikan Date Plan":** 1-tap convert idea → date plan with date + location
- **Mark complete:** Date plans can be marked "Selesai"

### Notification
- When event created → partner gets push: "{nama} menambahkan {type}: '{title}'"

---

## 7. SURAT RAHASIA (Letters) (`/app/letters`)

### Features
- **Write letter:** `/app/letters/tulis` — max 2000 characters, set unlock date
- **Time-locked:** Letter can only be opened after unlock date
- **Read letter:** `/app/letters/[letterId]` — revealed at unlock time
- **Home banner:** Shows count of ready-to-open letters with amber animated badge

### Notification
- When letter sent → partner gets push: "Kamu punya surat yang bisa dibuka {date}"

---

## 8. KANGEN (Miss You)

### Mechanism
- Tap "Kangen" button on home → inserts to `miss_you` table
- **Cooldown:** 30 minutes between sends
- **Daily limit:** Max 10 per day
- **Visual feedback:** Button animates, shows "Terkirim!", push status indicator
- **Partner receives:** Toast notification on home + push notification

### Notification
- Push: "{nama} lagi kangen kamu"

---

## 9. ABOUT ME (`/app/about-me`)

### Personality Tests
| Test | Status | Description |
|------|--------|-------------|
| Tes MBTI | Active | 20 pertanyaan, kenali kepribadianmu |
| Love Language | Coming Soon | Cara memberi & menerima cinta |
| Bahasa Maaf | Coming Soon | Cara minta & memberi maaf |
| Spending Habits | Coming Soon | Gaya mengelola uang |
| Attachment Style | Coming Soon | Pola kelekatan dalam hubungan |

### MBTI Test (`/app/partner/mbti`)
- 20 questions, calculates 4-letter type (E/I, S/N, T/F, J/P)
- Results saved to `mbti_results` table
- Displayed on profile page

---

## 10. PROFILE (`/app/profile`)

### Features
- **Avatar upload** — crop & upload to Supabase Storage
- **Edit profile** — modal to change name, birthday, relationship start date
- **Relationship stats** — days together, level badge, start date
- **Notification toggle** — enable/disable push notifications
- **Menu Lainnya** — links to About Me, Games, Keuangan, Kalender, Surat Rahasia
- **Settings** — invite partner (if solo), help, privacy policy
- **Sign out**

---

## 11. PARTNER PAGE (`/app/partner`)

- View partner's profile, MBTI result, relationship stats
- MissYou toast (received kangen notifications)
- Partner-specific content

---

## 12. PUSH NOTIFICATIONS

### Infrastructure
- **VAPID keys** — stored in env vars
- **Service Worker** — `public/sw.js` with tiered caching strategy
- **Subscription table** — `push_subscriptions` (profile_id, endpoint, p256dh, auth_key)
- **Send API** — `/api/push/send` (authenticated, uses web-push library)
- **Admin panel** — `/admin/notifications/` for broadcast

### All Notification Triggers
| Event | Message | Recipient | URL |
|-------|---------|-----------|-----|
| Kangen | "{nama} lagi kangen kamu" | Partner | /app/home |
| Kangen reply | "{nama} kangen kamu juga!" | Partner | /app/home |
| Game invite | "{nama} ngajak main Samakan!" | Partner | /app/games/samakan/{id} |
| Daily Q answered | "{nama} sudah jawab pertanyaan hari ini!" | Partner | /app/home |
| Finance transaction | "{nama} menambahkan Rp X ke {target}" | Partner | /app/finance |
| Wishlist item added | "{nama} menambahkan '{item}' ke wishlist" | Partner | /app/partner |
| Letter sent | "Kamu punya surat yang bisa dibuka {date}" | Partner | /app/letters |
| Calendar event | "{nama} menambahkan {type}: '{title}'" | Partner | /app/calendar |

---

## 13. PWA Configuration

- **Manifest:** `/public/manifest.json`
- **Service Worker:** `/public/sw.js` — tiered caching (static cache-first, API network-first, pages stale-while-revalidate)
- **Icons:** `/public/icons/icon-192.png`, etc.
- **Install prompt:** Onboarding install page with iOS/Android instructions
- **Theme color:** `#FFF8F0` (cream)

---

## 14. NAVIGATION

### BottomNav (5 tabs)
| Position | Icon | Label | Route |
|----------|------|-------|-------|
| Left 1 | Home | Beranda | /app/home |
| Left 2 | Heart | Pasangan | /app/partner |
| Center (floating) | Wallet | Keuangan | /app/finance |
| Right 1 | Calendar | Kalender | /app/calendar |
| Right 2 | User | Profil | /app/profile |

---

## 15. DATABASE SCHEMA (Supabase)

### Tables
| Table | Purpose | RLS |
|-------|---------|-----|
| profiles | User data (name, birthday, avatar, etc.) | Own profile |
| couples | Couple entity (invite_code, created_by) | Couple members |
| couple_members | Junction table (couple_id ↔ profile_id) | Own membership |
| assessment_results | Assessment scores (answers JSON, scores JSON) | Couple members |
| daily_responses | Daily question answers (answer text, date) | Couple members |
| couple_events | Calendar events (title, date, type, scope, etc.) | Couple members |
| savings_goals | Savings targets (name, target, current, date) | Couple members |
| couple_transactions | Financial ledger (+/- amounts, category, who) | Couple members |
| savings_entries | Legacy monthly entries | Couple members |
| wishlist_items | Wishlist (name, price, link, owner_type) | Couple members |
| miss_you | Kangen records (sender, receiver, timestamp) | Couple members |
| letters | Time-locked letters (content, unlock_date) | Couple members |
| push_subscriptions | Push notification endpoints | Own subscriptions |
| mbti_results | MBTI test results (type, scores) | Couple members |
| samakan_sessions | Game sessions (chapter, players, scores, rounds) | Couple members |
| deep_talk_* | Deep Talk game data | Couple members |

### Key Function
- `get_my_couple_id()` — returns current user's couple_id for RLS policies

---

## 16. ADMIN PANEL (`/admin`)

- **Protected:** Only users with `role = 'admin'` in profiles
- **Pages:**
  - `/admin/deep-talk/` — manage Deep Talk packs and questions
  - `/admin/notifications/` — send broadcast notifications, view subscription stats
  - `/admin/users/` — view user list

---

## 17. DESIGN SYSTEM

### Colors
| Token | Hex | Usage |
|-------|-----|-------|
| cream | #FFF8F0 | Background |
| rose | #F06B6B | Primary accent |
| rose-dark | #E05555 | Hover/active |
| gold | #E8C078 | Secondary accent |
| sage | #7EC4A0 | Success/positive |
| sage-dark | #5BA882 | Success text |
| ink | #2D2424 | Primary text |
| ink-muted | #8B7E7E | Secondary text |

### Typography
- **Font:** DM Sans (weights: 400, 500, 600, 700, 800)
- **Headings:** font-extrabold, tracking-tight

### Components
- **Button** — CVA variants (primary, secondary, ghost, danger), sizes (sm, md, lg), loading spinner
- **Input** — label, error, hint support, rose focus ring
- **Card** — rounded-2xl, border, shadow-card
- **Modal** — bottom-sheet style, backdrop blur, slide-up animation

### Icons
- **Library:** Lucide React
- **Rule:** No emoji anywhere — all icons are Lucide SVG
