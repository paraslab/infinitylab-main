import React from "react";

const countries = [
  { name: "USA", image: "https://flagicons.lipis.dev/flags/4x3/us.svg" },
  { name: "EUROPE", image: "https://flagicons.lipis.dev/flags/4x3/eu.svg" },
  { name: "AUSTRALIA", image: "https://flagicons.lipis.dev/flags/4x3/au.svg" },
  { name: "KUWAIT", image: "https://flagicons.lipis.dev/flags/4x3/kw.svg" },
  { name: "INDIA", image: "https://flagicons.lipis.dev/flags/4x3/in.svg" },
];

export default function InternationalPresence() {
  return (
    <section className="relative w-full py-24 bg-[#d1ffe4] overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">

        {/* Heading */}
        <h2 className="text-center text-3xl md:text-4xl font-semibold text-gray-600 tracking-wide mb-16">
          INTERNATIONAL PRESENCE
        </h2>

        {/* Masked slider */}
        <div className="masked-slider">
          <div
            className="
              flex items-center
              gap-10 sm:gap-20 md:gap-28
              animate-marquee
              px-24 sm:px-32 md:px-40
            "
          >
            {countries.concat(countries).map((item, index) => (
              <CountryCard key={index} {...item} />
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}

function CountryCard({ image, name }) {
  return (
    <div className="flex flex-col items-center min-w-[110px] sm:min-w-[160px]">
      <div
        className="
          w-20 h-20
          sm:w-28 sm:h-28
          md:w-32 md:h-32
          rounded-full overflow-hidden
          shadow-md border bg-white
        "
      >
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover"
        />
      </div>

      <p className="mt-4 text-xs sm:text-sm font-semibold text-gray-600 tracking-wide uppercase">
        {name}
      </p>
    </div>
  );
}
