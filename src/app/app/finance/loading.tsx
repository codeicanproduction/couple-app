import { Skeleton } from '@/components/ui/Skeleton'

export default function FinanceLoading() {
  return (
    <div className="animate-fade-in pb-6">
      {/* Gradient hero skeleton */}
      <div className="bg-gradient-to-br from-rose/20 to-rose/10 px-6 pb-8 pt-6">
        <Skeleton className="h-3 w-24 bg-rose/20" />
        <Skeleton className="mt-2 h-8 w-48 bg-rose/20" />
        <div className="mt-3 flex gap-4">
          <Skeleton className="h-3 w-24 bg-rose/20" />
          <Skeleton className="h-3 w-24 bg-rose/20" />
        </div>
        <Skeleton className="mt-3 h-2 w-full rounded-full bg-rose/20" />
      </div>

      <div className="space-y-4 px-6 pt-5">
        {/* Buttons skeleton */}
        <div className="flex gap-3">
          <Skeleton className="h-12 flex-1 rounded-2xl" />
          <Skeleton className="h-12 flex-1 rounded-2xl" />
        </div>

        {/* Stats skeleton */}
        <div className="grid grid-cols-3 gap-2">
          <Skeleton className="h-20 rounded-xl" />
          <Skeleton className="h-20 rounded-xl" />
          <Skeleton className="h-20 rounded-xl" />
        </div>

        {/* Transactions skeleton */}
        <div className="rounded-2xl border border-border bg-white overflow-hidden">
          <Skeleton className="h-10 w-full rounded-none" />
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex items-center gap-3 px-4 py-3 border-t border-gray-50">
              <Skeleton className="h-9 w-9 rounded-xl" />
              <div className="flex-1">
                <Skeleton className="h-3.5 w-24 mb-1" />
                <Skeleton className="h-2.5 w-16" />
              </div>
              <Skeleton className="h-4 w-16" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
