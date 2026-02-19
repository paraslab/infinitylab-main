import React from "react";

export default function GroupHistory({
  title = "Group of Companies",
  subtitle = "Our History",
  description1,
  description2,
  highlightText,
  image,
  imageAlt = "Group Image",
  reverse = false, // optional: image left / content right
}) {
  return (
    <section className="px-4 py-14 md:py-20">
      <div
        className={`
          max-w-7xl mx-auto
          bg-[#2F8F6A]
          rounded-[32px] md:rounded-[40px]
          overflow-hidden
          grid md:grid-cols-2 gap-10
          items-center
          px-6 md:px-16 py-10 md:py-14
          ${reverse ? "md:flex-row-reverse" : ""}
        `}
      >
        {/* CONTENT */}
        <div className="text-white">
          <h2 className="text-3xl md:text-5xl leading-tight">
            {title}
            {subtitle && (
              <span className="block italic text-white/70 mt-1 md:mt-2">
                {subtitle}
              </span>
            )}
          </h2>

          {description1 && (
            <p className="mt-4 md:mt-6 text-sm md:text-base text-white/80 leading-relaxed max-w-xl">
              {description1}
            </p>
          )}

          {description2 && (
            <p className="mt-3 md:mt-4 text-sm md:text-base text-white/80 leading-relaxed max-w-xl">
              {description2}{" "}
              {highlightText && (
                <span className="text-white font-medium">
                  {highlightText}
                </span>
              )}
            </p>
          )}
        </div>

        {/* IMAGE */}
        <div className="flex justify-center md:justify-end">
          <img
            src={image}
            alt={imageAlt}
            className="
              w-full max-w-xs
              md:max-w-none md:w-[420px] lg:w-[480px]
              rounded-2xl md:rounded-3xl
              shadow-2xl
              object-cover
            "
          />
        </div>
      </div>
    </section>
  );
}
