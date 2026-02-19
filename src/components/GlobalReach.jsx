import React, { useState } from "react";

const locations = [
  {
    id: 1,
    name: "Africa",
    subtitle: "Key Export Markets",
    description:
      "Serving South Africa, Rwanda, Ivory Coast, and Nigeria with premium tiles tailored for diverse climates and architectural styles.",
    image:
      "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?q=80&w=1200&auto=format&fit=crop",
    x: "52%",
    y: "58%",
  },
  {
    id: 2,
    name: "Europe",
    subtitle: "Design-Driven Demand",
    description:
      "Supplying Georgia, Albania, Poland, and Moldova with modern designs meeting strict European quality standards.",
    image:
      "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=1200&auto=format&fit=crop",
    x: "55%",
    y: "40%",
  },
  {
    id: 3,
    name: "Asia & Middle East",
    subtitle: "High-Performance Markets",
    description:
      "Active across Oman, Qatar, Saudi Arabia, Kuwait, UAE, Sri Lanka, Nepal, Jordan, Iraq and more — focused on durability and scale.",
    image:
      "https://images.unsplash.com/photo-1504274066651-8d31a536b11a?q=80&w=1200&auto=format&fit=crop",
    x: "68%",
    y: "48%",
  },
  {
    id: 4,
    name: "Latin America & Caribbean",
    subtitle: "Growing Presence",
    description:
      "Expanding footprint across Latin America & Caribbean with stylish and cost-efficient tile solutions.",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1200&auto=format&fit=crop",
    x: "35%",
    y: "60%",
  },
];

export default function GlobalReachWithMap() {
  const [active, setActive] = useState(locations[0]);

  return (
    <section className="w-full py-24 ">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <p className="text-sm uppercase tracking-widest text-gray-700 mb-4">
            Global reach, local strength.
          </p>
          <h2 className="text-4xl md:text-5xl font-bold text-[#1C1817] mb-4">
            Our Locations
          </h2>
          <p className="text-gray-600 text-lg">
            Today, Laxriq Group exports to over <b>25+ countries</b>, serving
            international markets with world-class tile solutions.
          </p>
        </div>

        {/* Map */}
        <div className="relative w-full max-w-5xl mx-auto">
          {/* World Map SVG */}
          <img
            src="https://framerusercontent.com/images/XfMPwYShQVcUs6Oyv76Tmkgw.svg"
            alt="World Map"
            className="w-full h-auto object-contain"
          />

          {/* Pins */}
          {locations.map((loc) => (
            <button
              key={loc.id}
              onClick={() => setActive(loc)}
              className={`absolute w-4 h-4 rounded-full border-2 transition duration-300
                ${
                  active.id === loc.id
                    ? "bg-orange-500 border-orange-500 scale-125"
                    : "bg-white border-gray-400 hover:scale-110"
                }`}
              style={{ left: loc.x, top: loc.y }}
              aria-label={loc.name}
            />
          ))}

          {/* Active Card */}
          {active && (
            <div
              className="absolute -translate-x-1/2 -translate-y-full mt-2 w-[300px] sm:w-[360px]
                         bg-white rounded-xl shadow-xl p-4 transition-all duration-300"
              style={{ left: active.x, top: active.y }}
            >
              <div className="overflow-hidden rounded-lg mb-3">
                <img
                  src={active.image}
                  alt={active.name}
                  className="w-full h-36 object-cover"
                />
              </div>

              <h4 className="text-base font-semibold text-[#1C1817] text-center">
                {active.name}
              </h4>
              <p className="text-sm text-gray-600 text-center mb-2">
                {active.subtitle}
              </p>
              <p className="text-xs text-gray-500 text-center leading-relaxed">
                {active.description}
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
