"use client";
import { useState } from "react";

/**
 * Map marker positions are percentage-based
 * so they stay responsive on resize
 */
const LOCATIONS = [
  { name: "Los Angeles", x: 14, y: 42 },
  { name: "Perth", x: 78, y: 70 },
  { name: "Algeria", x: 47, y: 45 },
  { name: "Moscow", x: 58, y: 28 },
  { name: "Dublin", x: 45, y: 30 },
];

export default function InteractiveMap() {
  const [active, setActive] = useState(null);

  return (
    <section className="relative w-full flex justify-center py-24  overflow-hidden">
      <div className="relative max-w-6xl w-full">

        {/* MAP IMAGE */}
        <img
          src="https://framerusercontent.com/images/PWnXREm4A5XoIb4qE0hbX0hY3io.svg"
          alt="World Map"
          className="w-full h-auto select-none"
        />

        {/* MARKERS */}
        {LOCATIONS.map((loc, i) => (
          <div
            key={i}
            className="absolute"
            style={{
              left: `${loc.x}%`,
              top: `${loc.y}%`,
              transform: "translate(-50%, -50%)",
            }}
            onMouseEnter={() => setActive(i)}
            onMouseLeave={() => setActive(null)}
          >
            {/* TOOLTIP */}
            {active === i && (
              <div className="absolute -top-12 left-1/2 -translate-x-1/2 whitespace-nowrap">
                <div className="backdrop-blur-md bg-white/70 text-gray-900 px-4 py-1.5 rounded-full text-sm font-medium shadow-lg">
                  {loc.name}
                </div>
              </div>
            )}

            {/* PIN BUTTON */}
            <div className="relative w-11 h-11 rounded-full bg-[#e1fcad] shadow-[0_10px_40px_rgba(0,0,0,0.25)] flex items-center justify-center cursor-pointer transition-transform hover:scale-110">
              <span className="absolute w-4 h-4 rounded-full bg-[#1a2c30]" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
