import { Skeleton } from '@/components/ui/Skeleton'

export default function PartnerLoading() {
  return (
    <div className="animate-fade-in pb-6">
      <div className="border-b border-border bg-white px-6 py-5">
        <Skeleton className="h-6 w-24" />
      </div>

      <div className="space-y-4 px-6 pt-6">
        {/* Partner profile card skeleton */}
        <div className="rounded-2xl border border-border bg-white p-5 text-center">
          <Skeleton className="mx-auto h-20 w-20 rounded-full" />
          <Skeleton className="mx-auto mt-3 h-5 w-32" />
          <Skeleton className="mx-auto mt-1.5 h-3 w-20" />
          <Skeleton className="mx-auto mt-3 h-14 w-full rounded-xl" />
        </div>

        {/* MBTI card skeleton */}
        <Skeleton className="h-32 w-full rounded-2xl" />

        {/* Assessment skeleton */}
        <Skeleton className="h-40 w-full rounded-2xl" />

        {/* Wishlist skeleton */}
        <Skeleton className="h-24 w-full rounded-2xl" />
      </div>
    </div>
  )
}
