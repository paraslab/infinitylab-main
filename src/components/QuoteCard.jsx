import React from "react";

export default function QuoteCard({
  image,
  quote,
  name = "Happy Customer",
  link = "#",
  linkText = "View Product",
  rating = 5,
}) {
  return (
    <section className="w-full  pt-24 mt-10 px-6 flex justify-center">
      <div className="relative max-w-4xl text-center">

        {/* Floating Image */}
        <div className="absolute -top-16 left-1/2 -translate-x-1/2">
          <div className="bg-white p-2 rounded-xl shadow-lg rotate-[-6deg]">
            <img
              src={image}
              alt={name}
              className="w-20 h-24 object-cover rounded-lg"
            />
          </div>
        </div>

        {/* Quote Box */}
        <div className="pt-16">
          <h1 className="text-3xl md:text-4xl lg:text-5xl  Display text-[#1f1f1f] leading-tight mb-8">
            {quote}
          </h1>
        </div>
      </div>
    </section>
  );
}
