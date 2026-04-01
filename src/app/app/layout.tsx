import BottomNav from '@/components/app/BottomNav'

// Auth is already checked by middleware — no duplicate check needed here
export default function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="relative min-h-screen">
      <div className="pb-20">
        {children}
      </div>
      <BottomNav />
    </div>
  )
}
