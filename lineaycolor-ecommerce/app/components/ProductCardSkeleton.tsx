export default function ProductCardSkeleton() {
  return (
    <div className="relative overflow-hidden rounded-lg shadow-md">
      <div className="relative h-[400px] bg-gray-200 animate-pulse" />
      <div className="absolute bottom-0 left-0 right-0 bg-white/95 p-6">
        <div className="h-6 bg-gray-200 rounded animate-pulse mb-2" />
        <div className="h-4 bg-gray-200 rounded animate-pulse mb-2 w-3/4" />
        <div className="h-5 bg-gray-200 rounded animate-pulse w-1/3" />
      </div>
    </div>
  )
}