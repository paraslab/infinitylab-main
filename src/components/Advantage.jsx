import React from "react";

export default function InfinityAdvantageGrid() {
  const items = [
    {
      title: "Modular BESS",
      desc1:
        "Infinity's Modular Cabinet configurations enable seamless scaling from kWh to MWh systems.",
      desc2:
        "These solutions offer superior efficiency, easy maintenance, and longer battery life.",
      image:
        "https://backend.infinityenergy.xyz/uploads/media/home_advantage_3.1.webp",
    },
    {
      title: "Thermal Management",
      desc1:
        "Designed specifically for Indian climate conditions using air and liquid cooling.",
      desc2:
        "Uniform heat dissipation improves performance and battery longevity.",
      image:
        "https://backend.infinityenergy.xyz/uploads/media/home_advantage_3.2.webp",
    },
    {
      title: "Smart Monitoring",
      desc1:
        "Advanced BMS enables real-time data tracking and intelligent alerts.",
      desc2:
        "Predictive analytics reduces downtime and maintenance costs.",
      image:
        "https://backend.infinityenergy.xyz/uploads/media/home_advantage_3.3.webp",
    },
    {
      title: "Long Cycle Life",
      desc1:
        "Optimized cell chemistry ensures extended charge-discharge cycles.",
      desc2:
        "Improves ROI with lower total cost of ownership.",
      image:
        "https://backend.infinityenergy.xyz/uploads/media/home_advantage_3.4.webp",
    },
  ];

  return (
    <section className="py-0 max-w-7xl mx-auto">
      <h2 className="text-center text-4xl font-bold  mb-16">
        The Infinity Advantage
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {items.map((item, index) => (
          <div
            key={index}
            className="
              group bg-[#FFFAFA] rounded-2xl p-8
              grid grid-cols-1 lg:grid-cols-2 gap-10
              transition-all duration-500 shadow-xl
              hover:shadow-2xl hover:-translate-y-1
            "
          >
            {/* TEXT */}
            <div className="flex flex-col justify-center">
              <h3 className="text-3xl font-bold  mb-6">
                {item.title}
              </h3>

              <p className="text-gray-700 leading-relaxed mb-4">
                {item.desc1}
              </p>

              <p className="text-gray-700 leading-relaxed">
                {item.desc2}
              </p>
            </div>

            {/* IMAGE */}
            <div className="relative overflow-hidden rounded-2xl h-[300px]">
              <img
                src={item.image}
                alt={item.title}
                className="
                  w-full h-full object-cover
                  transition-all duration-700 ease-out
                  group-hover:scale-110
                  group-hover:blur-sm
                "
              />

              <div className="
                absolute inset-0 bg-black/0
                group-hover:bg-black/20
                transition-all duration-700
              " />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
