import React from "react";

export default function SectionImage({
  image = "/bg.webp",
  title = "Built on Trust.",
  subtitle = "Delivered with Integrity.",
  description,
  points = [],
}) {
  return (
    <section className="w-full px-6">
      <div className="relative max-w-7xl mx-auto h-[520px] rounded-[28px] overflow-hidden">

        {/* BACKGROUND IMAGE */}
        <img
          src={image}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* LEFT GRADIENT OVERLAY */}
        <div className="absolute inset-y-0 left-0 w-full bg-gradient-to-r from-black/70 via-black/40 to-transparent" />

        {/* CONTENT */}
        <div className="relative z-10 h-full flex items-center px-10 md:px-16">
          <div className="max-w-xl text-white">

            {/* TITLE */}
            <h2 className="text-4xl md:text-5xl font-Playfair leading-tight">
              {title}
              {subtitle && (
                <span className="block italic text-white/60 mt-2">
                  {subtitle}
                </span>
              )}
            </h2>

            {/* DESCRIPTION */}
            {description && (
              <p className="mt-6 text-white/70 leading-relaxed">
                {description}
              </p>
            )}

            {/* POINTS */}
            {points.length > 0 && (
              <ul className="mt-8 space-y-4 text-sm text-white/70">
                {points.map((point, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-white/80" />
                    {point}
                  </li>
                ))}
              </ul>
            )}

          </div>
        </div>

      </div>
    </section>
  );
}
