export default function SkeletonLoader({ count = 3, type = 'post' }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-[#1e293b] rounded-lg border border-[#475569] p-5 animate-pulse">
          {type === 'post' ? (
            <>
              <div className="h-4 bg-[#334155] rounded w-1/4 mb-3" />
              <div className="h-6 bg-[#334155] rounded w-3/4 mb-2" />
              <div className="h-4 bg-[#334155] rounded w-full mb-1" />
              <div className="h-4 bg-[#334155] rounded w-2/3 mb-3" />
              <div className="flex gap-4">
                <div className="h-3 bg-[#334155] rounded w-16" />
                <div className="h-3 bg-[#334155] rounded w-20" />
              </div>
            </>
          ) : (
            <div className="space-y-2">
              <div className="h-4 bg-[#334155] rounded w-1/3" />
              <div className="h-3 bg-[#334155] rounded w-full" />
              <div className="h-3 bg-[#334155] rounded w-4/5" />
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
