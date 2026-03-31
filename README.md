# Couple App - Kesiapan Assessment

A mobile-first PWA for Indonesian couples to assess their relationship readiness across 5 key dimensions.

## Tech Stack

- **Framework:** Next.js 14 (App Router) + TypeScript
- **Styling:** Tailwind CSS
- **Backend:** Supabase (auth + database + realtime)
- **Forms:** React Hook Form
- **Deploy:** Vercel

## Getting Started

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local
# Edit .env.local with your Supabase credentials

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
  app/
    page.tsx          # Landing page
    layout.tsx        # Root layout (mobile-first)
    assessment/
      page.tsx        # Assessment flow (15 questions)
    results/
      page.tsx        # Results dashboard
  components/         # Shared components
  data/
    questions.ts      # Assessment questions (5 dimensions)
  lib/
    supabase.ts       # Supabase client
```

## Assessment Dimensions

1. **Komunikasi** - Communication openness and conflict resolution
2. **Nilai & Visi** - Shared values and life vision alignment
3. **Keuangan** - Financial transparency and planning
4. **Keluarga** - Family planning and in-law relationships
5. **Komitmen** - Long-term commitment readiness

## Contributing

- All changes must go through a Pull Request
- Direct pushes to `main` are not allowed
- At least 1 reviewer approval required before merge
