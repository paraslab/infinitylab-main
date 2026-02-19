import React, { useState } from "react";

export default function ProductCard({
  title = "Runa",
  price = "€300.00",
  image,
  href = "#",
}) {
  const [loaded, setLoaded] = useState(false);

  return (
    <a
      href={href}
      className="
        group relative block overflow-hidden rounded-xl
         border border-black/10
        transition-all duration-500 hover:shadow-2xl
      "
    >
      {/* skeleton */}
      {!loaded && (
        <div className="absolute inset-0 animate-pulse bg-gray-200 z-10" />
      )}

      {/* ✅ Responsive image wrapper */}
      <div className="relative h-[260px] sm:h-[320px] lg:h-[360px] w-full overflow-hidden bg-white">
        <img
          src={image}
          alt={title}
          loading="lazy"
          onLoad={() => setLoaded(true)}
          className={`
            h-full w-full
            object-contain sm:object-cover
            transition-all duration-700
            group-hover:scale-105 group-hover:blur-md
            ${loaded ? "opacity-100" : "opacity-0"}
          `}
        />

        <div
          className="
            absolute inset-0
            bg-black/0
            transition-all duration-500
            group-hover:bg-black/30
          "
        />
      </div>

      {/* Floating name */}
      <div className="absolute top-4 left-4 z-20 bg-white px-4 py-2 rounded-br-xl rounded-tl-xl shadow-md text-sm font-semibold">
        {title}
      </div>

      {/* Bottom panel */}
      <div
        className="
          absolute left-3 right-3 bottom-3
          bg-white rounded-lg px-4 py-3
          flex items-center justify-between
          shadow-lg
          translate-y-24 opacity-0
          transition-all duration-500 ease-out
          group-hover:translate-y-0 group-hover:opacity-100
        "
      >
        <span className="text-sm font-medium text-gray-900">{price}</span>
        <span className="relative text-sm font-medium after:absolute after:left-0 after:-bottom-0.5 after:h-[2px] after:w-0 after:bg-black after:transition-all after:duration-300 group-hover:after:w-full">
          View
        </span>
      </div>
    </a>
  );
}
