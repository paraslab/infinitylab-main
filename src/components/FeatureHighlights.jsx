// FeatureHighlights.jsx
import React from "react";
import {
  FiShield,
  FiSettings,
  FiTrendingUp,
} from "react-icons/fi";

const features = [
  {
    title: "Reliability Boost",
    desc: "India's BESS: Ensuring uninterrupted power supply during grid failures.",
    icon: FiShield,
    float: "animate-float-slow",
  },
  {
    title: "Enhanced Resilience",
    desc: "Back-up power for outages and disaster scenarios.",
    icon: FiSettings,
    float: "animate-float-medium",
  },
  {
    title: "Improved Stability",
    desc: "Optimal power quality with reduced voltage & frequency deviations.",
    icon: FiTrendingUp,
    float: "animate-float-fast",
  },
];

export default function FeatureHighlights() {
  return (
    <section className="py-20 px-6">
      <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-12 text-center">
        {features.map((item, i) => {
          const Icon = item.icon;
          return (
            <div key={i} className="space-y-6">
              {/* Icon */}
              <div
                className={`
                  w-20 h-20 mx-auto
                  flex items-center justify-center
                  rounded-2xl
                  border border-emerald-400/40
                  ${item.float}
                `}
              >
                <Icon className="text-emerald-500 text-4xl" />
              </div>

              {/* Text */}
              <h3 className="text-xl font-semibold">
                {item.title}
              </h3>
              <p className="text-gray-600 max-w-sm mx-auto">
                {item.desc}
              </p>
            </div>
          );
        })}
      </div>

      {/* Animations */}
      <style>
        {`
          @keyframes floatSlow {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
          }
          @keyframes floatMedium {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-16px); }
          }
          @keyframes floatFast {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-22px); }
          }

          .animate-float-slow {
            animation: floatSlow 6s ease-in-out infinite;
          }
          .animate-float-medium {
            animation: floatMedium 4.5s ease-in-out infinite;
          }
          .animate-float-fast {
            animation: floatFast 3.5s ease-in-out infinite;
          }
        `}
      </style>
    </section>
  );
}
