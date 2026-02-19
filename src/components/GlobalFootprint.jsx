import React from "react";

const exportData = [
  {
    region: "Africa",
    countries: ["South Africa", "Rwanda", "Ivory Coast", "Nigeria"],
  },
  {
    region: "Europe",
    countries: ["Georgia", "Albania", "Poland", "Moldova"],
  },
  {
    region: "Asia & Middle East",
    countries: [
      "Oman",
      "Yemen",
      "Tunisia",
      "Lebanon",
      "Bahrain",
      "Qatar",
      "Kuwait",
      "Saudi Arabia",
      "Uzbekistan",
      "Sri Lanka",
      "Jordan",
      "Iraq",
      "Nepal",
    ],
  },
  {
    region: "Latin America & Caribbean",
    countries: ["Dominican Republic", "Guatemala", "Peru", "Venezuela"],
  },
];

export default function GlobalFootprint() {
  return (
    <section className="w-full py-24 px-6 ">
      <div className="max-w-6xl mx-auto">
        {/* Title */}
        <h2 className="text-3xl md:text-4xl font-medium mb-14 leading-snug">
          Today, Laxriq Group exports to over{" "}
          <span className="italic">25+ countries</span>.
          <br />
          <span className="text-gray-600 text-xl">
            Our products cater to a wide range of international demands —
          </span>
        </h2>

        {/* Table Container */}
        <div className="relative  rounded-3xl px-6 md:px-10 py-10">
          {/* Vertical line before Countries */}
          <div className="absolute top-8 bottom-8 left-[30%] w-px bg-black/20" />

          {/* Vertical line after Countries */}
          <div className="absolute top-8 bottom-8 left-[80%] w-px bg-black/20" />

          {/* Header */}
          <div className="grid grid-cols-12 text-sm text-gray-600 pb-4 border-b border-black/10">
            <div className="col-span-3">Region</div>
            <div className="col-span-7 text-center">Countries</div>
            <div className="col-span-2 text-right">Count</div>
          </div>

          {/* Rows */}
          {exportData.map((item, index) => (
            <div
              key={index}
              className="grid grid-cols-12 py-8 border-b last:border-b-0 border-black/10 items-center"
            >
              {/* Region */}
              <div className="col-span-12 md:col-span-3 font-medium text-lg">
                {item.region}
              </div>

              {/* Countries */}
              <div className="col-span-12 md:col-span-7 text-center text-gray-700 leading-relaxed px-6 mt-2 md:mt-0">
                {item.countries.join(" • ")}
              </div>

              {/* Count */}
              <div className="col-span-12 md:col-span-2 text-right text-gray-700 mt-2 md:mt-0">
                {item.countries.length}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
