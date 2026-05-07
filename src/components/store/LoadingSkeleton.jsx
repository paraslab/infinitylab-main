export default function LoadingSkeleton({ count = 6 }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5 xl:gap-6 auto-rows-fr">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="h-full animate-pulse">
          <div className="relative aspect-square overflow-hidden rounded-[28px] bg-gray-200">
            <div className="absolute left-3 top-3 h-12 w-28 rounded-2xl bg-white/45 sm:left-4 sm:top-4" />
            <div className="absolute inset-x-3 bottom-3 rounded-[22px] bg-gray-700/30 p-3 sm:inset-x-4 sm:bottom-4">
              <div className="h-3 w-1/2 rounded bg-white/35" />
              <div className="mt-2 h-5 w-2/3 rounded bg-white/45" />
              <div className="mt-3 h-3 w-full rounded bg-white/25" />
            </div>
          </div>
          <div className="mt-3 h-11 rounded-2xl bg-gray-200" />
        </div>
      ))}
    </div>
  );
}
