import React from "react";

export default function TestingAnalysis() {
  const tests = [
    {
      title: "Cell Grading",
      description:
        "Real-time monitoring of charge–discharge cycles to identify cell behavior, performance consistency, and failure patterns.",
      image: "https://backend.infinityenergy.xyz/uploads/media/technology_testing_1.webp",
    },
    {
      title: "Container Testing",
      description:
        "Multi-cycle validation of safety standards, communication reliability, and system-level control accuracy.",
      image: "https://backend.infinityenergy.xyz/uploads/media/technology_testing2.webp",
    },
    {
      title: "BMS Testing",
      description:
        "Detailed validation of voltage, temperature sensing, balancing logic, insulation, and protection mechanisms.",
      image: "https://backend.infinityenergy.xyz/uploads/media/technology_testing_3.webp",
    },
    {
      title: "Insulation Test",
      description:
        "Ensures electrical isolation integrity across battery packs to eliminate leakage paths and safety risks.",
      image: "https://backend.infinityenergy.xyz/uploads/media/technology_testing_4.webp",
    },
    {
      title: "Pack Grading",
      description:
        "Comprehensive pack-level testing covering capacity, voltage stability, safety thresholds, and cut-off limits.",
      image: "https://backend.infinityenergy.xyz/uploads/media/technology_testing_5.webp",
    },
    {
      title: "Environmental Testing",
      description:
        "Validates system reliability under extreme temperature, humidity, vibration, and pressure conditions.",
      image: "https://backend.infinityenergy.xyz/uploads/media/technology_testing_6.webp",
    },
    {
      title: "Pressure Leak Test",
      description:
        "Confirms sealed cooling systems to prevent coolant loss, overheating, and thermal management failures.",
      image: "https://backend.infinityenergy.xyz/uploads/media/technology_testing_7.webp",
    },
  ];

  return (
    <section className="py-24">
      <div className="max-w-7xl mx-auto">
        {/* Heading */}
        <h2 className="text-4xl font-semibold mb-16 text-center">
          Testing & Analysis
        </h2>

        {/* Items */}
        <div className="space-y-10">
          {tests.map((item, index) => (
            <div
              key={index}
              className="
                grid
                md:grid-cols-[280px_1fr]
                gap-8
                items-center
                p-6
                rounded-3xl
                shadow-md
                hover:shadow-lg
                transition-all
                bg-[#FFFAFA]
              "
            >
              {/* Image */}
              <div className="relative h-44 w-full rounded-2xl overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
                {/* Accent strip */}
                <div className="absolute inset-y-0 right-0 w-2 bg-blue-600" />
              </div>

              {/* Content */}
              <div>
                <h3 className="text-2xl font-semibold mb-3 text-gray-900">
                  {item.title}
                </h3>
                <p className="text-gray-600 leading-relaxed max-w-3xl">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
