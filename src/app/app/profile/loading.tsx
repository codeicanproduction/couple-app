import { Skeleton } from '@/components/ui/Skeleton'

export default function ProfileLoading() {
  return (
    <div className="animate-fade-in pb-6">
      <div className="border-b border-border bg-white px-6 py-5">
        <Skeleton className="h-6 w-16" />
      </div>

      <div className="space-y-4 px-6 pt-6">
        {/* Profile card skeleton */}
        <div className="rounded-2xl border border-border bg-white p-5">
          <div className="flex items-center gap-4">
            <Skeleton className="h-16 w-16 rounded-full" />
            <div>
              <Skeleton className="h-5 w-32 mb-1.5" />
              <Skeleton className="h-3 w-24" />
            </div>
          </div>
          <Skeleton className="mt-4 h-14 w-full rounded-xl" />
        </div>

        {/* MBTI skeleton */}
        <Skeleton className="h-3 w-32 mb-1" />
        <Skeleton className="h-24 w-full rounded-2xl" />

        {/* Toggle skeleton */}
        <Skeleton className="h-14 w-full rounded-xl" />

        {/* Quick links skeleton */}
        <div className="rounded-2xl border border-border bg-white overflow-hidden">
          <Skeleton className="h-12 w-full rounded-none" />
          <Skeleton className="h-12 w-full rounded-none border-t border-gray-50" />
          <Skeleton className="h-12 w-full rounded-none border-t border-gray-50" />
        </div>

        {/* Logout button skeleton */}
        <Skeleton className="h-12 w-full rounded-2xl" />
      </div>
    </div>
  )
}
