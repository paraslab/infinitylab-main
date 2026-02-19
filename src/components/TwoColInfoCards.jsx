import React from "react";
import { Link } from "react-router-dom";

export default function TwoColCards({ items }) {
  return (
    <section className="px-4 py-16">
      <div className="max-w-7xl mx-auto grid gap-6 md:grid-cols-2">
        {items.map((item, index) => (
          <div
            key={index}
            className="
            bg-[#FFFAFA]
              rounded-2xl
              shadow-md
              p-8 md:p-10
              flex flex-col justify-between
              transition-all duration-300
              hover:shadow-xl
            "
          >
            {/* Content */}
            <div>
              <h3 className="text-2xl md:text-3xl font-semibold text-[#1F2937]">
                {item.title}
              </h3>

              {item.description && (
                <p className="mt-4 text-[#4B5563] leading-relaxed">
                  {item.description}
                </p>
              )}
            </div>

            {/* CTA */}
            {item.link && (
              <Link
                to={item.link}
                className="
                  mt-8 inline-flex items-center gap-2
                  text-sm font-medium text-[#1F2937]
                  hover:gap-3 transition-all
                "
              >
                {item.cta || "Know more"} →
              </Link>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
