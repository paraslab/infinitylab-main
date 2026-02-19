// src/components/MissionCard.jsx
import React from "react";
import { Link } from "react-router-dom";

export default function MissionCard({
  badge = "Arteleaf",
  title,
  highlight,
  description = [],
  brand = "viral",
  logo,
  align = "center", // center | left
  brandLink,          // ✅ new
  linkLabel = "Learn more →", // ✅ optional text
}) {
  return (
    <section
      className={`w-full flex ${
        align === "center" ? "justify-center" : "justify-start"
      } py-20`}
    >
      <div className="relative max-w-xl w-full bg-[#FFFAFA] rounded-2xl shadow-[0_10px_50px_rgba(0,0,0,0.06)] p-8 sm:p-10">

        {/* Badge */}
        {badge && (
          <div className="inline-block mb-6">
            <span className="text-xs font-medium px-3 py-1 rounded-lg bg-black/5 text-gray-800">
              {badge}
            </span>
          </div>
        )}

        {/* Heading */}
        <h2 className="text-4xl sm:text-5xl font-medium tracking-tight leading-[1.1] text-black mb-6">
          {title}{" "}
          {highlight && (
            <span className="italic font-serif tracking-tight">
              {highlight}
            </span>
          )}
        </h2>

        {/* Text */}
        <div className="space-y-4 text-[15px] leading-relaxed text-black/60">
          {description.map((text, i) => (
            <p key={i}>{text}</p>
          ))}
        </div>

        {/* ✅ Bottom Link */}
        {brandLink && (
          <div className="mt-8">
            <Link
              to={brandLink}
              className="inline-flex items-center gap-2 text-sm font-medium text-black hover:gap-3 transition-all"
            >
              {linkLabel}
              <span aria-hidden></span>
            </Link>
          </div>
        )}

      </div>
    </section>
  );
}
