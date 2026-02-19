import React from "react";
import { Link } from "react-router-dom";

export default function QuoteCard({
  quote,
  name = "Laxriq Group",
  link,              // page path (optional)
  linkText = "Learn More",
}) {
  return (
    <section className="relative w-full py-28 px-6 flex justify-center overflow-hidden">
      
      {/* Subtle background accent */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 w-[600px] h-[600px] 
          -translate-x-1/2 -translate-y-1/2 rounded-full 
          bg-[#3F4A35]/10 blur-3xl" />
      </div>

      <div className="relative max-w-5xl text-center">
        
        {/* Quote icon */}
        <div className="mb-8 flex justify-center">
          <span className="text-6xl md:text-7xl font-serif text-[#3F4A35]/30">
            “
          </span>
        </div>

        {/* Quote text */}
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#1f1f1f] leading-snug">
          {quote}
        </h1>

        {/* Divider */}
        <div className="w-16 h-[2px] bg-[#3F4A35] mx-auto my-10 rounded-full" />

        {/* Author */}
        <p className="uppercase tracking-widest text-sm text-[#3F4A35] font-medium">
          {name}
        </p>

        {/* CTA Link (Optional) */}
        {link && (
          <div className="mt-10 flex justify-center">
            <Link
              to={link}
              className="
                px-6 py-3
              rounded-2xl
                border border-[#3F4A35]
                text-[#3F4A35]
                font-medium tracking-wide
                transition-all duration-300
                hover:bg-[#2F8F6A]
                hover:text-white
              "
            >
              {linkText}
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
