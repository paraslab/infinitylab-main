export default function LoadingSkeleton({ count = 6 }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5 xl:gap-6 auto-rows-fr">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="h-full bg-white rounded-2xl border border-gray-100 overflow-hidden animate-pulse">
          <div className="h-32 sm:h-48 xl:h-56 bg-gray-200" />
          <div className="p-3 sm:p-5 space-y-3">
            <div className="h-4 bg-gray-200 rounded w-3/4" />
            <div className="h-3 bg-gray-200 rounded w-1/2" />
            <div className="h-3 bg-gray-200 rounded w-full" />
            <div className="h-3 bg-gray-200 rounded w-5/6" />
            <div className="pt-2 flex gap-2">
              <div className="flex-1 h-10 bg-gray-200 rounded-xl" />
              <div className="flex-1 h-10 bg-gray-200 rounded-xl" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
