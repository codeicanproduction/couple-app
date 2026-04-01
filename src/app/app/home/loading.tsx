import { Skeleton } from '@/components/ui/Skeleton'

export default function HomeLoading() {
  return (
    <div className="animate-fade-in pb-6">
      {/* Couple header skeleton */}
      <div className="border-b border-border bg-white px-6 py-5">
        <div className="flex items-center justify-center gap-4">
          <Skeleton className="h-14 w-14 rounded-full" />
          <Skeleton className="h-6 w-6 rounded-full" />
          <Skeleton className="h-14 w-14 rounded-full" />
        </div>
        <Skeleton className="mx-auto mt-3 h-4 w-40" />
        <Skeleton className="mx-auto mt-1.5 h-3 w-28" />
      </div>

      <div className="space-y-4 px-6 pt-6">
        {/* Miss you button skeleton */}
        <div>
          <Skeleton className="mb-2 h-3 w-28" />
          <Skeleton className="h-14 w-full rounded-2xl" />
        </div>

        {/* Banner skeleton */}
        <Skeleton className="h-20 w-full rounded-2xl" />

        {/* Daily question skeleton */}
        <div className="rounded-2xl border border-border bg-white p-5">
          <Skeleton className="h-3 w-20 mb-3" />
          <Skeleton className="h-5 w-full mb-2" />
          <Skeleton className="h-5 w-3/4 mb-4" />
          <Skeleton className="h-10 w-full rounded-xl" />
        </div>

        {/* Cards skeleton */}
        <Skeleton className="h-24 w-full rounded-2xl" />
        <Skeleton className="h-24 w-full rounded-2xl" />
      </div>
    </div>
  )
}
